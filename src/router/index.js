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
    name: 'Provedores',
    component: () => import('@/views/Providers.vue'),
  },
  {
    path: '/RecordsDB',
    name: 'Expedientes DB',
    component: () => import('@/views/RecordsDatabase.vue'),
  },
  {
    path: '/RecordsMain',
    name: 'Expediente Asignados',
    component: () => import('@/views/RecordsMain.vue'),
  }, {
    path: '/management/users',
    name: 'Usuarios',
    component: () => import('@/views/management/Users.vue'),
  },
  {
    path: '/management/setroles',
    name: 'Asignacion Roles',
    component: () => import('@/views/management/Roles.vue'),
  },
  {
    path: '/management/roles',
    name: 'Roles',
    component: () => import('@/views/management/Roles.vue'),
  },
  {
    path: '/input',
    name: 'Carga Exel',
    component: () => import('@/views/dataEntry/DailyUpload.vue'),
  },
  {
    path: '/input/manual',
    name: 'Carga Manual',
    component: () => import('@/views/dataEntry/ManualUpload.vue'),
  },
  {
    path: '/input/lots',
    name: 'Lotes',
    component: () => import('@/views/dataEntry/LotManagement.vue'),
  },
  {
    path: '/reportFeedback',
    name: 'Reportar Nuevo Feedback',
    component: () => import('@/views/ReportFeedback.vue'),
  },
  {
    path: '/feedback',
    name: 'Feedback',
    component: () => import('@/views/Feedback.vue'),
  },  {
    path: '/report',
    name: 'Reportes',
    component: () => import('@/views/Report.vue'),
  },
  {
    path: '/Admin',
    name: 'Admin',
    component: () => import('@/views/AdminPanel.vue'),
  },
  {
    path: '/audit',
    name: 'Vista Auditor',
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
    console.error('Error', e)
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
