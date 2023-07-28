<template>
  <div class="register-container">
    <el-form ref="registerForm" :model="registerForm" :rules="registerRules" class="register-form" auto-complete="on"
             label-position="left">

      <div class="title-container">
        <h3 class="title">用户注册</h3>
      </div>
      <!--账号-->
      <el-form-item prop="username">
        <span class="svg-container">
            <i class="el-icon-user-solid"></i>
        </span>
        <el-input
          ref="username"
          v-model="registerForm.username"
          placeholder="用户名"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>
      <!--真实姓名-->
      <el-form-item prop="name">
        <span class="svg-container">
          <i class="el-icon-user-solid"></i>
        </span>
        <el-input
          ref="name"
          v-model="registerForm.name"
          placeholder="真实姓名"
          name="name"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>
      <!--身份证号-->
      <el-form-item prop="idNumber">
        <span class="svg-container">
            <i class="el-icon-user-solid"></i>
        </span>
        <el-input
          ref="idNumber"
          v-model="registerForm.idNumber"
          placeholder="身份证号"
          name="idNumber"
          type="text"
          clearable
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>
      <!--手机号-->
      <el-form-item prop="phone">
        <span class="svg-container">
          <i class="el-icon-phone"></i>
        </span>
        <el-input
          ref="phone"
          v-model="registerForm.phone"
          placeholder="手机号"
          name="phone"
          type="text"
          clearable
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>
      <!--住址-->
      <el-form-item prop="address">
        <span class="svg-container">
          <i class="el-icon-location"></i>
        </span>
        <el-input
          ref="address"
          v-model="registerForm.address"
          placeholder="现住址"
          name="address"
          type="text"
          clearable
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>
      <!--密码-->
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"/>
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="registerForm.password"
          :type="passwordType"
          placeholder="密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleRegister"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"/>
        </span>
      </el-form-item>
      <el-form-item prop="passwords">
        <span class="svg-container">
          <svg-icon icon-class="password"/>
        </span>
        <el-input
          :key="passwordType"
          ref="passwords"
          v-model="registerForm.passwords"
          :type="passwordType"
          placeholder="确认密码"
          name="passwords"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleRegister"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"/>
        </span>
      </el-form-item>

      <el-radio-group v-model="registerForm.sex" style="margin-bottom: 20px">
        <el-radio :label="0">男</el-radio>
        <el-radio :label="1">女</el-radio>
      </el-radio-group>

      <el-button :loading="loading" :disabled="disabled" type="primary" style="width:100%;margin-bottom:20px;"
                 @click.native.prevent="handleRegister">注册
      </el-button>

      <div class="tips">
        <el-button type="text" @click="$router.push('/login')">已有账号？立即登录</el-button>
      </div>

    </el-form>
  </div>
</template>

<script>


import axios from "axios";

export default {
  name: 'Register',
  data() {
    const validateUserName = (rule, value, callback) => {
      this.$store.dispatch('user/list', value).then((res) => {
        if (res.data !== null) {
          callback(new Error('该用户名已被注册，请重新输入'))
          this.disabled = true
        }else {
          callback()
          this.disabled = false
        }
      }).catch(() => {
      })
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于6位数'))
        this.disabled = true
      } else {
        this.disabled = false
        callback()
      }
    }
    const validatePhone = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('请输入正确的手机号'))
        this.disabled = true
      } else {
        this.disabled = false
        callback()
      }
    }
    const validateIdNumber = (rule, value, callback) => {
      if (value.length < 18) {
        callback(new Error('请输入正确的身份证号'))
        this.disabled = true
      } else {
        this.disabled = false
        callback()
      }
    }
    const validateAddress = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('请输入地址'))
        this.disabled = true
      } else {
        this.disabled = false
        callback()
      }
    }
    const validatePasswords = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于6位数'))
        this.disabled = true
      } else if (value !== this.registerForm.password) {
        callback(new Error('两次密码不一致'))
        this.disabled = true
      } else {
        this.disabled = false
        callback()
      }
    }
    return {
      registerForm: {
        username: '',
        password: '',
        passwords: '',
        sex: 0,
        idNumber:'',
        address:'',
        name:'',
        phone:'',
      },

      registerRules: {
        username: [{required: true, trigger: 'blur', validator: validateUserName}],
        password: [{required: true, trigger: 'blur', validator: validatePassword}],
        passwords: [{required: true, trigger: 'blur', validator: validatePasswords}],
        phone: [{required: true, trigger: 'blur',validator: validatePhone}],
        idNumber: [{required: true, trigger: 'blur',validator: validateIdNumber}],
        address: [{required: true, trigger: 'blur',validator: validateAddress}]
      },
      loading: false,
      disabled: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    // 显示密码隐藏密码
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleRegister() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/register', this.registerForm).then(() => {
            this.$router.push({path: this.redirect || 'login'})
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .register-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.register-container {

  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.register-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .register-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    text-align: right;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
