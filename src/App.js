import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import GoToTop from './pages/GoToTop';
import { BrowserRouter as Router } from 'react-router-dom';
import AnimatedRoutes from './pages/AnimatedRoutes';




const App = () => {

 
  
  return (
    <>
    
    <Router>
    <AnimatedRoutes/>
     
    </Router>
    </>
  );
};

export default App;
