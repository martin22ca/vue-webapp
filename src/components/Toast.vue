<template>
    <transition name="toast" mode="out-in">
        <div v-if="toastOpen" class="toast toast-end z-50 w-64 " >
            <div v-if="props.state != null" :class="'flex flex-row gap-0 alert alert-' + (props.state ? 'success':'error')" style="max-width:40vw;">
                <div :class="'flex flex-col  text-' + alertType + '-content'">
                    <span class="font-bold flex ">
                        <Icon class="text-xl mr-2" :icon="Titles[alertType].icon" /> {{ Titles[alertType].text }}
                    </span>
                    <span class="flex-initial">{{ toastText }}</span>
                </div>
                <span class="grow"></span>
                <button v-if="duration === null"
                    :class="'self-end p-2 rounded-xl ml-2 bg-neutral text-neutral-content'"
                    @click="toggleToast">
                    <Icon icon="mdi:close" />
                </button>
            </div>
            <div class="progress-bar" v-if="duration !== null" :style="{ width: progressBarWidth }"></div>
        </div>
    </transition>
</template>

<script setup>
import { Icon } from '@iconify/vue';
import { ref, watch, onMounted, computed } from 'vue';

const props = defineProps({
    toastOpen: {
        type: Boolean,
        default: false
    },
    toastText: {
        type: String,
        default: ''
    },
    toggleToast: {
        type: Function,
        required: true
    },
    state: {
        type: Boolean,
        default: null
    },
    duration: {
        type: Number,
        default: null
    }
});

const progressBarWidth = ref('100%');
const alertType = computed(() => {
    if (props.state === true) return 'success';
    if (props.state === false) return 'error';
    return 'info';
});

const Titles = {
    'info': { text: 'Informacion', icon: 'mdi:information' },
    'success': { text: 'Exito', icon: 'mdi:check' },
    'error': { text: 'Alerta', icon: 'mdi:alert-circle' }
};

const startProgressBarAnimation = () => {
    if (typeof props.toggleToast !== 'function') return;

    let progress = 100;
    const interval = 100;
    const timer = setInterval(() => {
        progress -= (interval / (props.duration * 1000)) * 100;
        progressBarWidth.value = `${Math.max(progress, 0)}%`;

        if (progress <= 0) {
            clearInterval(timer);
            props.toggleToast();
        }
    }, interval);
};

watch(
    () => props.toastOpen,
    (newValue) => {
        if (newValue && props.duration) {
            startProgressBarAnimation();
        } else {
            progressBarWidth.value = '100%';
        }
    }
);

onMounted(() => {
    if (props.toastOpen && props.duration !== null) {
        startProgressBarAnimation();
    }
});
</script>

<style>
.progress-bar {
    height: 3px;
    background-color: oklch(var(--p));
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