import {
  Module,
  VuexModule,
  Mutation,
  Action,
  getModule
} from 'vuex-module-decorators'

import { store } from '~/store/index'

import { IEmployee } from '~/models/employee'
import { IQueryParams } from '~/models/query-params'

import {
  getNewEmployee,
  putEmployee,
  getEmployees,
  patchEmployee,
  deleteEmployee
} from '~/middleware/employees'

@Module({
  dynamic: true,
  store,
  name: 'Employees',
  namespaced: true
})
class Employees extends VuexModule {
  public param: string = 'STORE TEST'
  public employees: Array<IEmployee> = []
  public limit = 10
  public page = 1
  public step = 10
  public loaded = false
  public searchParams: IQueryParams = {
    name_like: null,
    surname_like: null,
    professions_like: null
  }

  @Mutation
  async INIT () {
    if (this.loaded) { return }
    const params = { _limit: this.limit, _page: this.page }
    const response = await getEmployees(params)
    const employees: Array<IEmployee> = response.data
    this.employees.push(...employees)
    this.loaded = true
  }

  @Mutation
  async APPEND_EMPLOYEES () {
    this.page += 1

    const params = { _limit: this.limit, _page: this.page }
    const response = await getEmployees(params)
    const employees = response.data
    this.employees.push(...employees)
  }

  @Mutation
  async SEARCH_EMPLOYEES (searchParams: IQueryParams) {
    let params: IQueryParams = { _limit: this.limit, _page: this.page }
    params = Object.assign(params, searchParams)
    const response = await getEmployees(params)
    const employees = response.data
    this.employees.push(...employees)
  }

  @Mutation
  CLEAR () {
    this.limit = 10
    this.page = 1
    this.employees.splice(0, this.employees.length)
  }

  @Mutation
  PATCH_EMPLOYE (employee: IEmployee) {
    const indexOfEmployee = this.employees.findIndex(el => el.id === employee.id)
    this.employees.splice(indexOfEmployee, 1, employee)
  }

  @Mutation
  async DELETE_EMPLOYE (id: number) {
    const employee = this.employees.find(el => el.id === id)
    if (employee) {
      const index = this.employees.indexOf(employee as IEmployee)
      await deleteEmployee(id)
      this.employees.splice(index, 1)
    }
  }

  @Mutation
  async ADD_NEW_EMPLOYEE () {
    const employee = await getNewEmployee()

    const processedEmployee: IEmployee = {
      name: employee.data.results[0].name.first,
      surname: employee.data.results[0].name.last,
      birthday: new Date(employee.data.results[0].dob.date),
      picture: employee.data.results[0].picture
    }

    const response = await putEmployee(processedEmployee)
    const resultEmployee: IEmployee = response.data

    this.employees.push(resultEmployee)
  }

  @Mutation
  async ON_DELETE_PROFESSION (title: string) {
    // выполняю кусок логики которая должна быть на сервере
    const response = await getEmployees({ professions_like: title })
    const allSortableByTitleEmployees = response.data
    allSortableByTitleEmployees.forEach((employee: IEmployee) => {
      const index = employee!.professions!.findIndex(prof => prof === title)
      employee.professions!.splice(index, 1)
      patchEmployee(employee)
    })

    // на фронте
    this.employees.forEach((employee) => {
      const index = employee!.professions!.findIndex(prof => prof === title)
      employee.professions!.splice(index, 1)
    })
  }

  @Action
  async getEmployeeById (id: number) {
    const response = await getEmployees({ id })
    const employee = response.data[0]
    return employee
  }

  @Action
  async getEmployees (params: IQueryParams): Promise<Array<IEmployee>> {
    const response = await getEmployees(params)
    const resultByParamsEmployees: Array<IEmployee> = response.data
    return resultByParamsEmployees
  }

  @Action
  async patchEmployee (employee: IEmployee) {
    const changingEmployee = employee
    const response = await patchEmployee(changingEmployee)
    const emp: IEmployee = response.data
    this.PATCH_EMPLOYE(emp)
  }
}

export const EmployeesModule = getModule(Employees)
