import React, { useState } from 'react'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { Link } from 'react-router-dom'
import { State } from '../context/State'
import Cast from './Cast'
import Recom from './Recom'
import Right from './Right'
import './index.css'
import { useMediaQuery } from 'react-responsive'

const Review = ({castv,cast,review,rt,country,gen,er,minutesToHours,min,mt,company,setCompany}) => {

    const{setGn,tvr,mvr} = State()
    const castData = cast.cast

    console.log(tvr?.length);
    console.log(mvr?.length);

    console.log(tvr);
    console.log(mvr);


    const castCrew = cast.crew

    // console.log(castCrew);

    const castDatav = castv.cast

    // console.log(castDatav);

    const castCrewv = castv.crew

    // console.log(castCrewv);

//  console.log(review);

    const nhc =()=>{
        setHeart(ch)
    }
    const chc =()=>{
        setHeart(nh)
    }
    
    const nh = <AiOutlineHeart
    onClick={nhc}
     className=' w-[1rem] cursor-pointer ' />
    const ch = <AiFillHeart
    onClick={chc}
     className=' text-[#01b4e4] ' />

     const[heart,setHeart] = useState(nh)

    //  console.log(review);
    //  console.log(rt);


     if (review.id) {
        setCompany(review?.production_companies)

     }
     else{
        setCompany(rt?.production_companies)

     }

    //  console.log(company);

    const isMobile = useMediaQuery({ query: '(max-width: 767px)' })
    const isTablet = useMediaQuery({ query: '(min-width: 768px) and (max-width: 991px)' })
    const isDesktop = useMediaQuery({ query: '(min-width: 992px)' })

    if (isDesktop) {
        return (
            <div className=' flex flex-col gap-[2rem] w-[100%] ' >
                {
                    review?.id ? ( 
                        <><div className=' p-[2rem] ovbg relative flex max-[428px]:bgr  max-[428px]:flex-col w-[100%] h-[510px] max-[428px]:h-auto  text-2xl text-[#f0f0f0] '>
                            {
                                review.backdrop_path!==null ? (                       <img loading='lazy' className='  top-[0%] max-[428px]:left-[9%] left-[0%] brightness-[.2] max-[428px]:w-[390px] max-[428px]:h-[175px]    saturate-150 absolute w-[100%] h-[510px] object-cover z-[-1] ' src={`http://image.tmdb.org/t/p/w1920_and_h800_multi_faces/${review?.backdrop_path}`} alt="" />
                                ) : (
                                    <div loading='lazy' className=' bg-[#01b4e4] max-[428px]:w-[390px] max-[428px]:h-[175px] max-[428px]:left-[9%]    top-[0%] left-[0%] brightness-[.2]  saturate-150 absolute w-[100%] h-[510px] object-cover z-[-1] '  />
        
                                 )
                            }
                              <div className='  bg-slate-700 ml-[-2rem]  max-[428px]:w-[90px] max-[428px]:h-[135px]  h-[450px] w-[300px] rounded-lg shadow-lg  '>
                                  {review.poster_path ? (
                                  <img loading='lazy' className=' max-[428px]:min-w-[90px] max-[428px]:h-[135px]  object-cover rounded-lg min-w-[300px] h-[450px] ' src={`http://image.tmdb.org/t/p/w500/${review?.poster_path}`} alt="" />
                                  ) : (
                                  <img loading='lazy' className=' max-[428px]:min-w-[90px] max-[428px]:h-[135px]  object-cover rounded-lg min-w-[300px] h-[450px] ' src={`http://image.tmdb.org/t/p/w500/${review?.backdrop_path}`} alt="" />
                                  )}
                              </div>
                              <div className=' max-[428px]:text-[#111111]  w-[428px]:bgr max-[428px]:h-auto px-[2rem] py-[1rem] '>
                                  <div className=' max-[428px]:w-[100%] flex flex-col '>
                                      <h1 className=' text-4xl font-[700] flex '> {review?.original_title} {review?.original_name} (<p className='max-[428px]:text-[#111111] text-[#c4c4c4e7] font-normal '> {review?.first_air_date?.split('', 4)} {review?.release_date?.split('', 4)}</p> )
                                      </h1>
                                      <div className='max-[428px]:text-[#111111] max-[428px]:flex-col flex font-medium text-[1.1rem] items-center  tracking-wider py-[.5rem] '>
                                          {/* {mt !== 'movie' ? ( */}
                                              {/* <div className=' px-[.2rem] h-[1.5rem] flex items-center justify-center opacity-75 border-[1.5px] rounded-sm '>
                                                  <p className=' text-center font-medium  '>TV/MA</p>
        
                                              </div> */}
                                        {/* //   ) : ( */}
                                              <div className=' flex ' ><p>
                                                  { review?.release_date} {review?.first_air_date}
                                              </p><p>(
                                                      {country?.map(data => {
                                                          return (
                                                              data?.iso_3166_1
                                                          )
                                                      })}
                                                  </p>)</div>
        
                                        {/* //   )} */}
        
                                          - {gen?.map(data => {
                                              return (
                                                  <Link onClick={()=>{
                                                    setGn(data.name)
                                                  }} to={`/genre/${data?.id}`} className=' px-[.2rem] '> {data.name},</Link>
                                              )
                                          })}
                                          <p> - {review?.runtime ? (
                                              minutesToHours(min)
                                          ) : (
                                              er?.map(data => {
                                                  return (
                                                      data + 'm'
                                                  )
                                              })
                                          )} </p>
                                      </div>
        
                                      <div className=' text-[#ffffff] w-[3rem] flex items-center justify-center rounded-full h-[3rem] bg-slate-900 '>
                                          {heart}
                                      </div>
        
                                      <div className=' pt-[1rem] text-[1.1rem] max-[428px]:text-[#111111] tag font-medium text-[#b4b4b4] '>
                                          {review?.tagline}
                                      </div>
        
        
                                      <div>
                                          <h1 className=' font-semibold max-[428px]:w-[100%] max-[428px]:flex justify-center items-center max-[428px]:text-lg '>Overview</h1>
                                          <p className=' text-sm leading-6 '> {review?.overview} </p>
        
                                      </div>
                                             {
                                                company &&  <div className=' flex gap-[1rem] mt-[4rem] text-center  ' >
                                                <div className=' flex items-center ' >
                                                <p> Production by</p>
                
                                                </div>
                                               
                                                {
                                                    company?.map(data =>{
                                                        return(
                                                            <div className=' bg-[#ffffff] flex items-center rounded-lg ' >
                                                                <img className=' w-[4rem] rounded-lg p-[.2rem] '  src={`http://image.tmdb.org/t/p/w500/${data?.logo_path}`} alt=""/>
                                                            </div>
                                                        )
                                                    })
                                                }
                                              </div>
                                             }   
                                     
        
        
        
                                  </div>
        
                              </div>
        
                          </div>
                          <div className=' w-[100%] h-auto max-[428px]:flex-col  justify-evenly flex gap-[1rem] '>
                            <div className=' flex flex-col max-[428px]:w-[100%] w-[70%] gap-[1rem] ' >
                            <div className=' px-[1rem] ' >
                                <h1 className=' font-medium text-xl ' >Cast</h1>
                            </div>
                                  <div className='p-[1rem] w-[100%] flex overflow-x-auto overflow-y-hidden gap-[1rem] '>
                                      {castData?.map(data => {
                                          return (
                                              <Cast data={data} key={data.id} />
        
                                          )
                                      })}
                                  </div>
                            </div>
                           
        
                                  <div className='w-[30%] max-[428px]:w-[100%] flex felx-col '>
                                  <Right review={review} rt={rt} />
        
                                  </div>
                              </div>
        
                              {
                                    mvr?.length &&
                                    <div className=' flex flex-col gap-[1rem] p-[1rem] ' >
                                    <div className=' flex font-medium text-xl ' >
                                        <h1>Recommendations</h1>
                                    </div>
                                    <div className=' flex max-[428px]:w-[100%] w-[70%] overflow-x-auto gap-[1rem] ' >
                                   <Recom  />
                                  </div>
        
                                  </div>
                                 
                                  }
        
                             </>
                    ) : ( 
                        <><div className=' p-[2rem] ovbg relative flex max-[428px]:bgr  max-[428px]:flex-col  w-[100%] h-[510px]  text-2xl text-[#f0f0f0] '>
                            {
                                rt?.backdrop_path !==null ? (
                                    <img loading='lazy' className='max-[428px]:w-[390px] max-[428px]:h-[175px] max-[428px]:left-[9%]  top-[0%] left-[0%] brightness-[.3]  saturate-150 absolute w-[100%] h-[510px] object-cover z-[-1] ' src={`http://image.tmdb.org/t/p/w1920_and_h800_multi_faces/${rt?.backdrop_path}`} alt="" />
        
                                 ) : ( 
                                    <div className=' bg-[#01b4e4] max-[428px]:w-[390px] max-[428px]:h-[175px] max-[428px]:left-[9%]  top-[0%] left-[0%] brightness-[.3]  saturate-150 absolute w-[100%] h-[510px] object-cover z-[-1] '  >
                                        
                                    </div>
                                 )
                            }
                                  <div className=' ml-[-2rem] bg-slate-700 max-[428px]:w-[90px] max-[428px]:h-[135px]   h-[450px] w-[300px] rounded-lg shadow-lg  '>
                                      {
                                      rt.poster_path ? (
                                      <img loading='lazy' className=' max-[428px]:min-w-[90px] max-[428px]:h-[135px]  object-cover rounded-lg min-w-[300px] h-[450px] ' src={`http://image.tmdb.org/t/p/w500/${rt?.poster_path}`} alt="" />
                                      ) : (
                                      <img loading='lazy' className=' max-[428px]:min-w-[90px] max-[428px]:h-[135px]  object-cover rounded-lg min-w-[300px] h-[450px] ' src={`http://image.tmdb.org/t/p/w500/${rt?.backdrop_path}`} alt="" />
                                      )}
                                  </div>
                                  <div className=' max-[428px]:w-[100%] w-[428px]:bgr max-[428px]:h-auto px-[2rem] py-[1rem] '>
                                      <div className=' flex flex-col max-[428px]:w-[100%] '>
                                          <h1 className=' text-4xl font-[700] flex '> {rt?.original_title} {rt?.original_name} (<p className=' max-[428px]:w-[100%] max-[428px]:text-[#111111] text-[#c4c4c4e7] font-normal '> {rt?.first_air_date?.split('', 4)} {rt?.release_date?.split('', 4)}</p> )
                                          </h1>
                                          <div className='max-[428px]:text-[#111111] max-[428px]:w-[100%] max-[428px]:flex-col flex font-medium text-[1.1rem] items-center  tracking-wider py-[.5rem] '>
                                              
                                                  <div className='max-[428px]:text-[#111111] px-[.2rem] h-[1.5rem] flex items-center justify-center opacity-75 border-[1.5px] rounded-sm '>
                                                      <p className=' text-center font-medium  '>TV/MA</p>
        
                                                  </div>
                                            
        
                                              - {gen?.map(data => {
                                              return (
                                                  <Link onClick={()=>{
                                                    setGn(data?.name)
                                                  }} to={`/genre/${data?.id}`} className=' px-[.2rem] '> {data.name},</Link>
                                              )
                                          })}
                                              <p> - {rt?.runtime ? (
                                                  minutesToHours(min)
                                              ) : (
                                                  er?.map(data => {
                                                      return (
                                                          data + 'm'
                                                      )
                                                  })
                                              )} </p>
                                          </div>
        
                                          <div className='  text-[#ffffff]  w-[3rem] flex items-center justify-center rounded-full h-[3rem] bg-slate-900 '>
                                              {heart}
                                          </div>
        
                                          <div className=' max-[428px]:text-[#111111] pt-[1rem] text-[1.1rem] tag font-medium text-[#b4b4b4] '>
                                              {rt?.tagline}
                                          </div>
        
                                          <div>
                                              <h1 className=' font-semibold max-[428px]:text-lg max-[428px]:w-[100%] max-[428px]:flex justify-center items-center '>Overview</h1>
                                              <p className=' text-sm leading-6 '> {rt?.overview} </p>
        
                                          </div>
                                                   {
                                                    company &&  <div className=' flex gap-[1rem] mt-[2rem] text-center  ' >
                                                    <div className=' flex items-center font-semibold' >
                                                    <p> Production by</p>
                    
                                                    </div>
                                                   
                                                    {
                                                        company?.map(data =>{
                                                            return(
                                                                
                                                                    data?.logo_path ? (
                                                                        <div className='  bg-[#ffffff] flex items-center rounded-lg ' >
                                                                        <img className=' w-[4rem] rounded-lg p-[.2rem] '  src={`http://image.tmdb.org/t/p/w500/${data?.logo_path}`} alt=""/>
                    
                    
                                                                        </div>
                                                                    ) : (
                                                                        <div className=' bg-[#111111] text-[#01b4e4]  w-auto h-[3rem] p-[.4rem] text-sm font-medium  flex items-center rounded-lg ' >
                                                                        {/* <img className=' w-[4rem] rounded-lg p-[.2rem] '  src={`http://image.tmdb.org/t/p/w500/${data?.logo_path}`} alt=""/> */}
                                                                                {data?.name}
                    
                                                                        </div>
                                                                    )
                                                                
                                                                    
                                                                
                    
                                                            )
                                                        })
                                                    }
                                                  </div>
                                                   }
                                         
        
        
        
                                      </div>
        
                                  </div>
        
                              </div>
                              <div className=' w-[100%]  justify-evenly max-[428px]:flex-col   flex gap-[1rem]  '>
                                <div className=' flex flex-col w-[70%] max-[428px]:w-[100%] gap-[1rem] ' >
                                <div className=' px-[1rem] ' >
                                <h1 className=' font-medium text-xl ' >Cast</h1>
                            </div>
                                      <div className='p-[1rem] w-[100%] flex overflow-x-auto overflow-y-hidden gap-[1rem] '>
                                          {castDatav?.map(data => {
                                              return (
                                                  <Cast data={data} key={data.id} />
        
                                              )
                                          })}
                                      </div>
                                </div>
                              
        
                                      <div className='w-[30%] max-[428px]:w-[100%] flex felx-col '>
                                            <Right review={review} rt={rt} />
                                      </div>
                                  </div>
                                  {
                                    tvr?.length &&
                                    <div className=' flex flex-col gap-[1rem] p-[1rem] ' >
                                    <div className=' flex font-medium text-xl ' >
                                        <h1>Recommendations</h1>
                                    </div>
                                    <div className=' flex max-[428px]:w-[100%] w-[70%] overflow-x-auto gap-[1rem] ' >
                                   <Recom  />
                                  </div>
        
                                  </div>
                                
                                  }
                                  
                                  
                                  </>
                    ) 
                }
               
               
            </div>
            
          )
    }

    if (isTablet) {
        return (
            <div className=' flex flex-col gap-[2rem] w-[100%] ' >
                {
                    review?.id ? ( 
                        <><div className=' py-[1.2rem] bgov  relative flex  flex-col w-[100%] h-auto  text-2xl text-[#f0f0f0] '>
                            {
                                review.backdrop_path!==null ? (   
                                    <img loading='lazy' 
                                    className='  top-[0%] left-[9%]  brightness-[1] w-[100%] h-[275px]    saturate-150 absolute  object-cover z-[-1] ' 
                                    src={`http://image.tmdb.org/t/p/w1920_and_h800_multi_faces/${review?.backdrop_path}`} alt="" />
                                ) : (
                                    <div loading='lazy' className=' bg-[#01b4e4] w-[100%] h-[275px] left-[9%]    top-[0%]  brightness-[.2]  saturate-150 absolute object-cover z-[-1] '  />
        
                                 )
                            }
                              <div className='  bgr  w-[160px] h-[235px]  rounded-lg shadow-lg  '>
                                  {review.poster_path ? (
                                  <img loading='lazy' 
                                  className=' min-w-[160px] h-[235px]  object-cover rounded-lg  ' 
                                  src={`http://image.tmdb.org/t/p/w500/${review?.poster_path}`} alt="" />
                                  ) : (
                                  <img loading='lazy' 
                                  className=' min-w-[160px] h-[235px]  object-cover rounded-lg ' 
                                  src={`http://image.tmdb.org/t/p/w500/${review?.backdrop_path}`} alt="" />
                                  )}
                              </div>
                              <div className=' text-[#ffffff]  bgr h-auto px-[2rem] my-[1.3rem] py-[2rem] '>
                                  <div className=' w-[100%] flex flex-col '>
                                      <h1 className=' text-3xl w-[100%] font-[700] flex flex-col '> {review?.original_title} {review?.original_name} <br/>
                                      {
                                        review?.first_air_date &&   
                                        <div className='text-[#ffffff] flex  font-normal '> 
                                        (<p> {  review?.first_air_date?.split('', 4) }</p>)
                                       
                                         </div> 
                                     
                                      }
                                      {
                                        review?.release_date &&  <div className='text-[#ffffff] flex  font-normal '>
                                            (<p> { review?.release_date?.split('', 4)  }</p>)
                                            
                                             </div> 
                                     
                                      }
                                      {/* <p className='text-[#ffffff]  font-normal '> {  '('+ review?.first_air_date?.split('', 4) +')' } { review?.release_date && '('+ review?.release_date?.split('', 4) + ')' }</p>  */}
                                      </h1>
                                      <div className=' w-[100%] flex font-medium text-[.7rem] items-center  tracking-wider py-[.5rem] '>
                                         
                                              <div className=' flex ' ><p>
                                                  { review?.release_date} {review?.first_air_date}
                                              </p><p>(
                                                      {country?.map(data => {
                                                          return (
                                                              data.iso_3166_1
                                                          )
                                                      })}
                                                  </p>)</div>
        
                                        {/* //   )} */}
        
                                          - {gen?.map(data => {
                                              return (
                                                  <Link onClick={()=>{
                                                    setGn(data.name)
                                                  }} to={`/genre/${data?.id}`} className=' z-[99999] px-[.2rem] '> {data.name},</Link>
                                              )
                                          })}
                                          <p> - {review?.runtime ? (
                                              minutesToHours(min)
                                          ) : (
                                              er?.map(data => {
                                                  return (
                                                      data + 'm'
                                                  )
                                              })
                                          )} </p>
                                      </div>
        
                                      <div className=' text-[#ffffff] w-[2rem] flex items-center justify-center rounded-full h-[2rem] bg-slate-900 '>
                                          {heart}
                                      </div>
        
                                      <div className=' pt-[1rem] text-[.7rem] max-[428px]:text-[#111111] tag font-medium text-[#b4b4b4] '>
                                          {review?.tagline}
                                      </div>
        
        
                                      <div>
                                          <h1 className=' font-semibold w-[100%] flex justify-start items-center text-lg '>Overview</h1>
                                          <p className=' text-sm leading-6 tracking-wide '> {review?.overview} </p>
        
                                      </div>
                                                    {
                                                            company &&  <div className=' flex gap-[1rem] mt-[4rem] text-center  ' >
                                                            <div className=' flex items-center ' >
                                                            <p> Production by</p>
                            
                                                            </div>
                                                           
                                                            {
                                                                company?.map(data =>{
                                                                    return(
                                                                        <div className=' bg-[#ffffff] flex items-center rounded-lg ' >
                                                                            <img className=' w-[4rem] rounded-lg p-[.2rem] '  src={`http://image.tmdb.org/t/p/w500/${data?.logo_path}`} alt=""/>
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                          </div>
                                                    }
                                     
        
        
        
                                  </div>
        
                              </div>
        
                          </div>
                          <div className=' w-[100%] h-auto flex-col  justify-evenly flex gap-[1rem] '>
                            <div className=' flex flex-col w-[100%] gap-[1rem] ' >
                            <div className=' px-[1rem] ' >
                                <h1 className=' font-medium text-xl ' >Cast</h1>
                            </div>
                                  <div className='p-[1rem] w-[100%] flex overflow-x-auto overflow-y-hidden gap-[1rem] '>
                                      {castData?.map(data => {
                                          return (
                                              <Cast data={data} key={data.id} />
        
                                          )
                                      })}
                                  </div>
                            </div>
                           
        
                                  <div className='w-[30%] max-[428px]:w-[100%] flex felx-col '>
                                  <Right review={review} rt={rt} />
        
                                  </div>
                              </div>
        
                              {
                                    mvr?.length &&
                                    <div className=' flex flex-col gap-[1rem] p-[1rem] ' >
                                    <div className=' flex font-medium text-xl ' >
                                        <h1>Recommendations</h1>
                                    </div>
                                    <div className=' flex max-[428px]:w-[100%] w-[70%] overflow-x-auto gap-[1rem] ' >
                                   <Recom  />
                                  </div>
        
                                  </div>
                                 
                                  }
        
                             </>
                    ) : ( 
                        <><div className=' py-[1.2rem] bgov  relative flex  flex-col w-[100%] h-auto  text-2xl text-[#f0f0f0] '>
                            {
                                rt?.backdrop_path !==null ? (

                                    <img loading='lazy' 
                                    className='  top-[0%] left-[9%]  brightness-[1] w-[100%] h-[275px]    saturate-150 absolute  object-cover z-[-1] ' 
                                    src={`http://image.tmdb.org/t/p/w1920_and_h800_multi_faces/${rt?.backdrop_path}`} alt="" />
        
                                 ) : ( 
                                    <div loading='lazy' className=' bg-[#01b4e4] w-[100%] h-[275px] left-[9%]    top-[0%]  brightness-[.2]  saturate-150 absolute object-cover z-[-1] '  />

                                 )
                            }
                              <div className='  bgr  w-[160px] h-[235px]  rounded-lg shadow-lg  '>
                                      {
                                      rt.poster_path ? (
                                      <img loading='lazy' 
                                      className=' min-w-[160px] h-[235px]  object-cover rounded-lg  ' 
                                      src={`http://image.tmdb.org/t/p/w500/${rt?.poster_path}`} alt="" />
                                      ) : (
                                      <img loading='lazy' 
                                      className=' min-w-[160px] h-[235px]  object-cover rounded-lg  ' 
                                      src={`http://image.tmdb.org/t/p/w500/${rt?.backdrop_path}`} alt="" />
                                      )}
                                  </div>
                                  <div className=' w-[100%] bgov h-auto px-[2rem] py-[1rem] '>
                                      <div className=' flex flex-col w-[100%] '>
                                         
                                          <h1 className=' text-3xl w-[100%] font-[700] flex flex-col '> {rt?.original_title} {rt?.original_name} <br/>
                                      {
                                        rt?.first_air_date &&   
                                        <div className='text-[#ffffff] flex  font-normal '> 
                                        (<p> {  rt?.first_air_date?.split('', 4) }</p>)
                                       
                                         </div> 
                                     
                                      }
                                      {
                                        rt?.release_date &&  <div className='text-[#ffffff] flex  font-normal '>
                                            (<p> { rt?.release_date?.split('', 4)  }</p>)
                                            
                                             </div> 
                                     
                                      }
                                      {/* <p className='text-[#ffffff]  font-normal '> {  '('+ review?.first_air_date?.split('', 4) +')' } { review?.release_date && '('+ review?.release_date?.split('', 4) + ')' }</p>  */}
                                      </h1>

                                          <div className=' w-[100%]  flex font-medium text-[.7rem] items-center  tracking-wider py-[1rem] '>
                                              
                                                  <div className=' px-[.2rem] h-[1.5rem] flex items-center justify-center opacity-75 border-[1.5px] rounded-sm '>
                                                      <p className=' text-center font-medium   '>TV/MA</p>
        
                                                  </div>
                                            
        
                                              - {gen?.map(data => {
                                              return (
                                                  <Link onClick={()=>{
                                                    setGn(data?.name)
                                                  }} to={`/genre/${data?.id}`} className=' px-[.2rem] '> {data.name},</Link>
                                              )
                                          })}
                                              <p> - {rt?.runtime ? (
                                                  minutesToHours(min)
                                              ) : (
                                                  er?.map(data => {
                                                      return (
                                                          data + 'm'
                                                      )
                                                  })
                                              )} </p>
                                          </div>
        
                                          <div className='  text-[#ffffff]  w-[2rem] flex items-center justify-center rounded-full h-[2rem] bg-slate-900 '>
                                              {heart}
                                          </div>
        
                                          <div className='  pt-[1rem] text-[.7rem] tag font-medium text-[#b4b4b4] '>
                                              {rt?.tagline}
                                          </div>
        
                                          <div>
                                              <h1 className=' font-semibold text-lg w-[100%] flex justify-start items-center '>Overview</h1>
                                              <p className=' text-sm leading-6 tracking-wide '> {rt?.overview} </p>
        
                                          </div>
                                                   {
                                                    company &&  <div className=' flex gap-[1rem] mt-[2rem] text-center  ' >
                                                    <div className=' flex items-center font-semibold' >
                                                    <p> Production by</p>
                    
                                                    </div>
                                                   
                                                    {
                                                        company?.map(data =>{
                                                            return(
                                                                
                                                                    data?.logo_path ? (
                                                                        <div className='  bg-[#ffffff] flex items-center rounded-lg ' >
                                                                        <img className=' w-[4rem] rounded-lg p-[.2rem] '  src={`http://image.tmdb.org/t/p/w500/${data?.logo_path}`} alt=""/>
                    
                    
                                                                        </div>
                                                                    ) : (
                                                                        <div className=' bg-[#111111] text-[#01b4e4]  w-auto h-[3rem] p-[.4rem] text-sm font-medium  flex items-center rounded-lg ' >
                                                                        {/* <img className=' w-[4rem] rounded-lg p-[.2rem] '  src={`http://image.tmdb.org/t/p/w500/${data?.logo_path}`} alt=""/> */}
                                                                                {data?.name}
                    
                                                                        </div>
                                                                    )
                                                                
                                                                    
                                                                
                    
                                                            )
                                                        })
                                                    }
                                                  </div>
                                                   }
                                         
        
        
        
                                      </div>
        
                                  </div>
        
                              </div>
                              <div className=' w-[100%]  justify-evenly flex-col   flex gap-[1rem]  '>
                                <div className=' flex flex-col w-[100%] gap-[1rem] ' >
                                <div className=' px-[1rem] ' >
                                <h1 className=' font-medium text-xl ' >Cast</h1>
                            </div>
                                      <div className='p-[1rem] w-[100%] flex overflow-x-auto overflow-y-hidden gap-[1rem] '>
                                          {castDatav?.map(data => {
                                              return (
                                                  <Cast data={data} key={data.id} />
        
                                              )
                                          })}
                                      </div>
                                </div>
                              
        
                                      <div className='w-[30%] max-[428px]:w-[100%] flex felx-col '>
                                            <Right review={review} rt={rt} />
                                      </div>
                                  </div>
                                  {
                                    tvr?.length &&
                                    <div className=' flex flex-col gap-[1rem] p-[1rem] ' >
                                    <div className=' flex font-medium text-xl ' >
                                        <h1>Recommendations</h1>
                                    </div>
                                    <div className=' flex max-[428px]:w-[100%] w-[70%] overflow-x-auto gap-[1rem] ' >
                                   <Recom  />
                                  </div>
        
                                  </div>
                                 
                                  }
                                  
                                  
                                  </>
                    ) 
                }
               
               
            </div>
            
          )
    }

    if (isMobile) {
        return (
            <div className=' flex flex-col gap-[2rem] w-[100%] ' >
                {
                    review?.id ? ( 
                        <><div className=' py-[1.2rem] bgov  relative flex  flex-col w-[100%] h-auto  text-2xl text-[#f0f0f0] '>
                            {
                                review.backdrop_path!==null ? (   
                                    <img loading='lazy' 
                                    className='  top-[0%] left-[9%]  brightness-[1] w-[390px] h-[175px]    saturate-150 absolute  object-cover z-[-1] ' 
                                    src={`http://image.tmdb.org/t/p/w1920_and_h800_multi_faces/${review?.backdrop_path}`} alt="" />
                                ) : (
                                    <div loading='lazy' className=' bg-[#01b4e4] w-[390px] h-[175px] left-[9%]    top-[0%]  brightness-[.2]  saturate-150 absolute object-cover z-[-1] '  />
        
                                 )
                            }
                              <div className='  bgr  w-[90px] h-[135px]  rounded-lg shadow-lg  '>
                                  {review.poster_path ? (
                                  <img loading='lazy' 
                                  className=' min-w-[90px] h-[135px]  object-cover rounded-lg  ' 
                                  src={`http://image.tmdb.org/t/p/w500/${review?.poster_path}`} alt="" />
                                  ) : (
                                  <img loading='lazy' 
                                  className=' min-w-[90px] h-[135px]  object-cover rounded-lg ' 
                                  src={`http://image.tmdb.org/t/p/w500/${review?.backdrop_path}`} alt="" />
                                  )}
                              </div>
                              <div className=' text-[#ffffff]  bgr h-auto px-[2rem] my-[1.3rem] py-[2rem] '>
                                  <div className=' w-[100%] flex flex-col '>
                                      <h1 className=' text-3xl w-[100%] font-[700] flex flex-col '> {review?.original_title} {review?.original_name} <br/>
                                      {
                                        review?.first_air_date &&   
                                        <div className='text-[#ffffff] flex  font-normal '> 
                                        (<p> {  review?.first_air_date?.split('', 4) }</p>)
                                       
                                         </div> 
                                     
                                      }
                                      {
                                        review?.release_date &&  <div className='text-[#ffffff] flex  font-normal '>
                                            (<p> { review?.release_date?.split('', 4)  }</p>)
                                            
                                             </div> 
                                     
                                      }
                                      {/* <p className='text-[#ffffff]  font-normal '> {  '('+ review?.first_air_date?.split('', 4) +')' } { review?.release_date && '('+ review?.release_date?.split('', 4) + ')' }</p>  */}
                                      </h1>
                                      <div className=' w-[100%] flex font-medium text-[.7rem] items-center  tracking-wider py-[.5rem] '>
                                         
                                              <div className=' flex ' ><p>
                                                  { review?.release_date} {review?.first_air_date}
                                              </p><p>(
                                                      {country?.map(data => {
                                                          return (
                                                              data.iso_3166_1
                                                          )
                                                      })}
                                                  </p>)</div>
        
                                        {/* //   )} */}
        
                                          - {gen?.map(data => {
                                              return (
                                                  <Link onClick={()=>{
                                                    setGn(data.name)
                                                  }} to={`/genre/${data?.id}`} className=' z-[99999] px-[.2rem] '> {data.name},</Link>
                                              )
                                          })}
                                          <p> - {review?.runtime ? (
                                              minutesToHours(min)
                                          ) : (
                                              er?.map(data => {
                                                  return (
                                                      data + 'm'
                                                  )
                                              })
                                          )} </p>
                                      </div>
        
                                      <div className=' text-[#ffffff] w-[2rem] flex items-center justify-center rounded-full h-[2rem] bg-slate-900 '>
                                          {heart}
                                      </div>
        
                                      <div className=' pt-[1rem] text-[.7rem] max-[428px]:text-[#111111] tag font-medium text-[#b4b4b4] '>
                                          {review?.tagline}
                                      </div>
        
        
                                      <div>
                                          <h1 className=' font-semibold w-[100%] flex justify-start items-center text-lg '>Overview</h1>
                                          <p className=' text-sm leading-6 tracking-wide '> {review?.overview} </p>
        
                                      </div>
                                                    {
                                                            company &&  <div className=' flex gap-[1rem] mt-[4rem] text-center  ' >
                                                            <div className=' flex items-center ' >
                                                            <p> Production by</p>
                            
                                                            </div>
                                                           
                                                            {
                                                                company?.map(data =>{
                                                                    return(
                                                                        <div className=' bg-[#ffffff] flex items-center rounded-lg ' >
                                                                            <img className=' w-[4rem] rounded-lg p-[.2rem] '  src={`http://image.tmdb.org/t/p/w500/${data?.logo_path}`} alt=""/>
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                          </div>
                                                    }
                                     
        
        
        
                                  </div>
        
                              </div>
        
                          </div>
                          <div className=' w-[100%] h-auto flex-col  justify-evenly flex gap-[1rem] '>
                            <div className=' flex flex-col w-[100%] gap-[1rem] ' >
                            <div className=' px-[1rem] ' >
                                <h1 className=' font-medium text-xl ' >Cast</h1>
                            </div>
                                  <div className='p-[1rem] w-[100%] flex overflow-x-auto overflow-y-hidden gap-[1rem] '>
                                      {castData?.map(data => {
                                          return (
                                              <Cast data={data} key={data.id} />
        
                                          )
                                      })}
                                  </div>
                            </div>
                           
        
                                  <div className='w-[30%] max-[428px]:w-[100%] flex felx-col '>
                                  <Right review={review} rt={rt} />
        
                                  </div>
                              </div>
        
                              {
                                    mvr?.length &&
                                    <div className=' flex flex-col gap-[1rem] p-[1rem] ' >
                                    <div className=' flex font-medium text-xl ' >
                                        <h1>Recommendations</h1>
                                    </div>
                                    <div className=' flex max-[428px]:w-[100%] w-[70%] overflow-x-auto gap-[1rem] ' >
                                   <Recom  />
                                  </div>
        
                                  </div>
                                 
                                  }
        
                             </>
                    ) : ( 
                        <><div className=' py-[1.2rem] bgov  relative flex  flex-col w-[100%] h-auto  text-2xl text-[#f0f0f0] '>
                            {
                                rt?.backdrop_path !==null ? (

                                    <img loading='lazy' 
                                    className='  top-[0%] left-[9%]  brightness-[1] w-[390px] h-[175px]    saturate-150 absolute  object-cover z-[-1] ' 
                                    src={`http://image.tmdb.org/t/p/w1920_and_h800_multi_faces/${rt?.backdrop_path}`} alt="" />
        
                                 ) : ( 
                                    <div loading='lazy' className=' bg-[#01b4e4] w-[390px] h-[175px] left-[9%]    top-[0%]  brightness-[.2]  saturate-150 absolute object-cover z-[-1] '  />

                                 )
                            }
                              <div className='  bgr  w-[90px] h-[135px]  rounded-lg shadow-lg  '>
                                      {
                                      rt.poster_path ? (
                                      <img loading='lazy' 
                                      className=' min-w-[90px] h-[135px]  object-cover rounded-lg  ' 
                                      src={`http://image.tmdb.org/t/p/w500/${rt?.poster_path}`} alt="" />
                                      ) : (
                                      <img loading='lazy' 
                                      className=' min-w-[90px] h-[135px]  object-cover rounded-lg  ' 
                                      src={`http://image.tmdb.org/t/p/w500/${rt?.backdrop_path}`} alt="" />
                                      )}
                                  </div>
                                  <div className=' max-[428px]:w-[100%] w-[428px]:bgr max-[428px]:h-auto px-[2rem] py-[1rem] '>
                                      <div className=' flex flex-col max-[428px]:w-[100%] '>
                                         
                                          <h1 className=' text-3xl w-[100%] font-[700] flex flex-col '> {rt?.original_title} {rt?.original_name} <br/>
                                      {
                                        rt?.first_air_date &&   
                                        <div className='text-[#ffffff] flex  font-normal '> 
                                        (<p> {  rt?.first_air_date?.split('', 4) }</p>)
                                       
                                         </div> 
                                     
                                      }
                                      {
                                        rt?.release_date &&  <div className='text-[#ffffff] flex  font-normal '>
                                            (<p> { rt?.release_date?.split('', 4)  }</p>)
                                            
                                             </div> 
                                     
                                      }
                                      {/* <p className='text-[#ffffff]  font-normal '> {  '('+ review?.first_air_date?.split('', 4) +')' } { review?.release_date && '('+ review?.release_date?.split('', 4) + ')' }</p>  */}
                                      </h1>

                                          <div className=' w-[100%]  flex font-medium text-[.7rem] items-center  tracking-wider py-[1rem] '>
                                              
                                                  <div className=' px-[.2rem] h-[1.5rem] flex items-center justify-center opacity-75 border-[1.5px] rounded-sm '>
                                                      <p className=' text-center font-medium   '>TV/MA</p>
        
                                                  </div>
                                            
        
                                              - {gen?.map(data => {
                                              return (
                                                  <Link onClick={()=>{
                                                    setGn(data?.name)
                                                  }} to={`/genre/${data?.id}`} className=' px-[.2rem] '> {data.name},</Link>
                                              )
                                          })}
                                              <p> - {rt?.runtime ? (
                                                  minutesToHours(min)
                                              ) : (
                                                  er?.map(data => {
                                                      return (
                                                          data + 'm'
                                                      )
                                                  })
                                              )} </p>
                                          </div>
        
                                          <div className='  text-[#ffffff]  w-[2rem] flex items-center justify-center rounded-full h-[2rem] bg-slate-900 '>
                                              {heart}
                                          </div>
        
                                          <div className='  pt-[1rem] text-[.7rem] tag font-medium text-[#b4b4b4] '>
                                              {rt?.tagline}
                                          </div>
        
                                          <div>
                                              <h1 className=' font-semibold text-lg w-[100%] flex justify-start items-center '>Overview</h1>
                                              <p className=' text-sm leading-6 tracking-wide '> {rt?.overview} </p>
        
                                          </div>
                                                   {
                                                    company &&  <div className=' flex gap-[1rem] mt-[2rem] text-center  ' >
                                                    <div className=' flex items-center font-semibold' >
                                                    <p> Production by</p>
                    
                                                    </div>
                                                   
                                                    {
                                                        company?.map(data =>{
                                                            return(
                                                                
                                                                    data?.logo_path ? (
                                                                        <div className='  bg-[#ffffff] flex items-center rounded-lg ' >
                                                                        <img className=' w-[4rem] rounded-lg p-[.2rem] '  src={`http://image.tmdb.org/t/p/w500/${data?.logo_path}`} alt=""/>
                    
                    
                                                                        </div>
                                                                    ) : (
                                                                        <div className=' bg-[#111111] text-[#01b4e4]  w-auto h-[3rem] p-[.4rem] text-sm font-medium  flex items-center rounded-lg ' >
                                                                        {/* <img className=' w-[4rem] rounded-lg p-[.2rem] '  src={`http://image.tmdb.org/t/p/w500/${data?.logo_path}`} alt=""/> */}
                                                                                {data?.name}
                    
                                                                        </div>
                                                                    )
                                                                
                                                                    
                                                                
                    
                                                            )
                                                        })
                                                    }
                                                  </div>
                                                   }
                                         
        
        
        
                                      </div>
        
                                  </div>
        
                              </div>
                              <div className=' w-[100%]  justify-evenly flex-col   flex gap-[1rem]  '>
                                <div className=' flex flex-col w-[100%] gap-[1rem] ' >
                                <div className=' px-[1rem] ' >
                                <h1 className=' font-medium text-xl ' >Cast</h1>
                            </div>
                                      <div className='p-[1rem] w-[100%] flex overflow-x-auto overflow-y-hidden gap-[1rem] '>
                                          {castDatav?.map(data => {
                                              return (
                                                  <Cast data={data} key={data.id} />
        
                                              )
                                          })}
                                      </div>
                                </div>
                              
        
                                      <div className='w-[30%] max-[428px]:w-[100%] flex felx-col '>
                                            <Right review={review} rt={rt} />
                                      </div>
                                  </div>
                                  {
                                    tvr?.length &&
                                    <div className=' flex flex-col gap-[1rem] p-[1rem] ' >
                                    <div className=' flex font-medium text-xl ' >
                                        <h1>Recommendations</h1>
                                    </div>
                                    <div className=' flex max-[428px]:w-[100%] w-[70%] overflow-x-auto gap-[1rem] ' >
                                   <Recom  />
                                  </div>
        
                                  </div>
                                 
                                  }
                                  
                                  
                                  </>
                    ) 
                }
               
               
            </div>
            
          )
    }


 
}

export default Review
