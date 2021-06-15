import { AxiosResponse } from 'axios'
import { request } from '~/middleware/request'
import { IEmployee } from '~/models/employee'
import { IQueryParams } from '~/models/query-params'

export async function getNewEmployee () : Promise<AxiosResponse> {
  return await request('get', '/api/', undefined, undefined, { dataType: 'json' })
}

export async function putEmployee (data: IEmployee) : Promise<AxiosResponse> {
  return await request('post', '/jsonserver/users/', data)
}

export async function patchEmployee (data: IEmployee) : Promise<AxiosResponse> {
  return await request('patch', `/jsonserver/users/${data.id}`, data)
}

export async function getEmployees (params: IQueryParams) : Promise<AxiosResponse> {
  return await request('get', '/jsonserver/users/', undefined, params)
}

export async function deleteEmployee (id: number): Promise<AxiosResponse> {
  return await request('delete', `/jsonserver/users/${id}`)
}
