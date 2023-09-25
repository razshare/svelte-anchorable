# svelte-anchorable

Create svelte stores and sync thier values with `location.hash`.


Install with 
```sh
npm i -D svelte-anchorable
```

and use like so

```js
// store_show_description.js

import { anchorable } from 'svelte-anchorable';

export let store_show_description = anchorable('store_show_description', false);
```

```svelte
<script>
	import { store_show_description } from '$lib/store_show_description.js';

	setTimeout(function () {
		$store_show_description = true;
	}, 2000);
</script>

<h1>Welcome to your library project</h1>
{#if $store_show_description}
	<p>Create your package using @sveltejs/package and preview/showcase your work with SvelteKit</p>
	<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
{/if}
```

You're not limited to primitives, you can serialize whole objects

```svelte
<script>
	import { store_show_description } from '$lib/store_show_description.js';

	setTimeout(function () {
		$store_show_description = {
            title: "this is a description",
            content: "hello from description"
        };
	}, 2000);
</script>

<h1>Welcome to your library project</h1>
{#if $store_show_description}
	<h3>{$store_show_description.title}</h3>
	<p>{$store_show_description.content}</p>
{/if}
```