import React from 'react';
import './SinglePageStructure.css';
import Sider from './components/Sider';

export default function SinglePageStructure() {
  return (
    <div className="grid-container">
      <header className="header">
        {/* <span>Mapa da obesidade infantil no brasil - Base SISVAN</span> */}
        <span>Georreferenciamento da Obesidade Infantil no Brasil</span>
      </header>
      <aside className="base-sidenav">
        <div className="sidenav">
          <Sider />
        </div>
      </aside>
      <main className="main">
        <div id="here-is-the-map" style={{ width: '100%', height: '100%' }} />
      </main>
    </div>
  );
}
