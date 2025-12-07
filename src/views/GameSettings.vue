<template>
  <div class="settings-container">
    <h1>Kruger Kids Game Setup</h1>

    <div class="settings-content">
      <div class="players-section">
        <h2>Add Players</h2>

        <div class="player-input-section">
          <input
            v-model="newPlayerName"
            @keyup.enter="addPlayer"
            type="text"
            placeholder="Enter player name"
            class="player-input"
            maxlength="20"
          />
          <button @click="addPlayer" class="add-button" :disabled="!newPlayerName.trim()">
            Add Player
          </button>
        </div>

        <div v-if="players.length > 0" class="players-list">
          <div
            v-for="(player, index) in players"
            :key="index"
            class="player-item-with-categories"
          >
            <div class="player-item-header">
              <span class="player-name">{{ player.name }}</span>
              <button @click="removePlayer(index)" class="remove-button">×</button>
            </div>
            <div class="player-categories">
              <div class="category-checkbox">
                <label class="checkbox-label">
                  <input
                    type="checkbox"
                    :checked="isAllCategoriesSelectedForPlayer(player.name)"
                    @change="toggleAllCategoriesForPlayer(player.name)"
                    class="checkbox-input"
                  />
                  <span class="checkbox-text">All Categories</span>
                </label>
              </div>
              <div v-if="!isAllCategoriesSelectedForPlayer(player.name)" class="categories-list">
                <label
                  v-for="category in allCategories"
                  :key="category"
                  class="checkbox-label"
                >
                  <input
                    type="checkbox"
                    :checked="isCategorySelectedForPlayer(player.name, category)"
                    @change="toggleCategoryForPlayer(player.name, category)"
                    class="checkbox-input"
                  />
                  <span class="checkbox-text">{{ category }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div v-if="players.length === 0" class="empty-state">
          <p>No players added yet. Add at least one player to start!</p>
        </div>
      </div>


      <div class="game-info">
        <p class="info-text">
          Each player will get <strong>5 turns</strong> to guess animals correctly.
          Points are awarded for correct answers!
        </p>
      </div>

      <div class="buttons-container">
        <router-link to="/animals" class="encyclopedia-link">
          Animal Encyclopedia
        </router-link>

        <button
          @click="startGame"
          class="start-button"
          :disabled="players.length === 0 || !allPlayersHaveCategories()"
        >
          Start Game
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useGameSettingsStore } from '@/stores/gameSettings'
import animalsData from '@/data/animals.js'

const router = useRouter()
const gameSettings = useGameSettingsStore()
const players = ref([])
const newPlayerName = ref('')
const playerCategories = ref({}) // Store player categories reactively

const STORAGE_KEY = 'krugerTriviaPlayers'
const CATEGORIES_STORAGE_PREFIX = 'krugerTriviaPlayerCategories_'

// Get all unique categories
const allCategories = [...new Set(animalsData.map(animal => animal.category))]

// Get player categories from localStorage
function getPlayerCategoriesKey(playerName) {
  return `${CATEGORIES_STORAGE_PREFIX}${playerName}`
}

// Load player categories from localStorage
function loadPlayerCategories(playerName) {
  const key = getPlayerCategoriesKey(playerName)
  const stored = localStorage.getItem(key)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch (e) {
      console.error(`Error loading categories for ${playerName}:`, e)
    }
  }
  // Default: all categories selected
  return {
    allSelected: true,
    selected: [...allCategories]
  }
}

// Save player categories to localStorage
function savePlayerCategories(playerName, categories) {
  const key = getPlayerCategoriesKey(playerName)
  localStorage.setItem(key, JSON.stringify(categories))
  // Update reactive ref
  playerCategories.value[playerName] = categories
}

// Initialize player categories in reactive ref
function initializePlayerCategories(playerName) {
  if (!playerCategories.value[playerName]) {
    playerCategories.value[playerName] = loadPlayerCategories(playerName)
  }
}

// Check if all categories are selected for a player
function isAllCategoriesSelectedForPlayer(playerName) {
  initializePlayerCategories(playerName)
  const categories = playerCategories.value[playerName]
  // Only return true if explicitly allSelected is true, not just if length matches
  return categories.allSelected === true
}

// Check if a specific category is selected for a player
function isCategorySelectedForPlayer(playerName, category) {
  initializePlayerCategories(playerName)
  const categories = playerCategories.value[playerName]
  if (categories.allSelected || categories.selected.length === allCategories.length) {
    return true
  }
  return categories.selected.includes(category)
}

// Toggle all categories for a player
function toggleAllCategoriesForPlayer(playerName) {
  initializePlayerCategories(playerName)
  const categories = playerCategories.value[playerName]
  const newAllSelected = !categories.allSelected

  const newCategories = {
    allSelected: newAllSelected,
    selected: newAllSelected ? [...allCategories] : (categories.selected.length === allCategories.length ? [] : categories.selected)
  }

  savePlayerCategories(playerName, newCategories)
}

// Toggle a specific category for a player
function toggleCategoryForPlayer(playerName, category) {
  initializePlayerCategories(playerName)
  const categories = playerCategories.value[playerName]
  const selected = [...categories.selected]
  const index = selected.indexOf(category)

  if (index > -1) {
    selected.splice(index, 1)
  } else {
    selected.push(category)
  }

  const newCategories = {
    allSelected: selected.length === allCategories.length,
    selected: selected
  }

  savePlayerCategories(playerName, newCategories)
}

// Get selected categories for a player
function getPlayerSelectedCategories(playerName) {
  initializePlayerCategories(playerName)
  const categories = playerCategories.value[playerName]
  if (categories.allSelected || categories.selected.length === allCategories.length) {
    return allCategories
  }
  return categories.selected
}

// Check if all players have at least one category selected
function allPlayersHaveCategories() {
  return players.value.every(player => {
    const categories = getPlayerSelectedCategories(player.name)
    return categories.length > 0
  })
}

// Load players from localStorage
function loadPlayers() {
  const storedPlayers = localStorage.getItem(STORAGE_KEY)
  if (storedPlayers) {
    try {
      players.value = JSON.parse(storedPlayers)
      // Initialize categories for all loaded players
      players.value.forEach(player => {
        initializePlayerCategories(player.name)
      })
    } catch (e) {
      console.error('Error loading players from localStorage:', e)
      players.value = []
    }
  }
}

// Save players to localStorage
function savePlayers() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(players.value))
}

// Initialize and load players on mount
onMounted(() => {
  loadPlayers()
})

// Watch for changes to players and save to localStorage
watch(players, () => {
  savePlayers()
}, { deep: true })

function addPlayer() {
  const name = newPlayerName.value.trim()
  if (name && !players.value.some(p => p.name.toLowerCase() === name.toLowerCase())) {
    players.value.push({
      name: name,
      score: 0
    })
    // Initialize default categories (all selected) for new player
    const defaultCategories = {
      allSelected: true,
      selected: [...allCategories]
    }
    playerCategories.value[name] = defaultCategories
    savePlayerCategories(name, defaultCategories)
    newPlayerName.value = ''
  }
}

function removePlayer(index) {
  const playerName = players.value[index].name
  players.value.splice(index, 1)
  // Optionally remove categories from localStorage when player is removed
  // localStorage.removeItem(getPlayerCategoriesKey(playerName))
}

function startGame() {
  if (players.value.length > 0 && allPlayersHaveCategories()) {
    // Store players in sessionStorage
    sessionStorage.setItem('triviaPlayers', JSON.stringify(players.value))

    // Store each player's categories in sessionStorage
    const playerCategories = {}
    players.value.forEach(player => {
      playerCategories[player.name] = getPlayerSelectedCategories(player.name)
    })
    sessionStorage.setItem('triviaPlayerCategories', JSON.stringify(playerCategories))

    router.push('/game')
  } else if (!allPlayersHaveCategories()) {
    alert('Please ensure all players have at least one category selected.')
  }
}
</script>

<style scoped>
.settings-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #dbeafe 0%, #e0f2fe 25%, #f0f9ff 50%, #ecfdf5 75%, #d1fae5 100%);
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

h1 {
  color: #1a1a1a;
  font-size: 2.5rem;
  margin: 0 0 2rem 0;
  font-weight: 700;
  text-align: center;
  letter-spacing: -0.5px;
}

.settings-content {
  max-width: 600px;
  width: 100%;
  position: relative;
  z-index: 1;
}

.players-section {
  background: #ffffff;
  border-radius: 16px;
  padding: 2rem;
  border: 2px solid #e5e5e5;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
}

.players-section h2 {
  color: #1a1a1a;
  font-size: 1.5rem;
  margin: 0 0 1.5rem 0;
  font-weight: 700;
}

.player-input-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.player-input {
  flex: 1;
  padding: 0.875rem 1.25rem;
  font-size: 1rem;
  border: 2px solid #e5e5e5;
  border-radius: 12px;
  background: #ffffff;
  color: #1a1a1a;
  font-weight: 500;
  outline: none;
  transition: all 0.2s ease;
}

.player-input::placeholder {
  color: #999;
}

.player-input:focus {
  border-color: #58CC02;
  box-shadow: 0 0 0 3px rgba(88, 204, 2, 0.1);
}

.add-button {
  padding: 0.875rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  background: #1CB0F6;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(28, 176, 246, 0.2);
}

.add-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(28, 176, 246, 0.3);
  background: #0ea5e9;
}

.add-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.players-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.player-item-with-categories {
  padding: 1.25rem;
  background: #f7f7f7;
  border-radius: 12px;
  border: 2px solid #e5e5e5;
  margin-bottom: 1rem;
}

.player-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.player-categories {
  padding-top: 1rem;
  border-top: 2px solid #e5e5e5;
}

.player-name {
  color: #1a1a1a;
  font-size: 1.125rem;
  font-weight: 600;
}

.remove-button {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: #ef4444;
  color: white;
  font-size: 1.25rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.remove-button:hover {
  background: #dc2626;
  transform: scale(1.1);
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #666;
  font-size: 1rem;
}

.game-info {
  background: #ffffff;
  border-radius: 16px;
  padding: 1.5rem;
  border: 2px solid #e5e5e5;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
}

.info-text {
  color: #666;
  font-size: 1rem;
  line-height: 1.6;
  margin: 0;
}

.info-text strong {
  font-weight: 700;
  color: #1a1a1a;
}

.player-categories .category-checkbox {
  margin-bottom: 0.75rem;
}

.player-categories .categories-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e0e0e0;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  padding: 0.75rem;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.checkbox-label:hover {
  background: #f7f7f7;
}

.checkbox-input {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #58CC02;
  flex-shrink: 0;
}

.checkbox-text {
  font-size: 1rem;
  font-weight: 500;
  color: #1a1a1a;
  user-select: none;
}

.buttons-container {
  display: flex;
  gap: 1rem;
  width: 100%;
}

.encyclopedia-link {
  flex: 1;
  padding: 1rem 2rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a1a1a;
  background: transparent;
  border: 2px solid #e5e5e5;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.encyclopedia-link:hover {
  transform: translateY(-2px);
  border-color: #1CB0F6;
  color: #1CB0F6;
  box-shadow: 0 4px 12px rgba(28, 176, 246, 0.15);
}

.start-button {
  flex: 1;
  padding: 1rem 2rem;
  font-size: 1.125rem;
  font-weight: 700;
  color: #ffffff;
  background: #58CC02;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(88, 204, 2, 0.3);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.start-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(88, 204, 2, 0.4);
  background: #4db300;
}

.start-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

@media (max-width: 600px) {
  h1 {
    font-size: 2rem;
  }

  .players-section {
    padding: 1.5rem;
  }

  .player-input-section {
    flex-direction: column;
  }

  .buttons-container {
    flex-direction: column;
  }

  .encyclopedia-link,
  .start-button {
    font-size: 1rem;
    padding: 1rem 2rem;
  }
}
</style>

