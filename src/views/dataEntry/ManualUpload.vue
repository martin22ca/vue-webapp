<template>
    <defaultLayout>
        <MCModal :modal-open="infoModal" :modal-text="infoModalText" :modal-title="infoModalTitle"
            :toggle-modal="() => { infoModal = !infoModal; }" class="text-xl">
            <div class="float-right">
                <button class=" m-2 btn btn-primary" @click="infoModal = false">
                    Cancelar
                </button>
                <button class="m-2 btn btn-error">
                    Eliminar
                </button>
            </div>
        </MCModal>
        <div class="h-auto">
            <Breadcrumbs title="Carga Manual"></Breadcrumbs>
            <UniverSheet :rows="mergedRows" :cols="headers" :loading="loading" @updateFilters="updateFilters"
                @update-a-p-i="updateAPI" @update-cols-reference="updateColsReference">
                <template #table_options>
                    <button :disabled="isEmpty(editedRecords)" class="btn btn-primary mx-2" @click="saveChanges()">
                        <Icon icon="mdi:content-save" class="text-xl text-neutral" />
                    </button>
                    <button v-if="!isEmpty(editedRecords)" class="fadeRight btn btn-error mx-2" @click="clearEdited()">
                        <Icon icon="mdi:delete" class="text-xl text-neutral" />
                    </button>
                </template>
            </UniverSheet>
        </div>
    </defaultLayout>
</template>


<script setup lang="ts">
import Breadcrumbs from "@/components/Breadcrumbs.vue";
import MCModal from "@/components/Modals/MCModal.vue";
import { Icon } from '@iconify/vue';
import { userDataStore } from '@/store/userStore';
import { usetableStore } from '@/store/tableStore';
import { useUserRecords } from '@/store/userRecordsStore';
import { FUniver, FWorksheet } from "@univerjs/facade";
import { ICellData, cellToRange, ICommandInfo } from '@univerjs/core'
import UniverSheet from "@/components/Spreadsheet/UniverSheet.vue";
import { notificationsStore } from "@/store/notificationsStore";
import { ref, onMounted, watch, onUnmounted } from 'vue';
import defaultLayout from '@/layouts/defaultLayout.vue';
import { addRecordtoUser, updateRecordsUser, getRecordsInfoUser, saveRecordsUser, removeRecordUser } from '@/services/records';

const headers = [
    { prop: 'record_key', name: 'ID Expediente', pin: 'colPinStart', valType: 'text', size: 100, readonly: false },
    { prop: 'worked_on', name: 'Activo', valType: 'bool', readonly: true },
    { prop: 'id_provider', name: 'Prestador', valType: 'number', size: 100, readonly: true },
    { prop: 'part_g_salud', name: 'Part. G salud', size: 170, valType: 'text', readonly: true },
    { prop: 'part_prevencion', name: 'Part. Prevencion', size: 170, valType: 'text', readonly: true },
    { prop: 'priority', name: 'Prioridad', valType: 'number', size: 100, readonly: true },
    { prop: 'business_name', name: 'Razon Social', valType: 'text', size: 200, readonly: true },
    { prop: 'assigned', name: 'Asignado', valType: 'bool', readonly: true },
    { prop: 'coorinator_number', name: 'Coordinador', valType: 'number', size: 150, readonly: true },
    { prop: 'lot_key', name: 'Lote', valType: 'text', readonly: false },
    { prop: 'auditor', name: 'Usuario Asignado', valType: 'number', size: 200 },
    { prop: 'record_name', name: 'Tipo', valType: 'text', readonly: true },
    { prop: 'record_total', name: 'Monto Total', valType: 'number', readonly: true },
    { prop: 'date_entry_digital', name: 'Fecha Digital', valType: 'date', size: 150, readonly: false },
    { prop: 'date_entry_physical', name: 'Fecha Fisico', valType: 'date', size: 150, readonly: false },
    { prop: 'seal_number', name: 'Nro Precinto', valType: 'number', readonly: false },
    { prop: 'observation', name: 'Observacion', valType: 'text', size: 300, readonly: false },
]

const infoModal = ref(false)
const infoModalText = ref('')
const infoModalTitle = ref('')
const loading = ref(true)

const notiStore = notificationsStore()
const userStore = userDataStore()
const tableStore = usetableStore()
const userRecordsStore = useUserRecords()

const editedRecords = ref(userRecordsStore.elements)
const colsReference = ref({})
const dbRecords = ref([])
const mergedRows = ref([])

const univerAPI = ref<FUniver>(null);
const activeSheet = ref<FWorksheet>(null);

let filters = []

const fetchResources = async (reset = false) => {
    try {
        if (reset) loading.value = true;
        mergedRows.value = []
        const { data } = await getRecordsInfoUser(userStore.token, filters);
        dbRecords.value = [...data.data]

        // Set loading to false after a delay
        if (reset) {
            setTimeout(() => {
                loading.value = false;
            }, 100);
        }
        for (let i = 0; i < dbRecords.value.length; i++) {
            const element = dbRecords.value[i];
            if (element.record_key in editedRecords.value) {
                mergedRows.value.push({ ...element, ...editedRecords.value[element.record_key] })
            }
            else {
                mergedRows.value.push(element)
            }

        } console.log(mergedRows.value)


    } catch (error) {
        console.error("Error fetching resources:", error);
        // Handle error, potentially set a different state to indicate the error
        loading.value = false;
    }
};


const updateFilters = (appliedFilters) => {
    filters = appliedFilters;
    fetchResources(true)
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

    univerAPI.value.onCommandExecuted((command) => {
        if (command.id === 'sheet.operation.set-cell-edit-visible' && command.params.visible) {
            row = activeSheet.value.getSelection().getActiveRange().getCell().actualRow
            col = activeSheet.value.getSelection().getActiveRange().getCell().actualColumn
            preVal = activeSheet.value.getSelection().getActiveRange().getCellData()
        }
    })
    univerAPI.value.onCommandExecuted(async (command: ICommandInfo) => {
        if (command.id === 'sheet.operation.set-cell-edit-visible' && !command.params.visible) {
            const cell = activeSheet.value.getRange(row, col, 1, 1).getCellData()
            const Nrow = activeSheet.value.getSelection().getActiveRange().getCell().actualRow - 1
            const Ncol = activeSheet.value.getSelection().getActiveRange().getCell().actualColumn
            if (row == Nrow && col == Ncol) {
                const result = await manageEdit(col, row, preVal.v == undefined ? '' : preVal.v, cell.v == undefined ? '' : cell.v)
                console.log(result)
                if (!result) {
                    const range = activeSheet.value.getRange(row, col, 1, 1)
                    if (preVal.v == undefined) range.setValue('')
                    else range.setValue(preVal.v)
                }
            } else {
                const range = activeSheet.value.getRange(row, col, 1, 1)
                if (preVal.v == undefined) range.setValue('')
                else range.setValue(preVal.v)
            }
        }
    })
}

const manageResponse = async (response) => {
    console.log(response.data)
    if (response.data.success) {
        await fetchResources(true)
        notiStore.newMessage(response.data.message, true)
        return true
    }
    notiStore.newMessage(response.data.error, false)
    return false
}

const getRow = (col: number, row: number) => {
    var rowObj = {}
    const width = Object.keys(colsReference.value).length
    activeSheet.value.getRange(row, 0, 1, width).forEach((row: number, col: number, cell: ICellData) => {
        rowObj[colsReference.value[col]] = cell.v
    })
    return rowObj
}


const manageEdit = async (col: number, row: number, prevCellVal: any, newCellVal: any) => {
    let res = null
    if (prevCellVal == newCellVal) return true
    if (col != colsReference.value['record_key']) {
        const index = colsReference.value[col]
        const header = headers.find((element) => element.prop == index);
        if (header.readonly) return false
        const fullRow = getRow(col, row)
        const record_key = String(fullRow.record_key)
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
    if (prevCellVal == '') {
        if (newCellVal == '') return true
        // ADD RECORD
        const record_key = String(newCellVal)
        const celldata = {
            'record_key': record_key,
            'token': userStore.token
        }
        if (await manageResponse(await addRecordtoUser(celldata))) {
            editedRecords.value[record_key] = {}
            editedRecords.value[record_key][colsReference.value['worked_on']] = true
            return true
        }
        return false
    } else {
        if (String(newCellVal).trim().length === 0) {
            // DELETE Record
            const record_key = String(prevCellVal)
            const celldata = {
                'record_key': record_key,
                'token': userStore.token
            }
            if (await manageResponse(await removeRecordUser(celldata))) {
                delete editedRecords.value[record_key]
                return true
            }
            return false
        } else {
            // CHANGE ROW
            const new_record_key = String(newCellVal)
            const old_record_key = String(prevCellVal)
            const celldata = {
                'new_record_key': new_record_key,
                'old_record_key': old_record_key,
                'token': userStore.token
            }
            if (await manageResponse(await updateRecordsUser(celldata))) {
                delete editedRecords.value[old_record_key]
                editedRecords.value[new_record_key] = {}
                editedRecords.value[new_record_key][colsReference.value['worked_on']] = true
                return true
            }
            else {
                return false
            }

        }
    }
}

const saveChanges = async () => {
    mergedRows.value.forEach(element => {
        if (element.record_key in editedRecords.value) {
            editedRecords.value[element.record_key]['uxri_id'] = element.uxri_id
        }
    });
    try {
        const reqData = {
            'token': userStore.token,
            'values': editedRecords.value
        }
        if (!isEmpty(reqData.values)) {
            const { data } = await saveRecordsUser(reqData)
            notiStore.newMessage(data.success ? data.message : data.error, data.success)
            clearEdited()
        } else {
            notiStore.newMessage('No hay valores para guardar', null)
        }
    } catch (error) {
        notiStore.newMessage(error, false)
    }
}
const clearEdited = () => {
    editedRecords.value = {}
    userRecordsStore.$reset()
    fetchResources(true)
}

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

onMounted(async () => {
    await fetchResources(true)
})
</script>


<style>
.fadeRight {
    animation: fadeRight 0.5s ease 0s 1 normal forwards;
}

@keyframes fadeRight {
    0% {
        opacity: 0;
        transform: translateX(50px);
    }

    100% {
        opacity: 1;
        transform: translateX(0);
    }
}
</style>