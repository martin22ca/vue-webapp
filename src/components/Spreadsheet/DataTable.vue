<template>
  <div>
    <ColsSelector v-if="columnDialog" :base-cols="baseCols" :selected-cols="selectedCols"
      @update:selectedCols="handleSelectedColsUpdate" :toggle-modal="() => { columnDialog = false }" />
    <TableFilters v-if="filtersDialog" :selected-cols="selectedCols" :applied-filters="appliedFilters"
      :filters="availableFilters" :toggle-modal="() => { filtersDialog = false }"
      @updateFilters="handleUpdateFilters" />
    <div class="table-wrapper ">
      <div class="flex flex-row p-4 gap-2 bg-base-100 top-0">
        <button v-if="props.btnExport" class="btn btn-secondary mx-1" @click="downloadExcel">
          <Icon icon="mdi:file-export" class="text-xl" />
        </button>
        <button v-if="props.btnCols" class="btn btn-primary mx-1" @click="columnDialog = true">
          <Icon icon="mdi:format-columns" class="text-2xl text-neutral rounded-xl cursor-pointer" />
        </button>
        <button v-if="props.btnFilters" class="btn btn-secondary mx-1" @click="filtersDialog = true">
          <Icon icon="mdi:filter" class="text-xl text-neutral rounded-xl cursor-pointer" />
        </button>
        <div class="grow"></div>
        <!-- Extra button Cols-->
        <div>
          <slot name="table_options"></slot>
        </div>
      </div>
      <v-grid v-if="!props.loading && refresh && props.rows.length > 0" id="datagrid" theme="compact"
        :source="props.rows" :columns="selectedCols" class="MCGrid" resize="true" editors="text" range="true"
        autoSizeColumn="true" :row-size="props.rowSize" :columnTypes='props.columnTypes'
        @beforeedit="gridAfterEdit"></v-grid>
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
import ColsSelector from './ColsSelector.vue'
import TableFilters from './TableFilters.vue';
import { getfilters } from '@/services/config'
import Loader from '@/components/Loader.vue'
import * as XLSX from 'xlsx';
import { ref, watchEffect, onMounted } from "vue";
import { Icon } from "@iconify/vue";
import VGrid from "@revolist/vue3-datagrid";

const refresh = ref(true);
const filtersDialog = ref(false)
const columnDialog = ref(false);
const baseCols = ref([]);
const selectedCols = ref([]);

const availableFilters = ref([]);
const appliedFilters = ref([]);

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

const handleSelectedColsUpdate = (newSelectedCols) => {
  selectedCols.value = newSelectedCols;
};


const handleUpdateFilters = (newFilters) => {
  appliedFilters.value = newFilters
  let newArray = appliedFilters.value.map(item => {
    return {
      'col': item.col,
      'funct': item.filterOpt.function,
      'val': item.val
    };
  });
  emits('updateFilters', newArray);
}


const refreshData = () => {
  refresh.value = false
  setTimeout(() => { refresh.value = true }, 1)
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
});



onMounted(async () => {
  const response = await getfilters()
  availableFilters.value = response.data
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