<template>
    <div>
        <Autocomplete class="m-2" :is-component="false" :items="items" key-prop="id" text-prop="user_name" :defaultValue="model[prop]" :addval="getVal"/>
    </div>
</template>


<script setup>
import Autocomplete from '../Autocomplete.vue';
import { onMounted } from 'vue';
import { usetableStore } from '@/store/tableStore';

const store = usetableStore()
const items = store.initData
const props = defineProps(['model', 'prop']);
var infoValue = 1

onMounted(() => {
    if (props.prop != null) {
        infoValue = props.prop.info
    }
})

const getVal = (val) =>{
    console.log(val)
}
</script>