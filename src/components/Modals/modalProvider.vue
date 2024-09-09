<template>
    <MCModal :modalOpen="props.modalOpen" modalTitle="Prestadores" :toggleModal="() => { props.toggleModal(false) }">
        <form @submit.prevent="submit" class="bg-base-200 px-4 rounded-xl" style="height: 87vh;">
            <div class="flex flex-row mt-2 rounded-xl">
                <h2 v-if="update" class="card-title text-4xl">
                    Prestador:
                    <div class="badge badge-lg badge-primary">{{ business_name.value.value }}</div>
                </h2>
                <h2 v-else class="card-title text-4xl">
                    Nuevo Prestador
                </h2>
                <span class="grow"></span>
                <MCInput class="basis-1/3" textIcon="mdi:numeric" textLabel="ID Prestador">
                    <div class="input input-bordered w-full p-2 pl-4">
                        {{ id_provider }}
                    </div>
                </MCInput>
            </div>
            <span class='m - 1 divider divider-neurtal p-0 mb-4'></span>
            <div class="overflow-y-auto" style="max-height: 65vh;"> <!--This DIV-->

                <div className="grid grid-cols-6 grid-rows-7 gap-4">
                    <div>
                        <MCInput textIcon="mdi:account" textLabel="Razon Social"
                            :textError="business_name.errorMessage.value">
                            <input v-model="business_name.value.value" class="input input-bordered w-full" />
                        </MCInput>
                    </div>
                    <div>
                        <MCInput class="basis-1/3" textIcon="mdi:home-account" textLabel="Ubicacion"
                            :textError="business_location.errorMessage.value">
                            <input v-model="business_location.value.value" class="input input-bordered w-full" />
                        </MCInput>
                    </div>
                    <div className="">
                        <MCInput class="basis-1/3" textIcon="mdi:home-account" textLabel="Zona Sancor"
                            :textError="sancor_zone.errorMessage.value">
                            <input v-model="sancor_zone.value.value" class="input input-bordered w-full" />
                        </MCInput>
                    </div>
                    <div>
                        <MCInput class="basis-1/3" textIcon="mdi:priority-high" textLabel="Prioridad">
                            <input v-model="priority.value.value" class="input input-bordered w-full" />
                        </MCInput>
                    </div>
                    <div className="col-span-2 row-span-3 col-start-5">
                        <MCInput class="grow" textIcon="mdi:text-box-outline" textLabel="Obsevacion"
                            :textError="observation.errorMessage.value">
                            <textarea v-model="observation.value.value"
                                class="textarea textarea-bordered w-full h-64" />
                        </MCInput>
                    </div>
                    <div className="col-span-2 row-start-2">
                        <MCInput class="basis-1/4" textIcon="mdi:numeric" textLabel="CUIT"
                            :textError="cuit.errorMessage.value">
                            <input v-model="cuit.value.value" class="input input-bordered w-full" />
                        </MCInput>
                    </div>
                    <div className="col-span-2 col-start-3 row-start-2">
                        <MCInput class="basis-1/4" textIcon="mdi:map-marker" textLabel="Direccion"
                            :textError="address.errorMessage.value">
                            <input v-model="address.value.value" class="input input-bordered w-full" />
                        </MCInput>
                    </div>
                    <div className="col-span-2 row-start-3 ">
                        <MCInput class="basis-1/4" textIcon="mdi:numeric" textLabel="ID Coordinador">
                            <div class="input input-bordered w-full overflow-x-scroll px-3 pt-3">
                                {{ props.provider.id_coordinator }}
                            </div>
                        </MCInput>
                    </div>
                    <div className="col-span-2 row-start-3">
                        <MCInput class="basis-1/4" textIcon="mdi:account" textLabel="Coordinador">
                            <div class="input input-bordered w-full overflow-x-scroll px-3 pt-">
                                {{ props.provider.coordinator_business_name }}
                            </div>
                        </MCInput>
                    </div>
                    <div className="col-span-6 col-start-1 row-start-4">
                        <h2 class="text-xl pb-2">Particularidades</h2>
                        <span class="divider" />
                    </div>
                    <div className="col-span-3 row-start-5">
                        <MCInput class="basis-1/2" textIcon="mdi:calendar-range"
                            textLabel="Ultima modificacion G-salud">
                            <div class="input input-bordered w-full px-3 pt-3">
                                {{ mod_g_salud }}
                            </div>
                        </MCInput>
                    </div>
                    <div className="col-span-3 col-start-4 row-start-5">
                        <MCInput class="basis-1/2" textIcon="mdi:calendar-range"
                            textLabel="Ultima modificacion Prevencion">
                            <div class="input input-bordered w-full px-3 pt-3">
                                {{ mod_prevencion }}
                            </div>
                        </MCInput>
                    </div>
                    <div className="col-span-3 row-span-2 row-start-6">
                        <MCInput class="basis-1/2" textIcon="mdi:text-box-outline" textLabel="Particularidad G-salud "
                            :textError="part_g_salud.errorMessage.value">
                            <textarea v-model="part_g_salud.value.value"
                                class="textarea textarea-bordered w-full h-32" />
                        </MCInput>
                    </div>
                    <div className="col-span-3 row-span-2 col-start-4 row-start-6">
                        <MCInput class="basis-1/2" textIcon="mdi:text-box-outline"
                            textLabel="Particularidad Prevencion">
                            <div class="textarea textarea-bordered w-full h-32 overflow-y-scroll">{{
                                props.provider.part_prevencion }}</div>
                        </MCInput>
                    </div>
                </div>
            </div>
            <div class="card-actions justify-end ">
                <button class="btn btn-primary" type="submit" >Guardar</button>
            </div>
        </form>
    </MCModal>
</template>

<script setup>
import MCModal from './MCModal.vue';
import { ref, reactive } from 'vue';
import MCInput from '../MCInput.vue';
import { updateProvider } from '@/services/providers'
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
        cuit: Yup.string().nullable().max(12, 'El  Cuit no puede ser mas largo que 12 caracteres'),
        observation: Yup.string().nullable(),
        part_g_salud: Yup.string().nullable(),
        priority: Yup.string().nullable(),
    };
    return Yup.object().shape(baseSchema);
};

const validationSchema = createValidationSchema(update.value)

const { handleSubmit, handleReset, errors } = useForm({
    validationSchema,
    validateOnMount: false
});

const id_provider = ref(0)
const mod_prevencion = ref(null)
const mod_g_salud = ref(null)
const coordinator_business_name = ref(null)
const priority = useField('priority')
const address = useField('address');
const part_g_salud = useField('part_g_salud')
const business_name = useField('business_name')
const business_location = useField('business_location')
const sancor_zone = useField('sancor_zone')
const cuit = useField('cuit')
const observation = useField('observation')

// Create a reactive object to store the original values
const originalValues = reactive({})

if (update.value) {
    console.log(props.provider)
    coordinator_business_name.value = props.provider.coordinator_business_name
    id_provider.value = props.provider.id_provider
    mod_prevencion.value = props.provider.mod_prevencion
    mod_g_salud.value = props.provider.mod_g_salud
    priority.value.value = props.provider.priority
    address.value.value = props.provider.address
    business_name.value.value = props.provider.business_name
    part_g_salud.value.value = props.provider.part_g_salud
    business_location.value.value = props.provider.business_location
    sancor_zone.value.value = props.provider.sancor_zone
    cuit.value.value = props.provider.cuit
    observation.value.value = props.provider.observation

    // Store the original values
    Object.keys(props.provider).forEach(key => {
        originalValues[key] = props.provider[key]
    })
} else {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    let month = currentDate.getMonth() + 1;
    month = month < 10 ? `0${month}` : month;
    let day = currentDate.getDate();
    day = day < 10 ? `0${day}` : day;
    const dateString = `${year}-${month}-${day}`;
}

const submit = handleSubmit(async (values) => {
    const changedValues = {}

    for (const key in values) {
        if (Object.hasOwnProperty.call(values, key)) {
            const newValue = values[key]
            const originalValue = originalValues[key]

            if (newValue !== originalValue) {
                changedValues[key] = newValue === '' ? null : newValue
            }
        }
    }

    changedValues['id_provider'] = id_provider.value

    if (update.value && Object.keys(changedValues).length > 1) {  // > 1 because id_provider is always included
        const { data } = await updateProvider(changedValues)
        console.log(data)
        if (data.success) {
            props.toggleModal(true)
        }
    } else if (!update.value) {
        // Handle create new provider case if needed
    } else {
        props.toggleModal(false)
    }
});
</script>