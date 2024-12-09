import { createRouter, createWebHistory } from 'vue-router'
import CanvasView from '@/views/CanvasView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: CanvasView,
    },
  ],
})

export default router
