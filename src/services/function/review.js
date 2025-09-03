import {api} from "../api/apiConfig.js";

export function reviewApi (type = 'rid', method = 'get') {
    return api.request({
        method: method.toUpperCase(),
        url: `review/${type}`,
    }).then(({data}) => Promise.resolve(data?.results)).catch(err => Promise.reject(err));
}

