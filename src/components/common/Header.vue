<template>
    <div class="header">
        <!-- 折叠按钮 -->
        <div class="collapse-btn" @click="collapseChage">
            <i class="el-icon-menu"></i>
        </div>
        <div class="logo">不咕咕后台管理系统</div>
        <div class="header-right" >
            <div class="header-user-con">
                <!-- 全屏显示 -->
                <div class="btn-fullscreen" @click="handleFullScreen">
                    <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
                        <i class="fullscreen" v-if="!fullscreen"><img src="../../../static/img/fullscreen_alt.svg" alt=""></i>
                        <i class="fullscreen" v-if="fullscreen"><img src="../../../static/img/fullscreen_exit_alt.svg" alt=""></i>
                    </el-tooltip>
                </div>
                <!-- 用户头像 -->
                <div class="user-avator"><img :src="avator"></div>
                <!-- 用户名下拉菜单 -->
                <div class="header_right" @click.stop="showSet">
                    <span class="user_Name">您好: {{username}}</span>
                    <div class="setting_box" >
                        <div class="span_exit" v-if="showNav">
                            <span @click="toExit">退出系统</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import bus from "../common/bus";
import { logout } from "../../api/api.js";
import { mapActions, mapState } from "vuex";
import Cookies from "js-cookie";

export default {
  data() {
    return {
      collapse: false,
      fullscreen: false,
      name: "admin",
      message: 2,
      username: "",
      avator: ""
    };
  },
  computed: {
    ...mapState({
      showNav: state => state.showNav
    })
  },
  methods: {
    ...mapActions(["setLogin", "setShow"]),

    // 退出登录
    toExit() {
      this.$common.removeSessionStorage("token");
      this.$common.removeSessionStorage("loginStatus");
      this.$common.removeSessionStorage('user')
      this.$common.removeSessionStorage('currentPage_report')
      this.$common.removeSessionStorage('shopName')
      this.$common.removeSessionStorage('fromDate')
      this.$common.removeSessionStorage('toDate')
      setTimeout(() => {
        this.$router.push("/login");
      }, 500);
    },
    showSet() {
      if (this.showNav) {
        this.setShow(false);
      } else {
        this.setShow(true);
      }
      this.$emit("eventsAuth", this.showNav);
    },
    // 侧边栏折叠
    collapseChage() {
      this.collapse = !this.collapse;
      bus.$emit("collapse", this.collapse);
    },
    // 全屏事件
    handleFullScreen() {
      let element = document.documentElement;
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }
      }
      this.fullscreen = !this.fullscreen;
    }
  },
  mounted() {
    if (document.body.clientWidth < 1500) {
      this.collapseChage();
    }
    var userData = JSON.parse(this.$common.getSessionStorage("user"));
    var userToken = JSON.parse(this.$common.getSessionStorage("token"));
    if (userToken == "undefined" || userToken == " ") {
      this.$router.push("/login");
    } else {
        this.username = userData.username;
        this.avator = 'http://pic.soutu123.cn/element_origin_min_pic/01/37/09/22573c3a831082c.jpg%21/fw/700/quality/90/unsharp/true/compress/true';
    }
  }
};
</script>
<style scoped lang="scss">
.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  font-size: 22px;
  color: #fff;
}
.collapse-btn {
  float: left;
  padding: 0 21px;
  cursor: pointer;
  line-height: 70px;
}
.header .logo {
  float: left;
  width: 250px;
  line-height: 70px;
}
.header-right {
  float: right;
  padding-right: 20px;
}
.header-user-con {
  display: flex;
  height: 70px;
  align-items: center;
}
.btn-fullscreen {
  margin-right: 10px;
  font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
  width: 20px;
  height: 20px;
  cursor: pointer;
  .fullscreen {
    width: 20px;
    height: 20px;
    img {
      display: block;
      width: 20px;
      height: 20px;
    }
  }
}
.btn-bell-badge {
  position: absolute;
  right: 0;
  top: -2px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: #f56c6c;
  color: #fff;
}
.btn-bell .el-icon-bell {
  color: #fff;
}
.header_right {
  float: right;
  line-height: 60px;
  height: 60px;
  cursor: pointer;
  margin-left: 10px;
  position: relative;
  .user_Name {
    color: #fff;
    font-size: 16px;
  }
  .setting_box {
    position: relative;
    z-index: 9999;
    background-color: #344055;
    .span_exit {
      z-index: 9999;
      position: absolute;
      box-sizing: border-box;
      top: 0;
      right: 0;
      width: 100px;
      height: 40px;
      transition: 0.3s;
      background-color: #344055;
      text-align: left;
      text-align: center;
      span {
        height: 40px;
        font-size: 14px;
        line-height: 40px;
        width: 100%;
        display: block;
        cursor: pointer;
        color: #fff;
      }
      span:hover {
        background-color: #324657;
        color: #409eff;
      }
    }
    .setting:hover .span_exit {
      display: block;
    }
  }
}
.user-avator img {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.el-dropdown-link {
  color: #fff;
  cursor: pointer;
}
.el-dropdown-menu__item {
  text-align: center;
}
</style>
