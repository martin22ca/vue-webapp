<template>
    <div v-if="!isTargetEmpty">
        <button class="btn btn-circle btn-ghost p-0 m-0" @click="changeVal()">
            <div data="example" column="exampleColumn" rowIndex="exampleIndex">
                <Icon icon="mdi:swap-horizontal" class="text-3xl text-primary"></Icon>
            </div>
        </button>
        <button class="btn btn-circle btn-ghost p-0 m-0" @click="popVal()">
            <div data="example" column="exampleColumn" rowIndex="exampleIndex">
                <Icon icon="mdi:trash-can" class="text-3xl text-error"></Icon>
            </div>
        </button>
    </div>
</template>


<script setup>
import { usetableStore } from '@/store/tableStore';
import { Icon } from '@iconify/vue';
import { computed, onMounted, toRaw } from 'vue';

const props = defineProps(['model', 'prop']);
const store = usetableStore()

var deleteValue = 2
var changeValue = 3

const changeVal = () => {
    store.id = changeValue
    store.data = props.model
}

const popVal = () => {
    store.id = deleteValue
    store.data = props.model
}

const isTargetEmpty = computed(() => {
    const rawTarget = toRaw(props.model); // Retrieve the original object from the proxy
    return (Object.keys(rawTarget).length === 0 && rawTarget.constructor === Object);
});


onMounted(() => {
    if (props.prop != null) {
        console.log(props.prop)
        deleteValue = props.prop[0]
        infoValue = props.prop[1]
    }
})
</script>