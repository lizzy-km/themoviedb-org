import {api} from "../api/apiConfig.js";

export function personApi (type = 'now_playing', method = 'get',page=1) {
    return api.request({
        method: method.toUpperCase(),
        url: `person/${type}?page=${page}`,
    }).then(({data}) => Promise.resolve(data?.results)).catch(err => Promise.reject(err));
}

