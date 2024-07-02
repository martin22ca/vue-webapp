<template>
    <MCModal :modal-open="true" modal-title="Selecionar Columnas" :toggle-modal="props.toggleModal">
        <div className="p-2 mt-4 grid grid-cols-2 grid-rows-1 gap-3 overflow-y-auto border-2 border-base-100 rounded-lg"
            style="max-height: 80vh;">
            <div>
                <h2 class="p-2 text-xl bg-base-100 rounded ">Columnas disponibles</h2>
                <draggable class="dragArea list-group" :list="props.baseCols"
                    :group="{ name: 'columns', pull: 'clone', put: false }" item-key="prop" :clone="cloneCol">
                    <template #item="{ element }">
                        <div class="list-group-item">
                            <div class="my-1 p-2 bg-base-200 rounded-lg justify-between flex flex-row">
                                <div>
                                    <Icon icon="mdi:drag" class="text-2xl handle" />
                                </div>
                                <div>
                                    {{ element.name }}
                                </div>
                                <button class="" />
                            </div>
                        </div>
                    </template>
                </draggable>
            </div>
            <div>
                <h2 class="p-2 text-xl bg-base-100 rounded text-xl text-end mb-2">Columnas Selecionadas</h2>
                <draggable class="dragArea list-group h-3/4" :list="selectedCols" group="columns" item-key="prop">
                    <template #item="{ element, index }">
                        <div class="list-group-item">
                            <div
                                :class="'my-1 p-1 bg-base-200 rounded-lg jus justify-between flex flex-row ' + (colsToRemove.includes(element.prop) && 'opacity-50')">
                                <div>
                                    <Icon icon="mdi:drag" class="text-2xl handle" />
                                </div>
                                <div>
                                    {{ element.name }}
                                </div>
                                <button class="btn btn-error btn-circle btn-sm mr-2"
                                    @click="toggleColDel(element.prop)">
                                    ✕
                                </button>
                            </div>
                        </div>
                    </template>
                </draggable>
            </div>
        </div>
        <div class="card-actions flex flex-row pt-4 justify-end">
            <button class="btn btn-secondary " @click="resetCols()">
                Reset
            </button>
            <button class="btn btn-primary" @click="saveCols()">
                Guardar
            </button>
        </div>
    </MCModal>
</template>

<script setup>
import { Icon } from '@iconify/vue';
import draggable from 'vuedraggable'
import MCModal from '@/components/Modals/MCModal.vue';
import { onMounted, ref } from 'vue';

const props = defineProps({
    toggleModal: { type: Function, default: () => { } },
    baseCols: { type: Array, default: [] },
    selectedCols: { type: Array, default: [] },
});

const selectedCols = ref([]);
const colsToRemove = ref([]);

const emit = defineEmits(['update:selectedCols']);

const saveCols = () => {
    colsToRemove.value.forEach(col => {
        const index = selectedCols.value.findIndex(item => item.prop === col);
        if (index !== -1) selectedCols.value.splice(index, 1);
    });
    colsToRemove.value = [];
    emit('update:selectedCols', selectedCols.value);
    props.toggleModal();
};

const cloneCol = (col) => {
    const index = selectedCols.value.findIndex((item) => item.prop === col.prop)
    if (index == -1) {
        return col
    }
    selectedCols.value.splice(index, 1)
    return col
}

const toggleColDel = (prop) => {
    const index = colsToRemove.value.indexOf(prop);
    if (index === -1) colsToRemove.value.push(prop);
    else colsToRemove.value.splice(index, 1);
};

const resetCols = () => {
    colsToRemove.value = [];
    selectedCols.value = [...props.selectedCols];
};

onMounted(() => {
    selectedCols.value = [...props.selectedCols]
})

</script>