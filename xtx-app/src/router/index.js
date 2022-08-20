import { createRouter, createWebHashHistory } from 'vue-router'
const Layout = () => import(/* webpackChunkName: "about" */ '@/views/Layout.vue')
const Home = () => import(/* webpackChunkName: "about" */ '@/views/home/index.vue')
const TopCategory = () => import(/* webpackChunkName: "about" */ '@/views/category/index.vue')
const SubCategory = () => import(/* webpackChunkName: "about" */ '@/views/category/sub.vue')
const Goods = () => import(/* webpackChunkName: "about" */ '@/views/goods/index.vue')
const Login = () => import(/* webpackChunkName: "about" */ '@/views/login/index.vue')
const Callback = () => import(/* webpackChunkName: "about" */ '@/views/login/callback.vue')
const XtxCartPage = () => import(/* webpackChunkName: "about" */ '@/views/cart/index.vue')
const routes = [
  {
    path: '/',
    name: 'Layout',
    component: Layout,
    children: [
      { path: '/', name: 'Home', component: Home },
      { path: '/category/:id', component: TopCategory },
      { path: '/category/sub/:id', component: SubCategory },
      { path: '/product/:id', component: Goods }
    ]
  },
  { path: '/login', component: Login },
  { path: '/login/callback', component: Callback },
  { path: '/cart', component: XtxCartPage }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  // 跳转路由回到顶部
  scrollBehavior () {
    return { left: 0, top: 0 }
  }
})

export default router
