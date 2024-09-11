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
        <h3 class="m-2 bg-neutral text-neutral-content rounded-xl px-2">Lotes</h3>
        <div class="flex gap-2 mx-2 max-w-full h-full">
            <DataTable v-if="currentLot == null" class="fadeRight w-full" :btnCols="false" :btnExport="false"
                :rows="lots" :cols="headerLots" :loading="loading" @update-filters="updateFiltersLot">
                <template #table_options>
                    <h2 class="text-xl p-2 bg-neutral text-neutral-content p-2 rounded-xl">Lotes Disponibles
                    </h2>
                </template>
            </DataTable>
            <lotEdit v-else class="rounded-xl fadeRight" style="width: 30%" :lot="currentLot"
                :clearLot="() => { currentLot = null; fetchResources() }" :users="auditors"
                :edited-records="editedRecords" />
            <UniverSheet v-if="recordsFromLot != null && currentLot != null" class="w-full fadeLeft" style="width: 70%;"
                :rows="recordsFromLot" :cols="headersRecords" :loading="loading" @updateFilters="updateFiltersRecords"
                @update-a-p-i="updateAPI" @update-cols-reference="updateColsReference">
                <template #table_options>
                    <button v-if="!isEmpty(editedRecords)" class="fadeRight btn btn-error mx-2"
                        @click="fetchResourcesFromLot()">
                        <Icon icon="mdi:delete" class="text-xl text-neutral" />
                    </button>
                </template>
            </UniverSheet>
        </div>
    </defaultLayout>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import MCModal from '@/components/Modals/MCModal.vue';
import lotEdit from './LotEdit.vue';
import { getUsersByRole } from '@/services/users'
import DataTableCheckbox from '@/components/DataTableUI/DataTableCheckbox.vue';
import DataTableInfo from '@/components/DataTableUI/DataTableInfo.vue';
import { VGridVueTemplate } from '@revolist/vue3-datagrid';
import UniverSheet from '@/components/Spreadsheet/UniverSheet.vue'
import DataTable from '@/components/Spreadsheet/DataTable.vue';
import { computed, onBeforeMount, onMounted, ref, watch } from 'vue';
import { FUniver, FWorksheet } from "@univerjs/facade";
import { ICommandInfo, ICellData } from '@univerjs/core'
import defaultLayout from '@/layouts/defaultLayout.vue';
import { getRecordsInfo } from '@/services/records'
import { getLots, popRecordFromLot } from '@/services/lots'
import { usetableStore } from '@/store/tableStore';
import { getRow, isEmpty } from '@/utils/spreadsheet/generic'
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
let filtersLot = []
let filtersLotRecords = []

const auditors = ref([])
const univerAPI = ref<FUniver>(null);
const activeSheet = ref<FWorksheet>(null);
const editedRecords = ref({})
const colsReference = ref({})

const getAuditors = computed(() => {
    return auditors.value.length > 0
        ? auditors.value.map(u => u.user_name)
        : []
})

const headerLots = [
    { prop: 'lot_key', pin: 'colPinStart', name: 'Lote', size: 200, valType: 'text' },
    { prop: 'status', name: 'Activo', valType: 'bool', cellTemplate: VGridVueTemplate(DataTableCheckbox), readonly: true },
    { prop: 'total_records', name: 'Expedientes en el lote', valType: 'number', size: 250, readonly: true },
    { prop: 'date_departure', name: 'Fecha Salida', valType: 'date', size: 200, readonly: true },
    { prop: 'date_return', name: 'Fecha retorno', valType: 'date', size: 200, readonly: true },
    { prop: 'observation', name: 'Observacion', valType: 'text', size: 350, readonly: true },
    { name: 'Info', cellTemplate: VGridVueTemplate(DataTableInfo), pin: 'colPinEnd', readonly: true, size: 75 },
]

const headersRecords = [
    { prop: 'record_key', name: 'ID Expediente', pin: 'colPinStart', valType: 'number', size: 100, readonly: true },
    { prop: 'id_provider', name: 'Prestador', valType: 'number', size: 150, readonly: true },
    { prop: 'business_name', name: 'Razon Social', valType: 'text', size: 200, readonly: true },
    { prop: 'assigned', name: 'Asignado', valType: 'bool', readonly: true },
    { prop: 'lot_key', name: 'Lote', valType: 'string', readonly: false },
    { prop: 'date_assignment_audit_formatted', name: 'Fecha Asignacion Aud.', valType: 'date', size: 230, readonly: false },
    { prop: 'user_name', name: 'Auditor', valType: 'text', size: 300, readonly: false, colType: 'dropdown', colTypeValues: getAuditors },
    { prop: 'coorinator_number', name: 'Coordinador', valType: 'number', readonly: true },
    { prop: 'record_total', name: 'Monto Total', valType: 'number', readonly: true },
    { prop: 'date_entry_digital_formatted', name: 'Entrada Digital', valType: 'date', size: 150, readonly: true },
    { prop: 'date_entry_physical_formatted', name: 'Entrada Fisico', valType: 'date', size: 150, readonly: true },
    { prop: 'seal_number', name: 'Nro Precinto', valType: 'number', size: 150, readonly: true },
    { prop: 'observation', name: 'Observacion', valType: 'text', size: 300, readonly: true },
]

const updateFiltersLot = (appliedFilters) => {
    filtersLot = appliedFilters;
    fetchResources()
}

const updateFiltersRecords = (appliedFilters) => {
    filtersLotRecords = appliedFilters;
    fetchResourcesFromLot()
}

const updateColsReference = (reference) => {
    colsReference.value = reference;
}

const updateAPI = (UniverAPI: FUniver) => {
    univerAPI.value = UniverAPI
    activeSheet.value = univerAPI.value.getActiveWorkbook().getActiveSheet() as FWorksheet;

    univerAPI.value.onBeforeCommandExecute(async (command) => {
        // PRESSED DELETE ON RANGE
        if (command.id === 'sheet.command.clear-selection-content') {
            activeSheet.value.getSelection().getActiveRange().forEach((row: number, col: number, cell: ICellData) => {
                if (cell.v == undefined || cell.v == '') return
                holdTableChanges(col, row, null)
            })
        }
    })
    univerAPI.value.onCommandExecuted(async (command: ICommandInfo) => {
        // EXIT EDIT ON CELL
        if (command.id === 'sheet.command.set-range-values') {
            const sr = command.params['range']['startRow']
            const sc = command.params['range']['startColumn']
            const er = command.params['range']['endRow']
            const ec = command.params['range']['endColumn']
            activeSheet.value.getRange(sr, sc, ec - sc + 1, er - sr + 1).forEach(async (row: number, col: number, cell: ICellData) => {
                holdTableChanges(col, row, cell.v)
            })
        }
        if (command.id === 'sheet.command.paste-bu-short-key') {
            activeSheet.value.getSelection().getActiveRange().forEach(async (row: number, col: number, cell: ICellData) => {
                holdTableChanges(col, row, cell.v)
            })
        }
    })
}

const holdTableChanges = (col: number, row: number, newCellVal: any) => {
    const index = colsReference.value[col]
    const header = headersRecords.find((element) => element.prop == index);
    if (header.readonly) {
        univerAPI.value.executeCommand('univer.command.undo')
        return true
    }
    const fullRow = getRow(activeSheet.value, row, colsReference.value)
    let record_key = fullRow['record_key']
    if (record_key == undefined) return true
    record_key = String(record_key)
    if (record_key in editedRecords.value) {
        editedRecords.value[record_key][index] = newCellVal
    } else {
        editedRecords.value[record_key] = {}
        editedRecords.value[record_key][index] = newCellVal
    }
    console.log(editedRecords.value)
    return true
}


const fetchResourcesFromLot = async () => {
    editedRecords.value = {}
    loading.value = true
    const { data } = await getRecordsInfo(filtersLotRecords, currentLot.value.id)
    recordsFromLot.value = data.data
    setTimeout(() => {
        loading.value = false
    }, 500)
}

const fetchAudits = async () => {
    // 3 ID AUDIT
    const { data } = await getUsersByRole(3)
    if (data.success) {
        auditors.value = data.data
    }
}


const fetchResources = async () => {
    loading.value = true
    const { data } = await getLots(filtersLot)
    lots.value = data.data
    setTimeout(() => {
        loading.value = false
    }, 500)
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
        }
    }
);
onBeforeMount(async () => {
    await fetchAudits()
})
</script>
