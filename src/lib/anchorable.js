/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { writable } from 'svelte/store';

/**
 * Serialize data.
 * @template T
 * @callback AnchorSerializer
 * @param {T} data data to serialize.
 * @returns {string} serialized data.
 */

/**
 * Unserialize data.
 * @template T
 * @callback AnchorableDeserializer
 * @param {string} data data to deserialize.
 * @returns {T} deserialized data.
 */

/**
 * Options for the store.
 * @template T
 * @typedef AnchorableOptions
 * @property {AnchorSerializer<T>} serialize a callback that manages conversion from {T} to {string}.
 * @property {AnchorableDeserializer<T>} deserialize a callback that manages conversion from {string} to {T}.
 */

function is_browser() {
	try {
		if (!window) {
			return false;
		}
	} catch (e) {
		return false;
	}

	return true;
}

const browser = is_browser();
let triggered_locally = false;

/**
 * @template T
 * @param {string} storeName
 * @param {T} store
 * @param {AnchorableOptions<T>} options
 * @returns {import('svelte/store').Writable<T>}
 */
export function anchorable(
	storeName,
	store,
	options = {
		serialize: (x) => JSON.stringify(x),
		deserialize: (x) => JSON.parse(x)
	}
) {
	sync();

	if ($values[storeName]) {
		try {
			store = options.deserialize($values[storeName]);
		} catch (e) {
			console.warn(e);
		}
	}
	const result = writable(store);
	result.subscribe(($result) => {
		if (triggered_locally) {
			triggered_locally = false;
			return;
		}
		if ($result === false || $result === null || $result === undefined) {
			set(storeName, '');
		} else {
			const serialized = options.serialize($result);
			set(storeName, serialized);
		}
	});

	let previous_value = '';
	let first_pass = true;

	values.subscribe(($values) => {
		if (first_pass) {
			first_pass = false;
			previous_value = $values[storeName];
			return;
		}

		if (previous_value !== $values[storeName]) {
			try {
				triggered_locally = true;
				result.set(
					options.deserialize($values[storeName] !== '' ? $values[storeName] ?? 'false' : 'false')
				);
			} catch (e) {
				triggered_locally = true;
				console.warn(e);
				result.set(options.deserialize('false'));
			}
		}
	});
	return result;
}

/**
 * @type {import('svelte/store').Writable<Record<string, any>>}
 */
const values = writable({});
/**
 * @type {Record<string, any>}
 */
let $values = {};

let last_update = 0;
if (browser) {
	values.subscribe((x) => ($values = x));
	window.addEventListener('hashchange', function () {
		const now = Date.now();
		const delta_last_update = (now - last_update) / 1000;
		if (delta_last_update < 100) {
			last_update = now;
			return;
		}
		sync();
	});
}

function sync() {
	if (!browser) {
		return;
	}
	const items = location.hash.replace(/^#/, '').split(/&/);

	/**
	 * @type {Record<string, any>}
	 */
	const result = {};
	for (const item of items) {
		const pieces = item.split(/=(.*)/, 2) ?? [];
		const key = pieces[0] ?? false;
		const value = pieces[1] ?? false;

		if (!key) {
			continue;
		}

		if (!value) {
			result[key] = true;
		}
		try {
			result[key] = decodeURI(value);
		} catch (e) {
			console.warn(e);
		}
	}

	values.set(result);
}

/**
 *
 * @param {string} key
 * @param {string} value
 */
function set(key, value) {
	if (!browser) {
		return;
	}

	$values[key] = value;
	values.set($values);

	const pieces = [];
	let found = false;
	for (const local_key in $values) {
		const local_value = $values[local_key];
		if (local_key !== key) {
			if (local_value === '') {
				continue;
			}
			pieces.push(`${local_key}=${local_value}`);
		} else {
			found = true;
			if (value === '') {
				continue;
			}
			pieces.push(`${key}=${value}`);
		}
	}

	if (!found) {
		if (value !== '') {
			pieces.push(`${key}=${value}`);
			$values[key] = value;
		}
		values.set($values);
	}

	const hash = `#${pieces.join('&')}`;
	if (hash.trim() === '#') {
		location.hash = '';
		return;
	}
	location.hash = hash;
}
