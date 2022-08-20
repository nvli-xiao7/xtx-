// 全局组件定义
import XtxSkeleton from './xtx-skeleton.vue'// 高亮
import XtxCarousel from './xtx-carousel.vue'// 轮播图
import XtxMore from './xtx-more.vue'// 标题组件
import XtxCheckbox from './xtx-checkbox.vue'// 复选框
import XtxBreadItem from './xtx-bread-item.vue'// 二级商品页面
import XtxInfiniteLoading from './xtx-infinite-loading.vue'// 懒加载样式，数据
import defaultImg from '@/assets/images/200.png'// 导入懒加载图片样式
import xtxMessage from '@/components/library/xtx-message.vue'// 登录成功的样式
import Message from './Message'
// import Confirm from './Confirm'
// import xtxConfirm from '@/components/library/xtx-confirm.vue'

// 自定义属性
const defineDirective = (app) => {
  app.directive('lazyLoad', {
    // 生命周期创建
    mounted (el, binding) {
      // 调用函数
      const observer = new IntersectionObserver(([{ isIntersecting }]) => {
        // 判断进入可视区域
        if (isIntersecting) {
          observer.unobserve(el)
          el.onerror = () => {
            el.src = defaultImg
          }
          el.src = binding.value
        }
      }, {
        threshold: 0.01
      })
      observer.observe(el)
    }
  })
}
export default {
  install (app) {
    app.component(XtxSkeleton.name, XtxSkeleton)
    app.component(XtxCarousel.name, XtxCarousel)
    app.component(XtxMore.name, XtxMore)
    app.component(XtxBreadItem.name, XtxBreadItem)
    app.component(XtxCheckbox.name, XtxCheckbox)
    app.component(XtxInfiniteLoading.name, XtxInfiniteLoading)
    app.component(xtxMessage.name, xtxMessage)
    // app.component(xtxConfirm.name, xtxConfirm)
    defineDirective(app)
    // 如果你想挂载全局的属性，能够通过组件实例调用的属性   this.$message
    app.config.globalProperties.$message = Message// 原型函数
    // app.config.globalProperties.$confirm = Confirm
  }
}
