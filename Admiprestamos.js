const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors'); // Importa el módulo cors

const app = express();
const port = 3001;

app.use(cors({ origin: 'http://localhost:3000' })); // Solo permitirá solicitudes desde el puerto 3000
app.use(bodyParser.json());

app.use(bodyParser.json());

const prestamos = [];

class Prestamo {
  constructor(estudiante, documentoEstudiante, auxiliar, documentoAuxiliar, elemento) {
    this.id = uuidv4();
    this.estudiante = estudiante;
    this.documentoEstudiante = documentoEstudiante;
    this.auxiliar = auxiliar;
    this.documentoAuxiliar = documentoAuxiliar;
    this.fechaPrestamo = new Date().toISOString();
    this.elemento = elemento;
    this.estado = 'pendiente';
  }
}

// Crear un nuevo préstamo
app.post('/prestamos', (req, res) => {
  const { estudiante, documentoEstudiante, auxiliar, documentoAuxiliar, elemento } = req.body;

if (!estudiante || !documentoEstudiante || !auxiliar || !documentoAuxiliar || !elemento) {
  return res.status(400).json({ error: 'Faltan datos obligatorios' });
}

const nuevoPrestamo = new Prestamo(estudiante, documentoEstudiante, auxiliar, documentoAuxiliar, elemento);
  prestamos.push(nuevoPrestamo);

  res.status(201).json({ message: 'Prestamo creado exitosamente', prestamoId: nuevoPrestamo.id });
});

// Obtener todos los préstamos
app.get('/prestamos', (req, res) => {
  res.status(200).json(prestamos);
});

// Obtener un préstamo por su identificador
app.get('/prestamos/:prestamoId', (req, res) => {
  const prestamoId = req.params.prestamoId;
  const prestamo = prestamos.find(p => p.id === prestamoId);

  if (!prestamo) {
    return res.status(404).json({ error: 'Prestamo no encontrado' });
  }

  res.status(200).json(prestamo);
});

// Obtener todos los préstamos de un mismo estudiante
app.get('/prestamos/estudiante/:estudianteId', (req, res) => {
  const estudianteId = req.params.estudianteId;
  const prestamosEstudiante = prestamos.filter(p => p.estudiante === estudianteId);

  res.status(200).json(prestamosEstudiante);
});

// Marcar un préstamo como devuelto
app.put('/prestamos/:prestamoId/devolver', (req, res) => {
  const prestamoId = req.params.prestamoId;
  const prestamo = prestamos.find(p => p.id === prestamoId);

  if (!prestamo) {
    return res.status(404).json({ error: 'Prestamo no encontrado' });
  }

  prestamo.estado = 'devuelto';
  res.status(200).json({ message: 'Prestamo marcado como devuelto' });
});

// Calcular la cantidad de préstamos entregados en un día específico
app.get('/prestamos/cantidad/:fecha', (req, res) => {
  const fecha = req.params.fecha;
  const cantidadPrestamos = prestamos.filter(p => p.fechaPrestamo.startsWith(fecha)).length;

  res.status(200).json({ cantidad: cantidadPrestamos });
});

//Actualizar los campos de un préstamo específico por id
app.put('/prestamos/:prestamoId', (req, res) => {
  const prestamoId = req.params.prestamoId;
  const prestamo = prestamos.find(p => p.id === prestamoId);

  if (!prestamo) {
    return res.status(404).json({ error: 'Prestamo no encontrado' });
  }

  const { estudiante, auxiliar, elemento } = req.body;

  prestamo.estudiante = estudiante || prestamo.estudiante;
  prestamo.auxiliar = auxiliar || prestamo.auxiliar;
  prestamo.elemento = elemento || prestamo.elemento;

  res.status(200).json({ message: 'Prestamo actualizado exitosamente' });
});

//Mostrar todos los préstamos pendientes
app.get('/prestamos/pendientes', (req, res) => {
  const prestamosPendientes = prestamos.filter(p => p.estado === 'pendiente');

  res.status(200).json(prestamosPendientes);
});

//Calcular la cantidad de préstamos hechos por un auxiliar específico
app.get('/prestamos/cantidad-auxiliar/:auxiliar', (req, res) => {
  const auxiliar = req.params.auxiliar;
  const cantidadPrestamosAuxiliar = prestamos.filter(p => p.auxiliar === auxiliar).length;

  res.status(200).json({ cantidad: cantidadPrestamosAuxiliar });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});