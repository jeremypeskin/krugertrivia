<template>
  <div class="game-container">
    <!-- End Game Screen -->
    <div v-if="gameEnded" class="end-game-screen">
      <h1>Game Over!</h1>
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
        Play Again
      </button>
    </div>

    <!-- Active Game Screen -->
    <div v-else-if="players.length > 0 && currentAnimal" class="game-content-wrapper">
      <h1>What am I?</h1>

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
          <h2>Correct!</h2>
          <p>Great job, {{ currentPlayer.name }}! That's a {{ currentAnimal.name }}!</p>
          <p class="points-earned">+1 point!</p>
        </div>
        <div v-else class="feedback-message incorrect">
          <h2>Incorrect</h2>
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
  color: #1a1a1a;
  font-size: 1.1rem;
  font-weight: 600;
  background: #ffffff;
  border-radius: 16px;
  padding: 0.875rem 1.5rem;
  border: 2px solid #e5e5e5;
  margin: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.scoreboard {
  background: #ffffff;
  border-radius: 16px;
  padding: 1.5rem;
  border: 2px solid #e5e5e5;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.scoreboard h3 {
  color: #1a1a1a;
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 1.25rem 0;
  text-align: center;
}

.scoreboard-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.scoreboard-item {
  background: #f7f7f7;
  border-radius: 12px;
  padding: 1rem;
  border: 2px solid #e5e5e5;
  transition: all 0.2s ease;
}

.scoreboard-item.active {
  border-color: #58CC02;
  background: #f0fdf4;
  box-shadow: 0 0 0 3px rgba(88, 204, 2, 0.1);
  transform: translateX(4px);
}

.scoreboard-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.scoreboard-item .player-name {
  color: #1a1a1a;
  font-size: 1rem;
  font-weight: 600;
}

.scoreboard-item .score {
  color: #58CC02;
  font-size: 1.5rem;
  font-weight: 700;
}

.scoreboard-item .turns {
  color: #666;
  font-size: 0.875rem;
  font-weight: 500;
  text-align: center;
  margin-top: 0.5rem;
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
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  background: #ffffff;
  border: 2px solid #e5e5e5;
}

.animal-image {
  width: 100%;
  height: auto;
  display: block;
}

.options-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  width: 100%;
}

.option-chip {
  padding: 1.25rem 1.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a1a1a;
  background: #ffffff;
  border: 2px solid #e5e5e5;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.option-chip:hover {
  transform: translateY(-2px);
  border-color: #58CC02;
  box-shadow: 0 4px 12px rgba(88, 204, 2, 0.2);
}

.option-chip:active {
  transform: translateY(0);
}

.option-chip:nth-child(1) {
  border-color: #FF6B6B;
}

.option-chip:nth-child(1):hover {
  border-color: #FF6B6B;
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.2);
}

.option-chip:nth-child(2) {
  border-color: #1CB0F6;
}

.option-chip:nth-child(2):hover {
  border-color: #1CB0F6;
  box-shadow: 0 4px 12px rgba(28, 176, 246, 0.2);
}

.option-chip:nth-child(3) {
  border-color: #FFCE00;
}

.option-chip:nth-child(3):hover {
  border-color: #FFCE00;
  box-shadow: 0 4px 12px rgba(255, 206, 0, 0.2);
}

.option-chip:nth-child(4) {
  border-color: #A855F7;
}

.option-chip:nth-child(4):hover {
  border-color: #A855F7;
  box-shadow: 0 4px 12px rgba(168, 85, 247, 0.2);
}

/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
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
  animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.feedback-message {
  padding: 2.5rem;
  border-radius: 16px;
  width: 100%;
  border: 2px solid;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  text-align: center;
}

.feedback-message.correct {
  background: #f0fdf4;
  color: #166534;
  border-color: #58CC02;
}

.feedback-message.incorrect {
  background: #fef2f2;
  color: #991b1b;
  border-color: #ef4444;
}

.feedback-message h2 {
  margin: 0 0 1rem 0;
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.2;
}

.feedback-message p {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 500;
  line-height: 1.6;
}

.feedback-message strong {
  font-size: 1.25rem;
  font-weight: 700;
  display: inline-block;
  padding: 0.5rem 1rem;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  margin: 0 0.5rem;
}

.points-earned {
  margin-top: 0.75rem !important;
  font-size: 1.25rem !important;
  font-weight: 700 !important;
  color: #58CC02 !important;
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
  background: #ffffff;
  border-radius: 16px;
  padding: 2.5rem;
  border: 2px solid #e5e5e5;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
}

.final-scores h2 {
  color: #1a1a1a;
  font-size: 2rem;
  margin: 0 0 2rem 0;
  font-weight: 700;
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
  padding: 1.25rem 1.5rem;
  background: #f7f7f7;
  border-radius: 12px;
  border: 2px solid #e5e5e5;
  transition: all 0.2s ease;
  margin-bottom: 0.75rem;
  gap: 1rem;
}

.score-item.winner {
  background: #fef3c7;
  border-color: #FFCE00;
  box-shadow: 0 0 0 3px rgba(255, 206, 0, 0.1);
}

.score-item .rank {
  font-size: 1.5rem;
  font-weight: 700;
  color: #666;
  min-width: 50px;
  text-align: center;
}

.score-item.winner .rank {
  color: #FFCE00;
}

.score-item .player-name {
  flex: 1;
  text-align: left;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a1a1a;
}

.score-item .score {
  font-size: 1.5rem;
  font-weight: 700;
  color: #58CC02;
  white-space: nowrap;
  margin-left: auto;
}

.replay-button {
  padding: 1rem 2.5rem;
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

.replay-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(88, 204, 2, 0.4);
  background: #4db300;
}

.next-button {
  padding: 1rem 2.5rem;
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

.next-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(88, 204, 2, 0.4);
  background: #4db300;
}

.next-button:active {
  transform: translateY(0);
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
    gap: 0.75rem;
    text-align: center;
  }

  .score-item .rank {
    min-width: auto;
  }

  .score-item .player-name {
    text-align: center;
    margin-left: 0;
  }

  .score-item .score {
    margin-left: 0;
  }

  .replay-button {
    font-size: 1.5rem;
    padding: 1.2rem 3rem;
  }
}
</style>
