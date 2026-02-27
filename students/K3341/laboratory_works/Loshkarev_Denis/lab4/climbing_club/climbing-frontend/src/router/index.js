import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

import LoginView from '../views/LoginView.vue'
import MountainsView from '../views/MountainsView.vue'

// добавь эти файлы в src/views/ (или поправь пути/имена под свои)
import DashboardView from '../views/DashboardView.vue'
import AlpinistsView from '../views/AlpinistsView.vue'
import CreateClimbView from '../views/CreateClimbView.vue'
import ChangePasswordView from '../views/ChangePasswordView.vue'
import ClubsView from '../views/ClubsView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', name: 'login', component: LoginView, meta: { requiresAuth: false } },

    { path: '/', redirect: '/dashboard' },

    { path: '/dashboard', name: 'dashboard', component: DashboardView, meta: { requiresAuth: true } },
    { path: '/mountains', name: 'mountains', component: MountainsView, meta: { requiresAuth: true } },
    { path: '/clubs', name: 'clubs', component: ClubsView, meta: { requiresAuth: true }},
    { path: '/alpinists', name: 'alpinists', component: AlpinistsView, meta: { requiresAuth: true } },
    { path: '/climbs/create', name: 'climbs-create', component: CreateClimbView, meta: { requiresAuth: true } },

    { path: '/change-password', name: 'change-password', component: ChangePasswordView, meta: { requiresAuth: true } },
  ],
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.token) {
    next('/login')
  } 
  else if (to.name === 'login' && auth.token) {
    next('/dashboard')
  } 
  else {
    next()
  }
})

export default router