document.addEventListener('DOMContentLoaded', function() {
    // --- NUEVO: Lógica para la Gestión de la Sesión ---
    function generateSessionId() {
        // Crea un ID único combinando la fecha actual y un número aleatorio.
        return 'session-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }

    function checkAndSetSessionId() {
        // Revisa si ya existe un ID en la "caja de memoria" de la sesión.
        let sessionId = sessionStorage.getItem('chatSessionId');
        if (!sessionId) {
            // Si no existe, crea uno nuevo y guárdalo.
            sessionId = generateSessionId();
            sessionStorage.setItem('chatSessionId', sessionId);
        }
        console.log("ID de Sesión actual:", sessionId); // Para pruebas, puedes verlo en la consola.
    }

    // Ejecuta la función tan pronto como la página carga.
    checkAndSetSessionId();
    

    // --- Lógica del Menú Principal y Enlaces Activos (sin cambios) ---
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const mainNav = document.getElementById('mainNav');
    const body = document.body;

    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', () => { 
            mainNav.classList.toggle('active');
            body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : 'auto';
        });
    }

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // --- Carga Segura y Dinámica del Chatbot (sin cambios) ---
    const chatbotContainer = document.getElementById('chatbot-container');
    if (chatbotContainer) {
        fetch('chatbot.html')
            .then(response => response.text())
            .then(html => {
                chatbotContainer.innerHTML = html;
                const chatbotScript = document.createElement('script');
                chatbotScript.src = 'chatbot.js';
                document.body.appendChild(chatbotScript);
            });
    }
});