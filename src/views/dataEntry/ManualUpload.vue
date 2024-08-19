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
                    <button v-if="dbRecords.length > 0" class="fadeRight btn btn-secondary mx-2"
                        @click="clearAssignedRecords()">
                        <Icon icon="mdi:broom" class="text-xl text-neutral" />
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
import { ICommandInfo, ICellData } from '@univerjs/core'
import UniverSheet from "@/components/Spreadsheet/UniverSheet.vue";
import { notificationsStore } from "@/store/notificationsStore";
import { ref, onMounted, } from 'vue';
import { getRow, insertRow, removeRow, isEmpty } from '@/utils/spreadsheet/generic'
import defaultLayout from '@/layouts/defaultLayout.vue';
import { addRecordstoUser, updateRecordsUser, getRecordsInfoUser, saveRecordsUser, removeRecordUser, removeAllRecordsUser } from '@/services/records';

const headers = [
    { prop: 'record_key', name: 'ID Expediente', pin: 'colPinStart', valType: 'text', size: 100, readonly: false },
    { prop: 'worked_on', name: 'Activo', valType: 'bool', readonly: true },
    { prop: 'id_provider', name: 'Prestador', valType: 'number', size: 100, readonly: true },
    { prop: 'particularity', name: 'Particularidad', size: 170, valType: 'text', readonly: true },
    { prop: 'priority', name: 'Prioridad', valType: 'number', size: 100, readonly: true },
    { prop: 'business_name', name: 'Razon Social', valType: 'text', size: 200, readonly: true },
    { prop: 'assigned', name: 'Asignado', valType: 'bool', readonly: true },
    { prop: 'id_coorinator', name: 'Coordinador', valType: 'number', size: 150, readonly: true },
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
            }, 1);
        }
        for (let i = 0; i < dbRecords.value.length; i++) {
            const element = dbRecords.value[i];
            if (element.record_key in editedRecords.value) {
                mergedRows.value.push({ ...element, ...editedRecords.value[element.record_key] })
            }
            else {
                mergedRows.value.push(element)
            }

        }


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
    let preVPaste = {}

    univerAPI.value.onBeforeCommandExecute(async (command) => {
        // PRESSED DELETE ON RANGE
        if (command.id === 'sheet.command.clear-selection-content') {
            let result = true
            const toDelete = []
            activeSheet.value.getSelection().getActiveRange().forEach((rrow: number, ccol: number, ccell: ICellData) => {
                if (ccell.v == undefined || ccell.v == '') return
                if (ccol == colsReference.value['record_key']) { holdTableChanges(ccol, rrow, ccell.v) }
                else { toDelete.push({ 'value': ccell.v, 'row': rrow }) }
            })
            if (toDelete.length > 0) result = await deleteRecords(toDelete)
            if (!result) {
                notiStore.newMessage('error de servidor', false)
                univerAPI.value.executeCommand('univer.command.undo')
            }
        }
    })
    univerAPI.value.onCommandExecuted(async (command: ICommandInfo) => {
        // PASTE AFTER
        if (command.id == 'sheet.command.paste-bu-short-key') {
            const range = activeSheet.value.getSelection().getActiveRange()
            const editsValues = []
            range.forEach((rrow: number, ccol: number, ccell: ICellData) => {
                if (ccol != colsReference.value['record_key']) holdTableChanges(ccol, rrow, ccell.v)
                else { editsValues.push({ 'col': ccol, 'row': rrow, 'prevVal': undefined, 'newVal': ccell.v }) }
            })
            preVPaste = {}
            const result = manageEdit(editsValues)
            if (!result) {
                notiStore.newMessage('error de servidor', false)
                univerAPI.value.executeCommand('univer.command.undo')
            }
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
            if (col != colsReference.value['record_key']) {
                const result = holdTableChanges(col, row, newVal.v)
                if (!result) {
                    notiStore.newMessage('error de servidor', false)
                    univerAPI.value.executeCommand('univer.command.undo')
                }
            }
            else {
                const result = manageEdit([{ 'col': col, 'row': row, 'prevVal': preVal.v, 'newVal': newVal.v }])
                if (!result) {
                    notiStore.newMessage('error de servidor', false)
                    univerAPI.value.executeCommand('univer.command.undo')
                }
            }

        }
    })
}

const manageEdit = async (edits: Array<object>) => {
    const addValues = []
    const deleteValues = []
    const changeValues = []
    edits.forEach(async cellObj => {
        if (cellObj['prevVal'] == '' || cellObj['prevVal'] == undefined) {
            // ADD RECORD
            if (cellObj['newVal'] == '') return
            addValues.push({ 'value': String(cellObj['newVal']), 'row': cellObj['row'] })
            return

        } else {
            if (cellObj['newVal'] == '' || cellObj['newVal'] == undefined) {
                // DELETE RECORD
                deleteValues.push({ 'value': cellObj['prevVal'], 'row': cellObj['row'] })
                return
            } else {
                // CHANGE ROW
                const new_record_key = String(cellObj['newVal'])
                const old_record_key = String(cellObj['prevVal'])
                changeValues.push({ 'old_record_key': old_record_key, 'new_record_key': new_record_key, 'row': cellObj['row'] })

            }
        }
    })
    if (deleteValues.length > 0) { deleteRecords(deleteValues) }
    if (addValues.length > 0) { addRecords(addValues) }
    if (changeValues.length > 0) { changeRecords(changeValues) }
    return true
}
const holdTableChanges = (col: number, row: number, newCellVal: any) => {
    const index = colsReference.value[col]
    const header = headers.find((element) => element.prop == index);
    if (header.readonly) {
        univerAPI.value.executeCommand('univer.command.undo')
        return true
    }

    553433
    55
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

const deleteRecords = async (prevCellVals: Array<Object>) => {
    univerAPI.value.executeCommand('univer.command.undo')
    const celldata = {
        'records': prevCellVals,
        'token': userStore.token
    }
    const { data } = await removeRecordUser(celldata)
    if (data.success) {
        prevCellVals.forEach(element => {
            removeRow(activeSheet.value, element['row'], colsReference.value)
            delete editedRecords.value[element['value']]
        });
        return true
    }
    return false
}

const addRecords = async (newCellVals: Array<Object>) => {
    const celldata = {
        'records': newCellVals,
        'token': userStore.token
    }
    const { data } = await addRecordstoUser(celldata)
    if (data.success) {
        mergedRows.value = mergedRows.value.concat(data.added_records)
        data.added_records.forEach((element: Object) => {
            const idx = newCellVals.findIndex((e) => e['value'] === element['record_key'])
            if (idx != -1) insertRow(activeSheet.value, newCellVals[idx]['row'], element, colsReference.value, headers);
        })

        return true
    }
    return false
}

const changeRecords = async (changeCellVals: Array<Object>) => {
    const celldata = {
        'records': changeCellVals,
        'token': userStore.token
    }
    const { data } = await updateRecordsUser(celldata)
    if (data.success) {
        mergedRows.value = mergedRows.value.concat(data.added_records)
        data.modified_records.forEach((element: Object) => {
            const idx = changeCellVals.findIndex((e) => e['new_record_key'] === element['record_key'])
            if (idx != -1) insertRow(activeSheet.value, changeCellVals[idx]['row'], element, colsReference.value, headers)
        })
        return true
    }
    return false
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

const clearAssignedRecords = async () => {
    editedRecords.value = {}
    userRecordsStore.$reset()
    const reqData = {
        'token': userStore.token,
    }
    const { data } = await removeAllRecordsUser(reqData)
    if (data.success) {
        notiStore.newMessage(data.message, true)
        fetchResources(true)
    }
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