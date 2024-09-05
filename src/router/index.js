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
    path: '/RecordsDB',
    name: 'RecordsDB',
    component: () => import('@/views/RecordsDatabase.vue'),
  },
  {
    path: '/RecordsMain',
    name: 'RecordsMain',
    component: () => import('@/views/RecordsMain.vue'),
  }, {
    path: '/management/users',
    name: 'Users',
    component: () => import('@/views/management/Users.vue'),
  },
  {
    path: '/management/setroles',
    name: 'SetRoles',
    component: () => import('@/views/management/Roles.vue'),
  },
  {
    path: '/management/roles',
    name: 'Roles',
    component: () => import('@/views/management/Roles.vue'),
  },
  {
    path: '/input',
    name: 'UploadDB',
    component: () => import('@/views/dataEntry/DailyUpload.vue'),
  },
  {
    path: '/input/manual',
    name: 'UploadData',
    component: () => import('@/views/dataEntry/ManualUpload.vue'),
  },
  {
    path: '/input/lots',
    name: 'lots',
    component: () => import('@/views/dataEntry/LotManagement.vue'),
  },
  {
    path: '/reportFeedback',
    name: 'reportFeeback',
    component: () => import('@/views/ReportFeedback.vue'),
  },
  {
    path: '/feedback',
    name: 'feedback',
    component: () => import('@/views/Feedback.vue'),
  },  {
    path: '/report',
    name: 'report',
    component: () => import('@/views/Report.vue'),
  },
  {
    path: '/Admin',
    name: 'Admin',
    component: () => import('@/views/AdminPanel.vue'),
  },
  {
    path: '/audit',
    name: 'AuditView',
    component: () => import('@/views/Audit.vue'),
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
      const response = await isAuth(store.token, to.path)
      if (!response.data) {
      }
      authenticated = response.data
    }
    if (authenticated.success) {
      if (to.name != 'Login') {
        return true
      } else {
        router.push('/')
        return false
      }
    } else {
      store.$reset()
      if (to.name != 'Login') {
        console.log(
          'error',authenticated.error
        )
        alert(authenticated.error)
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
