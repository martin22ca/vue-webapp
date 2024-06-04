<template>
    <div class="ultima-carga-estado">
        <p class="py-2">
            <span class="flex flex-row center items-center gap-2">
                Ulitma carga:
                <span class="grow"></span>
                <span :class="{
                    'badge p-4 px-5': true,
                    'bg-success text-success-content': state,
                    'bg-warning text-warning-content': !state
                }">
                    <Icon icon="material-symbols:calendar-month" class="mx-2" style="font-size: 1rem;" />
                    {{ lastLoad }}
                </span>
            </span>
        </p>
        <p class="py-2">
            <span class="flex flex-row center items-center gap-2">
                Estado:
                <span class="grow"></span>
                <span :class="{
                    'badge p-4 px-5': true,
                    'bg-success text-success-content': state,
                    'bg-warning text-warning-content': !state
                }">
                    {{ state ? 'Cargado' : 'Esperando' }}
                    <Icon v-if="state" class="text-2xl ml-4" icon="icon-park-solid:success" />
                    <span v-else class="ml-4 loading loading-dots loading-md" />
                </span>
            </span>
        </p>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';
import { Icon } from '@iconify/vue';

const props = defineProps({
    state: Boolean,
    lastLoad: String
});
</script>

<style scoped>
.ultima-carga-estado p {
    display: flex;
    /* Align badges vertically */
    align-items: center;
}
</style>