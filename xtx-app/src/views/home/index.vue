<template>
<!-- 中间部分 -->
  <div class="page-home">
    <div class="home-entry">
      <div class="container">
        <!-- 左侧分类 -->
        <HomeCategory />
        <!-- 轮播图组件 -->
        <HomeBanner></HomeBanner>
        <!-- 新鲜好物组件 -->
        <HomeNew></HomeNew>
        <!-- 人气推荐 -->
        <HomeHot></HomeHot>
      </div>
    </div>
  </div>
</template>
<script>
import HomeCategory from './components/home-category'
import HomeBanner from './components/home-banner.vue'
import HomeNew from './components/home-new.vue'
import HomeHot from './components/home-hot.vue'
export default {
  name: 'PageHome',
  components: { HomeCategory, HomeBanner, HomeNew, HomeHot }
}
</script>
<style scoped lang="less">
.xtx-carousel {
  ::v-deep .carousel-btn.prev {
    left: 270px;
  }
  ::v-deep .carousel-indicator {
    padding-left: 250px;
  }
}
</style>
