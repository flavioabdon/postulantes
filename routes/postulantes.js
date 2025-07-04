const express = require('express');
const multer = require('multer');
const { crearPostulante } = require('../controllers/postulanteController');
const { verificarExistenciaPostulante } = require('../controllers/postulanteController');

const { listarPostulantes, generarExcel, obtenerEstadisticas } = require('../controllers/adminController');
const { verificarAutenticacion, esAdministrador } = require('../middlewares/auth');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.post('/', upload.fields([
  { name: 'archivo_ci', maxCount: 1 },
  { name: 'archivo_no_militancia', maxCount: 1 },
  { name: 'curriculum', maxCount: 1 },          // Hoja de vida
  { name: 'capturaPantalla', maxCount: 1 }  
]), crearPostulante);


// Rutas protegidas (requieren autenticación y ser admin)
router.get('/postulantes', verificarAutenticacion, esAdministrador, listarPostulantes);
router.get('/postulantes/excel', verificarAutenticacion, esAdministrador, generarExcel);
router.get('/estadisticas', verificarAutenticacion, esAdministrador, obtenerEstadisticas);
//

//
router.get('/existe', verificarExistenciaPostulante);
module.exports = router;
