import mapboxgl from 'mapbox-gl';
import '../../SinglePageStructure.css';
import { setMapboxRef } from './MapRef';
import uf from '../../GeoJsonFiles/uf.json';
import municipios from '../../GeoJsonFiles/municipio.json';

function initializeMap() {
  mapboxgl.accessToken = 'pk.eyJ1IjoidmlraW5nZGFyayIsImEiOiJja20ybHZ2encxOTRvMm9xbW5iNmFiMXR6In0.vYDn71tuvn1HDW7c4k8dkw';
  const map = new mapboxgl.Map({
    container: 'here-is-the-map',
    style: 'mapbox://styles/mapbox/streets-v11',
  });

  setMapboxRef(map);

  map.on('load', () => {
    map.addSource('estados_br', {
      type: 'geojson',
      data: uf,
      // data: 'https://raw.githubusercontent.com/areamluersen/personal_geojson_brasil/master/uf.json',
      generateId: true,
    });
    map.addSource('municipios_br', {
      type: 'geojson',
      // data: 'https://raw.githubusercontent.com/areamluersen/personal_geojson_brasil/master/municipio.json',
      data: municipios,
      generateId: true,
    });
    map.addLayer({
      id: 'estados',
      source: 'estados_br',
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
      type: 'fill',
      minzoom: 5,
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
