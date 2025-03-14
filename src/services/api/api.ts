import { BASE_URL } from '../../config/api.config';
import { FetchUtil } from '../../types/fetch';

const defaultHeaders: HeadersInit = new Headers();
defaultHeaders.append("content-type", "application/json")


// Reusable function for making HTTP requests. Can be used at places like in redux async calls etc.
const fetchUtil = async ({ baseURL =  BASE_URL, urlPath , body, method, headers = defaultHeaders, abortSignal}: FetchUtil)=> {
    try {
        if(!urlPath) throw new Error('urlPath is not valid')
        const options: RequestInit = {
            method: method,
            headers: { ...defaultHeaders, ...headers },
            ...(!!abortSignal && {signal: abortSignal}),
            ...(!!body && { body: JSON.stringify(body) })
        };

        const response = await fetch(`${baseURL}${urlPath}`, options);
        if (!response.ok) {
            throw new Error(`HTTP error status: ${response.status}`);
        }
        
        return await response.json();
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export default fetchUtil;