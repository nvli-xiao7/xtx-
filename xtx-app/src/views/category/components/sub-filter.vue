<template>
   <div class="sub-filter" v-if="filterList">
    <!-- 品牌的渲染 -->
    <!-- 选择区域 -->
     <div class="item">
       <div class="head">品牌：</div>
       <div class="body">
         <a href="javascript:;"
         v-for="item in filterList.brands"
         @click="changeBrand(item.id)"
         :class="{active:filterList.brandsId===item.id}"
         :key="item.id">{{item.name}}
         </a>
       </div>
     </div>
     <!-- 品牌的下面 -->
     <div class="item"
     v-for="p in filterList.saleProperties"
     :key="p.id">
      <div class="head">{{p.name}}</div>
      <div class="body">
        <a
        @click="changeProp(p,attr.id)"
        :class="{active:p.selectedProp===attr.id}" href="javascript:;" v-for="attr in p.properties" :key="attr.id">{{attr.name}}</a>
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
  setup (props, { emit }) {
    const filterList = ref([])
    const route = useRoute()
    // 计算方法渲染数据,路由跳转要新数据，用监听
    const filter = () => {
      findFilter(route.params.id).then((data) => {
        // 品牌添加‘全部属性’
        data.result.brandsId = null
        data.result.brands.unshift({ id: null, name: '全部' })
        // 属性添加
        data.result.saleProperties.forEach(item => {
          item.selectedProp = null
          item.properties.unshift({ id: null, name: '全部' })
        })
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
    // 定义属性的方法对象
    const getFilterParams = () => {
      // 定义对象将一行的id和属性的id和名称发送给父组件
      const obj = { brandsId: null, attrs: [] }
      // 品牌的id
      // 定义品牌id
      obj.brandsId = filterList.value.brandsId
      // 属性的id
      // 遍历属性
      filterList.value.saleProperties.forEach(item => {
        // p判断是否有值，默认为null
        if (item.selectedProp) {
          // 有值件id赋值
          const prop = item.properties.find(prop => prop.id === item.selectedProp)
          // 将数据名字和拼接一起
          obj.attrs.push({ groupName: item.name, propertyName: prop.name })
        }
      })
      if (obj.attrs.length === 0) obj.attrs = null
      // 将数据返回给方法
      return obj
    }
    // 1. 记录当前选择的品牌
    const changeBrand = (id) => {
      // 如果点击同个则返回
      if (filterList.value.brandsId === id) return
      // 否则赋值
      filterList.value.brandsId = id
      // 将方法的拼接值发送给父级
      emit('filter-change', getFilterParams())
    }
    // 记录选择的属性
    const changeProp = (item, id) => {
      if (item.selectedProp === id) return
      item.selectedProp = id
      emit('filter-change', getFilterParams())
    }
    return { filterList, changeBrand, changeProp, getFilterParams }
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
