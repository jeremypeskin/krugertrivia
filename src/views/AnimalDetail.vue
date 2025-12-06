<template>
  <div class="animal-detail-container">
    <router-link to="/" class="back-button">← Back to Animals</router-link>

    <div v-if="animal" class="animal-detail-content">
      <div class="animal-image-section">
        <div class="image-wrapper">
          <img :src="animal.images[0]" :alt="animal.name" />
        </div>
      </div>

      <div class="animal-info-section">
        <h1>{{ animal.name }}</h1>
        <div class="category-tag">{{ animal.category }}</div>

        <div class="info-card">
          <h2>About</h2>
          <p class="animal-description">
            The {{ animal.name }} is a fascinating member of the {{ animal.category.toLowerCase() }} family.
            Learn more about this amazing creature!
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%);
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
  padding: 2rem 1.5rem;
  position: relative;
  overflow: hidden;
}

.animal-detail-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.back-button {
  display: inline-block;
  padding: 0.8rem 2rem;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  border: 4px solid rgba(255, 255, 255, 0.5);
  border-radius: 50px;
  color: white;
  text-decoration: none;
  font-weight: 700;
  font-size: 1.1rem;
  margin-bottom: 2rem;
  transition: all 0.3s ease;
  box-shadow:
    0 8px 20px rgba(0, 0, 0, 0.2),
    inset 0 2px 10px rgba(255, 255, 255, 0.3);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 1;
}

.back-button:hover {
  transform: translateX(-5px) scale(1.05);
  border-color: rgba(255, 255, 255, 0.8);
  box-shadow:
    0 12px 30px rgba(0, 0, 0, 0.3),
    inset 0 2px 10px rgba(255, 255, 255, 0.4);
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
  align-items: center;
  justify-content: center;
}

.image-wrapper {
  width: 100%;
  border-radius: 30px;
  overflow: hidden;
  box-shadow:
    0 15px 50px rgba(0, 0, 0, 0.3),
    0 0 0 8px rgba(255, 255, 255, 0.3),
    0 0 0 12px rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem;
  backdrop-filter: blur(10px);
}

.image-wrapper img {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 25px;
}

.animal-info-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.animal-info-section h1 {
  color: white;
  font-size: 3.5rem;
  margin: 0;
  font-weight: 900;
  text-shadow:
    3px 3px 0px rgba(0, 0, 0, 0.2),
    0 0 20px rgba(255, 255, 255, 0.3);
  font-family: 'Georgia', 'Times New Roman', 'Times', serif;
  font-style: italic;
  letter-spacing: 2px;
}

.category-tag {
  display: inline-block;
  padding: 0.6rem 1.5rem;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  border-radius: 25px;
  font-size: 1.1rem;
  font-weight: 700;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  border: 3px solid rgba(255, 255, 255, 0.5);
  align-self: flex-start;
  box-shadow:
    0 4px 15px rgba(0, 0, 0, 0.2),
    inset 0 2px 5px rgba(255, 255, 255, 0.3);
}

.info-card {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  border-radius: 25px;
  padding: 2rem;
  border: 4px solid rgba(255, 255, 255, 0.5);
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.2),
    inset 0 2px 10px rgba(255, 255, 255, 0.3);
}

.info-card h2 {
  color: white;
  font-size: 1.8rem;
  margin: 0 0 1rem 0;
  font-weight: 800;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  font-family: 'Georgia', 'Times New Roman', 'Times', serif;
  font-style: italic;
}

.animal-description {
  color: white;
  font-size: 1.2rem;
  line-height: 1.8;
  margin: 0;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  font-family: 'Georgia', 'Times New Roman', 'Times', serif;
}

.suggestions-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
}

.suggestion-chip {
  padding: 0.6rem 1.2rem;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(5px);
  border-radius: 20px;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.4);
  box-shadow:
    0 4px 10px rgba(0, 0, 0, 0.15),
    inset 0 1px 3px rgba(255, 255, 255, 0.3);
}

.loading {
  text-align: center;
  color: white;
  font-size: 2rem;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 1;
}

@media (max-width: 768px) {
  .animal-detail-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .animal-info-section h1 {
    font-size: 2.5rem;
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

