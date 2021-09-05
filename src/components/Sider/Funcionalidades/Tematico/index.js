import React, { useCallback, useState } from 'react';
import { Radio, Button } from 'antd';
import StyledCollapse from './StyledCollapse';

const { Panel } = StyledCollapse;

function Tematico() {
  const [year, setYear] = useState(2015);
  console.log('🚀 ---------------------------------------------------');
  console.log('🚀 ~ file: index.js ~ line 9 ~ Tematico ~ year', year);
  console.log('🚀 ---------------------------------------------------');

  const callback = useCallback((key) => {
    console.log('key: ', key);
  }, []);

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

  const updateEstiloMapa = useCallback((antropometria) => {
    console.log('updateEstiloMapa: ', antropometria);
  }, []);

  const handleAplicar = useCallback(async () => {
    const antropometria = await getAntropometria();
    updateEstiloMapa(antropometria);
  }, [getAntropometria, updateEstiloMapa]);

  return (
    <StyledCollapse onChange={callback} size="small">
      <Panel header="Temático" key="1">
        <Radio.Group onChange={(e) => setYear(e.target.value)} value={year} size="small">
          <Radio.Button value={2015}>2015</Radio.Button>
          <Radio.Button value={2016}>2016</Radio.Button>
          <Radio.Button value={2017}>2017</Radio.Button>
          <Radio.Button value={2018}>2018</Radio.Button>
          <Radio.Button value={2020}>2020</Radio.Button>
        </Radio.Group>
        <div>
          <div>
            <span style={{ fontWeight: 'bold', fontSize: 15 }}>
              Valor = Sobrepeso + Obesidade
            </span>
          </div>
          <div>
            <div style={{
              backgroundColor: '#00FF00', paddingLeft: 5, color: '#3b3f46', fontWeight: 'bold', borderRadius: '10px',
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
              backgroundColor: 'orange', paddingLeft: 5, color: '#3b3f46', fontWeight: 'bold', borderRadius: '10px',
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
        >
          Aplicar
        </Button>
      </Panel>
    </StyledCollapse>
  );
}

export default Tematico;
