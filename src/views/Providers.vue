<template>
    <defaultLayout>
        <div class="h-auto">
            <Breadcrumbs title="Provedores"/>
            <modalProvider v-if="providerModal" :modal-open="providerModal" :provider="providerData"
                :toggleModal="() => { providerModal = !providerModal; toastText = 'Usuario Actualizado/Creado'; toastSuccess = true; toastVal = !toastVal; fetchResources() }" />
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
import { Icon } from "@iconify/vue";
import Breadcrumbs from "@/components/Breadcrumbs.vue";
import { notificationsStore } from "@/store/notificationsStore";
import modalProvider from "@/components/Modals/modalProvider.vue";
import { VGridVueTemplate } from "@revolist/vue3-datagrid";
import { ref, onMounted, watch } from 'vue';
import DataTable from '@/components/Spreadsheet/DataTable.vue'
import DataTableInfo from "@/components/DataTableUI/DataTableInfo.vue";
import DataTableExists from '@/components/DataTableUI/DataTableExists.vue'
import DataTableWarnText from "@/components/DataTableUI/DataTableWarnText.vue";
import defaultLayout from '@/layouts/defaultLayout.vue';
import { getProviders } from '@/services/providers'
import { usetableStore } from "@/store/tableStore";

const headers = [
    { prop: 'id_provider', name: 'ID', editor: 'number', pin: 'colPinStart', autoSize: true, valType: 'number', editable: false },
    { prop: 'id_coordinator', name: 'Coordinador', autoSize: true, valType: 'number', editable: false },
    { prop: 'cuit', name: 'CUIT', valType: 'string' },
    { prop: 'business_name', name: 'Razon Social', editor: 'text', size: 200, valType: 'string', editable: false },
    { prop: 'business_location', name: 'Locaclidad', size: 200, valType: 'string', editable: false, filter: 'string' },
    { prop: 'sancor_zone', name: 'Zona Sancor', size: 200, valType: 'string', editable: false },
    { prop: 'observation', name: 'Observacion', size: 200, valType: 'string', editable: false },
    { prop: 'priority', name: 'Prioridad', cellTemplate: VGridVueTemplate(DataTableWarnText), size: 150, valType: 'text', editable: false },
    { prop: 'part_g_salud', name: 'Particularidad G_salud', cellTemplate: VGridVueTemplate(DataTableExists), size: 100, valType: 'text' },
    { prop: 'part_prevencion', name: 'Particularidad Prevencion', cellTemplate: VGridVueTemplate(DataTableExists), size: 100, valType: 'text' },
    { prop: { 'info': 1 }, name: 'Acciones', cellTemplate: VGridVueTemplate(DataTableInfo), readonly: true, size: 150 },
]

const notiStore = notificationsStore()
const store = usetableStore()
const infoModal = ref(false)
const providerModal = ref(false)
let providerData = null

const univerRef = ref(null);

let filters = []
const providers = ref([])
const loading = ref(true)

const fetchResources = async () => {
    loading.value = true
    const { data } = await getProviders(filters)
    console.log(data)
    setTimeout(() => {
        loading.value = false
        providers.value = data.data
    }, 1000)
}

const updateFilters = (appliedFilters) => {
    filters = appliedFilters;
    fetchResources()
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
/**

 */

</script>
