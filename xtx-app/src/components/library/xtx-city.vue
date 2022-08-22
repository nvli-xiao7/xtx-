<template>
  <!-- 06-商品详情-城市组件-基础地形 -->
  <div class="xtx-city" ref="target">
    <div class="select" @click="toggle()" :class="{ active: show }">
      <span v-if="!fullLocation" class="placeholder">{{placeholder}}</span>
      <span v-else class="value">{{fullLocation}}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div class="option" v-if="show">
      <div v-if="loading" class="loading"></div>
      <template v-else>
        <span class="ellipsis" v-for="item in currList" :key="item.code" @click="changeItem(item)">{{ item.name }}</span>
      </template>
    </div>
  </div>
</template>
<script>
import { ref, computed, reactive } from 'vue'
import { onClickOutside } from '@vueuse/core'
import axios from 'axios'
export default {
  name: 'XtxCity',
  props: {
    fullLocation: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请选择配送地址'
    }
  },
  setup (props, { emit }) {
    const show = ref(false)
    // 加载图片
    const loading = ref(false)
    const cityData = ref([])
    // 显示
    const open = () => {
      show.value = true
      loading.value = true
      // 显示时候获取城市数据
      getCityData().then((data) => {
        cityData.value = data
        loading.value = false
      })
      // 点击城市完成后清空数据。地址让数据重新输入
      for (const key in changeResult) {
        changeResult[key] = ''
      }
    }
    // 隐藏
    const close = () => {
      show.value = false
    }
    // 切换
    const toggle = () => {
      if (show.value) close()
      else open()
    }
    // 点击其他地方隐藏
    const target = ref(null)
    onClickOutside(target, () => {
      close()
    })
    // 获取城市地区数据函数
    const getCityData = () => {
      // 不知道是否是同步或者异步，用Promise
      return new Promise((resolve, reject) => {
        // 判断是否缓存
        if (window.getCityData) {
          resolve(window.getCityData)
        } else {
          // 没有则请求数据
          const url = 'https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json'
          axios.get(url).then((data) => {
            // 将数据缓存起来
            window.getCityData = data.data
            resolve(window.getCityData)
          })
        }
      })
    }
    // 计算点击的城市
    // 计算出需要展示列表
    const currList = computed(() => {
      // 省
      let currList = cityData.value
      // 城市
      if (changeResult.provinceCode) {
        currList = currList.find(p => p.code === changeResult.provinceCode).areaList
      }
      // 区
      if (changeResult.cityCode) {
        currList = currList.find(c => c.code === changeResult.cityCode).areaList
      }
      return currList
    })
    // 拿取城市数据的地址信息拼接
    // 监听用户点击省，市展示市列表和地区列表。
    const changeResult = reactive({
      provinceCode: '',
      provinceName: '',
      cityCode: '',
      cityName: '',
      countyCode: '',
      countyName: '',
      fullLocation: ''
    })
    // 将点击的城市记录下来给changeResult，方便计算属性
    const changeItem = (item) => {
      if (item.level === 0) {
        changeResult.provinceCode = item.code
        changeResult.provinceName = item.name
      }
      if (item.level === 1) {
        changeResult.cityCode = item.code
        changeResult.cityName = item.name
      }
      // 当点击区级的时候，将数据拼接发送给父组件更新
      if (item.level === 2) {
        changeResult.countyCode = item.code
        changeResult.countyName = item.name
        changeResult.fullLocation = `${changeResult.provinceName} ${changeResult.cityName} ${changeResult.countyName}`
        close()
        emit('change', changeResult)
      }
    }
    return { toggle, show, target, getCityData, loading, cityData, currList, changeItem, changeResult }
  }
}
</script>
<style scoped lang="less">
.xtx-city {
  display: inline-block;
  position: relative;
  z-index: 400;
  .select {
    border: 1px solid #e4e4e4;
    height: 30px;
    padding: 0 5px;
    line-height: 28px;
    cursor: pointer;
    &.active {
      background: #fff;
    }
    .placeholder {
      color: #999;
    }
    .value {
      color: #666;
      font-size: 12px;
    }
    i {
      font-size: 12px;
      margin-left: 5px;
    }
  }
  .option {
    width: 542px;
    border: 1px solid #e4e4e4;
    position: absolute;
    left: 0;
    top: 29px;
    background: #fff;
    min-height: 30px;
    line-height: 30px;
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    > span {
      width: 130px;
      text-align: center;
      cursor: pointer;
      border-radius: 4px;
      padding: 0 3px;
      &:hover {
        background: #f5f5f5;
      }
    }
    .loading {
      height: 290px;
      width: 100%;
      background: url(../../assets/images/loading.gif) no-repeat center;
    }
  }
}
</style>
