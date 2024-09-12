<template>
  <defaultLayout>
    <h3 class="m-2 bg-neutral text-neutral-content rounded-xl px-2">Reportar feedback</h3>
    <div class="max-w-xl mt-4 mx-auto p-6 bg-base-200 rounded-lg shadow-lg fadeRight">
      <h3 class="p-2 ">Reportes de errores y mejoras</h3>
      <p class="p-2 text-sm">Si encuentras un error o pensaste en una mejora para la pagina, se puede reportar
        directamente aqui. Detalla el problema que has encontrado o tu idea y de acuedo a la
        priorida sera el orden de implementacion</p>
    </div>
    <div class="max-w-xl mt-4 mx-auto p-6 bg-base-200 rounded-lg shadow-lg fadeRight">
      <form @submit.prevent="submit" class="">
        <MCInput textIcon="mdi:format-title" textLabel="Titulo" :textError="title.errorMessage.value">
          <input v-model="title.value.value" id="title" placeholder="Elige un titulo descriptivo ... "
            class="input input-bordered w-full mt-1 block w-full py-2 px-3 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></input>
        </MCInput>
        <div class="flex flex-row gap-4">
          <MCInput class="basis-2/3" textIcon="mdi:priority-high" textLabel="Prioridad"
            :textError="priority.errorMessage.value">
            <select v-model="priority.value.value" id="priority" class="select select-bordered w-full">
              <option value="0" disabled selected>Selecionar Prioridad ...</option>
              <option value="1">1 (Baja)</option>
              <option value="2">2 (Media)</option>
              <option value="3">3 (Alta)</option>
            </select>
          </MCInput>
          <MCInput class="basis-1/3" textIcon="mdi:bug-outline" textLabel="Es un error ?"
            :textError="is_bug.errorMessage.value">
            <input v-model="is_bug.value.value" type="checkbox" class="checkbox checkbox-lg  mt-2"
              style="margin-left: 50%;" />
          </MCInput>
        </div>
        <MCInput textIcon="mdi:text-box" textLabel="Descripcion"
          :textError="description.errorMessage.value">
          <textarea v-model="description.value.value" id="description"
            placeholder="Describe el error/ la nueva idea ..."
            class="textarea textarea-bordered w-full mt-1 block w-full py-2 px-3 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></textarea>
        </MCInput>
        <div class="flex gap-2 ">
          <button type="submit" class="btn btn-primary basis-1/2 rounded-md shadow-sm">Enviar</button>
          <button @click="handleReset" class="btn btn-warning basis-1/2 rounded-md shadow-sm">Reset</button>
        </div>

      </form>
    </div>
  </defaultLayout>
</template>

<script setup>
import Breadcrumbs from '@/components/Header.vue';
import MCInput from '@/components/MCInput.vue';
import { notificationsStore } from '@/store/notificationsStore';
import defaultLayout from '@/layouts/defaultLayout.vue';
import * as Yup from "yup";
import { registerFeedback } from '@/services/feedback'
import { useField, useForm } from 'vee-validate'
import { onMounted, watch } from 'vue';


const validationSchema = Yup.object().shape({
  description: Yup.string().required('La descripcion es requerida').nonNullable('Describe el error'),
  priority: Yup.number().required('La prioridad es requerida'),
  title: Yup.string().required('El Titulo es requerido').max(70,'El titulo no puede ser tan largo').nonNullable(),
  is_bug: Yup.boolean().required().nonNullable()
});

const { handleSubmit, handleReset, errors } = useForm({
  validationSchema,
  validateOnMount: false
});

const notiStore = notificationsStore()
const description = useField('description')
const priority = useField('priority')
const title = useField('title')
const is_bug = useField('is_bug')

const reset = handleReset(() => {
  is_bug.value.value = false
  description.value = null 
  title.value = null
  priority.value = null
});

const submit = handleSubmit(async (values) => {
  console.log(values)
  const { data } = await registerFeedback(values)
  console.log(data)
  notiStore.newMessage(data.success ? data.message : data.errors, data.success)
  handleReset()
});

onMounted(()=>{
  is_bug.value.value = false
})


</script>