import './App.css';
import map from './components/mapboxgl'
import {useEffect} from 'react';
import SinglePageStructure from './SinglePageStructure'

function App() {
  useEffect(() => {
    map()
  },[])
  return (
    <SinglePageStructure />
  );
}

export default App;
