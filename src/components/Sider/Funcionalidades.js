import React, { useCallback } from 'react';
import { Button, Row, Col } from 'antd';
import mapboxgl from 'mapbox-gl';
import { getMapboxRef } from '../mapboxgl/MapRef';
import municipios from '../../GeoJsonFiles/municipios_antropometria.json';

function Funcionalidades() {
  const handleIdentificarEstados = useCallback(() => {
    let hoveredStateId = null;
    const map = getMapboxRef();
    map.on('click', 'estados', (e) => {
      const coordinates = e.features[0].geometry.coordinates.slice();
      const { UF_05, NOME_UF } = e.features[0].properties;

      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      const a = `<strong>Estado: ${UF_05}-${NOME_UF}</strong>`;
      new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(a)
        .addTo(map);
    });
    map.on('mousemove', 'estados', (e) => {
      if (e.features.length > 0) {
        if (hoveredStateId) {
          map.setFeatureState(
            { source: 'estados_br', id: hoveredStateId },
            { hover: false },
          );
        }
        hoveredStateId = e.features[0].id;
        map.setFeatureState(
          { source: 'estados_br', id: hoveredStateId },
          { hover: true },
        );
      }
    });

    map.on('mouseleave', 'estados', () => {
      if (hoveredStateId) {
        map.setFeatureState(
          { source: 'estados_br', id: hoveredStateId },
          { hover: false },
        );
      }
      hoveredStateId = null;
    });

    map.on('mouseenter', 'estados', () => {
      map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'estados', () => {
      map.getCanvas().style.cursor = '';
    });
  }, []);

  const handleIdentificarMunicipios = useCallback(() => {
    let hoveredStateId = null;
    const map = getMapboxRef();
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
            { source: 'municipios_br', id: hoveredStateId },
            { hover: false },
          );
        }
        hoveredStateId = e.features[0].id;
        map.setFeatureState(
          { source: 'municipios_br', id: hoveredStateId },
          { hover: true },
        );
      }
    });

    map.on('mouseleave', 'municipios', () => {
      if (hoveredStateId) {
        map.setFeatureState(
          { source: 'municipios_br', id: hoveredStateId },
          { hover: false },
        );
      }
      hoveredStateId = null;
    });
    map.on('mouseenter', 'municipios', () => {
      map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'municipios', () => {
      map.getCanvas().style.cursor = '';
    });
  }, []);

  const consoleMunicipios = useCallback(() => {
    console.log(municipios);
  }, []);

  const fetchMunicipioAntropometria = useCallback((year = 2015) => {
    const myRequest = new Request(`http://localhost:5000/municipios/${year}`);
    return fetch(myRequest)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        throw new Error('Ops! Houve um erro em nosso servidor.');
      })
      .then((response) => response).catch((error) => {
        console.error(error);
      });
  }, []);

  // Função busca atualiza geojson original e baixa cópia com os dados antropométricos.
  const iterarPelosMunicipiosGeoJsonEAgregarDados = useCallback(() => {
    let municipiosCopy = municipios.features;
    [2015, 2016, 2017, 2018, 2019, 2020].forEach(async (year) => {
      const municipiosAntropometria = await fetchMunicipioAntropometria(year);
      municipiosCopy = await municipiosCopy.map(
        (mun) => {
          const municipioAntropometria = municipiosAntropometria
            .find((m) => m.municipio.municipio === mun.properties.GEOCODIGO);
          return {
            geometry: mun.geometry,
            properties: { ...mun.properties, [`ant_${year}`]: municipioAntropometria.municipio },
          };
        },
      );
      if (municipiosCopy[0]?.properties?.ant_2015
        && municipiosCopy[0]?.properties?.ant_2016
        && municipiosCopy[0]?.properties?.ant_2017
        && municipiosCopy[0]?.properties?.ant_2018
        && municipiosCopy[0]?.properties?.ant_2019
        && municipiosCopy[0]?.properties?.ant_2020) {
        const jsonData = { ...municipios, features: municipiosCopy };
        const jsonContent = JSON.stringify(jsonData);
        const filename = 'municipios_antropometria.json';
        const filetype = 'text/json;charset=utf-8';

        const a = document.createElement('a');
        const dataURI = `data:${filetype};base64,${window.btoa(jsonContent)}`;
        a.href = dataURI;
        a.download = filename;
        const e = document.createEvent('MouseEvents');
        e.initMouseEvent('click', true, false,
          document.defaultView, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        a.dispatchEvent(e);
        a.removeNode();
      }
    });
  }, []);

  return (
    <>
      <Row gutter={[8, 8]} justify="center">
        <Col span={22}>
          <Button style={{ width: '100%', marginTop: 10 }} type="primary" onClick={handleIdentificarEstados}> Identificar Estados</Button>
        </Col>
      </Row>
      <Row gutter={[8, 8]} justify="center">
        <Col span={22}>
          <Button style={{ width: '100%', marginTop: 5 }} type="primary" onClick={handleIdentificarMunicipios}> Identificar Municípios</Button>
        </Col>
      </Row>
      <Row gutter={[8, 8]} justify="center">
        <Col span={22}>
          <Button
            style={{ width: '100%', marginTop: 5 }}
            type="primary"
            onClick={iterarPelosMunicipiosGeoJsonEAgregarDados}
          >
            {' '}
            Agregar Dados

          </Button>
        </Col>
      </Row>
      <Row gutter={[8, 8]} justify="center">
        <Col span={22}>
          <Button style={{ width: '100%', marginTop: 5 }} type="primary" onClick={consoleMunicipios}>console municipios</Button>
        </Col>
      </Row>

    </>
  );
}

export default Funcionalidades;
