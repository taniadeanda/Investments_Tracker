<?php
session_start();
header("Content-Type: application/json; charset=utf-8");
require "conexion.php";

if (!isset($_SESSION["usuario_id"])) {
    http_response_code(401);
    echo json_encode(["ok" => false, "mensaje" => "No autenticado."]);
    exit;
}

$id = intval($_POST["id"] ?? 0);
if ($id <= 0) {
    http_response_code(400);
    echo json_encode(["ok" => false, "mensaje" => "ID inválido."]);
    exit;
}

try {
    $stmt = $pdo->prepare(
        "DELETE FROM inversiones WHERE ID_inversion = ? AND ID_usuario = ?"
    );
    $stmt->execute([$id, $_SESSION["usuario_id"]]);

    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(["ok" => false, "mensaje" => "Inversión no encontrada."]);
        exit;
    }

    echo json_encode(["ok" => true, "mensaje" => "Inversión eliminada."]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["ok" => false, "mensaje" => "Error al eliminar."]);
}