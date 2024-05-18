import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './Component/Auth/Login/Login'
import Register from './Component/Auth/Register/Register'
import Home from './Component/Home/Home'
import Side from './Component/Side/Side'
import Message from './Component/Message/Message'

function App() {
  return (
    <>
      {/* <div>
        <h1>Slack2.OO</h1>
      </div> */}
      <Routes basename="/tothepoint_login">
      <Route path='/side' element={<Side/>}/>
      <Route path='/' element={<Login/>}/>
        <Route path='/Home' element={<Home/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/Login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path="/chat/:channelId" element={<Home/>} />
        {/* <Route path="/message/:userId" element={<Home/>} /> */}
        <Route path="/chat/direct/:userId" element={<Home/>} />



      </Routes>
    </>
  )
}

export default App

// import React from 'react';
// import { Route, Routes } from 'react-router-dom';

// // Dynamically import components
// const Login = React.lazy(() => import('./Component/Auth/Login/Login'));
// const Register = React.lazy(() => import('./Component/Auth/Register/Register'));
// const Home = React.lazy(() => import('./Component/Home/Home'));
// const Side = React.lazy(() => import('./Component/Side/Side'));
// const Message = React.lazy(() => import('./Component/Message/Message'));

// function App() {
//   return (
//     <>
//       {/* <div>
//         <h1>Slack2.OO</h1>
//       </div> */}
//       <Routes>
//         <Route path='/side' element={<Side/>}/>
//         <Route path='/' element={<Login/>}/>
//         <Route path='/Home' element={<Home/>}/>
//         <Route path='/Login' element={<Login/>}/>
//         <Route path='/register' element={<Register/>}/>
//         <Route path="/chat/:channelId" element={<Home/>} />
//         {/* <Route path="/message/:userId" element={<Home/>} /> */}
//         <Route path="/chat/direct/:userId" element={<Home/>} />
//       </Routes>
//     </>
//   );
// }

// export default App;



// import React from 'react';
// import { Route, Routes } from 'react-router-dom';

// // Dynamically import components
// const Login = React.lazy(() => import('./Component/Auth/Login/Login'));
// const Register = React.lazy(() => import('./Component/Auth/Register/Register'));
// const Home = React.lazy(() => import('./Component/Home/Home'));
// const Side = React.lazy(() => import('./Component/Side/Side'));
// const Message = React.lazy(() => import('./Component/Message/Message'));

// function App() {
//   return (
//     <>
//       {/* Uncomment if needed */}
//       {/* <div>
//         <h1>Slack2.OO</h1>
//       </div> */}
//       <Routes>
//         <Route path='/side' element={<Side/>}/>
//         <Route path='/' element={<Login/>}/>
//         <Route path='/register' element={<Register/>}/>
//         {/* Use only one route for the home page */}
//         <Route path='/home' element={<Home/>}/>
//         {/* <Route path="/chat/:channelId" element={<Home/>} /> */}
//         {/* <Route path="/message/:userId" element={<Home/>} /> */}
//         <Route path="/chat/direct/:userId" element={<Home/>} />
//       </Routes>
//     </>
//   );
// }

// export default App;
