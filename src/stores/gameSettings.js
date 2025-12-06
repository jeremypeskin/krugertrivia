import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import animals from '@/data/animals.js'

// Get all unique categories
const allCategories = [...new Set(animals.map(animal => animal.category))]

export const useGameSettingsStore = defineStore('gameSettings', () => {
  const allCategoriesSelected = ref(true)
  const selectedCategories = ref([...allCategories])

  // Helper to check if category is selected
  const isCategorySelected = (category) => {
    return selectedCategories.value.includes(category)
  }

  // Toggle "All Categories" checkbox
  function toggleAllCategories() {
    allCategoriesSelected.value = !allCategoriesSelected.value
    if (allCategoriesSelected.value) {
      // Select all categories
      selectedCategories.value = [...allCategories]
    }
    // If unchecked, keep current selection (don't clear)
  }

  // Toggle individual category
  function toggleCategory(category) {
    const index = selectedCategories.value.indexOf(category)
    if (index > -1) {
      // Remove category
      selectedCategories.value = selectedCategories.value.filter(c => c !== category)
    } else {
      // Add category
      selectedCategories.value = [...selectedCategories.value, category]
    }

    // Update "All Categories" state based on selection
    allCategoriesSelected.value = selectedCategories.value.length === allCategories.length
  }

  // Get filtered animals based on selected categories
  const filteredAnimals = computed(() => {
    if (allCategoriesSelected.value || selectedCategories.value.length === allCategories.length) {
      return animals
    }
    return animals.filter(animal => selectedCategories.value.includes(animal.category))
  })

  // Reset to default (all categories selected)
  function reset() {
    allCategoriesSelected.value = true
    selectedCategories.value = [...allCategories]
  }

  return {
    allCategoriesSelected,
    selectedCategories,
    allCategories,
    isCategorySelected,
    toggleAllCategories,
    toggleCategory,
    filteredAnimals,
    reset
  }
})

