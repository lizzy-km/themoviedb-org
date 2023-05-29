import { createContext, useContext, useEffect, useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

const StateContext = createContext();

export const StateContextProvider = ({children}) =>{

    const[name,setName]=useState()


    const[trdata,setTrdata] = useState([])
    const [trwdata,setTrwdata] = useState([])
    const [trending,setTrending] = useState([])

    const[pudata,setPudata] = useState([])
    const [puwdata,setPuwdata] = useState([])
    const [popular,setPopular] = useState([])
    // console.log(trending);

    useEffect(()=>{
        fetchTrending()
        fetchTrendingW()
        fetchPopular()
        fetchPopularw()
        // fetchOvereview()
    },[])

    const fetchTrending = async()=>{
        const api = await fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=a5abf7e1c956c65d2f3a65f71da4345c`)
        const {results} = await api.json()
        // console.log(results);
        setTrdata(results)
        setTrending(results)
    }

    const fetchTrendingW = async()=>{
        const api = await fetch(`https://api.themoviedb.org/3/trending/all/week?api_key=a5abf7e1c956c65d2f3a65f71da4345c
        `)
        const {results} = await api.json()
        // console.log(results);
        setTrwdata(results)
    }

    const fetchPopular = async()=>{
        const api = await fetch(`https://api.themoviedb.org/3/tv/popular?api_key=a5abf7e1c956c65d2f3a65f71da4345c&language=en-US&page=1`)
        const {results} = await api.json()
        // console.log(results);
        setPudata(results)
        setPopular(results)
    }

    const fetchPopularw = async()=>{
        const api = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=a5abf7e1c956c65d2f3a65f71da4345c&language=en-US&page=1`)
        const {results} = await api.json()
        // console.log(results);
        setPuwdata(results)
    }

    // useEffect(()=>{
    //     fetchOvereview()
    //     fetchOvereviewTv()
    // },[])

    const[id,setId] = useState()
    const[review,setReview] = useState([])
    const[rv,setRv] = useState([])
    const[rt,setRt] = useState([])
    const[mt,setMt] = useState('')
    const fetchOvereview = async ()=>{
        const api = await fetch(`    https://api.themoviedb.org/3/movie/${id}?api_key=a5abf7e1c956c65d2f3a65f71da4345c`)
        const results= await api.json()
        // console.log(results);
        setRv(results)
        setReview(results)
    }

    const fetchOvereviewTv = async ()=>{
        const api = await fetch(`    https://api.themoviedb.org/3/tv/${id}?api_key=a5abf7e1c956c65d2f3a65f71da4345c`)
        const results= await api.json()
        // console.log(results);
        setRt(results)
    }

    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
      fetch(`https://api.themoviedb.org/3/movie/popular?api_key=a5abf7e1c956c65d2f3a65f71da4345c`)
        .then(response => response.json())
        .then(data => {
          const randomIndex = Math.floor(Math.random() * data.results.length);
          setImageUrl(`https://image.tmdb.org/t/p/w1920_and_h600_multi_faces_filter(duotone,00192f,00baff)/${data.results[randomIndex].backdrop_path}`);
        });

    }, [id]);

   

    const[country,setCountry] = useState([])
    const[gen,setGen] = useState([])
    const[er,setEr] = useState([])


    const [cast, setCast] = useState([]);
    const[castv,setCastv] = useState([])


    useEffect(() => {
       
        fetchcast()
        fetchcastTv()

        fetchOvereviewTv()
        fetchOvereview()
        fetchKeyword()
        fetchKeywordt()
        MvR()
        TvR()
        // fetchLanguage()
        // console.log(cast);
    }, [id]);


    const fetchcast = async ()=>{
        const api = await fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=a5abf7e1c956c65d2f3a65f71da4345c`)
        const results= await api.json()
        // console.log(results);
        setCast(results)
    }
    const fetchcastTv = async ()=>{
        const api = await fetch(`https://api.themoviedb.org/3/tv/${id}/credits?api_key=a5abf7e1c956c65d2f3a65f71da4345c`)
        const results= await api.json()
        // console.log(results);
        setCastv(results)
    }
    const[keyword,setKeyword] = useState([])
    const fetchKeyword = async ()=>{
        const api = await fetch(`    https://api.themoviedb.org/3/movie/${id}/keywords?api_key=a5abf7e1c956c65d2f3a65f71da4345c`)
        const {keywords}= await api.json()
        // console.log(keywords);
        setKeyword(keywords)
    }

    const[keywordt,setKeywordt] = useState([])
    const fetchKeywordt = async ()=>{
        const api = await fetch(`    https://api.themoviedb.org/3/tv/${id}/keywords?api_key=a5abf7e1c956c65d2f3a65f71da4345c`)
        const  {results} = await api.json()
        // console.log(results);
        setKeywordt(results)
    }
    const[language,setLanguage] = useState([])
    

    
    const[company,setCompany]=useState([])

    const[lan,setLan] = useState('')
    const[lant,setLant] = useState('')


    const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [resultst, setResultst] = useState([]);
  const[empty,setEmpty] =useState([])

//   console.log(results);
//   console.log(resultst);

  useEffect(()=>{
    searchMovies();
    searchTv()
  },[query])

  const[movies,setMovies] = useState([])
  const[tv,setTv] = useState([])

  const searchMovies = async () => {
    const api = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=a5abf7e1c956c65d2f3a65f71da4345c&query=${query}`);
    const {results} = await api.json()
    setResults(results);
    setMovies(results)
  };

  const searchTv = async () => {
    const api = await fetch(`https://api.themoviedb.org/3/search/tv?api_key=a5abf7e1c956c65d2f3a65f71da4345c&query=${query}`);
    const {results} = await api.json()
    setResultst(results);
    setTv(results)
  };

  

  

  

  const[genre,setGenre] = useState([])
  const[genreId,setGenreId] = useState()
  useEffect(()=>{
    Genre()
  },[genreId])
  const Genre = async () => {
    const api = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=a5abf7e1c956c65d2f3a65f71da4345c&with_genres=${genreId}`);
    const {results} = await api.json()
    // setResultst(results);
    setGenre(results)
    // console.log(results);
  };

  const[gn,setGn] = useState()

  const emptyData = <div className=' h-screen w-[100%] flex justify-center items-center ' >
    <h1 className=' font-semibold text-4xl opacity-75 ' >Search result is empty!</h1>
</div>

const[sdata,setData] = useState(emptyData)

const[mvr,setMvr] = useState([])
const MvR = async () => {
    const api = await fetch(`https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=a5abf7e1c956c65d2f3a65f71da4345c&language=en-US&page=1`);
    const {results} = await api.json()
    // setResultst(results);
    setMvr(results)
    // console.log(results);
  };

  const[tvr,setTvr] = useState([])
const TvR = async () => {
    const api = await fetch(`https://api.themoviedb.org/3/tv/${id}/recommendations?api_key=a5abf7e1c956c65d2f3a65f71da4345c&language=en-US&page=1`);
    const {results} = await api.json()
    // setResultst(results);
    setTvr(results)
    // console.log(results);
  };
  console.log(mvr);
  console.log(tvr);



    const data = {tvr,mvr,emptyData,sdata,setData,gn,setGn,genre,setGenreId,Genre,setResults,setResultst,movies,tv,searchMovies,searchTv,setQuery,empty,setEmpty,resultst,query,results,language,setLanguage,keywordt,keyword,lant,setLant,lan,setLan,company,setCompany,castv,cast,er,setEr,gen,setGen,country,setCountry,id,mt,setMt,imageUrl,rv,rt,review,setReview,setId,name,setName,trending,setTrending,trdata,fetchTrending,fetchTrendingW,trwdata,popular,pudata,puwdata,setPopular,fetchPopular,fetchPopularw,fetchOvereview,fetchOvereviewTv}

    return(
        <StateContext.Provider value={data} >
            {children}
        </StateContext.Provider>
    )
}

export const State =()=> useContext(StateContext)