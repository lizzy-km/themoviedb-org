import {api} from "../api/apiConfig.js";

export function tvSeriesApi (type = 'airing_today', method = 'get',page=1) {
    return api.request({
        method: method.toUpperCase(),
        url: `tv/${type}?page=${page}`,
    }).then(({data}) => Promise.resolve(data?.results)).catch(err => Promise.reject(err));
}

