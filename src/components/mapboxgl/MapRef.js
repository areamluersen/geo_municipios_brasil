import { createRef } from 'react';

const mapboxRef = createRef();

const getMapboxRef = () => mapboxRef.current;

const setMapboxRef = (atual) => {
  mapboxRef.current = atual;
};

export { getMapboxRef, setMapboxRef };
