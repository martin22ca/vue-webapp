<template>
    <div class="text-center">
        <span v-if="model[prop] === undefined"/>
        <div v-else>
            <Icon :icon="model[prop] != null ? 'mdi:checkbox-marked' : 'mdi:checkbox-blank'"
                :class="'text-4xl m-auto ' + (model[prop] != null ? 'text-success':'text-neutral-content')">
            </Icon>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue';
import { ref } from 'vue';

const props = defineProps(['model', 'prop']);
</script>

<style scoped>
.dialog-background {
    background-color: oklch(var(--b1)/.8);
}
</style>