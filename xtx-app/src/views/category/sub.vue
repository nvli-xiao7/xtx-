<template>
  <!-- <div>Sub-Category二级跳转{{$route.params.id}}</div> -->
  <div class="sub-categroy">
    <div class="container">
      <!-- 面包屑导航模块 -->
      <SubBread></SubBread>
      <!-- 选择区域 -->
      <SubFilter></SubFilter>
      <!-- 冠军类目-结果区-示例组件 -->
      <div class="goods-list">
        <!-- 排序 -->
        <SubSort></SubSort>
        <!-- 列表 -->
          <ul>
          <li v-for="sub in goodsData" :key="sub.id" >
            <GoodsItem :sub="sub" />
          </li>
        </ul>
        <!-- 加载 -->
       <XtxInfiniteLoading :loading="loading" :finished="finished" @infinite='Temporary'/>
      </div>
    </div>
  </div>
</template>
<script>
import SubBread from './components/sub-bread.vue'
import SubFilter from './components/sub-filter.vue'
import SubSort from './components/sub-sort.vue'
import { findTemporary } from '@/api/category.js'
import GoodsItem from './components/goods-item.vue'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
export default {
  name: 'SubCategory',
  components: { SubBread, SubFilter, SubSort, GoodsItem },
  setup () {
    // 定义对象向后台请求20条数据
    let reqParams = {
      page: 1,
      pageSize: 20
    }
    const goodsData = ref([])
    const loading = ref(false)
    const finished = ref(false)
    const route = useRoute()
    // 获取数据
    const Temporary = () => {
      loading.value = true
      findTemporary(reqParams).then((data) => {
        // 判断是否有数据
        if (data.result.items.length) { // 将数据拼接在一起
          goodsData.value = [...goodsData.value, ...data.result.items]
          console.log(goodsData.value)
          // 页数加加
          reqParams.page++
        } else {
          // 没数据将设置没数据
          finished.value = true
        }
        // 请求结束
        loading.value = false
      })
    }
    // 切换二级分类重新加载
    // 跳转时候将请求数据清空
    watch(() => route.params.id, (newVal) => {
      if (newVal && route.path === ('/category/sub/' + newVal)) {
        goodsData.value = []
        reqParams = {
          page: 1,
          pageSize: 20
        }
        finished.value = false
      }
    })
    return { goodsData, loading, finished, Temporary }
  }
}
</script>
<style scoped lang="less">
.goods-list {
  background: #fff;
  padding: 0 25px;
  margin-top: 25px;
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 5px;
    li {
      margin-right: 20px;
      margin-bottom: 20px;
      &:nth-child(5n) {
        margin-right: 0;
      }
    }
  }
}
</style>
