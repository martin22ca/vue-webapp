<template>
    <defaultLayout>
        <Toast :toast-open="toastVal" toast-text="Test"  :toggle-toast="() => { toastVal = !toastVal }"></Toast>
        <MCModal :modalOpen="userModal" modalTitle="Usuario" :toggleModal="() => { userModal = !userModal }">
            <modalUser v-if="userModal" :user="userData" :toggleModal="() => { userModal = !userModal }" />
        </MCModal>
        <div class="bg-base-300 h-auto">
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
                        <Icon icon="material-symbols:add" class="text-xl text-neutral" /> Usuario
                    </button>
                    <button class="btn btn-secondary mx-2">
                        <Icon icon="material-symbols:add" class="text-xl text-neutral" /> Roles
                    </button>
                </template>
            </DataTable>
        </div>
    </defaultLayout>
</template>


<script setup>
import Toast from "@/components/Toast.vue";
import MCModal from "@/components/Modals/MCModal.vue";
import { VGridVueTemplate } from "@revolist/vue3-datagrid";
import modalUser from '@/components/Modals/modalUser.vue'
import DataTableUser from "@/components/DataTable/DataTableUser.vue";
import { usetableStore } from "@/store/tableStore";
import Plugin from "@revolist/revogrid-column-date";
import { Icon } from "@iconify/vue";
import { ref, onMounted, watch } from 'vue';
import { getUsers } from '@/services/users'
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
    { name: 'Acciones', cellTemplate: VGridVueTemplate(DataTableUser), readonly: true },
]

const userModal = ref(false)
const toastVal = ref(true)
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


watch(
    () => store.id,
    (newValue) => {
        if (newValue != -1) {
            console.log('newVal', store.data)
            userData.value = store.data
            userModal.value = true
            store.$reset()
        }
    }
);
</script>
