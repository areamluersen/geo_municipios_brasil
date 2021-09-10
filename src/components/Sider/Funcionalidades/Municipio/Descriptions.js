import React from 'react';
import { StyledDesc } from './styled';

function Descriptions({ data }) {
  return (
    <div>
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
    </div>
  );
}

export default Descriptions;
