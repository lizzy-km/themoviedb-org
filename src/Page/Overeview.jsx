import React, { useEffect, useState } from 'react'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { createUseStyles } from 'react-jss'
import { Link, useParams } from 'react-router-dom'
import { State } from '../context/State'
import './index.css'
import Review from './Review'

const Overeview = () => {
    // const id = review.id;
    const {ids} = useParams()
    
    const {company,setCompany,castv,cast,er,setEr,gen,setGen,country,setCountry,id,setId,rv,rt,fetchOvereview,fetchOvereviewTv,setReview,review,mt} = State()
    setId(ids);


    

  
        
       
    
    function minutesToHours(minutes) {
        var hours = Math.floor(minutes / 60); // get the whole number of hours
        var remainingMinutes = minutes % 60; // get the remaining minutes
        return hours + "h " + remainingMinutes + "m";
      }

      const min = review?.runtime;
      setEr(review?.episode_run_time)

    //   console.log(review.runtime);

//    const country = review.production_countries
      

 setCountry(review?.production_countries)
 console.log(country);
 if(review.id){
    setGen(review?.genres)
    setEr(review?.episode_run_time)
    // setType('movie')


 }else{
    setGen(rt?.genres)
    setEr(rt?.episode_run_time)
    // setType('tv')

 }
//   const g= gen.map(data =>{
//     return(
//         console.log(data)
//     )
//  })
    // console.log(gen);




  return (
    <div  className={' w-[100%]  tracking-wider '} >  

        
            <Review mt={mt} cast={cast} company={company} setCompany={setCompany} castv={castv} country={country} minutesToHours={minutesToHours} min={min} gen={gen} rt={rt} review={review} er={er} />
      
       
    
    </div>
    
   
  )
}

export default Overeview
