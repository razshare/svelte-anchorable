<script>
	import { store_show_description } from '$lib/store_show_description.js';

	setTimeout(function () {
		$store_show_description = {
			title: 'this is a description',
			content: 'this is the content of the description... hello from description'
		};
	}, 2000);
</script>

<h1>Welcome to your library project</h1>
{#if $store_show_description}
	<h3>{$store_show_description.title}</h3>
	<p>{$store_show_description.content}</p>
{/if}
