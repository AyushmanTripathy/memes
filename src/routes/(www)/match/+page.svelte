<script lang="ts">
  import Button from "$lib/components/Button.svelte";
  import { getUserState, type UserDoc } from "$lib/store/user-state.svelte";
  import { LoaderCircle, Search } from "@lucide/svelte";
  import { collection, getDocs, query } from "firebase/firestore";
  import { onMount } from "svelte";
  import { derived } from "svelte/store";

  const userState = getUserState();
  const userDoc = $derived(userState.userDoc) as UserDoc;
  $inspect("user doc", userState.userDoc);

  interface FriendDoc extends UserDoc {
    score: number;
  }

  let friends = $state<FriendDoc[]>([]);
  $inspect("friends", friends);
  let errorCode = $state("");
  let loading = $state(true);

  const sl1 = $derived(new Set(userDoc?.liked || []));
  const sd1 = $derived(new Set(userDoc?.disliked || []));
  const s1 = $derived(sl1.union(sd1));

  function getScore(l2: number[], d2: number[]) {
    const sl2 = new Set(l2),
      sd2 = new Set(d2);
    const s2 = sl2.union(sd2);

    const num = sl1.intersection(sl2).size + sd1.intersection(sd2).size;
    const den = s2.intersection(s1).size;
    return num / den;
  }

  async function matchForFriends() {
    try {
      loading = true;
      if (
        !Number(userDoc?.liked?.length + userDoc?.disliked?.length) ||
        userDoc?.liked?.length + userDoc?.disliked?.length < 5
      )
        return;

      const q = query(collection(userState.db, "users"));
      const snapshot = await getDocs(q);
      snapshot.forEach((doc) => {
        const otherDoc = doc.data() as UserDoc;
        if (otherDoc.uid == userDoc.uid) return;

        friends.push({
          ...otherDoc,
          score: getScore(otherDoc.liked, otherDoc.disliked),
        });
      });
      friends = friends.sort((a, b) => b.score - a.score).slice(0, 10);
    } catch (e: any) {
      console.error("while matching", e);
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    setTimeout(matchForFriends, 1000);
    matchForFriends;
  });
</script>

{#if loading}
  <div class="flex gap-2 flex-col justify-center items-center">
    <LoaderCircle class="animate-spin" />
    <h1>Let me cook...</h1>
  </div>
{:else if !friends.length}
  <div class="flex gap-2 flex-col justify-center items-center">
    <p class="text-center w-[80%]">
      No one found 😥, You probably should watch more memes.
    </p>
    <Button href="/">More memes</Button>
  </div>
{:else}
  <div class="grid gap-y-3">
    <!-- display friends -->
    {#each friends as friend}
      <div class="flex gap-2 justify-start items-center">
        <img
          class="h-10 w-10 rounded-full bg-white"
          src={friend?.photoURL}
          alt="{friend.name}'s profile photo"
        />
        <div>
          <h1>{friend.name}</h1>
          <p class="text-sm">Match percentage: {Math.floor(friend.score * 10000) / 100}%</p>
        </div>
      </div>
    {/each}
  </div>
{/if}
