<template>
    <defaultLayout>
        <Breadcrumbs />
        <h2 class="p-2">Expedientes Asignados</h2>
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
import DataTableProgres from '@/components/DataTable/DataTableProgres.vue';
import DataTableGroup from '@/components/DataTable/DataTableGroup.vue'
import DataTable from '@/components/DataTable/DataTable.vue';
import { getRecordsAssigned } from '@/services/records'
import DataTableCheckbox from '@/components/DataTable/DataTableCheckbox.vue'

const headers = [
    { prop: 'id_record', name: 'Nro Exp', pin: 'colPinStart', valType: 'number' },
    { prop: 'id_provider', name: 'Prestador', valType: 'number' },
    { prop: 'date_liquid', name: 'Fecha liquid', valType: 'date' },
    { prop: 'date_recep', name: 'Fecha recep', valType: 'date' },
    { prop: 'date_audi_vto', name: 'Fecha audi vto', valType: 'date' },
    { prop: 'date_period', name: 'Periodo', valType: 'date' },
    { prop: 'record_type', name: 'Tipo', valType: 'text' },
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
    { prop: 'id_receipt_type', name: 'Tipo Comprobante', valType: 'text' },
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
    { prop: 'lot_key', name: 'LOTE', valType: 'text' },
    { prop: 'date_vto_carga', name: 'Fecha vto carga', valType: 'text' },
    { prop: 'date_assignment_case', name: 'Fecha asignamiento caso ', valType: 'text' },
    { prop: 'date_entry_digital', name: 'Fecha Digital', valType: 'text' },
    { prop: 'date_entry_physical', name: 'Fecha Fisico', valType: 'text' },
    { prop: 'date_close', name: 'Fecha cierre', valType: 'text' },
    { prop: 'seal_number', name: 'Precinto', valType: 'text' },
    { prop: 'observation', name: 'Observacion', valType: 'text' },
    { prop: 'lot_status', name: 'Estado Lote', valType: 'bool', cellTemplate: VGridVueTemplate(DataTableCheckbox), readonly: true },
    { prop: 'date_assignment_lot', name: 'Fecha asignamiento lote', valType: 'text' },
    { prop: 'date_return', name: 'Fecha retorno', valType: 'text' },
    { prop: 'date_departure', name: 'Fecha salida', valType: 'text' },
    { prop: 'assigned_user', name: 'Usuario', valType: 'text' },
    { prop: 'avance', name: 'Avance', cellTemplate: VGridVueTemplate(DataTableProgres), size: 150, valType: 'number' },
]
const records = ref([])
let filters = []
const loading = ref(true)

const fetchResources = async () => {
    const { data } = await getRecordsAssigned(filters)
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