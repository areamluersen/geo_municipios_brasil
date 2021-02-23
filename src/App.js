import './App.css';
import map from './components/mapboxgl'
import {useEffect} from 'react';

function App() {
  useEffect(() => {
    map()
  },[])
  return (
    <div className="App">
      <header className="App-header">
        <div id="here-is-the-map" style={{width: 800, height: 800}}/>
      </header>
    </div>
  );
}

export default App;
