import {useMutation} from "@tanstack/react-query";
import {trendingApi} from "../function/trendingApi.js";
import {changes24HoursApi} from "../function/changes24HoursApi.js";
import {discoverApi} from "../function/discoverApi.js";
import {genreApi} from "../function/genreApi.js";
import {keywordApi} from "../function/keywordApi.js";
import {movieListApi} from "../function/movieList.js";
import {personApi} from "../function/personApi.js";
import {reviewApi} from "../function/review.js";
import {searchApi} from "../function/searchApi.js";
import {tvSeriesApi} from "../function/tvSeriesApi.js";

export function useGetTrending (type,method,page) {


    return useMutation({
        mutationKey: `trending/${type}`,
        mutationFn:()=> trendingApi(type,method,page),
        onError: (error) => {

            console.log("Error getting trending:", error);
        },

    });
}

export function useGetDiscover (type,method,page) {


    return useMutation({
        mutationKey: `discover/${type}`,
        mutationFn:()=> discoverApi(type,method,page),
        onError: (error) => {

            console.log("Error getting discover:", error);
        },

    });
}

export function useGetGenre (type,method) {


    return useMutation({
        mutationKey: `genre/${type}`,
        mutationFn:()=> genreApi(type,method),
        onError: (error) => {

            console.log("Error getting genre:", error);
        },

    });
}

export function useGetByKeyword (id,method) {


    return useMutation({
        mutationKey: `keyword/${id}`,
        mutationFn:()=> keywordApi(id,method),
        onError: (error) => {

            console.log("Error getting keyword:", error);
        },

    });
}

export function useGetMovieList (type,method,page) {


    return useMutation({
        mutationKey: `movieList/${type}`,
        mutationFn:()=> movieListApi(type,method,page),
        onError: (error) => {

            console.log("Error getting movie list:", error);
        },

    });
}

export function useGetPerson (type,method,page) {


    return useMutation({
        mutationKey: `person/${type}`,
        mutationFn:()=> personApi(type,method,page),
        onError: (error) => {

            console.log("Error getting person:", error);
        },

    });
}

export function useGetReview (type,method) {


    return useMutation({
        mutationKey: `review/${type}`,
        mutationFn:()=> reviewApi(type,method),
        onError: (error) => {

            console.log("Error getting review:", error);
        },

    });
}

export function useSearchData (type,query,page) {


    return useMutation({
        mutationKey: `search/${type}`,
        mutationFn:()=> searchApi(type,query,page),
        onError: (error) => {

            console.log("Error getting search:", error);
        },

    });
}

export function useGetTVSeries (type,method,page) {


    return useMutation({
        mutationKey: `tv/${type}`,
        mutationFn:()=> tvSeriesApi(type,method,page),
        onError: (error) => {

            console.log("Error getting tv:", error);
        },

    });
}

export function useGet24Changes (type,method,page) {


    return useMutation({
        mutationKey: `changes/${type}`,
        mutationFn:()=> changes24HoursApi(type,method,page),
        onError: (error) => {

            console.log("Error getting 24Hours Changes:", error);
        },

    });
}
