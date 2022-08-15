<template>
<!-- 图片详情放大 -->
  <div class="goods-image">
    <!-- 大图 -->
    <div class="large" :style="[{backgroundImage:`url(${images[currIndex]})`},BgPosition]" v-show="show"></div>
    <!-- 中图 -->
    <div class="middle" ref="target">
      <img :src="images[currIndex]" alt="">
      <!-- 屏蔽层 -->
      <div class="layer" v-show="show" :style="layerPosition"></div>
    </div>
    <!-- 小图 -->
    <ul class="small">
      <li v-for="(img,i) in images" :key="img" :class="{active:i===currIndex}">
        <img @mouseenter="currIndex=i" :src="img" alt="">
      </li>
    </ul>
  </div>
</template>
<script>
import { ref, watch, reactive } from 'vue'
import { useMouseInElement } from '@vueuse/core'
export default {
  name: 'GoodsImage',
  props: {
    images: {
      type: Array,
      default: () => []
    }
  },
  setup (props) {
    const currIndex = ref(0)
    // 显示屏蔽层和大图
    const show = ref(false)
    const target = ref(null)
    // 拿到容器的坐标值
    const { elementX, elementY, isOutside } = useMouseInElement(target)
    // 监听坐标变化
    // elementX 鼠标基于容器左上角X轴偏移
    // elementY 鼠标基于容器左上角Y轴偏移
    // isOutside 鼠标是否在模板容器外
    const layerPosition = reactive({ left: 0, top: 0 })
    const BgPosition = reactive({ backgroundPositionX: 0, backgroundPositionY: 0 })
    watch([elementX, elementY, isOutside], () => {
      show.value = !isOutside.value
      const position = { x: 0, y: 0 }
      // 给x定义0~200之间滑动
      if (elementX.value < 100) position.x = 0
      else if (elementX.value > 300) position.x = 200
      else position.x = elementX.value - 100
      // 给y定义0~200之间滑动

      if (elementY.value < 100) position.y = 0
      else if (elementY.value > 300) position.y = 200
      // 如果没有这个，则坐标不会滑动
      else position.y = elementY.value - 100
      // 给样式赋值
      layerPosition.left = position.x + 'px'
      layerPosition.top = position.y + 'px'
      BgPosition.backgroundPositionX = -2 * position.x + 'px'
      BgPosition.backgroundPositionY = -2 * position.y + 'px'
    }, { immediate: true })
    return { currIndex, show, target, layerPosition, BgPosition }
  }
}
</script>
<style scoped lang="less">
.goods-image {
  width: 480px;
  height: 400px;
  position: relative;
  display: flex;
    z-index: 500;
  .large {
    position: absolute;
    top: 0;
    left: 412px;
    width: 400px;
    height: 400px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    background-repeat: no-repeat;
    background-size: 800px 800px;
    background-color: #f8f8f8;
  }
  .middle {
    width: 400px;
    height: 400px;
    background: #f5f5f5;
    position: relative;
    cursor: move;
    .layer {
      width: 200px;
      height: 200px;
      background: rgba(0,0,0,.2);
      left: 0;
      top: 0;
      position: absolute;
    }
  }
  .small {
    width: 80px;
    li {
      width: 68px;
      height: 68px;
      margin-left: 12px;
      margin-bottom: 15px;
      cursor: pointer;
      &:hover,&.active {
        border: 2px solid @xtxColor;
      }
    }
  }
}
</style>
