import Random from '../components/Random'
import Tranding from '../components/Tranding'
import WhatPopular from '../components/WhatPopular'
import './index.css'

const index = () => {

  
  return (
    <div className=' overflow-x-hidden w-[100%] h-auto flex flex-col  items-center ' >
        <Random/>
    
      {/* {/*} */}
      <Tranding/>
      {/* <LatestTrailers/> */}
      <WhatPopular/>
      <div className=' h-[10rem] ' >
        
      </div>
    </div>
  )
}

export default index
