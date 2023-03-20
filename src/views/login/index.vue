<template>
  <div class="login_container">
    <div class="form_content">
      <p class="form_title">国内版</p>
      <n-form
        ref="formRef"
        size="large"
        :model="model"
        :rules="rules"
        label-placement="left"
        style="padding:0 20px;"
      >
        <n-form-item path="account">
          <n-input v-model:value="model.account" @keydown.enter.prevent placeholder="账号"/>
        </n-form-item>
        <n-form-item path="password">
          <n-input
            v-model:value="model.password"
            type="password"
            @keydown.enter.prevent
            placeholder="密码"
          />
        </n-form-item>
        <!-- <n-form-item ref="rPasswordFormItemRef" first path="reenteredPassword" label="重复密码">
          <n-input
            v-model:value="model.reenteredPassword"
            :disabled="!model.password"
            type="password"
            @keydown.enter.prevent
          />
        </n-form-item>-->
        <n-row :gutter="[0, 24]">
          <n-col :span="24">
            <div>
              <n-button
                :disabled="model.account === null"
                style="width:100%"
                type="primary"
                @click="handleValidateButtonClick"
              >登录</n-button>
            </div>
          </n-col>
        </n-row>
      </n-form>
      <div class="form_footer">
        <span @click="register">注册</span>
        <span style="margin:0 8px">|</span>
        <span @click="forgetpassword">忘记密码</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useAuthStoreWithout } from '@/store/modules/auth'
interface ModelType {
  account: string | null
  password: string | null
  reenteredPassword: string | null
}

export default defineComponent({
  setup () {
    const router = useRouter()
    const formRef = ref<FormInst | null>(null)
    const rPasswordFormItemRef = ref<FormItemInst | null>(null)
    const message = useMessage()
    const modelRef = ref<ModelType>({
      account: null,
      password: null,
      reenteredPassword: null
    })
    function validatePasswordStartWith (
      rule: FormItemRule,
      value: string
    ): boolean {
      return (
        !!modelRef.value.password &&
        modelRef.value.password.startsWith(value) &&
        modelRef.value.password.length >= value.length
      )
    }
    function validatePasswordSame (rule: FormItemRule, value: string): boolean {
      return value === modelRef.value.password
    }
    function register(){
      router.push({
        name:'Register'
      })
    }
    function forgetpassword(){
      router.push({
        name:'Forgetpassword'
      })
    }
    const rules: FormRules = {
      account: [
        {
          required: true,
          message:'请输入账号',
          trigger: ['input', 'blur']
        }
      ],
      password: [
        {
          required: true,
          message: '请输入密码',
          trigger: ['input', 'blur']
        }
      ],
      reenteredPassword: [
        {
          required: true,
          message: '请再次输入密码',
          trigger: ['input', 'blur']
        },
        {
          validator: validatePasswordStartWith,
          message: '两次密码输入不一致',
          trigger: 'input'
        },
        {
          validator: validatePasswordSame,
          message: '两次密码输入不一致',
          trigger: ['blur', 'password-input']
        }
      ]
    }
    return {
      formRef,
      rPasswordFormItemRef,
      model: modelRef,
      rules,
      register,
      forgetpassword,
      handlePasswordInput () {
        if (modelRef.value.reenteredPassword) {
          rPasswordFormItemRef.value?.validate({ trigger: 'password-input' })
        }
      },
      handleValidateButtonClick (e: MouseEvent) {
        e.preventDefault()
        formRef.value?.validate((errors) => {
          if (!errors) {
            // 登录接口返回token
            const authStore = useAuthStoreWithout()
            const token = 'logintoken123456789'
            authStore.setLoginToken(token)
            router.push({
              name:'Chat'
            })
            message.success('验证成功')
          } else {
            console.log(errors)
            message.error('验证失败')
          }
        })
      }
    }
  }
})
</script>
<style scoped>
.login_container {
  position: relative;
  height: 100%;
  background: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)) center
      center,
    url('../../assets/BC1.jpg') no-repeat fixed;
}
.form_content {
  position: absolute;
  width: 30%;
  min-width: 310px;
  /* height: 350px; */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  background-color: #fff;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0.5rem 2rem;
  border-radius: 0.25rem;
}
.form_title {
  font-size: 2.25rem;
  color: #343a40;
  text-align: center;
}
.form_footer {
  padding: 20px;
  margin-top: 10px;
  color: #6c757d;
  background-color: #f8f9fa;
}
.form_footer span {
  cursor: pointer;
}
</style>
