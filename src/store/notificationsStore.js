import { ref } from "vue"
import { defineStore } from "pinia"

export const notificationsStore = defineStore('notificationsStore', () => {
    const open = ref(false)
    const message = ref('demo Message')
    const state = ref(null)
    const duration = ref(null)

    function $reset() {
        open.value = false
        message.value = 'demo Message'
        state.value = null
        duration.value = null
    }

    function toggle() {
        open.value = !open
    }

    function newMessage(newMessage, newState = null) {
        setTimeout(() => {
            open.value = false;
        }, 200);
        message.value = newMessage
        state.value = newState
        if (newState) duration.value = 5
        setTimeout(() => {
            open.value = true;
        }, 200);
    }

    return { open, message, state, duration, newMessage, toggle, $reset }
})