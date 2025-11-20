<script setup lang="ts">
import { useObjectsStore } from '~/stores/objects'
import { onMounted, computed, ref } from 'vue'
import { Search, Palette, Layers, Box } from 'lucide-vue-next'
import type { Item } from '~/types/Items'

import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { Separator } from '~/components/ui/separator'
import { Checkbox } from '~/components/ui/checkbox'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '~/components/ui/card'

const objectsStore = useObjectsStore()

const searchQuery = ref('')
const selectedColors = ref<string[]>([])
const selectedCapacities = ref<string[]>([])

onMounted(() => {
  objectsStore.fetchObjects()
})

const allColors = computed(() => {
  const colors = new Set<string>()
  objectsStore.items.forEach((item: Item) => {
    if (item.data?.color) colors.add(item.data.color)
  })
  return Array.from(colors).sort()
})

const allCapacities = computed(() => {
  const capacities = new Set<string>()
  objectsStore.items.forEach((item: Item) => {
    if (item.data?.capacity) capacities.add(item.data.capacity)
  })
  return Array.from(capacities).sort()
})

const filteredItems = computed<Item[]>(() => {
  return objectsStore.items.filter((item: Item) => {
    const matchesSearch = (item.name ?? '').toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesColor = selectedColors.value.length === 0 || 
      (item.data?.color && selectedColors.value.includes(item.data.color))
    const matchesCapacity = selectedCapacities.value.length === 0 || 
      (item.data?.capacity && selectedCapacities.value.includes(item.data.capacity))
    return matchesSearch && matchesColor && matchesCapacity
  })
})

const toggleFilter = (list: string[], value: string) => {
  const index = list.indexOf(value)
  if (index === -1) list.push(value)
  else list.splice(index, 1)
}
</script>

<template>
  <div class="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
    
    <header class="border-b border-zinc-800 bg-black/60 backdrop-blur-xl sticky top-0 z-50">
      <div class="container mx-auto flex items-center justify-between h-16 px-6">
        <div class="flex items-center gap-3">
          <Box class="w-5 h-5 text-white" />
          <span class="font-bold text-lg tracking-tight">ObjectStore</span>
        </div>
        <div class="flex items-center gap-3">
          <Button variant="ghost" size="sm" class="text-zinc-400 hover:text-white">Docs</Button>
          <Button variant="outline" size="sm" class="border-zinc-800 hover:bg-zinc-900 hover:text-white">Deploy</Button>
          <Button size="sm" class="bg-white text-black hover:bg-zinc-200">Sign In</Button>
        </div>
      </div>
    </header>

    <main class="container mx-auto px-6 py-12">
      <div class="mb-12 max-w-2xl">
        <h1 class="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">
          Explore the Collection
        </h1>
        <p class="text-lg text-zinc-400">
          Browse through our curated list of high-quality objects. Filter by properties to find exactly what you need.
        </p>
      </div>

      <div class="relative max-w-md mb-8">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <Input 
          v-model="searchQuery" 
          placeholder="Search objects..." 
          class="pl-10 h-12 rounded-lg bg-zinc-900/50 border border-zinc-800 focus:ring-2 focus:ring-blue-500 text-white placeholder:text-zinc-500"
        />
      </div>

      <div class="flex flex-col lg:flex-row gap-10">
        <aside class="w-full lg:w-64 flex-shrink-0 space-y-8 lg:sticky lg:top-28 max-h-[calc(100vh-6rem)] overflow-auto">
          <div v-if="allColors.length">
            <h3 class="text-sm font-medium text-white mb-3 flex items-center gap-2">
              <Palette class="w-4 h-4" /> Colors
            </h3>
            <div class="space-y-2">
              <div v-for="color in allColors" :key="color" class="flex items-center gap-2">
                <Checkbox 
                  :id="`color-${color}`"
                  :checked="selectedColors.includes(color)"
                  @update:checked="toggleFilter(selectedColors, color)"
                  class="border-zinc-700 data-[state=checked]:bg-white data-[state=checked]:text-black"
                />
                <label :for="`color-${color}`" class="text-sm text-zinc-400 hover:text-zinc-200 cursor-pointer capitalize">{{ color }}</label>
              </div>
            </div>
          </div>

          <Separator class="bg-zinc-800" v-if="allColors.length && allCapacities.length" />

          <div v-if="allCapacities.length">
            <h3 class="text-sm font-medium text-white mb-3 flex items-center gap-2">
              <Layers class="w-4 h-4" /> Capacity
            </h3>
            <div class="space-y-2">
              <div v-for="cap in allCapacities" :key="cap" class="flex items-center gap-2">
                <Checkbox 
                  :id="`cap-${cap}`"
                  :checked="selectedCapacities.includes(cap)"
                  @update:checked="toggleFilter(selectedCapacities, cap)"
                  class="border-zinc-700 data-[state=checked]:bg-white data-[state=checked]:text-black"
                />
                <label :for="`cap-${cap}`" class="text-sm text-zinc-400 hover:text-zinc-200 cursor-pointer">{{ cap }}</label>
              </div>
            </div>
          </div>
        </aside>

        <div class="flex-1">
          <div v-if="objectsStore.loading" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <div v-for="i in 6" :key="i" class="h-[300px] rounded-xl bg-zinc-900 animate-pulse border border-zinc-800"></div>
          </div>

          <div v-else-if="objectsStore.error" class="p-6 rounded-xl border border-red-900/50 bg-red-950/10 text-red-400">
            Error loading objects: {{ objectsStore.error }}
          </div>

          <div v-else-if="filteredItems.length === 0" class="text-center py-20 border border-dashed border-zinc-800 rounded-xl">
            <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-zinc-900 mb-4">
              <Search class="w-6 h-6 text-zinc-500" />
            </div>
            <h3 class="text-lg font-medium text-white">No objects found</h3>
            <p class="text-zinc-500 mt-1">Try adjusting your search or filters.</p>
            <Button variant="link" class="mt-4 text-white" @click="() => { searchQuery.value=''; selectedColors.value=[]; selectedCapacities.value=[] }">
              Clear all filters
            </Button>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <Card v-for="item in filteredItems" :key="item.id" class="group bg-zinc-900/30 border border-zinc-800 hover:border-zinc-600 transition-all duration-300 overflow-hidden flex flex-col">
              
              <div class="aspect-[4/3] relative overflow-hidden border-b border-zinc-800/50">
                <img 
                  :src="item.image ?? 'https://via.placeholder.com/400x300?text=No+Image'" 
                  :alt="item.name" 
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100" 
                />
                <Badge class="absolute top-3 right-3 bg-black/60 text-xs text-zinc-300 border border-zinc-700">#{{ item.id }}</Badge>
              </div>

              <CardContent class="p-5 flex-1 flex flex-col">
                <h3 class="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors mb-1">{{ item.name }}</h3>
                <p class="text-sm text-zinc-500 line-clamp-2">A premium object from our collection.</p>
                <div class="mt-auto flex flex-wrap gap-2">
                  <Badge v-if="item.data?.color" variant="outline" class="border-zinc-700 text-zinc-400 font-normal capitalize">
                    <span class="w-2 h-2 rounded-full mr-2" :style="{ backgroundColor: item.data.color }"></span>{{ item.data.color }}
                  </Badge>
                  <Badge v-if="item.data?.capacity" variant="outline" class="border-zinc-700 text-zinc-400 font-normal">{{ item.data.capacity }}</Badge>
                </div>
              </CardContent>

              <CardFooter class="p-5 pt-0 border-t border-zinc-800/50 mt-4">
                <div class="w-full flex items-center justify-between pt-4">
                  <span class="text-xs text-zinc-600 font-mono">UPDATED TODAY</span>
                  <Button size="sm" variant="ghost" class="h-8 text-xs hover:bg-white hover:text-black transition-colors">
                    View Details
                  </Button>
                </div>
              </CardFooter>

            </Card>
          </div>

        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
aside::-webkit-scrollbar {
  width: 4px;
}
aside::-webkit-scrollbar-track {
  background: transparent;
}
aside::-webkit-scrollbar-thumb {
  background: #444;
  border-radius: 4px;
}
</style>
