<template>
    <MCModal :modal-open="true" modal-title="Filtros" :toggle-modal="props.toggleModal">
        <div>
            <div v-for="(filter, index) in appliedFilters" class="my-8 bg-base-100 p-2 rounded-xl">
                <div class="flex flex-row gap-4 overflow-y-auto">
                    <div class="m-auto">
                        <label class="form-control w-full max-w-xs">
                            <div class="label">
                                <span class="label-text">Columna </span>
                            </div>
                            <select v-model="filter.col" @change="handleCol(index, $event)"
                                class="select select-primary">
                                <option disabled selected>Selecionar Columna</option>
                                <option v-for="col, colIndex in selectedCols" :value="col.prop">
                                    {{ col.name }}
                                </option>
                            </select>
                        </label>
                    </div>
                    <div v-if="filter.col" class="m-auto basis-1/3 text-center">
                        <label class="form-control w-full max-w-xs">
                            <div class="label">
                                <span class="label-text">Condicion</span>
                            </div>
                            <select v-model="filter.filterOpt" class="select select-primary">
                                <option disabled value="">Seleccionar Filtro</option>
                                <option v-for="(filterOption, filterIndex) in filters" :key="filterIndex"
                                    :value="filterOption">
                                    {{ filterOption.name }}
                                </option>
                            </select>
                        </label>
                    </div>
                    <span class="grow"></span>
                    <div v-if="filter.filterOpt?.values_needed > 0 && filter.filterOpt" class="m-auto grow justify-end">
                        <label class="form-control w-full max-w-xs text-end">
                            <div class="label">
                                <span class="label-text">Valor</span>
                            </div>
                            <input v-model="filter.val" :type="filter.valType" placeholder="Valor..."
                                class="input input-primary input-md w-full " />
                        </label>
                    </div>
                    <button class="btn btn-circle btn-sm mb-auto btn-error ml-2 self-end"
                        @click="removeFilter(filter.id)">
                        X
                    </button>
                </div>
            </div>
            <div class="my-4 bg-base-200 p-2 rounded-xl ">
                <label class="form-control w-full max-w-xs">
                    <div class="label">
                        <span class="label-text">Nuevo Filtro</span>
                    </div>
                    <select v-model="newFilterSelect" @change="createNewFilter($event)" class="select select-primary">
                        <option disabled value="">Seleccionar Filtro</option>
                        <option v-for="col in getCols" :key="col.prop" :value="col.prop">
                            {{ col.name }}
                        </option>
                    </select>
                </label>
            </div>
        </div>
        <div class="card-actions float-right p-2">
            <div>
                <button class="btn btn-primary mr-2 right-0" @click="applyFilters()">
                    <Icon icon="mdi:content-save" />Guardar
                </button>
                <button class="btn btn-error ml-2 right-0" @click="appliedFilters = [];">
                    <Icon icon="mdi:broom" />Limpiar
                </button>
            </div>
        </div>
    </MCModal>
</template>

<script setup>
import { Icon } from '@iconify/vue';
import MCModal from '@/components/Modals/MCModal.vue';
import { computed, onMounted, ref } from 'vue';

let filterIdCounter = 0
const appliedFilters = ref([])
const newFilterSelect = ref("");
const emits = defineEmits(['updateFilters'])

const props = defineProps({
    toggleModal: { type: Function, default: () => { } },
    selectedCols: { type: Array, default: [] },
    appliedFilters: { type: Array, default: [] },
    filters: { type: Array, default: [] },
});


const getCols = computed(()=>{
    let cols = []
    props.selectedCols.forEach(col => {
        if(col.prop === Object(col.prop)){
            let newCol = col
            newCol.prop = col.prop.prop
            cols.push(newCol)
        }
        else cols.push(col)
    });
    return cols
})

const handleCol = (index, event) => {
    const colIndex = props.selectedCols.findIndex((item) => item.prop === event.target.value)
    const col = props.selectedCols[colIndex]
    appliedFilters.value[index]['col'] = col.prop
    appliedFilters.value[index]['valType'] = col.valType
    newFilter.value = 0
}

const createNewFilter = (event) => {
    const col = props.selectedCols.find(item => item.prop === event.target.value);
    appliedFilters.value.push({
        id: filterIdCounter++,
        col: col.prop,
        valType: col.valType,
        filterOpt: null,
        val: '',
    });
    setTimeout(() => {
        newFilterSelect.value = "";
    }, 1)
    // Reset the new filter select
};

const removeFilter = (itemId, all = false) => {
    if (all) {
        appliedFilters.value = []
        filterIdCounter = 1
    } else {
        const index = appliedFilters.value.findIndex((item) => item.id === itemId)
        appliedFilters.value.splice(index, 1)
    }
}


const applyFilters = () => {
    emits('updateFilters', appliedFilters.value);
    props.toggleModal()
}


onMounted(() => {
    appliedFilters.value = props.appliedFilters
})
</script>