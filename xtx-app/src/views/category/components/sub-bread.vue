<template>
<!-- 三级商品的跳转组件 -->
  <XtxBread>
    <XtxBreadItem to="/">首页</XtxBreadItem>
    <XtxBreadItem v-if="category.item" :to="`/category/${category.item.id}`">{{category.item.name}}</XtxBreadItem>
    <XtxBreadItem v-if="category.sub" :key="category.sub.id">{{category.sub.name}}</XtxBreadItem>
  </XtxBread>
</template>

<script>
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import XtxBread from '@/components/library/xtx-bread.vue'
import { computed } from 'vue'

// import { useRoute } from 'vue-router'
export default {
  name: 'SubBread',
  components: { XtxBread },
  setup () {
    const store = useStore()
    const route = useRoute()
    const category = computed(() => {
      const obj = {}
      store.state.category.list.forEach((item) => {
        // 判断是否有值或者用item.children&&
        if (item.children) {
          // 遍历
          item.children.forEach((sub) => {
            // 判断三级是否跳转有路由参数
            if (sub.id === route.params.id) {
              // 新的数组添加
              obj.sub = { id: sub.id, name: sub.name }
              obj.item = { id: item.id, name: item.name }
            }
          })
        }
      })
      return obj
    })
    return { category }
  }
}
</script>

<style></style>
