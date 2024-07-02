<template>
  <div class="m-auto bg-base-200 rounded-lg fade" style="height: 80vh;">
    <ColsSelector v-if="columnDialog" :base-cols="baseCols" :selected-cols="selectedCols"
      @update:selectedCols="handleSelectedColsUpdate" :toggle-modal="() => { columnDialog = false }" />
    <TableFilters v-if="filtersDialog" :selected-cols="selectedCols" :applied-filters="appliedFilters"
      :filters="availableFilters" :toggle-modal="() => { filtersDialog = false }" @updateFilters="handleUpdateFilters"/>
    <div class="flex flex-row p-4 gap-2 bg-base-100 top-0">
      <button v-if="props.btnExport" class="btn btn-secondary mx-1">
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
    <Loader v-if="props.loading" class="m-auto" style=" padding-top: 20%;" />
    <div v-else class="flex flex-col p-2 " style="height: 80vh; border: 5px,red;" ref="container" />
  </div>
</template>

<script setup lang="ts">
import '@univerjs/sheets-numfmt/lib/index.css';
import { Cell, CellData, Column, RowValue } from './interfaces';
import ColsSelector from './ColsSelector.vue'
import TableFilters from './TableFilters.vue';
import { Icon } from "@iconify/vue";
import { getfilters } from '@/services/config'
import Loader from '@/components/Loader.vue';
import { Univer, UniverInstanceType, Workbook, LocaleType, BooleanNumber, SheetTypes } from "@univerjs/core";
import { defaultTheme } from "@univerjs/design";
import { UniverDocsPlugin } from "@univerjs/docs";
import { UniverDocsUIPlugin } from "@univerjs/docs-ui";
import { UniverFormulaEnginePlugin } from "@univerjs/engine-formula";
import { UniverRenderEnginePlugin } from "@univerjs/engine-render";
import { UniverSheetsPlugin } from "@univerjs/sheets";
import { UniverSheetsFormulaPlugin } from "@univerjs/sheets-formula";
import { UniverSheetsFilterPlugin } from '@univerjs/sheets-filter';
import { UniverSheetsFilterUIPlugin } from '@univerjs/sheets-filter-ui';
import { UniverSheetsNumfmtPlugin } from '@univerjs/sheets-numfmt';
import { UniverSheetsUIPlugin } from "@univerjs/sheets-ui";
import { FUniver } from "@univerjs/facade";
import { UniverUIPlugin } from "@univerjs/ui";
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { zhCN, enUS } from 'univer:locales'
import { WORKBOOK_DATA } from "@/assets/WorkbookData";

const filtersDialog = ref(false)
const columnDialog = ref(false);
const baseCols = ref<Column[]>([]);
const selectedCols = ref<Column[]>([]);
const availableFilters = ref([]);
const appliedFilters = ref([]);

const colsLength = ref(0)
const colsReference = ref({})
const rowLength = ref(0);

const univerRef = ref<Univer | null>(null);
const workbook = ref<Workbook | null>(null);
const container = ref<HTMLElement | null>(null);
const univerAPI = ref<FUniver | null>(null);

const emits = defineEmits(['updateFilters'])

const props = defineProps({
  cols: { type: Array as () => Column[], default: () => [] },
  rows: { type: Array as () => RowValue[], default: () => [] },
  tableName: { type: String, default: 'Table' },
  loading: { type: Boolean, default: true },
  btnCols: { type: Boolean, default: true },
  btnFilters: { type: Boolean, default: true },
  btnExport: { type: Boolean, default: true },
});

const constructCellData = (cols: Column[], rows: RowValue[]): CellData => {
  let cellData: CellData = {};

  // Create header row
  cellData[0] = {};
  cols.forEach((header, index) => {
    cellData[0][index] = { v: header.name, s: 'header' };
    colsReference.value[index] = header.prop
  });

  // Populate data rows
  rows.forEach((item, rowIndex) => {
    let row = rowIndex + 1; // since 0 is for cols
    cellData[row] = {};
    cellData[row]['id'] = item.id_provider
    cols.forEach((header, colIndex) => {
      let propKey = typeof header.prop === 'string' ? header.prop : Object.keys(header.prop)[0];
      let value = item[propKey] !== undefined ? item[propKey] : null;
      cellData[row][colIndex] = { v: value, s: 'cell' };
    });
  });

  return cellData;
}

const setupCols = () => {
  if (props.cols.length <= 0) {
    selectedCols.value = [];
    baseCols.value = [];
    return
  }
  if (!props.cols) {
    const firstRow = props.rows[0];
    const cols = Object.keys(firstRow).map((key, index) => ({
      prop: key,
      name: key,
      size: 100
    }))
    selectedCols.value = [...cols]; // Create a copy of cols
    baseCols.value = [...cols]; // Create a copy of cols
  } else {
    selectedCols.value = [...props.cols]; // Create a copy of props.cols
    baseCols.value = [...props.cols];
  }
}

const manageCols = () => {
  const mainSheet = univerAPI.value.getActiveWorkbook().getActiveSheet()
  for (let i = 0; i < selectedCols.value.length; i++) {
    const element = selectedCols.value[i];
    mainSheet.setColumnWidths(i, 1, element.size ? element.size : 100)
  }
}

const handleSelectedColsUpdate = (newSelectedCols: Column[]) => {
  selectedCols.value = newSelectedCols;
  init(WORKBOOK_DATA);
  manageCols();
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

onBeforeUnmount(() => {
  destroyUniver();
});

/**
 * Destroy univer instance and workbook instance
 */
const destroyUniver = () => {
  workbook.value = null;
};

watch(
  () => props.loading,
  (newValue) => {
    if (selectedCols.value.length <= 0) {
      setupCols();
    }
    if (newValue) {
      return
    }
    else {
      rowLength.value = props.rows.length
      if (rowLength.value > 0) {
        setTimeout(() => {
          init(WORKBOOK_DATA);
          manageCols()
        }, 100)
      }
    }
  }
);


onMounted(async () => {
  const response = await getfilters()
  availableFilters.value = response.data
})

/**
 * Initialize univer instance and workbook instance
 * @param data {IWorkbookData} document see https://univer.work/api/core/interfaces/IWorkbookData.html
 */
const init = (data = {}) => {
  colsLength.value = props.cols.length
  WORKBOOK_DATA.sheets['sheet-01'].cellData = constructCellData(selectedCols.value, props.rows)
  WORKBOOK_DATA.sheets['sheet-01'].columnCount = colsLength.value + 1
  WORKBOOK_DATA.sheets['sheet-01'].rowCount = rowLength.value + 3
  WORKBOOK_DATA.sheets['sheet-01'].name = props.tableName

  const univer = new Univer({
    theme: defaultTheme,
    locale: LocaleType.EN_US,
    locales: {
      [LocaleType.ZH_CN]: zhCN,
      [LocaleType.EN_US]: enUS,
    },
  });
  univerRef.value = univer;

  // core plugins
  univer.registerPlugin(UniverRenderEnginePlugin);
  univer.registerPlugin(UniverFormulaEnginePlugin);
  univer.registerPlugin(UniverUIPlugin, {
    container: container.value!,
  });

  // doc plugins
  univer.registerPlugin(UniverDocsPlugin, {
    hasScroll: false,
  });
  univer.registerPlugin(UniverDocsUIPlugin);

  // sheet plugins
  univer.registerPlugin(UniverSheetsPlugin);
  univer.registerPlugin(UniverSheetsUIPlugin);
  univer.registerPlugin(UniverSheetsFormulaPlugin);
  univer.registerPlugin(UniverSheetsFilterPlugin);
  univer.registerPlugin(UniverSheetsFilterUIPlugin);
  univer.registerPlugin(UniverSheetsNumfmtPlugin);

  // create workbook instance
  univer.createUnit(UniverInstanceType.UNIVER_SHEET, data)
  univerAPI.value = FUniver.newAPI(univer);
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* Also hide the menubar */
:global(.univer-menubar) {
  display: none;
}

.fade{
  animation: myAnim 1s ease 0s 1 normal forwards;
}

@keyframes myAnim {
	0% {
		opacity: 0;
	}

	100% {
		opacity: 1;
	}
}

</style>
