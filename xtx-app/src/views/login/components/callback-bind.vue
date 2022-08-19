<template>
<!-- 绑定手机 -->
  <Form class="xtx-form" :validation-schema="schema" v-slot="{ errors }" ref="formCom">
    <div class="user-info">
      <img :src="avatar" alt="" />
      <p>Hi，{{nickname}} 欢迎来小兔鲜，完成绑定后可以QQ账号一键登录哦~</p>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <Field v-model="form.mobile" name="mobile" class="input" type="text" placeholder="绑定的手机号" />
      </div>
      <div class="error" v-if="errors.mobile">
            <i class="iconfont icon-warning" />{{ errors.mobile }}
      </div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <Field v-model="form.code" name="code" class="input" type="text" placeholder="短信验证码" />
        <span class="code"  @click="send">
          {{time <= 0 ? '发送验证码' : `${time}秒后发送`}}
        </span>
      </div>
      <div class="error" v-if="errors.code">
            <i class="iconfont icon-warning" />{{ errors.code }}
      </div>
    </div>
    <a href="javascript:;" class="submit" @click="submit">立即绑定</a>
  </Form>
</template>

<script>
import QC from 'qc'
import { ref, reactive, onUnmounted } from 'vue'
import { Field, Form } from 'vee-validate'
import schema from '@/utils/vee-validate-schema.js'
import { useIntervalFn } from '@vueuse/core'
import Message from '@/components/library/Message'
import { userQQBindCode, userQQBindLogin } from '@/api/user.js'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
export default {
  name: 'CallbackBind',
  components: { Field, Form },
  props: {
    unionId: {
      type: String,
      default: ''
    }
  },
  setup (props) {
    const nickname = ref(null)
    const avatar = ref(null)
    // 1. 准备下信息：unionId(openId) qq头像 昵称
    // 2. 完成表单校验
    // 3. 发送验证吗（校验，定义api，调用，完成倒计时）
    // 4. 进行绑定（绑定成功就是登录成功）
    if (QC.Login.check()) {
      QC.api('get_user_info').success(res => {
        avatar.value = res.data.figureurl_1
        nickname.value = res.data.nickname
      })
    }
    const formCom = ref(null)
    // 验证
    const form = reactive({
      mobile: null,
      code: null
    })
    // 正则验证事件
    const mySchema = {
      mobile: schema.mobile,
      code: schema.code
    }
    // 发送验证码
    const send = () => {
      const valid = mySchema.mobile(form.mobile)
      if (valid === true) {
        if (time.value <= 0) {
          userQQBindCode({ ...form })
            .then((data) => {
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
    // 立即绑定
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const submit = async () => {
    // 登录的点击事件
    // Form提供的方法validate()，验证通过true，否则false
      const val = await formCom.value.validate()
      if (val) {
        userQQBindLogin({ unionId: props.unionId, ...form }).then(data => {
          const { id, avatar, nickname, account, mobile, token } = data.result
          store.commit('user/setUser', { id, avatar, nickname, account, mobile, token })
          // 2. 提示
          Message({ type: 'success', text: 'QQ绑定成功' })
          // 跳转路由
          router.push(route.query.redirectUrl || '/')
        }).catch(e => {
          Message({ type: 'error', text: e.response.data.message || 'QQ绑定失败' })
        })
      }
    }
    return { nickname, avatar, form, formCom, schema: mySchema, send, time, submit }
  }
}
</script>

<style scoped lang='less'>
.user-info {
    width: 320px;
    height: 70px;
    margin: 0 auto;
    display: flex;
    background: #f2f2f2;
    align-items: center;
    padding: 0 10px;
    margin-bottom: 25px;
    img {
      background: #f2f2f2;
      width: 50px;
      height: 50px;
    }
    p {
      padding-left: 10px;
    }
  }
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
