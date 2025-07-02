const express = require('express');
const multer = require('multer');
const { crearPostulante } = require('../controllers/postulanteController');
const { verificarExistenciaPostulante } = require('../controllers/postulanteController');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.post('/', upload.fields([
  { name: 'archivo_ci', maxCount: 1 },
  { name: 'archivo_no_militancia', maxCount: 1 }
]), crearPostulante);

router.get('/existe', verificarExistenciaPostulante);
module.exports = router;
