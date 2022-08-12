import { useIntersectionObserver } from '@vueuse/core'
import { ref } from 'vue'
export const useLazyData = (apiFn, target) => {
  // 需要
  // 1. 被观察的对象
  // 2. 不同的API函数
  const result = ref([])
  const { stop } = useIntersectionObserver(
    target, // dom对象
    ([{ isIntersecting }], observerElement) => {
      if (isIntersecting) { // 判断是否进入可视区域
        stop()
        apiFn().then((data) => {
          result.value = data.result
        })
      }
    }
  )
  return { result }
}
