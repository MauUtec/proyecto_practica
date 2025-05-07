document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticación
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user && window.location.pathname.includes('garantias.html')) {
        window.location.href = 'index.html';
        return;
    }
    document.getElementById('logoutBtn').addEventListener('click', function() {
         window.location.href = 'index.html';
    });

       // Configurar toast de errores
    const errorToast = new bootstrap.Toast(document.getElementById('errorToast'));
    const toastMessage = document.getElementById('toastMessage');
    
    function mostrarError(mensaje) {
        toastMessage.textContent = mensaje;
        errorToast.show();
    }

    document.querySelectorAll('input[type="text"]').forEach(input => {
        input.addEventListener('input', function() {
            this.value = this.value.toUpperCase();
        });
    });

// Control del campo "Otro tipo de documento"
const tipoDocumentoSelect = document.getElementById('tipoDocumento');
const otroTipoContainer = document.getElementById('otroTipoContainer');
const otroTipoDocumentoInput = document.getElementById('otroTipoDocumento');
const otroTipoFeedback = otroTipoContainer.querySelector('.invalid-feedback');

tipoDocumentoSelect.addEventListener('change', function() {
    if (this.value === 'Otro') {
        otroTipoContainer.classList.remove('hidden');
        otroTipoDocumentoInput.required = true;
    } else {
        otroTipoContainer.classList.add('hidden');
        otroTipoDocumentoInput.required = false;
        otroTipoDocumentoInput.value = '';
        otroTipoFeedback.style.display = 'none';
        otroTipoDocumentoInput.classList.remove('is-invalid');
    }

    // También limpiar validación de DUI si cambia a otro tipo
    const numeroDocInput = document.getElementById('numeroDocliente');
    const errorDoc = numeroDocInput.nextElementSibling; // Corrección aquí
    numeroDocInput.classList.remove('is-invalid');
    errorDoc.textContent = "";
});

// Validar campo "Otro tipo" cuando pierde el foco
otroTipoDocumentoInput.addEventListener('blur', function() {
    if (tipoDocumentoSelect.value === 'Otro' && !this.value.trim()) {
        this.classList.add('is-invalid');
        otroTipoFeedback.style.display = 'block';
    } else {
        this.classList.remove('is-invalid');
        otroTipoFeedback.style.display = 'none';
    }
});

// Validar campo DUI cuando pierde el foco
const numeroDocInput = document.getElementById('numeroDocliente');
numeroDocInput.addEventListener('blur', function() {
    const tipoDoc = tipoDocumentoSelect.value;
    const numDoc = this.value.trim();
    const errorDoc = this.nextElementSibling; // Corrección aquí

    let valido = true;

    if (tipoDoc === 'DUI' && !/^\d{8}-\d$/.test(numDoc)) {
        errorDoc.textContent = "El DUI debe tener 8 dígitos, un guión y 1 dígito (ej: 12345678-9)";
        this.classList.add('is-invalid');
        if (typeof mostrarError === 'function') {
            mostrarError('Formato de DUI incorrecto');
        }
        valido = false;
    } else {
        errorDoc.textContent = "";
        this.classList.remove('is-invalid');
    }
});

document.addEventListener('change', function() {
    // Elementos del formulario
    const tipoDocumento = document.getElementById('tipoDocumento');
    const numeroDocliente = document.getElementById('numeroDocliente');
    const nombreCliente = document.getElementById('nombreCliente');
    const numeroCliente = document.getElementById('numeroCliente');
    const nombreDocumento = document.getElementById('nombreDocumento');

    // Función para actualizar los campos concatenados
    function actualizarCampos() {
        const textoTipoDoc = tipoDocumento.options[tipoDocumento.selectedIndex]?.text || '';
        const textoNumeroDoc = numeroDocliente.value || '';
        const textoNombreCliente = nombreCliente.value || '';

        numeroCliente.value = textoNumeroDoc + "-" +textoNombreCliente;
        nombreDocumento.value = textoTipoDoc + "-" +textoNombreCliente;
    }

    // Escuchar cambios en los campos relevantes
    tipoDocumento.addEventListener('change', actualizarCampos);
    numeroDocliente.addEventListener('change', actualizarCampos);
    nombreCliente.addEventListener('change', actualizarCampos);

    // También actualizar al cargar por si ya hay valores
    actualizarCampos();
});
    
      document.getElementById('numeroCrediticio').value = 'CR-' + Date.now().toString().slice(-6);
    
    // Establecer fecha actual donde corresponda
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('fechaArchivado').value = hoy;
    document.getElementById('fechaDocumento').value = hoy;
    document.getElementById('fechaVigencia').value = hoy;
    
    // Fecha de expiración (1 año después)
    const unAnioDespues = new Date();
    unAnioDespues.setFullYear(unAnioDespues.getFullYear() + 1);
    document.getElementById('fechaExpiracion').value = unAnioDespues.toISOString().split('T')[0];
    
    // Hora actual
    document.getElementById('horaArchivado').value = new Date().toTimeString().substring(0, 5);
    
    
    // Limpiar todo el formulario
    document.getElementById('btnLimpiar').addEventListener('click', function() {
        if (confirm('¿Está seguro que desea limpiar todos los campos del formulario?')) {
            document.getElementById('garantiaForm').reset();
            otroTipoContainer.classList.add('hidden');
            otroTipoDocumentoInput.value = '';
            otroTipoFeedback.style.display = 'none';
            
            // Remover clases de validación
            document.querySelectorAll('.is-invalid').forEach(input => {
                input.classList.remove('is-invalid');
            });
            
            document.querySelectorAll('.invalid-feedback').forEach(feedback => {
                feedback.style.display = 'none';
            });
            
            document.getElementById('garantiaForm').classList.remove('was-validated');
        }
    });
    
    // Procesar formulario al enviar
    document.getElementById('garantiaForm').addEventListener('submit', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Validar tipo de documento "Otro"
        if (tipoDocumentoSelect.value === 'Otro' && !otroTipoDocumentoInput.value.trim()) {
            otroTipoDocumentoInput.classList.add('is-invalid');
            otroTipoFeedback.style.display = 'block';
            mostrarError('Por favor especifique el tipo de documento');
            otroTipoDocumentoInput.focus();
            return;
        }
        
        // Validar fechas
        const fechaVigencia = document.getElementById('fechaVigencia').value;
        const fechaExpiracion = document.getElementById('fechaExpiracion').value;
        
        if (fechaVigencia && fechaExpiracion && new Date(fechaExpiracion) <= new Date(fechaVigencia)) {
            mostrarError('La fecha de expiración debe ser posterior a la fecha de vigencia');
            document.getElementById('fechaExpiracion').focus();
            return;
        }
        
        // Validar todos los campos requeridos
        let formIsValid = true;
        const requiredInputs = document.querySelectorAll('[required]');
        
        requiredInputs.forEach(input => {
            if (!input.value.trim()) {
                input.classList.add('is-invalid');
                const feedback = input.nextElementSibling;
                if (feedback && feedback.classList.contains('invalid-feedback')) {
                    feedback.style.display = 'block';
                }
                formIsValid = false;
                
                // Mostrar el primer campo inválido
                if (formIsValid === false) {
                    input.focus();
                    formIsValid = null;
                }
            }
        });
        
        if (!formIsValid) {
            this.classList.add('was-validated');
            mostrarError('Por favor complete todos los campos obligatorios');
            return;
        }
        
        // Si todo está válido, procesar el formulario
        procesarFormulario();
    });
    

function procesarFormulario(mostrarAlerta = true) {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (!user) {
            mostrarError('No se encontró usuario autenticado');
            window.location.href = 'index.html';
            return null;
        }

        // Determinar el tipo de documento final
        const tipoDocumentoFinal = tipoDocumentoSelect.value === 'Otro' 
            ? otroTipoDocumentoInput.value 
            : tipoDocumentoSelect.value;
        
        // Estructura simplificada de datos


        const formData = {
            tipoDocumento: tipoDocumentoFinal,
            numeroDocliente: document.getElementById('numeroDocliente').value,
            nombreCliente: document.getElementById('nombreCliente').value,
            nombreDocumento: document.getElementById('nombreDocumento').value,
            numeroCliente: document.getElementById('numeroCliente').value,
            agencia: document.getElementById('agencia').value,
            idAgencia: document.getElementById('idAgencia').value,
            fechaVigencia: document.getElementById('fechaVigencia').value,
            fechaExpiracion: document.getElementById('fechaExpiracion').value,
            fechaDocumento: document.getElementById('fechaDocumento').value,
            fechaArchivado: document.getElementById('fechaArchivado').value,
            horaArchivado: document.getElementById('horaArchivado').value,
            archivadoPor: document.getElementById('archivadoPor').value,
            numeroCrediticio: document.getElementById('numeroCrediticio').value
        };
        
        if (mostrarAlerta) {
            console.log('Datos del formulario:', formData);
            console.log('JSON:', JSON.stringify(formData, null, 2));
            console.log('XML:', generarXml(formData));
            mostrarError('Formulario procesado correctamente');
        }
        
        return formData;
}

function generarXml(data) {
        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<garantia>\n`;
        
        // Generar elementos XML para cada campo
        xml += `  <tipoDocumento>${data.tipoDocumento || ''}</tipoDocumento>\n`;
        xml += `  <numeroDocliente>${data.numeroDocliente || ''}</numeroDocliente>\n`;
        xml += `  <nombreCliente>${data.nombreCliente || ''}</nombreCliente>\n`;
        xml += `  <nombreDocumento>${data.nombreDocumento || ''}</nombreDocumento>\n`;
        xml += `  <numeroCliente>${data.numeroCliente || ''}</numeroCliente>\n`;
        xml += `  <agencia>${data.agencia || ''}</agencia>\n`;
        xml += `  <idAgencia>${data.idAgencia || ''}</idAgencia>\n`;        
        xml += `  <fechaVigencia>${data.fechaVigencia || ''}</fechaVigencia>\n`;
        xml += `  <fechaExpiracion>${data.fechaExpiracion || ''}</fechaExpiracion>\n`;
        xml += `  <fechaDocumento>${data.fechaDocumento || ''}</fechaDocumento>\n`;
        xml += `  <fechaArchivado>${data.fechaArchivado || ''}</fechaArchivado>\n`;
        xml += `  <horaArchivado>${data.horaArchivado || ''}</horaArchivado>\n`;
        xml += `  <archivadoPor>${data.archivadoPor || ''}</archivadoPor>\n`;
        xml += `  <numeroCrediticio>${data.numeroCrediticio || ''}</numeroCrediticio>\n`;
        
        xml += `</garantia>`;
        return xml;
}
    
// Función de validación de campos requeridos
function validarCamposRequeridos() {
    let formIsValid = true;
    const requiredInputs = document.querySelectorAll('[required]');

    requiredInputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('is-invalid');
            const feedback = input.nextElementSibling;
            if (feedback && feedback.classList.contains('invalid-feedback')) {
                feedback.style.display = 'block';
            }
            formIsValid = false;

            // Mostrar el primer campo inválido
            if (formIsValid === false) {
                input.focus();
                formIsValid = null;
            }
        }
    });

    if (!formIsValid) {
        document.getElementById('garantiaForm').classList.add('was-validated');
        mostrarError('Por favor complete todos los campos obligatorios');
        return false;
    }

    // Validación adicional de fechas
    const fechaVigencia = document.getElementById('fechaVigencia').value;
    const fechaExpiracion = document.getElementById('fechaExpiracion').value;

    if (fechaVigencia && fechaExpiracion && new Date(fechaExpiracion) <= new Date(fechaVigencia)) {
        mostrarError('La fecha de expiración debe ser posterior a la fecha de vigencia');
        document.getElementById('fechaExpiracion').focus();
        return false;
    }

    // Validación adicional de "Otro tipo de documento"
    if (tipoDocumentoSelect.value === 'Otro' && !otroTipoDocumentoInput.value.trim()) {
        otroTipoDocumentoInput.classList.add('is-invalid');
        otroTipoFeedback.style.display = 'block';
        mostrarError('Por favor especifique el tipo de documento');
        otroTipoDocumentoInput.focus();
        return false;
    }

    return true;
}

// Usar la nueva función en el submit
document.getElementById('garantiaForm').addEventListener('submit', function(e) {
    e.preventDefault();
    e.stopPropagation();

    if (!validarCamposRequeridos()) {
        return;
    }

    // Si todo está válido, procesar el formulario
    procesarFormulario();
});

// Validación antes de descargar JSON
document.getElementById('btnDescargarJSON').addEventListener('click', function() {
    if (!validarCamposRequeridos()) {
        return; // No descargar si no es válido
    }

    const formData = procesarFormulario(false);
    if (formData) {
        descargarArchivo('garantia_cliente.json', JSON.stringify(formData, null, 2), 'application/json');
    }
});

//  Validación antes de descargar XML
document.getElementById('btnDescargarXML').addEventListener('click', function() {
    if (!validarCamposRequeridos()) {
        return; // No descargar si no es válido
    }

    const formData = procesarFormulario(false);
    if (formData) {
        const xmlData = generarXml(formData);
        descargarArchivo('garantia_cliente.xml', xmlData, 'application/xml');
    }
});


function descargarArchivo(nombre, contenido, tipo) {
        const blob = new Blob([contenido], { type: tipo });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = nombre;
        document.body.appendChild(a);
        a.click();
        
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
 }
});