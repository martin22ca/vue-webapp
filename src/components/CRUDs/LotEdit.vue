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
    <form @submit.prevent="submit" class="">
        <div class="bg-base-200 px-4 rounded-xl mx-1 shadow" style="max-height: 90vh;" > <!--This DIV-->
            <div class="flex flex-row gap-4 ">
                <MCInput class="basis-1/2" textIcon="mdi:land-plots" textLabel="Lote"
                    :textError="lot_key.errorMessage.value">
                    <input v-model="lot_key.value.value" class="input input-bordered w-full" />
                </MCInput>
                <MCInput class="basis-1/2" textIcon="mdi:blur" textLabel="Estado"
                    :textError="status.errorMessage.value">
                    <input v-model="status.value.value" type="checkbox" disabled class="checkbox text-xl h-10 w-10 " />
                </MCInput>
                <MCInput class="basis-1/2" textIcon="mdi:blur" textLabel="Exp. Total">
                    <span class="badge badge-lg badge-primary w-full mt-2">{{ lot.total_records }}</span>
                </MCInput>
            </div>
            <div class="flex flex-row gap-4 items-center center">
                <Autocomplete v-if="assignedUser == null" :items="usersAudit" textProp="user_name" keyProp="id"
                    :addval="setAudit" :isOpenOnMount="false" class="grow" />
                <div v-else class="flex flex-row gap-4 items-center">
                    <MCInput textIcon="mdi:face-agent" textLabel="Auditor">
                        <input v-model="assignedUser.user_name" type="string" class="input input-bordered w-full" />
                    </MCInput>
                    <span class="grow"></span>
                    <button class="btn btn-circle btn-error mt-4" @click="assignedUser = null" type="button">X</button>
                </div>
            </div>
            <div class="flex flex-row gap-4 ">
                <MCInput class="grow" textIcon="mdi:calendar-month" textLabel="Fecha Asignacion"
                    :textError="date_departure.errorMessage.value">
                    <input v-model="date_departure.value.value" type="date" class="input input-bordered w-full" />
                </MCInput>
            </div>
            <div class="flex flex-row gap-4 ">
                <MCInput class="basis-1/2" textIcon="mdi:calendar-month" textLabel="Fecha Salida"
                    :textError="date_asignment.errorMessage.value">
                    <input v-model="date_asignment.value.value" type="date" class="input input-bordered w-full" />
                </MCInput>
                <MCInput class="basis-1/2" textIcon="mdi:calendar-month" textLabel="Fecha Retorno"
                    :textError="date_return.errorMessage.value">
                    <input v-model="date_return.value.value" type="date" class="input input-bordered w-full" />
                </MCInput>
            </div>
            <div class="flex flex-row gap-4 ">
                <button class="btn btn-primary m-auto my-2 mb-4 mr-0 " type="submit">
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
import { getUsersByRole } from '@/services/users'
import { useField, useForm } from 'vee-validate'

const props = defineProps({
    lot: { default: null, type: Object },
    clearLot: { default: null, type: Function }
});

const createValidationSchema = () => {
    const baseSchema = {
        lot_key: Yup.string(),
        status: Yup.boolean(),
        date_asignment: Yup.string().nullable(),
        date_departure: Yup.date().nullable(),
        date_return: Yup.date().nullable()
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
const date_asignment = useField('date_asignment')
const status = useField('status')
const date_departure = useField('date_departure')
const date_return = useField('date_return')
const assignedUser = ref(null)
const usersAudit = ref([])


const submit = handleSubmit(async (values) => {
    console.log('Vals', values)
    let valuesSend = {}
    for (const i in values) {
        if (Object.hasOwnProperty.call(values, i)) {
            valuesSend[i] = values[i];
        }
    }
    valuesSend['id_lot'] = id.value
    if (assignedUser.value != null) {
        valuesSend['id_user'] = assignedUser.value.id
    }
    const { data } = await updateLot(valuesSend)
    props.clearLot()
});

const fetchAudits = async () => {
    // 3 ID AUDIT
    const { data } = await getUsersByRole(3)
    if (data.success) {
        usersAudit.value = data.data
    }
}

const setAudit = (val) => {
    assignedUser.value = val
}

onMounted(() => {
    id.value = props.lot.id
    lot_key.value.value = props.lot.lot_key
    date_asignment.value.value = props.lot.date_asignment
    date_departure.value.value = props.lot.date_departure
    status.value.value = props.lot.status
    date_return.value.value = props.lot.date_return
    if (props.lot.id_user != null) {
        const auditOBj = {
            'id_user': props.lot.id_user,
            'user_name': props.lot.user_name
        }
        setAudit(auditOBj)
    }
    fetchAudits()
})

</script>