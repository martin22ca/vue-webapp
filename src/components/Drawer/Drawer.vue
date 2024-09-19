<template>
  <aside :class="['drawer', { 'drawer-open': props.isOpen }]">
    <div class="drawer-content">
      <div class="w-80 h-screen bg-base-100 flex flex-col border-r-2 border-neutral sticky end-0">
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
            <div class="flex flex-row gap-2 justify-between">
              <ThemePicker class="mb-4" />
              <button class="btn btn-error grow" @click="logOut">
                <Icon icon="mdi:exit-to-app" class="text-2xl" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import ThemePicker from '../ThemePicker.vue';
import { useRouter } from 'vue-router';
import { userDataStore } from '@/store/userStore'
import DrawerItem from './DrawerItem.vue';
import { Items as menuItems } from './menuItems'
import { getRoleUser } from '@/services/roles'
import { onMounted, ref, computed } from 'vue';
import { Icon } from '@iconify/vue';



const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  }
})

const router = useRouter()
const userStore = userDataStore()

const initial = ref('M')
const itemsArr = ref([])

const logOut = () => {
  router.push('/login')
  userStore.$reset()
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
  initial.value = String(userStore.name.slice(0, 2)).toUpperCase()
})

</script>


<style>
.drawer {
  position: absolute;
  left: -320px;
  /* Initially hidden */
  width: 250px;
  height: 100%;
  transition: left 0.3s ease;
  background-color: #fafafa;
  /* Background color for the drawer */
}

.drawer-open {
  left: 0px;
  /* Slide out drawer when open */
}

.drawer-content {
  height: 100%;
}
</style>