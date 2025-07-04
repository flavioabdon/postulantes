const pool = require('../config/db');

const crearPostulante = async (data) => {
  const query = `
    INSERT INTO postulantes (
      nombre,
      apellido_paterno,
      apellido_materno,
      fecha_nacimiento,
      cedula_identidad,
      complemento,
      expedicion,
      grado_instruccion,
      carrera,
      ciudad,
      zona,
      calle_avenida,
      numero_domicilio,
      email,
      telefono,
      celular,
      latitud,
      longitud,
      marca_celular,
      modelo_celular,
      tipo_postulacion,
      id_recinto,
      nombre_recinto,
      municipio_recinto,
      vive_cerca_recinto,
      experiencia_general,
      es_boliviano,
      registrado_en_padron_electoral,
      ci_vigente,
      disponibilidad_tiempo_completo,
      celular_con_camara,
      android_8_2_o_superior,
      linea_entel,
      ninguna_militancia_politica,
      sin_conflictos_con_la_institucion,
      archivo_ci,
      archivo_no_militancia,
      archivo_hoja_de_vida,
      archivo_screenshot_celular
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
      $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
      $21, $22, $23, $24, $25, $26, $27, $28, $29, $30,
      $31, $32, $33, $34, $35, $36, $37, $38, $39
    )
    RETURNING id
  `;
  
  const values = [                  // $1
    data.nombre,                                // $2
    data.apellidoPaterno || null,               // $3
    data.apellidoMaterno || null,               // $4
    data.fechaNacimiento,                       // $5
    data.cedulaIdentidad,                       // $6
    data.complemento || null,                   // $7
    data.expedicion,                            // $8
    data.gradoInstruccion,                      // $9
    data.carrera || 'NO APLICA',                // $10
    data.ciudad,                                // $11
    data.zona,                                  // $12
    data.calleAvenida,                          // $13
    data.numeroDomicilio,                       // $14
    data.email,                                 // $15
    data.telefono || null,                      // $16
    data.celular,                               // $17
    data.latitud || null,                       // $18
    data.longitud || null,                      // $19
    data.marcaCelular || null,                  // $20
    data.modeloCelular || null,                 // $21
    data.tipoPostulacion,                       // $22
    data.idRecinto,                             // $23
    data.nombreRecinto,                         // $24
    data.municipioRecinto,                      // $25
    data.viveCercaRecinto,                      // $26
    data.experiencia_general || 0,              // $27
    data.es_boliviano || false,                 // $28
    data.registrado_en_padron_electoral || false, // $29
    data.ci_vigente || false,                   // $30
    data.disponibilidad_tiempo_completo || false, // $31
    data.celular_con_camara || false,           // $32
    data.android_8_2_o_superior || false,       // $33
    data.linea_entel || false,                  // $34
    data.ninguna_militancia_politica || false,  // $35
    data.sin_conflictos_con_la_institucion || false, // $36
    data.archivos.ci,                           // $37
    data.archivos.no_militancia,                // $38
    data.archivos.hoja_vida,                    // $39
    data.archivos.screenshot                    // $40
  ];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error al crear postulante:', error);
    throw error;
  }
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