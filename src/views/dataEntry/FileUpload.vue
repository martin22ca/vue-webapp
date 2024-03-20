<template>
    <MCModal :modal-open="configXlS" :toggle-modal="() => { configXlS = !configXlS }" modal-title="Configurar Columnas">
        <ConfigData v-if="selectedFile" :file="selectedFile" :id-col="isDb ? 3 : 4"
            :toggle-modal="() => { configXlS = !configXlS }"></ConfigData>
    </MCModal>
    <MCModal :modal-open="modalControl.status" :modal-text="modalControl.text" :modal-title="modalControl.title"
        :toggle-modal="() => { toggleModal() }">
        <span v-if="modalControl.loading" class="loading loading-dots loading-lg bg-primary"></span>
    </MCModal>
    <Toast :toast-open="toastControl.status" :toast-text="toastControl.text" :toggle-toast="toggleToast" />
    <div class="card card-compact w-auto bg-base-100 shadow-md basis-1/2 m-2 ">
        <div class="card-body">
            <h2 class="card-title" style="font-size: 2.5vh ;">{{ props.cardT }}</h2>
            <p style="font-size: 1.7vh ;">{{ props.description }}</p>
            <p class="py-2 " style="font-size: 2vh ;">
                Ulitma carga:
                <span
                    :class="'badge badge-sm p-4 px-5  ' + (state ? 'bg-success text-success-content' : 'bg-warning text-warning-content')">
                    <Icon icon="material-symbols:calendar-month" class="mx-2" style="font-size: 1.5vh ;" />
                    {{ lastLoad }}
                </span>
            </p>
            <div class="card bg-base-100 m-2 flex flex-row">
                <div v-if="props.state" class="bbadge badge-sm p-4 px-5 bg-success  h-10 text-success-content"
                    style="font-size: 1.5vh ;">
                    Estado: Cargado
                    <Icon class="text-2xl ml-4" icon="icon-park-solid:success" />
                </div>
                <div v-else class="badge badge-sm p-4 px-5 bg-warning  h-10 text-warning-content"
                    style="font-size: 1.5vh ;">
                    Estado: Esperando
                    <span class="ml-4 loading loading-dots loading-md" />
                </div>
            </div>
            <input ref="fileInputRef" @change="handleFileChange" type="file" class="w-full file-input file-input-bordered"
                placeholder="buscar"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                size="" />
            <div class="card-actions justify-end">
                <button v-if="selectedFile != null" class="btn btn-error my-2" @click="clearFileInput">Cancelar</button>
                <button :disabled="selectedFile == null" class="btn btn-primary my-2"
                    @click="sendFileToApi()">Cargar</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import Toast from '@/components/Toast.vue';
import MCModal from '@/components/Modals/MCModal.vue';
import * as XLSX from 'xlsx';
import ConfigData from '@/views/dataEntry/ConfigData.vue';
import { Icon } from '@iconify/vue';
import { ref } from 'vue';
import { postAssignment, postDb } from '@/services/config'

const props = defineProps({
    cardT: String,
    description: String,
    state: Boolean,
    isDb: Boolean,
    refresh: Function,
    lastLoad: String,
})

const modalControl = ref({
    status: false,
    title: 'Titulo',
    text: 'Desc',
    loading: false,
})
const toastControl = ref({
    status: false,
    text: 'Desc',
})
const configXlS = ref(false)
const fileInputRef = ref(null)
const selectedFile = ref(null);

const handleFileChange = (event) => {
    const file = event.target.files[0];
    const allowedExtensions = ['csv', 'xlm', 'xls'];
    const fileExtension = file.name.split('.').pop().toLowerCase();
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
            let data
            modalControl.value.loading = true
            toggleModal('Los datos estan siendo enviados',
                'El archivo esta siendo validado por el servidor, por favor aguarde. Este proceso no debe de durar mas de 1 minuto.')
            if (props.isDb) {
                data = await postDb(formData)
            } else {
                data = await postAssignment(formData)
            }
            if (data.data.success) {
                toggleModal()
                toggleToast('Enviados con exito')
                props.refresh()
                modalControl.value.status = false
            } else {
                toggleModal()
                toggleToast('Error: ' + data.data.error)
                props.refresh()
                modalControl.value.status = false
            }
        } else {
            // Handle error if the file extension is not allowed
            toggleModal()
            toggleToast('error: Tipo de archivo Incorrecto')
            props.refresh()
            modalControl.value.status = false
            console.error('Invalid file type. Please select a spreadsheet file.');
        }

    } catch (error) {
        // Handle any unexpected errors
        toggleModal()
        toggleToast('Error de Servidor:', error)
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
const toggleToast = (textVal) => {
    toastControl.value.text = textVal
    toastControl.value.status = !toastControl.value.status
    setTimeout(() => { toastControl.value.status = false }, 4000)
}

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
</style>