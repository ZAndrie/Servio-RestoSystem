import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'

import HomeView from '@/views/HomeView.vue'

const DEFAULT_TITLE = 'Servio — Restaurant Order Management System'
const DEFAULT_DESCRIPTION =
  'Servio — Restaurant Order Management System. Visual dining tables, one-tap Filipino POS ordering, upfront cashiering with 80 mm receipts, Kitchen Display (KDS), and daily owner reports.'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      fullScreen: true,
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
      noindex: false,
    },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: {
      guestOnly: true,
      fullScreen: true,
      title: 'Staff Sign In | Servio',
      description: 'Sign in to Servio Restaurant Order Management System terminals.',
      noindex: true,
    },
  },
  {
    path: '/tables',
    name: 'tables',
    component: () => import('@/views/TablesView.vue'),
    meta: {
      requiresAuth: true,
      roles: ['waiter', 'admin'],
      title: 'Dining Tables | Servio',
      description: 'Live dining room table floor monitor and quick seating controls.',
      noindex: true,
    },
  },
  {
    path: '/pos',
    name: 'pos',
    component: () => import('@/views/PosView.vue'),
    meta: {
      requiresAuth: true,
      roles: ['waiter', 'admin'],
      title: 'Take Order (POS) | Servio',
      description: 'Fast point-of-sale ordering for tables with live menu availability and kitchen notes.',
      noindex: true,
    },
  },
  {
    path: '/orders',
    name: 'orders',
    component: () => import('@/views/ActiveOrdersView.vue'),
    meta: {
      requiresAuth: true,
      roles: ['waiter', 'admin'],
      title: 'Active Orders | Servio',
      description: 'Track unpaid, cooking, and ready-to-serve orders across dining tables.',
      noindex: true,
    },
  },
  {
    path: '/kitchen',
    name: 'kitchen',
    component: () => import('@/views/KitchenView.vue'),
    meta: {
      requiresAuth: true,
      roles: ['kitchen', 'admin'],
      fullScreen: true,
      title: 'Kitchen Display (KDS) | Servio',
      description: 'High-contrast Kitchen Display System for paid incoming tickets.',
      noindex: true,
    },
  },
  {
    path: '/payment/:id?',
    name: 'payment',
    component: () => import('@/views/PaymentView.vue'),
    meta: {
      requiresAuth: true,
      roles: ['waiter', 'admin'],
      title: 'Pay Bill | Servio',
      description: 'Upfront cashier payment settlement for Cash, GCash, and Card with 80 mm receipts.',
      noindex: true,
    },
  },
  {
    path: '/admin/dashboard',
    name: 'admin-dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin'],
      reportFocus: false,
      title: 'Owner Dashboard | Servio',
      description: 'Live sales KPIs, payment breakdown, top-selling dishes, and floor status.',
      noindex: true,
    },
  },
  {
    path: '/admin/reports',
    name: 'admin-reports',
    component: () => import('@/views/DashboardView.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin'],
      reportFocus: true,
      title: 'Sales Reports | Servio',
      description: 'Daily and date-range sales reports with payment method and dish ledgers.',
      noindex: true,
    },
  },
  {
    path: '/admin/menu',
    name: 'admin-menu',
    component: () => import('@/views/MenuManagementView.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin'],
      title: 'Menu Management | Servio',
      description: 'Manage dishes, prices, photos, and instant sold-out availability.',
      noindex: true,
    },
  },
  {
    path: '/admin/users',
    name: 'admin-users',
    component: () => import('@/views/UsersView.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin'],
      title: 'Staff Management | Servio',
      description: 'Register staff accounts, reset temporary passwords, and manage station access.',
      noindex: true,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: {
      fullScreen: true,
      title: 'Page Not Found | Servio',
      description: 'The requested Servio page could not be found.',
      noindex: true,
    },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) {
      return { el: to.hash, top: 90, behavior: 'smooth' }
    }
    return { top: 0, behavior: 'auto' }
  },
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
      const toastStore = useToastStore()
      toastStore.info(
        'Restricted station',
        'That terminal requires a different staff role. Redirected to your workspace.',
      )
      if (authStore.isAdmin) return next('/admin/dashboard')
      if (authStore.isKitchen) return next('/kitchen')
      return next('/tables')
    }
  }

  next()
})

const upsertMeta = (name: string, content: string) => {
  let tag = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.name = name
    document.head.appendChild(tag)
  }
  tag.content = content
}

router.afterEach((to) => {
  if (typeof document === 'undefined') return
  document.title = typeof to.meta.title === 'string' ? to.meta.title : DEFAULT_TITLE
  upsertMeta(
    'description',
    typeof to.meta.description === 'string' ? to.meta.description : DEFAULT_DESCRIPTION,
  )
  upsertMeta('robots', to.meta.noindex ? 'noindex, nofollow' : 'index, follow')
})

export default router
