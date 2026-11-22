import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import LoginView from '@/views/LoginView.vue'
import TablesView from '@/views/TablesView.vue'
import PosView from '@/views/PosView.vue'
import ActiveOrdersView from '@/views/ActiveOrdersView.vue'
import KitchenView from '@/views/KitchenView.vue'
import PaymentView from '@/views/PaymentView.vue'
import DashboardView from '@/views/DashboardView.vue'
import MenuManagementView from '@/views/MenuManagementView.vue'
import UsersView from '@/views/UsersView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { guestOnly: true, fullScreen: true },
  },
  {
    path: '/tables',
    name: 'tables',
    component: TablesView,
    meta: { requiresAuth: true, roles: ['waiter', 'admin'] },
  },
  {
    path: '/pos',
    name: 'pos',
    component: PosView,
    meta: { requiresAuth: true, roles: ['waiter', 'admin'] },
  },
  {
    path: '/orders',
    name: 'orders',
    component: ActiveOrdersView,
    meta: { requiresAuth: true, roles: ['waiter', 'admin'] },
  },
  {
    path: '/kitchen',
    name: 'kitchen',
    component: KitchenView,
    meta: { requiresAuth: true, roles: ['kitchen', 'admin'], fullScreen: true },
  },
  {
    path: '/payment/:id?',
    name: 'payment',
    component: PaymentView,
    meta: { requiresAuth: true, roles: ['waiter', 'admin'] },
  },
  {
    path: '/admin/dashboard',
    name: 'admin-dashboard',
    component: DashboardView,
    meta: { requiresAuth: true, roles: ['admin'], reportFocus: false },
  },
  {
    path: '/admin/reports',
    name: 'admin-reports',
    component: DashboardView,
    meta: { requiresAuth: true, roles: ['admin'], reportFocus: true },
  },
  {
    path: '/admin/menu',
    name: 'admin-menu',
    component: MenuManagementView,
    meta: { requiresAuth: true, roles: ['admin'] },
  },
  {
    path: '/admin/users',
    name: 'admin-users',
    component: UsersView,
    meta: { requiresAuth: true, roles: ['admin'] },
  },
  {
    path: '/',
    redirect: () => {
      const authStore = useAuthStore()
      if (!authStore.isAuthenticated) return '/login'
      if (authStore.isAdmin) return '/admin/dashboard'
      if (authStore.isKitchen) return '/kitchen'
      // Waiters land directly on Visual Table Assignment (Step 1) -> then Take Order (Step 2)
      return '/tables'
    },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    if (authStore.isAdmin) return next('/admin/dashboard')
    if (authStore.isKitchen) return next('/kitchen')
    return next('/tables')
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({ path: '/login', query: { redirect: to.fullPath } })
  }

  if (to.meta.roles && Array.isArray(to.meta.roles)) {
    const userRole = authStore.role
    if (!userRole || !to.meta.roles.includes(userRole)) {
      if (authStore.isAdmin) return next('/admin/dashboard')
      if (authStore.isKitchen) return next('/kitchen')
      return next('/tables')
    }
  }

  next()
})

export default router
