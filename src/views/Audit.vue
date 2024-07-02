<template>
    <defaultLayout>
        <div class="h-auto">
            <Breadcrumbs />
            <h2 class="p-2">Auditor</h2>
            <UniverSheet id="sheet" table-name="Expedientes" :loading="loading" ref="univerRef" :cols="headers"
                :rows="records" @updateFilters="updateFilters">
            </UniverSheet>
        </div>
    </defaultLayout>
</template>

<script setup>
import { Icon } from "@iconify/vue";
import Breadcrumbs from "@/components/Breadcrumbs.vue";
import { notificationsStore } from "@/store/notificationsStore";
import { VGridVueTemplate } from "@revolist/vue3-datagrid";
import { ref, onMounted, watch } from 'vue';
import UniverSheet from '@/components/Spreadsheet/UniverSheet.vue'
import DataTableInfo from "@/components/DataTableUI/DataTableInfo.vue";
import DataTableExists from '@/components/DataTableUI/DataTableExists.vue'
import defaultLayout from '@/layouts/defaultLayout.vue';
import { getRecordsAudit } from '@/services/records'
import { userDataStore } from '@/store/userStore';
import { usetableStore } from "@/store/tableStore";

const headers = [
    { prop: 'id_record', name: 'ID Expediente', valType: 'number'},
    { prop: 'part_g_salud', name: 'Part. G salud', size: 150, valType: 'string' },
    { prop: 'part_prevencion', name: 'Part. prevencion', size: 150, valType: 'string' },
    { prop: 'priority_status', name: 'Prioridad', size: 150, valType: 'string' },
    { prop: 'id_provider_key', name: 'ID Prestador', valType: 'number'},
    { prop: 'lot_key', name: 'ID Lote', valType: 'string' },
    { prop: 'business_name', name: 'Razon Social', editor: 'text', size: 200, valType: 'string', editable: false },
    { prop: 'business_location', name: 'Locaclidad', size: 200, valType: 'string' },
    { prop: 'id_coordinator', name: 'ID Coordinador', size: 200, valType: 'number'},
    { prop: 'record_total', name: 'Monto', size: 200, valType: 'number'},
    { prop: 'date_asignment', name: 'Fecha Asignacion', size: 200, valType: 'date'},
    { prop: 'observation', name: 'Observacion', size: 200, valType: 'string' },
]


const userStore = userDataStore()
const notiStore = notificationsStore()


const store = usetableStore()
const infoModal = ref(false)
const providerModal = ref(false)
let providerData = null

const univerRef = ref(null);

let filters = []
const records = ref([])
const loading = ref(true)

const fetchResources = async () => {
    loading.value = true
    const { data } = await getRecordsAudit (userStore.token, filters)
    setTimeout(() => {
        loading.value = false
        records.value = data.data
        console.log(records.value)
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
 *             <DataTable :rows="providers" :cols="headers" :loading="loading" @updateFilters="updateFilters">
                <template #table_options>
                    <button class="btn btn-secondary mx-2" @click="addProvider()" disabled>
                        <Icon icon="material-symbols:add" class="text-xl text-neutral" /> Prestador
                    </button>
                </template>
            </DataTable>
 */

</script>