<template>
    <defaultLayout>
        <dialog class="modal" :open="modalVisible" style="background-color: oklch(var(--b3)/.8);">
            <div class="modal-box max-w-7xl bg-base-200">
                <form method="dialog">
                    <button @click="modalVisible = false; fetchResources()"
                        class="btn btn-sm btn-circle btn-error absolute right-2 top-2">✕</button>
                </form>
                <ModalUser v-if="modalVisible" :user="selectedUser" />
            </div>
        </dialog>
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
                    <button class="btn btn-secondary mx-2" @click="manageUser(null)">
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
import Plugin from "@revolist/revogrid-column-date";
import ModalUser from "@/components/Modals/ModalUser.vue";
import { Icon } from "@iconify/vue";
import { ref, onMounted } from 'vue';
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
    { name: 'Acciones' },
]

const columnTypes = { 'date': new Plugin() };
const loading = ref(true)
const users = ref([])
const modalVisible = ref(false)
const selectedUser = ref(null)
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

const manageUser = (userRow) => {
    if (!userRow) {
        selectedUser.value = null
    } else {

        selectedUser.value = userRow
    }
    console.log(selectedUser.value)
    modalVisible.value = true
}

</script>
