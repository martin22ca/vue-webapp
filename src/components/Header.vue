<template>
    <nav class="m-2 bg-neutral rounded-xl p-2 h-16 flex  justify-between gap-2">
        <h3 class="text-neutral-content self-center">{{ Title }}</h3>
        <span class="flex grow" />
        <button class="btn btn-sm btn-primary btn-circle rounded-full self-center">
            <RouterLink to="/reportFeedback">
                <Icon icon="mdi:lightbulb" class="text-xl" />
            </RouterLink>
        </button>
        <div class="avatar placeholder">
            <div class="bg-primary text-primary-content w-8 rounded-full">
                <span class="text-2xl">{{ Name }}</span>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import { Icon } from '@iconify/vue';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { userDataStore } from '@/store/userStore';

const store = userDataStore()
const route = useRoute();
const Title = ref('Title')
const Name = ref('')

onMounted(() => {
    Title.value = route.name
    Name.value = store.name.charAt(0)
})
watch(route.fullPath, newT => { Title.name = newT })

</script>

<style scoped>
/* Add your custom styles here */
</style>