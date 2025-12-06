<template>
  <div class="settings-container">
    <h1>🐾 Animal Trivia Game Setup 🐾</h1>

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
        Start Game 🎮
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%);
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.settings-container::before {
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
  text-shadow:
    3px 3px 0px rgba(0, 0, 0, 0.2),
    0 0 20px rgba(255, 255, 255, 0.3);
  font-weight: 900;
  letter-spacing: 2px;
  position: relative;
  z-index: 1;
  text-align: center;
}

.settings-content {
  max-width: 600px;
  width: 100%;
  position: relative;
  z-index: 1;
}

.players-section {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  border-radius: 25px;
  padding: 2rem;
  border: 4px solid rgba(255, 255, 255, 0.5);
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.2),
    inset 0 2px 10px rgba(255, 255, 255, 0.3);
  margin-bottom: 2rem;
}

.players-section h2 {
  color: white;
  font-size: 2rem;
  margin: 0 0 1.5rem 0;
  font-weight: 800;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  font-family: 'Georgia', 'Times New Roman', 'Times', serif;
}

.player-input-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.player-input {
  flex: 1;
  padding: 1rem 1.5rem;
  font-size: 1.1rem;
  border: 4px solid rgba(255, 255, 255, 0.5);
  border-radius: 50px;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  color: white;
  font-weight: 600;
  outline: none;
  transition: all 0.3s ease;
}

.player-input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.player-input:focus {
  border-color: rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.4);
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
}

.add-button {
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 700;
  color: white;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  border: 4px solid rgba(255, 255, 255, 0.5);
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow:
    0 4px 15px rgba(0, 0, 0, 0.2),
    inset 0 2px 10px rgba(255, 255, 255, 0.3);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.add-button:hover:not(:disabled) {
  transform: scale(1.05);
  border-color: rgba(255, 255, 255, 0.8);
  box-shadow:
    0 6px 20px rgba(0, 0, 0, 0.3),
    inset 0 2px 10px rgba(255, 255, 255, 0.4);
}

.add-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(5px);
  border-radius: 20px;
  border: 2px solid rgba(255, 255, 255, 0.4);
}

.player-name {
  color: white;
  font-size: 1.2rem;
  font-weight: 700;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.remove-button {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.6);
  background: rgba(239, 68, 68, 0.4);
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.remove-button:hover {
  background: rgba(239, 68, 68, 0.6);
  transform: scale(1.1);
  border-color: rgba(255, 255, 255, 0.8);
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  font-style: italic;
}

.game-info {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  border-radius: 25px;
  padding: 1.5rem;
  border: 4px solid rgba(255, 255, 255, 0.5);
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.2),
    inset 0 2px 10px rgba(255, 255, 255, 0.3);
  margin-bottom: 2rem;
}

.info-text {
  color: white;
  font-size: 1.1rem;
  line-height: 1.6;
  margin: 0;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  font-family: 'Georgia', 'Times New Roman', 'Times', serif;
}

.info-text strong {
  font-weight: 700;
  font-size: 1.2rem;
}

.start-button {
  width: 100%;
  padding: 1.5rem 3rem;
  font-size: 1.8rem;
  font-weight: 900;
  color: white;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.4), rgba(5, 150, 105, 0.4));
  backdrop-filter: blur(10px);
  border: 5px solid rgba(255, 255, 255, 0.6);
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.3),
    inset 0 2px 10px rgba(255, 255, 255, 0.3);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.start-button:hover:not(:disabled) {
  transform: scale(1.05);
  border-color: rgba(255, 255, 255, 0.9);
  box-shadow:
    0 15px 40px rgba(0, 0, 0, 0.4),
    inset 0 2px 10px rgba(255, 255, 255, 0.4);
}

.start-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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

