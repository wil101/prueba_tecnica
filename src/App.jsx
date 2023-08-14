
import React, { useState, useEffect } from 'react';
import './App.css';
//import './Admiprestamos.js';

function App() {
  const [estudiante, setEstudiante] = useState('');
  const [documentoEstudiante, setDocumentoEstudiante] = useState('');
  const [estudianteIdVer, setEstudianteIdVer] = useState('');
  const [auxiliar, setAuxiliar] = useState('');
  const [documentoAuxiliar, setDocumentoAuxiliar] = useState('');
  const [elemento, setElemento] = useState('');
  const [prestamos, setPrestamos] = useState([]);
  const [prestamoIdVer, setPrestamoIdVer] = useState('');
  const [currentPage, setCurrentPage] = useState('crear');
  
  useEffect(() => {
    cargarPrestamos();
  }, []);

  const crearPrestamo = () => {
    fetch('http://localhost:3001/prestamos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        estudiante,
        documentoEstudiante,
        auxiliar,
        documentoAuxiliar,
        elemento,
      }),
    })
      .then(response => response.json())
      .then(data => {
        alert(data.message);
        setEstudiante('');
        setDocumentoEstudiante('');
        setAuxiliar('');
        setDocumentoAuxiliar('');
        setElemento('');
        cargarPrestamos(); // Cargar los préstamos nuevamente después de crear uno nuevo
        setCurrentPage('ver'); // Cambiar a la página de visualización de préstamos
      })
      .catch(error => console.error('Error al crear el préstamo:', error));
  };

  const cargarPrestamos = () => {
    fetch('http://localhost:3001/prestamos')
      .then(response => response.json())
      .then(data => setPrestamos(data))
      .catch(error => console.error('Error al cargar los préstamos:', error));
  };

  const handleVerPrestamo = async (prestamoId) => {
    await cargarPrestamos(); // Cargar los préstamos
    const prestamoVer = prestamos.find(prestamo => prestamo.id === prestamoId);
  
    if (prestamoVer) {
      setPrestamoIdVer(prestamoId);
      setCurrentPage('verPrestamo');
    } else {
      alert('No se encontró un préstamo con el ID proporcionado');
    }
  };

  const handleVerPrestamosEstudiante = async (estudianteId) => {
    await cargarPrestamos(); // Cargar los préstamos
    const prestamosEstudiante = prestamos.filter(prestamo => prestamo.estudiante === estudianteId);
    
    if (prestamosEstudiante.length > 0) {
      setPrestamos(prestamosEstudiante); // Utiliza setPrestamos para almacenar los préstamos del estudiante
      setCurrentPage('verPrestamoEstudiante');
    } else {
      alert('No se encontraron préstamos para el estudiante con el ID proporcionado');
    }
  };

  const renderPage = () => {
    if (currentPage === 'crear') {
      return (
        <div className="form-container">
          <h2>Crear Préstamo</h2>
          <label htmlFor="estudiante">Estudiante:</label>
          <input
            type="text"
            id="estudiante"
            value={estudiante}
            onChange={e => setEstudiante(e.target.value)}
            required
          />
          <label htmlFor="documentoEstudiante">Documento Estudiante:</label>
          <input
            type="text"
            id="documentoEstudiante"
            value={documentoEstudiante}
            onChange={e => setDocumentoEstudiante(e.target.value)}
            required
          />
          <label htmlFor="auxiliar">Auxiliar:</label>
          <input
            type="text"
            id="auxiliar"
            value={auxiliar}
            onChange={e => setAuxiliar(e.target.value)}
            required
          />
          <label htmlFor="documentoAuxiliar">Documento Auxiliar:</label>
          <input
            type="text"
            id="documentoAuxiliar"
            value={documentoAuxiliar}
            onChange={e => setDocumentoAuxiliar(e.target.value)}
            required
          />
          <label htmlFor="elemento">Elemento:</label>
          <input
            type="text"
            id="elemento"
            value={elemento}
            onChange={e => setElemento(e.target.value)}
            required
          />
          <button className="btn" onClick={crearPrestamo}>Crear Préstamo</button>
        </div>
      );
    } else if (currentPage === 'ver') {
      return (
        <div className="prestamos-list">
          <h2>Lista de Préstamos</h2>
          {prestamos.map(prestamo => (
            <div className="prestamo" key={prestamo.id}>
              <hr />
              <strong>ID:</strong> {prestamo.id}<br />
              <strong>Estudiante:</strong> {prestamo.estudiante}<br />
              <strong>Documento Estudiante:</strong>{prestamo.documentoEstudiante}<br />
              <strong>Auxiliar:</strong> {prestamo.auxiliar}<br />
              <strong>Documento Auxiliar:</strong>{prestamo.documentoAuxiliar}<br />
              <strong>Fecha Préstamo:</strong> {prestamo.fechaPrestamo}<br />
              <strong>Elemento:</strong> {prestamo.elemento}<br />
              <strong>Estado:</strong> {prestamo.estado}<br />
            </div>
          ))}
        </div>
      );
    } 
  };

  return (
    
    <div className="App">
      <h1>Gestión de Préstamos</h1>
      <div className="menu">
        <button className={`menu-btn ${currentPage === 'crear' ? 'active' : ''}`} onClick={() => setCurrentPage('crear')}>Crear Préstamo</button>
        <button className={`menu-btn ${currentPage === 'ver' ? 'active' : ''}`} onClick={() => setCurrentPage('ver')}>Ver Préstamos</button>
        <button className={`menu-btn ${currentPage === 'verPrestamo' ? 'active' : ''}`} onClick={() => setCurrentPage('verPrestamo')}>Ver Préstamo por Id</button>
        <button className={`menu-btn ${currentPage === 'verPrestamoEstudiante' ? 'active' : ''}`} onClick={() => setCurrentPage('verPrestamoEstudiante')}>Ver Préstamos por Estudiante</button>

      </div>
      {currentPage === 'verPrestamo' && (
      <div className="prestamo-buscar">
        <h2>Buscar Préstamo por ID</h2>
        <label htmlFor="buscarId">Ingrese el ID del Préstamo:</label>
        <input
          type="text"
          id="buscarId"
          value={prestamoIdVer}
          onChange={e => setPrestamoIdVer(e.target.value)}
        />
        <button className="btn" onClick={() => handleVerPrestamo(prestamoIdVer)}>Buscar</button>
      </div>
    )}
    {currentPage === 'verPrestamoEstudiante' && (
  <div className="prestamo-estudiante">
    <h2>Buscar Préstamos por Estudiante</h2>
    <label htmlFor="buscarEstudiante">Ingrese el ID del Estudiante:</label>
    <input
      type="text"
      id="buscarEstudiante"
      value={estudianteIdVer}
      onChange={e => setEstudianteIdVer(e.target.value)}
    />
    <button className="btn" onClick={() => handleVerPrestamosEstudiante(estudianteIdVer)}>Buscar</button>
  </div>
)}

    {renderPage()}
  </div>
);
  
}

export default App;