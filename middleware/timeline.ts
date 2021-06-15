import { AxiosResponse } from 'axios'
import { request } from '~/middleware/request'
import { ITimeline } from '~/models/timeline'

export async function putTimeline (data: ITimeline) : Promise<AxiosResponse> {
  return await request('post', '/jsonserver/timeline/', data)
}

export async function patchTimeline (data: ITimeline) : Promise<AxiosResponse> {
  return await request('patch', `/jsonserver/timeline/${data.id}`, data)
}

export async function getTimeline () : Promise<AxiosResponse> {
  return await request('get', '/jsonserver/timeline/', undefined)
}

export async function deleteTimeline (id: number): Promise<AxiosResponse> {
  return await request('delete', `/jsonserver/timeline/${id}`)
}
