<template>
  <div id="app" @click.stop="setAppShow" @eventsAuth='eventsAuth'>
    <router-view/>
  </div>
</template>

<script>
import {mapActions, mapGetters, mapState} from 'vuex'
import { checklogin } from './api/api.js'

export default {
  name: 'App',
  created () {
    this.login()
  },
  methods: {
    ...mapActions(
      ['setShow', 'setLogin']
    ),
    setAppShow () {
      this.setShow(false)
    },
    eventsAuth (param) {
      this.isShowStatus = param
    },
    // 用户登录态的判断
     login () {
      var userToken = JSON.parse(this.$common.getSessionStorage("token"));
      if (userToken == "undefined" || userToken == " ") {
        this.$router.push("/login");
        this.$common.removeSessionStorage('loginStatus');
      }
    }
  },
  computed: {
    ...mapState({
      showNav: state => state.showNav
    })
  }
}
</script>

<style>
    @import "../static/css/main.css";
    @import "../static/css/color-dark.css";     /*深色主题*/
</style>