import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [prestamos, setPrestamos] = useState([]);
  const [estudiante, setEstudiante] = useState('');
  const [auxiliar, setAuxiliar] = useState('');
  const [elemento, setElemento] = useState('');

  useEffect(() => {
    cargarPrestamos();
  }, []);

  const cargarPrestamos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/prestamos');
      setPrestamos(response.data);
    } catch (error) {
      console.error('Error al cargar los préstamos:', error);
    }
  };

  const crearPrestamo = async () => {
    try {
      await axios.post('http://localhost:5000/prestamos', {
        estudiante,
        auxiliar,
        elemento,
      });
      cargarPrestamos();
    } catch (error) {
      console.error('Error al crear el préstamo:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h1>Sistema de Administración de Préstamos</h1>
      <div className="mb-3">
        <label>Estudiante:</label>
        <input
          type="text"
          className="form-control"
          value={estudiante}
          onChange={(e) => setEstudiante(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label>Auxiliar:</label>
        <input
          type="text"
          className="form-control"
          value={auxiliar}
          onChange={(e) => setAuxiliar(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label>Elemento:</label>
        <input
          type="text"
          className="form-control"
          value={elemento}
          onChange={(e) => setElemento(e.target.value)}
        />
      </div>
      <button className="btn btn-primary" onClick={crearPrestamo}>
        Crear Préstamo
      </button>
      <h2>Prestamos</h2>
      <ul className="list-group">
        {prestamos.map((prestamo) => (
          <li key={prestamo.id} className="list-group-item">
            <strong>Estudiante:</strong> {prestamo.estudiante} |{' '}
            <strong>Auxiliar:</strong> {prestamo.auxiliar} |{' '}
            <strong>Elemento:</strong> {prestamo.elemento} |{' '}
            <strong>Estado:</strong> {prestamo.estado}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;