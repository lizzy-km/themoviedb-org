import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import NavBar from './common/Header/NavBar'
import { StateContextProvider } from './context/State'
import Overeview from './Page/Overeview'
import SearchData from './Page/SearchData'
import Movies from './Page/Movies'
import TvShow from './Page/TvShow'
import Genre from './Page/Genre'
import Footer from './common/Footer/Footer'
import { MantineProvider, Text } from '@mantine/core';
import DataByKeyword from './Page/DataByKeyword'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <StateContextProvider>
    <MantineProvider withGlobalStyles withNormalizeCSS >
    <NavBar  />
    <div className='  flex flex-col w-[100%] h-screen overflow-y-auto ' >
    
  <Routes>
      <Route exact path={'/'} element={<App />} />
      <Route exact path={'*'} element={<App />} />
      <Route exact path={'/movies'} element={<Movies />} />
      <Route exact path={'/tvshow'} element={<TvShow />} />
      <Route exact path={`/overeview/:ids`} element={<Overeview />} />
      <Route exact path={`/genre/:id`} element={<Genre />} />
      <Route exact path={`/searchresults/:query`} element={<SearchData />} />
      <Route exact path={`/keyword/:keyword`} element={<DataByKeyword />} />

    </Routes>
    <Footer />
    </div>
    </MantineProvider>
  
  
  </StateContextProvider>
  
  
   
  
  </BrowserRouter>
  
)
