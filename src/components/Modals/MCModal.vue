<template>
    <Teleport to="body">
        <dialog class="modal" :open="props.modalOpen" style="background-color: oklch(var(--b1)/.8);">
            <div class="absolute modal-box modalAnim bg-base-300 max-h-screen " style="max-width: 90vw;">
                <button v-if="props.toggleModal != null"
                    class='m-2 btn btn-sm btn-circle absolute right-2 top-2 btn-error '
                    @click="props.toggleModal()">✕</button>
                <div class="font-bold text-2xl flex flex-row items-center">
                    <Icon v-if="props.modalText != null" :class="'mr-2 text-' + color" :icon="modalIcon" />
                    <h3>{{ props.modalTitle }}</h3>
                </div>
                <p v-if="props.modalText != null" class="my-4 text-md">{{ props.modalText }}</p>
                <slot></slot>
            </div>
        </dialog>
    </Teleport>
</template>

<script setup>
import { Icon } from '@iconify/vue';
import { ref, onMounted } from 'vue';

const props = defineProps({
    modalOpen: { type: Boolean },
    modalTitle: String,
    modalText: {
        default: null,
        type: String
    },
    toggleModal: Function,
    modalSucces: {
        type: Boolean,
        default: null
    }
})
const modalIcon = ref('material-symbols:info')
const color = ref('primary')


onMounted(() => {
    if (props.modalSucces != null) {
        if (props.modalSucces) {
            color.value = 'success';
            modalIcon.value = 'icon-park-solid:correct'
        }
        else {
            color.value = 'error';
            modalIcon.value = 'ic:sharp-error'
        }
    }
})

</script>

<style>
.modalAnim {
    animation: fadeBottom 0.5s ease 0s 1 normal forwards;
}


@keyframes fadeBottom {
    0% {
        opacity: 0;
        transform: translateY(50px);
    }

    100% {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>