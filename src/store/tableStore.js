import { ref } from "vue"
import { defineStore } from "pinia"

export const usetableStore = defineStore('tableData', () => {
    const id = ref(-1)
    const data = ref({})

    function $reset() {
        id.value = -1
        data.value = {}
    }

    return { id, data, $reset }
})