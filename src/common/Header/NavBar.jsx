import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import './app.css'
import Search from './Search'
import {AiOutlineSearch} from 'react-icons/ai'
import { State } from '../../context/State'
import {RxHamburgerMenu,RxCross2} from 'react-icons/rx'

const NavBar = () => {

    const showSearch='flex z-[99999] bg-white flex justtify-center pl-[2rem] items-center absolute w-[100%] top-[100%]'
    const hideSearch='none absolute w-[100%] top-[54%]'

    const[search,setSearch] = useState(false)

    // const{handleSubmit,fetchPopular,fetchPopularw,fetchTrending,setQuery} = State()

    function fetchPopularMovie(){

    }

    function fetchPopularTv(){

    }

    function fetchTrending(){

    }

    const mnav ='  max-[428px]:absolute left-[-60%] top-[170%] max-[428px]:pb-[1rem] max-[428px]:px-[1rem]  max-[428px]:text-[#ffffff] max-[428px]:bg-[#0d253f] max-[428px]:w-[26.99rem] max-[428px]:z-[99999]  max-[428px]:flex-col tracking-wider font-semibold text-slate-200 flex gap-[1rem]' 
    const dnav ='  max-[428px]:hidden    tracking-wider font-semibold text-slate-200 flex gap-[1rem]' 
    const omenu = <div onClick={()=>{
        setNav(mnav)
        setCnav(cmenu)
    
     }}  className=' nav-show hidden max-[428px]:flex  ' >
    <RxHamburgerMenu/>
   </div>
   
   const cmenu = <div onClick={()=>{
    setNav(dnav)
    setCnav(omenu)

 }}  className=' nav-show hidden max-[428px]:flex  ' >
   <RxCross2/>
   </div>
 const[nav,setNav] = useState(dnav)




const[cnav,setCnav] = useState(omenu)



 const rel =()=>{
    window.location.reload
 }
  return (
    <div className=' relative w-[100%]  flex flex-col  ' >
        <div className='  w-[100%] h-[64px] bg-[#0d253f] max-[428px]:justify-evenly justify-between flex ' >
        <div className=' ml-[1rem] p-[1rem] gap-[1rem] items-center max-[428px]:flex-row-reverse flex max-[428px]:justify-evenly  justify-between ' >
            <Link onClick={'window.location.reload'} to={'/'} className='h-[5rem] max-[428px]:w-[15rem] w-[10rem] flex items-center justify-center  tmdb  ' >
                    
            </Link>
            <div onClick={rel} className=' relative  max-[428px]:flex-col max-[428px]:w-[3rem]  tracking-wider font-semibold text-slate-200 flex gap-[1rem] ' > 
            {cnav}
            <div className={nav}
            // ' max-[428px]:absolute left-[-60%] top-[170%] max-[428px]:pb-[1rem] max-[428px]:px-[1rem]  max-[428px]:text-[#ffffff] max-[428px]:bg-[#0d253f] max-[428px]:w-[26.99rem] max-[428px]:z-[99999]  max-[428px]:flex-col tracking-wider font-semibold text-slate-200 flex gap-[1rem]   ' 
            >
            <NavLink className=' pl-[2rem] ' onClick={()=>{
                    fetchPopularMovie()
                    window.location.reload
                    
                }} to={'/movies'} >Movies </NavLink>
                <NavLink className=' pl-[2rem] '
                onClick={()=>{
                    fetchPopularTv()
                    window.location.reload

                   
                }}
                to={'/tvshow'} >TV Shows </NavLink>
                <NavLink className=' pl-[2rem] ' to={'/'} >People </NavLink>
                <NavLink className=' pl-[2rem] ' to={'/'} >More </NavLink>
            </div>
               
            </div>
        </div>

        <div className=' cursor-pointer flex justify-center items-center text-slate-50 font-semibold p-[2rem] ' >
            <div onClick={()=>{
                return(
                    setSearch(!search)
                   
                )
               
            }} >
                 
                <AiOutlineSearch onClick={()=>{
                    return(
                        fetchTrending()
                        // setQuery([])
                    )
                }} className=' cursor-pointer  text-[1.6rem]  text-[#01b4e4] ' />

                
               
            </div>

            
        </div>
        </div>
        <div className='flex z-[99999] bg-white justtify-center pl-[2rem] items-center absolute w-[100%] top-[100%]' >
            

        <Search setSearch={setSearch} search={search}  className='search  ' />

        </div>
        
       
        
    </div>
  )
}

export default NavBar