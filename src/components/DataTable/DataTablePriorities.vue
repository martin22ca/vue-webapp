<template>
    <div class="text-center">
        <span v-if="model[prop] === undefined"/>
        <div v-else>
            <div v-if="model[prop] === null" class="bg-neutral text-neutral-content mx-8 my-2 rounded text-xl" >
                0
            </div>
            <div :class="'mx-8 my-2 rounded text-xl ' + (getStatusColor(model[prop]))">
                {{ model[prop] }}
            </div>
        </div>
    </div>
</template>

<script setup>
import {getPriorities} from '@/services/providers'
import { onMounted, ref } from 'vue';

const props = defineProps(['model', 'prop']);

const getStatusColor = (id) => {
    const colors = {
        1: "bg-red-500",
        2: "bg-orange-500"
    };

    return colors[id] || "bg-neutral"; // Default color
};

const fetchData = async ()=>{
    const {data} = await getPriorities()
    console.log(data)
}

</script>

<style scoped>
.dialog-background {
    background-color: oklch(var(--b1)/.8);
}
</style>