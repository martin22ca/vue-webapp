<template>
    <div class="">
        <div class="text-sm breadcrumbs pl-2 mt-2 mb-0">
            <ul>
                <li><router-link to="/">Home</router-link></li>
                <li v-for="(crumb, index) in breadcrumbs" :key="index">
                    <router-link :to="crumb.path">{{ crumb.label }}</router-link>
                </li>
            </ul>
        </div>
        <h2 class="pl-2 pr-2 pb-2 mt-0">{{ props.title }}</h2>
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