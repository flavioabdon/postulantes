const { crearPostulante, existePostulante } = require('../models/postulante');
const { PDFDocument, rgb } = require('pdf-lib');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

async function generarQR(data) {
  const datosQR = {
    ci: data.cedulaIdentidad,
    complemento: data.complemento || '',
    nombres: `${data.nombre} ${data.apellidoPaterno || ''} ${data.apellidoMaterno || ''}`,
    fechaNacimiento: data.fechaNacimiento,
    fechaPostulacion: new Date().toISOString()
  };

  const qrData = JSON.stringify(datosQR);
  try {
    const qrPath = path.join(__dirname, '../public/qr_temp', `qr_${data.cedulaIdentidad}.png`);
    
    if (!fs.existsSync(path.dirname(qrPath))) {
      fs.mkdirSync(path.dirname(qrPath), { recursive: true });
    }

    await QRCode.toFile(qrPath, qrData, {
      color: {
        dark: '#000000',
        light: '#0000'
      },
      width: 200,
      margin: 1
    });

    return qrPath;
  } catch (err) {
    console.error('Error generando QR:', err);
    return null;
  }
}

async function generarPDF(data) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // Tamaño A4

  // Cargar fuentes
  const [helveticaFont, helveticaBoldFont] = await Promise.all([
    pdfDoc.embedFont('Helvetica'),
    pdfDoc.embedFont('Helvetica-Bold')
  ]);

  // Configuraciones
  const margin = 50;
  const { width, height } = page.getSize();
  let yPosition = height - margin - 50; // Ajuste inicial para bajar el contenido
  const lineHeight = 18;
  const sectionGap = 20; // Reducido de 25 a 20
  const boxPadding = 10;
  const boxMargin = 15;
  const boxBorderWidth = 1;

  // Funciones de ayuda
  const drawText = (text, x, y, options = {}) => {
    page.drawText(text, {
      x,
      y,
      size: options.size || 11,
      color: options.color || rgb(0, 0, 0),
      font: options.bold ? helveticaBoldFont : helveticaFont
    });
  };

  const drawSection = (title, content) => {
    // Calcular altura necesaria para la sección
    const contentHeight = content.reduce((acc, item) => {
      return acc + (item.text ? lineHeight : (item.spacer || 0));
    }, 0);
    
    const sectionHeight = lineHeight + contentHeight + (boxPadding * 2);
    
    // Dibujar recuadro
    page.drawRectangle({
      x: margin - boxPadding,
      y: yPosition - sectionHeight + lineHeight,
      width: width - (margin * 2) + (boxPadding * 2),
      height: sectionHeight,
      borderWidth: boxBorderWidth,
      borderColor: rgb(0.7, 0.7, 0.7),
      color: rgb(0.95, 0.95, 0.95)
    });

    // Título de sección (tamaño reducido de 14 a 11)
    drawText(title, margin, yPosition, {
      size: 11, // Reducido de 14 a 11 (14-3)
      bold: true,
      color: rgb(0, 0.4, 0.6)
    });
    yPosition -= lineHeight;

    // Contenido
    content.forEach(item => {
      if (item.text) {
        drawText(item.text, margin + (item.indent || 0), yPosition);
        yPosition -= lineHeight;
      } else if (item.spacer) {
        yPosition -= item.spacer;
      }
    });

    yPosition -= sectionGap;
  };

  // Encabezado (fuera de recuadro)
  drawText('POSTULACIÓN SIREPRE', width/2 - 100, yPosition, {
    size: 13, // Reducido de 16 a 13
    bold: true,
    color: rgb(0, 0.2, 0.4)
  });
  yPosition -= lineHeight * 1.5;
  
  // Generar y agregar QR (posición ajustada)
  const qrPath = await generarQR(data);
  if (qrPath) {
    const qrImage = await pdfDoc.embedPng(fs.readFileSync(qrPath));
    const qrSize = 80;
    page.drawImage(qrImage, {
      x: width - margin - qrSize - 10,
      y: height - margin - qrSize - 30, // Posición fija en esquina superior derecha
      width: qrSize,
      height: qrSize
    });
    fs.unlinkSync(qrPath);
  }

  drawText(`Fecha de registro: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, width - 500, yPosition, {
    size: 8,
    color: rgb(0.3, 0.3, 0.3)
  });
  yPosition -= lineHeight * 3; // Más espacio después del encabezado

  // Sección 1: Datos Personales (ahora empieza más abajo)
  drawSection('DATOS PERSONALES', [
    { text: `Nombre completo: ${data.nombre} ${data.apellidoPaterno || ''} ${data.apellidoMaterno || ''}` },
    { text: `Cédula de Identidad: ${data.cedulaIdentidad} ${data.complemento || ''} ${data.expedicion || ''}` },
    { text: `Fecha de Nacimiento: ${data.fechaNacimiento}` },
    { text: `Grado de Instrucción: ${data.gradoInstruccion || 'No especificado'}` },
    { spacer: 5 }
  ]);

  // Resto de las secciones (sin cambios en el contenido)
  drawSection('INFORMACIÓN DE CONTACTO', [
    { text: `Email: ${data.email || 'No especificado'}` },
    { text: `Celular: ${data.celular || 'No especificado'}` },
    { spacer: 5 }
  ]);

  drawSection('DIRECCIÓN', [
    { text: `Ciudad: ${data.ciudad || 'No especificado'}` },
    { text: `Zona: ${data.zona || 'No especificado'}` },
    { text: `Calle/Avenida: ${data.calleAvenida || 'No especificado'}` },
    { text: `Número: ${data.numeroDomicilio || 'No especificado'}` },
    { spacer: 5 }
  ]);

  drawSection('DISPOSITIVO MÓVIL', [
    { text: `Marca: ${data.marcaCelular || 'No especificado'}` },
    { text: `Modelo: ${data.modeloCelular || 'No especificado'}` },
    { spacer: 5 }
  ]);

  drawSection('RECINTO ELECTORAL', [
    { text: `Tipo de Postulación: ${data.tipoPostulacion || 'No especificado'}` },
    { text: `ID Recinto: ${data.idRecinto || 'No especificado'}` },
    { text: `Nombre Recinto: ${data.nombreRecinto || 'No especificado'}` },
    { text: `Municipio: ${data.municipioRecinto || 'No especificado'}` },
    { text: `Vive cerca del recinto: ${data.viveCercaRecinto ? 'Sí' : 'No'}` },
    { spacer: 5 }
  ]);

  drawSection('DOCUMENTACIÓN ADJUNTADA', [
    { text: `Archivo CI: ${data.archivos.ci ? 'Presentado' : 'No presentado'}` },
    { text: `Archivo No Militancia: ${data.archivos.no_militancia ? 'Presentado' : 'No presentado'}` },
    { text: `Hoja de Vida: ${data.archivos.hoja_vida ? 'Presentado' : 'No presentado'}` },
    { text: `Captura de Pantalla: ${data.archivos.screenshot ? 'Presentado' : 'No presentado'}` },
    { spacer: 5 }
  ]);

  // Pie de página
  yPosition -= 20;
  drawText('Este documento es generado automáticamente y no requiere firma.', margin, yPosition, {
    size: 8,
    color: rgb(0.3, 0.3, 0.3)
  });
  yPosition -= lineHeight;
  drawText(`ID de registro: ${data.cedulaIdentidad}-${Date.now()}`, margin, yPosition, {
    size: 8,
    color: rgb(0.3, 0.3, 0.3)
  });

  // Guardar PDF
  const pdfBytes = await pdfDoc.save();
  const pdfPath = path.join(__dirname, '../public/comprobantes', `comprobante_${data.cedulaIdentidad}.pdf`);
  
  if (!fs.existsSync(path.dirname(pdfPath))) {
    fs.mkdirSync(path.dirname(pdfPath), { recursive: true });
  }

  fs.writeFileSync(pdfPath, pdfBytes);
  return pdfPath;
}

const crearPostulanteHandler = async (req, res) => {
  try {
    const data = req.body;
    const archivos = {
      ci: req.files['archivo_ci']?.[0]?.path || null,
      no_militancia: req.files['archivo_no_militancia']?.[0]?.path || null,
      hoja_vida: req.files['curriculum']?.[0]?.path || null,       // Nuevo
      screenshot: req.files['capturaPantalla']?.[0]?.path || null  // Nuevo
    };
    data.archivos = archivos;
    data.requisitos = JSON.stringify(data.requisitos);
    data.viveCercaRecinto = data.viveCercaRecinto === 'true';

    console.log (data)

    const nuevo = await crearPostulante(data);
    const pdfPath = await generarPDF(data);
    const pdfFilename = `comprobante_${data.cedulaIdentidad}.pdf`;

    res.status(201).json({ 
      success: true, 
      id: nuevo.id,
      pdfUrl: `/comprobantes/${pdfFilename}`,
      pdfFilename: pdfFilename,
      nombreCompleto: `${data.nombre} ${data.apellidoPaterno || ''} ${data.apellidoMaterno || ''}`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const verificarExistenciaPostulante = async (req, res) => {
  try {
    const { cedula_identidad, complemento } = req.query;

    if (!cedula_identidad) {
      return res.status(400).json({ success: false, error: 'Faltan campos requeridos.' });
    }

    const existe = await existePostulante(cedula_identidad, complemento);

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