<template>
    <div>
        <div class="label">
            <span class="label-text flex-row flex ">
                <Icon :icon="props.textIcon"  class="mx-2 text-2xl text-neutral-content bg-neutral rounded " />{{ props.textLabel }}
            </span>
        </div>
        <slot></slot>
        <div class="label">
            <span class="label-text-alt text-error pt-1"  id="error-text">{{ props.textError }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
const props = defineProps({
    textIcon: { default: 'icon-park-outline:edit-name', type: String },
    textLabel: { default: 'Input', type: String },
    textError: { default: '', type: String },
});
</script>

<style>
#text-error {
  opacity: 0;
}

/* Define animation */
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Apply animation to the error text */
#text-error {
  animation: fade-in 0.5s ease-in-out forwards;
}
</style>