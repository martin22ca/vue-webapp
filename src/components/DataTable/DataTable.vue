<template>
  <div>
    <MCModal :modal-open="columnDialog" modal-title="Selecionar Columnas"
      :toggle-modal="() => { columnDialog = !columnDialog; applyFilters() }">
      <div className="grid grid-cols-2 grid-rows-1 gap-3 overflow-y-auto" style="max-height: 80vh;">
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
    <div class="table-wrapper ">
      <div class="flex flex-row p-4 gap-2 bg-base-100 top-0">
        <button v-if="props.btnCols" class="btn btn-secondary mx-1" @click="columnDialog = true">
          <Icon icon="mdi:format-columns" class="text-2xl text-neutral rounded-xl cursor-pointer" />
        </button>
        <button v-if="props.btnFilters" class="btn btn-primary mx-1" @click="filtersDialog = true">
          <Icon icon="mdi:filter" class="text-xl text-neutral rounded-xl cursor-pointer" />
        </button>
        <button v-if="props.btnExport" class="btn btn-secondary mx-1" @click="downloadExcel">
          <Icon icon="mdi:file-export" class="text-xl" />
        </button>
        <div class="grow"></div>
        <!-- Extra button Cols-->
        <div>
          <slot name="table_options"></slot>
        </div>
      </div>
      <v-grid v-if="!props.loading && refresh && props.rows.length > 0" id="datagrid" theme="compact" :source="props.rows"
        :columns="selectedCols" class="MCGrid" resize="true" editors="text" range="true" autoSizeColumn="true"
        :row-size="props.rowSize" :columnTypes='props.columnTypes' @beforeedit="gridAfterEdit"></v-grid>
      <div v-else class="flex flex-1 justify-center mt-20 ">
        <Loader v-if="props.loading" />
        <div v-else class="flex flex-col flex-1 justify-center ">
          <div class="m-auto flex  mt-20">
            <h1 class="text-4xl text-center mx-24">
              No Hay elementos ...
              <img src="@/assets/pig.png" width="200" class="m-auto ">
            </h1>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script setup>
import MCModal from '../Modals/MCModal.vue';
import draggable from 'vuedraggable'
import { getfilters } from '@/services/config'
import Loader from '@/components/Loader.vue'
import * as XLSX from 'xlsx';
import { ref, watchEffect, onMounted } from "vue";
import { Icon } from "@iconify/vue";
import VGrid from "@revolist/vue3-datagrid";

let filterIdCounter = 0
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
  btnCols: { default: true, type: Boolean },
  btnFilters: { default: true, type: Boolean },
  btnExport: { default: true, type: Boolean },
  cols: { default: null },
  rows: { default: null },
  rowSize: { default: '50' },
  customEdit: { default: () => { }, type: Function }
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
  colsToRemove.value = []
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
  refresh.value = false
  setTimeout(() => { refresh.value = true }, 1)
}

const handleCol = (index, event) => {
  const colIndex = selectedCols.value.findIndex((item) => item.prop === event.target.value)
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
  if (!props.cols && props.rows.length > 0) {
    const firstRow = props.rows[0];
    const cols = Object.keys(firstRow).map((key, index) => ({
      prop: key,
      name: key,
    }))
    selectedCols.value = [...cols]; // Create a copy of cols
    baseCols.value = [...cols]; // Create a copy of cols
  } else {
    if (props.rows.length > 0) {
      selectedCols.value = [...props.cols]; // Create a copy of props.cols
      baseCols.value = [...props.cols];
    } else {
      selectedCols.value = [];
      baseCols.value = [];
    }
  }
}

const gridAfterEdit = (e) => {
  props.customEdit(e)
}


watchEffect(() => {
  if (props.loading == false) { manageCols() }
  if (props.rows.length > 0) { refreshData() }
});



onMounted(async () => {
  const response = await getfilters()
  filters.value = response.data
})
</script>
  
<style>
.table-wrapper {
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  max-width: 99%;
  overflow-x: auto;
  margin-left: 10px;
  margin-right: 20px;
  margin-bottom: 10px;
  overflow-y: auto;
  border-radius: 10px;
}


.MCGrid {
  z-index: 10;
  height: 80vh;
  background-color: white;
}


.header-rgRow {
  color: oklch(var(--nc));
  background-color: oklch(var(--n));
}

.rgHeaderCell {
  border-right: 1px solid oklch(var(--nc));
}

.rgCell {
  font-size: smaller;
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

.center {
  padding-top: 20px;
  display: block;
  margin-left: auto;
  margin-right: auto;
}
</style>