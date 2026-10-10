
<?php

$host = "localhost";
$base_datos = "InvestmentTracker";
$usuario = "root";
$contrasena = ""; #aqui que?

try {
    $conexion = new PDO(
        "mysql:host=$host;dbname=$base_datos;charset=utf8mb4",
        $usuario,
        $contrasena
    );

    $conexion->setAttribute(
        PDO::ATTR_ERRMODE,
        PDO::ERRMODE_EXCEPTION
    );

} catch (PDOException $e) {
    error_log($e->getMessage());

    http_response_code(500);
    exit("No se pudo conectar con la base de datos.");
}
