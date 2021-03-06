import './App.css';
import React, { useEffect } from 'react';
import map from './components/mapboxgl';
import SinglePageStructure from './SinglePageStructure';

function App() {
  useEffect(() => {
    map();
  }, []);
  return (
    <SinglePageStructure />
  );
}

export default App;
