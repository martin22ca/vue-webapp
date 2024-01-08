<template>
    <div class="autocomplete">
      <input
        v-model="searchTerm"
        @input="filterItems"
        @keydown.down="highlightNext"
        @keydown.up="highlightPrevious"
        @keydown.enter="selectItem"
        @focus="showDropdown = true"
        @blur="hideDropdown"
        placeholder="Type to search..."
      />
      <ul v-if="showDropdown && filteredItems.length > 0" class="autocomplete-list">
        <li
          v-for="(item, index) in filteredItems.slice(0, 5)"
          :key="index"
          :class="{ 'selected': index === selectedIndex }"
          @mousedown="selectItemFromList(item)"
        >
          {{ item }}
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      items: {
        type: Array,
        required: true
      },
      value: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        searchTerm: '',
        selectedIndex: -1,
        showDropdown: false
      };
    },
    computed: {
      filteredItems() {
        return this.items.filter(item =>
          item.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      }
    },
    methods: {
      filterItems() {
        this.selectedIndex = -1;
      },
      selectItemFromList(item) {
        this.searchTerm = item;
        this.$emit('input', item);
        this.hideDropdown();
      },
      selectItem() {
        if (this.selectedIndex !== -1) {
          this.searchTerm = this.filteredItems[this.selectedIndex];
          this.$emit('input', this.filteredItems[this.selectedIndex]);
          this.hideDropdown();
        }
      },
      highlightNext() {
        if (this.selectedIndex < this.filteredItems.length - 1) {
          this.selectedIndex++;
        }
      },
      highlightPrevious() {
        if (this.selectedIndex > 0) {
          this.selectedIndex--;
        }
      },
      hideDropdown() {
        this.showDropdown = false;
      }
    }
  };
  </script>
  
  <style>
  .autocomplete {
    position: relative;
  }
  
  .autocomplete-list {
    position: absolute;
    top: calc(100% + 5px); /* Adjust the distance from the input */
    left: 0;
    z-index: 1000;
    background-color: #fff;
    border: 1px solid #ccc;
    padding: 0;
    margin: 0;
    list-style: none;
  }
  
  .autocomplete-list li {
    padding: 5px;
    cursor: pointer;
  }
  
  .autocomplete-list li.selected {
    background-color: #f0f0f0;
  }
  </style>
  