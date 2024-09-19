<template>
    <div class="dropdown dropdown-top">
        <div tabindex="0" role="button" class="btn btn-block">
            Tema
            <Icon icon="mdi:brightness" class="text-xl text-accent rounded-xl cursor-pointer" />
        </div>
        <ul tabindex="0" class="dropdown-content show z-[1] p-2 shadow-2xl bg-base-300 rounded-box w-52 h-64 overflow-auto">
            <li v-for="theme in themes">
                <input type="radio" name="theme-dropdown" @click="setTheme(theme)"
                    class="theme-controller btn btn-sm btn-block btn-ghost justify-start" :aria-label="theme"
                    :value="theme" />
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { usethemeStore } from '@/store/themeStore'
import { Icon } from '@iconify/vue';

const store = usethemeStore()

const setTheme = (newTheme: any) => {
    document.getElementsByTagName("html")[0].setAttribute('data-theme', newTheme);
    store.setTheme(newTheme)
    console.log(store.currentTheme)
}

const themes = [
    'system',
    'light',
    'dark',
    'cupcake',
    'bumblebee',
    'emerald',
    'corporate',
    'synthwave',
    'retro',
    'cyberpunk',
    'valentine',
    'halloween',
    'garden',
    'forest',
    'aqua',
    'lofi',
    'pastel',
    'fantasy',
    'wireframe',
    'black',
    'luxury',
    'dracula',
    'cmyk',
    'autumn',
    'business',
    'acid',
    'lemonade',
    'night',
    'coffee',
    'winter',
];

onBeforeMount(() => {
    document.getElementsByTagName("html")[0].setAttribute('data-theme', store.currentTheme);
})
</script>
