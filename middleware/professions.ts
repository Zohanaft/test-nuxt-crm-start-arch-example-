import { AxiosResponse } from 'axios'
import { request } from '~/middleware/request'
import { IProfession } from '~/models/profession'
import { IQueryParams } from '~/models/query-params'

export async function putProfession (data: IProfession) : Promise<AxiosResponse> {
  return await request('post', '/jsonserver/professions/', data)
}

export async function patchProfession (data: IProfession) : Promise<AxiosResponse> {
  return await request('patch', `/jsonserver/professions/${data.id}`, data)
}

export async function getProfessions (params: IQueryParams) : Promise<AxiosResponse> {
  return await request('get', '/jsonserver/professions/', undefined, params)
}

export async function deleteProfession (id: number): Promise<AxiosResponse> {
  return await request('delete', `/jsonserver/professions/${id}`)
}
