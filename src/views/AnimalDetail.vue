<template>
  <div class="animal-detail-container">
    <router-link to="/" class="back-button">← Back to Animals</router-link>

    <div v-if="animal" class="animal-detail-content">
      <div class="animal-image-section">
        <div class="images-gallery">
          <div
            v-for="(image, index) in animal.images"
            :key="index"
            class="image-wrapper"
          >
            <img :src="image" :alt="`${animal.name} - Image ${index + 1}`" />
          </div>
        </div>
      </div>

      <div class="animal-info-section">
        <h1>{{ animal.name }}</h1>
        <div class="category-tag">{{ animal.category }}</div>

        <div class="info-card">
          <h2>About</h2>
          <p class="animal-description">
            {{ animal.description }}
          </p>
        </div>

        <div class="info-card">
          <h2>Similar Animals</h2>
          <div class="suggestions-list">
            <span
              v-for="(suggestion, index) in animal.suggestions"
              :key="index"
              class="suggestion-chip"
            >
              {{ suggestion }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="loading">
      <p>Loading...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import animalsData from '@/data/animals.js'

const route = useRoute()
const animal = ref(null)

onMounted(() => {
  const animalId = parseInt(route.params.id)
  animal.value = animalsData.find(a => a.id === animalId)
})
</script>

<style scoped>
.animal-detail-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #dbeafe 0%, #e0f2fe 25%, #f0f9ff 50%, #ecfdf5 75%, #d1fae5 100%);
  padding: 2rem 1.5rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.back-button {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: #ffffff;
  border: 2px solid #e5e5e5;
  border-radius: 12px;
  color: #1a1a1a;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 2rem;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.back-button:hover {
  transform: translateX(-4px);
  border-color: #58CC02;
  box-shadow: 0 4px 12px rgba(88, 204, 2, 0.2);
}

.animal-detail-content {
  max-width: 1000px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  position: relative;
  z-index: 1;
}

.animal-image-section {
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.images-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  width: 100%;
}

.image-wrapper {
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  background: #ffffff;
  border: 2px solid #e5e5e5;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.image-wrapper:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.image-wrapper img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
  aspect-ratio: 4 / 3;
}

.animal-info-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.animal-info-section h1 {
  color: #1a1a1a;
  font-size: 2.5rem;
  margin: 0;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.category-tag {
  display: inline-block;
  padding: 0.5rem 1.25rem;
  background: #f0fdf4;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  color: #58CC02;
  border: 1px solid #58CC02;
  align-self: flex-start;
}

.info-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 2rem;
  border: 2px solid #e5e5e5;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.info-card h2 {
  color: #1a1a1a;
  font-size: 1.5rem;
  margin: 0 0 1rem 0;
  font-weight: 700;
}

.animal-description {
  color: #666;
  font-size: 1rem;
  line-height: 1.6;
  margin: 0;
}

.suggestions-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.suggestion-chip {
  padding: 0.5rem 1rem;
  background: #f7f7f7;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #1a1a1a;
  border: 1px solid #e5e5e5;
}

.loading {
  text-align: center;
  color: #666;
  font-size: 1.5rem;
  font-weight: 600;
}

@media (max-width: 768px) {
  .animal-detail-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .animal-info-section h1 {
    font-size: 2.5rem;
  }

  .images-gallery {
    grid-template-columns: 1fr;
  }

  .image-wrapper {
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .animal-detail-container {
    padding: 1rem;
  }

  .back-button {
    font-size: 0.9rem;
    padding: 0.6rem 1.5rem;
  }

  .animal-info-section h1 {
    font-size: 2rem;
  }

  .info-card {
    padding: 1.5rem;
  }

  .info-card h2 {
    font-size: 1.5rem;
  }

  .animal-description {
    font-size: 1rem;
  }
}
</style>

