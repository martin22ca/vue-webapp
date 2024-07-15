<template>
    <div class="text-center">
        <span v-if="model[prop.prop] === undefined" />
        <div v-else>
            <div v-if="model[prop.prop] === null" class="bg-neutral text-neutral-content my-2 rounded-full text-xl">
                0
            </div>
            <div :class="'my-2 rounded-full text-xl ' + (getColorForPriority(model[prop.prop], prop.extra))">
                {{ model[prop.prop] }}
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps(['model', 'prop','info']);


function getColorForPriority(priority, max) {
    console.log(props.prop.prop)
    if (priority === 0 || priority === null) {
        return 'bg-neutral';
    }

    const colors = [
        'bg-green-300', 'bg-green-400', 'bg-green-500','bg-green-600',
        'bg-yellow-300', 'bg-yellow-400', 'bg-yellow-500','bg-yellow-600',
        'bg-orange-300', 'bg-orange-400', 'bg-orange-500','bg-orange-600',
        'bg-red-300', 'bg-red-400', 'bg-red-500', 'bg-red-600','bg-red-700',
    ];

    // Ensure priority is within bounds
    priority = Math.max(1, Math.min(priority, max));

    // If it's the max priority, return the darkest red
    if (priority === max) {
        return 'bg-red-700';
    }

    // Calculate the index in the colors array
    const index = Math.floor((priority - 1) / (max - 1) * (colors.length - 1));
    return colors[index];
}



</script>

<style scoped>
.dialog-background {
    background-color: oklch(var(--b1)/.8);
}
</style>