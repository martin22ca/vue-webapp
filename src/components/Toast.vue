<template>
    <transition name="toast" mode="out-in">
        <div class="toast toast-end z-50 w-64" v-if="props.toastOpen">
            <div :class="'flex flex-col gap-0 alert alert-' + (props.toastSuccess ? 'info' : 'error')">
                <div class="flex-initial progress-bar" v-if="showProgressBar" :style="{ width: progressBarWidth }"></div>
                <button class="btn btn-sm btn-rounded btn-error self-end" v-if="props.duration == null"
                    @click="props.toggleToast()">
                    <Icon icon="mdi:close"></Icon>
                </button>
                <span class="flex-initial">{{ props.toastText }}</span>
            </div>
        </div>
    </transition>
</template>
  
<script setup>
import { Icon } from '@iconify/vue';
import { ref, watch, onMounted } from 'vue';

const props = defineProps({
    toastOpen: Boolean,
    toastText: {
        default: null,
        type: String,
    },
    toggleToast: Function,
    toastSuccess: {
        type: Boolean,
        default: true,
    },
    duration: {
        type: Number,
        default: null, // Default duration in seconds
    },
});

const progressBarWidth = ref('100%');
const showProgressBar = ref(false);

const startProgressBarAnimation = () => {
    let progress = 100;
    const interval = 100; // Interval for updating progress bar width

    const timer = setInterval(() => {
        progress -= (interval / (props.duration * 1000)) * 100;
        progressBarWidth.value = `${Math.max(progress, 0)}%`;
    }, interval);

    setTimeout(() => {
        clearInterval(timer);
        props.toggleToast();
    }, (props.duration * 1000));
};

watch(() => props.toastOpen, (newValue) => {
    if (newValue && props.duration) {
        startProgressBarAnimation();
    } else if (!newValue) {
        showProgressBar.value = true; // Reset showProgressBar when closing
    } else {
        showProgressBar.value = false; // Manual closing, hide progress bar
    }
});

onMounted(() => {
    if (props.toastOpen && props.duration != null) {
        startProgressBarAnimation();
    }
});
</script>
  
<style>
.progress-bar {
    height: 3px;
    background-color: oklch(var(--p));
    /* Change color as needed */
    width: 100%;
    transition: width linear;
}

.toast-exit-active {
    animation: fadeBack 0.5s ease forwards;
}

@keyframes fadeBack {
    0% {
        opacity: 1;
        transform: translateY(0);
    }

    100% {
        opacity: 0;
        transform: translateY(250px);
    }
}

.toast-enter-active,
.toast-leave-active {
    transition: opacity 0.5s, transform 0.5s;
}

.toast-enter-from,
.toast-leave-to {
    opacity: 0;
    transform: scale(0.6);
}
</style>