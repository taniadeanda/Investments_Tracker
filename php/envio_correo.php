<?php
//instalar composer
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

// 1. Generar token seguro (para el enlace de restablecimiento)
$token = bin2hex(random_bytes(32)); // Generar token de 64 caracteres
$expira = date('Y-m-d H:i:s', strtotime('+1 hora')); // Válido por 1 hora
// ... (aquí debes guardar el token hasheado en la base de datos, asociado al usuario)

// 2. Construir el enlace de restablecimiento (apuntando a tu página reset_password.php)
$enlace = "http://localhost/Investment_Tracker/php/reset_password.php?token=" . $token;

// 3. Usar PHPMailer para enviar el correo
$mail = new PHPMailer(true);
try {
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'tu-correo@gmail.com';      // Tu dirección de Gmail
    $mail->Password   = 'abcd efgh ijkl mnop';      // La contraseña de aplicación que acabas de generar
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;

    $mail->setFrom('tu-correo@gmail.com', 'Investment Tracker');
    $mail->addAddress($correo_del_usuario);          // El correo del usuario que solicitó el restablecimiento

    $mail->isHTML(true);
    $mail->Subject = 'Restablece tu contraseña';
    $mail->Body    = "Haz clic en el siguiente enlace para restablecer tu contraseña: <a href='$enlace'>$enlace</a>";
    $mail->AltBody = "Copia este enlace en tu navegador: $enlace";

    $mail->send();
    echo json_encode(["ok" => true, "mensaje" => "Correo enviado."]);
} catch (Exception $e) {
    echo json_encode(["ok" => false, "mensaje" => "Error al enviar: {$mail->ErrorInfo}"]);
}