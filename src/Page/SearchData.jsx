import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { State } from '../context/State'
import './index.css'

const SearchData = () => {
    const {query} = useParams()
    const{sdata,setData,setResults,setResultst,searchMovies,searchTv,setQuery,resultst,results,tv,movies,emptyData} = State()
    setQuery(query)

   const searchData =  <div className=' max-[428px]:flex-col gap-[1rem] flex w-[100%] p-[1rem] ' >
   <div className=' max-[428px]:w-[100%] w-[25%] flex flex-col h-[15rem] rounded-lg border-[1px] ' >
       <div className=' w-[100%] py-[1rem] h-auto rounded-t-lg bg-[#01b4e4] ' >
       <h1 className=' font-medium text-lg px-[1rem] ' >Search Results</h1>

       </div>
       <div className=' flex flex-col gap-[1rem] py-[1rem] h-auto   text-[#111111] ' >
           <div 
           onClick={()=>{
               setResultst([])
               setResults(movies)
               searchMovies()
           }}  className=' cursor-pointer flex justify-between items-center py-[1rem] pr-[1rem] bg-slate-200 ' >
               <p className=' pl-[1rem] ' >Movies</p> 

               <span className=' p-[.2rem] w-[3rem] rounded-2xl text-sm text-white text-center bg-slate-500 ' > 
               {movies?.length} 
               </span>
           </div>

           <div
            onClick={()=>{
               setResults([])
               setResultst(movies)
               searchTv()
           }} 
           className=' cursor-pointer flex justify-between items-center py-[1rem] pr-[1rem] bg-slate-200  ' >
               <p className='pl-[1rem] ' >TV Shows</p> 

               <span className=' p-[.2rem] w-[3rem] rounded-2xl text-sm text-white text-center bg-slate-500 '> 
               {tv?.length} 
               </span>

           </div>
       </div>
   </div>
     <div className=' flex flex-col p-[1rem] gap-[1rem] max-[428px]:w-[100%] w-[75%] ' >
         {
       results?.map(data =>{
           return(
               data ? ( 
                   <div className=' w-[100%] border-[1px] max-[428px]:items-center max-[428px]:justify-center shadow-lg rounded-lg max-h-[141px] max-[428px]:overflow-auto gap-[1rem] flex ' >
                   <Link to={`/overeview/${data.id}`}>
                   <img loading='lazy' className=' blurc object-cover rounded-l-lg min-w-[94px] h-[141px] '  src={`http://image.tmdb.org/t/p/w500/${data.poster_path}`} alt=""/>

                   </Link>
                   <div className=' flex flex-col py-[.7rem]   ' >
                   <Link to={`/overeview/${data.id}`} className=' font-medium text-lg ' > {data.title} </Link>

                   <p> {data.release_date} </p>

                   <p className='  wb overflow-x-auto ' > {data.overview.slice(0,300)}... </p>

                   </div>

               </div>
               ) : ( 
                   <div>
                       
                   </div>
               )
             

           )
       })
   }
   {
           resultst?.map(data =>{
               return(
                   data ? ( 
                       <div className=' w-[100%] border-[1px] shadow-lg rounded-lg h-auto gap-[1rem] flex ' >
                       <Link to={`/overeview/${data.id}`}>
                       <img loading='lazy' className=' blurc object-cover rounded-l-lg min-w-[94px] h-[141px] '  src={`http://image.tmdb.org/t/p/w500/${data.poster_path}`} alt=""/>

                       </Link>
                       <div className=' w-[100%] flex flex-col py-[.7rem]  ' >
                       <Link to={`/overeview/${data.id}`} className=' font-medium text-lg ' > {data.name} </Link>

                       <p> {data.first_air_date} </p>

                       <p className='wb ' > {data.overview.slice(0,300)}... </p>

                       

                       </div>

                   </div>
                   ) : ( 
                       <div>
                           
                       </div>
                   )

               )
           })
   }
</div>
</div>



    console.log(results);
    console.log(resultst);
    useEffect(()=>{
        searchMovies()
        searchTv()
       
    },[])
    
    
  return (
    <div className=' w-[100%] flex flex-col justify-center items-center ' >
       
                {searchData}

            
        
       
    
    </div>
   
    
  
  )
}

export default SearchData
