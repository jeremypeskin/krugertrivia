<template>
  <div class="game-container">
    <!-- End Game Screen -->
    <div v-if="gameEnded" class="end-game-screen">
      <h1>🎉 Game Over! 🎉</h1>
      <div class="final-scores">
        <h2>Final Scores</h2>
        <div class="scores-list">
          <div
            v-for="(player, index) in sortedPlayers"
            :key="index"
            class="score-item"
            :class="{ winner: index === 0 && sortedPlayers.length > 1 && player.score === sortedPlayers[0].score }"
          >
            <span class="rank">{{ index + 1 }}</span>
            <span class="player-name">{{ player.name }}</span>
            <span class="score">{{ player.score }} points</span>
          </div>
        </div>
      </div>
      <button @click="replay" class="replay-button">
        Play Again 🎮
      </button>
    </div>

    <!-- Active Game Screen -->
    <div v-else-if="players.length > 0 && currentAnimal" class="game-content-wrapper">
      <h1>🐾 What am I? 🐾</h1>

      <div class="game-grid">
        <!-- Left Panel: Players (1/3) -->
        <div class="player-panel">
          <!-- Current Player Indicator -->
          <div class="current-player-indicator">
            <p>{{ currentPlayer.name }}'s Turn</p>
          </div>

          <!-- Scoreboard -->
          <div class="scoreboard">
            <h3>Players</h3>
            <div class="scoreboard-list">
              <div
                v-for="(player, index) in players"
                :key="index"
                class="scoreboard-item"
                :class="{ active: index === currentPlayerIndex }"
              >
                <div class="scoreboard-item-header">
                  <span class="player-name">{{ player.name }}</span>
                  <span class="score">{{ player.score }}</span>
                </div>
                <div class="turns">Turn {{ player.turns }}/5</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Panel: Game Content (2/3) -->
        <div class="game-content">
          <!-- Animal Image -->
          <div class="image-container">
            <img
              :src="currentAnimal.images[0]"
              :alt="currentAnimal.name"
              class="animal-image"
            />
          </div>

          <!-- Answer Options (Chips) -->
          <div v-if="!answered" class="options-container">
            <button
              v-for="(option, index) in shuffledOptions"
              :key="index"
              @click="selectAnswer(option)"
              class="option-chip"
            >
              {{ option }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Feedback Modal Popup -->
    <div v-if="answered" class="modal-overlay" @click.self="nextAnimal">
      <div class="modal-content">
        <div v-if="isCorrect" class="feedback-message correct">
          <h2>🎉 Correct! 🎉</h2>
          <p>Great job, {{ currentPlayer.name }}! That's a {{ currentAnimal.name }}!</p>
          <p class="points-earned">+1 point!</p>
        </div>
        <div v-else class="feedback-message incorrect">
          <h2>❌ Incorrect</h2>
          <p>The correct answer is: <strong>{{ currentAnimal.name }}</strong></p>
        </div>
        <button @click="nextAnimal" class="next-button">
          Next Animal →
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import animals from '@/data/animals.js'

const router = useRouter()
const players = ref([])
const currentAnimal = ref(null)
const answered = ref(false)
const isCorrect = ref(false)
const selectedAnswer = ref(null)
const currentPlayerIndex = ref(0)
const gameEnded = ref(false)

// Shuffle array function
function shuffleArray(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Get random animal
function getRandomAnimal() {
  const randomIndex = Math.floor(Math.random() * animals.length)
  return animals[randomIndex]
}

// Current player
const currentPlayer = computed(() => {
  return players.value[currentPlayerIndex.value] || { name: '', score: 0, turns: 0 }
})

// Sorted players by score (descending)
const sortedPlayers = computed(() => {
  return [...players.value].sort((a, b) => b.score - a.score)
})

// Create shuffled options (correct answer + wrong suggestions)
const shuffledOptions = computed(() => {
  if (!currentAnimal.value) return []

  const options = [
    currentAnimal.value.name,
    ...currentAnimal.value.suggestions
  ]
  return shuffleArray(options)
})

// Check if game should end
function checkGameEnd() {
  const allPlayersFinished = players.value.every(player => player.turns >= 5)
  if (allPlayersFinished) {
    gameEnded.value = true
  }
}

// Select an answer
function selectAnswer(answer) {
  if (answered.value) return

  answered.value = true
  selectedAnswer.value = answer
  isCorrect.value = answer === currentAnimal.value.name

  // Update score if correct
  if (isCorrect.value) {
    players.value[currentPlayerIndex.value].score += 1
  }
}

// Move to next animal and next player
function nextAnimal() {
  answered.value = false
  isCorrect.value = false
  selectedAnswer.value = null

  // Increment current player's turn count
  players.value[currentPlayerIndex.value].turns += 1

  // Check if game ended
  checkGameEnd()

  if (!gameEnded.value) {
    // Move to next player (round-robin)
    currentPlayerIndex.value = (currentPlayerIndex.value + 1) % players.value.length

    // Get new animal
    currentAnimal.value = getRandomAnimal()
  }
}

// Replay game
function replay() {
  router.push('/')
}

// Initialize game
onMounted(() => {
  // Load players from sessionStorage
  const storedPlayers = sessionStorage.getItem('triviaPlayers')
  if (storedPlayers) {
    const parsedPlayers = JSON.parse(storedPlayers)
    // Initialize players with turns counter
    players.value = parsedPlayers.map(player => ({
      ...player,
      turns: 0
    }))
    currentAnimal.value = getRandomAnimal()
  } else {
    // No players found, redirect to settings
    router.push('/')
  }
})
</script>

<style scoped>
.game-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%);
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.game-container::before {
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
  margin: 0 0 1.5rem 0;
  text-shadow:
    3px 3px 0px rgba(0, 0, 0, 0.2),
    0 0 20px rgba(255, 255, 255, 0.3);
  font-weight: 900;
  letter-spacing: 2px;
  position: relative;
  z-index: 1;
  text-align: center;
}

.game-content-wrapper {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.game-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  align-items: start;
}

/* Left Panel: Players (1/3) */
.player-panel {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: sticky;
  top: 2rem;
}

.current-player-indicator {
  text-align: center;
}

.current-player-indicator p {
  color: white;
  font-size: 1.3rem;
  font-weight: 800;
  text-shadow:
    2px 2px 4px rgba(0, 0, 0, 0.3),
    0 0 20px rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  border-radius: 25px;
  padding: 1rem 1.5rem;
  border: 3px solid rgba(255, 255, 255, 0.5);
  margin: 0;
  box-shadow:
    0 4px 15px rgba(0, 0, 0, 0.2),
    inset 0 2px 5px rgba(255, 255, 255, 0.3);
  font-family: 'Georgia', 'Times New Roman', 'Times', serif;
  font-style: italic;
}

.scoreboard {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  border-radius: 25px;
  padding: 1.5rem;
  border: 4px solid rgba(255, 255, 255, 0.5);
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.2),
    inset 0 2px 10px rgba(255, 255, 255, 0.3);
}

.scoreboard h3 {
  color: white;
  font-size: 1.5rem;
  font-weight: 800;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  margin: 0 0 1rem 0;
  font-family: 'Georgia', 'Times New Roman', 'Times', serif;
  text-align: center;
}

.scoreboard-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.scoreboard-item {
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(5px);
  border-radius: 15px;
  padding: 1rem;
  border: 3px solid rgba(255, 255, 255, 0.4);
  box-shadow:
    0 4px 15px rgba(0, 0, 0, 0.15),
    inset 0 2px 5px rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.scoreboard-item.active {
  border-color: rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.4);
  box-shadow:
    0 6px 20px rgba(0, 0, 0, 0.25),
    inset 0 2px 5px rgba(255, 255, 255, 0.4),
    0 0 20px rgba(255, 255, 255, 0.3);
  transform: scale(1.02);
}

.scoreboard-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.scoreboard-item .player-name {
  color: white;
  font-size: 1.1rem;
  font-weight: 700;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  font-family: 'Georgia', 'Times New Roman', 'Times', serif;
}

.scoreboard-item .score {
  color: white;
  font-size: 1.8rem;
  font-weight: 900;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.scoreboard-item .turns {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  font-weight: 600;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  text-align: center;
}

/* Right Panel: Game Content (2/3) */
.game-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  width: 100%;
  position: relative;
  z-index: 1;
}

.image-container {
  width: 100%;
  max-width: 100%;
  border-radius: 30px;
  overflow: hidden;
  box-shadow:
    0 10px 40px rgba(0, 0, 0, 0.3),
    0 0 0 8px rgba(255, 255, 255, 0.3),
    0 0 0 12px rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem;
  backdrop-filter: blur(10px);
}

.animal-image {
  width: 100%;
  height: auto;
  border-radius: 25px;
  display: block;
}

.options-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  width: 100%;
}

.option-chip {
  padding: 1.2rem 1.5rem;
  font-size: 1.3rem;
  font-weight: 800;
  color: white;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  border: 4px solid rgba(255, 255, 255, 0.5);
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow:
    0 8px 20px rgba(0, 0, 0, 0.2),
    inset 0 2px 10px rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.option-chip::before {
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

.option-chip:hover {
  transform: scale(1.05) rotate(2deg);
  border-color: rgba(255, 255, 255, 0.8);
  box-shadow:
    0 12px 30px rgba(0, 0, 0, 0.3),
    inset 0 2px 10px rgba(255, 255, 255, 0.4),
    0 0 30px rgba(255, 255, 255, 0.3);
}

.option-chip:hover::before {
  opacity: 1;
}

.option-chip:active {
  transform: scale(0.98) rotate(-1deg);
}

.option-chip:nth-child(1) {
  background: linear-gradient(135deg, rgba(255, 107, 107, 0.3), rgba(255, 159, 64, 0.3));
  border-color: rgba(255, 107, 107, 0.6);
}

.option-chip:nth-child(2) {
  background: linear-gradient(135deg, rgba(72, 219, 251, 0.3), rgba(0, 242, 254, 0.3));
  border-color: rgba(72, 219, 251, 0.6);
}

.option-chip:nth-child(3) {
  background: linear-gradient(135deg, rgba(255, 206, 84, 0.3), rgba(255, 159, 64, 0.3));
  border-color: rgba(255, 206, 84, 0.6);
}

.option-chip:nth-child(4) {
  background: linear-gradient(135deg, rgba(138, 43, 226, 0.3), rgba(147, 51, 234, 0.3));
  border-color: rgba(138, 43, 226, 0.6);
}

/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  width: 90%;
  max-width: 500px;
  animation: modalSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes modalSlideIn {
  0% {
    opacity: 0;
    transform: scale(0.5) translateY(-50px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.feedback-message {
  padding: 3rem 3rem;
  border-radius: 25px;
  width: 100%;
  animation: bounceIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: 4px solid rgba(255, 255, 255, 0.6);
  box-shadow:
    0 20px 50px rgba(0, 0, 0, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.4),
    0 0 0 1px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(15px);
  font-family: 'Georgia', 'Times New Roman', 'Times', serif;
  position: relative;
  overflow: hidden;
}

.feedback-message::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0%, 100% { transform: translateX(-100%); }
  50% { transform: translateX(100%); }
}

.feedback-message.correct {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.5), rgba(5, 150, 105, 0.5));
  color: #022c22;
  border-color: rgba(16, 185, 129, 0.8);
}

.feedback-message.incorrect {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.5), rgba(220, 38, 38, 0.5));
  color: #450a0a;
  border-color: rgba(239, 68, 68, 0.8);
}

.feedback-message h2 {
  margin: 0 0 1.2rem 0;
  font-size: 2.8rem;
  font-weight: 700;
  font-style: italic;
  letter-spacing: 1px;
  text-shadow:
    2px 2px 4px rgba(0, 0, 0, 0.15),
    0 0 20px rgba(255, 255, 255, 0.2);
  line-height: 1.2;
  font-family: 'Georgia', 'Times New Roman', 'Times', serif;
}

.feedback-message p {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 400;
  line-height: 1.6;
  letter-spacing: 0.5px;
  font-family: 'Georgia', 'Times New Roman', 'Times', serif;
}

.feedback-message strong {
  font-size: 1.8rem;
  font-weight: 700;
  font-style: italic;
  display: inline-block;
  padding: 0.5rem 1.2rem;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 12px;
  margin-left: 0.8rem;
  margin-right: 0.8rem;
  border: 2px solid rgba(255, 255, 255, 0.5);
  box-shadow:
    inset 0 2px 4px rgba(255, 255, 255, 0.3),
    0 2px 8px rgba(0, 0, 0, 0.1);
  font-family: 'Georgia', 'Times New Roman', 'Times', serif;
}

.points-earned {
  margin-top: 0.5rem !important;
  font-size: 1.3rem !important;
  font-weight: 700 !important;
  color: #022c22 !important;
}

/* End Game Screen */
.end-game-screen {
  max-width: 700px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  text-align: center;
}

.final-scores {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  border-radius: 25px;
  padding: 2.5rem;
  border: 4px solid rgba(255, 255, 255, 0.5);
  box-shadow:
    0 15px 40px rgba(0, 0, 0, 0.2),
    inset 0 2px 10px rgba(255, 255, 255, 0.3);
  margin-bottom: 2rem;
}

.final-scores h2 {
  color: white;
  font-size: 2.5rem;
  margin: 0 0 2rem 0;
  font-weight: 800;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  font-family: 'Georgia', 'Times New Roman', 'Times', serif;
  font-style: italic;
}

.scores-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.score-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.2rem 1.5rem;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(5px);
  border-radius: 20px;
  border: 3px solid rgba(255, 255, 255, 0.4);
  transition: all 0.3s ease;
}

.score-item.winner {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.4), rgba(255, 193, 7, 0.4));
  border-color: rgba(255, 215, 0, 0.7);
  box-shadow:
    0 6px 20px rgba(0, 0, 0, 0.3),
    inset 0 2px 5px rgba(255, 255, 255, 0.4),
    0 0 30px rgba(255, 215, 0, 0.4);
  transform: scale(1.02);
}

.score-item .rank {
  font-size: 1.5rem;
  font-weight: 900;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  min-width: 40px;
}

.score-item .player-name {
  flex: 1;
  text-align: left;
  margin-left: 1rem;
  font-size: 1.3rem;
  font-weight: 700;
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  font-family: 'Georgia', 'Times New Roman', 'Times', serif;
}

.score-item .score {
  font-size: 1.5rem;
  font-weight: 900;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.replay-button {
  padding: 1.5rem 4rem;
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

.replay-button:hover {
  transform: scale(1.1);
  border-color: rgba(255, 255, 255, 0.9);
  box-shadow:
    0 15px 40px rgba(0, 0, 0, 0.4),
    inset 0 2px 10px rgba(255, 255, 255, 0.4);
}

.next-button {
  padding: 1.3rem 3.5rem;
  font-size: 1.5rem;
  font-weight: 900;
  color: white;
  background: linear-gradient(135deg, rgba(255, 107, 107, 0.4), rgba(255, 159, 64, 0.4));
  backdrop-filter: blur(10px);
  border: 5px solid rgba(255, 255, 255, 0.6);
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.3),
    inset 0 2px 10px rgba(255, 255, 255, 0.3);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
}

.next-button::before {
  content: '✨';
  position: absolute;
  left: 20%;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2rem;
  opacity: 0;
  transition: all 0.3s ease;
}

.next-button::after {
  content: '✨';
  position: absolute;
  right: 20%;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2rem;
  opacity: 0;
  transition: all 0.3s ease;
}

.next-button:hover {
  transform: scale(1.1) rotate(2deg);
  border-color: rgba(255, 255, 255, 0.9);
  box-shadow:
    0 15px 40px rgba(0, 0, 0, 0.4),
    inset 0 2px 10px rgba(255, 255, 255, 0.4),
    0 0 40px rgba(255, 255, 255, 0.4);
}

.next-button:hover::before,
.next-button:hover::after {
  opacity: 1;
  transform: translateY(-50%) rotate(360deg);
}

.next-button:active {
  transform: scale(1.05) rotate(-1deg);
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3) rotate(-10deg);
  }
  50% {
    transform: scale(1.1) rotate(5deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

@media (max-width: 1024px) {
  .game-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .player-panel {
    position: static;
  }

  .scoreboard {
    order: -1;
  }
}

@media (max-width: 600px) {
  .game-container {
    padding: 1rem;
  }

  h1 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  .game-grid {
    gap: 1rem;
  }

  .scoreboard {
    padding: 1rem;
  }

  .scoreboard h3 {
    font-size: 1.3rem;
    margin-bottom: 0.8rem;
  }

  .scoreboard-item {
    padding: 0.8rem;
  }

  .scoreboard-item .player-name {
    font-size: 1rem;
  }

  .scoreboard-item .score {
    font-size: 1.5rem;
  }

  .scoreboard-item .turns {
    font-size: 0.8rem;
  }

  .current-player-indicator p {
    font-size: 1.1rem;
    padding: 0.8rem 1.2rem;
  }

  .game-content {
    gap: 1rem;
  }

  .image-container {
    max-width: 100%;
    padding: 0.3rem;
  }

  .options-container {
    grid-template-columns: 1fr;
    gap: 0.8rem;
  }

  .option-chip {
    font-size: 1.1rem;
    padding: 1rem 1.2rem;
  }

  .modal-content {
    width: 95%;
    max-width: 400px;
    gap: 1rem;
  }

  .feedback-message {
    padding: 2rem 1.5rem;
  }

  .feedback-message h2 {
    font-size: 2.2rem;
    margin-bottom: 1rem;
  }

  .feedback-message p {
    font-size: 1.2rem;
    line-height: 1.5;
  }

  .feedback-message strong {
    font-size: 1.4rem;
    display: block;
    margin: 0.8rem 0 0 0;
    padding: 0.4rem 1rem;
  }

  .points-earned {
    font-size: 1.1rem !important;
  }

  .next-button {
    font-size: 1.2rem;
    padding: 1rem 2.5rem;
  }

  .final-scores {
    padding: 1.5rem;
  }

  .final-scores h2 {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }

  .score-item {
    padding: 1rem;
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }

  .score-item .player-name {
    text-align: center;
    margin-left: 0;
  }

  .replay-button {
    font-size: 1.5rem;
    padding: 1.2rem 3rem;
  }
}
</style>
