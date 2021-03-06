import React from 'react';
import './SinglePageStructure.css'

export default function SinglePageStructure(){
    return (
        <div className="grid-container">
            <header className="header">
          <span>Simulação Discreta - Lavacar wash</span>
        </header>
        <aside className="sidenav">
          <div style={{
              backgroundColor: '#49505f', 
              borderRadius: 10, 
              margin: '0px 10px 30px', 
              boxShadow: '5px 5px 5px rgba(0,0,0,0.5)', 
              width: '95%', 
              height: '98%'}}></div>
        </aside>
        <main className="main">
          <div id="here-is-the-map" style={{width: '100%', height: '100%'}}/>
        </main>
        </div>
    )
}