import React, { useCallback, useState } from 'react';
import { Radio, Button } from 'antd';
import StyledCollapse from './StyledCollapse';
import municipios from '../../../../GeoJsonFiles/municipio.json';
import { getMapboxRef } from '../../../mapboxgl/MapRef';

const { Panel } = StyledCollapse;

function Tematico() {
  const [year, setYear] = useState(2015);
  const [loading, setLoading] = useState(false);

  const fetchAntropometria = useCallback(() => {
    const myRequest = new Request(`http://localhost:5000/municipios/${year}`);
    return fetch(myRequest)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        throw new Error('Ops! Houve um erro em nosso servidor.');
      })
      .then((response) => response).catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error);
      });
  }, [year]);

  // Necessário pois salvar mais de um ano estava ultrapassando o limite do localstorage.
  const cleanLocalStorage = useCallback(() => {
    [2015, 2016, 2017, 2018, 2019, 2020].forEach((y) => {
      if (y !== year) {
        localStorage.removeItem(`antropometria-${y}`);
      }
    });
  }, [year]);

  const getAntropometria = useCallback(async () => {
    let antropometria = localStorage.getItem(`antropometria-${year}`);
    if (!antropometria) {
      antropometria = await fetchAntropometria();
      cleanLocalStorage();
      localStorage.setItem(`antropometria-${year}`, JSON.stringify(antropometria));
    } else {
      antropometria = JSON.parse(antropometria);
    }
    return antropometria;
  },
  [year, fetchAntropometria, cleanLocalStorage]);

  const getColor = useCallback((valor) => {
    let color = '#AAAAAA';
    if (valor < 5) {
      color = '#16a716';
    } else if (valor >= 5 && valor < 10) {
      color = '#7FFF00';
    } else if (valor >= 10 && valor < 20) {
      color = '#FFFF00';
    } else if (valor >= 20 && valor < 30) {
      color = '#FFA500';
    } else if (valor >= 30) {
      color = '#FF0000';
    }
    return color;
  }, []);

  const agregarDados = useCallback(async () => {
    const antropometria = await getAntropometria();
    let municipiosCopy = municipios.features;
    municipiosCopy = await municipiosCopy.map(
      (mun) => {
        const municipioAntropometria = antropometria
          .find((m) => m.municipio.municipio === mun.properties.GEOCODIGO);
        const { municipio: ant } = municipioAntropometria;
        const valorCompare = ant.tx_registros_f_sobrepeso
        + ant.tx_registros_m_sobrepeso
        + ant.tx_registros_f_obesidade
        + ant.tx_registros_m_obesidade;
        return {
          geometry: mun.geometry,
          properties: {
            ...mun.properties,
            [`ant_${year}`]: ant,
            color: getColor(valorCompare),
          },
        };
      },
    );
    return { ...municipios, features: municipiosCopy };
  }, [getAntropometria, getColor, year]);

  const updateEstiloMapa = useCallback(async () => {
    const map = getMapboxRef();
    const dataToShow = await agregarDados();
    if (map.getLayer('municipios_tematico')) {
      map.removeLayer('municipios_tematico');
    }
    if (map.getSource('tematico')) {
      map.removeSource('tematico');
    }
    map.addSource('tematico', {
      type: 'geojson',
      data: dataToShow,
      generateId: true,
    });
    map.addLayer({
      id: 'municipios_tematico',
      source: 'tematico',
      type: 'fill',
      minzoom: 3,
      paint: {
        'fill-outline-color': '#00ffff',
        'fill-color': ['get', 'color'],
      },
    });
  }, [agregarDados]);

  const handleAplicar = useCallback(async () => {
    setLoading(true);
    updateEstiloMapa();
    setLoading(false);
  }, [updateEstiloMapa]);

  return (
    <StyledCollapse size="small">
      <Panel header="Temático" key="1">
        <Radio.Group onChange={(e) => setYear(e.target.value)} value={year} size="small">
          <Radio.Button value={2015}>2015</Radio.Button>
          <Radio.Button value={2016}>2016</Radio.Button>
          <Radio.Button value={2017}>2017</Radio.Button>
          <Radio.Button value={2018}>2018</Radio.Button>
          <Radio.Button value={2019}>2019</Radio.Button>
          <Radio.Button value={2020}>2020</Radio.Button>
        </Radio.Group>
        <div>
          <div>
            <span style={{ fontWeight: 'bold', fontSize: 14 }}>
              Valor = Sobrepeso+Obesidade (%)
            </span>
          </div>
          <div>
            <div style={{
              backgroundColor: '#16a716', paddingLeft: 5, color: '#3b3f46', fontWeight: 'bold', borderRadius: '10px',
            }}
            >
              <span>{'Valor<5'}</span>
            </div>
            <div style={{
              backgroundColor: '#7FFF00', paddingLeft: 5, color: '#3b3f46', fontWeight: 'bold', borderRadius: '10px',
            }}
            >
              {'Valor>=5 e Valor<10'}
            </div>
            <div style={{
              backgroundColor: '#FFFF00', paddingLeft: 5, color: '#3b3f46', fontWeight: 'bold', borderRadius: '10px',
            }}
            >
              <span>{'Valor>=10 e Valor<20'}</span>
            </div>
            <div style={{
              backgroundColor: '#FFA500', paddingLeft: 5, color: '#3b3f46', fontWeight: 'bold', borderRadius: '10px',
            }}
            >
              <span>{'Valor>=20 e Valor<30'}</span>
            </div>
            <div style={{
              backgroundColor: '#FF0000', paddingLeft: 5, color: '#3b3f46', fontWeight: 'bold', borderRadius: '10px',
            }}
            >
              <span>{'Valor>=30'}</span>
            </div>
          </div>
        </div>
        <Button
          size="small"
          type="primary"
          style={{
            width: '100%', margin: '10px 0px', backgroundColor: '#4CAF50', borderColor: '#00FF00',
          }}
          onClick={handleAplicar}
          loading={loading}
        >
          Aplicar
        </Button>
      </Panel>
    </StyledCollapse>
  );
}

export default Tematico;
