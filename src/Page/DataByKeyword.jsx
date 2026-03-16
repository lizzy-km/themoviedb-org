import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { State } from '../context/State'

const DataByKeyword = () => {

    const {keyword} = useParams()
    const{TvdataByKeyword,setKeywordsS,fetchOvereview,fetchOvereviewTv,setKeywords,MvdataByKeyword} = State()
    console.log(keyword);
    setKeywords(keyword)
    // setKeywordsS(keydords2)

    console.log(MvdataByKeyword);

  return (
    <div className=' flex flex-wrap gap-[1rem] p-[1rem] justify-center ' >
    { 
    MvdataByKeyword &&
    MvdataByKeyword?.map(data =>{
      return(
          <div className=' shadow-lg rounded-lg  ' >
               <div key={data.id}
             className=' relative ovh w-[150px] h-[313px] ' >
            <div className=' z-[1]  blurc object-cover bg-slate-300 rounded-lg min-w-[150px] h-[225px] '   >
              <img loading='lazy' className=' blurc object-cover rounded-t-lg min-w-[150px] h-[225px] '  src={`http://image.tmdb.org/t/p/w500/${data.poster_path}`} alt=""/>
                
            </div>
            <div className=' px-[.2rem] ' >
              <a className=' cursor-pointer hover:text-[#01b4e4] font-[700] text-[1em] ' > {data.title} </a>
              <a className=' cursor-pointer hover:text-[#01b4e4] font-[700] text-[1em] ' > {data.name} </a>
              <p className=' opacity-70 font-medium text-[#111111] ' > {data.release_date} </p>
              
              <p className=' opacity-70 font-medium text-[#111111] ' >  {data.first_air_date} </p>
            </div>
            <Link onClick={()=>{
                      fetchOvereview()

                      fetchOvereviewTv()
                 

            }}  to={`/overeview/${data?.id}`} className=' bg-[#111111] ov tracking-wider cursor-pointer  top-[32%] left-[22%] text-sm font-medium p-[.5rem] rounded-lg absolute z-[9999] ' >
                  <p className=' active-text ' >Overeview</p>
                </Link>
          </div>

          </div>
      )
    })
    }
    {
        TvdataByKeyword && 
        TvdataByKeyword?.map(data =>{
            return(
                <div className=' shadow-lg rounded-lg  ' >
                     <div key={data.id}
                   className=' relative ovh w-[150px] h-[313px] ' >
                  <div className=' z-[1]  blurc object-cover bg-slate-300 rounded-lg min-w-[150px] h-[225px] '   >
                    <img loading='lazy' className=' blurc object-cover rounded-t-lg min-w-[150px] h-[225px] '  src={`http://image.tmdb.org/t/p/w500/${data.poster_path}`} alt=""/>
                      
                  </div>
                  <div className=' px-[.2rem] ' >
                    <a className=' cursor-pointer hover:text-[#01b4e4] font-[700] text-[1em] ' > {data.title} </a>
                    <a className=' cursor-pointer hover:text-[#01b4e4] font-[700] text-[1em] ' > {data.name} </a>
                    <p className=' opacity-70 font-medium text-[#111111] ' > {data.release_date} </p>
                    
                    <p className=' opacity-70 font-medium text-[#111111] ' >  {data.first_air_date} </p>
                  </div>
                  <Link onClick={()=>{
                            fetchOvereview()
      
                            fetchOvereviewTv()
                       
      
                  }}  to={`/overeview/${data?.id}`} className=' bg-[#111111] ov tracking-wider cursor-pointer  top-[32%] left-[22%] text-sm font-medium p-[.5rem] rounded-lg absolute z-[9999] ' >
                        <p className=' active-text ' >Overeview</p>
                      </Link>
                </div>
      
                </div>
            )
          })
    }
  </div>
  )
}

export default DataByKeyword
