<template>
    <div class="my-2">
        <h3 class="mx-2 bg-neutral text-neutral-content rounded-xl p-2">{{ props.title }}</h3>
    </div>
</template>

<script setup>
import { computed, ref, watch, getCurrentInstance } from 'vue';
import { useRoute } from 'vue-router';


const route = useRoute();
const breadcrumbs = ref([]);
const props = defineProps({
    title: String
})

const setBreadcrumbs = () => {
    const paths = route.path.split('/').filter(path => path);
    breadcrumbs.value = paths.map((path, index) => ({
        path: `/${paths.slice(0, index + 1).join('/')}`,
        label: path.charAt(0).toUpperCase() + path.slice(1)
    }));
};

watch(() => route.path, setBreadcrumbs, { immediate: true });

</script>

<style scoped>
/* Add your custom styles here */
</style>