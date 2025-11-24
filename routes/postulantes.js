const express = require('express');
const multer = require('multer');
const { crearPostulante } = require('../controllers/postulanteController');
const { verificarExistenciaPostulante } = require('../controllers/postulanteController');
const { generarPDF } = require('../controllers/postulanteController');
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
  { name: 'archivo_curriculum', maxCount: 1 },          // Hoja de vida
  { name: 'archivo_certificado_ofimatica', maxCount: 1 }  
]), crearPostulante);

const fs = require("fs");
const path = require("path");

router.get('/comprobantes/:filename', (req, res) => {
  const filePath = path.join(__filename, "../public/comprobantes", req.params.filename);
  
  if (!fs.existsSync(filePath)){
    return res.status(404).send('archivo no encontrado');
  }

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${req.params.filename}"`);

  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res)
});

//router.get('/postulantes', listarPostulantes)
// Rutas protegidas (requieren autenticación y ser admin)
router.get('/postulantes', verificarAutenticacion, esAdministrador, listarPostulantes);
router.get('/postulantes/excel', verificarAutenticacion, esAdministrador, generarExcel);
router.get('/estadisticas', verificarAutenticacion, esAdministrador, obtenerEstadisticas);
//

//
router.get('/existe', verificarExistenciaPostulante);
module.exports = router;
