import React, { useCallback, useEffect, useState } from 'react';
import { Spin } from 'antd';
import StyledCollapse from '../Tematico/StyledCollapse';
import { StyledModal } from './styled';
import Descriptions from './Descriptions';
import Antropometria from './Antropometria';

const { Panel } = StyledCollapse;

const initMunicipio = {
  name: '-',
  uf: '-',
  municipio: 0,
};

function Municipio({
  visible, setVisible, municipioIdentificado, setMunicipioIdentificado,
}) {
  const [data, setData] = useState(initMunicipio);
  const [loading, setLoading] = useState(false);

  const fetchMunicipio = useCallback(() => {
    console.log('🚀 ~ file: index.js ~ line 24 ~ fetchMunicipio ~ process.env', process.env);
    const myRequest = new Request(`${process.env.REACT_APP_API}/municipio/${municipioIdentificado}`);
    console.log('🚀 ~ file: index.js ~ line 24 ~ fetchMunicipio ~ myRequest', myRequest);
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
  }, [municipioIdentificado]);

  useEffect(() => {
    if (municipioIdentificado) {
      setLoading(true);
      fetchMunicipio().then((resp) => {
        setData(resp);
        setLoading(false);
      });
    }
  }, [fetchMunicipio, municipioIdentificado]);

  const handleCloseModal = useCallback(() => {
    setVisible(false);
    setMunicipioIdentificado(undefined);
    setData(initMunicipio);
  }, [setMunicipioIdentificado, setVisible]);
  return (
    <StyledModal
      title={(
        <strong style={{ color: '#182bb3e0', fontSize: 18 }}>
          {data?.name}
          -
          {data?.uf}
        </strong>
)}
      visible={visible}
      footer={null}
      onOk={handleCloseModal}
      onCancel={handleCloseModal}
      loaging={loading}
      width={1000}
    >
      <Spin spinning={loading}>
        <StyledCollapse defaultActiveKey={['1']}>
          <Panel header="Informações Gerais" key="1">
            <Descriptions data={data} />
          </Panel>
          <Panel header="Antropometria - 2015 a 2020" key="2">
            {data.municipio > 0 && <Antropometria data={data} />}
          </Panel>
        </StyledCollapse>
      </Spin>
    </StyledModal>
  );
}

export default Municipio;
