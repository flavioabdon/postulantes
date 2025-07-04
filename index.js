const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const postulanteRoutes = require('./routes/postulantes');
const path = require('path');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/api/postulantes', postulanteRoutes);
app.use(express.static('public'));
app.use('/comprobantes', express.static(path.join(__dirname, 'public/comprobantes')));
app.use('/qr_temp', express.static(path.join(__dirname, 'public/qr_temp')));

// Servir archivos estáticos JS/CSS
app.use(express.static(path.join(__dirname, 'public')));

app.get('/formulario', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'formulario.html'));
});

app.use('/admin', adminRoutes);

// Servir archivos Excel generados
app.use('/excel', express.static(path.join(__dirname, 'public/excel')));

app.use('/api/auth', authRoutes);

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

