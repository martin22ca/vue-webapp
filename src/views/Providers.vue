<template>
    <defaultLayout>
        <div class="h-auto">
            <Breadcrumbs title="Provedores" />
            <modalProvider v-if="providerModal" :modal-open="providerModal" :provider="providerData"
                :toggleModal="closeModal" />
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
    { prop: 'id_provider', name: 'ID', editor: 'number', pin: 'colPinStart', autoSize: true, valType: 'number', readonly: true },
    { prop: 'id_coordinator', name: 'Coordinador', autoSize: true, valType: 'number', readonly: true },
    { prop: 'coordinator_business_name', name: 'Razon Coord', autoSize: true, valType: 'string', readonly: true },
    { prop: 'cuit', name: 'CUIT', valType: 'string', readonly: true },
    { prop: 'business_name', name: 'Razon Social', editor: 'text', size: 200, valType: 'string', readonly: true },
    { prop: 'business_location', name: 'Locaclidad', size: 200, valType: 'string', readonly: true, filter: 'string', readonly: true },
    { prop: 'sancor_zone', name: 'Zona Sancor', size: 200, valType: 'string', readonly: true },
    { prop: 'observation', name: 'Observacion', size: 200, valType: 'string', readonly: true },
    { prop: 'priority', name: 'Prioridad', cellTemplate: VGridVueTemplate(DataTableWarnText), size: 150, valType: 'text', readonly: true },
    { prop: 'part_g_salud', name: 'Particularidad G_salud', cellTemplate: VGridVueTemplate(DataTableExists), size: 150, valType: 'text', readonly: true },
    { prop: 'part_prevencion', name: 'Particularidad Prevencion', cellTemplate: VGridVueTemplate(DataTableExists), size: 150, valType: 'text', readonly: true },
    { prop: 'info', name: 'Acciones', cellTemplate: VGridVueTemplate(DataTableInfo), readonly: true,pin: 'colPinEnd', size: 100 },
]

const notiStore = notificationsStore()
const store = usetableStore()
const providerModal = ref(false)
let providerData = null

let filters = []
const providers = ref([])
const loading = ref(true)

const fetchResources = async () => {
    loading.value = true
    const { data } = await getProviders(filters)
    if (data.success) {
        console.log(data.data)
        setTimeout(() => {
            loading.value = false
            providers.value = data.data
        }, 1000)

    } else {
        notiStore.newMessage(data.error, false)
    }
}

const closeModal = (refetch = false) => {
    providerModal.value = !providerModal.value;
    if (refetch) fetchResources();
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
