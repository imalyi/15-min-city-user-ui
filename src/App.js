import React from 'react';
import Home from './componennts/Home';
import AboutUs from './componennts/AboutUs';
import ShowDataPage from './componennts/ShowDataPage';
import Report from './componennts/Report';
import Compare from './componennts/Compare';
import HeatmapComponent from './componennts/HeatMapComponent';
import SignIn from './componennts/SignIn';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useEffect } from 'react';
import ErrorBoundary from './componennts/ErrorBoundary';

function App() {
  const [cookies, setCookie] = useCookies(['token']);
  const location = useLocation();

  useEffect(() => {
    if (!cookies.token && location.pathname !== '/sign-in') {
      window.location.href = '/sign-in';
    }
  }, [cookies.token, location.pathname]);
  
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/show-addresses" element={<ShowDataPage />} />
      <Route path="/report" element={<Report />} />
      <Route path="/compare" element={<Compare />} />
      <Route path="/heatmap" element={<HeatmapComponent />} />
      <Route path="/about-us" element={<AboutUs />} />
      <Route path="/sign-in" element={<SignIn />} />
    </Routes>
  );
}

function AppWrapper() {
  return (
    <Router>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </Router>
  );
}

export default AppWrapper;
