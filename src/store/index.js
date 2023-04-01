import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 控制侧边导航栏显示隐藏
    isCollapse:false,
    // 控制对话框显示隐藏
    dialogVisible:false,

  },
  getters: {
  },
  mutations: {
    handleCollapse(state){
      state.isCollapse = !state.isCollapse
    },
    handleDialog(state){
      state.dialogVisible = !state.dialogVisible
    },
   
    
  },
  actions: {
  },
  modules: {
  }
})
