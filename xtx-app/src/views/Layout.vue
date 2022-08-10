<template>
   <AppTopnav></AppTopnav>
  <AppHeader></AppHeader>
  <main>
    <!-- 二级路由 -->
    <router-view></router-view>
  </main>
  <AppFooter></AppFooter>
</template>

<script>
import AppTopnav from '@/components/app-topnav.vue'
import AppHeader from '@/components/app-header.vue'
import AppFooter from '@/components/app-footer.vue'
export default {
  name: 'LayoutS',
  components: { AppTopnav, AppHeader, AppFooter }
}
</script>

<style>

</style>
