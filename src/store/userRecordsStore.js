import { defineStore } from "pinia"

export const useUserRecords = defineStore('userRecords', {
    state: () => ({ elements: [] }),
    actions: {
        $reset() {
            this.elements = []
        },
        addElement(newRow) {
            this.elements.push(newRow)
        }
    },
    persist: {
        key: 'userRecordsStore',
    },
})
