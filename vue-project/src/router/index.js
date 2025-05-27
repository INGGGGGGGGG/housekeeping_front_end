import Vue from 'vue'
import VueRouter from 'vue-router'
// import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  // {
  //   path: '/test',
  //   name: 'test',
  //   component: () => import('../views/Element/TestView.html')
  // },
  {
    path: '/worker',
    name: 'worker',
    component: () => import('../views/Element/WorkerView.vue')
  },
  {
    path: '/category',
    name: 'category',
    component: () => import('../views/Element/CategoryView.vue')
  },
  {
    path: '/order',
    name: 'order',
    component: () => import('../views/Element/OrderStatusMonitoring.vue')
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/Element/HomePageView.vue')
  },
  {
    path: '/detail/:id',
    name: 'detail',
    component: () => import('../views/Element/DetailView.vue')
  },
  {
    path: '/apply',
    name: 'apply',
    component: () => import('../views/Element/HomeServiceApply.vue')
  },
  {
    path: '/appointment',
    name: 'appointment',
    component: () => import('../views/Element/UserAppointments.vue')
  },
  {
    path: '/stats',
    name: 'stats',
    component: () => import('../views/Element/StatsView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Element/LoginView.vue')
  },
  {
    path: '/',
    redirect: '/login'
  },
]

const router = new VueRouter({
  routes
})

export default router
