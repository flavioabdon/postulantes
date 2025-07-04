document.addEventListener('DOMContentLoaded', () => {
    const verificarForm = document.getElementById('verificarForm');
    const registroForm = document.getElementById('registroForm');
    const mensaje = document.getElementById('mensaje');
    const toastContainer = document.querySelector('.toast-container');
    //validacion
    // Validación en tiempo real para CI (solo números)
    document.getElementById('cedula_identidad').addEventListener('input', function(e) {
        this.value = this.value.replace(/[^0-9]/g, '');
    });

    // Validación en tiempo real para complemento (solo letras y números, max 2)
    document.getElementById('complemento').addEventListener('input', function(e) {
        this.value = this.value.replace(/[^A-Za-z0-9]/g, '').substring(0, 2);
    });

    // Validación en tiempo real para nombre (solo letras)
    document.getElementById('nombre').addEventListener('input', function(e) {
        this.value = this.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúñÑ\s]/g, '');
    });

    // Validación en tiempo real para apellido paterno (solo letras)
    document.getElementById('apellidoPaterno').addEventListener('input', function(e) {
        this.value = this.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúñÑ\s]/g, '');
    });

    // Validación en tiempo real para apellido materno (solo letras)
    document.getElementById('apellidoMaterno').addEventListener('input', function(e) {
        this.value = this.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúñÑ\s]/g, '');
    });

    // Validación en tiempo real para ciudad (solo letras)
    document.getElementById('ciudad').addEventListener('input', function(e) {
        this.value = this.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúñÑ\s]/g, '');
    });

    // Validación en tiempo real para zona (solo letras)
    document.getElementById('zona').addEventListener('input', function(e) {
        this.value = this.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúñÑ\s]/g, '');
    });

    // Validación en tiempo real para calle/avenida (solo letras)
    document.getElementById('calleAvenida').addEventListener('input', function(e) {
        this.value = this.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúñÑ\s]/g, '');
    });

    // Validación en tiempo real para nro domicilio (solo números, max 5)
    document.getElementById('numeroDomicilio').addEventListener('input', function(e) {
        this.value = this.value.replace(/[^0-9]/g, '').substring(0, 5);
    });

    // Validación en tiempo real para celular (solo números 6 o 7 al inicio)
    document.getElementById('celular').addEventListener('input', function(e) {
        this.value = this.value.replace(/[^0-9]/g, '');
        if (this.value.length > 0 && !/^[6-7]/.test(this.value)) {
            this.value = '';
            showToast('El celular debe comenzar con 6 o 7', 'warning');
        }
        if (this.value.length > 8) {
            this.value = this.value.substring(0, 8);
        }
    });

    // Validación para marca de celular (max 30 caracteres)
    document.getElementById('marcaCelular').addEventListener('input', function(e) {
        if (this.value.length > 30) {
            this.value = this.value.substring(0, 30);
        }
    });

    // Validación para modelo de celular (max 30 caracteres)
    document.getElementById('modeloCelular').addEventListener('input', function(e) {
        if (this.value.length > 30) {
            this.value = this.value.substring(0, 30);
        }
    });

    // Validación para ID Recinto (formato d-dddd-ddddd)
    document.getElementById('idRecinto').addEventListener('input', function(e) {
        // Permitir solo dígitos y guiones en las posiciones correctas
        let value = this.value.replace(/[^0-9-]/g, '');
        
        // Asegurar el formato
        if (value.length > 1 && value.charAt(1) !== '-') {
            value = value.substring(0, 1) + '-' + value.substring(1);
        }
        if (value.length > 6 && value.charAt(6) !== '-') {
            value = value.substring(0, 6) + '-' + value.substring(6);
        }
        
        // Limitar longitud total
        if (value.length > 13) {
            value = value.substring(0, 13);
        }
        
        this.value = value;
    });
    // Función para mostrar notificaciones Toast
    function showToast(message, type = 'info') {
        const toastEl = document.createElement('div');
        toastEl.className = `toast align-items-center text-white bg-${type} border-0`;
        toastEl.setAttribute('role', 'alert');
        toastEl.setAttribute('aria-live', 'assertive');
        toastEl.setAttribute('aria-atomic', 'true');
        
        toastEl.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        `;
        
        toastContainer.appendChild(toastEl);
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
        
        // Eliminar el toast del DOM después de que se oculte
        toastEl.addEventListener('hidden.bs.toast', () => {
            toastEl.remove();
        });
    }

    verificarForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const cedula_identidad = verificarForm.cedula_identidad.value.trim();
        const complemento = verificarForm.complemento.value.trim();
        const expedicion = verificarForm.expedicion.value;

        if (!cedula_identidad || !expedicion) {
            showToast('⚠️ Debe completar los campos requeridos.', 'warning');
            document.getElementById("btn_verificar").addEventListener("click", function () {
                const seccion = document.getElementById("seccion-verificacion");
                const inputs = seccion.querySelectorAll("input, select");
                const boton = document.getElementById("btn_verificar")
                
          
                // Deshabilitar todos los inputs dentro de la sección
                inputs.forEach(input => {
                  input.disabled=false;
                  //input.style.pointerEvents = "none"; // Deshabilita el input pero mantiene su valor
                  //input.style.opacity = "0.5"
                  boton.style.pointerEvents = "none"; // Deshabilita clics adicionales
                  boton.style.opacity = "0.5"; // Cambia apariencia
                  
                  
                });
            });
            return;
        }

        const url = `/api/postulantes/existe?cedula_identidad=${cedula_identidad}&complemento=${complemento}`;

        try {
            // Mostrar spinner de carga
            const submitBtn = verificarForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Verificando...';
            

            const response = await fetch(url);
            const result = await response.json();

            // Restaurar botón
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;

            if (result.success && result.existe) {
                showToast('⚠️ El postulante ya está registrado.', 'warning');
                registroForm.classList.add('d-none');
                submitBtn.disabled = true;
            } else {
                showToast('📝 Complete el formulario de registro.', 'info');
                registroForm.classList.remove('d-none');
                mensaje.classList.add('d-none');
                submitBtn.disabled = true;
                // Hacer scroll suave al formulario de registro
                registroForm.scrollIntoView({ behavior: 'smooth' });

                // Guardar en localStorage para usarlos en el submit final
                localStorage.setItem('cedula_identidad', cedula_identidad);
                localStorage.setItem('complemento', complemento);
                localStorage.setItem('expedicion', expedicion);
            }
        } catch (error) {
            console.error('Error al verificar:', error);
            showToast('❌ Error de conexión al verificar.', 'danger');
            
            // Restaurar botón en caso de error
            const submitBtn = verificarForm.querySelector('button[type="submit"]');
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    });

    // Envío del formulario de registro
    registroForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        //
        const fechaNacimiento = new Date(document.getElementById('fechaNacimiento').value);
        const fechaMinima = new Date('2005-08-17');
        
        if (fechaNacimiento > fechaMinima) {
            e.preventDefault();
            showToast('Debe ser mayor de edad (nacido antes del 17/08/2005)', 'warning');
            return;
        }

        // Validar rango de celular (60000000-79999999)
        const celular = document.getElementById('celular').value;
        if (celular < 60000000 || celular > 79999999) {
            e.preventDefault();
            showToast('El celular debe estar entre 60000000 y 79999999', 'warning');
            return;
        }
        // Mostrar spinner de carga
        const submitBtn = registroForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Registrando...';
        submitBtn.disabled = true;

        const formData = new FormData(registroForm);

        // Recuperar datos guardados
        const cedulaIdentidad = localStorage.getItem('cedula_identidad');
        const complemento = localStorage.getItem('complemento') || '';
        const expedicion = localStorage.getItem('expedicion');

        formData.append('cedulaIdentidad', cedulaIdentidad);
        formData.append('complemento', complemento);
        formData.append('expedicion', expedicion);

        // Construir objeto requisitos
        const requisitos = {
            esBoliviano: false,
            registradoPadronElectoral: false,
            cedulaIdentidadVigente: false,
            disponibilidadTiempoCompleto: false,
            celularConCamara: false,
            android8_2OSuperior: false,
            lineaEntel: false,
            ningunaMilitanciaPolitica: false,
            sinConflictosInstitucion: false
        };

        document.querySelectorAll('input[name="requisitos"]:checked').forEach(chk => {
            requisitos[chk.value] = true;
        });

        formData.append('requisitos', JSON.stringify(requisitos));

        try {
            const res = await fetch('/api/postulantes', {
                method: 'POST',
                body: formData
            });

            const result = await res.json();

            // Restaurar botón
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;

            // Dentro del registroForm.addEventListener('submit')
            if (result.success) {
                showToast('✅ Postulante registrado correctamente.', 'success');
                
                // Descargar automáticamente el PDF
                if (result.pdfUrl) {
                const downloadLink = document.createElement('a');
                downloadLink.href = result.pdfUrl;
                downloadLink.download = result.pdfFilename || 'comprobante_postulacion.pdf';
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
                
                // Mostrar enlace adicional por si falla la descarga automática
                showToast(`📄 <a href="${result.pdfUrl}" download class="text-white">Descargar comprobante</a>`, 'success');
                }
            
                registroForm.reset();
                registroForm.classList.add('d-none');
                verificarForm.reset();
                localStorage.clear();
                
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                showToast(`❌ Error al registrar: ${result.error}`, 'danger');
            }
        } catch (err) {
            console.error(err);
            showToast('❌ Error de red al registrar.', 'danger');
            
            // Restaurar botón en caso de error
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    });

    // Validación en tiempo real para CI (solo números)
    document.getElementById('cedula_identidad').addEventListener('input', function(e) {
        this.value = this.value.replace(/[^0-9]/g, '');
    });

    // Validación en tiempo real para celular (solo números)
    document.getElementById('celular').addEventListener('input', function(e) {
        this.value = this.value.replace(/[^0-9]/g, '');
    });
        //habiliacion de campo carrera
        const select = document.getElementById('gradoInstruccion');
        const input = document.getElementById('carrera');
    
        select.addEventListener('change', () => {
            if (select.value === 'BACHILLER') {
                    input.disabled = true; // Habilitar el campo
            } else {
                    input.disabled = false; // Deshabilitar el campo
            }
        });
    
        //deshabilitar el campo de CI
        document.getElementById("btn_verificar").addEventListener("click", function () {
          const seccion = document.getElementById("seccion-verificacion");
          const inputs = seccion.querySelectorAll("input, select");
          const boton = document.getElementById("btn_verificar")
          
    
          // Deshabilitar todos los inputs dentro de la sección
          inputs.forEach(input => {
            input.disabled=true;
            //input.style.pointerEvents = "none"; // Deshabilita el input pero mantiene su valor
            //input.style.opacity = "0.5"
            boton.style.pointerEvents = "none"; // Deshabilita clics adicionales
            boton.style.opacity = "0.5"; // Cambia apariencia
            
            
          });
         
        });
    
        //habiliacion de campo carrera
        const select2 = document.getElementById('experienciaEspecifica');
        const select3 = document.getElementById('nroDeProcesos');
    
        select2.addEventListener('change', () => {
            if (select2.value === 'SI') {
                    select3.disabled = false; // Habilitar el campo
            } else {
                    select3.value = "0";
                    select3.disabled = true; // Deshabilitar el campo
            }
        });
});