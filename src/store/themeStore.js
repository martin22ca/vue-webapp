import { defineStore } from "pinia"

export const usethemeStore = defineStore('themeStore', {
    state: () => ({ currentTheme: 'dark' }),
    actions: {
        $reset() {
            this.currentTheme = 'dark'
        },
        setTheme(newTheme) {
            this.currentTheme = newTheme
        }
    },
    persist: {
        key: 'themeStore',
    },
})
