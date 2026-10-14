<?php
//323371694970-rcmqn5s44ajmv2p7ipq7i605ek1sd5js.apps.googleusercontent.com
//composer require google/apiclient //instalar
//se tendría que modificar también la base de datos con id_google en usuarios
//api de google https://console.cloud.google.com/auth/branding?project=concise-isotope-511600-k9
session_start();
header("Content-Type: application/json; charset=utf-8");
require "conexion.php";
require_once 'vendor/autoload.php'; // Cargar la biblioteca de Google

$id_token = $_POST['credential'] ?? '';

if (empty($id_token)) {
    echo json_encode(["ok" => false, "mensaje" => "Falta el token de Google."]);
    exit;
}

$client = new Google_Client(['client_id' => 'TU_ID_DE_CLIENTE.apps.googleusercontent.com']); // Reemplaza con tu ID de cliente
$payload = $client->verifyIdToken($id_token);

if (!$payload) {
    echo json_encode(["ok" => false, "mensaje" => "Token de Google inválido."]);
    exit;
}

$google_id = $payload['sub']; // ID único del usuario de Google
$email     = $payload['email'] ?? '';
$nombre    = $payload['name'] ?? 'Usuario de Google';

try {
    // Primero verificar si la cuenta de Google ya está vinculada
    $stmt = $pdo->prepare("SELECT id, nombre FROM usuarios WHERE google_id = ?");
    $stmt->execute([$google_id]);
    $usuario = $stmt->fetch();

    if ($usuario) {
        // Usuario antiguo: inicio de sesión directo
        $usuario_id = $usuario['id'];
        $usuario_nombre = $usuario['nombre'];
    } else {
        // Usuario nuevo: primero verificar si el email ya está registrado (evitar conflictos)
        $stmt = $pdo->prepare("SELECT id, nombre FROM usuarios WHERE correo = ?");
        $stmt->execute([$email]);
        $existente = $stmt->fetch();

        if ($existente) {
            // El email ya está registrado, vincular la cuenta de Google
            $stmt = $pdo->prepare("UPDATE usuarios SET google_id = ? WHERE id = ?");
            $stmt->execute([$google_id, $existente['id']]);
            $usuario_id = $existente['id'];
            $usuario_nombre = $existente['nombre'];
        } else {
            // Crear un nuevo usuario completamente
            $stmt = $pdo->prepare("INSERT INTO usuarios (nombre, correo, contrasena_hash, google_id) VALUES (?, ?, ?, ?)");
            // La contraseña se establece en cadena vacía o valor aleatorio, prohibir inicio de sesión con contraseña
            $stmt->execute([$nombre, $email, password_hash(bin2hex(random_bytes(16)), PASSWORD_DEFAULT), $google_id]);
            $usuario_id = $pdo->lastInsertId();
            $usuario_nombre = $nombre;
        }
    }

    // Crear sesión (consistente con tu login.php existente)
    session_regenerate_id(true);
    $_SESSION["usuario_id"] = $usuario_id;
    $_SESSION["nombre"] = $usuario_nombre;
    $_SESSION["correo"] = $email;

    echo json_encode(["ok" => true, "mensaje" => "Inicio de sesión exitoso"]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["ok" => false, "mensaje" => "Error del servidor."]);
}