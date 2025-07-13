<script lang="ts">
  import { getUserState } from "$lib/store/user-state.svelte";
  import { LoaderCircle, LogIn, Search, Upload } from "@lucide/svelte";
  import "../app.css";
  import Button from "$lib/components/Button.svelte";

  const userState = getUserState();
  let { children } = $props();
</script>

<main
  class="flex relative text-gray-100 items-center overflow-hidden justify-center bg-black w-screen h-screen"
>
  <div
    class="absolute flex backdrop-blur-md px-2 md:px-10 py-10 justify-between items-center z-10 top-0 left-0 right-0 h-12"
  >
    <a
      href="/update-memes"
      class="h-10 w-10 rounded-full flex justify-center items-center"
    >
      <Upload />
    </a>

    {#if userState?.user}
      <Button
        href="/match"
        disabled={userState.loading}
        class="flex justify-center items-center"
      >
        Match Meme Taste
      </Button>
    {/if}

    <button
      onclick={() => (userState?.user ? userState.logout() : userState.login())}
      class="flex justify-center items-center"
      disabled={userState.loading}
    >
      {#if userState.loading}
        <LoaderCircle class="animate-spin" />
      {:else if userState?.user?.uid}
        <img
          class="h-10 w-10 rounded-full bg-white"
          src={userState.user?.photoURL}
          alt="Profile"
        />
      {:else}
        <LogIn />
      {/if}
    </button>
  </div>
  {@render children()}
</main>
