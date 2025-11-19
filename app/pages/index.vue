<script setup lang="ts">
import { useObjectsStore } from '~/stores/objects'
import { onMounted, computed } from 'vue'
import type { Item } from '~/types/Items'

// Import ShadCN Card components
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '~/components/ui/card'

const objectsStore = useObjectsStore()
const items = computed<Item[]>(() => objectsStore.items)

onMounted(() => {
  objectsStore.fetchObjects()
})
</script>

<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-6">Objects List</h1>

    <div v-if="objectsStore.loading" class="text-gray-500">Loading...</div>
    <div v-if="objectsStore.error" class="text-red-500 mb-4">
      {{ objectsStore.error }}
    </div>

    <div
      v-if="!objectsStore.loading && !objectsStore.error"
      class="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    >
      <Card
        v-for="item in items"
        :key="item.id"
        class="hover:shadow-lg transition-shadow duration-200"
      >
        <img
          :src="item.image ?? 'https://via.placeholder.com/300x200?text=No+Image'"
          :alt="item.name"
          class="w-full h-48 object-cover rounded-t-lg"
        />

        <CardContent class="p-4">
          <CardHeader>
            <CardTitle>{{ item.name }}</CardTitle>
          </CardHeader>

          <p class="text-sm text-gray-500 mb-1">ID: {{ item.id }}</p>
          <p class="text-sm">Color: {{ item.data?.color ?? 'N/A' }}</p>
          <p class="text-sm">Capacity: {{ item.data?.capacity ?? 'N/A' }}</p>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
