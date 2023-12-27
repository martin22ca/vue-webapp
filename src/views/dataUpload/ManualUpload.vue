<template>
    <defaultLayout>
        <dialog class="modal" :open="modalVisible" style="background-color: oklch(var(--b3)/.8);">
            <div class="modal-box max-w-7xl bg-base-200">
                <form method="dialog">
                    <button @click="modalVisible = false; fetchResources()"
                        class="btn btn-sm btn-circle btn-error absolute right-2 top-2">✕</button>
                </form>
                <ModalUser v-if="modalVisible" :user="selectedUser" />
            </div>
        </dialog>
        <div class="bg-base-300 h-auto">
            <div class="text-sm breadcrumbs p-2">
                <ul>
                    <li><a>Home</a></li>
                    <li><a>Ingreso</a></li>
                    <li><a>Entrada Manual</a></li>
                </ul>
            </div>
            <div>
                <h1 class="text-2xl p-2">Entrada Manual</h1>
            </div>
            <DataTable :rows="recordsInfo" :cols="headers" :loading="loading" :columnTypes="columnTypes"
                @updateFilters="updateFilters">

            </DataTable>
        </div>
    </defaultLayout>
</template>


<script setup>
import { VGridVueTemplate } from '@revolist/vue3-datagrid';
import DataTableCheckbox from '@/components/DataTable/DataTableCheckbox.vue'
import Plugin from "@revolist/revogrid-column-date";
import DataTable from "@/components/DataTable/DataTable.vue";
import { getRecordsInfo } from '@/services/records'
import { ref, onMounted } from 'vue';
import defaultLayout from '@/layouts/defaultLayout.vue';

const headers = [
    { prop: 'id_record', name: 'Nro Expediente', pin: 'colPinStart', valType: 'number', size: 150, readonly: true },
    { prop: 'assigned', name: 'Asignado', valType: 'bool', cellTemplate: VGridVueTemplate(DataTableCheckbox), readonly: true },
    { prop: 'id_provider', name: 'Prestador', valType: 'number', size: 150, readonly: true },
    { prop: 'coorinator_number', name: 'Coordinador', valType: 'number', size: 150, readonly: true },
    { prop: 'id_lot', name: 'Nro Lote', valType: 'number', readonly: true },
    { prop: 'id_user', name: 'Usuario Asignado', valType: 'number',size:200 },
    { prop: 'record_total', name: 'Monto Total', valType: 'number' },
    { prop: 'date_assignment', name: 'date_assignment', valType: 'date', size: 150, columnType: 'date' },
    { prop: 'date_entry_digital', name: 'date_entry_digital', valType: 'date', size: 150, columnType: 'date' },
    { prop: 'date_entry_physical', name: 'date_entry_physical', valType: 'date', size: 150, columnType: 'date' },
    { prop: 'seal_number', name: 'Nro Precinto', valType: 'number' },
    { prop: 'observation', name: 'Observation', valType: 'text', size: 300 },
]
const columnTypes = { 'date': new Plugin() };
const loading = ref(true)
const recordsInfo = ref([])
const modalVisible = ref(false)
const selectedUser = ref(null)
let filters = []

const fetchResources = async () => {
    const { data } = await getRecordsInfo(filters)
    recordsInfo.value = data
    setTimeout(() => {
        loading.value = false
    }, 500)
}

onMounted(async () => {
    fetchResources()
})

const updateFilters = (appliedFilters) => {
    filters = appliedFilters;
    fetchResources()
}
</script>
