<?php

require_once 'config.php';

header('Content-Type: application/json');

function sendResetMail($toEmail, $code, $name)
{
    $apiKey = "mlsn.c0598c056c071b17d7c1f58fce9474aa4c7e15416b904360a0e10c8d31593208";

    $data = [
        "from" => [
            "email" => "unipets@test-q3enl6kvdkm42vwr.mlsender.net",
            "name" => "unipets"
        ],
        "to" => [
            ["email" => $toEmail]
        ],
        "subject" => "Recuperar contraseña",
        "template_id" => "351ndgwy1w5lzqx8",
        "personalization" => [
            [
                "email" => $toEmail,
                "data" => [
                    "code" => $code,
                    "name" => $name
                ]
            ]
        ]
    ];

    $ch = curl_init("https://api.mailersend.com/v1/email");
//    $ch = curl_init("https://uqai.requestcatcher.com/v1/email");
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Content-Type: application/json",
        "Authorization: Bearer $apiKey"
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

    $response = curl_exec($ch);
    if (curl_errno($ch)) {
        return ["success" => false, "message" => "Error CURL: " . curl_error($ch)];
    }
    curl_close($ch);

    $decoded = json_decode($response, true);
    return ["success" => !isset($decoded['errors']), "message" => $response];
}

$input = json_decode(file_get_contents("php://input"), true);
$email = trim($input['email'] ?? '');

if (!$email) {
    echo json_encode(['success' => false, 'message' => 'Correo requerido']);
    exit;
}

$db = new Database();
$conn = $db->getConnection();

// Función para buscar usuario en una tabla
function findUser(PDO $conn, string $tabla, string $email)
{
    $stmt = $conn->prepare("SELECT id, :tabla AS tabla , nombres as name FROM $tabla WHERE correo = :email LIMIT 1");
    $stmt->bindValue(':email', $email, PDO::PARAM_STR);
    $stmt->bindValue(':tabla', $tabla, PDO::PARAM_STR); // Para que se use como alias
    $stmt->execute();
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

// Buscar en adoptantes primero
$row = findUser($conn, 'adoptantes', $email);

if (!$row) {
    // Si no existe, buscar en empleados
    $row = findUser($conn, 'empleados', $email);
}

if (!$row) {
    echo json_encode(['success' => false, 'message' => 'Correo no encontrado']);
    exit;
}

$userId = $row['id'];
$tabla = $row['tabla'];
$name = $row['name'];

$code = rand(100000, 999999);

// Guardar código temporal usando prepared statement
$stmt = $conn->prepare("REPLACE INTO reset_codes (email, code, tabla, created_at) VALUES (:email, :code, :tabla, NOW())");
$stmt->execute([
    ':email' => $email,
    ':code' => $code,
    ':tabla' => $tabla
]);

// Enviar email con MailerSend
$data = sendResetMail($email, $code, $name);

$res = $data['message'];

echo json_encode(['success' => $data['success'], 'message' => 'Código enviado: ' . $res]);
