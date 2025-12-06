<template>
  <div class="animal-list-container">
    <h1>🐾 Animal Encyclopedia 🐾</h1>
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%);
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
  padding: 2rem 1.5rem;
  position: relative;
  overflow: hidden;
}

.animal-list-container::before {
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

h1 {
  color: white;
  font-size: 3rem;
  margin: 0 0 2rem 0;
  text-align: center;
  text-shadow:
    3px 3px 0px rgba(0, 0, 0, 0.2),
    0 0 20px rgba(255, 255, 255, 0.3);
  font-weight: 900;
  letter-spacing: 2px;
  position: relative;
  z-index: 1;
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
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  border-radius: 25px;
  overflow: hidden;
  border: 4px solid rgba(255, 255, 255, 0.5);
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.2),
    inset 0 2px 10px rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.animal-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.animal-card:hover {
  transform: translateY(-10px) scale(1.03) rotate(2deg);
  border-color: rgba(255, 255, 255, 0.8);
  box-shadow:
    0 15px 40px rgba(0, 0, 0, 0.3),
    inset 0 2px 10px rgba(255, 255, 255, 0.4),
    0 0 30px rgba(255, 255, 255, 0.3);
}

.animal-card:hover::before {
  opacity: 1;
}

.card-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.2);
  position: relative;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.animal-card:hover .card-image img {
  transform: scale(1.1);
}

.card-info {
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.card-info h2 {
  margin: 0;
  color: white;
  font-size: 1.5rem;
  font-weight: 800;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  font-family: 'Georgia', 'Times New Roman', 'Times', serif;
}

.category-badge {
  display: inline-block;
  padding: 0.4rem 1rem;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.4);
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

