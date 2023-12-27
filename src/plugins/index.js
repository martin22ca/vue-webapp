import pinia from '../store/'
import router from '../router'

export function registerPlugins(app) {
  app
    .use(router)
    .use(pinia)
}