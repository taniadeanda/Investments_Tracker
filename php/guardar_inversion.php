
<?php
session_start();
header("Content-Type: application/json; charset=utf-8");
require "conexion.php";

//Verifica que el usuario haya iniciado sesión
if (!isset($_SESSION["usuario_id"])) {
    http_response_code(401);
    echo json_encode([
        "ok" => false,
        "mensaje" => "Debes iniciar sesión."
    ]);
    exit;
}

//solo solicitudes POST
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode([
        "ok" => false,
        "mensaje" => "Método no permitido."
    ]);
    exit;
}

//ecibir datos del formulario
$plataforma = trim($_POST["plataforma"] ?? "");
$cantidad = $_POST["cantidad"] ?? "";
$rendimiento = $_POST["rendimiento"] ?? "";

//Validar 
if (
    $plataforma === "" ||
    mb_strlen($plataforma) > 100 ||
    !is_numeric($cantidad) ||
    !is_numeric($rendimiento) ||
    !is_finite((float)$cantidad) ||
    !is_finite((float)$rendimiento) ||
    (float)$cantidad <= 0
) {
    http_response_code(400);
    echo json_encode([
        "ok" => false,
        "mensaje" => "Revisa los datos de la inversión."
    ]);
    exit;
}

try { //Guardar la inversión
    $sql = "INSERT INTO inversiones
            (ID_usuario, plataforma, cantidad, rendimiento)
            VALUES (?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $_SESSION["usuario_id"],
        $plataforma,
        $cantidad,
        $rendimiento
    ]);
    echo json_encode([
        "ok" => true,
        "mensaje" => "Inversión guardada correctamente.",
        "id" => $pdo->lastInsertId()
    ]);

} catch (PDOException $e) {
    error_log($e->getMessage());
    http_response_code(500);
    echo json_encode([
        "ok" => false,
        "mensaje" => "No se pudo guardar la inversión."
    ]);
}
?>
