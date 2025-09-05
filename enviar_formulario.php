<?php
// Verificamos que los datos se envíen por el método POST, una medida de seguridad.
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // --- CONFIGURACIÓN IMPORTANTE ---
    // Reemplaza con los correos electrónicos correctos

    // Correo de la empresa (BIOSYN) que recibirá la solicitud del cliente
    $email_empresa = "adn.identidad24@gmail.com";
    
    // Correo de tu cliente (el colaborador) que recibirá la copia para seguimiento
    $email_cliente_colaborador = "el-correo-de-tu-cliente@gmail.com"; // <-- ¡DEBES CAMBIAR ESTO!

    // Asunto del correo, CLAVE para el seguimiento
    $asunto = "Nueva Solicitud de Contacto Web (Referido por Colaborador)";

    // --- RECOLECCIÓN Y LIMPIEZA DE DATOS DEL FORMULARIO ---
    // Usamos funciones de seguridad para limpiar los datos que envía el usuario
    $nombre = htmlspecialchars(trim($_POST['nombre']));
    $telefono = htmlspecialchars(trim($_POST['telefono']));
    $email = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
    $mensaje = htmlspecialchars(trim($_POST['mensaje']));
    $fuente = htmlspecialchars(trim($_POST['fuente-del-lead'])); // El campo oculto que identifica a tu cliente

    // --- VALIDACIÓN BÁSICA ---
    // Si faltan campos obligatorios, el script se detiene para evitar correos vacíos
    if (empty($nombre) || empty($telefono) || empty($mensaje)) {
        echo "Error: Por favor, complete todos los campos obligatorios del formulario.";
        exit;
    }

    // --- CONSTRUCCIÓN DEL CUERPO DEL CORREO ---
    // Este es el mensaje que recibirán tanto la empresa como tu cliente
    $cuerpo_mensaje = "Se ha recibido una nueva solicitud de contacto a través del formulario web:\n\n";
    $cuerpo_mensaje .= "--------------------------------------------------\n";
    $cuerpo_mensaje .= "Nombre del Cliente: " . $nombre . "\n";
    $cuerpo_mensaje .= "Teléfono de Contacto: " . $telefono . "\n";
    if (!empty($email)) {
        $cuerpo_mensaje .= "Email: " . $email . "\n";
    }
    $cuerpo_mensaje .= "Consulta del Cliente: \n" . $mensaje . "\n\n";
    $cuerpo_mensaje .= "--------------------------------------------------\n";
    $cuerpo_mensaje .= "Este cliente fue referido por: " . $fuente . "\n"; // Información crucial para la comisión

    // --- CONSTRUCCIÓN DE LAS CABECERAS DEL CORREO ---
    // Esto asegura que el correo se envíe correctamente y que tu cliente reciba su copia
    $headers = "From: no-reply@" . $_SERVER['SERVER_NAME'] . "\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";
    $headers .= "BCC: " . $email_cliente_colaborador . "\r\n"; // ¡LA MAGIA! Envía una copia oculta a tu cliente
    $headers .= "X-Mailer: PHP/" . phpversion();

    // --- ENVIAR EL CORREO ---
    // La función mail() de PHP se encarga de todo en el servidor de Hostinger
    if (mail($email_empresa, $asunto, $cuerpo_mensaje, $headers)) {
        // Si el correo se envía con éxito, redirige al usuario a la página de agradecimiento
        header("Location: mensaje-enviado.html");
    } else {
        // Si hay un error en el servidor al enviar el correo
        echo "Lo sentimos, hubo un error al enviar el mensaje. Por favor, inténtelo de nuevo más tarde.";
    }
    exit;
} else {
    // Medida de seguridad: si alguien intenta acceder a este archivo directamente desde el navegador
    echo "Acceso no permitido.";
}
?>