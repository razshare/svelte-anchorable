# svelte-anchorable

Create svelte stores and sync thier values with `location.hash`.


Install with 
```sh
npm i -D svelte-anchorable
```

and use like so

```js
// $lib/store_show_description.js

import { anchorable } from 'svelte-anchorable';

export let store_show_description = anchorable('store_show_description', false);
```

```svelte
<script>
// +page.svelte
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
![Peek 2023-09-26 01-57](https://github.com/tncrazvan/svelte-anchorable/assets/6891346/3721003e-66f9-4c0a-ba76-5bb3d0d09a50)



You're not limited to primitives, you can serialize whole objects

```svelte
<script>
// +page.svelte
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
![Peek 2023-09-26 01-55](https://github.com/tncrazvan/svelte-anchorable/assets/6891346/e8faeebd-37e1-4770-9b9e-f7137d9840b7)


