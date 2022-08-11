// 全局组件定义
import XtxSkeleton from './xtx-skeleton.vue'// 高亮
import XtxCarousel from './xtx-carousel.vue'// 轮播图
import XtxMore from './xtx-more.vue'// 标题组件
export default {
  install (app) {
    app.component(XtxSkeleton.name, XtxSkeleton)
    app.component(XtxCarousel.name, XtxCarousel)
    app.component(XtxMore.name, XtxMore)
  }
}
