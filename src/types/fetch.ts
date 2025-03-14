import { THTTPMethods } from "./commonTypes";

export interface FetchState<T = unknown> {
    data: T;
    isLoading: boolean;
    error: string;
}

export interface FetchAction<T, U> {
  type: T
  payload?: U
}

export interface FetchUtil {
  baseURL?: string;
  method: THTTPMethods,
  urlPath: string,
  body?: RequestBody, 
  headers?: HeadersInit
  abortSignal?: AbortSignal // To pass AbortController
}

export interface RequestBody {
  [key: string]: string | number | Date | RequestBody;
}