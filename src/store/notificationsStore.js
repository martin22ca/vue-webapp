import { ref } from "vue"
import { defineStore } from "pinia"

export const notificationsStore = defineStore('notificationsStore', () => {
    const open = ref(false)
    const message = ref('demo Message')
    const state = ref(null)
    const duration = ref(0)

    function $reset() {
        open.value = false
        message.value = 'demo Message'
        state.value = null
        duration.value = 0
    }

    function toggle() {
        open.value = !open
    }

    function newMessage(newMessage, newState = null, newDuration = 0) {
        open.value = false
        message.value = newMessage
        state.value = newState
        duration.value = newDuration
        setTimeout(() => {
            open.value = true;
        }, 200);
    }

    return { open, message, state, newMessage, toggle, $reset }
})