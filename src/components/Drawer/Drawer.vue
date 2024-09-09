<template>
  <div class='drawer w-60 fixed'>
    <input id="my-drawer" type="checkbox" class="drawer-toggle" />
    <aside class="w-60 h-screen bg-base-100 flex flex-col border-r-2 border-neutral sticky end-0">
      <div class="flex flex-col h-full">
        <div class="top flex-grow overflow-y-auto">
          <a href="/" aria-current="page" aria-label="Homepage">
            <div
              class="uppercase font-bold text-3xl text-accent text-center bg-base-200 bg-rounded py-2 mt-2 mx-4 rounded-xl">
              G-<span class="salud text-base-content">soft</span>
            </div>
          </a>
          <div class="menu menu-vertical pl-0 bg-base-100 text-base-content">
            <DrawerItem v-for="Item in itemsArr" :key="Item.route" :title="Item.title" :icon="Item.icon"
              :route="Item.route" :children="Item.children" />
          </div>
        </div>
        <div class="bottom mt-auto p-4">
          <ThemePicker class="mb-4" />
          <button class="btn w-full" @click="logOut">
            Log Out
          </button>
        </div>
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