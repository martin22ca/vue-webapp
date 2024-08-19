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
                    <DataTable :btnCols="false" :btnExport="false" :rows="lots" :cols="headerLots" :loading="loading"
                        @update-filters="updateFiltersLot">
                        <template #table_options>
                            <h2 class="text-xl p-2 bg-neutral text-neutral-content p-2 rounded-xl">Lotes Disponibles
                            </h2>
                        </template>
                    </DataTable>
                </div>
                <div class="bg-base-300 rounded-xl fadeRight" style="width: 25%" v-else>
                    <lotEdit :lot="currentLot" :clearLot="() => { currentLot = null; fetchResources() }"
                        :users="lotStore.initData" />
                </div>
                <div v-if="currentLot != null" class="fadeLeft" style="width: 75%;">
                    <UniverSheet v-if="recordsFromLot != null" class="w-full" :rows="recordsFromLot"
                        :cols="headersRecords" :loading="loading" @updateFilters="updateFiltersRecords"
                        @update-a-p-i="updateAPI" @update-cols-reference="updateColsReference">
                        <template #table_options>
                            <button :disabled="isEmpty(editedRecords)" class="btn btn-primary mx-2"
                                @click="saveChanges()">
                                <Icon icon="mdi:content-save" class="text-xl text-neutral" />
                            </button>
                            <button v-if="!isEmpty(editedRecords)" class="fadeRight btn btn-error mx-2"
                                @click="fetchResourcesFromLot()">
                                <Icon icon="mdi:delete" class="text-xl text-neutral" />
                            </button>
                        </template>
                    </UniverSheet>
                </div>
            </div>
        </div>
    </defaultLayout>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import MCModal from '@/components/Modals/MCModal.vue';
import lotEdit from './LotEdit.vue';
import { getUsersByRole } from '@/services/users'
import DataTableCheckbox from '@/components/DataTableUI/DataTableCheckbox.vue';
import DataTableInfo from '@/components/DataTableUI/DataTableInfo.vue';
import { VGridVueTemplate } from '@revolist/vue3-datagrid';
import UniverSheet from '@/components/Spreadsheet/UniverSheet.vue'
import DataTable from '@/components/Spreadsheet/DataTable.vue';
import { onMounted, ref, watch } from 'vue';
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
const recordFromLot = ref(null)
let filtersLot = []
let filtersLotRecords = []

const univerAPI = ref<FUniver>(null);
const activeSheet = ref<FWorksheet>(null);
const editedRecords = ref({})
const colsReference = ref({})

const headerLots = [
    { prop: 'lot_key', pin: 'colPinStart', name: 'Lote', valType: 'text' },
    { prop: 'status', name: 'Activo', valType: 'bool', cellTemplate: VGridVueTemplate(DataTableCheckbox), readonly: true },
    { prop: 'total_records', name: 'Expedientes en el lote', valType: 'number', size: 250, readonly: true },
    { prop: 'date_departure', name: 'Fecha Salida', valType: 'date', size: 180, readonly: true },
    { prop: 'date_return', name: 'Fecha retorno', valType: 'date', size: 180, readonly: true },
    { prop: 'observation', name: 'Observacion', valType: 'text', size: 250, readonly: true },
    { name: 'Info', cellTemplate: VGridVueTemplate(DataTableInfo), pin: 'colPinEnd', readonly: true, size: 75 },
]

const headersRecords = [
    { prop: 'record_key', name: 'ID Expediente', pin: 'colPinStart', valType: 'number', size: 100, readonly: true },
    { prop: 'id_provider', name: 'Prestador', valType: 'number', size: 150, readonly: true },
    { prop: 'business_name', name: 'Razon Social', valType: 'text', size: 200, readonly: true },
    { prop: 'assigned', name: 'Asignado', valType: 'bool', readonly: true },
    { prop: 'lot_key', name: 'Lote', valType: 'string', readonly: false },
    { prop: 'date_assignment_audit_formatted', name: 'Fecha Asignacion Aud.', valType: 'date', size: 230, readonly: false },
    { prop: 'id_auditor', name: 'Auditor', valType: 'text', size: 300, readonly: false },
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
    activeSheet.value = univerAPI.value.getActiveWorkbook().getActiveSheet()
    var row = null
    var col = null
    var preVal = null

    univerAPI.value.onBeforeCommandExecute(async (command) => {
        // PRESSED DELETE ON RANGE
        if (command.id === 'sheet.command.clear-selection-content') {
            activeSheet.value.getSelection().getActiveRange().forEach((rrow: number, ccol: number, ccell: ICellData) => {
                if (ccell.v == undefined || ccell.v == '') return
                holdTableChanges(ccol, rrow, ccell.v)

            })
        }
    })
    univerAPI.value.onCommandExecuted(async (command: ICommandInfo) => {
        // PASTE AFTER
        if (command.id == 'sheet.command.paste-bu-short-key') {
            const range = activeSheet.value.getSelection().getActiveRange()
            range.forEach((rrow: number, ccol: number, ccell: ICellData) => {
                holdTableChanges(ccol, rrow, ccell.v)
            })
        }
        // ENTER EDIT ON CELL
        if (command.id === 'sheet.operation.set-cell-edit-visible' && command.params.visible) {
            row = activeSheet.value.getSelection().getActiveRange().getCell().actualRow
            col = activeSheet.value.getSelection().getActiveRange().getCell().actualColumn
            preVal = activeSheet.value.getSelection().getActiveRange().getCellData()
        }
        // EXIT EDIT ON CELL
        if (command.id === 'sheet.operation.set-cell-edit-visible' && !command.params.visible) {
            const newVal = activeSheet.value.getRange(row, col, 1, 1).getCellData()
            if (newVal.v == preVal.v) return
            const result = holdTableChanges(col, row, newVal.v)
            if (!result) {
                notiStore.newMessage('error de servidor', false)
                univerAPI.value.executeCommand('univer.command.undo')
            }
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
        if (newCellVal == '') delete editedRecords.value[record_key][index]
        else editedRecords.value[record_key][index] = newCellVal
    } else {
        editedRecords.value[record_key] = {}
        editedRecords.value[record_key]['worked_on'] = true
        editedRecords.value[record_key][index] = newCellVal
    }
    return true
}


const fetchResourcesFromLot = async () => {
    editedRecords.value = {}
    loading.value = true
    console.log(currentLot.value)
    const { data } = await getRecordsInfo(filtersLotRecords, currentLot.value.id)
    recordsFromLot.value = data.data
    setTimeout(() => {
        loading.value = false
    }, 500)
    fetchAudits()
}

const fetchAudits = async () => {
    // 3 ID AUDIT
    const { data } = await getUsersByRole(3)
    if (data.success) {
        lotStore.initData = data.data
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
