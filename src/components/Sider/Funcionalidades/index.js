import React, { useCallback, useState } from 'react';
import { Button, Row, Col } from 'antd';
import mapboxgl from 'mapbox-gl';
import { getMapboxRef } from '../../mapboxgl/MapRef';
import Tematico from './Tematico';
import Municipio from './Municipio';

function Funcionalidades() {
  const [visibleModalMunicipio, setVisibleModalMunicipio] = useState(false);
  const [municipioIdentificado, setMunicipioIdentificado] = useState(undefined);

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
    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
    });
    map.on('click', 'municipios', (e) => {
      const coordinates = e.features[0].geometry.coordinates.slice();
      const { NOME, UF, GEOCODIGO: codigoIbge } = e.features[0].properties;

      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      const a = `<strong>Município: ${NOME}-${UF}</strong>`;
      new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(a)
        .addTo(map);
      setMunicipioIdentificado(codigoIbge);
      setVisibleModalMunicipio(true);
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
        const { NOME, UF } = e.features[0].properties;
        popup.setLngLat(e.lngLat).setHTML(`Município: ${NOME} - (${UF})`).addTo(map);
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
      map.getCanvas().style.cursor = '';
      popup.remove();
    });

    map.on('mouseenter', 'municipios', () => {
      map.getCanvas().style.cursor = 'pointer';
    });
  }, []);

  return (
    <>
      <Row gutter={[8, 16]} justify="center">
        <Col span={22}>
          <Button style={{ width: '100%', marginTop: 10 }} type="primary" onClick={handleIdentificarEstados}> Identificar Estado</Button>
        </Col>
      </Row>
      <Row gutter={[8, 16]} justify="center">
        <Col span={22}>
          <Button style={{ width: '100%', marginTop: 5 }} type="primary" onClick={handleIdentificarMunicipios}> Identificar Município</Button>
        </Col>
      </Row>

      <Row gutter={[8, 16]} justify="center">
        <Col span={22} style={{ width: '100%', marginTop: 5 }}>
          <Tematico />
        </Col>
      </Row>
      <Municipio
        visible={visibleModalMunicipio}
        setVisible={setVisibleModalMunicipio}
        municipioIdentificado={municipioIdentificado}
        setMunicipioIdentificado={setMunicipioIdentificado}
      />
    </>
  );
}

export default Funcionalidades;
