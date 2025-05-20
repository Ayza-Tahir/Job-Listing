import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './Frontend/HomePage/HomePage';
import AddJob from './Frontend/AddJob/AddJob';
import Navbar from './Frontend/NavBar/NavBar';



function App() {
  return (
    <Router>
      <Navbar /> 

      <div className="app-wrapper">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/AddJob" element={<AddJob />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
