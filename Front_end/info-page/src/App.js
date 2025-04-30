import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SectionPie from './SectionPie';
import FeatureSlider from './generated/FeatureSlider'; // adjust this path

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SectionPie />} />
        <Route path="/section/:id" element={<FeatureSlider />} />
      </Routes>
    </Router>
  );
}
