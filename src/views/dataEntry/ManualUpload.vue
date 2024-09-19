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
        <UniverSheet class="h-full" :rows="mergedRows" :cols="headers" :loading="loading" @updateFilters="updateFilters"
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
    </defaultLayout>
</template>


<script setup lang="ts">
import MCModal from "@/components/Modals/MCModal.vue";
import { Icon } from '@iconify/vue';
import { userDataStore } from '@/store/userStore';
import { useUserRecords } from '@/store/userRecordsStore';
import { FUniver, FWorksheet } from "@univerjs/facade";
import { ICommandInfo, ICellData, ColorType } from '@univerjs/core'
import UniverSheet from "@/components/Spreadsheet/UniverSheet.vue";
import { notificationsStore } from "@/store/notificationsStore";
import { ref, onMounted, } from 'vue';
import { getRow, insertRow, removeRow, isEmpty, returnPrev } from '@/utils/spreadsheet/generic'
import defaultLayout from '@/layouts/defaultLayout.vue';
import { addRecordstoUser, updateRecordsUser, getRecordsInfoUser, saveRecordsUser, removeRecordUser, removeAllRecordsUser } from '@/services/records';

const headers = [
    { prop: 'record_key', name: 'ID Expediente', pin: 'colPinStart', valType: 'text', size: 100, readonly: false },
    { prop: 'worked_on', name: 'Activo', valType: 'bool', readonly: true },
    { prop: 'id_provider', name: 'Prestador', valType: 'number', size: 100, readonly: true },
    { prop: 'particularity', name: 'Particularidad', size: 170, valType: 'text', readonly: true, colType: 'checkBox' },
    { prop: 'priority', name: 'Prioridad', valType: 'number', size: 100, readonly: true, colType: 'checkBox' },
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

const notifications = notificationsStore()
const userStore = userDataStore()
const userRecordsStore = useUserRecords()

const working = ref(false)
const editedRecords = ref(userRecordsStore.elements)
const colsReference = ref({})
const dbRecords = ref([])
const mergedRows = ref([])

let univerAPI = <FUniver>null;
let activeSheet = <FWorksheet>null;

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
    univerAPI = UniverAPI
    activeSheet = univerAPI.getActiveWorkbook().getActiveSheet() as FWorksheet;
    let beforeRange = {}

    univerAPI.onBeforeCommandExecute(async (command) => {
        // PRESSED DELETE ON RANGE
        if (command.id === 'sheet.command.clear-selection-content') {
            let result = true
            const toDelete = []
            activeSheet.getSelection().getActiveRange().forEach((row: number, col: number, cell: ICellData) => {
                if (cell.v == undefined || cell.v == '') return
                if (col != colsReference.value['record_key']) { holdTableChanges(col, row, cell.v) }
                else { toDelete.push({ 'value': cell.v, 'row': row }) }
            })
            if (toDelete.length > 0) result = await deleteRecords(toDelete)
            if (!result) {
                notifications.newMessage('error de servidor', false)
                univerAPI.executeCommand('univer.command.undo')
            }
        }
        if (command.id === 'sheet.command.set-range-values') {
            const sr = command.params['range']['startRow']
            const sc = command.params['range']['startColumn']
            const er = command.params['range']['endRow']
            const ec = command.params['range']['endColumn']
            activeSheet.getRange(sr, sc, ec - sc + 1, er - sr + 1).forEach((row: number, col: number, cell: ICellData) => {
                let key = `row${row}_col${col}`;
                beforeRange[key] = cell.v
            })
        }
        if (command.id === 'sheet.command.paste-bu-short-key') {
            activeSheet.getSelection().getActiveRange().forEach((row: number, col: number, cell: ICellData) => {
                let key = `row${row}_col${col}`;
                beforeRange[key] = cell.v
            })
        }
    })
    univerAPI.onCommandExecuted(async (command: ICommandInfo) => {
        // EXIT EDIT ON CELL
        if (command.id === 'sheet.command.set-range-values' && working.value === false) {
            const edits = []
            const sr = command.params['range']['startRow']
            const sc = command.params['range']['startColumn']
            const er = command.params['range']['endRow']
            const ec = command.params['range']['endColumn']
            activeSheet.getRange(sr, sc, ec - sc + 1, er - sr + 1).forEach(async (row: number, col: number, cell: ICellData) => {
                return manageRows(row, col, cell.v, edits, beforeRange)
            })
            manageEdit(edits)
            beforeRange = {}
        }
        if (command.id === 'sheet.command.paste-bu-short-key' && working.value === false) {
            const edits = []
            activeSheet.getSelection().getActiveRange().forEach(async (row: number, col: number, cell: ICellData) => {
                return manageRows(row, col, cell.v, edits, beforeRange)
            })
            manageEdit(edits)
            beforeRange = {}
        }
    })
}

const manageRows = (row: number, col: number, newVal: any, edits: Array<object>, beforeRange: object) => {
    let key = `row${row}_col${col}`;
    const preVal = beforeRange[key]
    if (newVal == preVal) return
    if (col != colsReference.value['record_key']) { return holdTableChanges(col, row, newVal) }
    else { edits.push({ 'col': col, 'row': row, 'prevVal': preVal, 'newVal': newVal }) }
    return
}

const manageEdit = async (edits: Array<object>) => {
    working.value = true
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
    const r = []
    if (deleteValues.length > 0) { await deleteRecords(deleteValues) }
    if (addValues.length > 0) { await addRecords(addValues) }
    if (changeValues.length > 0) { await changeRecords(changeValues) }
    setTimeout(() => {
        working.value = false
    }, 300);
    return true
}
const holdTableChanges = (col: number, row: number, newCellVal: any) => {
    const index = colsReference.value[col]
    const header = headers.find((element) => element.prop == index);
    if (header.readonly) {
        univerAPI.executeCommand('univer.command.undo')
        return true
    }
    const fullRow = getRow(activeSheet, row, colsReference.value)
    let record_key = fullRow['record_key']
    if (record_key == undefined) return true
    record_key = String(record_key)
    if (record_key in editedRecords.value) {
        editedRecords.value[record_key][index] = newCellVal
    } else {
        editedRecords.value[record_key] = {}
        editedRecords.value[record_key]['worked_on'] = true
        editedRecords.value[record_key][index] = newCellVal
    }
    return true
}

const deleteRecords = async (prevCellVals: Array<Object>) => {
    const celldata = {
        'records': prevCellVals,
        'token': userStore.token
    }
    const { data } = await removeRecordUser(celldata)
    if (data.success) {
        prevCellVals.forEach(element => {
            removeRow(activeSheet, element['row'], colsReference.value)
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
            if (idx != -1) {
                insertRow(activeSheet, newCellVals[idx]['row'], element, colsReference.value, headers);
                newCellVals.splice(idx, 1)
            }
        })
        if (data.errors.length > 0) {
            notifications.newMessage('Errores sumando algunos expedientes: ' + data.errors, false)
            data.errors.forEach((element: Number) => {
                const idx = newCellVals.findIndex((e) => e['value'] === element)
                if (idx != -1) {
                    returnPrev(activeSheet, newCellVals[idx]['row'], colsReference.value['record_key'], null)
                    newCellVals.splice(idx, 1)
                }
            })

        }
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
        mergedRows.value = mergedRows.value.concat(data.changeCellVals)
        data.modified_records.forEach((element: Object) => {
            const idx = changeCellVals.findIndex((e) => e['new_record_key'] === element['record_key'])
            if (idx != -1) insertRow(activeSheet, changeCellVals[idx]['row'], element, colsReference.value, headers)
            changeCellVals.splice(idx, 1)
        })
        if (data.errors.length > 0) {
            notifications.newMessage('Errores actualizando algunos expedientes: ' + data.errors, false)
            data.errors.forEach((element: Number) => {
                const idx = changeCellVals.findIndex((e) => e['new_record_key'] === element)
                if (idx != -1) {
                    returnPrev(activeSheet, changeCellVals[idx]['row'], colsReference.value['record_key'], changeCellVals[idx]['old_record_key'])
                    changeCellVals.splice(idx, 1)
                }
            })
        }

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
            notifications.newMessage(data.success ? data.message : data.error, data.success)
            clearEdited()
        } else {
            notifications.newMessage('No hay valores para guardar', null)
        }
    } catch (error) {
        notifications.newMessage(error, false)
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
        notifications.newMessage(data.message, true)
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