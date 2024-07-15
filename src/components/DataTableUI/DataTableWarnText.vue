<template>
    <div class="text-center">
        <span v-if="model[prop] === undefined || model[prop] == null" class="badge badge-neurtal  p-2 ">
            No Existe
        </span>
        <div v-else>
            <span  class="badge badge-primary p-2 ">
                {{ model[prop] }}
            </span>
        </div>
    </div>
</template>

<script setup>
const props = defineProps(['model', 'prop','info']);


</script>

<style scoped>
.dialog-background {
    background-color: oklch(var(--b1)/.8);
}
</style>