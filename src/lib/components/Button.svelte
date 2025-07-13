<script lang="ts">
  import { goto } from "$app/navigation";
  import type { HTMLButtonAttributes } from "svelte/elements";

  interface Props extends HTMLButtonAttributes {
    href?: string;
  }
  const { ...props }: Props = $props();
</script>

{#if props?.href}
  <button
    {...props}
    onclick={() => goto(props?.href)}
    class="cursor-pointer flex gap-2 bg-gray-900 p-3 rounded-2xl {props.class}"
  >
    {@render props?.children?.()}
  </button>
{:else}
  <button
    {...props}
    class="cursor-pointer flex gap-2 bg-gray-900 p-3 rounded-2xl {props.class}"
  >
    {@render props?.children?.()}
  </button>
{/if}
