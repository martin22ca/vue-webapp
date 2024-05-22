<template>
  <div class="autocomplete">
    <MCInput textIcon="mdi:search" textLabel="Buscar ...">
      <div class="flex items-center">
        <input v-model="searchQuery" class="input input-bordered w-full" @input="onInput" />
        <button @click="toggleOpen" class="btn btn-circle btn-primary ml-2 pr-2" type="button">
          <span v-if="isOpen">
            <Icon icon="mdi:menu-up" class="ml-2 text-2xl " />
          </span>
          <span v-else>
            <Icon icon="mdi:menu-down" class="ml-2 text-2xl " />
          </span>
        </button>
      </div>
      <ul v-if="isOpen && filteredResults.length" class="results-list">
        <li v-for="item in filteredResults" :key="item[keyProp]" class="result-item">
          <button class="btn btn-wide w-full" @click="props.addval(item)" type="button">
            {{ item[textProp] }}
          </button>
        </li>
      </ul>
      <h3 v-else-if="isOpen && !filteredResults.length" class="center mx-auto text-center">
        No hay elementos
      </h3>
    </MCInput>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue';
import MCInput from './MCInput.vue';
import { ref, onMounted, computed } from 'vue';

const props = defineProps({
  items: {
    type: Array,
    required: true
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
  isOpenOnMount: {
    type: Boolean,
    default: false
  }
});

const selected = ref([]);
const searchQuery = ref('');
const isOpen = ref(props.isOpenOnMount);

const toggleOpen = () => {
  isOpen.value = !isOpen.value;
};

const filteredResults = computed(() =>
  props.items.filter(item =>
    item[props.textProp].toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);

const onInput = () => {
  if (!isOpen.value) {
    isOpen.value = true;
  }
};

onMounted(() => {
  isOpen.value = props.isOpenOnMount;
});
</script>

<style scoped>
.autocomplete {
  position: relative;
}

.search-bar {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  font-size: 16px;
}

.results-list {
  position: absolute;
  width: 100%;
  max-height: 250px;
  overflow-y: auto;
  border: 1px solid oklch(var(--n));
  background-color: oklch(var(--b3));
  list-style-type: none;
  margin: 0;
  padding: 0;
  border-bottom-right-radius: 16px;
  border-bottom-left-radius: 16px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.result-item {
  padding: 8px;
  cursor: pointer;
}

.result-item:hover {
  background-color: oklch(var(--b3), 0.7);
}
</style>
