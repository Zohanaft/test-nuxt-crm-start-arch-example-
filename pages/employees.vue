<template>
  <v-row>
    <v-list
      class="row ma-0 d-flex"
    >
      <employee-card
        v-for="(person, index) in employees"
        :key="index"
        :person="person"
        @remove="removeEmployee($event)"
        @update="updateEmployee($event)"
      />
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
import { AppModule } from '~/store/app'

@Component({
  async fetch () {
    await EmployeesModule.INIT()
  }
})
export default class PEmployees extends Vue {
  public get employees () { return EmployeesModule.employees }
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

  created () {
    AppModule.SET_TITLE('Employees')
    // await EmployeesModule.ADD_NEW_EMPLOYEE()
  }
}
</script>
