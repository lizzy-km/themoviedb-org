import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { State } from '../context/State'
import './index.css'

const Genre = () => {
    const {id} = useParams()
    const{setGenreId,genre,gn} = State()
    setGenreId(id)
    // Genre()
    console.log(genre);
  return (
    <div className=' flex flex-col justify-center items-center ' >
        <div className='   flex items-center bg-[#0d253f] rounded-b-lg font-[700] w-[90%] p-[1rem] justify-center border-b-2 border-[#0d253f]  text-lg ' >
            <h1 className='active-text text-shadow ' > {gn} </h1>
        </div>
        <div className=' justify-center flex w-[100%] flex-wrap p-[1rem] gap-[1rem] ' >
       {genre?.map(data =>{
        return(
            <div className=' shadow-lg rounded-lg  ' >
                 <div key={data.id}
               className=' relative ovh w-[150px] h-[313px] ' >
              <div className=' z-[1]  blurc object-cover bg-slate-300 rounded-lg min-w-[150px] h-[225px] '   >
                <img loading='lazy' className=' blurc object-cover rounded-t-lg min-w-[150px] h-[225px] '  src={`http://image.tmdb.org/t/p/w500/${data.poster_path}`} alt=""/>
                  
              </div>
              <div className=' px-[.2rem] ' >
                <a className=' cursor-pointer hover:text-[#01b4e4] font-[700] text-[1em] ' > {data?.title?.slice(0,20)} </a>
                <a className=' cursor-pointer hover:text-[#01b4e4] font-[700] text-[1em] ' > {data?.name?.slice(0,20)} </a>
                <p className=' opacity-70 font-medium text-[#111111] ' > {data.release_date} </p>
                
                <p className=' opacity-70 font-medium text-[#111111] ' >  {data.first_air_date} </p>
              </div>
              <Link onClick={()=>{
                        fetchOvereview()

                        fetchOvereviewTv()
                   

              }}  to={`/overeview/${data.id}`} className=' bg-[#111111] ov tracking-wider cursor-pointer  top-[32%] left-[22%] text-sm font-medium p-[.5rem] rounded-lg absolute z-[9999] ' >
                    <p className=' active-text ' >Overeview</p>
                  </Link>
            </div>

            </div>
        )
      })}
    </div>
    </div>
   
  )
}

export default Genre
