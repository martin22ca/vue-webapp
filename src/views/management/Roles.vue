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
        <modalAddToRole v-if="userRoleModal" :modal-open="userRoleModal" :existing-users="userByRoles"
            :toggle-modal="() => { userRoleModal = false; fetchUsersRoll() }" :id-role="currentRole.id" />
        <Toast :toast-open="toastVal" :toast-text="toastText" :toast-success="toastSuccess"
            :toggle-toast="() => { toastVal = !toastVal }"></Toast>

        <Breadcrumbs />
        <h2 class="p-2" v-if="currentRole == null">Selecionar Rol</h2>
        <div v-if="currentRole === null" class="fadeRight">
            <div class="flex justify-center items-center ">
                <div class="max-w-3xl w-full p-8 bg-base-200 rounded-lg shadow">
                    <ul>
                        <li v-for="role in sortedRoles" :key="role.id"
                            class="py-2 px-4 mb-2 rounded-md bg-neutral text-white flex justify-between items-center">
                            <div @click="currentRole = role">
                                <h3>{{ role.id }} - {{ role.title }}</h3>
                                <p class="truncate"> {{ role.description }}</p>
                            </div>
                            <button class="btn btn-primary" @click="selectRole(role)">Selecionar</button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div v-else class="fadeLeft flex">
            <div style="width: 50%;">
                <RoleEdit v-if="currentRole != null" :role="currentRole"
                    :clear-prop="() => { currentRole = null; fetchRoles() }" />
            </div>
            <DataTable v-if="currentRole != null" style="max-width: 50%;" :rows="userByRoles" :cols="userHeaders"
                :loading="loading">
                <template #table_options>
                    <button class="btn btn-secondary mx-2" @click="userRoleModal = true">
                        <Icon icon="material-symbols:add" class="text-xl text-neutral" /> User
                    </button>
                </template>
            </DataTable>

        </div>

    </defaultLayout>
</template>


<script setup>
import { computed, readonly } from 'vue';
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import MCModal from "@/components/Modals/MCModal.vue";
import modalAddToRole from '@/components/Modals/modalAddToRole.vue';
import DataTable from '@/components/DataTable/DataTable.vue';
import RoleEdit from '@/components/CRUDs/RoleEdit.vue';
import Toast from "@/components/Toast.vue";
import { Icon } from "@iconify/vue";
import { ref, onMounted, watch } from 'vue';
import defaultLayout from '@/layouts/defaultLayout.vue';
import { getRoles } from '@/services/roles'
import { getUsersByRole } from '@/services/users'

const infoModal = ref(false)
const infoModalText = ref('')
const infoModalTitle = ref('')
const userRoleModal = ref(false)
const toastSuccess = ref(false)
const toastVal = ref(false)
const toastText = ref('')
const loading = ref(true)
const roles = ref([])
const userByRoles = ref([])
const currentRole = ref(null)

const userHeaders = [
    { prop: 'id', name: 'ID', pin: 'colPinStart', size: 75, readonly: 'true' },
    { prop: 'user_name', size: 150, name: "Username", readonly: 'true' },
    { prop: 'first_name', size: 150, name: "Nombre", readonly: 'true' },
    { prop: 'last_name', size: 150, name: "Apellido", readonly: 'true' },
]

const sortedRoles = computed(() => {
    return roles.value.slice().sort((a, b) => a.id - b.id);
});

const fetchRoles = async () => {
    const { data } = await getRoles()
    console.log(data)
    roles.value = data.data
}

const selectRole = (role) => {
    currentRole.value = role
    fetchUsersRoll()
}

const fetchUsersRoll = async () => {
    const { data } = await getUsersByRole(currentRole.value['id'])
    console.log(data)
    userByRoles.value = data.data
    setTimeout(() => {
        loading.value = false
    }, 500)
}

onMounted(async () => {
    fetchRoles()
})

</script>

<style>
.truncate {
    width: 25vw;
    /* Adjust the width as needed */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>