<?php
#conecta a la BD
//$host = "localhost"; //datos de conexión a db
//$base_datos = "investment_tracker";
//$usuario = "root";
//$contrasena = ""; //está mal tener la contraseña en texto plano 
//Los datos van en variables de entorno (.env) que no se suben al repo
//Conclusión: InfinityFree no admite variables de entorno reales ni archivos .env, la forma correcta 
// modificar directamente las credenciales de conexión a la base de datos en conexion.php

require __DIR__ . '/vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$host     = $_ENV['DB_HOST'] ?? 'localhost';
$base     = $_ENV['DB_NAME'];
$usuario  = $_ENV['DB_USER'];
$contrasena = $_ENV['DB_PASS'];

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$base;charset=utf8mb4",
        $usuario,
        $contrasena,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
} catch (PDOException $e) {
    die("Error de conexión: " . $e->getMessage());
}