import { Module, VuexModule, Mutation, getModule } from 'vuex-module-decorators'
import { store } from '~/store/index'

import { IProfession } from '~/models/profession'

import {
  getProfessions,
  putProfession
} from '~/middleware/professions'

@Module({
  dynamic: true,
  store,
  name: 'Professions',
  namespaced: true
})
class Professions extends VuexModule {
  public professions: Map<string, IProfession> = new Map()
  public loaded = false

  @Mutation
  async INIT () {
    if (this.loaded) { return }
    const response = await getProfessions({})
    const professions: Array<IProfession> = response.data
    professions.forEach((profession) => {
      this.professions.set(profession.title, profession)
    })
    // Мастхев флаг на состояние загрузки иначе не отрендерится
    this.loaded = true
  }

  @Mutation
  async ADD_NEW_PROFESSION (profession: IProfession) {
    const response = await putProfession(profession)
    const resultProfession: IProfession = response.data
    this.professions.set(resultProfession.title, resultProfession)
    // Это ужасно...
    // хотелось бы узнать как лучше реализовать работу с Map
    // во vue.
    // по мне лучший способ - не использовать ТАК мапы
    // (p.s.) пересоздаю мапу, присваиваю новую мапу мапе чтобы она обновилась везде
    const rebuildMap = new Map<string, IProfession>()
    this.professions.forEach((value) => {
      rebuildMap.set(value.title, value)
    })
    this.professions = rebuildMap
  }
}

export const ProfessionsModule = getModule(Professions)
