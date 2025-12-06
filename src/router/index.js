import { createRouter, createWebHistory } from 'vue-router'
import Game from '../views/Game.vue'
import GameSettings from '../views/GameSettings.vue'
import AnimalList from '../views/AnimalList.vue'
import AnimalDetail from '../views/AnimalDetail.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'game-settings',
      component: GameSettings,
    },
    {
      path: '/animals',
      name: 'animal-list',
      component: AnimalList,
    },
    {
      path: '/animal/:id',
      name: 'animal-detail',
      component: AnimalDetail,
    },
    {
      path: '/game',
      name: 'game',
      component: Game,
    },
  ],
})

export default router
