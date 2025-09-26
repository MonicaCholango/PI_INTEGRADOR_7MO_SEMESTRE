<?php
require_once 'config.php';
$db = new Database();
$conn = $db->getConnection();

header('Content-Type: application/json');

$input = json_decode(file_get_contents("php://input"), true);
$email = trim($input['email'] ?? '');
$code = trim($input['code'] ?? '');
$password = $input['password'] ?? '';

if (!$email || !$code || !$password) {
    echo json_encode(['success'=>false,'message'=>'Todos los campos son requeridos']);
    exit;
}

// Verificar código temporal (solo válido por 30 minutos)
$stmt = $conn->prepare("
    SELECT * FROM reset_codes 
    WHERE email = :email AND code = :code AND created_at > (NOW() - INTERVAL 30 MINUTE)
    LIMIT 1
");
$stmt->execute([
    ':email' => $email,
    ':code' => $code
]);
$row = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$row) {
    echo json_encode(['success'=>false,'message'=>'Código inválido o expirado']);
    exit;
}

$tabla = $row['tabla'];

// Actualizar contraseña de forma segura
$hash = hashPassword($password);
$updateStmt = $conn->prepare("UPDATE $tabla SET password = :hash WHERE correo = :email");
$updateStmt->execute([
    ':hash' => $hash,
    ':email' => $email
]);

// Eliminar código usado
$deleteStmt = $conn->prepare("DELETE FROM reset_codes WHERE email = :email");
$deleteStmt->execute([':email' => $email]);

echo json_encode(['success'=>true,'message'=>'Contraseña actualizada']);
