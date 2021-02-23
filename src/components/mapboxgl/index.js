import mapboxgl from 'mapbox-gl';


function map(){
        mapboxgl.accessToken = 'pk.eyJ1IjoiYXJlYW1sdWVyc2VuIiwiYSI6ImNrbGlnd25zNjFraXEybm82Z2VpdTl6bGEifQ.zu6zJsM8BaE-3A6-v4skDw';
        new mapboxgl.Map({
            container: 'here-is-the-map',
            style: 'mapbox://styles/mapbox/streets-v11'
        });
}

export default map;