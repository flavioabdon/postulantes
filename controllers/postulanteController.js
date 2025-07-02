const { crearPostulante, existePostulante } = require('../models/postulante');

const crearPostulanteHandler = async (req, res) => {
  try {
    const data = req.body;
    const archivos = {
      ci: req.files['archivo_ci']?.[0]?.path || null,
      no_militancia: req.files['archivo_no_militancia']?.[0]?.path || null
    };
    data.archivos = archivos;
    data.requisitos = JSON.stringify(data.requisitos);
    data.viveCercaRecinto = data.viveCercaRecinto === 'true';

    const nuevo = await crearPostulante(data);
    res.status(201).json({ success: true, id: nuevo.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};




const verificarExistenciaPostulante = async (req, res) => {
  try {
    const { cedula_identidad, complemento, expedicion } = req.query;

    if (!cedula_identidad || !expedicion) {
      return res.status(400).json({ success: false, error: 'Faltan campos requeridos.' });
    }

    const existe = await existePostulante(cedula_identidad, complemento || '', expedicion);

    if (existe) {
      return res.json({ success: true, existe: true, mensaje: 'El postulante ya está registrado.' });
    } else {
      return res.json({ success: true, existe: false, mensaje: 'El postulante no está registrado.' });
    }

  } catch (error) {
    console.error('Error al verificar existencia:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

module.exports = {
  crearPostulante: crearPostulanteHandler,
  verificarExistenciaPostulante
};