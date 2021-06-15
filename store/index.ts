// import { store } from 'quasar/wrappers';
import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

export const store = new Vuex.Store<any>({
  strict: !!process.env.DEV
})
