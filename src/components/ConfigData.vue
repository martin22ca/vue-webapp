<template>
    <MCModal :modal-open="props.modalstatus" :toggle-modal="() => { toggleModal() }">
        <div v-if="!loading">
            <h1 class="text-xl mb-2">File: <div class="badge badge-accent badge-lg">{{ props.file.name }} </div>
            </h1>
            <div v-if="headers.length > 0">
                <h3>Columnas:</h3>
                <div class="flex my-2 p-2 overflow-auto border-2 border-neutral rounded-xl ">
                    <div v-for="(header, index) in headers"
                        :class="'m-2 text-center bg-base-300 rounded-lg px-4 border-2 border-transparent  hover:border-accent ' + (header?.remove && 'slide')"
                        :key="index" @click="">
                        <div class="flex flex-col w-32 h-64 justify-between">
                            <div class="basis-1/3">Col:
                                <div>
                                    <div class="bg-neutral text-neutral-content rounded-xl py-2 mb-2">{{ header.name }}
                                    </div>
                                </div>
                            </div>
                            <div>Orden:
                                <div>
                                    <div class="bg-accent text-accent-content rounded-xl py-2 mb-2">{{ header.order }}
                                    </div>
                                </div>
                            </div>
                            <div class="flex flex-row justify-between">
                                <button class="mb-2 btn btn-circle btn-success"
                                    @click="setOrder(index, header.order, header.name)">
                                    <Icon icon="mdi:arrow-down-thick" class="text-2xl" />
                                </button>
                                <button class="mb-2 btn btn-circle btn-error text-2xl" @click="removeHeader(index)">
                                    ✕
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="hero bg-base-300 rounded-xl">
                <div class="hero-content text-center">
                    <div class="max-w-md">
                        <h1 class="text-4xl font-bold">Configuracion Correcta</h1>
                        <p class="py-6">No hay mas columnas en el archivo.</p>
                    </div>
                </div>
            </div>
            <div v-if="configs != null">
                <h3>Columnas DB:</h3>
                <div class="flex flex-row my-2 p-4 overflow-auto rounded-xl gap-4">
                    <button class="btn btn-accent my-2" @click="currentConfig = currentConfig - 1"
                        :disabled="!exists(currentConfig - 1)">
                        <Icon icon="mdi:arrow-left" class="text-4xl"></Icon>
                    </button>
                    <div v-if="exists(currentConfig - 1)"
                        :class="'basis-1/3 p-4 text-center rounded-lg bg-base-200 ' + (configs[currentConfig - 1]?.modified ? 'opacity-50' : '')">
                        <p>Col:
                        <div class="bg-neutral text-neutral-content rounded-lg">{{ configs[currentConfig - 1]?.name }}
                        </div>
                        </p>
                        <p>Orden:
                        <div class="badge badge-lg badge-secondary my-2">{{ configs[currentConfig - 1].order != null ?
                            configs[currentConfig - 1].order : 'NULL' }} </div>
                        </p>
                    </div>
                    <div
                        :class="'grow p-4 bg-base-200 text-center rounded-lg border-2 border-accent ' + (configs[currentConfig]?.modified ? 'opacity-50' : '')">
                        <p>Col:
                        <div class="bg-neutral text-neutral-content rounded-lg">{{ configs[currentConfig].name }} </div>
                        </p>
                        <p>Orden:
                        <div class="badge badge-lg badge-accent my-2">{{ configs[currentConfig].order != null ?
                            configs[currentConfig].order : 'No existe Columna' }} </div>
                        </p>
                        <button class="btn btn-accent btn-wide my-2"
                            @click="configs[currentConfig].order = null; configs[currentConfig].modified = true">
                            No Existe
                        </button>
                    </div>
                    <div v-if="exists(currentConfig + 1)"
                        :class="'basis-1/3 p-4 text-center rounded-lg bg-base-200 ' + (configs[currentConfig + 1]?.modified ? 'opacity-50' : '')">
                        <p>Col:
                        <div class="bg-neutral text-neutral-content rounded-lg ">{{ configs[currentConfig + 1]?.name }}
                        </div>
                        </p>
                        <p>Orden:
                        <div class="badge badge-lg badge-secondary my-2">{{ configs[currentConfig + 1].order != null ?
                            configs[currentConfig + 1].order : 'NULL' }} </div>
                        </p>
                    </div>
                    <button class="btn btn-accent my-2 " @click="currentConfig = currentConfig + 1"
                        :disabled="!exists(currentConfig + 1)">
                        <Icon icon="mdi:arrow-right" class="text-4xl"></Icon>
                    </button>
                </div>
            </div>

            <div class="float-right">
                <button class="btn btn-accent mx-2" @click="sendColsConfig()">
                    Confirmar
                </button>
                <button class="btn btn-secondary" @click="resetCols()">
                    Reset
                </button>
            </div>
        </div>
        <div v-else class="m-auto text-center pt-4 ">
            <h1 class="text-4xl "> Validando archivo Excel...</h1>
            <Loader class="m-auto py-12" />
        </div>
    </MCModal>
</template>


<script setup>
import Loader from '@/components/Loader.vue';
import MCModal from '@/components/Modals/MCModal.vue';
import { setCols, getConfigId } from '@/services/config';
import { notificationsStore } from '@/store/notificationsStore';
import { Icon } from '@iconify/vue';
import { computed, onMounted, ref } from 'vue';
import * as XLSX from 'xlsx';

const props = defineProps({
    file: File,
    idCol: Number,
    toggleModal: Function,
    modalstatus: Boolean,
})
const loading = ref(true)
const headers = ref([]);
const headersOr = ref([]);
const configs = ref(null)
const configsOr = ref(null)
const currentConfig = ref(0)
const notiStore = notificationsStore()

const modalControl = ref({
    status: false,
    success: null,
    text: '',
    title: ''
})

const parseFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const parsedData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        if (parsedData.length > 0) {
            var headObjs = []
            for (let i = 0; i < parsedData[0].length; i++) {
                const element = parsedData[0][i];
                headObjs.push({ order: i, name: element })
            }
            headersOr.value = headObjs
            headers.value = JSON.parse(JSON.stringify(headersOr.value))
        }
    };
    reader.readAsArrayBuffer(file);
};

const setOrder = (index, order, name) => {
    for (let i = 0; i < configs.value.length; i++) {
        if (configs.value[i].order === order) {
            configs.value[i].order = null;
        }
    }
    configs.value[currentConfig.value].order = order
    configs.value[currentConfig.value].modified = true
    configs.value[currentConfig.value].lastCol = name
    if (configs.value[currentConfig.value + 1] !== undefined) currentConfig.value = currentConfig.value + 1
    headers.value[index].remove = true
    setTimeout(() => {
        headers.value.splice(index, 1)
    }, 300);

}

const removeHeader = (index) => {
    headers.value[index].remove = true
    setTimeout(() => {
        headers.value.splice(index, 1)
    }, 300);
}


function verifyArrays() {
    // Create a map to store 'name' values based on 'order' from the other array
    const headersMap = {};

    // Populate the map with 'name' values grouped by 'order'
    headers.value.forEach(obj => {
        headersMap[obj.order] = obj.name;
    });

    // Check 'lastCol' value against 'name' from 'configs' array
    for (let i = 0; i < configs.value.length; i++) {
        const { lastCol, order } = configs.value[i];
        if (headersMap[order] != lastCol) {
            console.log(false)
            return false
        }
    }
    return true; // All values matched or no conflicts found
}

const sendColsConfig = async () => {
    if (configs.value != null) {
        configs.value.forEach(element => {
            element.modified = false
        });
        const {data} = await setCols(configs.value, props.idCol)
        if (data.success) {
            props.toggleModal()
            notiStore.newMessage('Las configuraciones fueron cargadas exitosamentes',true)
        }
    } else {
        modalControl.value.text = ''
        notiStore.newMessage('Error en la carfa de las configuraciones',false)
    }
}

const resetCols = () => {
    headers.value = JSON.parse(JSON.stringify(headersOr.value))
    configs.value = JSON.parse(JSON.stringify(configsOr.value))
    currentConfig.value = 0
}

const exists = computed(() => {
    return (index) => {
        return configs.value[index] !== undefined;
    };
})

onMounted(async () => {
    parseFile(props.file)
    const response = await getConfigId(props.idCol)
    const configArr = JSON.parse(response.data.value);
    configsOr.value = configArr.sort((a, b) => a['order'] - b['order'])
    configs.value = JSON.parse(JSON.stringify(configsOr.value))
    const arraySame = verifyArrays()
    setTimeout(() => {
        if (arraySame) { props.toggleModal() }
        else { loading.value = false }
    }, 500);
})

</script>

<style>
.slide {
    animation: slideBottom 0.5s ease 0s 1 normal forwards;
}

@keyframes slideBottom {
    0% {
        opacity: 1;
        transform: translateY(0);
    }

    100% {
        opacity: 0;
        transform: translateY(250px);
    }
}
</style>