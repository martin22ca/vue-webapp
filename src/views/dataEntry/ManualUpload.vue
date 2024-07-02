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
        <div class="h-auto">
            <Breadcrumbs />
            <h1 class="p-2" style="font-size: 3.3vh ;">Entrada Manual</h1>
            <DataTable :rows="mergedRows" :cols="headers" :loading="loading" :columnTypes="columnTypes"
                :customEdit="changeRecordNum" @updateFilters="updateFilters">
                <template #table_options>
                    <button :disabled="isEmpty(editedRecords)" class="btn btn-primary mx-2" @click="saveChanges()">
                        <Icon icon="mdi:content-save" class="text-xl text-neutral" />
                    </button>
                    <button v-if="!isEmpty(editedRecords)" class="fadeRight btn btn-error mx-2" @click="clearEdited()">
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
import { Icon } from '@iconify/vue';
import { userDataStore } from '@/store/userStore';
import { usetableStore } from '@/store/tableStore';
import { useUserRecords } from '@/store/userRecordsStore';
import { VGridVueTemplate } from '@revolist/vue3-datagrid';
import DataTableInfoDelete from '@/components/DataTableUI/DataTableInfoDelete.vue';
import DataTableCheckbox from '@/components/DataTableUI/DataTableCheckbox.vue'
import DataTableExists from "@/components/DataTableUI/DataTableExists.vue";
import DataTablePriorities from "@/components/DataTableUI/DataTablePriorities.vue";
import Plugin from "@revolist/revogrid-column-date";
import DataTable from "@/components/Spreadsheet/DataTable.vue";
import { notificationsStore } from "@/store/notificationsStore";
import { ref, onMounted, watch, onUnmounted } from 'vue';
import defaultLayout from '@/layouts/defaultLayout.vue';
import { addRecordtoUser, updateRecordsUser, getRecordsInfoUser, saveRecordsUser, removeRecordUser } from '@/services/records';

const columnTypes = { 'date': new Plugin() };
const headers = [
    { prop: 'id_record', name: 'Nro Expediente', pin: 'colPinStart', valType: 'number', size: 100 },
    { prop: 'worked_on', name: 'Activo', valType: 'bool', cellTemplate: VGridVueTemplate(DataTableCheckbox), readonly: true },
    { prop: 'id_provider', name: 'Prestador', valType: 'number', size: 150, readonly: true },
    { prop: 'id_particularity', name: 'Particularidad', cellTemplate: VGridVueTemplate(DataTableExists), valType: 'number', size: 100, readonly: true },
    { prop: ['id_priority',2], name: 'Prioridad', cellTemplate: VGridVueTemplate(DataTablePriorities), valType: 'number', size: 100, readonly: true },
    { prop: 'business_name', name: 'Razon Social', valType: 'text', size: 200, readonly: true },
    { prop: 'assigned', name: 'Asignado', valType: 'bool', cellTemplate: VGridVueTemplate(DataTableCheckbox), readonly: true },
    { prop: 'coorinator_number', name: 'Coordinador', valType: 'number', size: 150, readonly: true },
    { prop: 'lot_key', name: 'Lote', valType: 'text' },
    { prop: 'id_user', name: 'Usuario Asignado', valType: 'number', size: 200 },
    { prop: 'record_name', name: 'Tipo', valType: 'text' },
    { prop: 'record_total', name: 'Monto Total', valType: 'number' },
    { prop: 'date_entry_digital', name: 'Fecha Digital', valType: 'date', size: 150 },
    { prop: 'date_entry_physical', name: 'Fecha Fisico', valType: 'date', size: 150 },
    { prop: 'seal_number', name: 'Nro Precinto', valType: 'number' },
    { prop: 'observation', name: 'Observacion', valType: 'text', size: 300 },
    { prop: 'info', name: 'Info', pin: 'colPinEnd', valType: 'bool', cellTemplate: VGridVueTemplate(DataTableInfoDelete), size: 110, readonly: true },
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
const dbRecords = ref([])
const mergedRows = ref([])

let removeRecord = null
let websocket = null;
let filters = []

const fetchResources = async (reset = false) => {
    try {
        if (reset) loading.value = true;
        const { data } = await getRecordsInfoUser(userStore.token, filters);
        console.log(data)
        dbRecords.value = [...data]
        addEmptyRow()

        // Update the merged rows
        mergedRows.value = applyModifications()

        // Set loading to false after a delay
        if (reset) {
            setTimeout(() => {
                loading.value = false;
            }, 100);
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

const addEmptyRow = () => {
    var emptyRow = {}
    dbRecords.value.push(emptyRow)
    dbRecords.value.push(emptyRow)
    mergedRows.value = applyModifications()
}

const saveChanges = async () => {
    try {
        const reqData = {
            'token': userStore.token,
            'values': editedRecords.value
        }
        if (!isEmpty(reqData.values)) {
            clearEdited()
            const { data } = await saveRecordsUser(reqData)
            notiStore.newMessage(data.success ? data.message : data.error, data.success)
            fetchResources()
        } else {
            notiStore.newMessage('No hay valores para guardar', null, 5)
        }
    } catch (error) {
        notiStore.newMessage(error, false)
    }


}

const removeAssigned = async () => {
    const data = {
        'id_uxri': removeRecord.uxri_id,
        'token': userStore.token
    }
    const id = dbRecords.value.findIndex((item) => item.id_record == removeRecord.id_record)
    if (id != -1) {
        dbRecords.value.splice(id, 1)
        const res = await removeRecordUser(data)
        if (res.data.success) {
            notiStore.newMessage(res.data.message, true)
            fetchResources()
        } else {
            notiStore.newMessage(res.data.error, false)
        }
        infoModal.value = false
    } else {
        notiStore.newMessage('No existe este archivo', false)
    }
}

const changeRecordNum = async (e) => {
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
            notiStore.newMessage(res.data.message, true)
            await fetchResources()
        } else {
            notiStore.newMessage(res.data.error, false)
        }
    } else {
        const element_index = dbRecords.value.findIndex((item) => item.id_record == e.detail.model['id_record'])
        const element = dbRecords.value[element_index]
        dbRecords.value[element_index]['worked_on'] = true
        if (!Object.hasOwn(editedRecords.value, element['id_record'])) {
            editedRecords.value[element['id_record']] = {};
            editedRecords.value[element['id_record']]['worked_on'] = true
            editedRecords.value[element['id_record']]['uxri_id'] = e.detail.model['uxri_id']
        }
        editedRecords.value[element['id_record']][e.detail.prop] = e.detail.val;
    }
}

const clearEdited = () => {
    editedRecords.value = {}
    userRecordsStore.$reset()
    fetchResources()
}

function applyModifications() {
    return dbRecords.value.map(element => {
        const id = element.id_record;
        if (editedRecords.value[id]) {
            // Create a new object with properties from the element and modifications merged
            return { ...element, ...editedRecords.value[id] };
        }
        // If no modifications, return the original element
        return element;
    });
}
function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

onMounted(async () => {

    await fetchResources(true)
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