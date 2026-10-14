<?php
session_start();
header("Content-Type: application/json; charset=utf-8");
require "conexion.php";

if (!isset($_SESSION["usuario_id"])) {
    http_response_code(401);
    echo json_encode(["ok" => false, "mensaje" => "No autenticado."]);
    exit;
}

$id          = intval($_POST["id"] ?? 0);
$plataforma  = trim($_POST["plataforma"] ?? "");
$cantidad    = floatval($_POST["cantidad"] ?? 0);
$rendimiento = floatval($_POST["rendimiento"] ?? 0);

if ($id <= 0 || $plataforma === "" || $cantidad <= 0) {
    http_response_code(400);
    echo json_encode(["ok" => false, "mensaje" => "Datos inválidos."]);
    exit;
}

try {
    // Solo puede editar sus propias inversiones (WHERE ID_usuario = ?)
    $stmt = $pdo->prepare(
        "UPDATE inversiones
         SET plataforma = ?, cantidad = ?, rendimiento = ?
         WHERE ID_inversion = ? AND ID_usuario = ?"
    );
    $stmt->execute([$plataforma, $cantidad, $rendimiento, $id, $_SESSION["usuario_id"]]);

    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(["ok" => false, "mensaje" => "Inversión no encontrada."]);
        exit;
    }

    echo json_encode(["ok" => true, "mensaje" => "Inversión actualizada."]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["ok" => false, "mensaje" => "Error al actualizar."]);
}