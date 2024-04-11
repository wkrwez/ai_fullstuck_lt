import React from 'react'
import { BrowserRouter, useRoutes, Navigate } from 'react-router-dom'
import LayoutWrap from '../pages/layout'
import Students from '../pages/students/Students'
import Employment from '../pages/employment/Employment'
import Personal from '../pages/personal/index'
import Login from '../pages/login/index'



const routerList = [
  {
    path: '/login',
    element: <Login/>
  },
  {
    path: '/layout',
    element: <LayoutWrap/>,
    children: [
      {
        path: '',
        element: <Navigate to='/layout/students'/>,
      },
      {
        path: 'students',
        element: <Students/>
      },
      {
        path: 'employment',
        element: <Employment/>
      },
      {
        path: 'personal',
        element: <Personal/>
      }
    ]
  },
]


function Element() {
  return useRoutes(routerList)  // <Route path="/" element={<Home/>}/>
}

function WrapperRoutes () {
  return (
    <BrowserRouter>
      <Element/>
    </BrowserRouter>
  )
}

export default WrapperRoutes