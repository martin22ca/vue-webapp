<template>
    <header :class="'sticky top-0 z-50 ' + (!props.visible ?'h-0':'') " >
        <div v-if="!props.visible" class="flex flex-row p-2 items-center fadeTop ">
            <div class="flex flex-row p-2 items-center ">
                <div class="flex-none">
                    <label class="btn btn-primary btn-circle swap">
                        <input type="checkbox" @click="toggleDrawer?.()" />
                        <Icon icon="ic:baseline-menu" class="swap-off" size="24px" />
                        <Icon icon="ic:round-menu-open" class="swap-on" size="24px" />
                    </label>
                </div>
            </div>
        </div>
        <div v-else class="flex flex-row p-2 bg-base-100 items-center fadeTop">
            <div class="flex-none">
                <label class="btn btn-primary btn-circle swap">
                    <input type="checkbox" @click="toggleDrawer?.()" />
                    <Icon icon="ic:baseline-menu" class="swap-off" size="24px" />
                    <Icon icon="ic:round-menu-open" class="swap-on" size="24px" />
                </label>
            </div>
            <div class="flex-1">
                <input type="text" placeholder="Buscar..." class="ml-2 input input-bordered w-full max-w-xs">
            </div>
            <div class="flex-none">
                <div class="mx-2 text-xl">
                    <button class="btn btn-sm rounded-xl bg-neutral mx-1">
                        <Icon icon="mdi:bell" class=" text-neutral-content w-4 h-4" />
                    </button>
                    <RouterLink class="btn btn-sm rounded-xl bg-neutral mx-1" to="/reportFeedback">
                        <Icon icon="mdi:lifebuoy" class="text-neutral-content w-4 h-4" />
                    </RouterLink>

                    <div class="avatar placeholder">
                        <div class="bg-primary rounded-full w-12">
                            <span class="text-xl text-primary-content uppercase">{{ initial }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { userDataStore } from '@/store/userStore'
import { onMounted, ref } from 'vue';

const store = userDataStore()

const initial = ref('')
const props = defineProps({
    visible: {
        type: Boolean,
        default: true
    },
    toggleDrawer: Function,
})
onMounted(() => {
    initial.value = store.name[0]
})
</script>

<style>

.fadeTop{
    animation: myAnim 0.5s ease-out 0s 1 normal forwards;
}

@keyframes myAnim {
	0% {
		opacity: 0;
		transform: translateY(-50px);
	}

	100% {
		opacity: 1;
		transform: translateY(0);
	}
}</style>
