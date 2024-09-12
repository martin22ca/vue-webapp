<template>
    <defaultLayout>
        <modalFeedback v-if="feedbackModal" :feedback="feedback" :clearProp="toggleModal" />
        <Header title="Informacion de Reportes" />
        <DataTable :rows="reports" :cols="headers" :btnFilters="true" :loading="loading" @updateFilters="updateFilters" :rowSize="50">
        </DataTable>

    </defaultLayout>
</template>

<script setup>
import { watch } from 'vue';
import Header from '@/components/Header.vue';
import { VGridVueTemplate } from '@revolist/vue3-datagrid';
import defaultLayout from '@/layouts/defaultLayout.vue';
import { onMounted, ref } from 'vue';
import { usetableStore } from '@/store/tableStore';
import modalFeedback from '@/components/Modals/modalFeedback.vue';
import DataTableCheckbox from '@/components/DataTableUI/DataTableCheckbox.vue';
import DataTablePriorities from '@/components/DataTableUI/DataTablePriorities.vue';
import DataTableInfo from '@/components/DataTableUI/DataTableInfo.vue'
import DataTable from '@/components/Spreadsheet/DataTable.vue'
import { getFeedback } from '@/services/feedback'

const headers = [
    { prop: 'date_report', name: 'Fecha reporte', pin: 'colPinStart', size: 150, valType: 'date' },
    { prop: 'is_bug', name: 'Es error?', cellTemplate: VGridVueTemplate(DataTableCheckbox), valType: 'boolean' },
    { prop: 'priority', name: 'Prioridad', cellTemplate: VGridVueTemplate(DataTablePriorities), size: 100, valType: 'number' },
    { prop: 'title', name: 'Titulo', size: 200, valType: 'text' },
    { prop: 'description', name: 'Descripcion', size: 300, valType: 'date' },
    { name: 'Acciones', size: 100, pin: 'colPinEnd', prop: [1, 2], cellTemplate: VGridVueTemplate(DataTableInfo), readonly: true },
]
let filters = []
const store = usetableStore()
const reports = ref([])
const feedback = ref(null)
const feedbackModal = ref(false)
const loading = ref(true)

const fetchResources = async () => {
    loading.value = true
    const { data } = await getFeedback(filters)
    console.log(data.data)
    if (data.success) {
        reports.value = data.data
        setTimeout(() => {
            loading.value = false
        }, 100)
    }
}

onMounted(async () => {
    fetchResources()
})

const toggleModal = (refresh = false) => {
    feedbackModal.value = !feedbackModal.value
    if (refresh) { fetchResources() }
}

const updateFilters = (appliedFilters) => {
    filters = appliedFilters;
    fetchResources()
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
</style>