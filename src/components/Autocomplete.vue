<template>
  <div class="autocomplete" ref="autocompleteRef">
    <div class="flex items-center">
      <input v-if="isComponent" v-model="searchQuery"
        class="input input-ghost border-2 border-neutral input w-full " @keydown.enter.prevent="onEnter"
        @focus="onFocus" @input="onInput" ref="inputRef" />
      <div v-else class="input input-ghost border-2 border-neutral input input-sm w-full">
        {{ searchQuery }}
      </div>
      <button @click="toggleOpen" class="btn btn-circle btn-sm btn-primary ml-2 pr-2" type="button">
        <Icon :icon="isOpen ? 'mdi:menu-up' : 'mdi:menu-down'" class="ml-2 text-2xl" />
      </button>
    </div>
    <teleport to="body">
      <div v-if="isOpen" class="autocomplete-dropdown" :style="dropdownStyle">
        <input v-if="!isComponent" v-model="searchQuery" placeholder="..."
          class="input input-ghost border-2 border-neutral input input input-sm w-full m-2" @keydown.enter.prevent="onEnter"
          @focus="onFocus" @input="onInput" ref="inputRef" />
        <ul v-if="filteredResults.length" class="results-list">
          <li v-for="(item, index) in filteredResults" :key="item[keyProp]"
            :class="['result-item', { 'selected': index === selectedIndex }]">
            <button class="btn btn-wide w-full text-left" @click="selectItem(item)" @mouseenter="selectedIndex = index"
              type="button">
              {{ item[textProp] }}
            </button>
          </li>
        </ul>
        <div v-else class="no-results">
          No hay elementos
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { Icon } from '@iconify/vue';
import { useEventListener, useDebounce } from '@vueuse/core';

const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  isComponent: {
    type: Boolean,
    default: true
  },
  textProp: {
    type: String,
    required: true
  },
  keyProp: {
    type: String,
    required: true
  },
  addval: {
    type: Function,
    required: true
  },
  defaultValue: {
    default: null
  }
});

const searchQuery = ref('');
const isOpen = ref(false);
const dropdownStyle = ref({});
const selectedIndex = ref(-1);
const autocompleteRef = ref(null);
const inputRef = ref(null);
const userInteracted = ref(false);

const filteredResults = computed(() =>
  props.items.filter(item =>
    item[props.textProp].toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);

const debouncedSearchQuery = useDebounce(searchQuery, 300);

watch(debouncedSearchQuery, () => {
  if (userInteracted.value) {
    isOpen.value = true;
    updateDropdownPosition();
  }
});

// Set default value on component mount
onMounted(() => {
  if (props.defaultValue) {
    const val = props.items.find((item) => item[props.keyProp] === props.defaultValue);
    if (val) {
      searchQuery.value = val[props.textProp];
    }
  }
  useEventListener(window, 'scroll', updateDropdownPosition, { passive: true });
  useEventListener(window, 'resize', updateDropdownPosition, { passive: true });
});

const toggleOpen = () => {
  userInteracted.value = true;
  isOpen.value ? close() : open();
};

const open = () => {
  isOpen.value = true;
  selectedIndex.value = -1;
  updateDropdownPosition();
};

const close = () => {
  isOpen.value = false;
  selectedIndex.value = -1;
};

const selectItem = (item) => {
  searchQuery.value = item[props.textProp];
  props.addval(item);
  close();
  userInteracted.value = false;  // Reset user interaction flag
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
  if (!userInteracted.value) {
    open();
  }
};

const onInput = () => {
  userInteracted.value = true;
  open();
};

const updateDropdownPosition = () => {
  if (!autocompleteRef.value) return;

  const rect = autocompleteRef.value.getBoundingClientRect();
  dropdownStyle.value = {
    position: 'fixed',
    top: `${rect.bottom}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    zIndex: 1000
  };
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
  background-color: oklch(var(--b3));
  border: 1px solid oklch(var(--n));
  border-radius: 0 0 16px 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-height: 350px;
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