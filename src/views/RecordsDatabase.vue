<template>
    <defaultLayout>
        <h3 class="m-2 ml-4">DB Prevencion</h3>
        <DataTable :rows="records" :cols="headers" :btnFilters="true" :loading="loading" @updateFilters="updateFilters"
            class="w-full mr-2" :rowSize="60">
        </DataTable>
    </defaultLayout>
</template>

<script setup>
import { VGridVueTemplate } from '@revolist/vue3-datagrid';
import defaultLayout from '@/layouts/defaultLayout.vue';
import { onMounted, ref } from 'vue';
import DataTableGroup from '@/components/DataTableUI/DataTableGroup.vue'
import DataTableProgres from '@/components/DataTableUI/DataTableProgres.vue';
import DataTable from '@/components/Spreadsheet/DataTable.vue';
import { getRecords } from '@/services/records'

const headers = [
    { prop: 'record_key', name: 'ID Expediente', pin: 'colPinStart', valType: 'text', readonly: true },
    { prop: 'id_provider', name: 'Prestador', valType: 'number', readonly: true },
    { prop: 'date_liquid', name: 'fecha liquid', valType: 'date', readonly: true },
    { prop: 'date_recep', name: 'fecha recep', valType: 'date', readonly: true },
    { prop: 'date_audi_vto', name: 'fecha audi vto', valType: 'date', readonly: true },
    { prop: 'date_period', name: 'Periodo', valType: 'date', readonly: true },
    { prop: 'record_name', name: 'Tipo', valType: 'text', readonly: true },
    { prop: 'totcal', name: 'Tot cal', valType: 'text', readonly: true },
    { prop: 'bruto', name: 'Bruto', valType: 'text', readonly: true },
    { prop: 'ivacal', name: 'Ivacal', valType: 'text', readonly: true },
    { prop: 'debcal', name: 'Debcal', valType: 'text', readonly: true },
    { prop: 'inter_debcal', name: 'inter debcal', valType: 'text', readonly: true },
    { prop: 'debito', name: 'Debito', valType: 'text', readonly: true },
    { prop: 'debtot', name: 'Debtot', valType: 'text', readonly: true },
    { prop: 'a_pagar', name: 'A pagar', valType: 'text', readonly: true },
    { prop: 'debito_iva', name: 'Debito iva', valType: 'text', readonly: true },
    { prop: 'receipt_num', name: 'Nro Comprobante', valType: 'text', readonly: true },
    { prop: 'receipt_short', name: 'Tipo Comprobante', valType: 'text', readonly: true },
    { prop: 'receipt_date', name: 'Fecha Comprobante', valType: 'text', readonly: true },
    { prop: 'exento', name: 'Exento', valType: 'text', readonly: true },
    { prop: 'gravado', name: 'Gravado', valType: 'text', readonly: true },
    { prop: 'iva_factu', name: 'Iva_factu', valType: 'text', readonly: true },
    { prop: 'iva_perce', name: 'Iva_perce', valType: 'text', readonly: true },
    { prop: 'iibb', name: 'Iibb', valType: 'text', readonly: true },
    { prop: 'record_total', name: 'Total', valType: 'text', readonly: true },
    { prop: 'neto_impues', name: 'Impues Neto', valType: 'text', readonly: true },
    { prop: 'resu_liqui', name: 'Resu liqui', valType: 'text', readonly: true },
    { prop: 'cuenta', name: 'Cuenta', valType: 'text', readonly: true },
    { prop: 'ambu_total', name: 'Ambu total', valType: 'text', readonly: true },
    { prop: 'inter_total', name: 'Inter total', valType: 'text', readonly: true },
    { prop: 'audit_group', name: 'Grupo Auditor', cellTemplate: VGridVueTemplate(DataTableGroup), valType: 'text', readonly: true },
    { prop: 'date_vto_carga', name: 'fecha vto carga', valType: 'text', readonly: true },
    { prop: 'status', name: 'Estado', valType: 'text', readonly: true },
    { prop: 'assigned_user', name: 'Usuario', valType: 'text', readonly: true },
    { prop: 'avance', name: 'Avance', cellTemplate: VGridVueTemplate(DataTableProgres), size: 150, valType: 'number', readonly: true },
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

</script>


<style scoped>
.tableContainer {
    max-width: 100%;
    overflow-x: auto;
}
</style>