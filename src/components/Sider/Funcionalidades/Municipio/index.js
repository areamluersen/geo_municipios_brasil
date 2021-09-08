import React, { useCallback, useEffect, useState } from 'react';
import { Spin } from 'antd';
import StyledCollapse from '../Tematico/StyledCollapse';
import { StyledDesc, StyledModal } from './styled';

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
    const myRequest = new Request(`http://localhost:5000/municipio/${municipioIdentificado}`);
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
            <StyledDesc title="Caracterização espacial " bordered size="small" column={3}>
              <StyledDesc.Item label="Código IBGE">{data.municipio}</StyledDesc.Item>
              <StyledDesc.Item label="Meso região">{data.mesoregion_name}</StyledDesc.Item>
              <StyledDesc.Item label="Micro região">{data.microregion_name}</StyledDesc.Item>
            </StyledDesc>
            <StyledDesc title="Renda, Índice de GINI e IDHM" bordered size="small" column={2}>
              <StyledDesc.Item label="Renda per capita 2010">
                {data.renda_per_capita_2010_censo}
                {' '}
                R$
              </StyledDesc.Item>
              <StyledDesc.Item label="Índice de GINI 2010">{data.indice_gini_2010}</StyledDesc.Item>
              <StyledDesc.Item label="IDHM 2010">{data.idhm_2010_censo}</StyledDesc.Item>
              <StyledDesc.Item label="IDHM renda 2010">{data.idhm_renda_2010_censo}</StyledDesc.Item>
              <StyledDesc.Item label="IDHM educação 2010">{data.idhm_educacao_2010_censo}</StyledDesc.Item>
              <StyledDesc.Item label="IDHM longevidade 2010">{data.idhm_longevidade_2010_censo}</StyledDesc.Item>
            </StyledDesc>
            <StyledDesc title="Educação e Trabalho" bordered size="small" column={2}>

              <StyledDesc.Item label="Freq. líquida ens. fund. 2010 ">
                {data.tx_freq_liq_ens_fund_2010}
                {' '}
                %
              </StyledDesc.Item>
              <StyledDesc.Item label="Taxa evasão rede púb. fund. 2014">
                {data.tx_evasao_rede_publica_fund_2014}
                {' '}
                %
              </StyledDesc.Item>
              <StyledDesc.Item label="Taxa atividade 10 a 14 anos 2010">
                {data.tx_atividade_10a14_anos_2010}
                {' '}
                %
              </StyledDesc.Item>
              <StyledDesc.Item label="Taxa atividade 10 anos ou mais 2010">
                {data.tx_atividade_10_anos_ou_mais_2010}
                {' '}
                %
              </StyledDesc.Item>
              <StyledDesc.Item label="Taxa ocup. 18 anos ou mais 2010">
                {data.tx_ocupacao_18_anos_ou_mais_2010}
                {' '}
                %
              </StyledDesc.Item>
              <StyledDesc.Item label="Taxa desocup. 18 anos ou mais 2010">
                {data.tx_desocupacao_18_anos_ou_mais_2010}
                {' '}
                %
              </StyledDesc.Item>
            </StyledDesc>
            <StyledDesc title="População" bordered size="small" column={2}>
              <StyledDesc.Item label="Populacao 2010">{data.populacao_2010}</StyledDesc.Item>
              <StyledDesc.Item label="Populacao 10 a 14 anos 2010">{data.populacao_10a14_anos_2010}</StyledDesc.Item>
              <StyledDesc.Item label="Populacao 5 a 9 anos M 2010">{data.populacao_5a9_anos_m_2010}</StyledDesc.Item>
              <StyledDesc.Item label="Populacao 5 a 9 anos F 2010">{data.populacao_5a9_anos_f_2010}</StyledDesc.Item>
            </StyledDesc>
          </Panel>
          <Panel header="Antropometria - 2015 a 2020" key="2">
            Aqui vai o conteúdo.
            <br />
            Graficuzinho bunitinho.
            <br />
            Como o abacatinho
            <br />
            <img src="https://trevo.us/wp-content/uploads/2019/10/image_preview-3.jpg" alt="Abacate" />
          </Panel>
        </StyledCollapse>
      </Spin>
    </StyledModal>
  );
}

export default Municipio;
