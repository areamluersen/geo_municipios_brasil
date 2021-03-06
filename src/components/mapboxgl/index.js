import mapboxgl from 'mapbox-gl';
import '../../SinglePageStructure.css';

function initializeMap() {
  mapboxgl.accessToken = 'pk.eyJ1IjoiYXJlYW1sdWVyc2VuIiwiYSI6ImNrbGlnd25zNjFraXEybm82Z2VpdTl6bGEifQ.zu6zJsM8BaE-3A6-v4skDw';
  const map = new mapboxgl.Map({
    container: 'here-is-the-map',
    style: 'mapbox://styles/mapbox/streets-v11',
  });
  map.fitBounds([[
    -77.6953125,
    9.795677582829743,
  ],
  [
    -36.123046875,
    -33.43144133557529,
  ]]);

  map.on('load', () => {
    map.addSource('route', {
      type: 'geojson',
      data: { type: 'Feature', properties: { id: '4216602', name: 'São José', description: 'São José' }, geometry: { type: 'Polygon', coordinates: [[[-48.6795273077, -27.5300966456], [-48.6725792455, -27.5395749464], [-48.6678443685, -27.5379977475], [-48.6649092677, -27.5313978839], [-48.6564079913, -27.5366444049], [-48.6538181932, -27.5436339397], [-48.6495121585, -27.5414910683], [-48.6352150412, -27.5352256428], [-48.6307480702, -27.5290794135], [-48.5742851322, -27.5165645583], [-48.5773874431, -27.5308122985], [-48.5678003515, -27.5450405084], [-48.5720991535, -27.5513313209], [-48.6002027924, -27.5725928681], [-48.6055067783, -27.5879726842], [-48.6056366689, -27.6006910933], [-48.6125325620, -27.6140568508], [-48.6100898987, -27.6267540033], [-48.5939006569, -27.6414755297], [-48.6010740092, -27.6613012185], [-48.6218163961, -27.6574443874], [-48.6358767178, -27.6507000205], [-48.6434942910, -27.6427536659], [-48.6423171905, -27.6352280239], [-48.6430179110, -27.6272544202], [-48.6532268357, -27.6219131147], [-48.6662723662, -27.6067102618], [-48.6707147008, -27.6190931777], [-48.6888575419, -27.6122081663], [-48.7382030022, -27.6142943730], [-48.7456003679, -27.6150285327], [-48.7452697785, -27.5954033669], [-48.7353306906, -27.5905932875], [-48.7308353010, -27.5832618912], [-48.7353341241, -27.5814830432], [-48.7300028569, -27.5746574962], [-48.7320182096, -27.5668630073], [-48.7270555072, -27.5526559968], [-48.7225953545, -27.5362912170], [-48.7167485532, -27.5275689864], [-48.7051026381, -27.5252341169], [-48.7050268133, -27.5252096328], [-48.6926078596, -27.5223790154], [-48.6909303989, -27.5193643163], [-48.6795896017, -27.5218595896], [-48.6795273077, -27.5300966456]]] } },
    });
    map.addLayer({
      id: 'route',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#0033ff',
        'line-width': 6,
      },
    });
    map.addLayer(
      {
        id: 'route-fill',
        type: 'fill',
        source: 'route',
        paint: {
          'fill-color': 'rgba(255, 255, 0, 0.5)',
        },
      },
    );
    map.on('click', 'route-fill', (e) => {
      console.log('🚀 --------------------------------------------');
      console.log('🚀 ~ file: index.js ~ line 49 ~ map.on ~ e', e);
      console.log('🚀 --------------------------------------------');
      const coordinates = e.features[0].geometry.coordinates.slice();
      const { description } = e.features[0].properties;
      console.log('🚀 --------------------------------------------------');
      console.log('🚀 ~ file: index.js ~ line 52 ~ map.on ~ name', description);
      console.log('🚀 --------------------------------------------------');

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      const a = `<strong>Meu amor mora aqui! Pam - ${description}</strong>`;
      new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(a)
        .addTo(map);
    });

    // Change the cursor to a pointer when the mouse is over the places layer.
    map.on('mouseenter', 'route-fill', () => {
      map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'route-fill', () => {
      map.getCanvas().style.cursor = '';
    });
  });
}

export default initializeMap;
