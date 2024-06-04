<template>
    <div class="w-full">
        <li v-if="hasChilds" class="rounded-lg">
            <a @click="showMenu" class="p-0 pr-4 menu-dropdown-toggle text-md ">
                <button class="btn btn-ghost hover:bg-transparent">
                    <icon :icon="props.icon ?? 'file-icons:default'" class="text-xl" />
                    {{ props.title }}
                </button>
            </a>
            <ul :class="menuVis ? 'menu-dropdown menu-dropdown-show' : 'menu-dropdown'">
                <DrawerItem v-for="child in props.children" :key="child.title" :title="child.title" :icon="child.icon"
                    :route="child.route" :children="child.children" />
            </ul>
        </li>
        <li v-else class="rounded-lg justify-end">
            <div class="p-0">
                <button class="btn btn-ghost hover:bg-transparent" @click="goTo(props.route)">
                    <Icon :icon="props.icon ?? 'file-icons:default'" class="text-xl" />
                    {{ props.title }}
                </button>
            </div>
        </li>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import { ref } from 'vue';
import type { MenuItem } from './menuItems';

const router = useRouter()

const props = defineProps({
    title: String,
    icon: String,
    route: String,
    children: Array<MenuItem>,
});

const hasChilds = props.children != null
const menuVis = ref(false)

const goTo = (route: string) => {
    router.push(route)
}

const showMenu = () => {
    menuVis.value = !menuVis.value
}
</script>