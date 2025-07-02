const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const postulanteRoutes = require('./routes/postulantes');
const path = require('path');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/api/postulantes', postulanteRoutes);
app.use(express.static('public'));

// Servir archivos estáticos JS/CSS
app.use(express.static(path.join(__dirname, 'public')));

app.get('/formulario', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'formulario.html'));
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

