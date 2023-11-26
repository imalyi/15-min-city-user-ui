import React from 'react';
import Home from './componennts/Home';
import About from './componennts/About';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/home" />}
        />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
