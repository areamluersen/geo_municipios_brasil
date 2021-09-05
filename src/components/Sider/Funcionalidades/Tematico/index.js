import React, { useCallback, useState } from 'react';
import { Radio, Button } from 'antd';
import StyledCollapse from './StyledCollapse';
import municipios from '../../../../GeoJsonFiles/municipio.json';
import { getMapboxRef } from '../../../mapboxgl/MapRef';

const { Panel } = StyledCollapse;

const initialTotais = {
  faixa1: 0,
  faixa2: 0,
  faixa3: 0,
  faixa4: 0,
  faixa5: 0,
};

function Tematico() {
  const [year, setYear] = useState(2015);
  const [loading, setLoading] = useState(false);
  const [totais, setTotais] = useState(initialTotais);
  console.log('🚀 ------------------------------------------------------------------------------');
  console.log('🚀 ~ file: index.js ~ line 21 ~ Tematico ~ totais, setTotais', totais, setTotais);
  console.log('🚀 ------------------------------------------------------------------------------');

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

  const countFaixasPercentuais = useCallback(async () => {
    const antropometria = await getAntropometria();
    const faixa1 = antropometria.filter((ant) => (ant.municipio.tx_registros_f_sobrepeso
      + ant.municipio.tx_registros_m_sobrepeso
      + ant.municipio.tx_registros_f_obesidade
      + ant.municipio.tx_registros_m_obesidade) < 5).length;
    const faixa2 = antropometria.filter((ant) => (ant.municipio.tx_registros_f_sobrepeso
        + ant.municipio.tx_registros_m_sobrepeso
        + ant.municipio.tx_registros_f_obesidade
        + ant.municipio.tx_registros_m_obesidade) >= 5
        && (ant.municipio.tx_registros_f_sobrepeso
        + ant.municipio.tx_registros_m_sobrepeso
        + ant.municipio.tx_registros_f_obesidade
        + ant.municipio.tx_registros_m_obesidade) < 10).length;
    const faixa3 = antropometria.filter((ant) => (ant.municipio.tx_registros_f_sobrepeso
        + ant.municipio.tx_registros_m_sobrepeso
        + ant.municipio.tx_registros_f_obesidade
        + ant.municipio.tx_registros_m_obesidade) >= 10
        && (ant.municipio.tx_registros_f_sobrepeso
        + ant.municipio.tx_registros_m_sobrepeso
        + ant.municipio.tx_registros_f_obesidade
        + ant.municipio.tx_registros_m_obesidade) < 20).length;
    const faixa4 = antropometria.filter((ant) => (ant.municipio.tx_registros_f_sobrepeso
        + ant.municipio.tx_registros_m_sobrepeso
        + ant.municipio.tx_registros_f_obesidade
        + ant.municipio.tx_registros_m_obesidade) >= 20
        && (ant.municipio.tx_registros_f_sobrepeso
        + ant.municipio.tx_registros_m_sobrepeso
        + ant.municipio.tx_registros_f_obesidade
        + ant.municipio.tx_registros_m_obesidade) < 30).length;
    const faixa5 = antropometria.filter((ant) => (ant.municipio.tx_registros_f_sobrepeso
        + ant.municipio.tx_registros_m_sobrepeso
        + ant.municipio.tx_registros_f_obesidade
        + ant.municipio.tx_registros_m_obesidade) >= 30).length;

    setTotais({
      faixa1, faixa2, faixa3, faixa4, faixa5,
    });
  }, [getAntropometria]);

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
    countFaixasPercentuais();
    return { ...municipios, features: municipiosCopy };
  }, [countFaixasPercentuais, getAntropometria, getColor, year]);

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
          <div style={{
            backgroundColor: '#49505f', margin: '10px 0px 3px', padding: '0px 10px', color: '#FFFFFF', fontWeight: 'bold', borderRadius: '3px', display: 'flex', justifyContent: 'space-between',
          }}
          >
            <span>Faixa de Filtro</span>
            <span>Municipios</span>
          </div>
          <div style={{
            backgroundColor: '#16a716', padding: '0px 10px', color: '#3b3f46', fontWeight: 'bold', borderRadius: '10px', display: 'flex', justifyContent: 'space-between',
          }}
          >
            <span>{'Valor<5'}</span>
            <span>{`${totais.faixa1}`}</span>
          </div>
          <div style={{
            backgroundColor: '#7FFF00', padding: '0px 10px', color: '#3b3f46', fontWeight: 'bold', borderRadius: '10px', display: 'flex', justifyContent: 'space-between',
          }}
          >
            <span>{'Valor>=5 e Valor<10'}</span>
            <span>{`${totais.faixa2}`}</span>
          </div>
          <div style={{
            backgroundColor: '#FFFF00', padding: '0px 10px', color: '#3b3f46', fontWeight: 'bold', borderRadius: '10px', display: 'flex', justifyContent: 'space-between',
          }}
          >
            <span>{'Valor>=10 e Valor<20'}</span>
            <span>{`${totais.faixa3}`}</span>
          </div>
          <div style={{
            backgroundColor: '#FFA500', padding: '0px 10px', color: '#3b3f46', fontWeight: 'bold', borderRadius: '10px', display: 'flex', justifyContent: 'space-between',
          }}
          >
            <span>{'Valor>=20 e Valor<30'}</span>
            <span>{`${totais.faixa4}`}</span>
          </div>
          <div style={{
            backgroundColor: '#FF0000', padding: '0px 10px', color: '#3b3f46', fontWeight: 'bold', borderRadius: '10px', display: 'flex', justifyContent: 'space-between',
          }}
          >
            <span>{'Valor>=30'}</span>
            <span>{`${totais.faixa5}`}</span>
          </div>
          <div>
            <span style={{ fontWeight: 'bold', fontSize: 12 }}>
              Valor = Sobrepeso+Obesidade (%)
            </span>
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
