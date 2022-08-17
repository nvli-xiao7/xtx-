<template>
<!-- 商品详情-同类推荐组件 -->
  <div class="goods-relevant">
    <div class="header">
      <i class="icon" />
      <span class="title">{{goodsId?'同类商品推荐':'猜你喜欢'}}</span>
    </div>
    <!-- 此处使用改造后的xtx-carousel.vue -->
    <XtxCarousel :bannerList='bannerList' style="height:380px"></XtxCarousel>
  </div>
</template>

<script>
import { findRelGoods } from '@/api/goods.js'
import { ref } from 'vue'
import XtxCarousel from '@/components/library/xtx-carousel.vue'
export default {
  // 同类推荐，猜你喜欢
  name: 'GoodsRelevant',
  components: { XtxCarousel },
  props: {
    goodsId: {
      type: String,
      default: ''
    }
  },
  setup (props) {
    // 接收数据
    const bannerList = ref([])
    findRelGoods(props.goodsId).then(data => {
      // 每页4条
      const size = 4
      // 计算他的长度
      const total = Math.ceil(data.result.length / size)
      // 遍历数据 total=4,索引值为0.1.2.3
      for (let i = 0; i < total; i++) {
        // 用slice方法把数据拼接
        // 将数据拼接为[[{}],[{}],[{}],[{}]],便于向公共样式播放
        bannerList.value.push(data.result.slice(i * size, (i + 1) * size))
      }
    })
    return { bannerList }
  }
}
</script>

<style scoped lang='less'>
.goods-relevant {
  background: #fff;
  min-height: 460px;
  margin-top: 20px;
  .header {
    height: 80px;
    line-height: 80px;
    padding: 0 20px;
    .title {
      font-size: 20px;
      padding-left: 10px;
    }
    .icon {
      width: 16px;
      height: 16px;
      display: inline-block;
      border-top: 4px solid @xtxColor;
      border-right: 4px solid @xtxColor;
      box-sizing: border-box;
      position: relative;
      transform: rotate(45deg);
      &::before {
        content: "";
        width: 10px;
        height: 10px;
        position: absolute;
        left: 0;
        top: 2px;
        background: lighten(@xtxColor, 40%);
      }
    }
  }
}
:deep(.xtx-carousel) {
  height: 380px;
  .carousel {
    &-indicator {
      bottom: 30px;
      span {
        &.active {
          background: @xtxColor;
        }
      }
    }
    &-btn {
      top: 110px;
      opacity: 1;
      background: rgba(0,0,0,0);
      color: #ddd;
      i {
        font-size: 30px;
      }
    }
  }
}
</style>
