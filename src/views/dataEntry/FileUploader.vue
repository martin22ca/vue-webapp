<template>
    <ConfigData v-if="selectedFile" :file="selectedFile" :id-col="id_config" :modalstatus="configXlS"
        :toggle-modal="() => { configXlS = !configXlS }"></ConfigData>
    <MCModal :modal-open="modalControl.status" :modal-text="modalControl.text" :modal-title="modalControl.title"
        :toggle-modal="() => { toggleModal() }">
        <span v-if="modalControl.loading" class="loading loading-dots loading-lg bg-primary"></span>
    </MCModal>
    <div class="card card-compact w-auto bg-base-100 shadow-md basis-1/2 m-2 ">
        <div class="flex flex-grow flex-col m-4">
            <h3 class="card-title underline">{{ props.cardT }}</h3>
            <p>{{ props.description }}</p>
            <div class="m-6">
                <slot> </slot>
            </div>
            <span class="flex flex-1 grow" />
            <div class="">
                <p class="">
                    <span class="flex flex-row center items-center gap-2">
                        Ulitma carga:
                        <span class="grow"></span>
                        <span v-if="lastLoad != f"
                            :class="{ 'badge p-4 px-5': true, 'bg-success text-success-content': state, 'bg-warning text-warning-content': !state }">
                            <Icon icon="material-symbols:calendar-month" class="mx-2" style="font-size: 1rem;" />
                            {{ lastLoad }}
                        </span>
                        <span v-else class="badge my-1 p-4 px-5 badge-error ">
                            Error
                            <Icon v-if="state" class="text-2xl ml-4" icon="mdi:alert-circle" />
                        </span>
                    </span>
                </p>
                <p class="pb-2">
                    <span class="flex flex-row center items-center gap-2">
                        Estado:
                        <span class="grow"></span>
                        <span v-if="state != null"
                            :class="{ 'badge p-4 px-5': true, 'bg-success text-success-content': state, 'bg-warning text-warning-content': !state }">
                            {{ state ? 'Cargado' : 'Esperando' }}
                            <Icon v-if="state" class="text-2xl ml-4" icon="icon-park-solid:success" />
                            <span v-else class="ml-4 loading loading-dots loading-md" />
                        </span>
                        <span v-else class="badge p-4 px-5 badge-error ">
                            Error
                            <Icon v-if="state" class="text-2xl ml-4" icon="mdi:alert-circle" />
                        </span>
                    </span>
                </p>
            </div>
            <div class="flex flex-row center-items ">
                <input ref="fileInputRef" @change="handleFileChange" type="file"
                    class="w-full file-input file-input-bordered" placeholder="buscar"
                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    size="" />

                <button v-if="selectedFile != null" class="btn btn-error mx-2" @click="clearFileInput">Cancelar</button>
                <button :disabled="selectedFile == null" class="btn btn-primary mx-2"
                    @click="sendFileToApi()">Cargar</button>


            </div>

        </div>
    </div>
</template>

<script setup>
import * as XLSX from 'xlsx';
import { Icon } from '@iconify/vue';
import MCModal from '@/components/Modals/MCModal.vue';
import { notificationsStore } from '@/store/notificationsStore';
import ConfigData from '@/views/dataEntry/ConfigData.vue';
import { onMounted, ref } from 'vue';

const props = defineProps({
    cardT: String,
    description: String,
    config: Object,
    refresh: Function,
    postConfig: Function
})

const notiStore = notificationsStore()
const modalControl = ref({
    status: false,
    title: 'Titulo',
    text: 'Desc',
    loading: false,
})
const now = new Date();
const configXlS = ref(false)
const fileInputRef = ref(null)
const selectedFile = ref(null);
const state = ref(false)
const lastLoad = ref(false)

var id_config = null
now.setHours(0, 0, 0, 0);

const handleFileChange = (event) => {
    const file = event.target.files[0];
    selectedFile.value = file
    configXlS.value = true
}

const sendFileToApi = async () => {
    try {
        // Check if the file is a spreadsheet (csv, xlm, xls)
        const file = selectedFile.value
        const allowedExtensions = ['csv', 'xlm', 'xls', 'xlsx'];
        const fileExtension = file.name.split('.').pop().toLowerCase();
        clearFileInput()

        if (allowedExtensions.includes(fileExtension)) {
            const formData = new FormData();
            formData.append('file', file);
            modalControl.value.loading = true
            toggleModal('Los datos estan siendo enviados',
                'El archivo esta siendo validado por el servidor, por favor aguarde. Este proceso no debe de durar mas de 1 minuto.')
            const data = await props.postConfig(formData)
            if (data.data.success) {
                toggleModal()
                configXlS.value = false
                notiStore.newMessage('Expedientes enviados con exito', true)
                props.refresh()
                modalControl.value.status = false
            } else {
                toggleModal()
                configXlS.value = false
                notiStore.newMessage('Error: ' + data.data.error, false)
                props.refresh()
                modalControl.value.status = false
            }
        } else {
            // Handle error if the file extension is not allowed
            toggleModal()
            notiStore.newMessage('error: Tipo de archivo Incorrecto', false)
            props.refresh()
            modalControl.value.status = false
            console.error('Invalid file type. Please select a spreadsheet file.');
        }

    } catch (error) {
        // Handle any unexpected errors
        toggleModal()
        notiStore.newMessage('Error de Servidor:', error, false)
        props.refresh()
        modalControl.value.status = false
        console.error('An error occurred:', error);
    }
};

const clearFileInput = () => {
    fileInputRef.value.value = null;
    selectedFile.value = null
};

const toggleModal = (titleVal = null, textVal = null) => {
    modalControl.value.title = titleVal
    modalControl.value.text = textVal
    modalControl.value.status = !modalControl.value.status
}

onMounted(() => {
    id_config = props.config.id
    // Split the datetime string by 'T' to separate date and time
    if (props.config.mod_date == null) {
        state.value = null
        lastLoad.value = null
        return
    }
    var dateTime = props.config.mod_date.split('T');
    var date = dateTime[0];
    var time = dateTime[1].split('.')[0];
    lastLoad.value = date + ' ' + time
    const lastDate = new Date(dateTime);

    if (lastDate > now) {
        state.value = true
    }

})
</script>

<style scoped>
.loader {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    display: block;
    margin: 15px auto;
    position: relative;
    background: #FFF;
    box-shadow: -24px 0 #FFF, 24px 0 #FFF;
    box-sizing: border-box;
    animation: shadowPulse 2s linear infinite;
}

@keyframes shadowPulse {
    33% {
        background: #FFF;
        box-shadow: -24px 0 #FF3D00, 24px 0 #FFF;
    }

    66% {
        background: #FF3D00;
        box-shadow: -24px 0 #FFF, 24px 0 #FFF;
    }

    100% {
        background: #FFF;
        box-shadow: -24px 0 #FFF, 24px 0 #FF3D00;
    }
}

.ultima-carga-estado p {
    display: flex;
    /* Align badges vertically */
    align-items: center;
}
</style>