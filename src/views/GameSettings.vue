<template>
  <div class="settings-container">
    <h1>Animal Trivia Game Setup</h1>

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
            class="player-item"
          >
            <span class="player-name">{{ player.name }}</span>
            <button @click="removePlayer(index)" class="remove-button">×</button>
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

      <button
        @click="startGame"
        class="start-button"
        :disabled="players.length === 0"
      >
        Start Game
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const players = ref([])
const newPlayerName = ref('')

function addPlayer() {
  const name = newPlayerName.value.trim()
  if (name && !players.value.some(p => p.name.toLowerCase() === name.toLowerCase())) {
    players.value.push({
      name: name,
      score: 0
    })
    newPlayerName.value = ''
  }
}

function removePlayer(index) {
  players.value.splice(index, 1)
}

function startGame() {
  if (players.value.length > 0) {
    // Store players in sessionStorage to pass to game
    sessionStorage.setItem('triviaPlayers', JSON.stringify(players.value))
    router.push('/game')
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

.player-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  background: #f7f7f7;
  border-radius: 12px;
  border: 2px solid #e5e5e5;
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

.start-button {
  width: 100%;
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

  .start-button {
    font-size: 1.5rem;
    padding: 1.2rem 2rem;
  }
}
</style>

