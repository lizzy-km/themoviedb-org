import {create} from "zustand";

export const DataStore = create((set)=>({
    // Changes
    changesMovieList:[],
    changesTVList:[],
    changesPeopleList:[],

    // Discover
    discoverMovieList:[],
    discoverTVList:[],

    //Genres
    movieGenreList:[],
    tvGenreList:[],

    //Keywords
    keywordsDetail:[],

    //MovieList
    movieNowPlayingList:[],
    moviePopularityList:[],
    movieTopRatedList:[],
    movieUpComingList:[],

    //Movie
    movieDetail:{},
    movieAlternative:{},
    movieChanges:{},
    movieCredits:{},
    movieExternalId:{},
    movieImages:{},
    movieKeywords:{},
    movieLatest:{},
    movieList:[],
    movieRecommend:[],
    movieReleaseDate:{},
    movieReviewList:[],
    movieSimilarList:[],
    movieTranslation:[],


    //People

    popularPeopleList:[],
    peopleDetail:{},
    peopleChanges:[],
    combinedCreditsByPeople:[],
    externalIdOfPeople:[],
    peopleImages:[],
    latestPeopleList:[],
    moviesByPeople:[],
    tvByPeople:[],

    //Review
    review:{},



}));