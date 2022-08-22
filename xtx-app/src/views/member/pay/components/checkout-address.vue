<template>
  <!-- 收货地址组件 -->
  <div class="checkout-address">
    <div class="text">
      <div v-if="!showAddress" class="none">您需要先添加收货地址才可提交订单。</div>
      <ul v-if="showAddress">
        <li>
          <span>收<i />货<i />人：</span>{{ showAddress.receiver }}
        </li>
        <li><span>联系方式：</span>{{ showAddress.contact }}</li>
        <li>
          <span>收货地址：</span
          >{{ showAddress.fullLocation.replace(/ /g, '') + showAddress.address }}
        </li>
      </ul>
      <a href="javascript:;" @click="openAddressEdit(showAddress)">修改地址</a>
    </div>
    <div class="action">
      <XtxButton class="btn" @click="openDialog()">切换地址</XtxButton>
      <XtxButton @click="openAddressEdit({})" class="btn">添加地址</XtxButton>
    </div>
  </div>
  <!-- 对话框组件-切换收货地址 -->
 <!-- 对话框组件-切换收货地址 -->
  <XtxDialog title="切换收货地址" v-model:visible="visibleDialog">
    <div @click="selectedAddress=item" :class="{active:selectedAddress&&selectedAddress.id===item.id}" class="text item" v-for="item in list" :key="item.id">
      <ul>
        <li><span>收<i/>货<i/>人：</span>{{item.receiver}}</li>
        <li><span>联系方式：</span>{{item.contact.replace(/^(\d{3})\d{4}(\d{4})$/,'$1****$2')}}</li>
        <li><span>收货地址：</span>{{item.fullLocation.replace(/ /g,'')+item.address}}</li>
      </ul>
      <a @click="deleteCart(item.id)"  href="JavaScript:;" class="iconfont icon-close-new"></a>
    </div>
    <template #footer>
      <XtxButton @click="visibleDialog=false" type="gray" style="margin-right:20px">取消</XtxButton>
      <XtxButton @click="confirmAddressFn" type="primary">确认</XtxButton>
    </template>
  </XtxDialog>
  <!-- 收货地址添加编辑组件 -->
  <AddressEdit ref="addressEdit" @on-success="successHandler"/>
</template>
<script>
import XtxButton from '@/components/library/Xtx-button.vue'
import XtxDialog from '@/components/library/xtx-dialog.vue'
import AddressEdit from './address-edit.vue'
import { ref } from 'vue'
import { editDelete } from '@/api/order.js'
import Message from '@/components/library/Message'
export default {
  name: 'CheckoutAddress',
  components: { XtxButton, XtxDialog, AddressEdit },
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  emits: ['change'],
  setup (props, { emit }) {
    // 显示的地址
    // 显示的地址
    const showAddress = ref(null)
    // 默认通知一个地址ID给父
    // 默认通知父组件一个收货地址ID
    emit('change', showAddress.value && showAddress.value.id)
    // 判断数据有没有值
    const defaultAddress = props.list.find((item) => item.isDefault === 0)
    if (defaultAddress) {
      showAddress.value = defaultAddress
    } else {
      if (props.list.length) {
        // eslint-disable-next-line vue/no-setup-props-destructure
        showAddress.value = props.list[0]
      }
    }
    const visibleDialog = ref(false)
    // 添加地址
    const addressEdit = ref(null)
    const openAddressEdit = (showAddress) => {
      addressEdit.value.open(showAddress)
    }
    // 成功
    const successHandler = (formData) => {
      // 查找是否有地址
      const editAddress = props.list.find(item => item.id === formData.id)
      if (editAddress) {
        // 修改
        for (const key in editAddress) {
          editAddress[key] = formData[key]
        }
      } else {
        // 添加
        // 深拷贝
        const json = JSON.stringify(formData) // 需要克隆下，不然使用的是对象的引用
        // eslint-disable-next-line vue/no-mutating-props
        props.list.unshift(JSON.parse(json))
      }
      // 将添加的地址赋值给新的地址
      showAddress.value = formData
    }
    // 记录当前你选中的地址ID
    const selectedAddress = ref(null)
    const confirmAddressFn = () => {
      // 把选中的地址ID通知结算组件
      emit('change', selectedAddress.value?.id)
      visibleDialog.value = false
      // 显示的地址换成呢选中的地址
      showAddress.value = selectedAddress.value
    }
    // 删除地址
    const deleteCart = (id) => {
      editDelete(id).then(data => {
        // data.result.id
        const res = props.list.filter(item => item.id !== data.result.id)
        showAddress.value = res[0]
        emit('DeleteChange', res)
        // const res = props.list.filter(item => item.id !== data.result.id)
        // if (res.length) {
        //   for (const key in res) {
        //     props.list[key]
        //   }
        // }
        Message({ text: '删除地址成功', type: 'success' })
        // visibleDialog.value = false
      })
    }
    // 切换地址
    const openDialog = () => {
      // 将之前的选中地址改成null
      selectedAddress.value = null
      visibleDialog.value = true
    }

    return { openDialog, deleteCart, showAddress, visibleDialog, openAddressEdit, addressEdit, successHandler, selectedAddress, confirmAddressFn }
  }
}
</script>
<style scoped lang="less">
.xtx-dialog {
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    &.item {
      border: 1px solid #f5f5f5;
      margin-bottom: 10px;
      position: relative;
      cursor: pointer;
      &.active,&:hover {
        border-color: @xtxColor;
        background: lighten(@xtxColor,50%);
      }
      > ul {
        padding: 10px;
        font-size: 14px;
        line-height: 30px;
      }
      > a{
        position: absolute;
        right: 0;
        top: 30px;
      }
    }
  }
}
.checkout-address {
  border: 1px solid #f5f5f5;
  display: flex;
  align-items: center;
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    .none {
      line-height: 90px;
      color: #999;
      text-align: center;
      width: 100%;
    }
    > ul {
      flex: 1;
      padding: 20px;
      li {
        line-height: 30px;
        span {
          color: #999;
          margin-right: 5px;
          > i {
            width: 0.5em;
            display: inline-block;
          }
        }
      }
    }
    > a {
      color: @xtxColor;
      width: 160px;
      text-align: center;
      height: 90px;
      line-height: 90px;
      border-right: 1px solid #f5f5f5;
    }
  }
  .action {
    width: 420px;
    text-align: center;
    .btn {
      width: 140px;
      height: 46px;
      line-height: 44px;
      font-size: 14px;
      &:first-child {
        margin-right: 10px;
      }
    }
  }
}
</style>
