<template>
  <div class="account-box">
    <div class="toggle">
      <a href="javascript:;" @click="isMsgLogin = false" v-if="isMsgLogin">
        <i class="iconfont icon-user"></i> 使用账号登录
      </a>
      <a href="javascript:;" @click="isMsgLogin = true" v-else>
        <i class="iconfont icon-msg"></i> 使用短信登录
      </a>
    </div>
    <!-- 事件验证:validation-schema="schema" -->
    <Form ref="formCom" class="form" :validation-schema="schema" v-slot="{ errors }">
      <template v-if="!isMsgLogin">
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field
              :class="{ error: errors.account }"
              name="account"
              v-model="form.account"
              type="text"
              placeholder="请输入用户名或手机号"
            />
          </div>
          <div class="error" v-if="errors.account">
            <i class="iconfont icon-warning" />{{ errors.account }}
          </div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-lock"></i>
            <Field
              :class="{ error: errors.password }"
              name="password"
              v-model="form.password"
              type="password"
              placeholder="请输入密码"
            />
          </div>
          <div class="error" v-if="errors.password">
            <i class="iconfont icon-warning" />{{ errors.password }}
          </div>
        </div>
      </template>
      <template v-else>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field
              :class="{ error: errors.mobile }"
              name="mobile"
              v-model="form.mobile"
              type="text"
              placeholder="请输入手机号"
            />
          </div>
          <div class="error" v-if="errors.mobile">
            <i class="iconfont icon-warning" />{{ errors.mobile }}
          </div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-code"></i>
            <Field
              :class="{ error: errors.code }"
              name="code"
              v-model="form.code"
              type="password"
              placeholder="请输入验证码"
            />
            <span class="code" @click="send">{{
              time <= 0 ? '发送验证码' : `${time}秒后发送`
            }}</span>
          </div>
          <div class="error" v-if="errors.code">
            <i class="iconfont icon-warning" />{{ errors.code }}
          </div>
        </div>
      </template>
      <div class="form-item">
        <div class="agree">
          <Field as="XtxCheckbox" name="isAgree" v-model="form.isAgree" />
          <span>我已同意</span>
          <a href="javascript:;">《隐私条款》</a>
          <span>和</span>
          <a href="javascript:;">《服务条款》</a>
        </div>
        <div class="error" v-if="errors.isAgree">
          <i class="iconfont icon-warning" />{{ errors.isAgree }}
        </div>
      </div>
      <a href="javascript:;" class="btn" @click="login">登录</a>
    </Form>
    <div class="action">
         <a href="https://graph.qq.com/oauth2.0/authorize?client_id=100556005&response_type=token&scope=all&redirect_uri=http%3A%2F%2Fwww.corho.com%3A8080%2F%23%2Flogin%2Fcallback">
            <img src="https://qzonestyle.gtimg.cn/qzone/vas/opensns/res/img/Connect_logo_7.png" alt="">
          </a>
      <div class="url">
        <a href="javascript:;">忘记密码</a>
        <a href="javascript:;">免费注册</a>
      </div>
    </div>
  </div>
</template>
<script>
import { Field, Form } from 'vee-validate'
import { ref, reactive, watch, onUnmounted } from 'vue'
import schema from '@/utils/vee-validate-schema.js'
import { userAccountLogin, userMobileLoginMsg, userMobileLogin } from '@/api/user.js'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import Message from '@/components/library/Message'
import { useIntervalFn } from '@vueuse/core'
export default {
  name: 'LoginForm',
  components: { Field, Form },
  setup () {
    const isMsgLogin = ref(false)
    // 验证
    const form = reactive({
      isAgree: true,
      account: null,
      password: null,
      mobile: null,
      code: null
    })
    // 正则验证事件
    const mySchema = {
      account: schema.account,
      password: schema.password,
      isAgree: schema.isAgree,
      mobile: schema.mobile,
      code: schema.code
    }
    // 切换登录消除原来的登录信息
    const formCom = ref(null)
    watch(isMsgLogin, () => {
      form.isAgree = true
      form.account = null
      form.password = null
      form.mobile = null
      form.code = null
    })
    const store = useStore()
    const route = useRoute() // 路径参数
    const router = useRouter() // 跳转路径
    // 登录的点击事件
    // Form提供的方法validate()，验证通过true，否则false
    const login = async () => {
      const val = await formCom.value.validate()
      if (val) {
        let data = null
        try {
          if (!isMsgLogin.value) {
            // 发送请求
            data = await userAccountLogin(form)
            // 将数据保存到vuex
          } else {
            data = await userMobileLogin(form)
          }
        } catch (e) {
          Message({ type: 'error', text: e.response.data.message || '登录失败' })
        }
        const { id, avatar, nickname, account, mobile, token } = data.result
        store.commit('user/setUser', { id, avatar, nickname, account, mobile, token })
        // 合并购物车操作
        // 合并购物车操作
        store.dispatch('cart/mergeCart').then(() => {
          // 2. 提示
          Message({ type: 'success', text: '登录成功' })
          // 3. 跳转
          router.push(route.query.redirectUrl || '/')
        })
        // // 2. 提示
        // Message({ type: 'success', text: '登录成功' })
        // // 跳转路由
        // router.push(route.query.redirectUrl || '/')
        // }).catch(e => {
        //   Message({ type: 'error', text: e.response.data.message || '登录成功' })
        // })
      }
    }
    // 发送验证码
    const send = () => {
      const valid = mySchema.mobile(form.mobile)
      if (valid === true) {
        if (time.value <= 0) {
          userMobileLoginMsg(form)
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
    return { isMsgLogin, form, schema: mySchema, login, formCom, send, time }
  }
}
</script>
.
<style lang="less" scoped>
// 账号容器
.account-box {
  .toggle {
    padding: 15px 40px;
    text-align: right;
    a {
      color: @xtxColor;
      i {
        font-size: 14px;
      }
    }
  }
  .form {
    padding: 0 40px;
    &-item {
      margin-bottom: 28px;
      .input {
        position: relative;
        height: 36px;
        > i {
          width: 34px;
          height: 34px;
          background: #cfcdcd;
          color: #fff;
          position: absolute;
          left: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 18px;
        }
        input {
          padding-left: 44px;
          border: 1px solid #cfcdcd;
          height: 36px;
          line-height: 36px;
          width: 100%;
          &.error {
            border-color: @priceColor;
          }
          &.active,
          &:focus {
            border-color: @xtxColor;
          }
        }
        .code {
          position: absolute;
          right: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 14px;
          background: #f5f5f5;
          color: #666;
          width: 90px;
          height: 34px;
          cursor: pointer;
        }
      }
      > .error {
        position: absolute;
        font-size: 12px;
        line-height: 28px;
        color: @priceColor;
        i {
          font-size: 14px;
          margin-right: 2px;
        }
      }
    }
    .agree {
      a {
        color: #069;
      }
    }
    .btn {
      display: block;
      width: 100%;
      height: 40px;
      color: #fff;
      text-align: center;
      line-height: 40px;
      background: @xtxColor;
      &.disabled {
        background: #cfcdcd;
      }
    }
  }
  .action {
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .url {
      a {
        color: #999;
        margin-left: 10px;
      }
    }
  }
}
</style>
