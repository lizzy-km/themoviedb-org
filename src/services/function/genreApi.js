import {api} from "../api/apiConfig.js";

export function genreApi (type = 'movie', method = 'get') {
    return api.request({
        method: method.toUpperCase(),
        url: `genre/${type}/list`,
    }).then(({data}) => Promise.resolve(data?.results)).catch(err => Promise.reject(err));
}

