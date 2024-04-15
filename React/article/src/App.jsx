import React from 'react';
import {BrowserRouter, Routes,Route} from 'react-router-dom'
import Login from './pages/Login/Login'
import Layout from './pages/Layout/Layout'


const App = () => {
    return (
        <BrowserRouter>
            <div className='app'>
                <Routes>
                    <Route path='/' element={<Layout/>}></Route>
                    <Route path='/login' element={<Login/>}></Route>
                </Routes>
            </div>
        </BrowserRouter>
    );
};

export default App;