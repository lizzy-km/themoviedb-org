import {api} from "../api/apiConfig.js";

export function searchApi (type = 'movie',query,page=1) {
    return api.request({
        method: 'GET',
        url: `search/${type}?query=${query}&page=${page}`,
    }).then(({data}) => Promise.resolve(data?.results)).catch(err => Promise.reject(err));
}

