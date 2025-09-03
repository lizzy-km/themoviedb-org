import React, {useEffect, useState} from 'react'
import {State} from '../context/State'
import Tcard from './Tcard'
import './tranding.css'
import {useGetTrending} from "../services/mutation/commonMutation.js";

const Tranding = () => {

    const oc = 'cursor-pointer bg-[#111111] font-medium text-[1em] w-[5rem] h-[2rem] flex items-center justify-center rounded-2xl'
    const nc = 'cursor-pointer font-medium text-[1em] w-[5rem] h-[2rem] flex items-center justify-center rounded-2xl'
    const ocw = 'cursor-pointer bg-[#111111] font-medium text-[1em] w-[8rem] h-[2rem] flex items-center justify-center rounded-2xl'
    const ncw = 'cursor-pointer font-medium text-[1em] w-[8rem] h-[2rem] flex items-center justify-center rounded-2xl'
    const at = ' cursor-pointer active-text'
    const nat = ' cursor-pointer text-[#111111]'
    const [active, setActive] = useState(at)
    const [activew, setActivew] = useState(nat)
    const [tnd, setTnd] = useState(oc)
    const [tndd, setTndd] = useState(ncw)
    const [type, setType] = useState('day')

    
    const {data: trending, mutate} = useGetTrending(`all/${type}`)

    useEffect(() => {
        mutate()
    }, [mutate, type])

    return (<div className=' px-[3rem] py-[2rem] gap-[1rem] tranding flex flex-col w-[100%] h-[28rem] '>


            <div className=' flex items-center gap-[1.5rem] '>
                <h1 className=' text-[1.5em] font-[600] '>Trending</h1>
                <div className=' flex items-center border-[1px] border-blue-900 rounded-3xl'>
                    <div onClick={() => {
                        setTnd(oc)
                        setTndd(ncw)
                    }} className={tnd}>
                        <a onClick={() => {
                            setActive(at)
                            setActivew(nat)
                            setType('day')
                        }}
                           className={active}>Today</a>
                    </div>
                    <div onClick={() => {
                        setTndd(ocw)
                        setTnd(nc)
                    }}
                         className={tndd}>
                        <a onClick={() => {
                            setActive(nat)
                            setActivew(at)
                            setType('week')

                        }}
                           className={activew}>This Week</a>
                    </div>


                </div>
            </div>

            <div className=' rounded-lg flex gap-[1rem] overflow-x-auto overflow-y-hidden '>
                {trending?.map(data => {
                    // if(data.title && data.name ){
                    //   setName(data.title)
                    // }
                    // if (data.name) {
                    //   setName(data.name)
                    // }

                    return (<Tcard data={data} name={name} key={data.id}/>)
                })}

            </div>

        </div>)
}

export default Tranding
