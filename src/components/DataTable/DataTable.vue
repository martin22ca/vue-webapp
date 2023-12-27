<template>
  <MCModal :modal-open="columnDialog" modal-title="Selecionar Columnas"
    :toggle-modal="() => { columnDialog = !columnDialog; applyFilters() }">
    <div className="grid grid-cols-2 grid-rows-1 gap-3">
      <div>
        <h2 class="text-xl mb-2">Columnas disponibles</h2>
        <draggable class="dragArea list-group" :list="baseCols" :group="{ name: 'columns', pull: 'clone', put: false }"
          item-key="prop" :clone="cloneCol">
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
        <h2 class="text-xl text-end mb-2">Columnas Selecionadas</h2>
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
                <button class="btn btn-error btn-circle btn-sm mr-2" @click="colsToRemove.push(element.prop)">
                  ✕
                </button>
              </div>
            </div>
          </template>
        </draggable>
      </div>
    </div>
    <div class="card-actions flex flex-row pt-4 justify-end">
      <button class="btn btn-secondary " @click="cancelCols()">
        Reset
      </button>
      <button class="btn btn-primary" @click="removeCols()">
        Guardar
      </button>
    </div>
  </MCModal>
  <MCModal :modal-open="filtersDialog" modal-title="Filtros" :toggle-modal="() => { filtersDialog = !filtersDialog }">
    <div>
      <div v-for="(filter, index) in appliedFilters" class="my-4 bg-base-100 p-2 rounded-xl">
        <div class="flex flex-row gap-4 overflow-y-auto">
          <div class="m-auto">
            <label class="form-control w-full max-w-xs">
              <div class="label">
                <span class="label-text">Columna </span>
              </div>
              <select v-model="filter.col" @change="handleCol(index, $event)" class="select select-primary">
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
              <select class="select select-primary" @change="handleFilter(index, $event)">
                <option disabled selected>Selecionar Filtro</option>
                <option v-for="(filterOptions, filterIndex) in filters" :value="filterIndex">
                  {{ filterOptions.name }}
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
          <button class="btn btn-circle btn-sm my-auto btn-error mx-2 self-end" @click="removeFilter(filter.id)">
            X
          </button>
        </div>
      </div>
      <div class="my-4 bg-base-200 p-2 rounded-xl ">
        <label class="form-control w-full max-w-xs">
          <div class="label">
            <span class="label-text">Nuevo Filtro</span>
          </div>
          <select class="select select-primary" @change="createNewFilter($event)">
            <option disabled selected>Selecionar Filtro</option>
            <option v-for="col, index in selectedCols" :value="index">
              {{ col.name }}
            </option>
          </select>
        </label>
      </div>
    </div>
    <div class="card-actions">
      <button class="btn btn-primary right-0 ml-auto mr-0" @click="applyFilters()">
        Guardar
      </button>
    </div>
  </MCModal>
  <div class="table-wrapper bg-base-100">
    <div class="flex flex-row p-4 gap-2 bg-base-100 sticky top-0">
      <button class="btn btn-primary" @click="columnDialog = true">
        Columnas
        <Icon icon="material-symbols:arrow-drop-down" class="text-xl text-neutral rounded-xl cursor-pointer" />
      </button>
      <button class="btn btn-primary mx-2" @click="filtersDialog = true">
        Filtros
        <Icon icon="material-symbols:cleaning-services" class="text-xl text-neutral rounded-xl cursor-pointer" />
      </button>
      <button class="btn  btn-primary mx-2" @click="downloadExcel">
        Exportar
        <Icon icon="mdi:file-export" class="text-xl" />
      </button>
      <div class="grow"></div>
      <!-- Extra button Cols-->
      <div>
        <slot name="table_options"></slot>
      </div>
    </div>
    <v-grid v-if="!props.loading && refresh" id="datagrid" theme="compact" :source="props.rows" :columns="selectedCols"
      class="MCGrid" resize="true" editors="text" range="true" autoSizeColumn="true" :row-size="props.rowSize"
      :columnTypes='props.columnTypes'></v-grid>
    <div class="flex flex-1 justify-center py-40 " v-else>
      <Loader />
    </div>
  </div>
</template>
  
<script setup>
import MCModal from '../Modals/MCModal.vue';
import draggable from 'vuedraggable'
import { getfilters } from '@/services/config'
import Loader from '@/components/Loader.vue'
import * as XLSX from 'xlsx';
import { ref, watch, onMounted } from "vue";
import { Icon } from "@iconify/vue";
import VGrid from "@revolist/vue3-datagrid";

let filterIdCounter = 0;

const refresh = ref(true);
const filtersDialog = ref(false)
const columnDialog = ref(false);
const baseCols = ref([]);
const selectedCols = ref([]);
const colsToRemove = ref([]);
const filters = ref()
const appliedFilters = ref([])

const props = defineProps({
  selectedRow: { default: null, },
  columnTypes: { default: {} },
  loading: { default: true, type: Boolean },
  cols: { default: null },
  rows: { default: null },
  rowSize: { default: '50' }
});

const emits = defineEmits(['updateFilters'])

const downloadExcel = () => {
  const wb = XLSX.utils.book_new();
  // Convert table data to worksheet
  const wsData = [
    baseCols.value.map(col => col.name), // Headers
    ...props.rows.map(row => baseCols.value.map(col => row[col.prop])) // Rows
  ];
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  const fileName = `data_${Date.now()}.xlsx`;
  XLSX.writeFile(wb, fileName);
};

const removeCols = () => {
  console.log(selectedCols.value)
  for (let i = 0; i < colsToRemove.value.length; i++) {
    const name = colsToRemove.value[i];
    const index = selectedCols.value.findIndex(item => item.prop == name)
    console.log(index, name)
    selectedCols.value.splice(index, 1)
  }
  refreshData()
  columnDialog.value = false
}


const cancelCols = () => {
  colsToRemove.value = []
  selectedCols.value = [...baseCols.value]
  refreshData()
}


const cloneCol = (col) => {
  const index = selectedCols.value.findIndex((item) => item.prop === col.prop)
  if (index == -1) {
    return col
  }
  selectedCols.value.splice(index, 1)
  return col
}

const refreshData = () => {
  console.log(selectedCols.value)
  refresh.value = false
  setTimeout(() => { refresh.value = true }, 300)
}

const handleCol = (index, event) => {
  const colIndex = selectedCols.value.findIndex((item) => { item.prop == event.target.value })
  const col = selectedCols.value[colIndex]
  appliedFilters.value[index]['col'] = col.prop
  appliedFilters.value[index]['valType'] = col.valType
}

const handleFilter = (index, event) => {
  const filterIndex = event.target.value;
  appliedFilters.value[index]['filterOpt'] = filters.value[filterIndex]
}

const createNewFilter = (event) => {
  const col = selectedCols.value[event.target.value]
  console.log(col)
  const newFilter = {
    'id': filterIdCounter,
    'col': col.prop,
    'valType': col.valType,
    'filterOpt': null,
    'val': '',
  }
  appliedFilters.value.push(newFilter)
  filterIdCounter++;
}

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
  let newArray = appliedFilters.value.map(item => {
    return {
      'col': item.col,
      'funct': item.filterOpt.function,
      'val': item.val
    };
  });
  filtersDialog.value = false
  emits('updateFilters', newArray);
}



const manageCols = () => {
  if (!props.cols || props.rows.length <= 0) {
    const firstRow = props.rows[0];
    const cols = Object.keys(firstRow).map((key, index) => ({
      prop: key,
      name: key,
    }))
    selectedCols.value = [...cols]; // Create a copy of cols
    baseCols.value = [...cols]; // Create a copy of cols
  } else {
    selectedCols.value = [...props.cols]; // Create a copy of props.cols
    baseCols.value = [...props.cols];
  }
}

watch(
  () => props.loading,
  (newValue) => {
    if (newValue == false) {
      manageCols()
    }
  }
);

onMounted(async () => {
  const response = await getfilters()
  filters.value = response.data
})
</script>
  
<style>
.table-wrapper {
  max-width: 99%;
  overflow-x: auto;
  margin-left: 10px;
  margin-right: 20px;
  margin-bottom: 10px;
  border: 2px solid oklch(var(--n));
  height: 90vh;
  overflow-y: auto;
  border-radius: 10px;
}


.MCGrid {
  height: 80vh;
  background-color: white;
  animation: fadeBottom 1s ease 0s 1 normal forwards;
}


.header-rgRow {
  color: oklch(var(--nc));
  background-color: oklch(var(--n));
}

.rgHeaderCell {
  border-right: 1px solid oklch(var(--nc));
}

.rgCell {
  border-right: 1px solid oklch(var(--nc));
}



@keyframes fadeBottom {
  0% {
    opacity: 0;
    transform: translateY(50px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>