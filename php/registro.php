<?php
header("Content-Type: application/json");
require "conexion.php";

$correo = trim($_POST["correo"] ?? "");
$contrasena = $_POST["contrasena"] ?? "";

if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["ok" => false, "mensaje" => "Correo no válido."]);
    exit;
}
if (strlen($contrasena) < 8) {
    echo json_encode(["ok" => false, "mensaje" => "La contraseña debe tener al menos 8 caracteres."]);
    exit;
}

// ¿Ya existe?
$stmt = $pdo->prepare("SELECT id FROM usuarios WHERE correo = ?");
$stmt->execute([$correo]);
if ($stmt->fetch()) {
    echo json_encode(["ok" => false, "mensaje" => "Ese correo ya está registrado."]);
    exit;
}

$hash = password_hash($contrasena, PASSWORD_DEFAULT);
$stmt = $pdo->prepare("INSERT INTO usuarios (correo, contrasena_hash) VALUES (?, ?)");
$stmt->execute([$correo, $hash]);

echo json_encode(["ok" => true, "mensaje" => "Cuenta creada. Ya puedes iniciar sesión."]);