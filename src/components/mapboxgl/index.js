import mapboxgl from 'mapbox-gl';
import '../../SinglePageStructure.css';

function initializeMap() {
  mapboxgl.accessToken = 'pk.eyJ1IjoiYXJlYW1sdWVyc2VuIiwiYSI6ImNrbGlnd25zNjFraXEybm82Z2VpdTl6bGEifQ.zu6zJsM8BaE-3A6-v4skDw';
  const map = new mapboxgl.Map({
    container: 'here-is-the-map',
    style: 'mapbox://styles/mapbox/streets-v11',
  });

  let hoveredStateId = null;

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
        'fill-color': 'rgba(66,100,251, 0.3)',
        'fill-outline-color': '#0000ff',
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

    map.on('click', 'municipios', (e) => {
      const coordinates = e.features[0].geometry.coordinates.slice();
      const { NOME, UF } = e.features[0].properties;

      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      const a = `<strong>Município: ${NOME}-${UF}</strong>`;
      new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(a)
        .addTo(map);
    });
    map.on('mousemove', 'municipios', (e) => {
      if (e.features.length > 0) {
        if (hoveredStateId) {
          map.setFeatureState(
            { source: 'municipios_br', sourceLayer: 'municipios_br', id: hoveredStateId },
            { hover: false },
          );
        }
        hoveredStateId = e.features[0].id;
        map.setFeatureState(
          { source: 'municipios_br', sourceLayer: 'municipios_br', id: hoveredStateId },
          { hover: true },
        );
      }
    });

    // When the mouse leaves the state-fill layer, update the feature state of the
    // previously hovered feature.
    map.on('mouseleave', 'municipios', () => {
      if (hoveredStateId) {
        map.setFeatureState(
          { source: 'municipios_br', sourceLayer: 'municipios_br', id: hoveredStateId },
          { hover: false },
        );
      }
      hoveredStateId = null;
    });

    // Change the cursor to a pointer when the mouse is over the places layer.
    map.on('mouseenter', 'estados', () => {
      map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'estados', () => {
      map.getCanvas().style.cursor = '';
    });
  });
}

export default initializeMap;
