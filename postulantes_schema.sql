CREATE TABLE IF NOT EXISTS postulantes (
  id SERIAL PRIMARY KEY,
  requisitos JSONB,
  nombre VARCHAR(250),
  apellido_paterno VARCHAR(250),
  apellido_materno VARCHAR(250),
  fecha_nacimiento DATE CHECK (fecha_nacimiento <= CURRENT_DATE - INTERVAL '18 years'),
  cedula_identidad INTEGER,
  complemento VARCHAR(2),
  expedicion VARCHAR(2) CHECK (expedicion IN ('LP', 'SC', 'CB', 'OR', 'CH', 'BN', 'PT', 'TJ', 'PN')),
  grado_instruccion VARCHAR(50),
  carrera VARCHAR(255),
  ciudad VARCHAR(100),
  zona VARCHAR(100),
  calle_avenida VARCHAR(100),
  numero_domicilio varchar(5),
  email VARCHAR(255),
  telefono INTEGER,
  celular INTEGER,
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
  experiencia_general integer,
  experiencia_especifica integer,
  -- campos booleanos requisitos
  es_boliviano BOOLEAN,
  registrado_en_padron_electoral BOOLEAN,
  ci_vigente BOOLEAN,
  disponibilidad_tiempo_completo BOOLEAN,
  celular_con_camara BOOLEAN,
  android_8_2_o_superior BOOLEAN,
  linea_entel BOOLEAN,
  ninguna_militancia_politica BOOLEAN,
  sin_conflictos_con_la_institucion BOOLEAN,
  --rutas a los archivos
  archivo_ci VARCHAR(255),
  archivo_no_militancia VARCHAR(255),
  archivo_hoja_de_vida VARCHAR(255),
  archivo_screenshot_celular VARCHAR(255),
  -- Campo de registro automático
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  rol VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (rol IN ('admin', 'user')),
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar usuario admin inicial (password: Admin1234)
INSERT INTO usuarios (username, email, password_hash, rol) 
VALUES ('admin', 'admin@example.com', '$2b$10$5v5ZIVUQw.d2ZrFpD5JQ3Oo7M7jYvJz8Xo6bN3tL9QwW1kK5X5z6O', 'admin')
ON CONFLICT (username) DO NOTHING;