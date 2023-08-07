import { Input } from '@mantine/core';
import React, { useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { State } from '../../context/State'

const Search = ({setSearch,hideSearch}) => {
    const{setResultst,setResults,handleSubmit,query,setQuery,results,resultst,trdata,searchMovies,searchTv} = State()
  

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
    <div className=' relative flex items-center z-[9999]  w-[100%] ' >
        <Link onClick={'window.location.reload'} to={`/searchresults/${query}`} className=' p-[1rem] ' >
            <AiOutlineSearch  className=' mr-[.7rem] text-lg font-[800] text-[#111111] ' />

            </Link>
        <div className=' tracking-wider w-[100%] flex z-[999999]  justify-center items-center h-[45px] bg-[#ffffff] ' >
        <Input  className=' w-[95%] bg-[#ffffff]  '  value={value} onChange={handleInputChange}
    //   icon={<AiOutlineSearch />}
      variant="filled"
      placeholder="Search for a movie, tv show, person..."
      radius="xs"
    />
      {/* <input value={value} onChange={handleInputChange} className=' mr-[1rem] font-sans cursor-text active:border-0 focus-within:border-0 focus:border-0 valid:border-0 h-[100%] text-[#111111] w-[95%]  bg-[#ffffff] '  type="" name="" placeholder='Search for a movie, tv show, person...' /> */}
      <div className=' cursor-pointer font-semibold mr-[2rem]   h-[100%] text-center flex justify-center items-center ' >
        <div className=' text-[#01b4e4] ' onClick={()=>{
            setSearch(hideSearch)
        }} >
            X
        </div>
      </div>

    </div>
    <div className=' absolute top-[100%] max-h-[20rem] overflow-auto flex flex-col gap-[.5rem] bg-[#ffffff] w-[100%] p-[1rem] ' >
       {
        query ? (
            <div className=' flex flex-col gap-[.4rem] ' >
                  {
                results?.map(data =>{
                    return(
                        <Link key={data?.id} onClick={'window.location.reload'} className=' p-[.2rem] ' to={`/searchresults/${data.title}`} > {data.title} </Link>
    
                    )
                })
            }
            {
                    resultst?.map(data =>{
                        return(
                            <Link key={data?.id} onClick={'window.location.reload'} className=' p-[.2rem] ' to={`/searchresults/${data.name}`}> {data.name} </Link>
        
                        )
                    })
            }
            </div>
          
         ) : ( 
            <div   className=' flex flex-col gap-[1rem] ' >
                <div>
                    <h1 className=' font-semibold text-lg ' > Trending </h1>
                </div>
                {
                    
                    trdata?.map(data =>{
                        {
                            return(
                                data.original_name ? (
                                    <Link key={data?.id} onClick={'window.location.reload'} to={`/searchresults/${data.original_name}`} > {data.original_name} </Link>
                                 ) : data.title ? ( 
                                    <div>
                                                                            <Link onClick={'window.location.reload'} to={`/searchresults/${data.title}`} > {data.title} </Link>

                                    </div>
                                ) : data?.name ? (
                                    <div  key={data?.id}>
                                                                            <Link onClick={'window.location.reload'} to={`/searchresults/${data.name}`} > {data.name} </Link>

                                    </div>
                                ) : (
                                    <div  key={data?.id} >
                                        
                                    </div>
                                )
                            )
                        }

                        
                        
                            
                           
                           
                        
                    })
                }
            </div>
        )
       }
        
    </div>
    </div>
    
  )
}

export default Search
