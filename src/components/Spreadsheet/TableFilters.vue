<template>
    <MCModal :modal-open="true" modal-title="Filtros" :toggle-modal="props.toggleModal">
        <div class="space-y-4">
            <!-- Applied Filters -->
            <div v-if="appliedFilters.length > 0" style="max-height: 60vh; overflow-y: scroll">
                <h3>Filtros aplicados</h3>
                <div v-for="(filter, index) in appliedFilters" :key="filter.id"
                    class="bg-base-100 p-4 my-2 rounded-xl shadow">
                    <div class="flex items-center gap-4 fade">
                        <!-- Column Select -->
                        <div class="flex-grow">
                            <MCInput text-label="Columna" text-icon="mdi:view-column">
                                <select v-model="filter.col" @change="handleColChange(index, $event)"
                                    class="select select-primary w-full">
                                    <option disabled value="">Seleccionar columna</option>
                                    <option v-for="col in getCols" :key="col.prop" :value="col.prop">
                                        {{ col.name }}
                                    </option>
                                </select>
                            </MCInput>
                        </div>
                        <!-- Filter Condition -->
                        <div v-if="filter.col" class="flex-grow">
                            <MCInput text-label="Filtro" text-icon="mdi:filter">
                                <select v-model="filter.filterOpt" class="select select-primary w-full fade">
                                    <option disabled value="">Seleccionar Filtro</option>
                                    <option v-for="filterOption in getCompatibleFilters(filter.col)"
                                        :key="filterOption.name" :value="filterOption">
                                        {{ filterOption.name }}
                                    </option>
                                </select>
                            </MCInput>
                        </div>

                        <!-- Filter Value -->
                        <div v-if="filter.filterOpt?.values_needed > 0" class="flex-grow">
                            <MCInput text-label="Valor" text-icon="mdi:numeric">
                                <input v-model="filter.val" :type="filter.valType" placeholder="Valor..."
                                    class="input input-primary w-full" />
                            </MCInput>
                        </div>

                        <!-- Remove Filter Button -->
                        <button @click="removeFilter(filter.id)" class="btn btn-circle btn-sm btn-error self-end mb-6">
                            <Icon icon="mdi:close" class="text-lg" />
                        </button>
                    </div>
                </div>
            </div>

            <span class="divider m-2">Nuevo Filtro</span>

            <!-- Add New Filter -->
            <div class="bg-base-200 p-4 rounded-xl">
                <MCInput text-label="Seleccionar Columna" text-icon="mdi:view-column">
                    <select v-model="newFilterSelect" @change="createNewFilter" class="select select-primary w-full">
                        <option disabled value="">Seleccionar Columna</option>
                        <option v-for="col in getCols" :key="col.prop" :value="col.prop">
                            {{ col.name }}
                        </option>
                    </select>
                </MCInput>
            </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end gap-2 mt-4">
            <button @click="clearFilters" class="btn btn-error">
                <Icon icon="mdi:broom" class="text-lg" />
                Limpiar
            </button>
            <button @click="applyFilters" class="btn btn-primary">
                <Icon icon="mdi:content-save" class="text-lg" />
                Aplicar
            </button>
        </div>
    </MCModal>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Icon } from '@iconify/vue';
import MCModal from '@/components/Modals/MCModal.vue';
import MCInput from '../MCInput.vue';

const props = defineProps({
    toggleModal: { type: Function, required: true },
    selectedCols: { type: Array, required: true },
    appliedFilters: { type: Array, required: true },
    filters: { type: Array, required: true },
});

const emits = defineEmits(['updateFilters']);

const appliedFilters = ref(props.appliedFilters);
const newFilterSelect = ref("");
let filterIdCounter = props.appliedFilters.length;

const getCols = computed(() => {
    return props.selectedCols.map(col => ({
        ...col,
        prop: typeof col.prop === 'object' ? col.prop.prop : col.prop
    }));
});

const getCompatibleFilters = (colProp) => {
    const column = getCols.value.find(col => col.prop === colProp);
    return props.filters.filter(filter => {
        // Add logic here to determine which filters are compatible with the column type
        // For example, you might want to exclude certain filters for numeric columns
        return true; // Replace with actual compatibility logic
    });
};

const handleColChange = (index, event) => {
    const col = getCols.value.find(item => item.prop === event.target.value);
    appliedFilters.value[index] = {
        ...appliedFilters.value[index],
        col: col.prop,
        valType: col.valType,
        filterOpt: null,
        val: '',
    };
};

const createNewFilter = () => {
    if (!newFilterSelect.value) return;

    const col = getCols.value.find(item => item.prop === newFilterSelect.value);
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

};

const removeFilter = (itemId) => {
    appliedFilters.value = appliedFilters.value.filter(filter => filter.id !== itemId);
};

const clearFilters = () => {
    appliedFilters.value = [];
    filterIdCounter = 0;
};

const applyFilters = () => {
    emits('updateFilters', appliedFilters.value);
    props.toggleModal();
};
</script>