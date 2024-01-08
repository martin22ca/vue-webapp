<template>
    <transition name="toast" mode="out-in">
        <div class="toast toast-end z-50 w-64" v-if="props.toastOpen">
            <div :class="'flex flex-col gap-0 alert alert-' + (props.toastSuccess ? 'info' : 'error')">
                <div class="flex-initial progress-bar" :style="{ width: progressBarWidth }"></div>
                <span class="flex-initial">{{ props.toastText }}</span>
            </div>
        </div>
    </transition>
</template>
  
<script setup>
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
        default: 3, // Default duration in milliseconds
    },
});

const progressBarWidth = ref('100%');

const closeToast = () => {
    props.toggleToast();
};

const startProgressBarAnimation = () => {
    let progress = 100;
    const interval = 100; // Interval for updating progress bar width

    const timer = setInterval(() => {
        progress -= (interval / (props.duration * 1000)) * 100;
        progressBarWidth.value = `${Math.max(progress, 0)}%`;
    }, interval);

    setTimeout(() => {
        clearInterval(timer);
        closeToast();
    }, (props.duration * 1000));
};

watch(() => props.toastOpen, (newValue) => {
    if (newValue) {
        startProgressBarAnimation();
    }
});

onMounted(() => {
    if (props.toastOpen) {
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