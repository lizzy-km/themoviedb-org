import {api} from "../api/apiConfig.js";

export function keywordApi (id = 0, method = 'get',page=1) {
    return api.request({
        method: method.toUpperCase(),
        url: `keyword/${id}?page=${page}`,
    }).then(({data}) => Promise.resolve(data?.results)).catch(err => Promise.reject(err));
}

