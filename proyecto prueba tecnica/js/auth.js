// Base de datos de usuarios
const users = [
    { id: 1, username: 'admin', password: 'admin123', name: 'Administrador' },
    { id: 2, username: 'jperez', password: 'user123', name: 'Juan Pérez' },
    { id: 3, username: 'mgarcia', password: 'user123', name: 'María García' }
];

// Manejar el formulario de login
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Verificar credenciales
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        // Almacenar usuario en localStorage
        localStorage.setItem('currentUser', JSON.stringify({
            id: user.id,
            username: user.username,
            name: user.name
        }));
        
          // Inicializar secuencias si no existen
          if (!localStorage.getItem('secuenciaDocumento')) {
            localStorage.setItem('secuenciaDocumento', '1000');
        }
        if (!localStorage.getItem('secuenciaCrediticio')) {
            localStorage.setItem('secuenciaCrediticio', '5000');
        }
        // Redirigir al formulario principal
        window.location.href = 'garantias.html';
    } else {
        alert('Usuario o contraseña incorrectos');
    }
    
});
    

// Protección de rutas
document.addEventListener('DOMContentLoaded', function() {
    // Si estamos en garantias.html y no hay usuario, redirigir a login
    if (window.location.pathname.includes('garantias.html')) {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (!user) {
            window.location.href = 'index.html';
        } else {
            // Mostrar información del usuario
            document.getElementById('userDisplay').textContent = user.name;
            document.getElementById('archivadoPor').value = user.username;
        }
    }
    
    // Si estamos en index.html y hay usuario, redirigir a garantias.html
    if (window.location.pathname.includes('index.html') || 
        window.location.pathname === '/') {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (user) {
            window.location.href = 'garantias.html';
        }
    }
    
    // Manejar logout
    document.getElementById('logoutBtn')?.addEventListener('click', function() {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });
});
   