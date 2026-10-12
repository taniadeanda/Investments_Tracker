<?php
session_start();
header("Content-Type: application/json");
require "conexion.php";

$correo = trim($_POST["correo"] ?? "");
$contrasena = $_POST["contrasena"] ?? "";

$stmt = $pdo->prepare("SELECT id, contrasena_hash FROM usuarios WHERE correo = ?");
$stmt->execute([$correo]);
$usuario = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$usuario || !password_verify($contrasena, $usuario["contrasena_hash"])) {
    echo json_encode(["ok" => false, "mensaje" => "Correo o contraseña incorrectos."]);
    exit;
}

session_regenerate_id(true);
$_SESSION["usuario_id"] = $usuario["id"];
$_SESSION["correo"] = $correo;

echo json_encode(["ok" => true]);