import React from 'react'
import { Link } from 'react-router-dom'
import { State } from '../context/State';

const Recom = () => {
    const{tvr,mvr} = State()
    console.log(mvr);
    console.log(tvr);

  return (
    <div className=' flex gap-[1rem] ' >
        {
            mvr ? (
                mvr?.map(data =>{
                    return(
                        <div className=' flex flex-col ' >
                        <Link to={`/overeview/${data?.id}`} className='min-w-[250px] h-[141px] rounded-lg  ' >
                            {
                                data?.backdrop_path ==null ? (                             <div className=' bg-[#0d253f] hover:blur-sm min-w-[250px] h-[141px] object-cover rounded-lg  ' 
                               />
                                ) : (
                                    <img className=' hover:blur-sm min-w-[250px] h-[141px] object-cover rounded-lg  ' src={`http://image.tmdb.org/t/p/w500/${data?.backdrop_path}`} alt=""/>

                                )
                            }
                        </Link>
                        <div>
                            <p className=' font-medium text-sm py-[1rem] ' >
                                {/* {data?.title} */}
                                 {data?.original_title}
                                  {data?.name}
                            </p>
                        </div>
                        </div>
                    )
                })
                 ) : tvr ? (
                        tvr?.map(datat =>{
                            return(
                                <div className=' flex flex-col   ' >
                                <Link to={`/overeview/${datat?.id}`} className='min-w-[250px] h-[141px] rounded-lg  ' >
                                    
                                        { 
                                        datat?.backdrop_path ? (   
                                        <img className=' hover:blur-sm min-w-[250px] h-[141px] object-cover rounded-lg  ' src={`http://image.tmdb.org/t/p/w500/${datat?.backdrop_path}`} alt=""/>
                                       ) : (                
                                        <img className=' hover:blur-sm min-w-[250px] h-[141px] object-cover rounded-lg  ' src={`http://image.tmdb.org/t/p/w500/${datat?.poster_path}`} alt=""/>
                                        ) }
                                    
                                </Link>
                                <div>
                                    <p className=' font-medium text-sm py-[1rem] ' >
                                    {datat?.title} {datat?.original_title} {datat?.name}
                                    </p>
                                </div>
                                </div>
                            )
                        })
                   ) : mvr?.length ==0 || tvr?.length ===0 ? (
            <div className=' text-[#111111] ' >
               <h1>No Recommendations! </h1> 
            </div>
        ) : (
            <div>
                
            </div>
        )
        }
       

        
       
    </div>
  )
}

export default Recom
