<template>
  <div class="register_container">
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
          <n-input v-model:value="model.account" @keydown.enter.prevent placeholder="邮箱"/>
        </n-form-item>
        <n-form-item path="code">
          <div style="display:flex;width:100%">
            <div style="flex:1">
              <n-input v-model:value="model.code" @keydown.enter.prevent placeholder="邮箱验证码"/>
            </div>
            <div style="marginLeft:20px">
              <n-button
                type="primary"
                :disabled="countdown>0"
                @click="handleSendCode"
              >{{ countdown > 0 ? `${countdown}秒` : '发送'}}</n-button>
            </div>
          </div>
        </n-form-item>
        <n-form-item path="password">
          <n-input
            v-model:value="model.password"
            type="password"
            @keydown.enter.prevent
            placeholder="密码"
          />
        </n-form-item>
        <n-form-item ref="rPasswordFormItemRef" first path="reenteredPassword">
          <n-input
            v-model:value="model.reenteredPassword"
            :disabled="!model.password"
            type="password"
            @keydown.enter.prevent
            placeholder="密码"
          />
        </n-form-item>
        <n-row :gutter="[0, 24]">
          <n-col :span="24">
            <div>
              <n-button
                :disabled="model.account === null"
                style="width:100%"
                type="primary"
                @click="handleValidateButtonClick"
              >重置密码</n-button>
            </div>
          </n-col>
        </n-row>
      </n-form>
      <div class="form_footer">
        <span @click="goBack">返回登录</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref,onMounted  } from 'vue'
import { useRouter } from 'vue-router'
interface ModelType {
  account: string | null
  password: string | null
  reenteredPassword: string | null
}

export default defineComponent({
  setup () {
    const countdown = ref(localStorage.getItem('remainingTime'))||ref(0);

    const router = useRouter()
    const formRef = ref<FormInst | null>(null)
    const rPasswordFormItemRef = ref<FormItemInst | null>(null)
    const message = useMessage()
    const modelRef = ref<ModelType>({
      account: null,
      code:null,
      password: null,
      reenteredPassword: null
    })

    onMounted(() => {
      if(countdown.value>0){
        handleSendCode()
      }
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
    function goBack(){
      router.back()
    }
    function handleSendCode(){
      if(countdown.value<=0){
        countdown.value = 60
      }
      const timer = setInterval(() => {
        countdown.value--;
        localStorage.setItem('remainingTime', countdown.value)
        if (countdown.value === 0) {
          clearInterval(timer);
        }
      }, 1000);
      // 请求接口
    }
    const rules: FormRules = {
      account: [
        {
          required: true,
          message:'请输入账号',
          trigger: ['input', 'blur']
        }
      ],
      code: [
        {
          required: true,
          message:'请输入邮箱验证码',
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
      countdown,
      formRef,
      rPasswordFormItemRef,
      model: modelRef,
      rules,
      goBack,
      handleSendCode,
      handlePasswordInput () {
        if (modelRef.value.reenteredPassword) {
          rPasswordFormItemRef.value?.validate({ trigger: 'password-input' })
        }
      },
      handleValidateButtonClick (e: MouseEvent) {
        e.preventDefault()
        formRef.value?.validate((errors) => {
          if (!errors) {
            // 登录接口储存token
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
.register_container {
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
