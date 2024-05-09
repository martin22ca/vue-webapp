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
        <Breadcrumbs />
        <div class="flex justify-center items-center ">
            <div class="max-w-3xl w-full p-8 bg-base-200 rounded-lg shadow">
                <div v-if="currentRole === null">
                    <h2 class="text-2xl font-bold mb-4">Selecionar Rol</h2>
                    <ul>
                        <li v-for="role in roles" :key="role.id" @click="currentRole = role"
                            class="cursor-pointer py-2 px-4 mb-2 rounded-md bg-blue-500 text-white hover:bg-blue-600">
                            {{ role.name }}
                        </li>
                    </ul>
                </div>

                <div v-else>
                    <h2 class="text-2xl font-bold mb-4">Detalles de {{ currentRole.name }} </h2>
                    <div class="flex mb-8">
                        <div class="w-1/2 pr-4">
                            <p class="font-semibold">Descripcion:</p>
                            <p>{{ currentRole.description }}</p>
                            <p class="font-semibold mt-4">Permisos:</p>
                            <p>{{ currentRole.permissions }}</p>
                            <!-- Add more role details as needed -->
                        </div>

                        <div class="w-1/2 pl-4 border-l">
                            <h3 class="text-lg font-semibold mb-2">Users with {{ currentRole.name }} Role</h3>
                            <ul>
                                <li v-for="user in currentRole.users" :key="user.id"
                                    class="py-2 px-4 mb-2 rounded-md bg-gray-200">
                                    {{ user.name }}
                                </li>
                            </ul>
                        </div>
                    </div>

                    <!-- Add edit role and manage users buttons or components here -->
                </div>
            </div>
        </div>

    </defaultLayout>
</template>


<script setup>
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import MCModal from "@/components/Modals/MCModal.vue";
import Toast from "@/components/Toast.vue";
import { Icon } from "@iconify/vue";
import { ref, onMounted, watch } from 'vue';
import defaultLayout from '@/layouts/defaultLayout.vue';
import { getRoles } from '@/services/roles'

const infoModal = ref(false)
const infoModalText = ref('')
const infoModalTitle = ref('')
const userModal = ref(false)
const toastSuccess = ref(false)
const toastVal = ref(false)
const toastText = ref('')
const loading = ref(true)
const rolesx = ref(null)
const currentRole = ref(null)

const roles = [
    { id: 1, name: 'Admin', description: 'Admin role', permissions: 'All', users: [{ id: 1, name: 'User 1' }, { id: 2, name: 'User 2' }] },
    { id: 2, name: 'Editor', description: 'Editor role', permissions: 'Limited', users: [{ id: 3, name: 'User 3' }] },
    // Add more roles as needed
]

const fetchRoles = async () => {
    const { data } = await getRoles()
    console.log(data)
    roles.value = data.data
    setTimeout(() => {
        loading.value = false
    }, 500)
}

onMounted(async () => {
    fetchRoles()
})

</script>
