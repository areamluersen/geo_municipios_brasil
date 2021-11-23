import './App.css';
import React, { useEffect } from 'react';
import dotenv from 'dotenv';
import map from './components/mapboxgl';
import SinglePageStructure from './SinglePageStructure';

function App() {
  dotenv.config();
  useEffect(() => {
    map();
  }, []);
  return (
    <SinglePageStructure />
  );
}

export default App;
