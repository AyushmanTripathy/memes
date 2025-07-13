<script lang="ts">

  let { title, description, url, element = $bindable() } = $props()

</script>

<div
  class="w-full h-full absolute cursor-grab ease-in-out rounded-xl touch-none select-none bg-black"
  bind:this={element}
>
  {#key url}
    {#if url}
      <img
        class="w-full h-full rounded-xl object-contain"
        src={url}
        alt={title}
      />
    {/if}
  {/key}
  <div
    class="absolute p-4 bottom-0 inset-0 bg-gradient-to-t from-white/0 via-white/10 rounded-b-xl"
  ></div>
  <div class="p-4 absolute bottom-0 w-full flex justify-center">
    <div class="flex items-center flex-col">
      <h3 class="text-sm text-center md:text-base lg:text-3xl bg-black font-semibold px-3 py-1 rounded-2xl">{title}</h3>
      <p>{description}</p>
    </div>
  </div>
</div>
