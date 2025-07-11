<script lang="ts">
  import "../app.css";
  let { children } = $props();
</script>

<main
  class="flex text-gray-100 items-center overflow-hidden justify-center bg-black w-screen h-screen"
>
  {@render children()}
</main>
