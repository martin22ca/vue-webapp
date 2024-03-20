<template>
    <div class="text-sm breadcrumbs p-2">
        <ul>
            <li><router-link to="/">Home</router-link></li>
            <li v-for="(crumb, index) in breadcrumbs" :key="index">
                <router-link :to="crumb.path">{{ crumb.label }}</router-link>
            </li>
        </ul>
    </div>
</template>
  
<script>
import { computed, ref, watch, getCurrentInstance } from 'vue';
import { useRoute } from 'vue-router';

export default {
    setup() {
        const route = useRoute();
        const breadcrumbs = ref([]);

        const setBreadcrumbs = () => {
            const paths = route.path.split('/').filter(path => path);
            breadcrumbs.value = paths.map((path, index) => ({
                path: `/${paths.slice(0, index + 1).join('/')}`,
                label: path.charAt(0).toUpperCase() + path.slice(1)
            }));
        };

        watch(() => route.path, setBreadcrumbs, { immediate: true });

        return { breadcrumbs };
    }
};
</script>
  
<style scoped>
/* Add your custom styles here */
</style>
  