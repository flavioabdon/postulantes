const { crearPostulante } = require('../models/postulante');

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

module.exports = { crearPostulante: crearPostulanteHandler };
