import axios from 'axios';

export type Headers = NonNullable<Parameters<typeof axios.post>[2]>['headers'];
export type HttpResponse<T> = axios.AxiosResponse<T>;

export const HttpProvider = Symbol('Http');
export type HttpProvider = typeof axios;
