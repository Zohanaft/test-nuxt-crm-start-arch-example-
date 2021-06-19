import Vuex, { StoreOptions } from 'vuex'
import Vue from 'vue'

// object -> store options interface
type storeOptions = object | null | undefined

Vue.use(Vuex)

export const store = new Vuex.Store<StoreOptions<storeOptions>>({
  strict: !!process.env.DEV
})
