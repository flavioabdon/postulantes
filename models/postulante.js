const pool = require('../config/db');

const crearPostulante = async (data) => {
  // Primero verificamos si el postulante ya existe
  const yaExiste = await existePostulante(data.cedulaIdentidad, data.complemento || null);
  
  if (yaExiste) {
    throw new Error('Ya existe un postulante con esta cédula de identidad y complemento');
  }

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
  
  const values = [                  
    data.nombre,                                
    data.apellidoPaterno || null,               
    data.apellidoMaterno || null,               
    data.fechaNacimiento,                       
    data.cedulaIdentidad,                       
    data.complemento || null,                   
    data.expedicion,                            
    data.gradoInstruccion,                      
    data.carrera || 'NO APLICA',                
    data.ciudad,                                
    data.zona,                                  
    data.calleAvenida,                          
    data.numeroDomicilio,                       
    data.email,                                 
    data.telefono || null,                      
    data.celular,                               
    data.latitud || null,                       
    data.longitud || null,                      
    data.marcaCelular || null,                  
    data.modeloCelular || null,                 
    data.tipoPostulacion,                       
    data.idRecinto,                             
    data.nombreRecinto,                         
    data.municipioRecinto,                      
    data.viveCercaRecinto,                      
    data.experiencia_general || 0,              
    data.es_boliviano || false,                 
    data.registrado_en_padron_electoral || false,
    data.ci_vigente || false,                   
    data.disponibilidad_tiempo_completo || false,
    data.celular_con_camara || false,           
    data.android_8_2_o_superior || false,       
    data.linea_entel || false,                  
    data.ninguna_militancia_politica || false,  
    data.sin_conflictos_con_la_institucion || false,
    data.archivos.ci,                           
    data.archivos.no_militancia,                
    data.archivos.hoja_vida,                    
    data.archivos.screenshot                    
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
     WHERE cedula_identidad = $1 AND (complemento = $2 OR complemento IS NULL)
     LIMIT 1`,
    [cedula_identidad, complemento]
  );
  return result.rowCount > 0;
};

module.exports = {
  crearPostulante,
  existePostulante
};