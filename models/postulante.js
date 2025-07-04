const pool = require('../config/db');

const crearPostulante = async (data) => {
  const {
    requisitos,
    nombre, apellidoPaterno, apellidoMaterno,
    fechaNacimiento, cedulaIdentidad, complemento, expedicion,
    gradoInstruccion, ciudad, zona, calleAvenida, numeroDomicilio,
    email, telefono, celular,
    latitud, longitud,
    marcaCelular, modeloCelular,
    tipoPostulacion, idRecinto, nombreRecinto, municipioRecinto, viveCercaRecinto,
    archivos
  } = data;

  const result = await pool.query(`
    INSERT INTO postulantes (
      requisitos, nombre, apellido_paterno, apellido_materno,
      fecha_nacimiento, cedula_identidad, complemento, expedicion,
      grado_instruccion, ciudad, zona, calle_avenida, numero_domicilio,
      email, telefono, celular,
      latitud, longitud,
      marca_celular, modelo_celular,
      tipo_postulacion, id_recinto, nombre_recinto, municipio_recinto, vive_cerca_recinto,
      archivo_ci, archivo_no_militancia, archivo_hoja_de_vida, archivo_screenshot_celular
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,
      $14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27, $28, $29 
    )
    RETURNING id
  `, [
    requisitos, nombre, apellidoPaterno, apellidoMaterno,
    fechaNacimiento, cedulaIdentidad, complemento, expedicion,
    gradoInstruccion, ciudad, zona, calleAvenida, numeroDomicilio,
    email, telefono, celular,
    latitud, longitud,
    marcaCelular, modeloCelular,
    tipoPostulacion, idRecinto, nombreRecinto, municipioRecinto, viveCercaRecinto,
    archivos.ci, archivos.no_militancia,archivos.hoja_vida, archivos.screenshot 
  ]);

  return result.rows[0];
};

  
const existePostulante = async (cedula_identidad, complemento) => {
  const result = await pool.query(
    `SELECT 1 FROM postulantes 
     WHERE cedula_identidad = $1 AND complemento = $2
     LIMIT 1`,
    [cedula_identidad, complemento]
  );
  return result.rowCount > 0;
};

module.exports = {
  crearPostulante,
  existePostulante
};