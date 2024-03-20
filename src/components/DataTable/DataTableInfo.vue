<template>
  <div>
    <button class="btn btn-circle btn-ghost p-0 m-0" @click="setVal()">
      <div data="example" column="exampleColumn" rowIndex="exampleIndex">
        <Icon icon="material-symbols:info" class="text-3xl text-primary"></Icon>
      </div>
    </button>
  </div>
</template>
  
  
<script setup>
import { usetableStore } from '@/store/tableStore';
import { Icon } from '@iconify/vue';

const props = defineProps(['model', 'prop']);
const store = usetableStore()

const setVal = () => {
  store.id = 1
  store.data = props.model
}
</script>

