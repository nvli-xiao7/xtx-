<template>
  <!-- 轮播图模块 -->
  <div class="xtx-carousel" @mouseenter="show" @mouseleave="start">
    <ul class="carousel-body">
      <li
        class="carousel-item"
        v-for="(item, i) in bannerList"
        :key="i"
        :class="{ fade: index === i }"
      >
        <RouterLink v-if="item.hrefUrl" :to="item.hrefUrl">
          <img :src="item.imgUrl" alt="" />
        </RouterLink>
        <div v-else class="slider">
          <RouterLink v-for="goods in item" :key="goods.id" :to="`/product/${goods.id}`">
            <img :src="goods.picture" alt="" />
            <p class="name ellipsis">{{ goods.name }}</p>
            <p class="price">&yen;{{ goods.price }}</p>
          </RouterLink>
        </div>
      </li>
    </ul>
      <!-- 左右点击事件按钮 -->
      <a
        href="javascript:;"
        :class="isShow?'carousel-btn prev': 'carousel-btn add'"
        @click="prev"
        ><i class="iconfont icon-angle-left"></i
      ></a>
      <a href="javascript:;" class="carousel-btn next" @click="next"
        ><i class="iconfont icon-angle-right"></i
      ></a>
      <div class="carousel-indicator">
        <span
          v-for="(item, i) in bannerList"
          :key="i"
          :class="{ active: index === i }"
          @click="toggle(i)"
        ></span>
      </div>
  </div>
</template>

<script>
import { ref, watch, onUnmounted } from 'vue'
export default {
  name: 'XtxCarousel',
  props: {
    // 接收数据
    bannerList: {
      type: Array,
      default: () => []
    },
    // 是否开启轮播
    autoPlay: {
      type: Boolean,
      default: false
    },
    // 上下页按钮的显示位置
    isShow: {
      type: Boolean,
      default: false
    },
    times: {
      type: Number,
      default: 1000
    }
  },
  setup (props) {
    // 默认显示的图片的索引
    const index = ref(0)
    // 自动播放
    let time = null
    // 轮播图自动播放
    const autoPlayFn = () => {
      clearInterval(time)
      time = setInterval(() => {
        index.value++
        if (index.value >= props.bannerList.length) {
          index.value = 0
        }
      }, props.times)
    }
    // 监听数据
    watch(() => props.bannerList,
      (newValue) => {
        // 判断数据和值为真，调用方法
        if (newValue.length && props.autoPlay) {
          autoPlayFn()
        }
      },
      { immediate: true }
    )
    // 鼠标进入停止播放
    const show = () => {
      // 判断定时器清空
      if (time) {
        clearInterval(time)
      }
    }
    // 鼠标离开开启定时器,调用方法
    const start = () => {
      autoPlayFn()
    }
    // 下一张点击事件
    const next = () => {
      index.value++
      if (index.value >= props.bannerList.length) {
        index.value = 0
      }
    }
    // 上一张点击事件
    const prev = () => {
      index.value--
      if (index.value === -1) {
        index.value = props.bannerList.length - 1
      }
    }
    // 指示器上张下张
    const toggle = (i) => {
      index.value = i
    }
    // 组件消耗，清理定时器
    onUnmounted(() => {
      clearInterval(time)
    })
    return { index, show, start, next, prev, toggle }
  }
}
</script>
<style scoped lang="less">
.xtx-carousel{
  width: 100%;
  height: 100%;
  min-width: 300px;
  min-height: 150px;
  position: relative;
  .carousel{
    &-body {
      width: 100%;
      height: 100%;
    }
    &-item {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
      transition: opacity 0.5s linear;
      &.fade {
        opacity: 1;
        z-index: 1;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
    &-indicator {
      position: absolute;
      left: 0;
      bottom: 20px;
      z-index: 2;
      width: 100%;
      text-align: center;
      span {
        display: inline-block;
        width: 12px;
        height: 12px;
        background: rgba(0,0,0,0.2);
        border-radius: 50%;
        cursor: pointer;
        ~ span {
          margin-left: 12px;
        }
        &.active {
          background:  #fff;
        }
      }
    }
    &-btn {
      width: 44px;
      height: 44px;
      background: rgba(0,0,0,.2);
      color: #fff;
      border-radius: 50%;
      position: absolute;
      top: 228px;
      z-index: 2;
      text-align: center;
      line-height: 44px;
      opacity: 0;
      transition: all 0.5s;
      &.prev{
        left: 250px;
      }
      &.add{
        left: 20px;
      }
      &.next{
        right: 20px;
      }
    }
  }
  &:hover {
    .carousel-btn {
      opacity: 1;
    }
  }
}
// 轮播商品
.slider {
  display: flex;
  justify-content: space-around;
  padding: 0 40px;
  > a {
    width: 240px;
    text-align: center;
    img {
      padding: 20px;
      width: 230px!important;
      height: 230px!important;
    }
    .name {
      font-size: 16px;
      color: #666;
      padding: 0 40px;
    }
    .price {
      font-size: 16px;
      color: @priceColor;
      margin-top: 15px;
    }
  }
}
</style>
