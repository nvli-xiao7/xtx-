<template>
<!-- 新鲜好物组件 -->
  <div class="home-new">
    <HomePanel title="新鲜好物" sub-title="新鲜出炉 品质靠谱">
      <template #right><XtxMore path="/" /></template>
      <!-- 面板内容 -->
      <div style="position: relative;height: 406px;" ref="target">
      <Transition name="fade">
        <ul v-if="newList.length" ref="pannel" class="goods-list">
        <li v-for="item in newList" :key="item.id">
          <RouterLink :to="`/product/${item.id}`">
            <img v-lazyLoad="item.picture" alt="">
            <p class="name ellipsis">{{item.name}}</p>
            <p class="price">&yen;{{item.price}}</p>
          </RouterLink>
        </li>
      </ul>
      <!-- 骨架加入 -->
      <HomeSkeleton bg="#f0f9f4" v-else />
      </Transition>
    </div>
    </HomePanel>
  </div>
</template>
<script>
import { ref } from 'vue'
import HomePanel from './home-panel.vue'
import HomeSkeleton from './home-skeleton.vue'
import { findNew } from '@/api/home'
import { useLazyData } from '@/hooks/index.js'
export default {
  name: 'HomeNew',
  components: { HomePanel, HomeSkeleton },
  setup () {
    // 获取新鲜好物的数据
    // const newList = ref([])
    // findNew().then(data => {
    //   newList.value = data.result
    // })
    const target = ref(null)
    // 导入数据懒加载模块
    const { result } = useLazyData(findNew, target)
    return { newList: result, target }
  }
}
</script>
<style scoped lang="less">
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 406px;
  li {
    width: 306px;
    height: 406px;
    background: #f0f9f4;
    .hoverShadow();
    img {
      width: 306px;
      height: 306px;
    }
    p {
      font-size: 22px;
      padding: 12px 30px 0 30px;
      text-align: center;
    }
    .price {
      color: @priceColor;
    }
  }
}
</style>
