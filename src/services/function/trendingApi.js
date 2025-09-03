import {api} from "../api/apiConfig.js";

export function trendingApi (type = 'all/day', method = 'get',page=1) {
    return api.request({
        method: method.toUpperCase(),
        url: `trending/${type}?page=${page}`,
    }).then(({data}) => Promise.resolve(data?.results)).catch(err => Promise.reject(err));
}

