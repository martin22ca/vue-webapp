<template>
    <defaultLayout>
        <Breadcrumbs title="DB Prevencion" />
        <DataTable :rows="records" :cols="headers" :btnFilters="true" :loading="loading" @updateFilters="updateFilters"
            class="w-full mr-2" :rowSize="60">
        </DataTable>
    </defaultLayout>
</template>

<script setup>
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import { VGridVueTemplate } from '@revolist/vue3-datagrid';
import defaultLayout from '@/layouts/defaultLayout.vue';
import { onMounted, ref } from 'vue';
import DataTableGroup from '@/components/DataTableUI/DataTableGroup.vue'
import DataTableProgres from '@/components/DataTableUI/DataTableProgres.vue';
import DataTable from '@/components/Spreadsheet/DataTable.vue';
import { getRecords } from '@/services/records'

const headers = [
    { prop: 'record_key', name: 'ID Expediente', pin: 'colPinStart', valType: 'text' },
    { prop: 'id_provider', name: 'Prestador', valType: 'number' },
    { prop: 'date_liquid', name: 'fecha liquid', valType: 'date' },
    { prop: 'date_recep', name: 'fecha recep', valType: 'date' },
    { prop: 'date_audi_vto', name: 'fecha audi vto', valType: 'date' },
    { prop: 'date_period', name: 'Periodo', valType: 'date' },
    { prop: 'record_name', name: 'Tipo', valType: 'text' },
    { prop: 'totcal', name: 'Tot cal', valType: 'text' },
    { prop: 'bruto', name: 'Bruto', valType: 'text' },
    { prop: 'ivacal', name: 'Ivacal', valType: 'text' },
    { prop: 'debcal', name: 'Debcal', valType: 'text' },
    { prop: 'inter_debcal', name: 'inter debcal', valType: 'text' },
    { prop: 'debito', name: 'Debito', valType: 'text' },
    { prop: 'debtot', name: 'Debtot', valType: 'text' },
    { prop: 'a_pagar', name: 'A pagar', valType: 'text' },
    { prop: 'debito_iva', name: 'Debito iva', valType: 'text' },
    { prop: 'receipt_num', name: 'Nro Comprobante', valType: 'text' },
    { prop: 'receipt_short', name: 'Tipo Comprobante', valType: 'text' },
    { prop: 'receipt_date', name: 'Fecha Comprobante', valType: 'text' },
    { prop: 'exento', name: 'Exento', valType: 'text' },
    { prop: 'gravado', name: 'Gravado', valType: 'text' },
    { prop: 'iva_factu', name: 'Iva_factu', valType: 'text' },
    { prop: 'iva_perce', name: 'Iva_perce', valType: 'text' },
    { prop: 'iibb', name: 'Iibb', valType: 'text' },
    { prop: 'record_total', name: 'Total', valType: 'text' },
    { prop: 'neto_impues', name: 'Impues Neto', valType: 'text' },
    { prop: 'resu_liqui', name: 'Resu liqui', valType: 'text' },
    { prop: 'cuenta', name: 'Cuenta', valType: 'text' },
    { prop: 'ambu_total', name: 'Ambu total', valType: 'text' },
    { prop: 'inter_total', name: 'Inter total', valType: 'text' },
    { prop: 'audit_group', name: 'Grupo Auditor',cellTemplate: VGridVueTemplate(DataTableGroup), valType: 'text' },
    { prop: 'date_vto_carga', name: 'fecha vto carga', valType: 'text' },
    { prop: 'status', name: 'Estado', valType: 'text' },
    { prop: 'assigned_user', name: 'Usuario', valType: 'text' },
    { prop: 'avance', name: 'Avance', cellTemplate: VGridVueTemplate(DataTableProgres), size: 150, valType: 'number' },
]
const records = ref([])
let filters = []
const loading = ref(true)

const fetchResources = async () => {
    loading.value = true
    const { data } = await getRecords(filters)
    console.log(data)
    if (data.success) {
        records.value = data.data
        setTimeout(() => {
            loading.value = false
        }, 100)
    }
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