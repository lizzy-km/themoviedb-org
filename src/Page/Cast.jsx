import React from 'react'
import { Link } from 'react-router-dom'

const Cast = ({data}) => {
  return (
    <div className='  shadow-lg rounded-md w-[138.667px] h-[254.334px] ' >
      <div className='w-[138px] h-[175px] object-cover rounded-lg ' >
        {
            data?.profile_path ? (
                <img className='w-[138px] h-[175px] object-cover rounded-t-lg ' src={`http://image.tmdb.org/t/p/w500/${data?.profile_path}`} alt=""/>

            ) : (
                <div className='w-[138px] bg-[#dbdbdb] np h-[175px] object-cover rounded-t-lg ' >
                    
                </div>
            )
        }
      </div>
      <div className=' px-[.5rem] text-[1em]  ' >
        <Link className=' hover:opacity-70 font-medium text-[1em] ' > {data?.name} </Link>
        <p className=' text-[.8em] font-medium ' > {data?.character} </p>
      </div>
    </div>
  )
}

export default Cast
