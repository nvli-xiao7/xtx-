<template>
<!-- 热门品牌组件 -->
  <HomePanel title="热门品牌" sub-title="国际经典 品质保证">
    <template v-slot:right>
      <a @click="toggle(-1)"
       :class="{disabled:index===0}"
       href="javascript:;"
       class="iconfont icon-angle-left
       prev"></a>
      <a @click="toggle(1)"
      :class="{disabled:index===1}"
      href="javascript:;"
      class="iconfont
      icon-angle-right
      next"></a>
    </template>
    <!-- 骨架结构 -->
      <div ref="target" class="box">
      <Transition name="fade">
        <ul v-if="brandList.length" class="list" :style="{transform:`translateX(${-index*1240}px)`}">
          <li v-for="item in brandList" :key="item.id">
            <RouterLink to="/">
              <img v-lazyLoad="item.picture" alt="">
            </RouterLink>
          </li>
        </ul>
          <div v-else class="skeleton">
          <XtxSkeleton class="item" v-for="i in 5" :key="i" animated bg="#e4e4e4" width="240px" height="305px"/>
        </div>
      </Transition>
    </div>
  </HomePanel>
</template>

<script>
import HomePanel from './home-panel'
import { ref } from 'vue'
import { findBrand } from '@/api/home.js'
import { useLazyData } from '@/hooks/index.js'
export default {
  name: 'HomeBrand',
  components: { HomePanel },
  setup () {
    // 品牌数据
    // const brandList = ref([])
    // findBrand().then((data) => {
    //   brandList.value = data.result
    // })
    const target = ref(null)
    const { result } = useLazyData(findBrand, target)
    // 上下页
    const index = ref(0)
    const toggle = (i) => {
      // 判断是否禁止按钮
      const newIndex = index.value + i
      if (newIndex < 0 || newIndex > 1) {
        return
      }
      index.value = newIndex
    }
    return { brandList: result, toggle, index, target }
  }
}
</script>

<style scoped lang='less'>
.home-panel {
  background:#f5f5f5
}
.iconfont {
  width: 20px;
  height: 20px;
  background: #ccc;
  color: #fff;
  display: inline-block;
  text-align: center;
  margin-left: 5px;
  background: @xtxColor;
  &::before {
    font-size: 12px;
    position: relative;
    top: -2px
  }
  &.disabled {
    background: #ccc;
    cursor: not-allowed;
  }
}
.box {
  display: flex;
  width: 100%;
  height: 345px;
  overflow: hidden;
  padding-bottom: 40px;
  .list {
    width: 200%;
    display: flex;
    transition: all 1s;
    li {
      margin-right: 10px;
      width: 240px;
      &:nth-child(5n) {
        margin-right: 0;
      }
      img {
        width: 240px;
        height: 305px;
      }
    }
  }
   .skeleton {
    width: 100%;
    display: flex;
    .item {
      margin-right: 10px;
      &:nth-child(5n) {
        margin-right: 0;
      }
    }
  }
}

</style>
