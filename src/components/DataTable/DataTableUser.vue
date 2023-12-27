<template>
    <dialog class="modal" :open="openModal" style="background-color: oklch(var(--b3)/.8);">
        <div class="modal-box max-w-7xl bg-base-200">
            <form method="dialog">
                <button @click="openModal = false"
                    class="btn btn-sm btn-circle btn-error absolute right-2 top-2">✕</button>
            </form>
            <ModalUser v-if="openModal" :user="user" />
        </div>
    </dialog>
    <button class="text-center" @click="setUser()">
        <Icon icon="material-symbols:info" class="text-xl m-2"></Icon>
    </button>
</template>
  
<script setup>
import ModalUser from '../Modals/ModalUser.vue';
import { onMounted, ref } from 'vue';
import { Icon } from '@iconify/vue';

const props = defineProps(['model', 'prop']);

const user = ref(null)
const openModal = ref(false)

const setUser = () => {
    user.value = props.model
    openModal.value = true
}
</script>
