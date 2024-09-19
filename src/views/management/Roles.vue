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
        <div v-if="currentRole === null" class="fadeRight h-full">
            <section class="flex justify-center items-center mt-auto h-full">
                <div class="max-w-4xl w-full p-8 bg-base-200 rounded-lg shadow">
                    <h2 class="bg-base-100 my-2 py-2 rounded">Roles Disponibles</h2>
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
            </section>
        </div>
        <div v-else class="fadeLeft flex flex-row" style="height: 93vh; max-height: 93vh">
            <RoleEdit v-if="currentRole != null" ref="childComponentRef" class="basis-5/12 h-full"
                :role="currentRole" />
            <div class="basis-7/12 h-full flex flex-col">
                <div
                    class="bg-base-200 header flex flex-row gap-4 justify-between items-center ml-2 px-4 mx-1 mb-4 rounded-xl shadow ">
                    <h2 class="card-title text-4xl py-4">
                        Usuarios
                    </h2>
                    <button class="btn btn-secondary btn-circle mt-4" @click="currentRole = null; fetchRoles()">
                        <Icon icon="mdi:keyboard-return" class="text-xl"></Icon>
                    </button>
                </div>
                <div class="bg-base-200 rounded-xl shadow ml-2 mr-2 h-full flex flex-col">
                    <Autocomplete :items="availableUsers" text="user_name" key="id" :multiple="true"
                        class="m-2 mt-4 w-full" v-model="selectedItems" :select-new="addVal">
                    </Autocomplete>
                    <div class="flex bg-base-200 m-2">
                        <div class="w-full p-2 rounded-lg ">
                            <h3 class="mb-2"> Usuarios: {{ currentRole.title }}</h3>
                            <ul style="overflow-y: scroll; max-height: 45vh;">
                                <li v-for="selected in selectedItems" :key="selected.id"
                                    class="py-2 px-4 mb-2 rounded-md bg-neutral text-white flex justify-between items-center">
                                    <div>
                                        Usuario
                                        <div class="badge badge-lg badge-primary">{{ selected.user_name }}</div>
                                    </div>
                                    <div>
                                        Nombre
                                        <div class="badge badge-lg badge-primary">{{ selected.last_name }}, {{
                                            selected.first_name }}</div>
                                    </div>
                                    <button class="btn btn-sm btn-error btn-circle"
                                        @click="removeVal(selected)">✕</button>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <span class="grow" />
                    <div class="flex flex-row gap-4 place-items-end ">
                        <button class="btn btn-primary m-auto my-2 mr-4 mb-4 " @click="saveChange()">
                            Guardar <Icon icon="mdi:content-save" class="text-xl"></Icon>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </defaultLayout>
</template>


<script setup>
import { computed, readonly } from 'vue';
import Header from '@/components/Header.vue';
import MCModal from "@/components/Modals/MCModal.vue";
import Autocomplete from '@/components/Autocomplete.vue';
import RoleEdit from '@/components/CRUDs/RoleEdit.vue';
import Toast from "@/components/Toast.vue";
import { Icon } from '@iconify/vue';
import { ref, onMounted, watch } from 'vue';
import defaultLayout from '@/layouts/defaultLayout.vue';
import { getRoles } from '@/services/roles'
import { getUsersByRole, getUsers } from '@/services/users'
import { updateRole } from '@/services/roles';
import { notificationsStore } from '@/store/notificationsStore';

const infoModal = ref(false)
const infoModalText = ref('')
const infoModalTitle = ref('')
const toastSuccess = ref(false)
const toastVal = ref(false)
const toastText = ref('')
const loading = ref(true)
const roles = ref([])
const currentRole = ref(null)
const childComponentRef = ref(null)
const notifications = notificationsStore()

const allUsers = ref([])
const selectedItems = ref([])


const sortedRoles = computed(() => {
    return roles.value.slice().sort((a, b) => a.id - b.id);
});

const addVal = (v) => {
    selectedItems.value.push(v)
}

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
    if (data.success) {
        selectedItems.value = [...data.data]
        setTimeout(() => {
            loading.value = false
        }, 500)
    }
}

const fetchAllUsers = async () => {
    const { data } = await getUsers([])
    if (data.success) {
        allUsers.value = [...data.data]
    }
}

const removeVal = (val) => {
    const index = selectedItems.value.findIndex(item => item.id === val.id);
    if (index !== -1) {
        selectedItems.value.splice(index, 1);
    }
};


const availableUsers = computed(() => {
    const selectedUserIds = selectedItems.value.map(user => user.id);

    return allUsers.value.filter(user =>
        !selectedUserIds.includes(user.id)
    );
});

const saveChange = async () => {
    if (childComponentRef.value) {
        const values = await childComponentRef.value.getValues()
        values['id_users'] = selectedItems.value.map(e => e.id)
        console.log('Values from child component:', values)
        const { data } = await updateRole(values)
        if (data.success) {
            currentRole.value = null
        }
        else {
            notifications.newMessage(data.error, false)
        }
    }
}


onMounted(async () => {
    fetchRoles()
    fetchAllUsers()
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