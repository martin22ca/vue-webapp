<template>
    <defaultLayout>
        <div class="flex flex-col h-full">
            <h3 class="m-2 bg-neutral text-neutral-content rounded-xl px-2"> Carga Exel</h3>
            <div class="card bg-base-100 shadow-md m-2">
                <h2 class="card-title m-4 underline">
                    Carga de datos
                </h2>
                <p class="mx-4 mb-4">
                    Sube un archivo CSV o XLS para comenzar a analizar tus datos. La aplicación configurará
                    automáticamente las columnas si coinciden con la última configuración utilizada. En caso
                    contrario, las columnas serán configuradas durante la subida del archivo. También podrás ver la
                    última vez que se actualizaron tus datos, incluyendo el día y la hora. De esta manera, siempre
                    estarás al día con la información más reciente.
                </p>
                <div v-if="configData.length > 0" class="card-title flex flex-row text-center p-4">
                    <ul class="steps w-full">
                        <li class="step step-success">Carga Prevencion</li>
                        <li :class="'step ' + (getState(3) ? 'step-success' : '')">Carga
                            Asignacion</li>
                        <li :class="'step ' + ((getState(3) && getState(4)) ? 'step-success' : '')">
                            Carga Manual</li>
                    </ul>
                </div>
            </div>
            <div class="flex flex-row flex-1 grow">
                <Fileuploader v-if="configData.length > 0" cardT="1. Cargar DB Prevencion" :refresh="fetchConfigs"
                    :postConfig="postDb" :config="getValue(3)"
                    description="Primero se deben actualizar la informacion recibida de Prevencion. Esta seccion realizara lo siguiente: ">
                    <div class="ml-2 mb-16" style="font-size: 16px;">
                        <li class="my-2">Crear nuevos expedientes.</li>
                        <li class="my-2"> Actualizar expedientes existentes.</li>
                        <li class="my-2">Registrar prestadores asociados a nuevos expedientes.</li>
                    </div>
                </Fileuploader>
                <Fileuploader v-if="configData.length > 0" cardT="2. Cargar Asignaciones" :refresh="fetchConfigs"
                    :postConfig="postAssignment" :config="getValue(4)"
                    description="Segundo se deben cargar las asignaciones recibidas por correo de Prevencion. Esta seccion realizara lo siguiente:">
                    <div class="ml-2" style="font-size: 16px;">
                        <li class="my-2">Registrar nuevos prestadores.</li>
                        <li class="my-2">Actualizar prestadores existentes.</li>
                        <li class="my-2">Registrar nuevos casos de expedientes.</li>
                        <li class="my-2">Actualizar casos de expedientes existentes.</li>
                    </div>
                </Fileuploader>
                <Fileuploader v-if="configData.length > 0" cardT="3. Carga de lotes" :refresh="fetchConfigs"
                    :postConfig="postLots" :config="getValue(5)"
                    description="Por ultimo pueden cargar los lotes y asignarle los expedeintes  Esta seccion realizara lo siguiente:">
                    <div class="ml-2" style="font-size: 16px;">
                        <li class="my-2">Registrar Lotes.</li>
                        <li class="my-2">Asignar expediente a Lote.</li>
                        <li class="my-2">Registrar Auditores.</li>
                        <li class="my-2">Registrar Auditores.</li>
                    </div>
                </Fileuploader>
            </div>
        </div>
    </defaultLayout>
</template>


<script setup>
import defaultLayout from '@/layouts/defaultLayout.vue'
import Fileuploader from '@/views/dataEntry/FileUploader.vue'
import { ref, onMounted } from 'vue';
import { getConfig } from '@/services/config'
import { postAssignment, postDb, postLots } from '@/services/config'

const configData = ref([])
const Now = new Date()
Now.setHours(0, 0, 0, 0);


const fetchConfigs = async () => {
    const configList = [3, 4, 5]
    const { data } = await getConfig(configList)
    configData.value = data
}

const getValue = (idConfig) => {
    return configData.value.find(item => item.id === idConfig);  
}

const getState = (id) => {
    const dateTime = getValue(id)['mod_date']
    const lastDate = new Date(dateTime);
    return lastDate > Now
}

onMounted(async () => {
    await fetchConfigs()


})

</script>