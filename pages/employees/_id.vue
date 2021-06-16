<template>
  <v-container class="pa-0">
    <employee-card
      class="mx-3 mb-6"
      :person="person"
      :editable="false"
    />
    <v-list
      v-if="professions.length"
      class="row ma-0 pb-0 d-flex"
    >
      <v-list-item
        v-for="(profession, index) in professions"
        :key="index"
        class="col-4 pa-0 mb-6 relative"
      >
        <profession-card
          :profession="profession"
        />
      </v-list-item>
    </v-list>
    <v-list
      class="row ma-0 pt-0 d-flex"
    >
      <div
        v-for="(person, index) in similarPersons"
        :key="index"
        class="col-3 pt-0"
      >
        <employee-card
          class="mx-0 my-0"
          :person="person"
          :editable="false"
        />
      </div>
    </v-list>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

import { AppModule } from '~/store/app'

import { IEmployee } from '~/models/employee'
import { IProfession } from '~/models/profession'

import { EmployeesModule } from '~/store/employees'
import { ProfessionsModule } from '~/store/professions'

@Component({
  async asyncData ({ params }) {
    const person = await EmployeesModule.getEmployeeById(parseInt(params.id))
    AppModule.SET_TITLE(`${person.name} ${person.surname}`)

    return {
      person
    }
  }
})
export default class PPersonEmployee extends Vue {
  created () {
    // await EmployeesModule.ADD_NEW_EMPLOYEE()
  }

  public similarPersons: Array<IEmployee> = []
  public professions: Array<IProfession> = []
  public person: IEmployee // в контексте класса его не существует

  public async similarUserInit () {
    const professions = ProfessionsModule.professions
    const currentUserProfessions = this.person.professions
    const responsibilities: Set<string> = new Set()
    if (!currentUserProfessions) { return }

    currentUserProfessions!.forEach((profTitle: string) => {
      this.professions.push(
        professions.get(profTitle)
      )

      const currentDuties = professions.get(profTitle).responsibilities
      if (currentDuties.length > 0) {
        const arr = [...currentDuties]
        // @ts-ignore Expected 1 arguments, but got 0 or more.
        responsibilities.add(...arr)
      }
    })

    const similarProfessions: Set<string> = new Set()

    responsibilities.forEach((response) => {
      for (const profession of professions.values()) {
        if (profession.responsibilities.includes(response)) {
          similarProfessions.add(profession.title)
        }
      }
    })

    const similarPersons: Array<IEmployee> = await EmployeesModule.getEmployees({
      professions_like: [...similarProfessions],
      id_ne: this.person.id,
      _limit: 4
    })

    this.similarPersons = similarPersons
  }

  async mounted () {
    await this.similarUserInit()
  }
}
</script>
