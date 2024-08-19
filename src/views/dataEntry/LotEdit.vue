<template>
    <div class="bg-base-200 header flex flex-row gap-4 px-4 mx-1 mb-4 rounded-xl shadow">
        <h2 class="card-title text-4xl py-4">
            Lote:
            <div class="badge badge-lg badge-primary">{{ lot.lot_key }}</div>
        </h2>
        <span class="grow"></span>
        <button class="btn btn-secondary btn-circle mt-4" @click="clearLot()">
            <Icon icon="mdi:keyboard-return" class="text-xl"></Icon>
        </button>
    </div>
    <form @submit.prevent="submit" class="h-full">
        <div class="bg-base-200 px-4 rounded-xl mx-1 shadow" style="max-height: 80vh;"> <!--This DIV-->
            <div class="flex flex-row gap-4 ">
                <MCInput class="grow" textIcon="mdi:calendar-month" textLabel="Fecha Asignacion" :text-error="date_assignment.errorMessage.value">
                    <input v-model="date_assignment.value.value" type="date" class="input input-bordered w-full" />
                </MCInput>
                <MCInput class="basis-1/4" textIcon="mdi:blur" textLabel="Estado"
                    :textError="status.errorMessage.value">
                    <input v-model="status.value.value" type="checkbox" disabled class="checkbox text-xl h-10 w-10 " />
                </MCInput>
            </div>
            <div class="flex flex-row gap-4 ">
                <MCInput class="w-full" textIcon="mdi:user" textLabel="Auditor">
                    <Autocomplete :items="props.users" keyProp="id" textProp="user_name" :addval="setAudit"></Autocomplete>
                </MCInput>
            </div>
            <div class="flex flex-row gap-4 ">
                <MCInput class="basis-1/2" textIcon="mdi:land-plots" textLabel="Lote"
                    :textError="lot_key.errorMessage.value">
                    <input v-model="lot_key.value.value" class="input input-bordered w-full" />
                </MCInput>
                <MCInput class="basis-1/2" textIcon="mdi:blur" textLabel="Exp. Total">
                    <span class="badge badge-lg badge-primary w-full mt-2">{{ lot.total_records }}</span>
                </MCInput>
            </div>
            <div class="flex flex-row gap-4 ">
                <MCInput class="basis-1/2" textIcon="mdi:calendar-month" textLabel="Fecha Salida"
                    :textError="date_departure.errorMessage.value">
                    <input v-model="date_departure.value.value" type="date" class="input input-bordered w-full" />
                </MCInput>
                <MCInput class="basis-1/2" textIcon="mdi:calendar-month" textLabel="Fecha Retorno"
                    :textError="date_return.errorMessage.value">
                    <input v-model="date_return.value.value" type="date" class="input input-bordered w-full" />
                </MCInput>
            </div>
            <div class="flex flex-row gap-4 ">
                <MCInput class="grow" textIcon="mdi:calendar-month" textLabel="Observacion del lote"
                    :textError="observation.errorMessage.value">
                    <textarea v-model="observation.value.value" type="date"
                        class="textarea textarea-bordered h-24 w-full" />
                </MCInput>
            </div>

            <div class="flex flex-row gap-4 ">
                <button class="btn btn-primary m-auto my-2 mb-4 mr-0" type="submit">
                    Guardar <Icon icon="mdi:content-save" class="text-xl"></Icon>
                </button>
            </div>
        </div>
    </form>
</template>

<script setup>
import Autocomplete from '@/components/Autocomplete.vue';
import { Icon } from '@iconify/vue';
import { ref, onMounted, computed } from 'vue';
import MCInput from '@/components/MCInput.vue';
import * as Yup from "yup";
import { updateLot } from '@/services/lots'
import { useField, useForm } from 'vee-validate'

const props = defineProps({
    lot: { default: null, type: Object },
    users: { default: [], type: Array },
    clearLot: { default: null, type: Function }
});

const createValidationSchema = () => {
    const baseSchema = {
        lot_key: Yup.string(),
        status: Yup.boolean(),
        date_assignment: Yup.date().nullable(),
        date_departure: Yup.date().nullable(),
        date_return: Yup.date().nullable(),
        observation: Yup.string().nullable()
    };
    return Yup.object().shape(baseSchema);
};

const validationSchema = createValidationSchema()

const { handleSubmit, handleReset, errors } = useForm({
    validationSchema,
    validateOnMount: false
});

const id = ref(0)
const lot_key = useField('lot_key');
const date_assignment = useField('date_assignment')
const status = useField('status')
const date_departure = useField('date_departure')
const date_return = useField('date_return')
const observation = useField('observation')
const id_audit = ref(null)

const setAudit = (item) => {
    id_audit.value = item.id
}

const submit = handleSubmit(async (values) => {
    let valuesSend = {}
    for (const i in values) {
        if (Object.hasOwnProperty.call(values, i)) {
            valuesSend[i] = values[i];
        }
    }
    console.log(values)
    valuesSend['id_lot'] = id.value
    if (id_audit.value != null) valuesSend['id_audit'] = id_audit.value
    const { data } = await updateLot(valuesSend)
    props.clearLot()
});


onMounted(() => {
    id.value = props.lot.id
    date_assignment.value.value = null
    lot_key.value.value = props.lot.lot_key
    date_departure.value.value = props.lot.date_departure
    status.value.value = props.lot.status
    date_return.value.value = props.lot.date_return
    observation.value.value = props.lot.observation
})

</script>