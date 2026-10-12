<?php 
//recibe nombre, correo, contrasena.Valida.Hashea la contraseña (password_hash).Inserta en la tabla usuarios.
//crea un usuario.

header("Content-Type: application/json; charset=utf-8");
require "conexion.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["ok" => false, "mensaje" => "Método no permitido."]);
    exit;
}

$correo     = trim($_POST["correo"] ?? "");
$contrasena = $_POST["contrasena"] ?? "";
$nombre     = trim($_POST["nombre"] ?? "");

if ($nombre === "") {
    http_response_code(400);
    echo json_encode(["ok" => false, "mensaje" => "El nombre es obligatorio."]);
    exit;
}
if (mb_strlen($nombre) < 2 || mb_strlen($nombre) > 100) {
    http_response_code(400);
    echo json_encode(["ok" => false, "mensaje" => "Nombre inválido."]);
    exit;
}
if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["ok" => false, "mensaje" => "Correo no válido."]);
    exit;
}
if (strlen($contrasena) < 8) {
    http_response_code(400);
    echo json_encode(["ok" => false, "mensaje" => "La contraseña debe tener al menos 8 caracteres."]);
    exit;
}

try {
    // Comprobación amistosa (no es la única defensa: debe haber UNIQUE en BD)
    $stmt = $pdo->prepare("SELECT id FROM usuarios WHERE correo = ?");
    $stmt->execute([$correo]);
    if ($stmt->fetch()) {
        http_response_code(409);
        echo json_encode(["ok" => false, "mensaje" => "Ese correo ya está registrado."]);
        exit;
    }

    $hash = password_hash($contrasena, PASSWORD_DEFAULT);

    $stmt = $pdo->prepare("INSERT INTO usuarios (nombre, correo, contrasena_hash) VALUES (?, ?, ?)");
    $stmt->execute([$nombre, $correo, $hash]);

} catch (PDOException $e) {
    if ($e->getCode() === "23000") {
        http_response_code(409);
        echo json_encode(["ok" => false, "mensaje" => "Ese correo ya está registrado."]);
    } else {
        http_response_code(500);
        echo json_encode(["ok" => false, "mensaje" => "Error al crear la cuenta."]);
    }
    exit;
}

echo json_encode(["ok" => true, "mensaje" => "Cuenta creada. Ya puedes iniciar sesión."]);