// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Profile from '../views/Profile.vue'
import Users from '../views/Users.vue'
import People from '../views/People.vue'
import Contacts from '../views/Contacts.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: Login, meta: { requiresGuest: true } },
  { path: '/home', name: 'Home', component: Home, meta: { requiresAuth: true } },
  { path: '/profile', name: 'Profile', component: Profile, meta: { requiresAuth: true } },
  { path: '/users', name: 'Users', component: Users, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/people', name: 'People', component: People, meta: { requiresAuth: true } },
  { path: '/contacts', name: 'Contacts', component: Contacts, meta: { requiresAuth: true } }
  
]


const router = createRouter({
  history: createWebHistory(),
  routes
})

// Simple authentication guard based on localStorage (pode ser aprimorado utilizando o Pinia)
router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user'))
  
  if (to.meta.requiresAuth && !user) {
    next({ name: 'Login' })
  } else if (to.meta.requiresGuest && user) {
    next({ name: 'Home' })
  } else if (to.meta.requiresAdmin && user && user.type !== 'Admin') {
    next({ name: 'Home' })
  } else {
    next()
  }
})

export default router
