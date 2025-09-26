<?php

$DEFAULT_PASSWORD = '123456';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Configuración de la base de datos
define('DB_HOST', 'localhost');
define('DB_NAME', 'pae');
define('DB_USER', 'root');
define('DB_PASS', '');//fixme
define('DB_PORT', 3306); // Puerto por defecto de MySQL

// Configuración de la aplicación
define('APP_NAME', 'AppAdopciones');
define('APP_VERSION', '1.0.0');
define('UPLOAD_PATH', './uploads/mascotas/');

define('MAX_FILE_SIZE', 5 * 1024 * 1024);
define('ALLOWED_EXTENSIONS', ['jpg', 'jpeg', 'png', 'gif']);

class Database
{
    private $connection;

    public function __construct()
    {
        $this->connect();
    }

    private function connect()
    {
        try {
            // Intentar conexión con puerto específico
            $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=utf8mb4";

            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4",
                PDO::ATTR_TIMEOUT => 30
            ];

            $this->connection = new PDO($dsn, DB_USER, DB_PASS, $options);

            // Verificar conexión
            $this->connection->query("SELECT 1");

        } catch (PDOException $e) {
            $this->handleConnectionError($e);
        }
    }

    private function handleConnectionError($e)
    {
        $errorCode = $e->getCode();
        $errorMessage = $e->getMessage();

        // Log del error para debugging
        error_log("Error de conexión DB: " . $errorMessage);

        // Mensajes más específicos según el tipo de error
        switch ($errorCode) {
            case 1045: // Access denied
                $userMessage = "Error de autenticación: Usuario o contraseña incorrectos";
                break;
            case 1049: // Unknown database
                $userMessage = "Error: La base de datos '" . DB_NAME . "' no existe";
                break;
            case 2002: // Can't connect to server
                $userMessage = "Error: No se puede conectar al servidor MySQL. Verifique que esté ejecutándose";
                break;
            case 2005: // Unknown host
                $userMessage = "Error: No se puede resolver el host '" . DB_HOST . "'";
                break;
            default:
                $userMessage = "Error de conexión a la base de datos";
        }

        // Respuesta de error
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => $userMessage,
            'error_code' => $errorCode,
            'data' => null,
            'debug' => [
                'host' => DB_HOST,
                'database' => DB_NAME,
                'user' => DB_USER,
                'port' => DB_PORT,
                'detailed_error' => $errorMessage
            ]
        ]);
        exit();
    }

    public function getConnection()
    {
        return $this->connection;
    }

    public function testConnection()
    {
        try {
            $result = $this->connection->query("SELECT VERSION() as version, NOW() as current_time");
            return $result->fetch();
        } catch (PDOException $e) {
            return false;
        }
    }

    public function sendResponse($data, $success = true, $message = "")
    {
        echo json_encode([
            'success' => $success,
            'message' => $message,
            'data' => $data,
            'timestamp' => date('Y-m-d H:i:s')
        ]);
        exit();
    }

    public function sendError($message, $code = 400)
    {
        http_response_code($code);
        echo json_encode([
            'success' => false,
            'message' => $message,
            'data' => null,
            'timestamp' => date('Y-m-d H:i:s')
        ]);
        exit();
    }

    public function validateRequired($data, $fields)
    {
        foreach ($fields as $field) {
            if (!isset($data[$field]) || empty(trim($data[$field]))) {
                $this->sendError("El campo '$field' es requerido");
            }
        }
    }

    public function sanitizeInput($data)
    {
        if (is_array($data)) {
            return array_map([$this, 'sanitizeInput'], $data);
        }
        return htmlspecialchars(strip_tags(trim($data)));
    }
}

// Funciones de validación
function validateEmail($email)
{
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

function validateCedula($cedula)
{
    if (strlen($cedula) != 10) return false;
    if (!is_numeric($cedula)) return false;

    $digitos = str_split($cedula);
    $provincia = intval($digitos[0] . $digitos[1]);

    if ($provincia < 1 || $provincia > 24) return false;

    $verificador = intval($digitos[9]);
    $suma = 0;

    for ($i = 0; $i < 9; $i++) {
        $digito = intval($digitos[$i]);
        if ($i % 2 == 0) {
            $digito *= 2;
            if ($digito > 9) $digito -= 9;
        }
        $suma += $digito;
    }

    $modulo = $suma % 10;
    $digitoVerificador = $modulo == 0 ? 0 : 10 - $modulo;

    return $verificador == $digitoVerificador;
}

function hashPassword($password)
{
    return password_hash($password, PASSWORD_BCRYPT);
}

function verifyPassword($password, $hash)
{
    return password_verify($password, $hash);
}

?>