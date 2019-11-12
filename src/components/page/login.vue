<template>
  <div class="login_page fillcontain">
    <ul class="circles">
      <li v-for="n in 10" :key="n"></li>
    </ul>
    
    <div class="login">
      <el-form :model="loginForm" :rules="rules" ref="loginForm">
        <el-form-item>
          <h2 class="title">不咕咕后台管理系统</h2>
        </el-form-item>
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item >
          <el-button type="primary" style="margin-top: 25px" @click="submitForm('loginForm')">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { login } from "../../api/api.js";
import sha256 from "sha256";
import { mapActions } from "vuex";
import dayjs from "dayjs";

export default {
  data() {
    return {
      timeInterval: null,
      time: dayjs().format("HH:mm:ss"),
      loginForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" }
        ],
        password: [
          { required: true, message: "用户密码不能为空", trigger: "blur" }
        ]
      },
      loginStatus: false
    };
  },
  methods: {
    ...mapActions(["setLogin"]),
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let data = {
            username: this.loginForm.username,
            password: (this.loginForm.password)
          };
          login(data).then(res => {
            if(res.status == 200) {
                this.$message({
                  type: "success",
                  message: "账户登录成功!"
                });
              this.$router.push("/notifity");
              var userToken = res.data.token
              var userData = res.data.user
              this.$common.setSessionStorage('token', JSON.stringify(userToken))
              this.$common.setSessionStorage('user', JSON.stringify(userData))
              this.$common.setSessionStorage('loginStatus', true)
            } else {
              this.$message({
                  type: "error",
                  message: "账户登录失败!"
                });
            }
          });
        }
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
$input_width: 300px;
.login_page {
  background-color: #324057;
  width: 100%;
  height: 100%;
  .login {
    width: 400px;
    height: 300px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 5px;
    box-shadow: 0 0 25px #cac6c6;
    background-color: #fff;
    .title {
      text-align: center;
      color: #505458;
    }
    .el-form-item__content {
      width: $input_width;
    }
    .el-button {
      width: 240px;
    }
    .el-form {
      margin: 30px 80px auto 80px;
      .error {
        display: block;
        text-align: center;
        color: red;
      }
    }
  }

  .circles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    li {
      position: absolute;
      display: block;
      list-style: none;
      width: 20px;
      height: 20px;
      background: rgba(255, 255, 255, 0.75);
      animation: animate 25s linear infinite;
      bottom: -200px;
      @keyframes animate {
        0% {
          transform: translateY(0) rotate(0deg);
          opacity: 1;
          border-radius: 0;
        }
        100% {
          transform: translateY(-1000px) rotate(720deg);
          opacity: 0;
          border-radius: 50%;
        }
      }
      &:nth-child(1) {
        left: 15%;
        width: 60px;
        height: 60px;
        animation-delay: 0s;
      }
      &:nth-child(2) {
        left: 5%;
        width: 70px;
        height: 70px;
        animation-delay: 2s;
        animation-duration: 12s;
      }
      &:nth-child(3) {
        left: 70%;
        width: 30px;
        height: 30px;
        animation-delay: 4s;
      }
      &:nth-child(4) {
        left: 40%;
        width: 60px;
        height: 60px;
        animation-delay: 0s;
        animation-duration: 18s;
      }
      &:nth-child(5) {
        left: 65%;
        width: 45px;
        height: 45px;
        animation-delay: 0s;
      }
      &:nth-child(6) {
        left: 75%;
        width: 50px;
        height: 50px;
        animation-delay: 3s;
      }
      &:nth-child(7) {
        left: 35%;
        width: 100px;
        height: 100px;
        animation-delay: 7s;
      }
      &:nth-child(8) {
        left: 50%;
        width: 75px;
        height: 75px;
        animation-delay: 15s;
        animation-duration: 45s;
      }
      &:nth-child(9) {
        left: 20%;
        width: 60px;
        height: 60px;
        animation-delay: 2s;
        animation-duration: 35s;
      }
      &:nth-child(10) {
        left: 85%;
        width: 150px;
        height: 150px;
        animation-delay: 0s;
        animation-duration: 11s;
      }
    }
  }
}
</style>
