import {api} from "../api/apiConfig.js";

export function discoverApi (type = 'movie', method = 'get',page=1) {
    return api.request({
        method: method.toUpperCase(),
        url: `discover/${type}?page=${page}`,
    }).then(({data}) => Promise.resolve(data?.results)).catch(err => Promise.reject(err));
}

