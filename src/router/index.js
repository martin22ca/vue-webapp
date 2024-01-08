// Composables
import { createRouter, createWebHistory } from 'vue-router'
import { userDataStore } from '@/store/userStore'
import { isAuth } from '@/services/admission'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/index.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
  },
  {
    path: '/providers',
    name: 'Providers',
    component: () => import('@/views/Providers.vue'),
  },
  {
    path: '/Records',
    name: 'Records',
    component: () => import('@/views/Records.vue'),
  }, {
    path: '/management/users',
    name: 'Users',
    component: () => import('@/views/management/Users.vue'),
  },
  {
    path: '/input/load',
    name: 'UploadDB',
    component: () => import('@/views/dataUpload/DailyUpload.vue'),
  },
  {
    path: '/input/manual',
    name: 'UploadData',
    component: () => import('@/views/dataUpload/ManualUpload.vue'),
  },
  {
    path: '/test',
    name: 'Test',
    component: () => import('@/views/test.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from) => {
  try {
    let authenticated = false
    const store = userDataStore()
    if (store.token != '') {
      const response = await isAuth(store.token)
      if (!response.data) {
      }
      authenticated = response.data.success
    }
    if (authenticated) {
      if (to.name != 'Login') {
        return true
      } else {
        router.push('/')
        return false
      }
    } else {
      store.$reset()
      if (to.name != 'Login') {
        router.push('/login')
        return false
      } else {
        return true
      }
    }
  } catch (e) {
    console.log('Error', e)
    if (to.name == 'Login') {
      window.alert(
        'API no habilitada'
      )
      return true
    }
    else {
      router.push('/login')
      return false
    }
  }
})

export default router
