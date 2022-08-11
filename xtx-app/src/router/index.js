import { createRouter, createWebHashHistory } from 'vue-router'
const Layout = () => import(/* webpackChunkName: "about" */ '@/views/Layout.vue')
const Home = () => import(/* webpackChunkName: "about" */ '@/views/home/index.vue')
const TopCategory = () => import(/* webpackChunkName: "about" */ '@/views/category/index.vue')
const SubCategory = () => import(/* webpackChunkName: "about" */ '@/views/category/sub.vue')
const routes = [
  {
    path: '/',
    name: 'Layout',
    component: Layout,
    children: [
      { path: '/', name: 'Home', component: Home },
      { path: '/category/:id', component: TopCategory },
      { path: '/category/sub/:id', component: SubCategory }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
