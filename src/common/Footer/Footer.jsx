import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div className=' w-[100%] bg-[#0d253f] max-[428px]:h-auto h-auto ' >
      <nav className=' max-[428px]:h-auto w-[100%] flex max-[428px]:flex-col gap-[4rem] justify-center items-center p-[4rem] text-[#ffffff] ' >
        <Link to={'/'} class="join">
          <img src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg" alt="The Movie Database (TMDB)" width="130" height="94"/>

            {/* <a class="rounded logged_in" href="/u/Dev_K_02_L">Hi Dev_K_02_L!</a> */}
        </Link>

        <div>
          <h3>The Basics</h3>
          <ul>
            <li><a href="/about">About TMDB</a></li>
            <li><a href="/about/staying-in-touch">Contact Us</a></li>
            <li><a href="/talk">Support Forums</a></li>
            <li><a href="/documentation/api">API</a></li>
            <li><a href="https://status.themoviedb.org/" target="_blank" rel="noopener">System Status</a></li>
          </ul>
        </div>
        <div>
          <h3>Get Involved</h3>
          <ul>
            <li><a href="/bible"><span class="glyphicons glyphicons-asterisk"></span> Contribution Bible</a></li>
            <li><a href="/movie/new">Add New Movie</a></li>
            <li><a href="/tv/new">Add New TV Show</a></li>
          </ul>
        </div>
        <div>
          <h3>Community</h3>
          <ul>
            <li><a href="/documentation/community/guidelines">Guidelines</a></li>
            <li><a href="/discuss">Discussions</a></li>
            <li><a href="/leaderboard">Leaderboard</a></li>
            <li><a href="https://twitter.com/themoviedb" target="_blank" rel="noopener">Twitter</a></li>
          </ul>
        </div>
        <div>
          <h3>Legal</h3>
          <ul>
            <li><a href="/documentation/website/terms-of-use">Terms of Use</a></li>
            <li><a href="/documentation/api/terms-of-use">API Terms of Use</a></li>
            <li><a href="/privacy-policy">Privacy Policy</a></li>
          </ul>
        </div>
      </nav>
    </div>
  )
}

export default Footer
