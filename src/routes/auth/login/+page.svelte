<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import Button from "$lib/components/Button.svelte";
  import { getUserState } from "$lib/store/user-state.svelte";
  import { LoaderCircle, LogIn, Redo, Redo2 } from "@lucide/svelte";

  let errorCode = $state<string | null>(null);
  let loading = $state(false);
  const userState = getUserState();

  const login = async () => {
    errorCode = null;
    loading = true;
    try {
      const result = await userState.login();
      if (!result) return;
      await goto(page.url.searchParams.get("redirect") || "/", { replaceState: true });
    } catch (e: any) {
      errorCode = e.code;
    } finally {
      loading = false;
    }
  };
</script>

<div class="flex gap-2 flex-col justify-center items-center">
  {#if errorCode == "auth/popup-blocked"}
    Signup popup was blocked

    <Button onclick={login}>
      <LogIn /> Retry
    </Button>
  {:else if loading}
    <LoaderCircle class="animate-spin" />
    <h1>Logging you in ...</h1>
  {:else}
    <Button onclick={login}>
      <LogIn /> Sign in with Google
    </Button>
  {/if}
</div>
