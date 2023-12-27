<template>

  <div class='drawer w-60 fixed'>
    <input id="my-drawer" type="checkbox" class="drawer-toggle " />
    <aside class="w-60 h-screen bg-base-100 flex flex-col border-r-2 border-neutral sticky end-0">
      <div class="bg-base-100 z-20 hidden items-center gap-2 bg-opacity-90 px-4 py-2 backdrop-blur lg:flex ">
        <a href="/" aria-current="page" aria-label="Homepage" class="flex-0 btn btn-ghost px-2"
          data-svelte-h="svelte-pw6yxt">
          <div class="uppercase font-title inline-flex text-lg md:text-2xl text-accent">G-<span
              class="salud text-base-content">Salud</span>
          </div>
        </a>
      </div>
      <ul class="menu p-2 pl-0 bg-base-100 text-base-content">
        <DrawerItem v-for="Item in itemArr" :title="Item.title" :icon="Item.icon" :route="Item.route"
          :children="Item.children" />
      </ul>
      <div class="mt-auto items-center p-5">
        <div>
          <ThemePicker />
          <button class="btn w-full" @click="logOut">
            Log Out
          </button>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import ThemePicker from '../ThemePicker.vue';
import { useRouter } from 'vue-router';
import { userDataStore } from '@/store/userStore'
import DrawerItem from './DrawerItem.vue';
import type { MenuItem } from './menuItems';
import { Items } from './menuItems'


const router = useRouter()
const store = userDataStore()

const logOut = () => {
  router.push('/login')
  store.$reset()
  console.log('out')
}

const itemArr: Array<MenuItem> = Items

</script>


<style></style>
