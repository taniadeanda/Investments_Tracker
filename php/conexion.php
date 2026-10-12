
<?php
#conecta a la BD
$host = "localhost";
$base_datos = "investment_tracker";
$usuario = "root";
$contrasena = ""; 

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$base_datos;charset=utf8mb4",
        $usuario,
        $contrasena
    );

    $pdo->setAttribute(
        PDO::ATTR_ERRMODE,
        PDO::ERRMODE_EXCEPTION
    );

} catch (PDOException $e) {
    error_log($e->getMessage());

    http_response_code(500);
    echo json_encode(["ok" => false, "mensaje" => "No se pudo conectar con la base de datos."]);
    exit;
}

?>