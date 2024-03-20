<template>
    <title>G-SOFT</title>
    <div class="flex flex-row h-screen w-screen">
        <div :class="'duration-200 ease-out  ' + (drawerStatus ? 'w-60' : 'w-0')">
            <Drawer v-if="drawerStatus" :drawer-open="drawerStatus" />
        </div>
        <div class="bg-base-300 w-full " :style="contentStyles">
            <NavBar :toggle-drawer="toggleDrawer" />
            <div class="p-2 bg-base-300  ">
                <slot></slot>
            </div>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import Drawer from '@/components/Drawer/Drawer.vue'
import NavBar from '@/components/NavBar.vue';
import { computed, ref, onMounted, onBeforeUnmount } from 'vue';

const drawerStatus = ref(true)

const toggleDrawer = () => {
    drawerStatus.value = !drawerStatus.value
    setTimeout(() => {
        updateContentWidth()
    }, 300)

}

const contentWidth = ref(window.innerWidth);

const updateContentWidth = () => {
    const drawerWidth = drawerStatus.value ? 240 : 0; // Adjust these values accordingly
    contentWidth.value = window.innerWidth - drawerWidth;
}

// Update content width on window resize
const handleWindowResize = () => {
    updateContentWidth();
}

onMounted(() => {
    updateContentWidth();
    window.addEventListener('resize', handleWindowResize);
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', handleWindowResize);
});

const contentStyles = computed(() => {
    return { 'max-width': `${contentWidth.value}px` };
});
</script>

<style>
.shadow{
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

</style>