import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { State } from '../context/State'
import './tranding.css'

const WhatPopular = () => {
  const oc = 'cursor-pointer bg-[#111111] font-medium text-[1em] w-[5rem] h-[2rem] flex items-center justify-center rounded-2xl'
  const nc ='cursor-pointer font-medium text-[1em] w-[5rem] h-[2rem] flex items-center justify-center rounded-2xl'
  const ocw = 'cursor-pointer bg-[#111111] font-medium text-[1em] w-[8rem] h-[2rem] flex items-center justify-center rounded-2xl'
  const ncw ='cursor-pointer font-medium text-[1em] w-[8rem] h-[2rem] flex items-center justify-center rounded-2xl'
  const at =' cursor-pointer active-text'
  const nat=' cursor-pointer text-[#111111]'
  const[active,setActive]=useState(at)
  const[activew,setActivew]=useState(nat)
  const[tnd,setTnd]=useState(oc)
  const[tndd,setTndd]=useState(ncw)



  const {popular,pudata,puwdata,setPopular,fetchPopular,fetchPopularw,rv,rt,setReview,mt,setMt} = State()
  // console.log(popular);
  return (
    <div className=' px-[3rem] py-[2rem] gap-[1rem] tranding flex flex-col w-[100%] h-[28rem] ' >


      <div className=' flex items-center gap-[1.5rem] ' >
        <h1 className=' text-[1.5em] font-[600] ' >What,s Popular</h1>
        <div className=' flex items-center border-[1px] border-blue-900 rounded-3xl' >
          <div onClick={()=>{
            setTnd(oc)
            setTndd(ncw)
          }} className={tnd} >
          <a onClick={()=>{
            setActive(at)
            setActivew(nat)
            setPopular(pudata)
          }}
          className={active} >On TV</a>
          </div>
          <div onClick={()=>{
            setTndd(ocw)
            setTnd(nc)
          }}
           className={tndd} >
          <a onClick={()=>{
            setActive(nat)
            setActivew(at)
            setPopular(puwdata)
          }}
           className={activew} >In Theaters</a>
          </div>
          
          
        </div>
      </div>

      <div className=' rounded-lg flex gap-[1rem] overflow-x-auto overflow-y-hidden ' >
        {
          popular?.map(data =>{
            return(
              <div key={data.id} className=' relative ovh w-[150px] h-[313px]  ' >
              <div className=' blurc bg-slate-300 object-cover rounded-lg min-w-[150px] h-[225px] '   >
                {
                  data.poster_path ? (                <img loading='lazy' className=' object-cover rounded-lg min-w-[150px] h-[225px] '  src={`http://image.tmdb.org/t/p/w500/${data?.poster_path}`} alt=""/>
                  ) : (                <img loading='lazy' className=' object-cover rounded-lg min-w-[150px] h-[225px] '  src={`http://image.tmdb.org/t/p/w500/${data?.backdrop_path}`} alt=""/>
                  )
                }

              </div>
              <div>
              <a className=' cursor-pointer hover:text-[#01b4e4] font-[700] text-[1em] ' > {data.title} </a>
                <a className=' cursor-pointer hover:text-[#01b4e4] font-[700] text-[1em] ' > {data.name} </a>
                <p className=' opacity-70 font-medium text-[#111111] ' > {data.release_date} </p>
                
                <p className=' opacity-70 font-medium text-[#111111] ' >  {data.first_air_date} </p>
              </div>
              <Link onClick={()=>{
                // setId(data.id)
                // const id = data.id;

                    if(data.media_type=="movie"){

                        setMt('movie')
                        // fetchOvereview()

                    }
                    if (data.media_type=="tv") {
                        setMt('tv')
                        // fetchOvereviewTv()
                    }
                // setId(id)
                // fetchOvereview()

              }}  to={`/overeview/${data.id}`} className=' bg-[#111111] ov tracking-wider cursor-pointer  top-[32%] left-[22%] text-sm font-medium p-[.5rem] rounded-lg absolute z-[9999] ' >
                    <p className=' active-text ' >Overeview</p>
                  </Link>
            </div>
            )
          })
        }
        
      </div>
     
    </div>
  )
}

export default WhatPopular
