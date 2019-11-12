import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)


const state = {
  login: sessionStorage.getItem('loginStatus'),
  showNav: false
}

const getters = {
  login: state => {
    return state.login
  },
  showNav: state => {
    return state.showNav
  },
}

const mutations = {
  set_Login (state, login) {
    state.login = login
  },
  set_show (state, showNav) {
    state.showNav = showNav
  }
}

const actions = {
  setLogin ({commit}, data) {
    commit('set_Login', data)
  },
  setShow ({commit}, data) {
    commit('set_show', data)
  }
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
