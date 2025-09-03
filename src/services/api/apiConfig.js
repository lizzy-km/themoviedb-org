import axios from "axios";

export const base_url = import.meta.env.VITE_BASE_URL
export const key = import.meta.env.VITE_API_KEY

export const api = axios.create({
    baseURL: base_url,
    headers:{
        accept: 'application/json',
        "Authorization": `Bearer ${key}`
    }
})

api.interceptors.request.use((config) => {
    return config;
}, (error) => {
    return Promise.reject(error);
},);