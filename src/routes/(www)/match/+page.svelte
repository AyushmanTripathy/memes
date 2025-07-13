<script lang="ts">
  import Button from "$lib/components/Button.svelte";
  import { getUserState, type UserDoc } from "$lib/store/user-state.svelte";
  import { LoaderCircle, Search } from "@lucide/svelte";
  import { onMount } from "svelte";

  const userState = getUserState();

  let friends = $state<UserDoc[]>([]);
  let errorCode = $state("");
  let loading = $state(true);

  async function matchForFriends() {
    try {
      loading = true;
    } catch (e: any) {
      console.error("while matching", e);
    } finally {
      loading = false;
    }
  }

  onMount(matchForFriends);
</script>

<div class="flex gap-2 flex-col justify-center items-center">
  {#if errorCode == "auth/popup-blocked"}
    Signup popup was blocked

    <Button onclick={matchForFriends}>
      <Search /> Retry
    </Button>
  {:else if loading}
    <LoaderCircle class="animate-spin" />
    <h1>Let me cook...</h1>
  {:else}
    <!-- display friends -->
    {#each friends as user}
      <div>
        <img
          class="h-10 w-10 rounded-full bg-white"
          src={user?.photoURL}
          alt="{user.name}'s profile photo"
        />
      </div>
    {:else}
      <p class="text-center w-[80%]"> No one found 😥, You probably should watch more memes. </p>
      <Button href="/"> More memes </Button>
    {/each}
  {/if}
</div>
