<template>
    <defaultLayout>
        <div class="text-sm breadcrumbs p-2">
            <ul>
                <li><a>Home</a></li>
                <li><a>Expedientes</a></li>
            </ul>
        </div>
        <h1 class="text-2xl p-2">Expedientes</h1>
        <DataTable :rows="records" :cols="headers" :loading="loading" @updateFilters="updateFilters" class="w-full mr-2"
            :rowSize="60">
        </DataTable>
    </defaultLayout>
</template>

<script setup>
import { VGridVueTemplate } from '@revolist/vue3-datagrid';
import defaultLayout from '@/layouts/defaultLayout.vue';
import { onMounted, ref } from 'vue';
import DataTableProgres from '@/components/DataTable/DataTableProgres.vue';
import DataTable from '@/components/DataTable/DataTable.vue';
import { getRecords } from '@/services/records'

const headers = [
    { prop: 'id', name: 'id', pin: 'colPinStart', valType: 'number' },
    { prop: 'id_provider', name: 'Prestador', valType: 'number' },
    { prop: 'date_liquid', name: 'fecha_liquid', valType: 'date' },
    { prop: 'date_recep', name: 'fecha_recep', valType: 'date' },
    { prop: 'date_audi_vto', name: 'fecha_audi_vto', valType: 'date' },
    { prop: 'date_period', name: 'Periodo', valType: 'date' },
    { prop: 'record_type', name: 'Tipo', valType: 'text' },
    { prop: 'totcal', name: 'totcal', valType: 'text' },
    { prop: 'bruto', name: 'bruto', valType: 'text' },
    { prop: 'ivacal', name: 'ivacal', valType: 'text' },
    { prop: 'prestac_grava', name: 'prestac_grava', valType: 'text' },
    { prop: 'debcal', name: 'debcal', valType: 'text' },
    { prop: 'inter_debcal', name: 'inter_debcal', valType: 'text' },
    { prop: 'debito', name: 'debito', valType: 'text' },
    { prop: 'debtot', name: 'debtot', valType: 'text' },
    { prop: 'a_pagar', name: 'a_pagar', valType: 'text' },
    { prop: 'debito_iva', name: 'debito_iva', valType: 'text' },
    { prop: 'receipt_num', name: 'Nro Comprobante', valType: 'text' },
    { prop: 'id_receipt_type', name: 'Tipo Comprobante', valType: 'text' },
    { prop: 'receipt_date', name: 'Fecha Comprobante', valType: 'text' },
    { prop: 'exento', name: 'exento', valType: 'text' },
    { prop: 'gravado', name: 'gravado', valType: 'text' },
    { prop: 'iva_factu', name: 'iva_factu', valType: 'text' },
    { prop: 'iva_perce', name: 'iva_perce', valType: 'text' },
    { prop: 'iibb', name: 'iibb', valType: 'text' },
    { prop: 'record_total', name: 'record_total', valType: 'text' },
    { prop: 'neto_impues', name: 'neto_impues', valType: 'text' },
    { prop: 'resu_liqui', name: 'resu_liqui', valType: 'text' },
    { prop: 'cuenta', name: 'cuenta', valType: 'text' },
    { prop: 'ambu_total', name: 'ambu_total', valType: 'text' },
    { prop: 'inter_total', name: 'inter_total', valType: 'text' },
    { prop: 'audit_group', name: 'audit_group', valType: 'text' },
    { prop: 'date_vto_carga', name: 'fecha_vto_carga', valType: 'text' },
    { prop: 'status', name: 'Estado', valType: 'text' },
    { prop: 'assigned_user', name: 'Usuario', valType: 'text' },
    { prop: 'avance', name: 'Avance', cellTemplate: VGridVueTemplate(DataTableProgres), size: 300, valType: 'number' },
]
const records = ref([])
let filters = []
const loading = ref(true)

const fetchResources = async () => {
    const { data } = await getRecords(filters)
    records.value = data
    setTimeout(() => {
        loading.value = false
    }, 500)
}

onMounted(async () => {
    fetchResources()
})

const updateFilters = (appliedFilters) => {
    filters = appliedFilters;
    fetchResources()
}

const roundVal = (val, decimal) => {
    return Math.round(val).toFixed(decimal);
}

</script>


<style scoped>
.tableContainer {
    max-width: 100%;
    overflow-x: auto;
}
</style>