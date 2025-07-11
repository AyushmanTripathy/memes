<script lang="ts">
	import '../app.css';
  import { setFirebaseState } from "$lib/firebase"
  import { getUserState } from "$lib/store/user-state.svelte";
    import { onMount } from 'svelte';
	
  const userState = getUserState();
  onMount(() => {
    console.log("ensuring login")
    userState.ensureLogin()
  })
	let { children } = $props();
</script>

<main class="flex text-gray-100 items-center overflow-hidden justify-center bg-black w-screen h-screen">
  {@render children()}
</main>
