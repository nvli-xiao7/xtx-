<template>
<!-- 轮播图组件 -->
  <div class="home-banner">
    <XtxCarousel :bannerList="bannerList" autoPlay :isShow='true'/>
  </div>
</template>
<script>
import { findBanner } from '@/api/home.js'
import { ref } from 'vue'
export default {
  name: 'HomeBanner',
  setup () {
    const bannerList = ref([])
    // 获取轮播图品牌数据
    findBanner().then(data => {
      bannerList.value = data.result
    })
    return { bannerList }
  }

}
</script>
<style scoped lang="less">
.home-banner {
  width: 1240px;
  height: 500px;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 98
}
</style>
