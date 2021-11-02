/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Line } from '@ant-design/charts';

const Antropometria = ({ data }) => {
  const getDataPercentWithPattern = () => {
    const resp = [2015, 2016, 2017, 2018, 2019, 2020].map((key) => (
      [
        { condicao: 'Magreza', year: key, taxa: data[key].magreza_f + data[key].magreza_m },
        { condicao: 'Eutrofia', year: key, taxa: data[key].eutrofia_f + data[key].eutrofia_m },
        { condicao: 'Risco Sobrepeso', year: key, taxa: data[key].risco_sobrepeso_f + data[key].risco_sobrepeso_f },
        { condicao: 'Sobrepeso', year: key, taxa: data[key].sobrepeso_f + data[key].sobrepeso_m },
        { condicao: 'Obesidade', year: key, taxa: data[key].obesidade_obesidade_grave_f + data[key].obesidade_obesidade_grave_m },
      ]
    ));
    return resp.flat(1);
  };

  const configByPercent = {
    data: getDataPercentWithPattern(),
    xField: 'year',
    yField: 'taxa',
    seriesField: 'condicao',
    legend: { position: 'top' },
    height: 250,
    color: ['#0000FF', '#7FFF00', '#FFFF00', '#FFA500', '#FF0000'],
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 3000,
      },
    },
  };
  const getDataTotalsWithPattern = () => {
    const resp = [2015, 2016, 2017, 2018, 2019, 2020].map((key) => (
      [
        { condicao: 'Magreza', year: key, soma: Math.round((data[key].tx_registros_f_magreza + data[key].tx_registros_m_magreza) * 100) / 100 },
        { condicao: 'Eutrofia', year: key, soma: Math.round((data[key].tx_registros_f_eutrofia + data[key].tx_registros_m_eutrofia) * 100) / 100 },
        { condicao: 'Risco Sobrepeso', year: key, soma: Math.round((data[key].tx_registros_f_risco_sobrepeso + data[key].tx_registros_m_risco_sobrepeso) * 100) / 100 },
        { condicao: 'Sobrepeso', year: key, soma: Math.round((data[key].tx_registros_f_sobrepeso + data[key].tx_registros_m_sobrepeso) * 100) / 100 },
        { condicao: 'Obesidade', year: key, soma: Math.round((data[key].tx_registros_f_obesidade + data[key].tx_registros_m_obesidade) * 100) / 100 },
      ]
    ));
    return resp.flat(1);
  };

  const configByTotals = {
    data: getDataTotalsWithPattern(),
    xField: 'year',
    yField: 'soma',
    seriesField: 'condicao',
    legend: { position: 'top' },
    height: 250,
    color: ['#0000FF', '#7FFF00', '#FFFF00', '#FFA500', '#FF0000'],
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 3000,
      },
    },
  };
  return (
    <>
      <div style={{ marginBottom: 30 }}>
        <div>
          <span>Número de Registros Coletados</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 30 }}>
          <Line {...configByPercent} style={{ width: '90%' }} />
        </div>
      </div>
      <div style={{ marginBottom: 30 }}>
        <div>
          <span>Taxa por faixa antropométrica (%)</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Line {...configByTotals} style={{ width: '90%' }} />
        </div>
      </div>
    </>
  );
};

export default Antropometria;
