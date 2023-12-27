<template>
    <div :class="'dropdown dropdown-bottom dropdown-' + (location)">
        <div tabindex="0" role="button" class="btn btn-primary flex flex-row gap-2 ">
            {{ buttonText }}
            <Icon :icon="iconName" class="text-xl bg-accent-content text-primary rounded-xl cursor-pointer" />
        </div>
        <ul tabindex="0"
                class="dropdown-content show z-[1] p-2 shadow-2xl bg-base-300 rounded-box w-52 h-64 overflow-auto">
            <slot></slot>
        </ul>
    </div>
</template>
  
<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ref } from 'vue';

const props = defineProps({
    zValue: {
        type: Number,
        default: 50,
    },
    buttonText: {
        type: (String || Number),
        default: '',
    },
    location: {
        type: String,
        default: ''
    },
    iconName: {
        type: String,
        default: 'mdi:dots-vertical'
    }
})

const isOpen = ref(false);
</script>
  
<style>
.dropdown {
    position: relative;
    display: inline-block;
}

.dropdown-content {
    display: none;
    position: absolute;
}

.dropdown-content.show {
    display: block;
}
</style>