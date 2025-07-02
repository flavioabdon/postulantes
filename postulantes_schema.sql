
CREATE TABLE IF NOT EXISTS postulantes (
  id SERIAL PRIMARY KEY,
  requisitos JSONB,
  nombre VARCHAR(250),
  apellido_paterno VARCHAR(250),
  apellido_materno VARCHAR(250),
  fecha_nacimiento DATE CHECK (fecha_nacimiento <= CURRENT_DATE - INTERVAL '18 years'),
  cedula_identidad VARCHAR(10),
  complemento VARCHAR(4),
  expedicion VARCHAR(2) CHECK (expedicion IN ('LP', 'SC', 'CB', 'OR', 'CH', 'BN', 'PT', 'TJ', 'PN')),
  grado_instruccion VARCHAR(50),
  ciudad VARCHAR(100),
  zona VARCHAR(100),
  calle_avenida VARCHAR(100),
  numero_domicilio INTEGER CHECK (numero_domicilio >= 0 AND numero_domicilio <= 999999),
  email VARCHAR(255),
  telefono VARCHAR(10),
  celular VARCHAR(10),
  latitud DOUBLE PRECISION,
  longitud DOUBLE PRECISION,
  marca_celular VARCHAR(30),
  modelo_celular VARCHAR(30),
  tipo_postulacion VARCHAR(100) CHECK (
    tipo_postulacion IN (
      'OPERADOR DE TRANSMISION SIREPRE URBANO',
      'OPERADOR DE TRANSMISION SIREPRE PROVINCIA'
    )
  ),
  id_recinto VARCHAR(12),
  nombre_recinto VARCHAR(250),
  municipio_recinto VARCHAR(250),
  vive_cerca_recinto BOOLEAN,
  archivo_ci VARCHAR(255),
  archivo_no_militancia VARCHAR(255),
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
