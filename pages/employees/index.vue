<template>
  <v-row>
    <v-list class="col-12 px-3 d-flex align-center">
      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <v-btn
            class="mr-3 pr-1"
            fab
            small
            plain
            elevation="1"
            :color="fSearchByResponsibility ? 'primary' : ''"
            v-bind="attrs"
            v-on="on"
            @click="fSearchByResponsibility = !fSearchByResponsibility"
          >
            <v-icon>R</v-icon>
          </v-btn>
        </template>
        <span>Search By Responsibility</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <v-btn
            class="mr-3 pr-1"
            fab
            small
            plain
            elevation="1"
            :color="fSearchByName ? 'primary' : ''"
            v-bind="attrs"
            v-on="on"
            @click="fSearchByName = !fSearchByName"
          >
            <v-icon>S</v-icon>
          </v-btn>
        </template>
        <span>Search By Surname</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <v-btn
            class="pr-1"
            fab
            small
            plain
            elevation="1"
            :color="fSearchBySurname ? 'primary' : ''"
            v-bind="attrs"
            v-on="on"
            @click="fSearchBySurname = !fSearchBySurname"
          >
            <v-icon>N</v-icon>
          </v-btn>
        </template>
        <span>Search By Firstname</span>
      </v-tooltip>

      <v-col cols="12" sm="6" md="4">
        <v-text-field
          @input="
            searchByName($event),
            searchBySurname($event),
            searchByResponsibility($event)
          "
        />
      </v-col>
      <v-btn
        fab
        small
        plain
        elevation="1"
        :href="`data:application/json;charset=utf-8,${objectToJson}`"
        download
      >
        <v-icon>mdi-upload</v-icon>
      </v-btn>
    </v-list>
    <v-list
      class="row ma-0 d-flex"
    >
      <div
        v-for="(person, i) in employees"
        :key="i"
        class="col-3 pt-0"
      >
        <employee-card
          :person="person"
          @remove="removeEmployee($event)"
          @update="updateEmployee($event)"
        >
          <div class="d-flex flex-column">
            <v-select
              v-model="person.professions"
              :items="professionsArray"
              multiple
              item-text="title"
              label="Add profession"
              dense
              @change="updateEmployee(person)"
            >
              <template #selection="{ item, index }">
                <v-chip
                  v-if="index === 0"
                  class="mt-2 mb-2"
                  small
                  color="primary"
                >
                  <span>{{ item.title }}</span>
                </v-chip>
                <v-chip
                  v-if="index === 1"
                  class="mt-2 mb-2"
                  small
                  color="primary"
                >
                  <span>{{ item.title }}</span>
                </v-chip>
                <span
                  v-if="index === 2"
                  class="grey--text text-caption"
                >
                  (+{{ person.professions.length - 2 }} others)
                </span>
              </template>
            </v-select>
          </div>
        </employee-card>
      </div>
      <div class="col-3 pt-0">
        <v-card
          class="ma-1 pa-3"
        >
          <v-btn
            v-show="!maxLoadedResources"
            block
            @click="loadMoreEmployees"
          >
            <v-icon>mdi-upload</v-icon>
            Load More
          </v-btn>
          <v-btn
            block
            class="mt-3"
            @click="addNewEmployee"
          >
            <v-icon>mdi-plus</v-icon>
            Add new employee
          </v-btn>
        </v-card>
      </div>
    </v-list>
  </v-row>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Debounce } from 'vue-debounce-decorator'

import { IEmployee } from '~/models/employee'
import { IQueryParams } from '~/models/query-params'

import { EmployeesModule } from '~/store/employees'
import { ProfessionsModule } from '~/store/professions'

import { AppModule } from '~/store/app'

@Component({
  async fetch () {
    await EmployeesModule.INIT()
  }
})
export default class PEmployees extends Vue {
  get employees () { return EmployeesModule.employees }
  get maxLoadedResources () { return EmployeesModule.maxLoadedResources }
  get professionsArray () { return ProfessionsModule.professionsArray }
  get professions () { return ProfessionsModule.professions }

  // это отправится в dataUrl ограничение - 65535 символов (раньше было)
  // есть еще библиотеки под подобные вещи, они по идее работают с сервером так или иначе
  // этот вариант - чисто фронтовый, в противном случае - просто подтягивал бы файл с сервера
  get objectToJson () {
    const employeesCopy = JSON.parse(JSON.stringify(this.employees))
    const json = JSON.stringify(employeesCopy.map((employee: IEmployee) => {
      employee.professions = employee.professions.map((profession) => {
        return JSON.stringify(this.professions.get(profession))
      })
      return employee
    }))
    return json
  }

  loaded = EmployeesModule.loaded

  fSearchByName = false
  fSearchBySurname = false
  fSearchByResponsibility = false

  searchByParams: IQueryParams = {
  }

  searchByName (value: string) {
    if (this.fSearchByName) {
      this.searchByParams.name_like = value
      this.search()
    } else {
      delete this.searchByParams.name_like
    }
  }

  searchBySurname (value: string) {
    if (this.fSearchBySurname) {
      this.searchByParams.surname_like = value
      this.search()
    } else {
      delete this.searchByParams.surname_like
    }
  }

  async searchByResponsibility (value: string) {
    if (this.fSearchByResponsibility) {
      const params = await ProfessionsModule.findByResponsibility(value)
      this.searchByParams.professions_like = params
      this.search()
    } else {
      delete this.searchByParams.professions_like
    }
  }

  @Debounce(400)
  public async search () {
    await EmployeesModule.CLEAR()
    await EmployeesModule.SEARCH_EMPLOYEES(this.searchByParams)
  }

  public async addNewEmployee () {
    await EmployeesModule.ADD_NEW_EMPLOYEE()
  }

  public async loadMoreEmployees () {
    await EmployeesModule.APPEND_EMPLOYEES()
  }

  public async removeEmployee (id: number) {
    await EmployeesModule.DELETE_EMPLOYE(id)
  }

  public async updateEmployee (employee: IEmployee) {
    await EmployeesModule.patchEmployee(employee)
  }

  public async searchBySelectedParams () {
  }

  created () {
    AppModule.SET_TITLE('Employees')
    // await EmployeesModule.ADD_NEW_EMPLOYEE()
  }
}
</script>
