<template>
    <div>
        <div class="">
            <button class="btn btn-primary mx-2" @click="sendColsConfig(initiAsignaciones, 4)">
                Asignaciones
            </button>
            <button class="btn btn-primary mx-2" @click="sendColsConfig(initDB, 3)">
                DB
            </button>
            <button class="btn btn-primary mx-2" @click="sendColsConfig(initLots, 5)">
                LOTE
            </button>
            <button class="btn btn-secondary">
                Reset
            </button>
        </div>
        <div>
            <button @click="getData" title="print current workbook data to console">Get Data</button>
        </div>
    </div>
</template>


<script setup>
import { setCols, getConfigId } from '@/services/config';
import { onBeforeMount, ref } from 'vue';

const sendColsConfig = async (conf, idCol) => {
    const arrayOfObjects = Object.keys(conf).map(key => {
        const newObj = conf[key];
        newObj.identifier = key;
        return newObj;
    });

    const res = await setCols(arrayOfObjects, idCol)
    console.log(res)
}


onBeforeMount(async () => {
    const response = await getConfigId(3)
    console.log(response)
})
const initLots = {
    id_record: { name: 'N° Expediente', order: 0, modified: false, lastCol: '' },
    id_provider: { name: 'N° de Prestador', order: 1, modified: false, lastCol: '' },
    lot_key: { name: 'Nombre Lote', order: 1, modified: false, lastCol: '' },
    business_name: { name: 'Razón Social', order: 1, modified: false, lastCol: '' },
    id_coordinator: { name: 'N° Coordinador', order: 1, modified: false, lastCol: '' },
    record_total: { name: 'Monto', order: 5, modified: false, lastCol: '' },
    audit_user: { name: 'Auditor', order: 2, modified: false, lastCol: '' },
    date_assignment: { name: 'Fecha de Asignacion a usuario', order: 3, modified: false, lastCol: '' },
    date_entry_digital: { name: 'Fecha de Recepción en Gapresa Digital ', order: 4, modified: false, lastCol: '' },
    date_entry_physical: { name: 'Fecha de Recepción en Gapresa Fisico', order: 5, modified: false, lastCol: '' },
    seal_number: { name: 'N° de Precinto ', order: 6, modified: false, lastCol: '' },
    observation: { name: 'Observacion', order: 7, modified: false, lastCol: '' },
    record_type: { name: 'tipo expediente', order: 11, modified: false, lastCol: '' },
    close_dismissed: { name: 'BAJA // DESESTIMADO', order: 8, modified: false, lastCol: '' },
};

const initiAsignaciones = {
    id_record: { name: 'N°', order: 0, modified: false, lastCol: '' },
    id_provider: { name: 'N° Prestador', order: 1, modified: false, lastCol: '' },
    business_name: { name: 'Razon Social', order: 2, modified: false, lastCol: '' },
    id_coordinator: { name: 'N° Coordinador', order: 3, modified: false, lastCol: '' },
    coordinator_business_name: { name: 'Coordinador', order: 4, modified: false, lastCol: '' },
    business_location: { name: 'Provincia', order: 5, modified: false, lastCol: '' },
    sancor_zone: { name: 'Zona', order: 6, modified: false, lastCol: '' },
    date_recep: { name: 'Fecha Recepcion', order: 7, modified: false, lastCol: '' },
    date_assignment: { name: 'Fecha Ingreso Actividad', order: 8, modified: false, lastCol: '' },
    date_audi_vto: { name: 'Fecha de vencimiento', order: 9, modified: false, lastCol: '' },
    date_period: { name: 'Periodo Prestaciones', order: 10, modified: false, lastCol: '' },
    id_receipt_type: { name: 'Tipo Comprobante', order: 11, modified: false, lastCol: '' },
    receipt_num: { name: 'Nro Comprobante', order: 12, modified: false, lastCol: '' },
    record_type: { name: 'Tipo Expediente', order: 13, modified: false, lastCol: '' },
    record_state: { name: 'Estado Expediente', order: 14, modified: false, lastCol: '' },
    provider_priority: { name: 'Condicion Prestador', order: 15, modified: false, lastCol: '' },
    provider_particularity: { name: 'Particularidad Prestador', order: 16, modified: false, lastCol: '' },
    entry_way: { name: 'Via Ingreso', order: 17, modified: false, lastCol: '' },
    entry_user: { name: 'Usuario Ingreso Actividad', order: 18, modified: false, lastCol: '' },
    audit_group: { name: 'Codigo Grupo Asignado', order: 21, modified: false, lastCol: '' },
    coment: { name: 'Comentario', order: 22, modified: false, lastCol: '' },
    gross_amount: { name: 'Monto Bruto', order: 24, modified: false, lastCol: '' },
    invoiced_amount: { name: 'Monto Facturado', order: 25, modified: false, lastCol: '' }
};

const initDB = {
    id_record: { name: 'expe', order: 1, modified: false, lastCol: '' },
    id_provider: { name: 'prestador', order: 2, modified: false, lastCol: '' },
    business_name: { name: 'razon', order: 3, modified: false, lastCol: '' },
    business_location: { name: 'loca', order: 4, modified: false, lastCol: '' },
    zona_sancor: { name: 'zona_sancor', order: 5, modified: false, lastCol: '' },
    date_liquid: { name: 'liqui_fecha', order: 6, modified: false, lastCol: '' },
    date_recep: { name: 'recep_fecha', order: 8, modified: false, lastCol: '' },
    date_audi_vto: { name: 'audi_vto', order: 9, modified: false, lastCol: '' },
    date_period: { name: 'perio', order: 10, modified: false, lastCol: '' },
    record_type: { name: 'tipo_d', order: 11, modified: false, lastCol: '' },
    totcal: { name: 'totcal', order: 12, modified: false, lastCol: '' },
    bruto: { name: 'bruto', order: 13, modified: false, lastCol: '' },
    ivacal: { name: 'ivacal', order: 14, modified: false, lastCol: '' },
    prestac_grava: { name: 'prestac_grava', order: 15, modified: false, lastCol: '' },
    debcal: { name: 'debcal', order: 16, modified: false, lastCol: '' },
    inter_debcal: { name: 'inter_debcal', order: 17, modified: false, lastCol: '' },
    debito: { name: 'debito', order: 18, modified: false, lastCol: '' },
    debtot: { name: 'debtot', order: 19, modified: false, lastCol: '' },
    a_pagar: { name: 'a_pagar', order: 20, modified: false, lastCol: '' },
    debito_iva: { name: 'debito_iva', order: 21, modified: false, lastCol: '' },
    id_receipt_type: { name: 'compro_tipo', order: 22, modified: false, lastCol: '' },
    receipt_num: { name: 'compro_nro', order: 23, modified: false, lastCol: '' },
    receipt_date: { name: 'fecha_comprobante', order: 24, modified: false, lastCol: '' },
    exento: { name: 'exento', order: 25, modified: false, lastCol: '' },
    gravado: { name: 'gravado', order: 26, modified: false, lastCol: '' },
    iva_factu: { name: 'iva_factu', order: 27, modified: false, lastCol: '' },
    iva_perce: { name: 'iva_perce', order: 28, modified: false, lastCol: '' },
    iibb: { name: 'iibb', order: 29, modified: false, lastCol: '' },
    debi_moti: { name: 'debi_moti', order: 30, modified: false, lastCol: '' },
    neto_impues: { name: 'neto_impues', order: 31, modified: false, lastCol: '' },
    resu_liqui: { name: 'resu_liqui', order: 32, modified: false, lastCol: '' },
    cuenta: { name: 'cuenta', order: 33, modified: false, lastCol: '' },
    ambu_total: { name: 'ambu_total', order: 34, modified: false, lastCol: '' },
    inter_total: { name: 'inter_total', order: 35, modified: false, lastCol: '' },
    audit_group: { name: 'name_1', order: 37, modified: false, lastCol: '' },
    date_vto_carga: { name: 'fecha_vto_carga', order: 38, modified: false, lastCol: '' },
    status: { name: 'estado', order: 39, modified: false, lastCol: '' },
    assigned_user: { name: 'usuario', order: 40, modified: false, lastCol: '' },
    avance: { name: 'avance', order: 41, modified: false, lastCol: '' },
    alto_costo: { name: 'alto_costo', order: 43, modified: false, lastCol: '' }
};

</script>
