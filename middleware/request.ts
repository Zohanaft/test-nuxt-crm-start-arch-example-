import Axios, { AxiosResponse } from 'axios'

interface Params {
  [key: string]: unknown;
}

export async function request (
  method: string,
  url: string | undefined,
  data?: object | string | ArrayBuffer,
  params?: object,
  headers?: object,
  responseType?: string
): Promise<AxiosResponse> {
  const axiosArguments: Params = {
    method,
    url,
    data,
    params,
    headers,
    responseType
  }
  return await Axios(axiosArguments)
}
