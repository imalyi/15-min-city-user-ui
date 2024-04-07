import React from 'react';
import Home from './componennts/Home';
import About from './componennts/About';
import ShowDataPage from './componennts/ShowDataPage';
import Report from './componennts/Report';
import 'bootstrap/dist/css/bootstrap.min.css';
import { logger } from './logger';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/show-addresses" element={<ShowDataPage />} />
        <Route path="/report" element={<Report />} />
      </Routes>
    </Router>
  );
}

export default App;
