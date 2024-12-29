import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Container, Nav, Navbar } from 'react-bootstrap';
import ImportCard from './components/ImportCard';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('inicio');

  return (
    <div className="App">
      <Navbar bg="light" expand="lg" fixed="top">
        <Container fluid className="ms-3">
          <Navbar.Brand href="#home" className="fw-bold">Piasentin y Soto SRL</Navbar.Brand>
        </Container>
      </Navbar>
      <div className="main-container">
        <aside className="sidebar">
          <div className="nav flex-column gap-2">
            <div className="card rounded-3">
              <div className="card-body">
                <a className="nav-link" href="#inicio" onClick={() => setCurrentPage('inicio')}>
                  <i className="bi bi-house-door me-2"></i>
                  Inicio
                </a>
              </div>
            </div>
            <div className="card rounded-3">
              <div className="card-body">
                <a className="nav-link" href="#importar" onClick={() => setCurrentPage('importar')}>
                  <i className="bi bi-file-earmark-spreadsheet me-2"></i>
                  Importar Lista
                </a>
              </div>
            </div>
            <div className="card rounded-3">
              <div className="card-body">
                <a className="nav-link" href="#perfil">
                  <i className="bi bi-person me-2"></i>
                  Perfil
                </a>
              </div>
            </div>
            <div className="card rounded-3">
              <div className="card-body">
                <a className="nav-link" href="#configuracion">
                  <i className="bi bi-gear me-2"></i>
                  Configuración
                </a>
              </div>
            </div>
          </div>
        </aside>
        
        <div className="content">
          <div className="cards-container">
            <div className="main-card">
              {currentPage === 'importar' ? (
                <ImportCard />
              ) : (
                /* Aquí puedes poner el contenido por defecto o dejarlo vacío */
                null
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
