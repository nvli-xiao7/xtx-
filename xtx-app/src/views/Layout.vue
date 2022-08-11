<template>
<!-- 头顶导航 -->
   <AppTopnav></AppTopnav>
   <!-- logo导航 -->
  <AppHeader></AppHeader>
  <!-- 吸附头顶 -->
  <AppHeaderSticky></AppHeaderSticky>
  <main class="main">
    <!-- 二级路由 -->
    <router-view></router-view>
  </main>
  <AppFooter></AppFooter>
</template>

<script>
import AppTopnav from '@/components/app-topnav.vue'
import AppHeader from '@/components/app-header.vue'
import AppFooter from '@/components/app-footer.vue'
import AppHeaderSticky from '@/components/app-header-sticky.vue'
import { useStore } from 'vuex'
export default {
  name: 'LayoutS',
  components: { AppTopnav, AppHeader, AppFooter, AppHeaderSticky },
  setup () {
    const store = useStore()
    store.dispatch('category/getList')
  }
}
</script>

.<style lang="less" scoped>
// .main{
//   height: 300px;
// }
</style>
