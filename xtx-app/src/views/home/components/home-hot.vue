<template>
<!-- 人气推荐 -->
  <HomePanel title="人气推荐" sub-title="人气爆款 不容错过">
    <div style="position: relative;height: 426px;" ref="target">
      <Transition name="fade">
       <ul v-if="hotList.length" ref="pannel" class="goods-list">
      <li v-for="item in hotList" :key="item.id">
        <RouterLink to="/">
          <img v-lazyLoad="item.picture" alt="">
          <p class="name">{{item.title}}</p>
          <p class="desc">{{item.alt}}</p>
        </RouterLink>
      </li>
    </ul>
    <HomeSkeleton v-else />
    </Transition>
    </div>
  </HomePanel>
</template>

<script>
import { ref } from 'vue'
import HomePanel from './home-panel'
import HomeSkeleton from './home-skeleton.vue'
import { findHot } from '@/api/home'
import { useLazyData } from '@/hooks/index.js'
export default {
  name: 'HomeNew',
  components: { HomePanel, HomeSkeleton },
  setup () {
    // const hotList = ref([])
    // findHot().then((data) => {
    //   hotList.value = data.result
    // })
    const target = ref(null)
    // 导入数据可视懒加载模块
    const { result } = useLazyData(findHot, target)
    return { hotList: result, target }
  }
}
</script>

<style scoped lang='less'>
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 426px;
  li {
    width: 306px;
    height: 406px;
    .hoverShadow();
    img {
      width: 306px;
      height: 306px;
    }
    p {
      font-size: 22px;
      padding-top: 12px;
      text-align: center;
    }
    .desc {
      color: #999;
      font-size: 18px;
    }
  }
}
</style>
