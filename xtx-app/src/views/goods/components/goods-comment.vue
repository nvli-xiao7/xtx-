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
      <a href="javascript:;" @click="changeSort(null)" :class="{active:reqParams.sortField===null}">默认</a>
      <a href="javascript:;" @click="changeSort('praiseCount')" :class="{active:reqParams.sortField==='praiseCount'}">最新</a>
      <a href="javascript:;" @click="changeSort('createTime')" :class="{active:reqParams.sortField==='createTime'}">最热</a>
    </div>
     <!-- 列表 -->
    <div class="list">
      <div class="item" v-for="item in commentList" :key="item.id">
        <div class="user">
          <img :src="item.member.avatar" alt="">
          <span>{{item.member.nickname}}</span>
        </div>
        <div class="body">
          <div class="score">
            <i class="iconfont icon-wjx01" v-for="i in item.score" :key="i"></i>
            <i class="iconfont icon-wjx02" v-for="i in 5-item.score" :key="i"></i>
            <span class="attr" v-for="sub in item.orderInfo.specs" :key="sub.id">{{sub.name}}：{{sub.nameValue}}</span>
          </div>
          <div class="text">{{item.content}}</div>
          <!-- 使用图片预览组件 -->
          <GoodsCommentImage v-if="item.pictures.length" :pictures="item.pictures" />
          <div class="time">
            <span>{{item.createTime}}</span>
            <span class="zan"><i class="iconfont icon-dianzan"></i>{{item.praiseCount}}</span>
          </div>
        </div>
      </div>
      <XtxPagination :total="total" :current-page="reqParams.page" @change-page="changePage"></XtxPagination>
    </div>
  </div>
</template>
<script>
import { findCommentInfoByGoods, findEvaluate } from '@/api/goods.js'
import XtxPagination from '@/components/library/xtx-pagination.vue'
import { inject, ref, reactive, watch } from 'vue'
import GoodsCommentImage from './goods-comment-image'
export default {
  name: 'GoodsComment',
  components: { GoodsCommentImage, XtxPagination },
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
    // 获取评价信息
    // 筛选条件准备
    const commentList = ref([])
    const reqParams = reactive({
      page: 1,
      pageSize: 10,
      hasPicture: null,
      tag: null,
      sortField: null
    })
    // 排序的点击参数
    const changeSort = (type) => {
      reqParams.sortField = type
      reqParams.page = 1
    }
    // 监听排序的变化发送请求数据
    const total = ref(0)
    watch(reqParams, (newValue) => {
      findEvaluate(goods.value.id, reqParams).then(data => {
        commentList.value = data.result.items
        total.value = data.result.counts
      })
    }, { immediate: true })
    // 子组件的页码数
    const changePage = (i) => {
      reqParams.page = i
    }
    return { goods, evaluateList, active, changeTag, reqParams, commentList, changeSort, total, changePage }
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
            background: lighten(@xtxColor, 50%);
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
      &.active,
      &:hover {
        color: @xtxColor;
      }
    }
  }
    .list {
    padding: 0 20px;
    .item {
      display: flex;
      padding: 25px 10px;
      border-bottom: 1px solid #f5f5f5;
      .user {
        width: 160px;
        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
        }
        span {
          padding-left: 10px;
          color: #666;
        }
      }
      .body {
        flex: 1;
        .score {
          line-height: 40px;
          .iconfont {
            color: #ff9240;
            padding-right: 3px;
          }
          .attr {
            padding-left: 10px;
            color: #666;
          }
        }
      }
      .text {
        color: #666;
        line-height: 24px;
      }
      .time {
        color: #999;
        display: flex;
        justify-content: space-between;
        margin-top: 5px;
      }
    }
  }
}
</style>
