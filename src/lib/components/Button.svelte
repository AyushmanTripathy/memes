<script lang="ts">
  import type { HTMLButtonAttributes } from "svelte/elements";

  const { ...props }: HTMLButtonAttributes = $props();
</script>

<button {...props} class="cursor-pointer flex gap-2 bg-gray-900 p-3 rounded-2xl {props.class}">
  {@render props?.children?.()}
</button>
