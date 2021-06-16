import { Module, VuexModule, Mutation, getModule, Action } from 'vuex-module-decorators'
import { store } from '~/store/index'

import { IProfession } from '~/models/profession'

import {
  deleteProfession,
  getProfessions,
  patchProfession,
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
  public professionsArray: Array<IProfession> = []
  public loaded = false

  @Mutation
  async INIT () {
    // if (this.loaded) { return }
    const response = await getProfessions({})
    const professions: Array<IProfession> = response.data
    professions.map((profession: IProfession) => {
      this.professions.set(profession.title, profession)
      this.professionsArray.push(profession)
      return professions
    })
    this.loaded = true
  }

  @Mutation
  async DELETE_PROFESSION (title: string) {
    const removingProfession = this.professions.get(title)
    const response = await deleteProfession(removingProfession!.id as number)
    if (response.statusText === 'OK') {
      this.professions.delete(title)
      const index = this.professionsArray
        .findIndex(el => el.title === title)
      this.professionsArray.splice(index, 1)
      const rebuildMap = new Map<string, IProfession>()
      this.professions.forEach((value) => {
        rebuildMap.set(value.title, value)
      })
      this.professions = rebuildMap
    }
  }

  @Mutation
  async ADD_NEW_PROFESSION (profession: IProfession) {
    const response = await putProfession(profession)
    const resultProfession: IProfession = response.data
    this.professions.set(resultProfession.title, resultProfession)
    this.professionsArray.push(resultProfession)
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

  @Mutation
  async PATCH_PROFESSION (profession: IProfession) {
    const response = await patchProfession(profession)
    const resultProfession: IProfession = response.data
    this.professions.set(resultProfession.title, resultProfession)
    const index = this.professionsArray
      .findIndex(el => el.title === resultProfession.title)
    this.professionsArray.splice(index, 1, resultProfession)
    // -||-
    const rebuildMap = new Map<string, IProfession>()
    this.professions.forEach((value) => {
      rebuildMap.set(value.title, value)
    })
    this.professions = rebuildMap
  }

  @Action
  findByTitle (title: string): IProfession | undefined {
    const result: IProfession | undefined = this.professions.get(title)
    return result
  }

  @Action
  findByResponsibility (resp: string) {
    const titles: Array<string> = []
    this.professions.forEach((profession, title) => {
      if (profession.responsibilities.toString().toLowerCase().includes(resp.toLowerCase())) {
        titles.push(title)
      }
    })
    return titles
  }
}

export const ProfessionsModule = getModule(Professions)
