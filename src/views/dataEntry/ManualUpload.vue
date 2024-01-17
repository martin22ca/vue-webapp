<template>
    <defaultLayout>
        <Toast :duration="1" :toastOpen="toastOpen" :toggleToast="() => { toastOpen = !toastOpen }" :toastText="toasText" />
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
            <DataTable :rows="getRows()" :cols="headers" :loading="loading" :columnTypes="columnTypes"
                :customEdit="changeRecordNum" @updateFilters="updateFilters">
                <template #table_options>
                    <button class="btn btn-secondary mx-2" @click="addNewRecord()">
                        <Icon icon="material-symbols:add" class="text-xl text-neutral" />
                    </button>
                    <button class="btn btn-primary mx-2" @click="saveChanges()">
                        <Icon icon="material-symbols:save" class="text-xl text-neutral" />
                    </button>
                </template>
            </DataTable>
        </div>
    </defaultLayout>
</template>


<script setup>
import Toast from '@/components/Toast.vue';
import { Icon } from '@iconify/vue';
import { userDataStore } from '@/store/userStore';
import { usetableStore } from '@/store/tableStore';
import { useUserRecords } from '@/store/userRecordsStore';
import { VGridVueTemplate } from '@revolist/vue3-datagrid';
import DataTableCheckbox from '@/components/DataTable/DataTableCheckbox.vue'
import Plugin from "@revolist/revogrid-column-date";
import DataTable from "@/components/DataTable/DataTable.vue";
import { ref, onMounted, watch, onUnmounted } from 'vue';
import defaultLayout from '@/layouts/defaultLayout.vue';
import { addRecordtoUser, updateRecordsUser, getRecordsInfoUser, saveRecordsUser } from '@/services/records';

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
    { prop: 'date_entry_digital', name: 'Fecha Entrada Digital', valType: 'date', size: 150 },
    { prop: 'date_entry_physical', name: 'Fecha Entrada Fisico', valType: 'date', size: 150 },
    { prop: 'seal_number', name: 'Nro Precinto', valType: 'number' },
    { prop: 'observation', name: 'Observacion', valType: 'text', size: 300 },
    { prop: 'info', name: 'Info', valType: 'bool', readonly: true },
]

const userStore = userDataStore()
const tableStore = usetableStore()
const userRecordsStore = useUserRecords()
const columnTypes = { 'date': new Plugin() };
const loading = ref(true)
const editedRecords = ref(userRecordsStore.elements)
const dbRecords = ref([])
const toastOpen = ref(false)
const toasText = ref('')
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
}

const saveChanges = async () => {

    const saveRows = getRows()
    const reqData = {
        'token': userStore.token,
        'values': saveRows.filter(obj => obj.worked_on == true)
    }
    if (reqData.values.length > 0) {
        const data = await saveRecordsUser(reqData)
        editedRecords.value = []
        userRecordsStore.$reset()
        console.log(data)
        toasText.value = 'Valores Guardados'
        toastOpen.value = true
        fetchResources()
    } else {
        toasText.value = 'No hay valores para guardar'
        toastOpen.value = true

    }

}

const changeRecordNum = async (e) => {
    if (e.detail.prop == 'id_record') {
        e.preventDefault()
        const rowIndex = e.detail.rowIndex
        var res
        if (Object.keys(dbRecords.value[rowIndex]).length === 0 && dbRecords.value[rowIndex].constructor === Object) {
            // New Record in the rows
            const data = {
                'id_record': Number(e.detail.val),
                'token': userStore.token
            }
            res = await addRecordtoUser(data)
        }
        else {
            const data = {
                'id_record_new': Number(e.detail.val),
                'id_record_old': dbRecords.value[rowIndex]['id_record'],
                'token': userStore.token
            }
            res = await updateRecordsUser(data)
        }
        if (res.data.success) {
            console.log(res.data.message)
            toasText.value = res.data.message
            toastOpen.value = true
            fetchResources()
        } else {
            toasText.value = res.data.error
            toastOpen.value = true
        }
    } else {
        if (!e.detail.model.worked_on) {
            const rowIndex = e.detail.rowIndex
            console.log(rowIndex, dbRecords.value[rowIndex])
            let element = dbRecords.value.splice(rowIndex, 1)[0];
            element['worked_on'] = true
            editedRecords.value.push(element)
        } else {

        }
    }
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
        if (newValue != -1) {
            console.log('newVal', newValue)
            tableStore.$reset()
        }
    }
);

</script>
