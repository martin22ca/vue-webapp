<template>
    <defaultLayout>
        <div class="h-auto">
            <Breadcrumbs/>
            <h2 class="p-2">Prestadores</h2>
            <modalProvider v-if="providerModal" :modal-open="providerModal" :provider="providerData"
                :toggleModal="() => { providerModal = !providerModal; toastText = 'Usuario Actualizado/Creado'; toastSuccess = true; toastVal = !toastVal; fetchResources() }" />
            <Toast :toast-open="toastVal" :toast-text="toastText" :toast-success="toastSuccess"
                :toggle-toast="() => { toastVal = !toastVal }"></Toast>
            <DataTable :rows="providers" :cols="headers" :loading="loading" @updateFilters="updateFilters">
                <template #table_options>
                    <button class="btn btn-secondary mx-2" @click="addProvider()" disabled>
                        <Icon icon="material-symbols:add" class="text-xl text-neutral" /> Prestador
                    </button>
                </template>
            </DataTable>
        </div>
    </defaultLayout>
</template>

<script setup>
import Breadcrumbs from "@/components/Breadcrumbs.vue";
import Toast from "@/components/Toast.vue";
import modalProvider from "@/components/Modals/modalProvider.vue";
import { Icon } from "@iconify/vue";
import { VGridVueTemplate } from "@revolist/vue3-datagrid";
import { ref, onMounted, watch } from 'vue';
import DataTableInfo from "@/components/DataTable/DataTableInfo.vue";
import DataTable from '@/components/DataTable/DataTable.vue';
import defaultLayout from '@/layouts/defaultLayout.vue';
import { getProviders } from '@/services/providers'
import { usetableStore } from "@/store/tableStore";

const headers = [
    { prop: 'id', name: 'ID', editor: 'number', pin: 'colPinStart', autoSize: true, valType: 'number', editable: false },
    { prop: 'coordinator_number', name: 'Coordinador', autoSize: true, valType: 'number', editable: false },
    { prop: 'cuit', name: 'CUIT', valType: 'string' },
    { prop: 'business_name', name: 'Razon Social', editor: 'text', size: 200, valType: 'string', editable: false },
    { prop: 'business_location', name: 'Locaclidad', size: 200, valType: 'string', editable: false, filter: 'string' },
    { prop: 'sancor_zone', name: 'Zona Sancor', size: 200, valType: 'string', editable: false },
    { prop: 'observation', name: 'Observacion', size: 200, valType: 'string', editable: false },
    { prop: 'status', name: 'Prioridad', size: 200, valType: 'number', editable: false },
    { prop: 'id_pecularity', name: 'Particularidad', size: 200, valType: 'number' },
    { name: 'Acciones', cellTemplate: VGridVueTemplate(DataTableInfo), readonly: true, size: 150 },
]

const store = usetableStore()
const infoModal = ref(false)
const infoModalText = ref('')
const infoModalTitle = ref('')
const providerModal = ref(false)
const toastSuccess = ref(false)
const toastVal = ref(false)
const toastText = ref('')
let providerData = null

let filters = []
const providers = ref([])
const loading = ref(true)

const fetchResources = async () => {
    const { data } = await getProviders(filters)
    providers.value = data
    setTimeout(() => {
        loading.value = false
    }, 500)
}

const addProvider = () => {
    providerData = null
    providerModal.value = true
}


const updateFilters = (appliedFilters) => {
    filters = appliedFilters;
    fetchResources()
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

onMounted(async () => {
    fetchResources()
})

watch(
    () => store.id,
    (newValue) => {
        if (newValue != -1) {
            if (newValue == 1) {
                providerData = store.data
                providerModal.value = true
                store.$reset()
            }
            if (newValue == 2) {
                providerData = store.data
                console.log(providerData)
                store.$reset()
            }
        }
    }
);

</script>