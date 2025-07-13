<script lang="ts">
  import Button from "$lib/components/Button.svelte";
  import { getFirebaseState } from "$lib/firebase";
  import { LoaderCircle } from "@lucide/svelte";
  import {
    addDoc,
    collection,
    doc,
    getDoc,
    getFirestore,
    setDoc,
  } from "firebase/firestore";
  import { GET } from "$lib/utils";
  import { onMount } from "svelte";

  let loading = $state(true);
  let result = $state<Record<string, any>>({});

  let metadata = $state({
    count: 0,
    lastAddedIndex: 0,
    addedUrls: []
  });
  $inspect("metadata", metadata)

  const firebaseState = getFirebaseState();
  const db = getFirestore(firebaseState.app);
  const metadataDocRef = doc(db, "memes", "metadata");

  async function updateMemes() {
    try {
      loading = true;
      const presentUrlSet = new Set(metadata.addedUrls)

      const { memes, count } = await GET(
        fetch,
        "https://meme-api.com/gimme/20",
      );

      let newMemeCount = 0
      const db = getFirestore(firebaseState.app);

      for (let index = 0; index < memes.length; index++) {
        const meme = memes[index];
        if (presentUrlSet.has(meme.url)) {
          console.log("skipping", meme.title)
          continue
        }

        const docRef = await addDoc(collection(db, "memes"), {
          title: meme.title,
          index: newMemeCount + metadata.lastAddedIndex,
          subreddit: meme.subreddit,
          description: "",
          url: meme.url,
          nsfw: meme.nsfw || false,
        });
        presentUrlSet.add(meme.url)
        newMemeCount++

        console.log("Document written with ID: ", docRef.id);
      }

      metadata.lastAddedIndex += newMemeCount;
      metadata.count += newMemeCount;
      metadata.addedUrls = [...presentUrlSet]

      await setDoc(metadataDocRef, { ...metadata });

      result = {
        success: true,
        count,
      };
    } catch (e) {
      console.error(e);
    } finally {
      loading = false;
    }
  }

  onMount(async () => {
    try {
      const metadataDoc = await getDoc(metadataDocRef);
      const docData = metadataDoc.data();

      console.log("doc data", docData);
      if (docData) metadata = docData;
      else {
        await setDoc(metadataDocRef, { ...metadata });
      }
    } finally {
      loading = false;
    }
  });
</script>

<div class="flex gap-2 flex-col justify-center items-center w-full h-full">
  {#if loading}
    <LoaderCircle class="animate-spin" />
    <p>Let me cook</p>
  {:else}
    Total no of memes: {metadata.count}
    <Button onclick={updateMemes}>Upload new memes</Button>
    <Button href="/" onclick={updateMemes}> Go back to memes </Button>
  {/if}
</div>
