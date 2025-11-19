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
                console.log('Fetching from:', `${config.public.apiUrl}/items`)

                const response = await axios.get(`${config.public.apiUrl}/items`)
                console.log('====================================');
                console.log(response.data,"fuck");
                console.log('====================================');
                this.items = response.data
            } catch (err: any) {
                this.error = err.message
            } finally {
                this.loading = false
            }
        }
    }
})
