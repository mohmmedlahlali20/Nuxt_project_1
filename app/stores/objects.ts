import { defineStore } from 'pinia'
import axios from 'axios'
import { useRuntimeConfig } from '#app'

export const useObjectsStore = defineStore('objects', {
    state: () => ({
        items: [] as any[],
        loading: false,
        error: '',
    }),

    actions: {
        async fetchObjects() {
            this.loading = true
            this.error = ''

            try {
                const config = useRuntimeConfig()
                
                const response = await axios.get(config.public.apiUrl as string)

                this.items = response.data
            } catch (err: any) {
                this.error = err.message || 'Error fetching data'
            } finally {
                this.loading = false
            }
        }
    }
})
