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
        <h2 class="text-2xl p-2">Roles</h2>
        <div class="flex gap-2 m-2 max-w-full">
            <div class="bg-base-200 rounded-xl" :class="currentRole != null ? ' basis-1/3' : 'w-full'">
                <table class="table-auto w-full">
                    <thead>
                        <tr>
                            <th class="px-4 py-2">ID</th>
                            <th class="px-4 py-2">Title</th>
                            <th class="px-4 py-2">Description</th>
                            <th class="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="role in roles" :key="role.id">
                            <td class="border px-4 py-2">{{ role.id }}</td>
                            <td class="border px-4 py-2">{{ role.title }}</td>
                            <td class="border px-4 py-2">{{ role.description }}</td>
                            <td class="border px-4 py-2">
                                <button @click="viewConfig(role)"
                                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                    View Config
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div v-if="currentRole != null" class="bg-base-200 basis-2/3">
                hola
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
const roles = ref(null)
const currentRole = ref(null)

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
