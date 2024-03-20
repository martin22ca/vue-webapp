<template>
    <defaultLayout>
        <MCModal :modal-open="infoModal" :modal-text="infoModalText" :modal-title="infoModalTitle"
            :toggle-modal="() => { infoModal = !infoModal; }" class="text-xl">
            <div class="float-right">
                <button class=" m-2 btn btn-primary" @click="infoModal = false">
                    Cancelar
                </button>
                <button class="m-2 btn btn-error" @click="popUser()">
                    Eliminar
                </button>
            </div>
        </MCModal>
        <Toast :toast-open="toastVal" :toast-text="toastText" :toast-success="toastSuccess"
            :toggle-toast="() => { toastVal = !toastVal }"></Toast>
        <modalUser v-if="userModal" :modal-open="userModal" :user="userData"
            :toggleModal="() => { userModal = !userModal; fetchResources() }" />
        <div class="h-auto">
            <div class="text-sm breadcrumbs p-2">
                <ul>
                    <li><a>Home</a></li>
                    <li><a>Usuarios</a></li>
                </ul>
            </div>
            <div>
                <h1 class="text-2xl p-2">Usuarios</h1>
            </div>
            <DataTable rowSize="50" :rows="users" :cols="headers" :loading="loading" :columnTypes="columnTypes"
                @updateFilters="updateFilters">
                <template #table_options>
                    <button class="btn btn-secondary mx-2" @click="addUser()">
                        <Icon icon="material-symbols:add" class="text-xl text-neutral" /> User
                    </button>
                </template>
            </DataTable>
        </div>
    </defaultLayout>
</template>


<script setup>
import MCModal from "@/components/Modals/MCModal.vue";
import Toast from "@/components/Toast.vue";
import { VGridVueTemplate } from "@revolist/vue3-datagrid";
import modalUser from '@/components/Modals/modalUser.vue'
import DataTableInfo from "@/components/DataTable/DataTableInfo.vue";
import { usetableStore } from "@/store/tableStore";
import Plugin from "@revolist/revogrid-column-date";
import { Icon } from "@iconify/vue";
import { ref, onMounted, watch } from 'vue';
import { getUsers, removeUser } from '@/services/users'
import DataTable from '@/components/DataTable/DataTable.vue';
import defaultLayout from '@/layouts/defaultLayout.vue';

const headers = [
    { prop: 'id', name: 'ID', size: 75 },
    { prop: 'user_name', name: "Username" },
    { prop: 'first_name', name: "Nombre" },
    { prop: 'last_name', name: "Apellido" },
    { prop: 'address', name: 'Direccion' },
    { prop: 'cuil', name: 'Cuil', size: 200 },
    { prop: 'email_corp', name: 'Email Coorp', size: 150 },
    { prop: 'email_personal', name: 'Email Personal', size: 150 },
    { prop: 'phone', name: 'Telefono', },
    { prop: 'phone_alt', name: 'Telefono Alt' },
    { prop: 'start_date', name: "Fecha Comienzo", size: 150, columnType: 'date' },
    { prop: 'end_date', name: 'Fecha Fin', columnType: 'date' },
    { name: 'Acciones', size: 150, cellTemplate: VGridVueTemplate(DataTableInfo), readonly: true },
]
const infoModal = ref(false)
const infoModalText = ref('')
const infoModalTitle = ref('')
const userModal = ref(false)
const toastSuccess = ref(false)
const toastVal = ref(false)
const toastText = ref('')
const store = usetableStore()
const columnTypes = { 'date': new Plugin() };
const loading = ref(true)
const users = ref([])
const userData = ref(null)
let filters = []

const fetchResources = async () => {
    const { data } = await getUsers(filters)
    users.value = data
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

const addUser = () => {
    userData.value = null
    userModal.value = true
}


const popUser = async () => {
    infoModal.value = false
    const { data } = await removeUser(userData.value)
    if (data.success) {
        toastSuccess.value = true
        toastText.value = 'Usuario, ' + userData.value.user_name + ' Eliminado'
        toastVal.value = true
        fetchResources()
    } else {
        toastSuccess.value = false
        toastText.value = 'Error: ', data.error
        toastVal.value = true
    }
}


watch(
    () => store.id,
    (newValue) => {
        if (newValue != -1) {
            if (newValue == 1) {
                userData.value = store.data
                userModal.value = true
                store.$reset()
            }
            if (newValue == 2) {
                userData.value = store.data
                infoModalText.value = 'Estas Seguro que quiere eliminar el usuario: ' + userData.value.last_name + ', ' + userData.value.first_name + ' ?' + '\n' + ''
                infoModalTitle.value = 'Eliminar usuario: ' + userData.value.user_name
                infoModal.value = true
                console.log(userData.value)
                store.$reset()
            }
        }
    }
);
</script>
