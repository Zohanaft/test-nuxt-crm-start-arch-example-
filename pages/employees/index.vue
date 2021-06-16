<template>
  <v-row>
    <v-list class="col-12 px-3 d-flex">
      <!-- TODO: это доделать
      <v-btn-toggle
        v-model="searchParams"
        rounded
      >
        <v-btn>
          <v-icon>mdi-format-align-left</v-icon>
        </v-btn>
        <v-btn>
          <v-icon>mdi-format-align-center</v-icon>
        </v-btn>
        <v-btn>
          <v-icon>mdi-format-align-right</v-icon>
        </v-btn>
        <v-btn>
          <v-icon>mdi-format-align-justify</v-icon>
        </v-btn>
      </v-btn-toggle>
      -->
      <v-col cols="12" sm="6" md="4">
        <v-text-field
          dense
          @input="searchBySelectedParams()"
        />
      </v-col>
      <v-btn
        fab
        small
        plain
        elevation="3"
      >
        <v-icon>mdi-account-search</v-icon>
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

import { IEmployee } from '~/models/employee'

import { EmployeesModule } from '~/store/employees'
import { ProfessionsModule } from '~/store/professions'

import { AppModule } from '~/store/app'

@Component({
  async fetch () {
    await EmployeesModule.INIT()
  }
})
export default class PEmployees extends Vue {
  public get employees () { return EmployeesModule.employees }
  public get professionsArray () { return ProfessionsModule.professionsArray }
  public get professions () { return ProfessionsModule.professions }

  public loaded = EmployeesModule.loaded

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
