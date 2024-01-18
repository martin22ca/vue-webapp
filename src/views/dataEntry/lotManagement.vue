<template>
    <defaultLayout>
        <Toast :duration="1" :toastOpen="toastOpen" :toggleToast="() => { toastOpen = !toastOpen }" :toastText="toasText" />
        <div class="h-auto">
            <div class="text-sm breadcrumbs p-2">
                <ul>
                    <li><a>Home</a></li>
                    <li><a>Ingreso</a></li>
                    <li><a>Lotes</a></li>
                </ul>
            </div>
            <div>
                <h1 class="text-2xl p-2">Lotes</h1>
            </div>
            <div class="flex gap-2 m-2">
                <div class="flex gap-2 m-2">
                    <div class="basis-1/3">
                        <div class="grid-header">
                            <div class="grid-cell">Lote</div>
                            <div class="grid-cell">Activo</div>
                            <div class="grid-cell">Asignación</div>
                            <div class="grid-cell">Acciones</div>
                        </div>
                        <div v-for="lot in lots" class="grid-item p-2 ">
                            <div class="grid-cell">
                                <span>{{ lot.lot_key }}</span>
                            </div>
                            <div class="grid-cell">
                                <input type="checkbox" class="checkbox" v-model="lot.status" disabled>
                            </div>
                            <div class="grid-cell">
                                <span v-if="lot.date_asignment">{{ lot.date_asignment }}</span>
                                <span v-else>No Asigndo</span>
                            </div>
                            <div class="grid-cell">
                                <button class="btn btn-circle btn-primary m-1">
                                    <Icon icon="mdi:information-variant" class="text-2xl"></Icon>
                                </button>
                                <button class="btn btn-circle">
                                    <Icon icon="mdi:information-variant" class="text-2xl"></Icon>
                                </button>
                            </div>
                        </div>
                    </div>
                    <DataTable class="basis-1/3" :rows="lots" :loading="loading"></DataTable>
                </div>
            </div>

        </div>
    </defaultLayout>
</template>

<script setup>
import DataTable from '@/components/DataTable/DataTable.vue';
import Toast from '@/components/Toast.vue';
import { onMounted, ref } from 'vue';
import defaultLayout from '@/layouts/defaultLayout.vue';
import { getLots } from '@/services/lots'
import { Icon } from '@iconify/vue';

const toastOpen = ref(false)
const toasText = ref('')
const lots = ref([])
const loading = ref(true)
let filters = []


const fetchResources = async () => {
    const { data } = await getLots(filters)
    lots.value = data
    setTimeout(() => {
        loading.value = false
    }, 500)
}

onMounted(() => {
    fetchResources()
})
</script>


<style>
.grid-header {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    /* Adjust the gap as needed */
    padding: 10px;
    font-weight: bold;
    /* Optional: Make the header text bold */
    border: 1px solid #ccc;
    /* Optional: Add a border for better visualization */
}

.grid-item {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    /* Adjust the gap as needed */
    padding: 10px;
    border: 1px solid #ccc;
    /* Optional: Add a border for better visualization */
}

.grid-cell {
    padding: 5px;
}
</style>