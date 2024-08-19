import { ref } from "vue"
import { defineStore } from "pinia"

export const usetableStore = defineStore('tableData', () => {
    const id = ref(-1)
    const data = ref({})
    const initData = ref(null)

    function $reset() {
        id.value = -1
        data.value = {}
        initData.value = null
    }

    function setInit(initialValues) {
        initData.value = initialValues
    }

    return { id, data, initData,setInit, $reset }
})