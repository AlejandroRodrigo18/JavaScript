<?php
    header("Content-Type: application/json");

    function conexionBD() {
        $host = "fdb1032.awardspace.net";
        $db   = "4717048_chinook";
        $user = "4717048_chinook";
        $pass = "7I#*o!#+51eCO-jb";

        try {
            $pdo = new PDO(
                "mysql:host=$host;dbname=$db;charset=utf8",
                $user,
                $pass,
                array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION)
            );

            return $pdo;
        } catch (PDOException $e) {
            echo json_encode(array(
                "success" => false,
                "error" => "Error de conexión con la base de datos"
            ));
            exit;
        }
    }

    function obtenerAccion() {
        if (!isset($_GET["action"])) {
            echo json_encode(array(
                "success" => false,
                "error" => "Acción no especificada"
            ));
            exit;
        }
        return $_GET["action"];
    }

//--------------------------------------------------------------//

 function guardarProducto() {

    $pdo = conexionBD();
    //constante $data la pasamos a de ser un JSON para convertirlo en un objeto PHP o en una array asociativo
    $data = json_decode(file_get_contents("php://input"), true);

    $id = null;
    $nombre = null;
    $descripcion = null;
    $precio = null;

    if (isset($data["id"])) {
        $id = $data["id"];
    }
    if (isset($data["nombre"])) {
        $nombre = $data["nombre"];
    }
    if (isset($data["descripcion"])) {
        $descripcion = $data["descripcion"];
    }
    if (isset($data["precio"])) {
        $precio = $data["precio"];
    }

 // Validación backend (asíncrona)
    if ($id === null || $nombre === "" || $precio === null || $descripcion === "") {
        echo json_encode(array(
            "success" => false,
            "error" => "Datos incompletos"
        ));
        exit;
    }


    // Comprobar ID duplicado
    $stmt = $pdo->prepare(
        "SELECT id FROM productos WHERE id = :id"
    );
    $stmt->bindParam(":id", $id);
    $stmt->execute();

    if ($stmt->fetch()) {
        //creación de un array asociativo que guarda las claves donde luego 
        //lo pasamos a una cadena JSON para que JS lo pueda leer sin complicaciones
        echo json_encode(array(
            "success" => false,
            "error" => "ID duplicado"
        ));
        exit;
    }

    // Insertar producto
    $stmt = $pdo->prepare(
        "INSERT INTO productos (id, nombre, descripcion, precio)
         VALUES (:id, :nombre, :descripcion, :precio)"
    );

    $stmt->bindParam(":id", $id);
    $stmt->bindParam(":nombre", $nombre);
    $stmt->bindParam(":descripcion", $descripcion);
    $stmt->bindParam(":precio", $precio);

    try {
        $stmt->execute();
        echo json_encode(array(
            "success" => true,
            "message" => "Producto guardado"
        ));
    } catch (PDOException $e) {
        echo json_encode(array(
            //creación de un array asociativo que guarda las claves donde luego 
            //lo pasamos a una cadena JSON para que JS lo pueda leer sin complicaciones
            "success" => false,
            "error" => "Error al guardar el producto"
        ));
    }

    exit;
}
    function borrarProducto() {
        $pdo = conexionBD();
        //constante $data la pasamos a de ser un JSON para convertirlo en un objeto PHP o en una array asociativo
        $data = json_decode(file_get_contents("php://input"), true);

        if (!isset($data["id"])) {
            echo json_encode(array(
                //creación de un array asociativo que guarda las claves donde luego 
                //lo pasamos a una cadena JSON para que JS lo pueda leer sin complicaciones
                "success" => false,
                "error" => "ID no recibido"
            ));
            exit;
        }

        $id = $data["id"];

        // Comprobar existencia
        $stmt = $pdo->prepare("SELECT id FROM productos WHERE id = :id");
        $stmt->bindParam(":id", $id);
        $stmt->execute();

        if (!$stmt->fetch()) {
            echo json_encode(array(
                "success" => false,
                "error" => "El producto no existe"
            ));
            exit;
        }

        // Borrar
        $stmt = $pdo->prepare("DELETE FROM productos WHERE id = :id");
        $stmt->bindParam(":id", $id);
        $stmt->execute();

        echo json_encode(array(
            //creación de un array asociativo que guarda las claves donde luego 
            //lo pasamos a una cadena JSON para que JS lo pueda leer sin complicaciones
            "success" => true,
            "message" => "Producto eliminado"
        ));
        exit;
    }


//--------------------------------------------------------------//

    $action = obtenerAccion();

   if ($action === "guardar") {
    guardarProducto();
    } elseif ($action === "borrar") {
        borrarProducto();
    } else {
        //creación de un array asociativo que guarda las claves donde luego 
        //lo pasamos a una cadena JSON para que JS lo pueda leer sin complicaciones
        echo json_encode(array(
            "success" => false,
            "error" => "Acción no reconocida"
        ));
    }

?>
