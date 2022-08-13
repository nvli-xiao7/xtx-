<template>
   <div class="sub-filter" v-if="filterList">
    <!-- 品牌的渲染 -->
    <!-- 选择区域 -->
     <div class="item">
       <div class="head">品牌：</div>
       <div class="body">
         <a href="javascript:;">全部</a>
         <a href="javascript:;" v-for="item in filterList.brands" :key="item.id">{{item.name}}</a>
       </div>
     </div>
     <!-- 品牌的下面 -->
     <div class="item" v-for="p in filterList.saleProperties" :key="p.id">
      <div class="head">{{p.name}}</div>
      <div class="body">
        <a :class="{active:p.selectedProp===attr.id}" href="javasript:;" v-for="attr in p.properties" :key="attr.id">{{attr.name}}</a>
      </div>
    </div>
   </div>
   <div  class="sub-filter" v-else>
    <XtxSkeleton class="item" width="800px" height="40px"  />
    <XtxSkeleton class="item" width="800px" height="40px"  />
    <XtxSkeleton class="item" width="600px" height="40px"  />
    <XtxSkeleton class="item" width="600px" height="40px"  />
    <XtxSkeleton class="item" width="600px" height="40px"  />
  </div>
</template>
<script>
import { findFilter } from '@/api/category.js'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
export default {
  name: 'SubFilter',
  setup () {
    const filterList = ref([])
    const route = useRoute()
    // 计算方法渲染数据,路由跳转要新数据，用监听
    const filter = () => {
      findFilter(route.params.id).then((data) => {
        filterList.value = data.result
      })
    }
    // 监听路由的参数变化拿数据
    watch(() => route.params.id, (newValue) => {
      // 如果跳转的参数
      if (newValue && route.path === ('/category/sub/' + newValue)) {
        filter()
      }
    }, { immediate: true })
    return { filterList }
  }
}
</script>
<style scoped lang='less'>
  // 筛选区
  .sub-filter {
    background: #fff;
    padding: 25px;
    .item {
      display: flex;
      line-height: 40px;
      .head {
        width: 80px;
        color: #999;
      }
      .body {
        flex: 1;
        a {
          margin-right: 36px;
          transition: all .3s;
          display: inline-block;
          &.active,
          &:hover {
            color: @xtxColor;
          }
        }
      }
    }
  }
      .xtx-skeleton {
      padding: 10px 0;
    }
</style>
