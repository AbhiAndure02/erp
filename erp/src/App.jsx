import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Signup from './admin/Signup';
import Signin from './admin/Signin';
import Dashboard from './admin/Dashboard';
import DashTeam from './admin/DashTeam';
import PrivateRoute from './admin/PrivateRoute';
import DashProject from './admin/DashProject';
import DashTask from './admin/DashTask';
import DashCalender from './admin/DashCalender';
import DashSettings from './admin/DashSettings';
import DashEnquiry from './admin/DashEnquiry';
import DashReports from './admin/DashReports';
import DashFinace from './admin/DashFinace';
import DashChat from './admin/DashChat';
import Stack from './Stack';
import Roadmap from './admin/Roadmap';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
       
        <Route path="/signup" element={<Signup/>} />
        <Route path='/login' element={<Signin />} />
        <Route path='/roadmap' element={<Roadmap />} />
        <Route element = {<PrivateRoute />}>

        <Route path='' element={<Dashboard/>} />
        <Route path='team' element={<DashTeam/>} />
        <Route path='projects' element={<DashProject />} />
        <Route path='Task' element={<DashTask />} />
        <Route path='calendar' element={<DashCalender />} />
        <Route path='settings' element={<DashSettings />} />
        <Route path='reports' element={<DashReports />} />
        <Route path='message' element={<DashEnquiry />} />
        <Route path='finance' element={<DashFinace />} />
        <Route path='chatboxes' element={<DashChat />} />
        <Route path='stack' element={<Stack/>} />
      
       


        </Route>
       





      </Routes>
    </BrowserRouter>
  );
};

export default App;
