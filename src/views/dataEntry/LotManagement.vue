<template>
    <defaultLayout>
        <MCModal :modal-open="infoModal" :modal-text="infoModalText" :modal-title="infoModalTitle"
            :toggle-modal="() => { infoModal = !infoModal; }" class="text-xl">
            <div class="float-right">
                <button class=" m-2 btn btn-primary" @click="infoModal = false">
                    Cancelar
                </button>
                <button class="m-2 btn btn-error" @click="deleteFunction()">
                    Eliminar
                </button>
            </div>
        </MCModal>
        <div class="h-auto ">
            <Breadcrumbs />
            <div>
                <h1 class="text-2xl p-2">Lotes</h1>
            </div>
            <div class="flex gap-2 m-2 max-w-full">
                <div v-if="currentLot == null" class="fadeRight w-full">
                    <DataTable :btnCols="false" :btnExport="false" :rows="lots" :cols="headerLots" :loading="loading" @update-filters="updateFiltersLot">
                        <template #table_options >
                            <h2 class="text-xl p-2 bg-neutral text-neutral-content p-2 rounded-xl">Lotes Disponibles
                            </h2>
                        </template>
                    </DataTable>
                </div>
                <div class="bg-base-300 basis-1/3 rounded-xl fadeRight " v-else>
                    <lotEdit :lot="currentLot" :clearLot="() => { currentLot = null; fetchResources() }" />
                </div>
                <div v-if="currentLot != null" class="fadeLeft" style="max-width: 66%;">
                    <DataTable v-if="recordsFromLot != null" class="w-full" :rows="recordsFromLot"
                        :cols="headersRecords" :loading="loading" @updateFilters="updateFiltersRecords">
                        <template #table_options>
                        </template>
                    </DataTable>
                </div>
            </div>

        </div>
    </defaultLayout>
</template>

<script setup>
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import MCModal from '@/components/Modals/MCModal.vue';
import lotEdit from '@/components/CRUDs/LotEdit.vue';
import DataTableCheckbox from '@/components/DataTableUI/DataTableCheckbox.vue';
import DataTableInfo from '@/components/DataTableUI/DataTableInfo.vue';
import { VGridVueTemplate } from '@revolist/vue3-datagrid';
import DataTable from '@/components/Spreadsheet/DataTable.vue';
import { onMounted, ref, watch } from 'vue';
import defaultLayout from '@/layouts/defaultLayout.vue';
import { getRecordsInfo } from '@/services/records'
import { getLots, popRecordFromLot } from '@/services/lots'
import { usetableStore } from '@/store/tableStore';
import { notificationsStore } from '@/store/notificationsStore';

const infoModal = ref(false)
const infoModalText = ref('')
const infoModalTitle = ref('')
const deleteFunction = ref(() => { })
const lots = ref([])
const loading = ref(true)
const lotStore = usetableStore()
const notiStore = notificationsStore()
const currentLot = ref(null)
const recordsFromLot = ref(null)
const recordFromLot = ref(null)
let filtersLot = []
let filtersLotRecords = []

const headerLots = [
    { prop: 'lot_key', pin: 'colPinStart', name: 'Lote', valType: 'text' },
    { prop: 'status', name: 'Activo', valType: 'bool', cellTemplate: VGridVueTemplate(DataTableCheckbox), readonly: true },
    { prop: 'total_records', name: 'Expedientes en el lote', valType: 'number', size: 200, readonly: true },
    { prop: 'date_assigned', name: 'Fecha Asignacion', valType: 'date', size: 200, readonly: true },
    { prop: 'date_departure', name: 'Fecha Salida', valType: 'date', size: 200, readonly: true },
    { prop: 'date_return', name: 'Fecha retorno', valType: 'date', size: 200, readonly: true },
    { name: 'Info', cellTemplate: VGridVueTemplate(DataTableInfo), pin: 'colPinEnd', readonly: true, size: 75 },
]

const headersRecords = [
    { prop: 'record_key', name: 'ID Expediente', pin: 'colPinStart', valType: 'number', size: 100 },
    { prop: 'id_provider', name: 'Prestador', valType: 'number', size: 150, readonly: true },
    { prop: 'business_name', name: 'Razon Social', valType: 'text', size: 200, readonly: true },
    { prop: 'assigned', name: 'Asignado', valType: 'bool', cellTemplate: VGridVueTemplate(DataTableCheckbox), readonly: true },
    { prop: 'coorinator_number', name: 'Coordinador', valType: 'number', size: 150, readonly: true },
    { prop: 'lot_user', name: 'Auditor', valType: 'text', size: 200, readonly: true },
    { prop: 'record_total', name: 'Monto Total', valType: 'number' },
    { prop: 'date_entry_digital', name: 'Fecha Digital', valType: 'date', size: 150 },
    { prop: 'date_entry_physical', name: 'Fecha Fisico', valType: 'date', size: 150 },
    { prop: 'seal_number', name: 'Nro Precinto', valType: 'number' },
    { prop: 'observation', name: 'Observacion', valType: 'text', size: 300 },
]

const updateFiltersLot = (appliedFilters) => {
    filtersLot = appliedFilters;
    fetchResources()
}

const updateFiltersRecords = (appliedFilters) => {
    filtersLotRecords = appliedFilters;
    fetchResourcesFromLot()
}

const fetchResourcesFromLot = async () => {
    loading.value = true
    const { data } = await getRecordsInfo(filtersLotRecords, currentLot.value.id)
    recordsFromLot.value = data.data
    console.log(data)
    setTimeout(() => {
        loading.value = false
    }, 500)
}


const fetchResources = async () => {
    loading.value = true
    const { data } = await getLots(filtersLot)
    lots.value = data.data
    setTimeout(() => {
        loading.value = false
    }, 500)
}

const removeRecordFromLot = async () => {
    const { data } = await popRecordFromLot(recordsFromLot.value)
    if (data.success) {
        fetchResourcesFromLot()
        notiStore.newMessage('Valor eliminado correctamente', true)

    } else {
        notiStore.newMessage(data.error, false)
    }
    infoModal.value = false
}

onMounted(() => {
    fetchResources()
})

watch(
    () => lotStore.id,
    async (newValue) => {
        if (newValue != -1) {
            if (newValue == 1) {
                currentLot.value = lotStore.data
                await fetchResourcesFromLot()
                lotStore.$reset()
            }
            if (newValue == 2) {
                recordFromLot.value = lotStore.data
                infoModalText.value = 'Estas Seguro que quiere eliminar el expediente ' + lotStore.data.id_record + ' ?' + '\n' + ''
                infoModalTitle.value = 'Eliminar expediente ' + lotStore.data.id_record + ' del Lote ' + lotStore.data.lot_key
                infoModal.value = true
                deleteFunction.value = removeRecordFromLot
                lotStore.$reset()
            }
        }
    }
);
</script>
