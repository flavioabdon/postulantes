document.addEventListener('DOMContentLoaded', () => {
    const verificarForm = document.getElementById('verificarForm');
    const registroForm = document.getElementById('registroForm');
    const mensaje = document.getElementById('mensaje');
    const toastContainer = document.querySelector('.toast-container');

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
            return;
        }

        const url = `/api/postulantes/existe?cedula_identidad=${cedula_identidad}&complemento=${complemento}&expedicion=${expedicion}`;

        try {
            // Mostrar spinner de carga
            const submitBtn = verificarForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Verificando...';
            submitBtn.disabled = true;

            const response = await fetch(url);
            const result = await response.json();

            // Restaurar botón
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;

            if (result.success && result.existe) {
                showToast('⚠️ El postulante ya está registrado.', 'warning');
                registroForm.classList.add('d-none');
            } else {
                showToast('📝 Complete el formulario de registro.', 'info');
                registroForm.classList.remove('d-none');
                mensaje.classList.add('d-none');

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

            if (result.success) {
                showToast('✅ Postulante registrado correctamente.', 'success');
                registroForm.reset();
                registroForm.classList.add('d-none');
                verificarForm.reset();
                localStorage.clear();
                
                // Hacer scroll al inicio
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
});