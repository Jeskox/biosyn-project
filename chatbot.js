// Este script se carga DESPUÉS de que el HTML del chatbot ya existe en la página.

// --- Declaración de todos los elementos del DOM ---
const launcher = document.getElementById('chat-launcher');
const windowElement = document.getElementById('chat-window');
const closeBtn = document.getElementById('chat-close-btn');
const form = document.getElementById('chat-form');
const input = document.getElementById('chat-input');
const messagesContainer = document.getElementById('chat-messages');
const typingIndicator = document.getElementById('chat-typing-indicator');
const startChatBtn = document.getElementById('startChatBtn'); // Botón en la página de contacto

// --- Configuración del Webhook ---
const webhookURL = 'https://n8n.jeskocloud.online/webhook/c20f835d-a376-4ccb-81e5-d84ef586e480';
let isFirstMessage = true;

// --- FUNCIÓN PARA ABRIR Y CERRAR LA VENTANA DEL CHAT ---
// Esta es la lógica que se había roto y ahora está restaurada.
function toggleChatWindow() {
    windowElement.classList.toggle('hidden');
    // Muestra el saludo solo la primera vez que se abre en una sesión
    if (!windowElement.classList.contains('hidden') && isFirstMessage) {
        addMessage("¡Hola! Soy el asistente virtual de BIOSYN. ¿Cómo puedo ayudarte hoy?", 'bot');
        isFirstMessage = false;
    }
}

// --- Asignación de Eventos ---
// Estos listeners son los que hacen que los botones funcionen.
launcher.addEventListener('click', toggleChatWindow);
closeBtn.addEventListener('click', toggleChatWindow);
if (startChatBtn) {
    startChatBtn.addEventListener('click', function(e) {
        e.preventDefault();
        toggleChatWindow();
    });
}

// --- Lógica para el envío de mensajes del usuario ---
form.addEventListener('submit', function(e) {
    e.preventDefault();
    const userInput = input.value.trim();
    if (!userInput) return;

    addMessage(userInput, 'user');
    sendToN8n(userInput);
    input.value = '';
});

// --- Funciones de ayuda para el chat ---

// Función para formatear el texto de la IA (Markdown a HTML)
function formatMessage(text) {
    const escapedText = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    let html = escapedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>');
    const lines = html.split('\n');
    let inList = false;
    let finalHtml = '';
    lines.forEach(line => {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('- ')) {
            if (!inList) {
                finalHtml += '<ul>';
                inList = true;
            }
            finalHtml += `<li>${trimmedLine.substring(2)}</li>`;
        } else {
            if (inList) {
                finalHtml += '</ul>';
                inList = false;
            }
            if (trimmedLine.length > 0) {
                finalHtml += `<p>${trimmedLine}</p>`;
            }
        }
    });
    if (inList) { finalHtml += '</ul>'; }
    return finalHtml.replace(/<p><\/p>/g, '');
}

// Función para añadir una burbuja de mensaje a la ventana del chat
function addMessage(text, sender) {
    const messageBubble = document.createElement('div');
    messageBubble.classList.add('message-bubble', `${sender}-message`);
    if (sender === 'bot') {
        messageBubble.innerHTML = formatMessage(text);
    } else {
        messageBubble.textContent = text;
    }
    messagesContainer.appendChild(messageBubble);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Función para crear y añadir el botón de "Ir al Formulario"
function addButtonToChat() {
    const button = document.createElement('a');
    button.href = 'contacto.html';
    button.className = 'btn';
    button.textContent = 'Ir al Formulario de Citas';
    button.style.margin = '10px auto';
    button.style.display = 'block';
    button.style.maxWidth = '250px';
    messagesContainer.appendChild(button);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// --- Lógica de comunicación con n8n ---
async function sendToN8n(message) {
    typingIndicator.style.display = 'block';
    
    const sessionId = sessionStorage.getItem('chatSessionId');

    try {
        const response = await fetch(webhookURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: message,
                sessionId: sessionId 
            })
        });

        if (!response.ok) { throw new Error('Error en la respuesta del servidor.'); }

        const data = await response.json();
        const botReply = data.reply || "No he podido procesar tu solicitud.";
        
        typingIndicator.style.display = 'none';
        addMessage(botReply, 'bot');

        // Revisa si la acción es mostrar el botón y lo añade
        if (data.action === 'SHOW_FORM_BUTTON') {
            addButtonToChat();
        }

    } catch (error) {
        console.error('Error al contactar con el webhook:', error);
        typingIndicator.style.display = 'none';
        addMessage("Lo siento, estoy teniendo problemas para conectarme.", 'bot');
    }
}