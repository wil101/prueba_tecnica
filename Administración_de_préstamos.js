const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

let loans = [];
let loanIdCounter = 1;

// Crear un nuevo préstamo
app.post('/loans', (req, res) => {
  const newLoan = {
    id: loanIdCounter++,
    student: req.body.student,
    admin: req.body.admin,
    timestamp: new Date(),
    item: req.body.item,
    status: 'pendiente'
  };
  loans.push(newLoan);
  res.status(201).json(newLoan);
});

// Obtener todos los préstamos
app.get('/loans', (req, res) => {
  res.json(loans);
});

// Obtener un préstamo específico por su identificador
app.get('/loans/:id', (req, res) => {
  const loan = loans.find(loan => loan.id === parseInt(req.params.id));
  if (!loan) {
    res.status(404).send('Préstamo no encontrado');
  } else {
    res.json(loan);
  }
});

// Obtener todos los préstamos de un mismo estudiante
app.get('/students/:studentId/loans', (req, res) => {
  const studentLoans = loans.filter(loan => loan.student.id === req.params.studentId);
  res.json(studentLoans);
});

// Marcar un préstamo como devuelto
app.patch('/loans/:id', (req, res) => {
  const loan = loans.find(loan => loan.id === parseInt(req.params.id));
  if (!loan) {
    res.status(404).send('Préstamo no encontrado');
  } else {
    loan.status = 'devuelto';
    res.json(loan);
  }
});

// Función para calcular la cantidad de préstamos entregados en un día específico.
app.get('/loans/day/:date', (req, res) => {
  const date = new Date(req.params.date);
  const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
  const loansInDay = loans.filter(loan => loan.timestamp >= dayStart && loan.timestamp < dayEnd);
  res.json({ date: date.toISOString(), loans: loansInDay.length });
});

// Función para actualizar los campos de un préstamo específico por id.
app.put('/loans/:id', (req, res) => {
  const loan = loans.find(loan => loan.id === parseInt(req.params.id));
  if (!loan) {
    res.status(404).send('Préstamo no encontrado');
  } else {
    loan.student = req.body.student || loan.student;
    loan.admin = req.body.admin || loan.admin;
    loan.item = req.body.item || loan.item;
    res.json(loan);
  }
});

// Función para mostrar todos los préstamos pendientes.
app.get('/loans/pending', (req, res) => {
  const pendingLoans = loans.filter(loan => loan.status === 'pendiente');
  res.json(pendingLoans);
});

// Función para calcular la cantidad de préstamos hechos por un auxiliar específico.
app.get('/loans/admin/:adminId/count', (req, res) => {
  const adminId = req.params.adminId;
  const adminLoansCount = loans.filter(loan => loan.admin.id === adminId).length;
  res.json({ adminId, loansCount: adminLoansCount });
});

app.listen(PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${PORT}`);
});