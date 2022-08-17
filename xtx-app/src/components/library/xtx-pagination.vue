<template>
<!-- 商品详情-评价组件-★分页组件 -->
  <div class="xtx-pagination">
    <a href="javascript:;" v-if="myCurrentPage>1" @click="myCurrentPage--">上一页</a>
    <a href="javascript:;" class="disabled" v-else>上一页</a>
    <span v-if="pager.start>1">...</span>
    <a href="javascript:;" @click="changePage(i)" :class="{active:myCurrentPage===i}" v-for="i in pager.btnArr" :key="i">{{i}}</a>
    <span v-if="pager.end<pager.pageCount">...</span>
    <a href="javascript:;" v-if="myCurrentPage<pager.pageCount" @click="myCurrentPage++">下一页</a>
    <a href="javascript:;" class="disabled" v-else>下一页</a>
  </div>
</template>
<script>
import { computed, ref, watch } from 'vue'
export default {
  name: 'XtxPagination',
  props: {
    // 总数据
    total: {
      type: Number,
      default: 100
    },
    // 当前页码数
    currentPage: {
      type: Number,
      default: 1
    },
    // 几条数据
    pageSize: {
      type: Number,
      default: 10
    }
  },
  setup (props, { emit }) {
    // 按钮数
    const btnCount = 5
    // 总条数
    const myTotal = ref(100)
    // 每页条数
    const myPageSize = ref(10)
    // 当前第几页
    const myCurrentPage = ref(1)
    // 计算方法
    const pager = computed(() => {
      // 总页数
      const pageCount = Math.ceil(myTotal.value / myPageSize.value)
      // 计算起始页码和结束页码
      // 1. 理想情况根据当前页码，和按钮个数可得到为1，2，当前，4，5
      // 当前页数3-2=1//
      let start = myCurrentPage.value - Math.floor(btnCount / 2)
      // 最后一页的页码数，1+5要-1
      let end = start + btnCount - 1
      // 2.1 如果起始页码小于1了，需要重新计算
      if (start < 1) {
        start = 1
        // 1加按钮数
        end = (start + btnCount - 1) > pageCount ? pageCount : (start + btnCount - 1)
      }
      // 2.2 如果结束页码大于总页数，需要重新计算
      if (end > pageCount) {
        end = pageCount
        // 总数减去按钮数
        start = (end - btnCount + 1) < 1 ? 1 : (end - btnCount + 1)
      }
      // 处理完毕start和end得到按钮数组
      const btnArr = []
      for (let i = start; i <= end; i++) {
        btnArr.push(i)
      }
      return { start, end, pageCount, btnArr }
    })
    // 监听数据的变化
    watch(props, () => {
      myTotal.value = props.total
      myCurrentPage.value = props.currentPage
      myPageSize.value = props.pageSize
    }, { immediate: true })
    // 点击页码数向父级更换页码数
    const changePage = (i) => {
      myCurrentPage.value = i
      emit('changePage', i)
    }
    return { pager, myCurrentPage, changePage }
  }
}
</script>
<style scoped lang="less">
.xtx-pagination {
  display: flex;
  justify-content: center;
  padding: 30px;
  > a {
    display: inline-block;
    padding: 5px 10px;
    border: 1px solid #e4e4e4;
    border-radius: 4px;
    margin-right: 10px;
    &:hover {
      color: @xtxColor;
    }
    &.active {
      background: @xtxColor;
      color: #fff;
      border-color: @xtxColor;
    }
    &.disabled {
      cursor: not-allowed;
      opacity: 0.4;
      &:hover {
        color: #333
      }
    }
  }
  > span {
    margin-right: 10px;
  }
}
</style>
