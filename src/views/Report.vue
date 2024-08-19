<template>
    <defaultLayout>
        <Breadcrumbs />
        <h2 class="p-2" v-if="currentReport == null">Reportes disponibles</h2>
        <div v-if="currentReport === null" class="fadeRight">
            <div class="flex justify-center items-center ">
                <div class="max-w-3xl w-full p-8 bg-base-200 rounded-lg shadow">
                    <ul>
                        <li v-for="report in sortedReports" :key="report.id"
                            class="py-2 px-4 mb-2 rounded-md bg-neutral text-white flex justify-between items-center">
                            <div>
                                <h3>{{ report.id }} - {{ report.title }}</h3>
                                <p class="truncate"> {{ report.description }}</p>
                            </div>
                            <button class="btn btn-primary" @click="selectRole(report)">Generar Reporte</button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div v-else class="fadeRight flex flex-col">
            <div class=" " style="height: 10%">
                <div class="bg-base-200 my-2 px-4 rounded-xl mx-1 shadow">
                    <h3 class="card-title py-4 flex flex-row">
                        Reporte: <div class="badge badge-lg badge-primary ">{{ currentReport.title }}</div>
                        <span class="grow"></span>
                        <button class="btn btn-secondary btn-circle mt-4" @click="clearReport()">
                            <Icon icon="mdi:keyboard-return" class="text-xl"></Icon>
                        </button>
                    </h3>


                    <MCInput class="grow" textIcon="mdi:text" textLabel="Detalles">
                        <div class="textarea textarea-bordered w-full h-full">
                            {{ currentReport.description }}
                        </div>
                    </MCInput>
                </div>
                <div class="bg-base-200 my-4 px-4 rounded-xl mx-1 shadow" style="max-height: 90vh;">

                </div> <!--This DIV-->
            </div>
            <div class="fadeLeft">
                <DataTable :rows="reportItems" :cols="tempHeaders" :btnFilters="true" :loading="loading"
                    @updateFilters="updateFilters" class="mr-2" :rowSize="50">
                </DataTable>
            </div>

        </div>



    </defaultLayout>
</template>

<script setup>
import { watch, computed, readonly } from 'vue';
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import { Icon } from '@iconify/vue';
import defaultLayout from '@/layouts/defaultLayout.vue';
import { onMounted, ref } from 'vue';
import { usetableStore } from '@/store/tableStore';
import MCInput from '@/components/MCInput.vue';
import DataTable from '@/components/Spreadsheet/DataTable.vue'
import { getReports, getReport } from '@/services/reports'

const headers = ref([])
const tempHeaders = [
    { prop: 'record_key', name: 'ID Expediente', pin: 'colPinStart', size: 120, valType: 'text' },
    { prop: 'id_provider', name: 'Prestador', size: 120, valType: 'number', },
    { prop: 'business_name', name: 'Razon Social', size: 170, valType: 'text' },
    { prop: 'id_coordinator', name: 'Coordinador', size: 120, valType: 'number' },
    { prop: 'priority_case', name: 'Prioridad', size: 120, valType: 'text', readonly: true },
    { prop: 'particularity_mixed', name: 'Particularidad', valType: 'number', size: 100, readonly: true },
    { prop: 'record_total', name: 'Monto Total', size: 120, valType: 'text' },
    { prop: 'user_name', name: 'Auditor Asignado', size: 170, valType: 'text' },
    { prop: 'date_assignment_audit', name: 'Fecha Asignacion Auditor', size: 150, valType: 'date' },
    { prop: 'date_entry_digital', name: 'Entada Digital', size: 150, valType: 'date' },
    { prop: 'date_entry_physical', name: 'Entrada Fisico', size: 150, valType: 'date' },
    { prop: 'seal_number', name: 'Precinto', valType: 'text' },
    { prop: 'observation', name: 'Observacion', size: 250, valType: 'text' },

]
let filters = []
const store = usetableStore()
const reports = ref([])
const currentReport = ref(null)
const loading = ref(true)

const reportItems = ref([])

const clearReport = () => {
    currentReport.value = null
}

const fetchResources = async () => {
    loading.value = true
    const { data } = await getReports([])
    if (data.success) {
        reports.value = data.data
        setTimeout(() => {
            loading.value = false
        }, 100)
    }
}

const generateReport = async () => {
    loading.value = true
    const { data } = await getReport(filters, currentReport.value.id)
    if (data.success) {
        reportItems.value = data.data
        setTimeout(() => {
            loading.value = false
        }, 100)
    }
}

onMounted(async () => {
    fetchResources()
})

const sortedReports = computed(() => {
    return reports.value.slice().sort((a, b) => a.id - b.id);
});

const selectRole = async (report) => {
    currentReport.value = report
    headers.value.push('hellos')
    await generateReport()
}

const updateFilters = (appliedFilters) => {
    filters = appliedFilters;
    generateReport()
}

watch(
    () => store.id,
    (newValue) => {
        if (newValue != -1) {
            if (newValue == 1) {
                feedback.value = store.data
                feedbackModal.value = true
                store.$reset()
            }
        }
    },
    () => feedbackModal.value,
    (newV) => {
        console.log(newV)
    }
);
</script>


<style scoped>
.tableContainer {
    max-width: 100%;
    overflow-x: auto;
}

.truncate {
    width: 20vw;
    /* Adjust the width as needed */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>