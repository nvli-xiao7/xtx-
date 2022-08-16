<template>
<!-- 评价组件 -->
  <div class="goods-comment">
    <div class="head">
      <div class="data">
        <p><span>{{evaluateList.salesCount}}</span><span>人购买</span></p>
        <p><span>{{evaluateList.praisePercent}}</span><span>好评率</span></p>
      </div>
      <div class="tags">
        <div class="dt">大家都在说：</div>
        <div class="dd">
          <a href="javascript:;" :class="{active:active===i}" v-for="(item,i) in evaluateList.tags" :key="i" @click="changeTag(i)">
             {{item.title}}({{item.tagCount}})
          </a>
        </div>
      </div>
    </div>
    <div class="sort">
      <span>排序：</span>
      <a href="javascript:;" class="active">默认</a>
      <a href="javascript:;">最新</a>
      <a href="javascript:;">最热</a>
    </div>
    <div class="list"></div>
  </div>
</template>
<script>
import { findCommentInfoByGoods } from '@/api/goods.js'
import { inject, ref } from 'vue'
export default {
  name: 'GoodsComment',
  setup () {
    // 点击的索引
    const active = ref(0)
    const changeTag = (i) => {
      active.value = i
    }
    // 接收父组件的数据
    const goods = inject('goods')
    // 评价数据
    const evaluateList = ref([])
    findCommentInfoByGoods(goods.value.id).then(data => {
      // 将数据拼接一起
      data.result.tags.unshift({ title: '有图', tagCount: data.result.hasPictureCount })
      data.result.tags.unshift({ title: '全部评价', tagCount: data.result.evaluateCount })
      evaluateList.value = data.result
    })
    return { goods, evaluateList, active, changeTag }
  }
}
</script>
<style scoped lang="less">
.goods-comment {
  .head {
    display: flex;
    padding: 30px 0;
    .data {
      width: 340px;
      display: flex;
      padding: 20px;
      p {
        flex: 1;
        text-align: center;
        span {
          display: block;
          &:first-child {
            font-size: 32px;
            color: @priceColor;
          }
          &:last-child {
            color: #999;
          }
        }
      }
    }
    .tags {
      flex: 1;
      display: flex;
      border-left: 1px solid #f5f5f5;
      .dt {
        font-weight: bold;
        width: 100px;
        text-align: right;
        line-height: 42px;
      }
      .dd {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        > a {
          width: 132px;
          height: 42px;
          margin-left: 20px;
          margin-bottom: 20px;
          border-radius: 4px;
          border: 1px solid #e4e4e4;
          background: #f5f5f5;
          color: #999;
          text-align: center;
          line-height: 40px;
          &:hover {
            border-color: @xtxColor;
            background: lighten(@xtxColor,50%);
            color: @xtxColor;
          }
          &.active {
            border-color: @xtxColor;
            background: @xtxColor;
            color: #fff;
          }
        }
      }
    }
  }
  .sort {
    height: 60px;
    line-height: 60px;
    border-top: 1px solid #f5f5f5;
    border-bottom: 1px solid #f5f5f5;
    margin: 0 20px;
    color: #666;
    > span {
      margin-left: 20px;
    }
    > a {
      margin-left: 30px;
      &.active,&:hover {
        color: @xtxColor;
      }
    }
  }
}
</style>
