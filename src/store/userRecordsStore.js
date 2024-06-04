import { defineStore } from "pinia"

export const useUserRecords = defineStore('userRecords', {
    state: () => ({ elements: {} }),
    actions: {
        $reset() {
            this.elements = {}
        },
        addElement(newRow, id) {
            this.elements[id] = newRow
        }
    },
    persist: {
        key: 'userRecordsStore',
    },
})
