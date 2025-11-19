<script setup lang="ts">
import { useObjectsStore } from '~/stores/objects'
import { onMounted, computed } from 'vue'
import type { Item } from '~/types/Items'


const objectsStore = useObjectsStore()

const items = computed<Item[]>(() => objectsStore.items as Item[])

onMounted(() => {
  objectsStore.fetchObjects()
})
</script>

<template>
  <div class="p-4">
    <h1 class="text-xl font-bold mb-4">Objects List</h1>

    <div v-if="objectsStore.loading">Loading...</div>

    <div v-if="objectsStore.error" class="text-red-500">
      {{ objectsStore.error }}
    </div>

    <ul v-if="!objectsStore.loading && !objectsStore.error">
      <li v-for="item in items" :key="item.id">
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>
