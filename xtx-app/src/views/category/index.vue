<template>
<!-- 二级路由商品 -->
  <div class="top-category">
    <div class="container">
      <!-- {{ $route.params.id }} -->
       <!-- 面包屑 -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
          <XtxBreadItem v-if="currCategory.id">{{currCategory.name}}</XtxBreadItem>
      </XtxBread>

      <!-- 轮播图组件 -->
      <XtxCarousel :bannerList="bannerList" autoPlay style="height:500px"  isShow ></XtxCarousel>
      <!-- 所有二级分类全部分类 -->
      <div class="sub-list">
        <h3>全部分类</h3>
        <ul>
          <li v-for="sub in currCategory.children" :key="sub.id">
            <router-link :to="`/category/sub/${sub.id}`">
              <img :src="sub.picture" >
              <p>{{sub.name}}</p>
            </router-link>
          </li>
        </ul>
      </div>
      <!-- 不同分类商品 -->
      <!-- 分类关联商品 -->
      <div class="ref-goods" v-for="item in getSubList" :key="item.id">
        <div class="head">
          <h3>- {{item.name}} -</h3>
          <p class="tag">温暖柔软，品质之选</p>
          <XtxMore />
        </div>
        <div class="body">
          <GoodsItem v-for="sub in item.goods" :key="sub.id" :sub="sub"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import XtxBread from '@/components/library/xtx-bread.vue'
import GoodsItem from './components/goods-item.vue'
// import SubBread from './components/sub-bread.vue'
import { findBanner } from '@/api/home.js' // 中间轮播图
import { findCategory } from '@/api/category.js'
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
export default {
  name: 'TopCategory',
  components: { XtxBread, GoodsItem },
  setup () {
    // 轮播图的数据
    const bannerList = ref([])
    findBanner().then((data) => {
      bannerList.value = data.result
    })
    // 从vuex中获取分类的数据
    const store = useStore()
    const route = useRoute()
    // 计算方法渲染数据
    const currCategory = computed(() => {
      let cate = {}
      // 将数据遍历返回新的数组
      const item = store.state.category.list.find((item) => {
        // 将判断的路由id查找出来
        return item.id === route.params.id
      })
      // 判断有值将新值给cate
      if (item) cate = item
      return cate
    })
    // 一级类目数据
    const getSubList = ref([])
    const SubList = () => {
      findCategory(route.params.id).then((data) => {
        getSubList.value = data.result.children
      })
    }
    // 监听路由数据变化获取数据,避免只有一条数据
    watch(() => route.params.id, (newVel) => {
      if (newVel && `/category/${newVel}` === route.path) SubList()
    }, { immediate: true })
    return { bannerList, currCategory, getSubList, SubList }
  }
}
</script>
<style scoped lang="less">

.top-category {
  h3 {
    font-size: 28px;
    color: #666;
    font-weight: normal;
    text-align: center;
    line-height: 100px;
  }
  .sub-list {
    margin-top: 20px;
    background-color: #fff;
    ul {
      display: flex;
      padding: 0 32px;
      flex-wrap: wrap;
      min-height: 160px;
      li {
        width: 168px;
        height: 160px;
        a {
          text-align: center;
          display: block;
          font-size: 16px;
          img {
            width: 100px;
            height: 100px;
          }
          p {
            line-height: 40px;
          }
          &:hover {
            color: @xtxColor;
          }
        }
      }
    }
  }
  // 推荐商品
  .ref-goods {
    background-color: #fff;
    margin-top: 20px;
    position: relative;
    .head {
      .xtx-more {
        position: absolute;
        top: 20px;
        right: 20px;
      }
      .tag {
        text-align: center;
        color: #999;
        font-size: 20px;
        position: relative;
        top: -20px;
      }
    }
    .body {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      padding: 0 65px 30px;
    }
  }
}
</style>
