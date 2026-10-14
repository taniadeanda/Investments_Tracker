<?php
session_start();
header("Content-Type: application/json; charset=utf-8");
require "conexion.php";

if (!isset($_SESSION["usuario_id"])) {
    http_response_code(401);
    echo json_encode(["ok" => false, "mensaje" => "No autenticado."]);
    exit;
}

try {
    $stmt = $pdo->prepare(
        "SELECT ID_inversion AS id, plataforma, cantidad, rendimiento
         FROM inversiones
         WHERE ID_usuario = ?
         ORDER BY ID_inversion ASC"
    );
    $stmt->execute([$_SESSION["usuario_id"]]);
    $inversiones = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["ok" => true, "inversiones" => $inversiones]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["ok" => false, "mensaje" => "Error al cargar inversiones."]);
}