<?php 
//verifica credenciales
session_start();
header("Content-Type: application/json; charset=utf-8"); //Le dice al navegador que responderás JSON
require "conexion.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") { //Comprueba que la petición es POST	Login debe ser POST (no se manda contraseña por URL)
    http_response_code(405);
    echo json_encode(["ok" => false, "mensaje" => "Método no permitido."]);
    exit;
}

$correo = trim($_POST["correo"] ?? "");
$contrasena = $_POST["contrasena"] ?? "";

if ($correo === "" || $contrasena === "") {
    http_response_code(400);
    echo json_encode(["ok" => false, "mensaje" => "Faltan datos."]);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT id, nombre, correo, contrasena_hash FROM usuarios WHERE correo = ?"); //prepara consulta SQL, el ? evita inyeccion sql
    $stmt->execute([$correo]); //ejecuta consulta con valor real
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC); //recupera el primer resultado como array
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["ok" => false, "mensaje" => "Error del servidor."]);
    exit;
}

if (!$usuario || !password_verify($contrasena, $usuario["contrasena_hash"])) {
    http_response_code(401);
    echo json_encode(["ok" => false, "mensaje" => "Correo o contraseña incorrectos."]);
    exit;
}

session_regenerate_id(true); //se regenera la sesion para evitar ataque de session fixation
$_SESSION["usuario_id"] = $usuario["id"]; //guarda los datos del usuario en la sesión
$_SESSION["nombre"]     = $usuario["nombre"];
$_SESSION["correo"]     = $usuario["correo"];

echo json_encode(["ok" => true]);