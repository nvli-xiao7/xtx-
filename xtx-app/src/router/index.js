import { createRouter, createWebHashHistory } from 'vue-router'
import store from '@/store'
const Layout = () => import(/* webpackChunkName: "about" */ '@/views/Layout.vue')
const Home = () => import(/* webpackChunkName: "about" */ '@/views/home/index.vue')
const TopCategory = () => import(/* webpackChunkName: "about" */ '@/views/category/index.vue')
const SubCategory = () => import(/* webpackChunkName: "about" */ '@/views/category/sub.vue')
const Goods = () => import(/* webpackChunkName: "about" */ '@/views/goods/index.vue')
const Login = () => import(/* webpackChunkName: "about" */ '@/views/login/index.vue')
const Callback = () => import(/* webpackChunkName: "about" */ '@/views/login/callback.vue')
const XtxCartPage = () => import(/* webpackChunkName: "about" */ '@/views/cart/index.vue')
const XtxPayCheckoutPage = () => import(/* webpackChunkName: "about" */ '@/views/member/pay/checkout.vue')
const routes = [
  {
    path: '/',
    name: 'Layout',
    component: Layout,
    children: [
      { path: '/', name: 'Home', component: Home },
      { path: '/category/:id', component: TopCategory },
      { path: '/category/sub/:id', component: SubCategory },
      { path: '/product/:id', component: Goods },
      { path: '/cart', component: XtxCartPage },
      { path: '/member/checkout', component: XtxPayCheckoutPage }
    ]
  },
  { path: '/login', component: Login },
  { path: '/login/callback', component: Callback }

]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  // 跳转路由回到顶部
  scrollBehavior () {
    return { left: 0, top: 0 }
  }

})
// 前置导航守卫
router.beforeEach((to, from, next) => {
  // 用户信息
  const { token } = store.state.user.profile
  // 跳转去member开头的地址却没有登录
  if (to.path.startsWith('/member') && !token) {
    next({ path: '/login', query: { redirectUrl: to.fullPath } })
  }
  next()
})
export default router
