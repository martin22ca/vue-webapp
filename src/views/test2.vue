<template>
  <div class="h-screen flex flex-col">  
    <UniverSheet  class="w-full" id="sheet" :loading="loading" ref="univerRef" :cols="headers" :rows="providers" />
  </div>
</template>

<script setup>
import { getProviders } from '@/services/providers';
import UniverSheet from '@/components/Spreadsheet/UniverSheet.vue'
import { onMounted, ref } from 'vue';

const headers = [
  { prop: 'id_provider', name: 'ID', editor: 'number', pin: 'colPinStart', autoSize: true, valType: 'number', editable: false },
  { prop: 'coordinator_number', name: 'Coordinador', autoSize: true, valType: 'number', editable: false },
  { prop: 'cuit', name: 'CUIT', valType: 'string' },
  { prop: 'business_name', name: 'Razon Social', editor: 'text', size: 200, valType: 'string', editable: false },
  { prop: 'business_location', name: 'Locaclidad', size: 200, valType: 'string', editable: false, filter: 'string' },
  { prop: 'sancor_zone', name: 'Zona Sancor', size: 200, valType: 'string', editable: false },
  { prop: 'observation', name: 'Observacion', size: 200, valType: 'string', editable: false },
  { prop: 'status', name: 'Prioridad', size: 100, valType: 'number', editable: false },
  { prop: 'id_particularity', name: 'Particularidad',  size: 100, valType: 'number' },
  { prop: { 'info': 1 }, name: 'Acciones', readonly: true, size: 150 },
]

const loading = ref(true)
const providers = ref([])
const univerRef = ref(null);

const fetchResources = async () => {
    const { data } = await getProviders([])
    setTimeout(() => {
        loading.value = false
        providers.value = data
    }, 1000)

}
onMounted(()=>{
  fetchResources()
})
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
}

#app {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

#sheet {
  /** The height of the Union uses the height of the parent container */
  flex: 1;
}
</style>