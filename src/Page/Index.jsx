import React from 'react'
import LatestTrailers from '../components/LatestTrailers'
import Random from '../components/Random'
import Tranding from '../components/Tranding'
import WhatPopular from '../components/WhatPopular'
import './index.css'
import { useMediaQuery } from 'react-responsive'
import RandomM from '../components/RandomM'

const index = () => {

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })
    const isTablet = useMediaQuery({ query: '(min-width: 768px) and (max-width: 991px)' })
    const isDesktop = useMediaQuery({ query: '(min-width: 992px)' })

  return (
    <div className=' overflow-x-hidden w-[100%] h-auto flex flex-col  items-center ' >
      {
        isDesktop &&       <Random/>

      }{
        isTablet &&       <Random/>

      }{
        isMobile && <RandomM/>
      }
      <Tranding/>
      <LatestTrailers/>
      <WhatPopular/>
      <div className=' h-[10rem] ' >
        
      </div>
    </div>
  )
}

export default index
