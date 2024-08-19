<template>
    <MCModal :modalOpen="true">
        <div class="bg-base-200 header flex flex-row gap-4 px-4 mx-1 mb-4 rounded-xl shadow">
            <h2 class="card-title text-4xl py-4">
                Reporte:
                <div class="badge badge-lg badge-primary">{{ id }}</div>
            </h2>
            <span class="grow"></span>
            <button class="btn btn-error btn-circle mt-4" @click="props.clearProp(false)">
                ✕
            </button>
        </div>

        <div class="bg-base-200 px-4 rounded-xl overflow-y-auto mx-1 shadow" style="max-height: 80vh;">
            <form @submit.prevent="submit" class="">
                <div class="flex flex-row gap-4 ">
                    <MCInput class="basis-3/6" textIcon="mdi:calendar-blank" textLabel="Fecha Reporte">
                        <div class="p-2 pb-3 px-4 bg-base-100 rounded-lg border-solid border-2 border-neutral">
                            {{ date_report }}
                        </div>
                    </MCInput>
                    <MCInput class="basis-2/6" textIcon="mdi:calendar-blank" textLabel="Fecha Reporte">
                        <select v-model="priority.value.value" id="priority" class="select select-bordered w-full">
                            <option value="0" disabled selected>Selecionar Prioridad ...</option>
                            <option value="1">1 (Baja)</option>
                            <option value="2">2 (Media)</option>
                            <option value="3">3 (Alta)</option>
                        </select>
                    </MCInput>
                    <MCInput class="basis-1/6" textIcon="mdi:bug-outline" textLabel="Es un error ?"
                        :textError="is_bug.errorMessage.value">
                        <input v-model="is_bug.value.value" type="checkbox" class="checkbox checkbox-lg  mt-2"
                            style="margin-left: 50%;" />
                    </MCInput>
                </div>
                <div class="flex flex-row gap-4 ">
                    <MCInput class="w-full" textIcon="mdi:format-title" textLabel="Titulo"
                        :textError="title.errorMessage.value">
                        <input v-model="title.value.value" type="text" class="input input-bordered w-full" />
                    </MCInput>
                </div>
                <div class="flex flex-row gap-4 ">
                    <MCInput class="w-full" textIcon="mdi:text-account" textLabel="Descripcion"
                        :textError="description.errorMessage.value">
                        <textarea v-model="description.value.value" class="input input-bordered w-full h-40" />
                    </MCInput>
                </div>
                <div class="float-right">
                    <button class="btn btn-primary m-auto my-2 mx-2 " type="submit">
                        Guardar <Icon icon="mdi:content-save" class="text-xl"></Icon>
                    </button>
                </div>
            </form>
            <div class="float-right">
                <button class="btn btn-success m-auto my-2 mx-2" @click="popFeedback()">
                    Resuelto <Icon icon="mdi:check" class="text-xl"></Icon>
                </button>
            </div>
        </div>

    </MCModal>
</template>

<script setup>
import MCModal from './MCModal.vue';
import { Icon } from '@iconify/vue';
import { ref, onMounted } from 'vue';
import MCInput from '@/components/MCInput.vue';
import * as Yup from "yup";
import { useField, useForm } from 'vee-validate'
import { removeFeedback,updateFeedback } from '@/services/feedback'
import { notificationsStore } from '@/store/notificationsStore';

const props = defineProps({
    feedback: { default: null, type: Object },
    clearProp: { default: null, type: Function }
});

const validationSchema = Yup.object().shape({
    title: Yup.string().required('El titulo es requerido').nonNullable().max(70, 'El titulo no  puede ser tan largo'),
    is_bug: Yup.boolean().required('El indicador es requerido'),
    priority: Yup.number().required('La prioridad es requerida'),
    description: Yup.string().required('La descripcion es requerida'),
})

const { handleSubmit, handleReset, errors } = useForm({
    validationSchema,
    validateOnMount: false
});

const notifications = notificationsStore()
const id = ref(0)
const date_report = ref(null)
const title = useField('title')
const description = useField('description');
const is_bug = useField('is_bug')
const priority = useField('priority')

const submit = handleSubmit(async (values) => {
    let valuesSend = {}
    for (const i in values) {
        if (Object.hasOwnProperty.call(values, i)) {
            valuesSend[i] = values[i];
        }
    }
    valuesSend['id_feedback'] = id.value
    const {data} = await updateFeedback(valuesSend)
    notifications.newMessage(data.success ? 'Reporte actualizado' : 'Error de Servidor', data.success)
    props.clearProp(true)
});

const popFeedback = async () => {
    const { data } = await removeFeedback({ 'id_feedback': id.value })
    notifications.newMessage(data.success ? 'Reporte Eliminado' : 'Error de Servidor', data.success)
    props.clearProp(true)
}

onMounted(() => {
    id.value = props.feedback.id
    description.value.value = props.feedback.description
    date_report.value = props.feedback.date_report
    title.value.value = props.feedback.title
    is_bug.value.value = props.feedback.is_bug
    priority.value.value = props.feedback.priority
    console.log(props.feedback)
})

</script>