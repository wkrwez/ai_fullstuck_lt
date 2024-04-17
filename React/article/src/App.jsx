import React from 'react';
import {BrowserRouter, Routes,Route} from 'react-router-dom'
import Login from './pages/Login/Login'
import Layout from './pages/Layout/Layout'
import {AuthRouter} from '@/components/AuthRouter'  //路由守卫组件


const App = () => {
    return (
        <BrowserRouter>
            <div className='app'>
                <Routes>
                    <Route path='/' element={<AuthRouter><Layout/></AuthRouter>}></Route>
                    <Route path='/login' element={<Login/>}></Route>
                </Routes>
            </div>
        </BrowserRouter>
    );
};

export default App;