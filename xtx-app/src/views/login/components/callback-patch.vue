<template>
<!-- 完善信息 -->
  <Form class="xtx-form" :validation-schema="schema" v-slot="{ errors }" ref="formCom">
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-user"></i>
        <Field v-model="form.account" name='account' class="input" type="text" placeholder="请输入用户名" />
      </div>
      <div class="error" v-if="errors.account">
            <i class="iconfont icon-warning" />{{ errors.account }}
      </div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <Field v-model="form.mobile" name='mobile' class="input" type="text" placeholder="请输入手机号" />
      </div>
      <div class="error" v-if="errors.mobile">
            <i class="iconfont icon-warning" />{{ errors.mobile }}
      </div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <Field v-model="form.code" name='code' class="input" type="text" placeholder="请输入验证码" />
        <span class="code" @click="send">{{time <= 0 ? '发送验证码' : `${time}秒后发送`}}</span>
      </div>
      <div class="error" v-if="errors.code">
            <i class="iconfont icon-warning" />{{ errors.code }}
      </div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field v-model="form.password" name='password' class="input" type="password" placeholder="请输入密码" />
      </div>
      <div class="error" v-if="errors.password">
            <i class="iconfont icon-warning" />{{ errors.password }}
      </div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field v-model="form.rePassword" name='rePassword' class="input" type="password" placeholder="请确认密码" />
      </div>
      <div class="error" v-if="errors.rePassword">
            <i class="iconfont icon-warning" />{{ errors.rePassword }}
      </div>
    </div>
    <a href="javascript:;" class="submit" @click="submit">立即提交</a>
  </Form>
</template>

<script>
import { Field, Form } from 'vee-validate'
import { reactive, onUnmounted, ref } from 'vue'
import { useIntervalFn } from '@vueuse/core'
import Message from '@/components/library/Message'
import schema from '@/utils/vee-validate-schema.js'
import { userComplement, userRegisterCode } from '@/api/user.js'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
export default {
  name: 'CallbackPatch',
  props: {
    unionId: {
      type: String,
      default: ''
    }
  },
  components: { Field, Form },
  setup (props) {
    // 表单数据对象
    const form = reactive({
      account: null,
      mobile: null,
      code: null,
      password: null,
      rePassword: null
    })
    // 正则验证
    const mySchema = {
      account: schema.accountApi,
      mobile: schema.mobile,
      code: schema.code,
      password: schema.password,
      rePassword: schema.rePassword
    }
    // 发送验证码
    const send = () => {
      const valid = mySchema.mobile(form.mobile)
      if (valid === true) {
        if (time.value <= 0) {
          userRegisterCode({ ...form })
            .then((data) => {
              console.log(data)
              Message({ type: 'success', text: '验证码发送成功' })
              time.value = 60
              resume()
            })
            .catch((e) => {
              Message({ type: 'error', text: e.response.data.message || '获取验证码失败' })
            })
        }
      } else {
        Message({ type: 'error', text: valid })
      }
    }
    // 定时器
    // pause 暂停 resume 开始
    // useIntervalFn(回调函数,执行间隔,是否立即开启)
    const time = ref(0)
    const { pause, resume } = useIntervalFn(
      () => {
        time.value--
        if (time.value <= 0) {
          pause()
        }
      },
      1000,
      false
    )
    // 组件销毁的时候清除定时器
    onUnmounted(() => {
      pause()
    })
    // 提交完善信息
    // 立即绑定
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const formCom = ref(null)
    const submit = async () => {
      const val = await formCom.value.validate()
      console.log(val)
      if (val) {
        userComplement({ unionId: props.unionId, ...form }).then(data => {
          const { id, avatar, nickname, account, mobile, token } = data.result
          store.commit('user/setUser', { id, avatar, nickname, account, mobile, token })
          // 2. 提示
          Message({ type: 'success', text: 'QQ绑定成功' })
          // 跳转路由
          router.push(route.query.redirectUrl || '/')
        }).catch(e => {
          if (e.response.data.message === 'QQ已绑定,请直接登录') {
            Message({ type: 'success', text: e.response.data.message })
          } else {
            Message({ type: 'error', text: e.response.data.message || 'QQ绑定失败' })
          }
        })
      }
    }
    return { form, schema: mySchema, send, time, formCom, submit }
  }
}
</script>

<style scoped lang='less'>
.code {
  position: absolute;
  right: 0;
  top: 0;
  line-height: 50px;
  width: 80px;
  color: #999;
  &:hover {
    cursor: pointer;
  }
}
</style>
