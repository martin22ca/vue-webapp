<template>
    <MCModal :modalOpen="props.modalOpen" modalTitle="Usuario" :toggleModal="() => { props.toggleModal() }">
        <form @submit.prevent="submit">
            <div class="header flex flex-row gap-4 bg-base-300 px-4 rounded-xl">
                <h2 v-if="update" class="card-title text-4xl">
                    Usuario:
                    <div class="badge badge-lg badge-primary">{{ props.user.user_name }}</div>
                </h2>
                <h2 v-else class="card-title text-4xl">
                    Nuevo Usuario
                </h2>
                <span class="grow"></span>
                <MCInput textIcon="material-symbols:account-circle" textLabel="Fecha Inicio"
                    :textError="start_date.errorMessage.value">
                    <input v-model="start_date.value.value" type="date" class="input input-bordered w-full"
                        :disabled="update" />
                </MCInput>
                <MCInput v-if="update" class="" textIcon="material-symbols:account-circle" textLabel="Fecha Fin"
                    :textError="end_date.errorMessage.value">
                    <input v-model="end_date.value.value" type="date" class="input input-bordered w-full" />
                </MCInput>
            </div>
            <span :class="'m-1 divider ' + (update ? 'divider-secondary' : 'divider-primary')"></span>
            <div class="bg-base-300 px-4 rounded-xl">
                <div class="flex flex-row gap-4 ">
                    <MCInput class="basis-1/3" textIcon="material-symbols:account-circle" textLabel="Username"
                        :textError="user_name.errorMessage.value">
                        <input v-model="user_name.value.value" class="input input-bordered w-full" />
                    </MCInput>
                    <MCInput class="basis-1/3" textIcon="icon-park-outline:edit-name" textLabel="Nombre"
                        :textError="first_name.errorMessage.value">
                        <input v-model="first_name.value.value" class="input input-bordered w-full" />
                    </MCInput>
                    <MCInput class="basis-1/3" textIcon="icon-park-outline:edit-name" textLabel="Apellido"
                        :textError="last_name.errorMessage.value">
                        <input v-model="last_name.value.value" class="input input-bordered w-full" />
                    </MCInput>
                </div>
                <div class="flex flex-row gap-4">
                    <MCInput class="basis-1/3" textIcon="heroicons:identification-20-solid" textLabel="Cuil"
                        :textError="cuil.errorMessage.value">
                        <input v-model="cuil.value.value" type="number" class="input input-bordered w-full" />
                    </MCInput>
                    <MCInput class="basis-2/3" textIcon="material-symbols:location-on-outline" textLabel="Direccion"
                        :textError="address.errorMessage.value">
                        <input v-model="address.value.value" class="input input-bordered w-full" />
                    </MCInput>
                </div>
                <div class="flex flex-row gap-4">
                    <MCInput class="basis-1/2" textIcon="material-symbols:call-log" textLabel="Telefono ALT"
                        :textError="phone.errorMessage.value">
                        <input v-model="phone.value.value" class="input input-bordered w-full" />
                    </MCInput>
                    <MCInput class="basis-1/2" textIcon="material-symbols:call-log" textLabel="Telefono ALT"
                        :textError="phone_alt.errorMessage.value">
                        <input v-model="phone_alt.value.value" class="input input-bordered w-full" />
                    </MCInput>
                </div>
                <div class="flex flex-row gap-4">
                    <MCInput class="basis-1/2" textIcon="ic:sharp-email" textLabel="Email Coorporativo"
                        :textError="email_corp.errorMessage.value">
                        <input v-model="email_corp.value.value" class="input input-bordered w-full" />
                    </MCInput>
                    <MCInput class="basis-1/2" textIcon="ic:sharp-email" textLabel="Email Personal"
                        :textError="email_personal.errorMessage.value">
                        <input v-model="email_personal.value.value" class="input input-bordered w-full" />
                    </MCInput>
                </div>
                <div class="flex flex-row gap-4">
                    <MCInput class="basis-1/2" textIcon="gg:password" textLabel="Contraseña"
                        :textError="user_pass.errorMessage.value">
                        <input v-model="user_pass.value.value" type="password" class="input input-bordered w-full" />
                    </MCInput>
                    <MCInput class="basis-1/2" textIcon="gg:password" textLabel="Confirmar Contraseña"
                        :textError="passwordConfirmation.errorMessage.value">
                        <input v-model="passwordConfirmation.value.value" type="password"
                            class="input input-bordered w-full" />
                    </MCInput>
                </div>
                <div class="card-actions justify-end py-2">
                    <button class="btn btn-primary " type="submit">Guardar</button>
                    <button class="btn btn-primary ma-2" @click="handleReset">Limpiar</button>
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
    user: { default: null, type: Object },
    toggleModal: { default: null, type: Function }
});

const update = ref(false)
update.value = props.user != null

const createValidationSchema = () => {
    const baseSchema = {
        isBig: Yup.boolean(),
        first_name: Yup.string().required('El Nombre es requerido'),
        last_name: Yup.string().required('El Apellido es requerido'),
        address: Yup.string().typeError('Estring').nullable(),
        cuil: Yup.number().typeError('El Cuil Es un Numero').nullable().max(999999999999, 'El Cuil debe contener maximo 12 digitos'),
        email_personal: Yup.string().email('Email no valido').nullable(),
        email_corp: Yup.string().email('Email no valido').nullable(),
        start_date: Yup.date().required('La fecha de inicio es requerida'),
        end_date: Yup.date().nullable(),
        phone: Yup.number().nullable(),
        phone_alt: Yup.number().nullable(),
        user_name: Yup.string().required('El Username es requerido').min(4, 'El Username debe contener al menos 4 digitos'),
    };

    if (update.value) {
        // Validation rules specific to updating a user
        baseSchema.user_pass = Yup.string()
            .min(4, 'La contraseña debe contener al menos 4 caracteres')
            .matches(/(?=.*[a-z])(?=.*[A-Z]).{4,}/, 'Debe tener al menos una mayúscula y una minúscula');
        baseSchema.passwordConfirmation = Yup.string()
            .oneOf([Yup.ref('user_pass'), undefined, null], 'Las contraseñas no coinciden');
    } else {
        // Validation rules specific to creating a new user
        baseSchema.user_pass = Yup.string()
            .required('La contraseña es requerida')
            .min(4, 'La contraseña debe contener al menos 4 caracteres')
            .matches(/(?=.*[a-z])(?=.*[A-Z]).{4,}/, 'Debe tener al menos una mayúscula y una minúscula');
        baseSchema.passwordConfirmation = Yup.string()
            .required('La confirmación de contraseña es requerida')
            .oneOf([Yup.ref('user_pass')], 'Las contraseñas no coinciden');
    }

    return Yup.object().shape(baseSchema);
};

const validationSchema = createValidationSchema(update.value)

const { handleSubmit, handleReset, errors } = useForm({
    validationSchema,
    validateOnMount: false
});

const id = ref(0)
const user_name = useField('user_name');
const first_name = useField('first_name');
const last_name = useField('last_name');
const cuil = useField('cuil');
const address = useField('address')
const start_date = useField('start_date')
const end_date = useField('end_date')
const email_personal = useField('email_personal');
const email_corp = useField('email_corp');
const phone = useField('phone')
const phone_alt = useField('phone_alt')
const user_pass = useField('user_pass');
const passwordConfirmation = useField('passwordConfirmation');

if (update.value) {
    id.value = props.user.id
    user_name.value.value = props.user.user_name
    first_name.value.value = props.user.first_name
    last_name.value.value = props.user.last_name
    cuil.value.value = props.user.cuil
    address.value.value = props.user.address
    email_personal.value.value = props.user.email_personal
    email_corp.value.value = props.user.email_corp
    start_date.value.value = props.user.start_date
    end_date.value.value = props.user.end_date
    phone.value.value = props.user.phone
    phone_alt.value.value = props.user.phone_alt
} else {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    let month = currentDate.getMonth() + 1; // Adding 1 because months are zero-indexed
    month = month < 10 ? `0${month}` : month; // Add leading zero if month is a single digit
    let day = currentDate.getDate();
    day = day < 10 ? `0${day}` : day; // Add leading zero if day is a single digit
    const dateString = `${year}-${month}-${day}`;
    start_date.value.value = dateString
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
    values['user_id'] = id.value 
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