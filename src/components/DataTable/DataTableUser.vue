<template>
    <button class="btn btn-circle btn-ghost" @click="setUser()">
        <Icon icon="material-symbols:info" class="text-3xl m-2 text-primary"></Icon>
    </button>
</template>
  
<script setup>
import { usetableStore } from '@/store/tableStore';
import { Icon } from '@iconify/vue';

const props = defineProps(['model', 'prop']);
const store = usetableStore()

const setUser = () => {
    store.id = 1
    store.data = props.model
}
</script>

