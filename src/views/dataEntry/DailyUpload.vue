<template>
    <defaultLayout>
        <Breadcrumbs />
        <h1 class="p-2">Carga de datos</h1>
        <div class="flex flex-col">
            <div class="top">
                <div class="card w-auto bg-base-100 shadow-md m-2">
                    <div class="card-title flex flex-row text-center p-4">
                        <ul class="steps w-full">
                            <li class="step step-success">Carga Prevencion</li>
                            <li :class="'step ' + (state1 ? 'step-success' : '')">Carga
                                Asignacion</li>
                            <li :class="'step ' + ((state1 && state2) ? 'step-success' : '')">
                                Carga Manual</li>
                        </ul>
                    </div>
                </div>
                <div class="flex flex-row flex-1">
                    <FileUpload :state="state1" :isDb="true" cardT="1. Cargar DB Prevencion" :refresh="getInfo"
                        :lastLoad="lastLoad1"
                        description="Primero se deben actualizar la informacion recibida de Prevencion. Esta debe estar en formato CSV" />
                    <FileUpload :state="state2" :isDb="false" cardT="2. Cargar Asignaciones" :refresh="getInfo"
                        :lastLoad="lastLoad2"
                        description="Segundo se deben cargar las asignaciones recibidas por correo de Prevencion. Esta debe estar en formato CSV" />
                </div>
            </div>
        </div>
    </defaultLayout>
</template>


<script setup>
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import { useRouter } from 'vue-router';
import defaultLayout from '@/layouts/defaultLayout.vue'
import FileUpload from './FileUpload.vue'
import { ref, onMounted } from 'vue';
import { getConfig } from '@/services/config'

const router = useRouter()
const state1 = ref(false);
const state2 = ref(false);
const lastLoad1 = ref(null)
const lastLoad2 = ref(null)

const Now = new Date()
Now.setHours(0, 0, 0, 0);

const goTo = () => {
    console.log(router)
    router.push('/records')
}

const getInfo = async () => {
    const { data } = await getConfig()
    for (const status of data) {
        const statusD = new Date(status.value)
        statusD.setHours(0, 0, 0, 0);
        const stateVal = statusD >= Now;
        if (status.id === 1) {
            state1.value = stateVal;
            lastLoad1.value = status.value
        } else {
            state2.value = stateVal;
            lastLoad2.value = status.value
        }
    }
}

onMounted(async () => {
    await getInfo()
})

</script>