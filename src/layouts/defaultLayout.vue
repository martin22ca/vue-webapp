<template>
    <title>G-SOFT</title>
    <div class="relative flex flex-row h-screen w-screen overflow-hidden">
        <div class="hover-area" @mouseenter="openDrawer" @mouseleave="closeDrawerIfNotHovered" />
        <Drawer :is-open="isDrawerOpen" @mouseleave="closeDrawerIfNotHovered" @mouseenter="keepDrawerOpen" />
        <main class="bg-base-300 flex-1 flex flex-col overflow-y-scroll">
            <Header />
            <slot></slot>
        </main>
        <Toast :toast-open="notifications.open" :duration="notifications.duration" :state="notifications.state"
            :toast-text="notifications.message" :toggle-toast="() => { notifications.toggle() }" />
    </div>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue';
import Drawer from '@/components/Drawer/Drawer.vue'
import { notificationsStore } from "@/store/notificationsStore";
import { ref, watch } from 'vue';
import Toast from '@/components/Toast.vue';

const notifications = notificationsStore()

const isDrawerOpen = ref(false);

// Function to open drawer on hover
function openDrawer() {
    isDrawerOpen.value = true;
}

// Close drawer only if mouse is not in the drawer
function closeDrawerIfNotHovered(event) {
    const relatedTarget = event.relatedTarget || event.toElement;
    if (!relatedTarget || !relatedTarget.closest('.drawer-content')) {
        isDrawerOpen.value = false;
    }
}

// Keep drawer open if hovering over it
function keepDrawerOpen() {
    isDrawerOpen.value = true;
}
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

.hover-area {
    position: absolute;
    width: 40px;
    /* Adjust width based on your needs */
    height: 100%;
    left: 0;
    top: 0;
    z-index: 50;
}

.drawer-content {
    z-index: 100;
    transition: all 0.3s ease;
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