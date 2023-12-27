<template>
    <MCModal :modalOpen="modalControl.status" :toggleModal="toggleModal" :modalText="modalControl.text"
        :modalTitle="modalControl.tile" :modalSucces="modalControl.success" />
    <div class="flex h-screen bg-base-300 ">
        <div class="w-1/3 flex items-center justify-center left-wrapper h-full">
            <div class="uppercase font-title inline-flex text-lg md:text-6xl text-accent bg-neutral p-2 rounded-xl mb-64">
                G-<span class="salud text-base-content">Soft</span>
            </div>
        </div>
        <div class="w-2/3 flex items-center justify-center card infoAnim">
            <div v-if="failedOnce"
                class="infoAnim self-center badge p-4 py-8 badge-neutral text-center border-2 border-accent">
                Si no recuerda su contraseña y/o usuario comuníquese con un administrador para realizar un cambio de
                contraseña. <button class="m-2 btn btn-sm btn-circle right-2 top-2 btn-ghost"
                    @click="failedOnce = false">✕</button>
            </div>
            <form class="flex flex-col w-5/6 p-6 bg-base-100 shadow-md rounded-md mt-8" @submit.prevent="submit">
                <h2 class="text-4xl font-bold mb-4">Login</h2>
                <span class="divider"></span>
                <MCInput text-label="Username" :text-error="user_name.errorMessage.value"
                    text-icon="material-symbols:account-circle">
                    <input v-model="user_name.value.value" type="text" class="input input-bordered w-full" />
                </MCInput>
                <MCInput text-label="Contraseña" :text-error="user_pass.errorMessage.value" text-icon="gg:password">
                    <input v-model="user_pass.value.value" type="password" class="input input-bordered w-full" />
                </MCInput>
                <div class="flex flex-row gap-2 justify-end">
                    <button class="btn btn-primary self-end" type="submit">Login</button>
                    <button v-if="user_name.value.value != undefined && user_name.value.value != ''"
                        class="btn btn-secondary self-end" @click="modalControl.state = true">Limpiar</button>
                </div>
            </form>

        </div>
    </div>
</template>
  

<script setup>
import MCInput from '@/components/MCInput.vue';
import MCModal from '@/components/Modals/MCModal.vue';
import { useRouter } from 'vue-router'
import { ref } from 'vue';
import { userDataStore } from '@/store/userStore'
import { loginUser } from '@/services/admission'
import * as Yup from "yup";
import { useField, useForm } from 'vee-validate'

const store = userDataStore()
const router = useRouter()

const failedOnce = ref(false)
const modalControl = ref({
    status: false,
    text: '',
    tile: '',
    success: false,
})

const toggleModal = () => {
    modalControl.value.status = !modalControl.value.status
}

const validationSchema = Yup.object().shape({
    user_name: Yup.string().required('El username es nescesario'),
    user_pass: Yup.string().required('La contraseña es nescesaria')
});

const { handleSubmit, handleReset, errors } = useForm({
    validationSchema,
    validateOnMount: false
});

const user_name = useField('user_name');
const user_pass = useField('user_pass');

const submit = handleSubmit(async (values) => {
    try {
        const { data } = await loginUser(values)
        console.log(data)
        if (data.success) {
            store.token = data.token
            store.name = data.full_name
            store.id = data.user_id
            setTimeout(() => { router.push({ path: "/" }), 1000 })
        } else {
            failedOnce.value = true
            modalControl.value.status = false
            modalControl.value.tile = 'Error en el login'
            modalControl.value.text = data.error
            modalControl.value.status = true
        }
    }
    catch (error) {
        modalControl.value.status = false
        modalControl.value.tile = 'Error en el login'
        modalControl.value.text = ' Error de Servidor (No hubo respuesta del servidor): ' + error
        modalControl.value.status = true
        console.log(modalControl.value.status)
    }

});


</script>


<style scoped>
.left-wrapper {
    border-right: solid 2px oklch(var(--a));
    margin: auto;
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    overflow: auto;
    background: linear-gradient(315deg, oklch(var(--p)) 3%, oklch(var(--b1)) 38%, oklch(var(--s)) 68%, oklch(var(--b3)) 98%);
    animation: gradient 15s ease infinite;
    background-size: 400% 400%;
    background-attachment: fixed;
}

@keyframes gradient {
    0% {
        background-position: 0% 0%;
    }

    50% {
        background-position: 100% 100%;
    }

    100% {
        background-position: 0% 0%;
    }
}

.wave {
    background: rgb(255 255 255 / 25%);
    border-radius: 1000% 1000% 0 0;
    position: fixed;
    width: 200%;
    height: 12em;
    animation: wave 10s -3s linear infinite;
    transform: translate3d(0, 0, 0);
    opacity: 0.8;
    bottom: 0;
    left: 0;
    z-index: -1;
}

.wave:nth-of-type(2) {
    bottom: -1.25em;
    animation: wave 18s linear reverse infinite;
    opacity: 0.8;
}

.wave:nth-of-type(3) {
    bottom: -2.5em;
    animation: wave 20s -1s reverse infinite;
    opacity: 0.9;
}

@keyframes wave {
    2% {
        transform: translateX(1);
    }

    25% {
        transform: translateX(-25%);
    }

    50% {
        transform: translateX(-50%);
    }

    75% {
        transform: translateX(-25%);
    }

    100% {
        transform: translateX(1);
    }
}


.infoAnim {
    animation: infoAnim 1s ease 0s 1 normal forwards;
}

@keyframes infoAnim {
    0% {
        opacity: 0;
        transform: translateY(250px);
    }

    100% {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>