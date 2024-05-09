<template>
    <defaultLayout>
        <MCModal :modal-open="infoModal" :modal-text="infoModalText" :modal-title="infoModalTitle"
            :toggle-modal="() => { infoModal = !infoModal; }" class="text-xl">
            <div class="float-right">
                <button class=" m-2 btn btn-primary" @click="infoModal = false">
                    Cancelar
                </button>
                <button class="m-2 btn btn-error" @click="removeAssigned()">
                    Eliminar
                </button>
            </div>
        </MCModal>
        <Toast :toastOpen="toastOpen" :toggleToast="() => { toastOpen = !toastOpen }" :toastText="toasText" />
        <div class="h-auto">
            <Breadcrumbs />
            <h1 class="p-2" style="font-size: 3.3vh ;">Entrada Manual</h1>
            <DataTable :rows="mergedRows" :cols="headers" :loading="loading" :columnTypes="columnTypes"
                :customEdit="changeRecordNum" @updateFilters="updateFilters">
                <template #table_options>
                    <button class="btn btn-secondary mx-2" @click="addNewRecord()">
                        <Icon icon="mdi:plus" class="text-xl text-neutral" />
                    </button>
                    <button class="btn btn-primary mx-2" @click="saveChanges()">
                        <Icon icon="mdi:content-save" class="text-xl text-neutral" />
                    </button>
                    <button v-if="editedRecords.length > 0" class="fadeRight btn btn-error mx-2" @click="clearEdited()">
                        <Icon icon="mdi:delete" class="text-xl text-neutral" />
                    </button>
                </template>
            </DataTable>
        </div>
    </defaultLayout>
</template>


<script setup>
import Breadcrumbs from "@/components/Breadcrumbs.vue";
import MCModal from "@/components/Modals/MCModal.vue";
import Toast from '@/components/Toast.vue';
import { Icon } from '@iconify/vue';
import { userDataStore } from '@/store/userStore';
import { usetableStore } from '@/store/tableStore';
import { useUserRecords } from '@/store/userRecordsStore';
import { VGridVueTemplate } from '@revolist/vue3-datagrid';
import DataTableInfoDelete from '@/components/DataTable/DataTableInfoDelete.vue';
import DataTableCheckbox from '@/components/DataTable/DataTableCheckbox.vue'
import Plugin from "@revolist/revogrid-column-date";
import DataTable from "@/components/DataTable/DataTable.vue";
import { ref, onMounted, watch, onUnmounted } from 'vue';
import defaultLayout from '@/layouts/defaultLayout.vue';
import { addRecordtoUser, updateRecordsUser, getRecordsInfoUser, saveRecordsUser, removeRecordUser } from '@/services/records';

const columnTypes = { 'date': new Plugin() };
const headers = [
    { prop: 'id_record', name: 'Nro Expediente', pin: 'colPinStart', valType: 'number', size: 100 },
    { prop: 'worked_on', name: 'Activo', valType: 'bool', cellTemplate: VGridVueTemplate(DataTableCheckbox), readonly: true },
    { prop: 'id_provider', name: 'Prestador', valType: 'number', size: 150, readonly: true },
    { prop: 'business_name', name: 'Razon Social', valType: 'text', size: 200, readonly: true },
    { prop: 'assigned', name: 'Asignado', valType: 'bool', cellTemplate: VGridVueTemplate(DataTableCheckbox), readonly: true },
    { prop: 'coorinator_number', name: 'Coordinador', valType: 'number', size: 150, readonly: true },
    { prop: 'lot_key', name: 'Lote', valType: 'number' },
    { prop: 'id_user', name: 'Usuario Asignado', valType: 'number', size: 200 },
    { prop: 'record_total', name: 'Monto Total', valType: 'number' },
    { prop: 'date_entry_digital', name: 'Fecha Digital', valType: 'date', size: 150 },
    { prop: 'date_entry_physical', name: 'Fecha Fisico', valType: 'date', size: 150 },
    { prop: 'seal_number', name: 'Nro Precinto', valType: 'number' },
    { prop: 'observation', name: 'Observacion', valType: 'text', size: 300 },
    { prop: 'info', name: 'Info', valType: 'bool', cellTemplate: VGridVueTemplate(DataTableInfoDelete), size: 150, readonly: true },
]

const infoModal = ref(false)
const infoModalText = ref('')
const infoModalTitle = ref('')
const toastOpen = ref(false)
const toasText = ref('')
const loading = ref(true)

const userStore = userDataStore()
const tableStore = usetableStore()
const userRecordsStore = useUserRecords()

const editedRecords = ref(userRecordsStore.elements)
const dbRecords = ref([])
const mergedRows = ref([])

let removeRecord = null
let websocket = null;
let filters = []

const fetchResources = async () => {
    const { data } = await getRecordsInfoUser(userStore.token, filters)
    dbRecords.value = dbRecords.value.filter(obj => Object.keys(obj).length !== 0);

    for (let i = 0; i < data.length; i++) {
        const id_element = data[i].id_record;
        const existingRecordIndex = dbRecords.value.findIndex(record => record.id_record === id_element);
        if (existingRecordIndex !== -1) {
            // If found, overwrite the existing record
            dbRecords.value[existingRecordIndex] = data[i];
        } else {
            // If not found, push the new record to recordsInfo.value
            dbRecords.value.push(data[i]);
        }
    }
    mergedRows.value = getRows()
    setTimeout(() => {
        loading.value = false
    }, 500)
}

const updateFilters = (appliedFilters) => {
    filters = appliedFilters;
    fetchResources()
}

const addNewRecord = () => {
    var emptyRow = {}
    dbRecords.value.push(emptyRow)
    mergedRows.value = getRows()
}

const saveChanges = async () => {
    if (toastOpen.value) {
        toastOpen.value = false
    }

    const saveRows = getRows()
    const reqData = {
        'token': userStore.token,
        'values': saveRows.filter(obj => obj.worked_on == true)
    }
    if (reqData.values.length > 0) {
        const data = await saveRecordsUser(reqData)
        clearEdited()
        console.log(data)
        toasText.value = 'Valores Guardados'
        toastOpen.value = true
        fetchResources()
    } else {
        toasText.value = 'No hay valores para guardar'
        toastOpen.value = true

    }

}

const removeAssigned = async () => {
    if (toastOpen.value) {
        toastOpen.value = false
    }
    const data = {
        'id_uxri': removeRecord.uxri_id,
        'token': userStore.token
    }
    const id = editedRecords.value.findIndex((item) => item.id_record == removeRecord.id_record)
    if (id != -1) {
        editedRecords.value.splice(id, 1)
    }
    infoModal.value = false

    const res = await removeRecordUser(data)
    console.log(res)
    if (res.data.success) {
        toasText.value = res.data.message
        toastOpen.value = true
    } else {
        toasText.value = res.data.error
        toastOpen.value = true
    }
    fetchResources()
}

const changeRecordNum = async (e) => {
    if (toastOpen.value) {
        toastOpen.value = false
    }

    if (e.detail.prop == 'id_record') {
        e.preventDefault()
        const rowIndex = e.detail.rowIndex
        var res
        var data
        if (Object.keys(dbRecords.value[rowIndex]).length === 0 && dbRecords.value[rowIndex].constructor === Object) {
            // New Record in the rows
            data = {
                'id_record': Number(e.detail.val),
                'token': userStore.token
            }
            res = await addRecordtoUser(data)
        }
        else {
            data = {
                'id_record_new': Number(e.detail.val),
                'id_record_old': dbRecords.value[rowIndex]['id_record'],
                'token': userStore.token
            }
            res = await updateRecordsUser(data)
        }
        if (res.data.success) {
            toasText.value = res.data.message
            toastOpen.value = true
            fetchResources()
        } else {
            toasText.value = res.data.error
            toastOpen.value = true
            data
        }
    } else {
        if (!e.detail.model.worked_on) {
            const element_index = dbRecords.value.findIndex((item) => item.id_record == e.detail.model['id_record'])
            let element = dbRecords.value.splice(element_index, 1)[0];
            element['worked_on'] = true
            editedRecords.value.push(element)
        }
    }
}

const clearEdited = () => {
    editedRecords.value = []
    userRecordsStore.$reset()
    fetchResources()
}

const getRows = () => {
    const filteredDbRecords = dbRecords.value.filter(record => {
        return !editedRecords.value.some(editedRecord => editedRecord.id_record === record.id_record);
    });
    return [...filteredDbRecords, ...editedRecords.value];
}


const connectWebSocket = () => {
    console.log('webSocket')
};


onMounted(async () => {
    fetchResources()
    connectWebSocket()
})


onUnmounted(() => {
    if (websocket) {
        websocket.close();
        websocket = null;
    }
})

watch(
    () => tableStore.id,
    (newValue) => {
        if (newValue == 1) {
            console.log('newVal', newValue)
            console.log(tableStore.data)
            tableStore.$reset()
        }
        else if (newValue == 2) {
            console.log(tableStore.data.uxri_id)
            removeRecord = tableStore.data
            infoModal.value = true
            infoModalTitle.value = 'Remover Expediente:  ' + tableStore.data.id_record
            infoModalText.value = 'Este Expediente sera desasignado pero se conservaran los datos. Esta seguro que quiere continuar?'
            tableStore.$reset()
        }
    }
);

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