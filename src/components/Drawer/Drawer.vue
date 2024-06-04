<template>
  <div class='drawer w-60 fixed'>
    <input id="my-drawer" type="checkbox" class="drawer-toggle " />
    <aside class="w-60 h-screen bg-base-100 flex flex-col border-r-2 border-neutral sticky end-0">
      <div class="top">
        <a href="/" aria-current="page" aria-label="Homepage">
          <div
            class="uppercase font-bold text-3xl text-accent text-center bg-base-200 bg-rounded py-2 mt-2 mx-4 rounded-xl">
            G-<span class="salud text-base-content">Salud</span>
          </div>
        </a>
        <div class="menu menu-horizontal pl-0 bg-base-100 text-base-content overflow-y-scroll overflow-x-hidden center"
          style="max-height: 70vh;">
          <DrawerItem v-for="Item in itemsArr" :title="Item.title" :icon="Item.icon" :route="Item.route"
            :children="Item.children" />
        </div>
      </div>
      <span class="my-auto"></span>
      <div class="bottom mx-auto items-center p-2">
        <ThemePicker class="m-aut" />
        <button class="btn w-full" @click="logOut">
          Log Out
        </button>
      </div>
    </aside>
  </div>
</template>

<script setup>
import ThemePicker from '../ThemePicker.vue';
import { useRouter } from 'vue-router';
import { userDataStore } from '@/store/userStore'
import DrawerItem from './DrawerItem.vue';
import { Items as menuItems } from './menuItems'
import { getRoleUser } from '@/services/roles'
import { onMounted, ref, computed } from 'vue';


const router = useRouter()
const store = userDataStore()
const itemsArr = ref([])
const logOut = () => {
  router.push('/login')
  store.$reset()
  console.log('out')
}

const fetchRole = async () => {
  const { data } = await getRoleUser()
  const rolePermits = JSON.parse(data.data.configs)
  const titlesInRolePermits = rolePermits.map(item => item.title);
  itemsArr.value = menuItems.filter(item => titlesInRolePermits.includes(item.title));
}
onMounted(async () => {
  fetchRole()
})

</script>


<style></style>