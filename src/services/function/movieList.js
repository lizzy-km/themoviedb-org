import {api} from "../api/apiConfig.js";

export function movieListApi (type = 'now_playing', method = 'get',page=1) {
    return api.request({
        method: method.toUpperCase(),
        url: `movie/${type}?page=${page}`,
    }).then(({data}) => Promise.resolve(data?.results)).catch(err => Promise.reject(err));
}

