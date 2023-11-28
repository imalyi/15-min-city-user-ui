import React from 'react';
import Home from './componennts/Home';
import About from './componennts/About';
import ShowDataPage from './componennts/ShowDataPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/show-addresses" element={<ShowDataPage />} />
      </Routes>
    </Router>
  );
}

export default App;
