<template>
    <div class="flex flex-row h-screen w-screen bg-base-300">
        <div :class="'duration-200 ease-out ' + (drawerStatus ? 'w-60' : 'w-0')">
            <Drawer v-if="drawerStatus" :drawer-open="drawerStatus" />
        </div>
        <div class="w-full" :style="contentStyles">
            <NavBar :toggle-drawer="toggleDrawer" />
            <div class="p-2">
                <slot></slot>
            </div>
        </div>
    </div>
</template>
  

<script setup lang="ts">
import Drawer from '../components/Drawer/Drawer.vue'
import NavBar from '../components/NavBar.vue';
import { computed, ref } from 'vue';

const drawerStatus = ref(true)

const toggleDrawer = () => {
    drawerStatus.value = !drawerStatus.value
}

const contentStyles = computed(() => {
    const screenWidth = window.innerWidth;
    const drawerWidth = drawerStatus.value ? 240 : 0; // Adjust these values accordingly
    return { 'max-width': `${screenWidth - drawerWidth}px` };

});
</script>
