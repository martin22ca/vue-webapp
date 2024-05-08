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
        <div class="flex" style="max-height: 80%;">
            <!-- Left Panel -->
            <div class="w-1/2 bg-gray-200">
                <!-- Left panel content -->
            </div>

            <!-- Right Panel -->
            <div class="w-1/2 bg-gray-300">
                <!-- Right panel content -->
                <div class="h-full flex flex-col">
                    <!-- Top part of right panel -->
                    <div class="bg-gray-400 p-4">
                        <!-- Content for the top part of the right panel -->
                    </div>

                    <!-- Bottom part of right panel (scrollable) -->
                    <div class="flex-1 overflow-y-auto">
                        <ul class="p-4">
                            <!-- List of elements -->
                            <li v-for="(item, index) in items" :key="index" class="py-2">
                                <!-- Render your list item content here -->
                                {{ item }}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

    </defaultLayout>
</template>


<script setup>
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import MCModal from "@/components/Modals/MCModal.vue";
import Toast from "@/components/Toast.vue";
import { usetableStore } from "@/store/tableStore";
import { Icon } from "@iconify/vue";
import { ref, onMounted, watch } from 'vue';
import defaultLayout from '@/layouts/defaultLayout.vue';
import { getUsersRoles } from '@/services/roles'

const infoModal = ref(false)
const infoModalText = ref('')
const infoModalTitle = ref('')
const userModal = ref(false)
const toastSuccess = ref(false)
const toastVal = ref(false)
const toastText = ref('')
const store = usetableStore()
const loading = ref(true)
const users = ref([])
const userData = ref(null)
let filters = []

const fetchUserRoles = async () => {
    const { data } = await getUsersRoles(filters)
    users.value = data.data
    setTimeout(() => {
        loading.value = false
    }, 500)
}

onMounted(async () => {
    fetchUserRoles()
})


const popUser = async () => {
    infoModal.value = false
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
