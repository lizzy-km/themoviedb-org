import React from 'react'
import { Link } from 'react-router-dom'
import { State } from '../context/State'

const Tcard = ({data,name}) => {
    // const {setId,fetchOvereview,fetchOvereviewTv,rv,rt,setReview,mt,setMt} = State()

    const id = data?.id;

  return (
    <div key={id}
               className=' relative ovh w-[150px] h-[313px] ' >
              <div className=' z-[1]  blurc object-cover bg-slate-300 rounded-lg min-w-[150px] h-[225px] '   >
                <img loading='lazy' className=' blurc object-cover rounded-lg min-w-[150px] h-[225px] '  src={`http://image.tmdb.org/t/p/w500/${data.poster_path}`} alt=""/>
                  
              </div>
              <div>
                <a className=' cursor-pointer hover:text-[#01b4e4] font-[700] text-[1em] ' > {data?.title} </a>
                <a className=' cursor-pointer hover:text-[#01b4e4] font-[700] text-[1em] ' > {data?.name} </a>
                <p className=' opacity-70 font-medium text-[#111111] ' > {data?.release_date} </p>
                
                <p className=' opacity-70 font-medium text-[#111111] ' >  {data?.first_air_date} </p>
              </div>
              <Link onClick={()=>{
                        // fetchOvereview()
                        //
                        // fetchOvereviewTv()
                   

              }}  to={`/overeview/${id}`} className=' bg-[#111111] ov tracking-wider cursor-pointer  top-[32%] left-[22%] text-sm font-medium p-[.5rem] rounded-lg absolute z-[9999] ' >
                    <p className=' active-text ' >Overeview</p>
                  </Link>
            </div>
  )
}

export default Tcard
