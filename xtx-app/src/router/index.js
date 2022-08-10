import { createRouter, createWebHashHistory } from 'vue-router'
const Layout = () => import(/* webpackChunkName: "about" */ '@/views/Layout.vue')
const Home = () => import(/* webpackChunkName: "about" */ '@/views/home/index.vue')
const routes = [
  {
    path: '/',
    name: 'Layout',
    component: Layout,
    children: [
      {
        path: '/',
        name: 'Home',
        component: Home
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
