import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { State } from '../context/State'
import { useNavigate } from 'react-router-dom'
const Right = ({review,rt}) => {
    const{keyword,keywordt,lant,setLant,lan,setLan,language,setLanguage} = State()
    
    const nav = useNavigate()
   const navKey =()=>{
    // nav(`/keyword/${keyword?.at(0).id}`)
    // nav('/')
   }
   
   if (review.id) {
   setLanguage(review?.spoken_languages)
    // console.log(language);

   }
   else{
    setLanguage(rt?.spoken_languages)
    // console.log(language);


   }
   
   const network = rt.networks
//    console.log(keywordt);
//    console.log(keyword);

  return (
    <div className=' gap-[1rem] flex flex-col p-[1rem] ' >
      <div className=' flex flex-col ' >
        <h1 className=' font-medium ' >Status</h1>
        {
           review.id ? (
            review?.status ? ( 
                <p>{review?.status}</p>
            ) : (
                <p>{review?.status}</p>
            )
           ) : (
            rt?.status ? (
                <p>{rt?.status}</p>
             ) : (
                <p>{rt?.status} </p>
             )
           )
        }
    
        
       
      </div>

      <div className='  flex flex-col ' >
        <h1 className=' font-medium ' >Language</h1>
        <div className=' flex flex-wrap gap-[.4rem] w-[17rem] ' >
        {language?.map(data =>{
            return(
                <p className=' bg-[#c1c1c1c7] p-[.3rem] rounded-[4px] w-auto ' > {data.english_name} </p>
            )
        })}
        </div>
       
      </div>
      {
        review?.budget ? ( 
            <div className='  flex flex-col ' >
        <h1 className=' font-medium ' >Buget</h1>
        
            
                <p> ${review.budget}.00 </p>
            

            
        
      </div>
        ) : ( 
            network?.id ? ( 
                <div className='  flex flex-col gap-[.5rem] ' >
                <h1 className=' font-medium ' >Network</h1>
                
                    
                         {network?.map(data =>{
                            return(
                                <img className=' w-[10rem] object-cover '  src={`http://image.tmdb.org/t/p/w500/${data?.logo_path}`} alt=""/>
                            )
                        })}
                    
        
                    
                
              </div>
            ) : (
                <div>
                    
                </div>
             )
           
        )
      }
      

      {
            review?.revenue ? (
                <div className='  flex flex-col ' >
       
                <h1 className=' font-medium ' >Revenue</h1>
                
                   
                        <p> ${review.revenue}.00 </p>
                    
                       
                
              </div>
             ) : ( 
                rt?.type ? ( 
                    <div className='  flex flex-col ' >
       
                    <h1 className=' font-medium ' >Type</h1>
                    
                       
                            <p> {rt?.type} </p>
                        
                           
                    
                  </div>
                ) : ( 
                    <div>
                        
                    </div>
                )
               
             )
        }
     
     <div>
                {
                    keyword &&  <div>
               
                    <div className=' flex items-center py-[1rem] ' >
                   <p className=' font-semibold ' >Keywords</p>
                 </div>
                 <div className=' flex flex-wrap gap-[.3rem] w-[17rem]  ' >
                       {
                             keyword?.map(data =>{
                                 return(
                                     <Link to={`/keyword/${data?.id}`} onClick={navKey} className=' bg-[#c1c1c1c7] rounded-[4px] p-[.5rem] flex items-center w-auto h-[1.7rem] text-sm cursor-pointer ' >
                                         <p> {data.name} </p>
                                     </Link>
                                 )
                             })
                         }
                       </div>
                 
                 
                       
                          
                       
                      
                   
                 
                
                       </div>
                } 
                 {
                    keywordt &&  <div>
               
                    <div className=' flex items-center py-[1rem] ' >
                   <p className=' font-semibold ' >Keywords</p>
                 </div>
                 <div className=' flex flex-wrap gap-[.3rem] w-[17rem]  ' >
                       {
                             keywordt?.map(data =>{
                                 return(
                                     <Link to={`/keyword/${data?.id}`} onClick={navKey} className=' bg-[#c1c1c1c7] rounded-[4px] p-[.5rem] flex items-center w-auto h-[1.7rem] text-sm cursor-pointer ' >
                                         <p> {data.name} </p>
                                     </Link>
                                 )
                             })
                         }
                       </div>
                 
                 
                       
                          
                       
                      
                   
                 
                
                       </div>
                } 
           
      

      
     
       
      </div>
      </div>


    
  )
}

export default Right
