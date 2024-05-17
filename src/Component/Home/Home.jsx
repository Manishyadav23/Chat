import React from 'react'
import { Link } from 'react-router-dom'
import Color from '../Color/Color'
import Side from '../Side/Side'
import './Home.css'
import Message from '../Message/Message'

function Home() {
  return (
<>
    
    <div className='hom'>
      {/* <Link to='/Login'>Signout</Link> */}
      <div className='cl'>
        <Color/>
      </div>
      
      <div>
        <Side/>
      </div>

      <div>
        <Message/>
      </div>
    </div>
    {/* <div className="hom">
      <h1>this is Home</h1>
    </div> */}
</>  )
}

export default Home