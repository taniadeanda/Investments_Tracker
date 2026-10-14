
<?php
#conecta a la BD
$host = "localhost"; //datos de conexión a db
$base_datos = "investment_tracker";
$usuario = "root";
$contrasena = ""; //está mal tener la contraseña en texto plano 
//Los datos van en variables de entorno (.env) que no se suben al repo

try {
    $pdo = new PDO( //objeto para conectarse
        "mysql:host=$host;dbname=$base_datos;charset=utf8mb4",
        $usuario,
        $contrasena 
    );

    $pdo->setAttribute( //configura como se comporta PDO cuando hay errores
        PDO::ATTR_ERRMODE, //esta configurando errores
        PDO::ERRMODE_EXCEPTION //lanza excepciones cuando hay errores
    );

} catch (PDOException $e) { //exception tipo PDOExepction y la guarda en e
    error_log($e->getMessage()); //mensaje error
    http_response_code(500); //codigo error
    echo json_encode(["ok" => false, "mensaje" => "No se pudo conectar con la base de datos."]); //Convierte un array de PHP en un string JSON y lo envía al cliente.
    exit;
}

?>