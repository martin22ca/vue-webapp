<template>
    <MCModal :modalOpen="props.modalOpen" modalTitle="Prestadores" :toggleModal="() => { props.toggleModal() }">
        <form @submit.prevent="submit">
            <div class="header flex flex-row gap-4 bg-base-200 px-4 mt-2 rounded-xl">
                <h2 v-if="update" class="card-title text-4xl py-4">
                    Prestador:
                    <div class="badge badge-lg badge-primary">{{ business_name.value.value }}</div>
                </h2>
                <h2 v-else class="card-title text-4xl">
                    Nuevo Prestador
                </h2>
                <span class="grow"></span>
                <MCInput class="basis-1/3" textIcon="gg:password" textLabel="Nro Prestador">
                    <input v-model="id" class="input input-bordered w-full" disabled />
                </MCInput>
            </div>
            <span class='m - 1 divider divider-neurtal '></span>
            <div class="bg-base-200 px-4 rounded-xl overflow-y-auto" style="max-height: 70vh;"> <!--This DIV-->
                <div class="flex flex-row gap-4 ">
                    <MCInput class="basis-1/3" textIcon="gg:password" textLabel="Razon Social"
                        :textError="business_name.errorMessage.value">
                        <input v-model="business_name.value.value" class="input input-bordered w-full" />
                    </MCInput>
                    <MCInput class="basis-1/3" textIcon="gg:password" textLabel="Ubicacion"
                        :textError="business_location.errorMessage.value">
                        <input v-model="business_location.value.value" class="input input-bordered w-full" />
                    </MCInput>
                    <MCInput class="basis-1/3" textIcon="gg:password" textLabel="Zona Sancor"
                        :textError="sancor_zone.errorMessage.value">
                        <input v-model="sancor_zone.value.value" class="input input-bordered w-full" />
                    </MCInput>
                </div>
                <div class="flex flex-row gap-4">
                    <MCInput class="basis-1/3" textIcon="gg:password" textLabel="CUIT" :textError="cuit.errorMessage.value">
                        <input v-model="cuit.value.value" class="input input-bordered w-full" />
                    </MCInput>
                    <MCInput class="basis-2/3" textIcon="gg:password" textLabel="Direccion"
                        :textError="address.errorMessage.value">
                        <input v-model="address.value.value" class="input input-bordered w-full" />
                    </MCInput>
                </div>
                <div class="flex flex-row gap-4">
                    <MCInput class="basis-1/3" textIcon="gg:password" textLabel="Nro Coordinador">
                        <input v-model="props.provider.coordinator_number" class="input input-bordered w-full"
                            he />
                    </MCInput>
                    <MCInput class="basis-2/3" textIcon="gg:password" textLabel="Coordinador">
                        <input v-model="props.provider.coordinator_number" class="input input-bordered w-full"
                            he />
                    </MCInput>
                </div>
                <div class="flex flex-row gap-4">
                    <MCInput class="basis-2/3" textIcon="gg:password" textLabel="Obsevacion"
                        :textError="observation.errorMessage.value">
                        <textarea v-model="observation.value.value" class="textarea textarea-bordered w-full" he />
                    </MCInput>
                    <MCInput class="basis-1/3" textIcon="gg:password" textLabel="Prioridad">
                        <select class="select select-bordered w-full"></select>
                    </MCInput>
                </div>
                <span class="divider" />
                <h2 class="text-xl pb-2">Particularidades</h2>
                <div class="flex flex-row gap-4">
                    <MCInput class="basis-1/2" textIcon="gg:password" textLabel="Ultima modificacion G-salud"
                        :textError="address.errorMessage.value">
                        <input v-model="address.value.value" type="date" class="input input-bordered w-full" disabled />
                    </MCInput>
                    <MCInput class="basis-1/2" textIcon="gg:password" textLabel="Ultima modificacion Prevencion"
                        :textError="address.errorMessage.value">
                        <input v-model="address.value.value" type="date" class="input input-bordered w-full" disabled />
                    </MCInput>
                </div>
                <div class="flex flex-row gap-4">
                    <MCInput class="basis-1/2" textIcon="gg:password" textLabel="Particularidad G-salud "
                        :textError="part_g_salud.errorMessage.value">
                        <textarea v-model="part_g_salud.value.value" class="textarea textarea-bordered w-full" he />
                    </MCInput>
                    <MCInput class="basis-1/2" textIcon="gg:password" textLabel="Particularidad Prevencion">
                        <textarea v-model="props.provider.part_prevencion" class="textarea textarea-bordered w-full"
                            disabled />
                    </MCInput>
                </div>
                <div class="card-actions justify-end py-2">
                    <button class="btn btn-primary " type="submit">Guardar</button>
                    <button class="btn btn-secondary ma-2" @click="handleReset">Limpiar</button>
                </div>
            </div>
        </form>
    </MCModal>
</template>

<script setup >
import MCModal from './MCModal.vue';
import { ref } from 'vue';
import MCInput from '../MCInput.vue';
import { registerUser, updateUser } from '@/services/users'
import * as Yup from "yup";
import { useField, useForm } from 'vee-validate'

const props = defineProps({
    modalOpen: { default: false, type: Boolean },
    provider: { default: null, type: Object },
    toggleModal: { default: null, type: Function }
});

const update = ref(false)
update.value = props.provider != null

const createValidationSchema = () => {
    const baseSchema = {
        address: Yup.string().nullable(),
        business_name: Yup.string().nullable(),
        business_location: Yup.string().nullable(),
        sancor_zone: Yup.string().nullable(),
        cuit: Yup.string().nullable(),
        observation: Yup.string().nullable(),
        part_g_salud: Yup.string().nullable(),
        status: Yup.string(),
    };
    return Yup.object().shape(baseSchema);
};

const validationSchema = createValidationSchema(update.value)

const { handleSubmit, handleReset, errors } = useForm({
    validationSchema,
    validateOnMount: false
});

const id = ref(0)
const address = useField('address');
const part_g_salud = useField('part_g_salud')
const business_name = useField('business_name')
const business_location = useField('business_location')
const sancor_zone = useField('sancor_zone')
const cuit = useField('cuit')
const observation = useField('observation')

if (update.value) {
    id.value = props.provider.id
    address.value.value = props.provider.address
    business_name.value.value = props.provider.business_name
    part_g_salud.value.value = props.provider.part_g_salud
    business_location.value.value = props.provider.business_location
    sancor_zone.value.value = props.provider.sancor_zone
    cuit.value.value = props.provider.cuit
    observation.value.value = props.provider.observation

} else {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    let month = currentDate.getMonth() + 1; // Adding 1 because months are zero-indexed
    month = month < 10 ? `0${month}` : month; // Add leading zero if month is a single digit
    let day = currentDate.getDate();
    day = day < 10 ? `0${day}` : day; // Add leading zero if day is a single digit
    const dateString = `${year}-${month}-${day}`;
}

const submit = handleSubmit(async (values) => {
    for (const i in values) {
        if (Object.hasOwnProperty.call(values, i)) {
            const element = values[i];
            if (!element) {
                values[i] = null
            }
        }
    }
    if (update.value) {
        const { data } = await updateUser(values)
        console.log(data)
    } else {
        const { data } = await registerUser(values)
        console.log(data)
    }
    props.toggleModal()
});



</script>