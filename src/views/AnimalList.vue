<template>
  <div class="animal-list-container">
    <h1>Animal Encyclopedia</h1>
    <div class="animals-grid">
      <router-link
        v-for="animal in animals"
        :key="animal.id"
        :to="`/animal/${animal.id}`"
        class="animal-card"
      >
        <div class="card-image">
          <img :src="animal.images[0]" :alt="animal.name" />
        </div>
        <div class="card-info">
          <h2>{{ animal.name }}</h2>
          <span class="category-badge">{{ animal.category }}</span>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import animalsData from '@/data/animals.js'

const animals = ref([])

onMounted(() => {
  animals.value = animalsData
})
</script>

<style scoped>
.animal-list-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #dbeafe 0%, #e0f2fe 25%, #f0f9ff 50%, #ecfdf5 75%, #d1fae5 100%);
  padding: 2rem 1.5rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

h1 {
  color: #1a1a1a;
  font-size: 2.5rem;
  margin: 0 0 2rem 0;
  text-align: center;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.animals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.animal-card {
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  border: 2px solid #e5e5e5;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
}

.animal-card:hover {
  transform: translateY(-4px);
  border-color: #58CC02;
  box-shadow: 0 4px 16px rgba(88, 204, 2, 0.2);
}

.card-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #f7f7f7;
  position: relative;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.2s ease;
}

.animal-card:hover .card-image img {
  transform: scale(1.05);
}

.card-info {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.card-info h2 {
  margin: 0;
  color: #1a1a1a;
  font-size: 1.25rem;
  font-weight: 700;
}

.category-badge {
  display: inline-block;
  padding: 0.375rem 0.875rem;
  background: #f0fdf4;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #58CC02;
  border: 1px solid #58CC02;
  align-self: flex-start;
}

@media (max-width: 768px) {
  h1 {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }

  .animals-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 1rem;
  }

  .card-image {
    height: 150px;
  }

  .card-info h2 {
    font-size: 1.2rem;
  }
}

@media (max-width: 480px) {
  .animal-list-container {
    padding: 1rem;
  }

  .animals-grid {
    grid-template-columns: 1fr;
  }
}
</style>

