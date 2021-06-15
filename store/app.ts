import { Module, VuexModule, Mutation, getModule } from 'vuex-module-decorators'
import { store } from '~/store/index'

@Module({
  dynamic: true,
  store,
  name: 'App',
  namespaced: true
})
class App extends VuexModule {
  public title: string = 'Dashboard'

  @Mutation
  SET_TITLE (title: string) {
    this.title = title
  }
}

export const AppModule = getModule(App)
