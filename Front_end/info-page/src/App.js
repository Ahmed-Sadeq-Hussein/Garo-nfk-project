//App.js. Ahmed Hussein

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SectionPie from './SectionPie';
import TagSlider from './TagSlider';
import './App.css';


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SectionPie />} />
        <Route path="/section/:id" element={<TagSlider />} />
      </Routes>
    </Router>
  );
}
