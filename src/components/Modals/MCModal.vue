<template>
    <dialog class="modal" :open="props.modalOpen" style="background-color: oklch(var(--b3)/.8);">
        <div class="modal-box modalAnim max-w-6xl bg-base-300">
            <button class='m-2 btn btn-sm btn-circle absolute right-2 top-2 btn-error'
                @click="props.toggleModal()">✕</button>
            <div class="font-bold text-2xl flex flex-row">
                <Icon :class="'mr-2 text-' + color" :icon="modalIcon" />
                <h3>{{ props.modalTitle }}</h3>
            </div>
            <span class="divider m-1" />
            <p v-if="props.modalText != null" class="py-4">{{ props.modalText }}</p>
            <slot></slot>
        </div>
    </dialog>
</template>

<script setup>
import { Icon } from '@iconify/vue';
import { ref, onMounted } from 'vue';

const props = defineProps({
    modalOpen: Boolean,
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

