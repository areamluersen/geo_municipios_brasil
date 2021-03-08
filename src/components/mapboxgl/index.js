import mapboxgl from 'mapbox-gl';
import '../../SinglePageStructure.css';
import { setMapboxRef } from './MapRef';

function initializeMap() {
  mapboxgl.accessToken = 'pk.eyJ1IjoiYXJlYW1sdWVyc2VuIiwiYSI6ImNrbGlnd25zNjFraXEybm82Z2VpdTl6bGEifQ.zu6zJsM8BaE-3A6-v4skDw';
  const map = new mapboxgl.Map({
    container: 'here-is-the-map',
    style: 'mapbox://styles/mapbox/streets-v11',
  });

  setMapboxRef(map);

  map.on('load', () => {
    map.addSource('estados_br', {
      type: 'vector',
      url: 'mapbox://areamluersen.estados_br',
    });
    map.addSource('municipios_br', {
      type: 'vector',
      url: 'mapbox://areamluersen.municipios_br',
    });
    map.addLayer({
      id: 'estados',
      source: 'estados_br',
      'source-layer': 'estados_br',
      type: 'fill',
      paint: {
        'fill-opacity': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          0.8,
          0.4,
        ],
        'fill-color': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          '#FFFF00',
          '#4264fb',
        ],
      },
    });
    map.addLayer({
      id: 'municipios',
      source: 'municipios_br',
      'source-layer': 'municipios_br',
      type: 'fill',
      paint: {
        'fill-outline-color': '#00ffff',
        'fill-opacity': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          0.8,
          0.4,
        ],
        'fill-color': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          '#FFFF00',
          '#627BC1',
        ],
      },
    });
    map.addLayer({
      id: 'estados_line',
      source: 'estados_br',
      'source-layer': 'estados_br',
      type: 'line',
      paint: {
        'line-color': '#0000ff',
        'line-width': 2,
      },
    });

    map.fitBounds([[
      -77.6953125,
      9.795677582829743,
    ],
    [
      -36.123046875,
      -33.43144133557529,
    ]]);
  });
}

export default initializeMap;
