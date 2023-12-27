import { defineStore } from "pinia"

export const userDataStore = defineStore('userData', {
  state: () => ({ id: 0, name: 'X', token: '' }),
  actions: {
    $reset() {
      this.id = 0
      this.token = ''
      this.name = 'X'
    },
  },
  persist: {
    key: 'userDataStore',
  },
})
