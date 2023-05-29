import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { State } from '../context/State'
import './tranding.css'
import { Input } from '@mantine/core';
import { AiOutlineSearch } from 'react-icons/ai';


const Random = () => {
  const{imageUrl,query,setQuery,searchMovies,searchTv} = State()
  console.log(imageUrl);
  const[value,setValue] = useState('')
    const handleInputChange = event => {
        setQuery(event.target.value)
        setValue(event.target.value)
        searchMovies()
        searchTv()
        if (event.target.value=='') {
            setResults([])
            setResultst([])
        }
    
      };
  return (
    <div className='  relative tracking-wider text-white justify-evenly   items-center min-h-[300px] w-[100%] flex flex-col object-fill rbg' >
      <img className=' absolute object-cover opacity-75 w-[100%] z-[-1] h-[300px] ' src={imageUrl} alt=""/>
      <div className='  text-center w-[100%]  justify-center items-center flex flex-col gap-[.4rem] ' >
      <h1 className='  font-[700] text-6xl' >Welcome.</h1>
      <p  className=' font-medium text-3xl ' >Millions of movies, TV shows and people to discover. Explore now.</p>
      </div>

      <div className='  relative  flex items-center justify-center    w-[90%]  ' >
      <Input className=' w-[100%]  '  value={value} onChange={handleInputChange}
      icon={<AiOutlineSearch />}
      placeholder="Search for a movie, tv show, person..."
      radius="xl"
    />
        {/* <input value={value} onChange={handleInputChange} className=' border-0 border-[#ffffff] border-none   shadow-md text-[100%] text-[#111111]  w-[90%] rounded-3xl p-[.7rem] ' type="text" name=""  placeholder='Search for a movie, tv show, person...'  /> */}
        <Link to={`/searchresults/${query}`} className=' flex justify-center px-[5%] items-center text-[100%] font-semibold absolute right-[0%] top-[0%] text-center z-999 s-bg w-auto h-[100%] rounded-3xl ' >
          <div>
            Search
          </div>
        </Link>
      </div>
     
    </div>
  )
}

export default Random
