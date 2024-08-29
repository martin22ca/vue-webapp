<template>
    <title>G-SOFT</title>
    <div class="flex flex-row h-screen w-screen">
        <div :class="'duration-200 ease-out  ' + (drawerStatus ? 'w-60' : 'w-0')">
            <Drawer v-if="drawerStatus" :drawer-open="drawerStatus" />
        </div>
        <div class="bg-base-300 w-full " :style="contentStyles">
            <NavBar :visible="drawerStatus" :toggle-drawer="toggleDrawer" />
            <div class="bg-base-300  ">
                <slot></slot>
                <Toast :toast-open="notifications.open" :duration="notifications.duration" :state="notifications.state"
                    :toast-text="notifications.message" :toggle-toast="() => { notifications.toggle() }" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Drawer from '@/components/Drawer/Drawer.vue'
import NavBar from '@/components/NavBar.vue';
import { notificationsStore } from "@/store/notificationsStore";
import { computed, ref, onMounted, onBeforeUnmount, watch } from 'vue';
import Toast from '@/components/Toast.vue';

const drawerStatus = ref(true)
const showNavbar = ref(true);
const notifications = notificationsStore()

const toggleDrawer = () => {
    showNavbar.value = true
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

watch(
    () => notifications.message,
    (newValue) => {
        console.log(newValue)
    }
);

</script>

<style>
.shadow {
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

h1 {
    font-size: clamp(1.5rem, 3.5vw, 2.5rem);
    /* Adjust the minimum and maximum values as needed */
}

h2 {
    font-size: clamp(1.3rem, 3vw, 2rem);
}

h3 {
    font-size: clamp(1.1rem, 2.5vw, 1.5rem);
}

p {
    font-size: 1rem;
}

.fadeRight {
    animation: fadeRight 0.5s ease 0s 1 normal forwards;
}

.fadeLeft {
    animation: fadeLeft 0.5s ease 0s 1 normal forwards;
}

@keyframes fadeLeft {
    0% {
        opacity: 0;
        transform: translateX(50px);
    }

    100% {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes fadeRight {
    0% {
        opacity: 0;
        transform: translateX(-50px);
        /* Adjust the initial value to move left */
    }

    100% {
        opacity: 1;
        transform: translateX(0);
    }
}
</style>