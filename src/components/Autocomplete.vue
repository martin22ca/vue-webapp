<template>
  <div class="autocomplete" ref="autocompleteRef">
    <div class="flex items-center">
      <MCInput class="w-full" :text-label="props.label">
        <input
          v-model="displayValue"
          class="input input-primary w-full input mt-3"
          @keydown.down.prevent="onArrowDown"
          @keydown.up.prevent="onArrowUp"
          @keydown.enter.prevent="onEnter"
          @focus="onFocus"
          @input="onInput"
          ref="inputRef"
        />
      </MCInput>
      <button @click="toggleOpen" class="btn btn-circle btn-sm btn-primary pr-2 mt-8 ml-4 mr-4" type="button">
        <Icon :icon="isOpen ? 'mdi:menu-up' : 'mdi:menu-down'" class="ml-2 text-2xl" />
      </button>
    </div>
    <div v-if="isOpen" class="autocomplete-dropdown mr-4 rounded-left " :style="dropdownStyle">
      <ul v-if="filteredResults.length" class="results-list ">
        <li
          v-for="(item, index) in filteredResults"
          :key="item[key]"
          :class="['result-item', { 'selected': index === selectedIndex }]"
        >
          <button
            class="btn btn-wide w-full text-left"
            @click="selectItem(item)"
            @mouseenter="selectedIndex = index"
            type="button"
          >
            {{ item[text] }}
          </button>
        </li>
      </ul>
      <div v-else class="no-results">
        No hay elementos
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { Icon } from '@iconify/vue';
import { useEventListener, useDebounce } from '@vueuse/core';
import MCInput from './MCInput.vue';

const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  key: {
    type: String,
    required: true
  },
  selectNew: {
    type: Function,
    required: true
  },
  defaultValue: {
    default: null
  },
  label:{
    default:'Buscar'
  }
});

const searchQuery = ref('');
const displayValue = ref('');
const isOpen = ref(false);
const dropdownStyle = ref({});
const selectedIndex = ref(-1);
const autocompleteRef = ref(null);
const inputRef = ref(null);
const userInteracted = ref(false);

const filteredResults = computed(() =>
  props.items.filter(item =>
    item[props.text].toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);

const debouncedSearchQuery = useDebounce(searchQuery, 300);

watch(debouncedSearchQuery, () => {
  if (debouncedSearchQuery.value && userInteracted.value) {
    open();
  } else {
    close();
  }
});

// Set default value on component mount
onMounted(() => {
  if (props.defaultValue) {
    const val = props.items.find((item) => item[props.key] === props.defaultValue);
    if (val) {
      displayValue.value = val[props.text];
    }
  }
});

const toggleOpen = () => {
  userInteracted.value = true;
  isOpen.value ? close() : open();
};

const open = () => {
  isOpen.value = true;
  selectedIndex.value = -1;
};

const close = () => {
  isOpen.value = false;
  selectedIndex.value = -1;
};

const selectItem = (item) => {
  displayValue.value = item[props.text];
  searchQuery.value = '';
  props.selectNew(item);
  close();
};

const onArrowDown = () => {
  userInteracted.value = true;
  if (isOpen.value) {
    selectedIndex.value = (selectedIndex.value + 1) % filteredResults.value.length;
  } else {
    open();
  }
};

const onArrowUp = () => {
  userInteracted.value = true;
  if (isOpen.value) {
    selectedIndex.value = (selectedIndex.value - 1 + filteredResults.value.length) % filteredResults.value.length;
  } else {
    open();
  }
};

const onEnter = () => {
  userInteracted.value = true;
  if (isOpen.value && selectedIndex.value > -1) {
    selectItem(filteredResults.value[selectedIndex.value]);
  }
};

const onFocus = () => {
  userInteracted.value = true;
  searchQuery.value = displayValue.value;
  if (searchQuery.value) {
    open();
  }
};

const onInput = (event) => {
  userInteracted.value = true;
  searchQuery.value = event.target.value;
};

useEventListener(document, 'click', (event) => {
  if (autocompleteRef.value && !autocompleteRef.value.contains(event.target) && !event.target.closest('.autocomplete-dropdown')) {
    close();
  }
});
</script>

<style scoped>
.autocomplete {
  position: relative;
}
</style>

<style>
.autocomplete-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: oklch(var(--b3));
  border: 4px solid oklch(var(--n));
  border-radius: 0 0 16px 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-height: 250px;
  overflow-y: auto;
}

.results-list {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

.result-item {
  padding: 8px;
}

.result-item:hover,
.result-item.selected {
  background-color: oklch(var(--b3), 0.7);
}

.no-results {
  padding: 8px;
  text-align: center;
}

</style>