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
        <div class="h-auto">
            <div class="text-sm breadcrumbs p-2">
                <ul>
                    <li><a>Home</a></li>
                    <li><a>Roles</a></li>
                </ul>
            </div>
            <div>
                <h1 class="text-2xl p-2">Roles</h1>
            </div>
            <div>
                <div class="bg-base-200 px-4 rounded-xl overflow-y-auto mx-1 shadow" style="max-height: 70vh;">
                    <!--This DIV is for the mounted -->
                    Ciao
                </div>
                <div className="grid grid-cols-2 grid-rows-1 gap-3 overflow-y-auto" style="max-height: 80vh;">
                    <!--This DIV is for all users-->
                    <div>
                        <h2 class="text-xl mb-2">Columnas disponibles</h2>
                        {{ users }}
                        <draggable class="dragArea list-group" :list="users"
                            :group="{ name: 'columns' }" item-key="id_user" >
                            <template #item="{ element }">
                                <div class="list-group-item">
                                    <div class="my-1 p-2 bg-base-200 rounded-lg justify-between flex flex-row">
                                        <div>
                                            <Icon icon="mdi:drag" class="text-2xl handle" />
                                        </div>
                                        <div>
                                            {{ element.user_name }}
                                        </div>
                                        <button class="" />
                                    </div>
                                </div>
                            </template>
                        </draggable>
                    </div>
                </div>
            </div>
        </div>
    </defaultLayout>
</template>


<script setup>
import draggable from 'vuedraggable'
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
