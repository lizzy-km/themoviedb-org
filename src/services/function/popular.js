import {api} from "../api/apiConfig.js";

export function popularApi(type,method) {
    return api.request({
        method,
        url:`popular/${type}`,
    }).then(({data}) => Promise.resolve(data?.results)).catch(err => Promise.reject(err));
}