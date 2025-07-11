<script lang="ts">
  import { getUserState } from "$lib/store/user-state.svelte";
  import { onMount } from "svelte";

  const userState = getUserState();
  onMount(() => {
    console.log("ensuring login");
    userState.ensureLogin();
  });
  let { children } = $props();
</script>

{@render children()}
