import {api} from "../api/apiConfig.js";

export function changes24HoursApi (type = 'movie', method = 'get',page=1) {
    return api.request({
        method: method.toUpperCase(),
        url: `${type}/changes?page=${page}`,
    }).then(({data}) => Promise.resolve(data?.results)).catch(err => Promise.reject(err));
}

