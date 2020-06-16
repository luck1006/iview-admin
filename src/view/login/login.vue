<style lang="less">
@import "./login.less";
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in"
            title="欢迎登录"
            :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
          <p v-if="isshow"
             style="color:#ED4014">账号或者密码错误</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'
// import { login } from '@/api/user'
// import { access, truncate, truncateSync } from 'fs'
export default {
  data () {
    return {
      isshow: false
    }
  },
  components: {
    LoginForm
  },
  methods: {
    ...mapActions([
      'handleLogin',
      'getUserInfo'
    ]),
    handleSubmit ({ userName, password }) {
      this.handleLogin({ userName, password }).then(res => {
        this.isshow = false
        this.getUserInfo().then(res => {
          if (res.access.length !== 0 && res.user_id !== null) {
            this.$router.push({
              name: this.$config.homeName
            })
          } else {
            this.isshow = true
          }
        })
      })
    }
  }
}
</script>

<style>
</style>
