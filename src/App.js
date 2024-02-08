import React from 'react';
import Menupage from './pages/Menupage';
import { Routes, Route } from "react-router-dom";
import Adminpanel from './pages/Adminpanel';
import Qrgen from './pages/Qrgen';

function App() {

  return (
    <Routes>
     <Route path='/' Component={Menupage} />
     <Route path='admin' Component={Adminpanel} />
     <Route path='qr' Component={Qrgen}/>
    </Routes>
    
  );
}

export default App;
