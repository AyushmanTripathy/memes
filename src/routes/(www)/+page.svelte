<script lang="ts">
  import CardSwiper from "$lib/components/CardSwiper.svelte";
  import { LoaderCircle } from "@lucide/svelte";
  import { getMemeState, type Meme } from "$lib/store/meme-state.svelte";
  import { onMount } from "svelte";

  const memeState = getMemeState();
  $inspect(memeState.memes);

  const memes: Record<number, Meme> = {};
  let loading = $state(false);

  const getCardData = async (index: number): Meme => {
    console.log(index, memes);
    if (index in memes) return memes[index];
    memes[index] = await memeState.fetchOne();
    return memes[index];
  };

  function onSwipe(cardInfo: any) {
    console.log("swiped", cardInfo);
  }

  onMount(async () => {
    try {
      const res = await memeState.fetchOne();
      console.log("called", res);
    } catch (e: any) {
    } finally {
      loading = false;
    }
  });
</script>

{#if loading}
  <div class="flex w-full h-full justify-center items-center flex-col">
    <LoaderCircle class="animate-spin" />
  </div>
{:else}
  <div class="md:w-2/3 xl:w-1/3 w-[90%] h-[90%]">
    <CardSwiper {onSwipe} cardData={getCardData} />
  </div>
{/if}
