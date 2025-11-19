import { defineStore } from 'pinia'
import axios from 'axios'

export const useObjectsStore = defineStore('objects', {
    state: () => ({
        items: [],
        loading: false,
        error: null
    }),

    actions: {
        async fetchObjects() {
            const config = useRuntimeConfig()

            this.loading = true
            this.error = null

            try {
                const response = await axios.get(config.public.apiUrl)
                this.items = response.data
            } catch (err: any) {
                this.error = err.message
            } finally {
                this.loading = false
            }
        }
    }
})
