<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

require_once 'config.php';

$db = new Database();
$pdo = $db->getConnection();

$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

error_log("Acción recibida: " . $action . " - Método: " . $method);

try {
    switch ($action) {
        // AUTENTICACIÓN
        case 'login':
            if ($method === 'POST') {
                handleLogin($pdo, $input, $db);
            }
            break;

        case 'registrar':
            if ($method === 'POST') {
                handleRegistrar($pdo, $input, $db);
            }
            break;

        // USUARIOS
        case 'usuarios':
            if ($method === 'GET') {
                handleGetUsuarios($pdo, $db);
            }

            if ($method === 'DELETE') {
                handleDeleteUsuario($pdo, $db);
            }
            break;

        case 'actualizar_usuario':
            if ($method === 'PUT') {
                handleActualizarUsuario($pdo, $input, $db);
            }
            break;

        case 'estado_usuario':
            if ($method === 'PUT') {
                handleEstadoUsuario($pdo, $input, $db);
            }
            break;

        // MASCOTAS
        case 'mascotas':
            if ($method === 'GET') {
                handleGetMascotas($pdo, $db);
            }
            break;

        case 'mascotas_disponibles':
            if ($method === 'GET') {
                handleGetMascotasDisponibles($pdo, $db);
            }
            break;

        case 'agregar_mascota':
            if ($method === 'POST') {
                handleAgregarMascota($pdo, $input, $db);
            }
            break;

        case 'actualizar_mascota':
            if ($method === 'PUT') {
                handleActualizarMascota($pdo, $input, $db);
            }
            break;

        case 'eliminar_mascota':
            if ($method === 'DELETE') {
                handleEliminarMascota($pdo, $db);
            }
            break;

        case 'subir_foto':
            if ($method === 'POST') {
                handleSubirFoto($pdo, $db);
            }
            break;

        case 'buscar_mascotas':
            if ($method === 'GET') {
                handleBuscarMascotas($pdo, $db);
            }
            break;

        // SOLICITUDES
        case 'solicitudes':
            if ($method === 'GET') {
                handleGetSolicitudes($pdo, $db);
            }
            break;

        case 'solicitudes_usuario':
            if ($method === 'GET') {
                handleGetSolicitudesUsuario($pdo, $db);
            }
            break;

        case 'crear_solicitud':
            if ($method === 'POST') {
                handleCrearSolicitud($pdo, $input, $db);
            }
            break;

        case 'actualizar_solicitud':
            if ($method === 'PUT') {
                handleActualizarSolicitud($pdo, $input, $db);
            }
            break;

        // CATÁLOGOS
        case 'ciudades':
            if ($method === 'GET') {
                handleGetCiudades($pdo, $db);
            }
            break;

        case 'centros':
            if ($method === 'GET') {
                handleGetCentros($pdo, $db);
            }
            break;

        case 'tipos_mascota':
            if ($method === 'GET') {
                handleGetTiposMascota($pdo, $db);
            }
            break;

        case 'estados':
            if ($method === 'GET') {
                handleGetEstados($pdo, $db);
            }
            break;

        case 'estados_adopcion':
            if ($method === 'GET') {
                handleGetEstadosAdopcion($pdo, $db);
            }
            break;

        case 'estados_salud':
            if ($method === 'GET') {
                handleGetEstadosSalud($pdo, $db);
            }
            break;

        case 'empleados':
            if ($method === 'GET') {
                handleGetEmpleados($pdo, $db);
            }
            break;

        // ADMINISTRACIÓN
        case 'agregar_centro':
            if ($method === 'POST') {
                handleAgregarCentro($pdo, $input, $db);
            }
            break;

        case 'agregar_ciudad':
            if ($method === 'POST') {
                handleAgregarCiudad($pdo, $input, $db);
            }
            break;

        case 'agregar_tipo':
            if ($method === 'POST') {
                handleAgregarTipo($pdo, $input, $db);
            }
            break;

        case 'editar_centro':
            if ($method === 'PUT') {
                handleEditarCentro($pdo, $input, $db);
            }
            break;

        case 'editar_ciudad':
            if ($method === 'PUT') {
                handleEditarCiudad($pdo, $input, $db);
            }
            break;

        case 'editar_tipo':
            if ($method === 'PUT') {
                handleEditarTipo($pdo, $input, $db);
            }
            break;

        case 'eliminar_centro':
            if ($method === 'DELETE') {
                handleEliminarCentro($pdo, $db);
            }
            break;

        case 'eliminar_ciudad':
            if ($method === 'DELETE') {
                handleEliminarCiudad($pdo, $db);
            }
            break;

        case 'eliminar_tipo':
            if ($method === 'DELETE') {
                handleEliminarTipo($pdo, $db);
            }
            break;

        // ESTADÍSTICAS
        case 'estadisticas':
            if ($method === 'GET') {
                handleGetEstadisticas($pdo, $db);
            }
            break;

        case 'reporte':
            if ($method === 'GET') {
                handleGetReporte($pdo, $db);
            }
            break;

        // UTILIDADES
        case 'ping':
            $db->sendResponse(['status' => 'ok', 'timestamp' => time()]);
            break;

        case 'version':
            $db->sendResponse(['version' => APP_VERSION]);
            break;

        case 'foto':
            if ($method === 'POST') {
                savePhoto($pdo, $db);
            }
            break;

        case 'save_denuncia':
            if ($method === 'POST') {
                save_denuncia($pdo, $db);
            }
            break;

        case 'listar_denuncias':
            if ($method === 'GET') {
                listar_denuncias($pdo, $db);
            }
            break;

        case 'save_empleado':
            if ($method === 'POST') {
                save_empleado($pdo, $db, $input);
            }
            break;

        // EVENTOS - CASOS CORREGIDOS Y ORGANIZADOS
        case 'eventos':
            if ($method === 'GET') {
                handleGetEventos($pdo, $db);
            }
            break;

        case 'eventos_vigentes':
            if ($method === 'GET') {
                handleGetEventosVigentes($pdo, $db);
            }
            break;

        case 'agregar_evento':
            if ($method === 'POST') {
                handleAgregarEvento($pdo, $input, $db);
            }
            break;

        case 'actualizar_evento':
            if ($method === 'PUT') {
                handleActualizarEvento($pdo, $input, $db);
            }
            break;

        case 'eliminar_evento':
            if ($method === 'DELETE') {
                handleEliminarEvento($pdo, $db);
            }
            break;

        case 'subir_foto_evento':
            if ($method === 'POST') {
                handleSubirFotoEvento($pdo, $db);
            }
            break;

        // CASO AGREGADO: save_foto_evento
        case 'save_foto_evento':
            if ($method === 'POST') {
                save_foto_evento($pdo, $db);
            }
            break;

        default:
            $db->sendError('Acción no válida: ' . $action, 400);
            break;
    }
} catch (Exception $e) {
    error_log("Error en API: " . $e->getMessage());
    $db->sendError('Error interno del servidor', 500);
}

// FUNCIONES DE MANEJO

function handleLogin($pdo, $input, $db)
{
    $db->validateRequired($input, ['email', 'password']);

    $email = $db->sanitizeInput($input['email']);
    $password = $input['password'];

    if (!validateEmail($email)) {
        $db->sendError('Formato de email inválido');
    }

    // Buscar en adoptantes
    $stmt = $pdo->prepare("SELECT a.*, c.nombre as ciudad, 'adoptante' as tipoUsuario
                           FROM adoptantes a
                           LEFT JOIN ciudades c ON a.ciudad_id = c.id
                           WHERE a.correo = ? AND a.bloqueado = 0");
    $stmt->execute([$email]);
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$usuario) {
        // Buscar en empleados
        $stmt = $pdo->prepare("SELECT e.*, c.nombre as ciudad, 'admin' as tipoUsuario
                               FROM empleados e
                               LEFT JOIN ciudades c ON e.ciudad_id = c.id
                               WHERE e.correo = ? AND e.bloqueado = 0");
        $stmt->execute([$email]);
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
    }

    if ($usuario && verifyPassword($password, $usuario['password'])) {
        $usuario['estado'] = $usuario['bloqueado'] ? 'inactivo' : 'activo';
        unset($usuario['password']);

        // Actualizar última conexión
        $tabla = $usuario['tipoUsuario'] === 'admin' ? 'empleados' : 'adoptantes';
        $stmt = $pdo->prepare("UPDATE $tabla SET ultima_conexion = NOW() WHERE id = ?");
        $stmt->execute([$usuario['id']]);

        $db->sendResponse(['usuario' => $usuario], true, 'Login exitoso');
    } else {
        $db->sendError('Credenciales incorrectas', 401);
    }
}

function handleRegistrar($pdo, $input, $db)
{
    global $DEFAULT_PASSWORD;
    $requiredFields = ['nombres', 'apellidos', 'cedula', 'correo', 'telefono', 'celular', 'fechaNacimiento', 'ciudad_id'];
    $db->validateRequired($input, $requiredFields);

    // Validaciones
    if (!validateEmail($input['correo'])) {
        $db->sendError('Formato de email inválido');
    }

    if (!validateCedula($input['cedula'])) {
        $db->sendError('Cédula inválida');
    }

    // Verificar si ya existe
    $stmt = $pdo->prepare("SELECT id FROM adoptantes WHERE cedula = ? OR correo = ?");
    $stmt->execute([$input['cedula'], $input['correo']]);
    if ($stmt->fetch()) {
        $db->sendError('La cédula o email ya están registrados');
    }

    try {
        $password_temporal = hashPassword($DEFAULT_PASSWORD);

        $stmt = $pdo->prepare("INSERT INTO adoptantes 
            (nombres, apellidos, cedula, correo, telefono, celular, fecha_nacimiento, ciudad_id, password, fecha_registro)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())");

        $stmt->execute([
            $db->sanitizeInput($input['nombres']),
            $db->sanitizeInput($input['apellidos']),
            $input['cedula'],
            $input['correo'],
            $input['telefono'],
            $input['celular'],
            $input['fechaNacimiento'],
            $input['ciudad_id'],
            $password_temporal
        ]);

        $db->sendResponse(
            ['id' => $pdo->lastInsertId()],
            true,
            'Usuario registrado correctamente. Contraseña temporal:' . $DEFAULT_PASSWORD
        );
    } catch (PDOException $e) {
        if ($e->getCode() == 23000) {
            $db->sendError('La cédula o email ya están registrados');
        } else {
            $db->sendError('Error al registrar usuario: ' . $e->getMessage());
        }
    }
}

function handleGetUsuarios($pdo, $db)
{
    $stmt = $pdo->prepare("
       SELECT a.id,
       a.nombres,
       a.apellidos,
       a.cedula,
       a.correo,
       a.telefono,
       a.celular,
       a.fecha_nacimiento,
       c.nombre                                                    as ciudad,
       'adoptante'                                                 as tipoUsuario,
       CASE WHEN a.bloqueado = 1 THEN 'inactivo' ELSE 'activo' END as estado,
       a.ciudad_id,
       a.fecha_registro,
       a.ultima_conexion,
       0 as centro_id,
       '' as area
FROM adoptantes a
         LEFT JOIN ciudades c ON a.ciudad_id = c.id
UNION ALL
SELECT e.id,
       e.nombres,
       e.apellidos,
       e.cedula,
       e.correo,
       e.telefono,
       e.celular,
       e.fecha_nacimiento,
       c.nombre                                                    as ciudad,
       'admin'                                                     as tipoUsuario,
       CASE WHEN e.bloqueado = 1 THEN 'inactivo' ELSE 'activo' END as estado,
       e.ciudad_id,
       e.fecha_registro,
       e.ultima_conexion,
       e.centro_id,
       e.area
FROM empleados e
         LEFT JOIN ciudades c ON e.ciudad_id = c.id
ORDER BY id DESC
    ");
    $stmt->execute();
    $db->sendResponse($stmt->fetchAll(PDO::FETCH_ASSOC));
}

function handleActualizarUsuario($pdo, $input, $db)
{
    $id = $_GET['id'] ?? null;
    if (!$id) {
        $db->sendError('ID de usuario requerido');
    }

    $requiredFields = ['nombres', 'apellidos', 'telefono', 'celular', 'correo', 'fechaNacimiento', 'ciudad_id'];
    $db->validateRequired($input, $requiredFields);

    if (!validateEmail($input['correo'])) {
        $db->sendError('Formato de email inválido');
    }

    $tipoUsuario = $input['tipoUsuario'] ?? 'adoptante';
    $tabla = $tipoUsuario === 'admin' ? 'empleados' : 'adoptantes';

    try {
        $stmt = $pdo->prepare("UPDATE $tabla SET 
            nombres = ?, apellidos = ?, telefono = ?, celular = ?, 
            correo = ?, fecha_nacimiento = ?, ciudad_id = ?
            WHERE id = ?");

        $stmt->execute([
            $db->sanitizeInput($input['nombres']),
            $db->sanitizeInput($input['apellidos']),
            $input['telefono'],
            $input['celular'],
            $input['correo'],
            $input['fechaNacimiento'],
            $input['ciudad_id'],
            $id
        ]);

        $db->sendResponse(null, true, 'Usuario actualizado correctamente');
    } catch (PDOException $e) {
        $db->sendError('Error al actualizar usuario: ' . $e->getMessage());
    }
}

function handleEstadoUsuario($pdo, $input, $db)
{
    $id = $_GET['id'] ?? null;
    $tipoUsuario = $_GET['tipoUsuario'] ?? null;
    if (!$id) {
        $db->sendError('ID de usuario requerido');
    }

    if (!$tipoUsuario) {
        $db->sendError('tipoUsuario de usuario requerido');
    }

    $estado = $input['estado'] === 'activo' ? 0 : 1;

    try {
        if ($tipoUsuario === 'admin') {
            $stmt = $pdo->prepare("UPDATE empleados SET bloqueado = ? WHERE id = ?");
        } else {
            $stmt = $pdo->prepare("UPDATE adoptantes SET bloqueado = ? WHERE id = ?");
        }

        $stmt->execute([$estado, $id]);

        $db->sendResponse(null, true, 'Estado actualizado correctamente');
    } catch (PDOException $e) {
        $db->sendError('Error al actualizar estado: ' . $e->getMessage());
    }
}

function handleDeleteUsuario($pdo, $db)
{
    $id = $_GET['id'] ?? null;
    $tipoUsuario = $_GET['tipoUsuario'] ?? null;
    if (!$id) {
        $db->sendError('ID de usuario requerido');
    }

    if (!$tipoUsuario) {
        $db->sendError('tipoUsuario de usuario requerido');
    }

    try {
        if ($tipoUsuario === 'admin') {
            $stmt = $pdo->prepare("DELETE FROM empleados WHERE id = ?");
        } else {
            $stmt = $pdo->prepare("DELETE FROM adoptantes WHERE id = ?");
        }

        $stmt->execute([$id]);

        $db->sendResponse(null, true, 'Usuario eliminado correctamente');
    } catch (PDOException $e) {
        $db->sendError('Error al actualizar estado: ' . $e->getMessage());
    }
}

function handleGetMascotas($pdo, $db)
{
    $stmt = $pdo->prepare("
        SELECT m.*,
               ea.nombre as estadoAdopcion,
               c.nombre as centro,
               ci.nombre as ciudad,
               e.nombre as estado,
               s.estado as salud,
               CONCAT(emp.nombres, ' ', emp.apellidos) as responsable,
               tm.nombre as tipoMascota
        FROM mascotas m
        LEFT JOIN estado_adopcion ea ON m.estado_adopcion_id = ea.id
        LEFT JOIN centros c ON m.centro_id = c.id
        LEFT JOIN ciudades ci ON m.ciudad_id = ci.id
        LEFT JOIN estados e ON m.estado_id = e.id
        LEFT JOIN estados_salud s ON m.estados_salud_id = s.id
        LEFT JOIN empleados emp ON m.responsable_id = emp.id
        LEFT JOIN tipo_mascotas tm ON m.tipo_mascota_id = tm.id
        ORDER BY m.fecha_registro DESC
    ");
    $stmt->execute();
    $db->sendResponse($stmt->fetchAll(PDO::FETCH_ASSOC));
}

function handleGetMascotasDisponibles($pdo, $db)
{
    $stmt = $pdo->prepare("
        SELECT m.*,
               ea.nombre as estadoAdopcion,
               c.nombre as centro,
               ci.nombre as ciudad,
               e.nombre as estado,
               s.estado as salud,
               CONCAT(emp.nombres, ' ', emp.apellidos) as responsable,
               tm.nombre as tipoMascota
        FROM mascotas m
        LEFT JOIN estado_adopcion ea ON m.estado_adopcion_id = ea.id
        LEFT JOIN centros c ON m.centro_id = c.id
        LEFT JOIN ciudades ci ON m.ciudad_id = ci.id
        LEFT JOIN estados e ON m.estado_id = e.id
        LEFT JOIN estados_salud s ON m.estados_salud_id = s.id
        LEFT JOIN empleados emp ON m.responsable_id = emp.id
        LEFT JOIN tipo_mascotas tm ON m.tipo_mascota_id = tm.id
        WHERE e.nombre = 'Disponible'
        ORDER BY m.fecha_ingreso DESC
    ");
    $stmt->execute();
    $db->sendResponse($stmt->fetchAll(PDO::FETCH_ASSOC));
}

function handleAgregarMascota($pdo, $input, $db)
{
    $requiredFields = ['nombre', 'edad', 'centro_id', 'ciudad_id', 'estado_id', 'estados_salud_id', 'responsable_id', 'tipo_mascota_id'];
    $db->validateRequired($input, $requiredFields);

    try {
        $stmt = $pdo->prepare("INSERT INTO mascotas 
            (nombre, edad, fecha_registro, fecha_ingreso, estado_adopcion_id, centro_id, ciudad_id, 
             estado_id, estados_salud_id, responsable_id, tipo_mascota_id, observaciones)
            VALUES (?, ?, CURDATE(), ?, 1, ?, ?, ?, ?, ?, ?, ?)");

        $stmt->execute([
            $db->sanitizeInput($input['nombre']),
            $input['edad'],
            $input['fecha_ingreso'] ?? date('Y-m-d'),
            $input['centro_id'],
            $input['ciudad_id'],
            $input['estado_id'],
            $input['estados_salud_id'],
            $input['responsable_id'],
            $input['tipo_mascota_id'],
            $input['observaciones'] ?? ''
        ]);

        $db->sendResponse(['id' => $pdo->lastInsertId()], true, 'Mascota agregada correctamente');
    } catch (PDOException $e) {
        $db->sendError('Error al agregar mascota: ' . $e->getMessage());
    }
}

function handleActualizarMascota($pdo, $input, $db)
{
    $id = $_GET['id'] ?? null;
    if (!$id) {
        $db->sendError('ID de mascota requerido');
    }

    try {
        $stmt = $pdo->prepare("UPDATE mascotas SET 
            nombre = ?, 
            edad = ?, 
            fecha_registro = ?, 
            fecha_ingreso = ?, 
            fecha_salida = ?, 
            estado_adopcion_id = ?, 
            centro_id = ?, 
            ciudad_id = ?, 
            estado_id = ?, 
            estados_salud_id = ?, 
            responsable_id = ?, 
            observaciones = ?, 
            tipo_mascota_id = ?
            WHERE id = ?");

        $stmt->execute([
            $db->sanitizeInput($input['nombre'] ?? ''),
            $input['edad'] ?? '',
            $input['fecha_registro'] ?? null,
            $input['fecha_ingreso'] ?? null,
            $input['fecha_salida'] ?? null,
            $input['estado_adopcion_id'] ?? null,
            $input['centro_id'] ?? null,
            $input['ciudad_id'] ?? null,
            $input['estado_id'] ?? null,
            $input['estados_salud_id'] ?? null,
            $input['responsable_id'] ?? null,
            $input['observaciones'] ?? '',
            $input['tipo_mascota_id'] ?? 1,
            $id
        ]);

        $db->sendResponse(null, true, 'Mascota actualizada correctamente');
    } catch (PDOException $e) {
        $db->sendError('Error al actualizar mascota: ' . $e->getMessage());
    }
}

function handleEliminarMascota($pdo, $db)
{
    $id = $_GET['id'] ?? null;
    if (!$id) {
        $db->sendError('ID de mascota requerido');
    }

    try {
        // Verificar si tiene solicitudes activas
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM solicitudes WHERE mascota_id = ? AND estado IN ('Pendiente', 'En revision')");
        $stmt->execute([$id]);
        if ($stmt->fetchColumn() > 0) {
            $db->sendError('No se puede eliminar la mascota porque tiene solicitudes activas');
        }

        $stmt = $pdo->prepare("DELETE FROM mascotas WHERE id = ?");
        $stmt->execute([$id]);

        $db->sendResponse(null, true, 'Mascota eliminada correctamente');
    } catch (PDOException $e) {
        $db->sendError('Error al eliminar mascota: ' . $e->getMessage());
    }
}

function handleSubirFoto($pdo, $db)
{
    $id = $_GET['id'] ?? null;
    if (!$id) {
        $db->sendError('ID de mascota requerido');
    }

    if (!isset($_FILES['foto'])) {
        $db->sendError('No se ha enviado ninguna foto');
    }

    $foto = $_FILES['foto'];

    // Validaciones
    if ($foto['error'] !== UPLOAD_ERR_OK) {
        $db->sendError('Error al subir el archivo');
    }

    if ($foto['size'] > MAX_FILE_SIZE) {
        $db->sendError('El archivo es demasiado grande');
    }

    $extension = strtolower(pathinfo($foto['name'], PATHINFO_EXTENSION));
    if (!in_array($extension, ALLOWED_EXTENSIONS)) {
        $db->sendError('Tipo de archivo no permitido');
    }

    try {
        // Crear directorio si no existe
        $uploadDir = UPLOAD_PATH;
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        // Generar nombre único
        $nombreArchivo = uniqid() . '_' . $id . '.' . $extension;
        $rutaArchivo = $uploadDir . $nombreArchivo;

        if (move_uploaded_file($foto['tmp_name'], $rutaArchivo)) {
            // Actualizar base de datos
            $stmt = $pdo->prepare("UPDATE mascotas SET foto = ? WHERE id = ?");
            $stmt->execute([$nombreArchivo, $id]);

            $db->sendResponse(['foto' => $nombreArchivo], true, 'Foto subida correctamente');
        } else {
            $db->sendError('Error al guardar el archivo');
        }
    } catch (Exception $e) {
        $db->sendError('Error al procesar la foto: ' . $e->getMessage());
    }
}

function handleBuscarMascotas($pdo, $db)
{
    $filtros = $_GET;
    $where = ["e.nombre = 'Disponible'"];
    $params = [];

    if (!empty($filtros['tipo'])) {
        $where[] = "tm.nombre = ?";
        $params[] = $filtros['tipo'];
    }

    if (!empty($filtros['ciudad'])) {
        $where[] = "ci.nombre LIKE ?";
        $params[] = "%{$filtros['ciudad']}%";
    }

    if (!empty($filtros['busqueda'])) {
        $where[] = "(m.nombre LIKE ? OR m.observaciones LIKE ?)";
        $params[] = "%{$filtros['busqueda']}%";
        $params[] = "%{$filtros['busqueda']}%";
    }

    $whereClause = implode(" AND ", $where);

    $stmt = $pdo->prepare("
        SELECT m.*,
               ea.nombre as estadoAdopcion,
               c.nombre as centro,
               ci.nombre as ciudad,
               e.nombre as estado,
               s.estado as salud,
               CONCAT(emp.nombres, ' ', emp.apellidos) as responsable,
               tm.nombre as tipoMascota
        FROM mascotas m
        LEFT JOIN estado_adopcion ea ON m.estado_adopcion_id = ea.id
        LEFT JOIN centros c ON m.centro_id = c.id
        LEFT JOIN ciudades ci ON m.ciudad_id = ci.id
        LEFT JOIN estados e ON m.estado_id = e.id
        LEFT JOIN estados_salud s ON m.estados_salud_id = s.id
        LEFT JOIN empleados emp ON m.responsable_id = emp.id
        LEFT JOIN tipo_mascotas tm ON m.tipo_mascota_id = tm.id
        WHERE $whereClause
        ORDER BY m.fecha_ingreso DESC
    ");

    $stmt->execute($params);
    $db->sendResponse($stmt->fetchAll(PDO::FETCH_ASSOC));
}

function handleGetSolicitudes($pdo, $db)
{
    $stmt = $pdo->prepare("
        SELECT s.*,
               m.nombre as mascota_nombre,
               a.nombres, a.apellidos, a.correo, a.celular,
               tm.nombre as tipoMascota,
               m.edad, m.foto,
               c.nombre as centro, ci.nombre as ciudad
        FROM solicitudes s
        LEFT JOIN mascotas m ON s.mascota_id = m.id
        LEFT JOIN adoptantes a ON s.usuario_id = a.id AND s.usuario_tipo = 'adoptante'
        LEFT JOIN tipo_mascotas tm ON m.tipo_mascota_id = tm.id
        LEFT JOIN centros c ON m.centro_id = c.id
        LEFT JOIN ciudades ci ON m.ciudad_id = ci.id
        ORDER BY s.fecha_solicitud DESC
    ");
    $stmt->execute();
    $db->sendResponse($stmt->fetchAll(PDO::FETCH_ASSOC));
}

function handleGetSolicitudesUsuario($pdo, $db)
{
    $usuario_id = $_GET['usuario_id'] ?? null;
    if (!$usuario_id) {
        $db->sendError('ID de usuario requerido');
    }

    $stmt = $pdo->prepare("
        SELECT s.*,
               m.nombre as mascota_nombre, m.edad, m.foto,
               c.nombre as centro, ci.nombre as ciudad,
               tm.nombre as tipoMascota
        FROM solicitudes s
        LEFT JOIN mascotas m ON s.mascota_id = m.id
        LEFT JOIN centros c ON m.centro_id = c.id
        LEFT JOIN ciudades ci ON m.ciudad_id = ci.id
        LEFT JOIN tipo_mascotas tm ON m.tipo_mascota_id = tm.id
        WHERE s.usuario_id = ? AND s.usuario_tipo = 'adoptante'
        ORDER BY s.fecha_solicitud DESC
    ");
    $stmt->execute([$usuario_id]);
    $db->sendResponse($stmt->fetchAll(PDO::FETCH_ASSOC));
}

function handleCrearSolicitud($pdo, $input, $db)
{
    $requiredFields = ['mascota_id', 'usuario_id'];
    $db->validateRequired($input, $requiredFields);

    // Verificar que la mascota esté disponible
    $stmt = $pdo->prepare("SELECT e.nombre FROM mascotas m 
                           LEFT JOIN estados e ON m.estado_id = e.id 
                           WHERE m.id = ?");
    $stmt->execute([$input['mascota_id']]);
    $estado = $stmt->fetchColumn();

    if ($estado !== 'Disponible') {
        $db->sendError('La mascota no está disponible para adopción');
    }

    // Verificar que el usuario no tenga ya una solicitud para esta mascota
    $stmt = $pdo->prepare("SELECT id FROM solicitudes 
                           WHERE mascota_id = ? AND usuario_id = ? AND estado IN ('Pendiente', 'En revision')");
    $stmt->execute([$input['mascota_id'], $input['usuario_id']]);
    if ($stmt->fetch()) {
        $db->sendError('Ya tienes una solicitud activa para esta mascota');
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO solicitudes
            (mascota_id, usuario_id, usuario_tipo, estado, observaciones, fecha_solicitud)
            VALUES (?, ?, ?, 'Pendiente', ?, NOW())");

        $stmt->execute([
            $input['mascota_id'],
            $input['usuario_id'],
            $input['usuario_tipo'] ?? 'adoptante',
            $input['observaciones'] ?? ''
        ]);

        $db->sendResponse(['id' => $pdo->lastInsertId()], true, 'Solicitud creada correctamente');
    } catch (PDOException $e) {
        $db->sendError('Error al crear solicitud: ' . $e->getMessage());
    }
}

function handleActualizarSolicitud($pdo, $input, $db)
{
    $id = $_GET['id'] ?? null;
    if (!$id) {
        $db->sendError('ID de solicitud requerido');
    }

    $estado = $input['estado'] ?? '';
    $observaciones = $input['observaciones'] ?? '';

    if (!in_array($estado, ['Pendiente', 'Aprobado', 'En revision', 'Rechazado', 'Cancelado'])) {
        $db->sendError('Estado de solicitud inválido');
    }

    try {
        $stmt = $pdo->prepare("UPDATE solicitudes SET estado = ?, observaciones = ? WHERE id = ?");
        $stmt->execute([$estado, $observaciones, $id]);

        // Si se aprueba, cambiar estado de la mascota
        if ($estado === 'Aprobado') {
            $stmt = $pdo->prepare("SELECT mascota_id FROM solicitudes WHERE id = ?");
            $stmt->execute([$id]);
            $mascota_id = $stmt->fetchColumn();

            if ($mascota_id) {
                $stmt = $pdo->prepare("UPDATE mascotas SET estado_id = (SELECT id FROM estados WHERE nombre = 'Adoptado'), 
                                       fecha_salida = CURDATE() WHERE id = ?");
                $stmt->execute([$mascota_id]);
            }
        }

        $db->sendResponse(null, true, 'Solicitud actualizada correctamente');
    } catch (PDOException $e) {
        $db->sendError('Error al actualizar solicitud: ' . $e->getMessage());
    }
}

// FUNCIONES PARA CATÁLOGOS

function handleGetCiudades($pdo, $db)
{
    $stmt = $pdo->prepare("SELECT * FROM ciudades ORDER BY nombre");
    $stmt->execute();
    $db->sendResponse($stmt->fetchAll(PDO::FETCH_ASSOC));
}

function handleGetCentros($pdo, $db)
{
    $stmt = $pdo->prepare("SELECT * FROM centros ORDER BY nombre");
    $stmt->execute();
    $db->sendResponse($stmt->fetchAll(PDO::FETCH_ASSOC));
}

function handleGetTiposMascota($pdo, $db)
{
    $stmt = $pdo->prepare("SELECT id, nombre FROM tipo_mascotas ORDER BY nombre");
    $stmt->execute();
    $db->sendResponse($stmt->fetchAll(PDO::FETCH_ASSOC));
}

function handleGetEstados($pdo, $db)
{
    $stmt = $pdo->prepare("SELECT * FROM estados ORDER BY nombre");
    $stmt->execute();
    $db->sendResponse($stmt->fetchAll(PDO::FETCH_ASSOC));
}

function handleGetEstadosAdopcion($pdo, $db)
{
    $stmt = $pdo->prepare("SELECT * FROM estado_adopcion ORDER BY nombre");
    $stmt->execute();
    $db->sendResponse($stmt->fetchAll(PDO::FETCH_ASSOC));
}

function handleGetEstadosSalud($pdo, $db)
{
    $stmt = $pdo->prepare("SELECT * FROM estados_salud ORDER BY estado");
    $stmt->execute();
    $db->sendResponse($stmt->fetchAll(PDO::FETCH_ASSOC));
}

function handleGetEmpleados($pdo, $db)
{
    $stmt = $pdo->prepare("SELECT e.*, c.nombre as ciudad FROM empleados e LEFT JOIN ciudades c ON e.ciudad_id = c.id ORDER BY e.nombres");
    $stmt->execute();
    $db->sendResponse($stmt->fetchAll(PDO::FETCH_ASSOC));
}

// FUNCIONES DE ADMINISTRACIÓN

function handleAgregarCentro($pdo, $input, $db)
{
    $db->validateRequired($input, ['nombre']);

    try {
        $stmt = $pdo->prepare("INSERT INTO centros (nombre) VALUES (?)");
        $stmt->execute([$db->sanitizeInput($input['nombre'])]);
        $db->sendResponse(['id' => $pdo->lastInsertId()], true, 'Centro agregado correctamente');
    } catch (PDOException $e) {
        $db->sendError('Error al agregar centro: ' . $e->getMessage());
    }
}

function handleAgregarCiudad($pdo, $input, $db)
{
    $db->validateRequired($input, ['nombre']);

    try {
        $stmt = $pdo->prepare("INSERT INTO ciudades (nombre) VALUES (?)");
        $stmt->execute([$db->sanitizeInput($input['nombre'])]);
        $db->sendResponse(['id' => $pdo->lastInsertId()], true, 'Ciudad agregada correctamente');
    } catch (PDOException $e) {
        $db->sendError('Error al agregar ciudad: ' . $e->getMessage());
    }
}

function handleAgregarTipo($pdo, $input, $db)
{
    $db->validateRequired($input, ['nombre']);

    try {
        $stmt = $pdo->prepare("INSERT INTO tipo_mascotas (nombre) VALUES (?)");
        $stmt->execute([$db->sanitizeInput($input['nombre'])]);
        $db->sendResponse(['id' => $pdo->lastInsertId()], true, 'Tipo de mascota agregado correctamente');
    } catch (PDOException $e) {
        $db->sendError('Error al agregar tipo: ' . $e->getMessage());
    }
}

function handleEditarCentro($pdo, $input, $db)
{
    $id = $_GET['id'] ?? null;
    if (!$id) {
        $db->sendError('ID de centro requerido');
    }

    $db->validateRequired($input, ['nombre']);

    try {
        $stmt = $pdo->prepare("UPDATE centros SET nombre = ? WHERE id = ?");
        $stmt->execute([$db->sanitizeInput($input['nombre']), $id]);
        $db->sendResponse(null, true, 'Centro actualizado correctamente');
    } catch (PDOException $e) {
        $db->sendError('Error al actualizar centro: ' . $e->getMessage());
    }
}

function handleEditarCiudad($pdo, $input, $db)
{
    $id = $_GET['id'] ?? null;
    if (!$id) {
        $db->sendError('ID de ciudad requerido');
    }

    $db->validateRequired($input, ['nombre']);

    try {
        $stmt = $pdo->prepare("UPDATE ciudades SET nombre = ? WHERE id = ?");
        $stmt->execute([$db->sanitizeInput($input['nombre']), $id]);
        $db->sendResponse(null, true, 'Ciudad actualizada correctamente');
    } catch (PDOException $e) {
        $db->sendError('Error al actualizar ciudad: ' . $e->getMessage());
    }
}

function handleEditarTipo($pdo, $input, $db)
{
    $id = $_GET['id'] ?? null;
    if (!$id) {
        $db->sendError('ID de tipo requerido');
    }

    $db->validateRequired($input, ['nombre']);

    try {
        $stmt = $pdo->prepare("UPDATE tipo_mascotas SET nombre = ? WHERE id = ?");
        $stmt->execute([$db->sanitizeInput($input['nombre']), $id]);
        $db->sendResponse(null, true, 'Tipo de mascota actualizado correctamente');
    } catch (PDOException $e) {
        $db->sendError('Error al actualizar tipo: ' . $e->getMessage());
    }
}

function handleEliminarCentro($pdo, $db)
{
    $id = $_GET['id'] ?? null;
    if (!$id) {
        $db->sendError('ID de centro requerido');
    }

    try {
        // Verificar si hay mascotas asociadas
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM mascotas WHERE centro_id = ?");
        $stmt->execute([$id]);
        if ($stmt->fetchColumn() > 0) {
            $db->sendError('No se puede eliminar el centro porque tiene mascotas asociadas');
        }

        $stmt = $pdo->prepare("DELETE FROM centros WHERE id = ?");
        $stmt->execute([$id]);
        $db->sendResponse(null, true, 'Centro eliminado correctamente');
    } catch (PDOException $e) {
        $db->sendError('Error al eliminar centro: ' . $e->getMessage());
    }
}

function handleEliminarCiudad($pdo, $db)
{
    $id = $_GET['id'] ?? null;
    if (!$id) {
        $db->sendError('ID de ciudad requerido');
    }

    try {
        // Verificar si hay usuarios o mascotas asociadas
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM adoptantes WHERE ciudad_id = ? 
                               UNION ALL SELECT COUNT(*) FROM empleados WHERE ciudad_id = ?
                               UNION ALL SELECT COUNT(*) FROM mascotas WHERE ciudad_id = ?");
        $stmt->execute([$id, $id, $id]);
        $total = array_sum($stmt->fetchAll(PDO::FETCH_COLUMN));

        if ($total > 0) {
            $db->sendError('No se puede eliminar la ciudad porque tiene registros asociados');
        }

        $stmt = $pdo->prepare("DELETE FROM ciudades WHERE id = ?");
        $stmt->execute([$id]);
        $db->sendResponse(null, true, 'Ciudad eliminada correctamente');
    } catch (PDOException $e) {
        $db->sendError('Error al eliminar ciudad: ' . $e->getMessage());
    }
}

function handleEliminarTipo($pdo, $db)
{
    $id = $_GET['id'] ?? null;
    if (!$id) {
        $db->sendError('ID de tipo requerido');
    }

    try {
        // Verificar si hay mascotas de este tipo
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM mascotas WHERE tipo_mascota_id = ?");
        $stmt->execute([$id]);
        if ($stmt->fetchColumn() > 0) {
            $db->sendError('No se puede eliminar el tipo porque hay mascotas asociadas');
        }

        $stmt = $pdo->prepare("DELETE FROM tipo_mascotas WHERE id = ?");
        $stmt->execute([$id]);
        $db->sendResponse(null, true, 'Tipo de mascota eliminado correctamente');
    } catch (PDOException $e) {
        $db->sendError('Error al eliminar tipo: ' . $e->getMessage());
    }
}

function handleGetEstadisticas($pdo, $db)
{
    try {
        $estadisticas = [];

        // Total usuarios
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM adoptantes UNION ALL SELECT COUNT(*) FROM empleados");
        $stmt->execute();
        $counts = $stmt->fetchAll(PDO::FETCH_COLUMN);
        $estadisticas['totalUsuarios'] = array_sum($counts);

        // Usuarios activos
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM adoptantes WHERE bloqueado = 0 
                               UNION ALL SELECT COUNT(*) FROM empleados WHERE bloqueado = 0");
        $stmt->execute();
        $counts = $stmt->fetchAll(PDO::FETCH_COLUMN);
        $estadisticas['usuariosActivos'] = array_sum($counts);

        // Total mascotas
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM mascotas");
        $stmt->execute();
        $estadisticas['totalMascotas'] = $stmt->fetchColumn();

        // Mascotas disponibles
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM mascotas m 
                               LEFT JOIN estados e ON m.estado_id = e.id 
                               WHERE e.nombre = 'Disponible'");
        $stmt->execute();
        $estadisticas['mascotasDisponibles'] = $stmt->fetchColumn();

        // Total solicitudes
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM solicitudes");
        $stmt->execute();
        $estadisticas['totalSolicitudes'] = $stmt->fetchColumn();

        // Solicitudes pendientes
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM solicitudes WHERE estado = 'Pendiente'");
        $stmt->execute();
        $estadisticas['solicitudesPendientes'] = $stmt->fetchColumn();

        // Adopciones aprobadas
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM solicitudes WHERE estado = 'Aprobado'");
        $stmt->execute();
        $estadisticas['adopcionesAprobadas'] = $stmt->fetchColumn();

        // Adopciones este mes
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM solicitudes 
                               WHERE estado = 'Aprobado' AND MONTH(fecha_solicitud) = MONTH(NOW()) 
                               AND YEAR(fecha_solicitud) = YEAR(NOW())");
        $stmt->execute();
        $estadisticas['adopcionesEsteMes'] = $stmt->fetchColumn();

        $db->sendResponse($estadisticas);
    } catch (PDOException $e) {
        $db->sendError('Error al obtener estadísticas: ' . $e->getMessage());
    }
}

function handleGetReporte($pdo, $db)
{
    $tipo = $_GET['tipo'] ?? '';
    $fechaInicio = $_GET['fecha_inicio'] ?? '';
    $fechaFin = $_GET['fecha_fin'] ?? '';

    try {
        switch ($tipo) {
            case 'adopciones':
                $where = "s.estado = 'Aprobado'";
                $params = [];

                if ($fechaInicio && $fechaFin) {
                    $where .= " AND DATE(s.fecha_solicitud) BETWEEN ? AND ?";
                    $params = [$fechaInicio, $fechaFin];
                }

                $stmt = $pdo->prepare("
                    SELECT s.*, m.nombre as mascota_nombre, tm.nombre as tipo_mascota,
                           CONCAT(a.nombres, ' ', a.apellidos) as adoptante
                    FROM solicitudes s
                    LEFT JOIN mascotas m ON s.mascota_id = m.id
                    LEFT JOIN tipo_mascotas tm ON m.tipo_mascota_id = tm.id
                    LEFT JOIN adoptantes a ON s.usuario_id = a.id
                    WHERE $where
                    ORDER BY s.fecha_solicitud DESC
                ");
                $stmt->execute($params);
                break;

            case 'mascotas':
                $where = "1=1";
                $params = [];

                if ($fechaInicio && $fechaFin) {
                    $where .= " AND DATE(m.fecha_registro) BETWEEN ? AND ?";
                    $params = [$fechaInicio, $fechaFin];
                }

                $stmt = $pdo->prepare("
                    SELECT m.*, tm.nombre as tipo_mascota, e.nombre as estado,
                           c.nombre as centro, ci.nombre as ciudad
                    FROM mascotas m
                    LEFT JOIN tipo_mascotas tm ON m.tipo_mascota_id = tm.id
                    LEFT JOIN estados e ON m.estado_id = e.id
                    LEFT JOIN centros c ON m.centro_id = c.id
                    LEFT JOIN ciudades ci ON m.ciudad_id = ci.id
                    WHERE $where
                    ORDER BY m.fecha_registro DESC
                ");
                $stmt->execute($params);
                break;

            default:
                $db->sendError('Tipo de reporte no válido');
                return;
        }

        $db->sendResponse($stmt->fetchAll(PDO::FETCH_ASSOC));
    } catch (PDOException $e) {
        $db->sendError('Error al generar reporte: ' . $e->getMessage());
    }
}

function savePhoto($pdo, $db)
{
    $id_mascota = $_POST['id_mascota'] ?? '';
    $fotoBase64 = $_POST['foto'] ?? '';
    $extension = basename($_POST['extension'] ?? '');

    if (!$id_mascota || !$fotoBase64) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'msg' => 'Faltan parámetros']);
        exit;
    }

    $fotoData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $fotoBase64));
    $uuid = uniqid('foto_', true) . ".$extension";
    $uploadPath = __DIR__ . '/uploads/' . $uuid;

    if (!file_exists(__DIR__ . '/uploads')) {
        mkdir(__DIR__ . '/uploads', 0777, true);
    }

    if (file_put_contents($uploadPath, $fotoData)) {
        $stmt = $pdo->prepare("UPDATE mascotas SET foto = :foto WHERE id = :id");
        $stmt->bindParam(':foto', $uuid);
        $stmt->bindParam(':id', $id_mascota);

        if ($stmt->execute()) {
            $db->sendResponse(['url' => "$uuid"]);
        } else {
            $db->sendError('Error al guardar foto');
        }
    } else {
        $db->sendError('Error al guardar foto2');
    }
}

function save_denuncia($pdo, $db)
{
    $direccion = $_POST['direccion'] ?? '';
    $observaciones = $_POST['observaciones'] ?? '';
    $ciudad_id = $_POST['ciudad_id'] ?? null;
    $tipo_mascota_id = $_POST['tipo_mascota_id'] ?? null;
    $foto_base64 = $_POST['foto'] ?? null;
    $filename = basename($_POST['filename'] ?? '');

    $denunciante_nombre = $_POST['denunciante_nombre'] ?? '';
    $denunciante_email = $_POST['denunciante_email'] ?? '';
    $denunciante_telefono = $_POST['denunciante_telefono'] ?? '';

    $foto_path = null;

    if ($foto_base64 && $filename) {
        $decoded = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $foto_base64));
        $dir = __DIR__ . '/uploads/';
        if (!file_exists($dir)) mkdir($dir, 0777, true);
        file_put_contents($dir . $filename, $decoded);
        $foto_path = $filename;
    }

    $stmt = $pdo->prepare("INSERT INTO denuncias (direccion, observaciones, ciudad_id, tipo_mascota_id, foto, denunciante_nombre, denunciante_email, denunciante_telefono)
                       VALUES (:dir, :obs, :cid, :tid, :foto, :name, :email, :tel)");
    $stmt->bindParam(':dir', $direccion);
    $stmt->bindParam(':obs', $observaciones);
    $stmt->bindParam(':cid', $ciudad_id);
    $stmt->bindParam(':tid', $tipo_mascota_id);
    $stmt->bindParam(':foto', $foto_path);
    $stmt->bindParam(':name', $denunciante_nombre);
    $stmt->bindParam(':email', $denunciante_email);
    $stmt->bindParam(':tel', $denunciante_telefono);

    if ($stmt->execute()) {
        $db->sendResponse(['ok' => "ok"]);
    } else {
        $db->sendError('Error al guardar foto');
    }
}

function listar_denuncias($pdo, $db)
{
    $stmt = $pdo->prepare("SELECT d.*, c.nombre as ciudad, tm.nombre as tipo_mascota FROM denuncias d left join pae.ciudades c on c.id = d.ciudad_id
left join pae.tipo_mascotas tm on d.tipo_mascota_id = tm.id");
    $stmt->execute();
    $db->sendResponse($stmt->fetchAll(PDO::FETCH_ASSOC));
}

function save_empleado($pdo, Database $db, $data)
{
    // Campos comunes
    global $DEFAULT_PASSWORD;
    $params = [
        ':nombres' => $data['nombres'] ?? null,
        ':apellidos' => $data['apellidos'] ?? null,
        ':cedula' => $data['cedula'] ?? null,
        ':correo' => $data['correo'] ?? null,
        ':telefono' => $data['telefono'] ?? null,
        ':celular' => $data['celular'] ?? null,
        ':fecha_nacimiento' => $data['fecha_nacimiento'] ?? null,
        ':centro_id' => $data['centro_id'] ?? null,
        ':ciudad_id' => $data['ciudad_id'] ?? null,
        ':area' => $data['area'] ?? null,
    ];

    // Verifica si es UPDATE o INSERT
    $esUpdate = isset($data['id']) && is_numeric($data['id']) && $data['id'] > 0;

    try {
        if ($esUpdate) {
            $params[':id'] = $data['id'];
            $stmt = $pdo->prepare("
                UPDATE empleados SET
                    nombres = :nombres,
                    apellidos = :apellidos,
                    cedula = :cedula,
                    correo = :correo,
                    telefono = :telefono,
                    celular = :celular,
                    fecha_nacimiento = :fecha_nacimiento,
                    centro_id = :centro_id,
                    ciudad_id = :ciudad_id,
                    area = :area
                WHERE id = :id
            ");
        } else {
            $passwordHash = hashPassword($DEFAULT_PASSWORD); // Hash seguro
            $stmt = $pdo->prepare("
                INSERT INTO empleados 
                    (nombres, apellidos, cedula, correo, telefono, celular, fecha_nacimiento, centro_id, ciudad_id, area, fecha_registro, password)
                VALUES 
                    (:nombres, :apellidos, :cedula, :correo, :telefono, :celular, :fecha_nacimiento, :centro_id, :ciudad_id, :area, NOW(), :password)
            ");
            $params[':password'] = $passwordHash;
        }

        $res = $stmt->execute($params);

        if ($res) {
            $db->sendResponse(['ok' => 'ok']);
        } else {
            $db->sendError('Error al guardar empleado');
        }

    } catch (PDOException $e) {
        $db->sendError('Error DB: ' . $e->getMessage());
    }
}

// FUNCIONES CORREGIDAS DE EVENTOS

function handleGetEventos($pdo, $db)
{
    $stmt = $pdo->prepare("
        SELECT e.*, 
               c.nombre as ciudad_nombre, 
               ce.nombre as centro_nombre,
               CONCAT(emp.nombres, ' ', emp.apellidos) as creador_nombre,
               CASE 
                   WHEN NOW() BETWEEN e.fecha_inicio_vigencia AND e.fecha_fin_vigencia THEN 'vigente'
                   WHEN NOW() < e.fecha_inicio_vigencia THEN 'programado'
                   ELSE 'vencido'
               END as estado_vigencia
        FROM eventos e
        LEFT JOIN ciudades c ON e.ciudad_id = c.id
        LEFT JOIN centros ce ON e.centro_id = ce.id
        LEFT JOIN empleados emp ON e.creado_por = emp.id
        ORDER BY e.fecha_creacion DESC
    ");
    $stmt->execute();
    $eventos = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Procesar los eventos para asegurar tipos correctos
    foreach ($eventos as &$evento) {
        $evento['destacado'] = (bool)$evento['destacado'];
        $evento['requiere_registro'] = (bool)$evento['requiere_registro'];
        $evento['cupo_actual'] = (int)($evento['cupo_actual'] ?? 0);
        $evento['cupo_maximo'] = $evento['cupo_maximo'] ? (int)$evento['cupo_maximo'] : null;
    }
    
    $db->sendResponse($eventos);
}

function handleGetEventosVigentes($pdo, $db)
{
    $stmt = $pdo->prepare("
        SELECT * FROM eventos_vigentes 
        WHERE activo = 1 
        ORDER BY destacado DESC, fecha_evento ASC
    ");
    $stmt->execute();
    $eventos = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Procesar los eventos para asegurar tipos correctos
    foreach ($eventos as &$evento) {
        $evento['destacado'] = (bool)$evento['destacado'];
        $evento['requiere_registro'] = (bool)$evento['requiere_registro'];
        $evento['cupo_actual'] = (int)($evento['cupo_actual'] ?? 0);
        $evento['cupo_maximo'] = $evento['cupo_maximo'] ? (int)$evento['cupo_maximo'] : null;
    }
    
    $db->sendResponse($eventos);
}

function handleAgregarEvento($pdo, $input, $db)
{
    $requiredFields = ['titulo', 'descripcion', 'fecha_evento', 'fecha_fin_vigencia'];
    $db->validateRequired($input, $requiredFields);

    try {
        $stmt = $pdo->prepare("INSERT INTO eventos
            (titulo, descripcion, direccion, fecha_evento, fecha_fin_evento, 
             fecha_inicio_vigencia, fecha_fin_vigencia, tipo_evento, ciudad_id, 
             centro_id, creado_por, contacto_telefono, contacto_email, 
             url_externa, cupo_maximo, requiere_registro, tags, destacado)
            VALUES (?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

        $stmt->execute([
            $db->sanitizeInput($input['titulo']),
            $db->sanitizeInput($input['descripcion']),
            $input['direccion'] ?? null,
            $input['fecha_evento'],
            $input['fecha_fin_evento'] ?? null,
            $input['fecha_fin_vigencia'],
            $input['tipo_evento'] ?? 'Evento',
            $input['ciudad_id'] ?? null,
            $input['centro_id'] ?? null,
            $input['creado_por'] ?? null,
            $input['contacto_telefono'] ?? null,
            $input['contacto_email'] ?? null,
            $input['url_externa'] ?? null,
            $input['cupo_maximo'] ?? null,
            $input['requiere_registro'] ? 1 : 0,
            $input['tags'] ?? null,
            $input['destacado'] ? 1 : 0
        ]);

        $db->sendResponse(['id' => $pdo->lastInsertId()], true, 'Evento creado correctamente');

    } catch (PDOException $e) {
        $db->sendError('Error al crear evento: ' . $e->getMessage());
    }
}

function handleActualizarEvento($pdo, $input, $db)
{
    $id = $_GET['id'] ?? null;
    if (!$id) {
        $db->sendError('ID de evento requerido');
    }

    try {
        $stmt = $pdo->prepare("UPDATE eventos SET
            titulo = ?, descripcion = ?, direccion = ?, fecha_evento = ?, 
            fecha_fin_evento = ?, fecha_fin_vigencia = ?, tipo_evento = ?, 
            ciudad_id = ?, centro_id = ?, contacto_telefono = ?, 
            contacto_email = ?, url_externa = ?, cupo_maximo = ?, 
            requiere_registro = ?, tags = ?, destacado = ?,
            fecha_actualizacion = NOW()
            WHERE id = ?");

        $stmt->execute([
            $db->sanitizeInput($input['titulo']),
            $db->sanitizeInput($input['descripcion']),
            $input['direccion'] ?? null,
            $input['fecha_evento'],
            $input['fecha_fin_evento'] ?? null,
            $input['fecha_fin_vigencia'],
            $input['tipo_evento'] ?? 'Evento',
            $input['ciudad_id'] ?? null,
            $input['centro_id'] ?? null,
            $input['contacto_telefono'] ?? null,
            $input['contacto_email'] ?? null,
            $input['url_externa'] ?? null,
            $input['cupo_maximo'] ?? null,
            $input['requiere_registro'] ? 1 : 0,
            $input['tags'] ?? null,
            $input['destacado'] ? 1 : 0,
            $id
        ]);

        $db->sendResponse(null, true, 'Evento actualizado correctamente');

    } catch (PDOException $e) {
        $db->sendError('Error al actualizar evento: ' . $e->getMessage());
    }
}

function handleEliminarEvento($pdo, $db)
{
    $id = $_GET['id'] ?? null;
    if (!$id) {
        $db->sendError('ID de evento requerido');
    }

    try {
        $stmt = $pdo->prepare("DELETE FROM eventos WHERE id = ?");
        $stmt->execute([$id]);
        $db->sendResponse(null, true, 'Evento eliminado correctamente');

    } catch (PDOException $e) {
        $db->sendError('Error al eliminar evento: ' . $e->getMessage());
    }
}

function handleSubirFotoEvento($pdo, $db)
{
    $id = $_GET['id'] ?? null;
    if (!$id) {
        $db->sendError('ID de evento requerido');
    }

    if (!isset($_FILES['foto'])) {
        $db->sendError('No se ha enviado ninguna foto');
    }

    $foto = $_FILES['foto'];

    // Validaciones
    if ($foto['error'] !== UPLOAD_ERR_OK) {
        $db->sendError('Error al subir el archivo');
    }

    if ($foto['size'] > MAX_FILE_SIZE) {
        $db->sendError('El archivo es demasiado grande');
    }

    $extension = strtolower(pathinfo($foto['name'], PATHINFO_EXTENSION));
    if (!in_array($extension, ALLOWED_EXTENSIONS)) {
        $db->sendError('Tipo de archivo no permitido');
    }

    try {
        // Crear directorio si no existe
        $uploadDir = './uploads/eventos/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        // Generar nombre único
        $nombreArchivo = 'evento_' . $id . '_' . uniqid() . '.' . $extension;
        $rutaArchivo = $uploadDir . $nombreArchivo;

        if (move_uploaded_file($foto['tmp_name'], $rutaArchivo)) {
            // Actualizar base de datos
            $stmt = $pdo->prepare("UPDATE eventos SET foto = ? WHERE id = ?");
            $stmt->execute([$nombreArchivo, $id]);

            $db->sendResponse(['foto' => $nombreArchivo], true, 'Foto subida correctamente');
        } else {
            $db->sendError('Error al guardar el archivo');
        }

    } catch (Exception $e) {
        $db->sendError('Error al procesar la foto: ' . $e->getMessage());
    }
}

// FUNCIÓN CORREGIDA para save_foto_evento
function save_foto_evento($pdo, $db)
{
    $id_evento = $_POST['id_evento'] ?? '';
    $fotoBase64 = $_POST['foto'] ?? '';
    $extension = basename($_POST['extension'] ?? 'jpg');

    if (!$id_evento || !$fotoBase64) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'msg' => 'Faltan parámetros']);
        exit;
    }

    // Limpiar el base64
    $fotoData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $fotoBase64));
    
    if ($fotoData === false) {
        $db->sendError('Error al decodificar la imagen');
        return;
    }

    // Generar nombre único
    $uuid = uniqid('evento_', true) . ".$extension";
    
    // Crear directorio si no existe
    $uploadDir = __DIR__ . '/uploads/eventos/';
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }
    
    $uploadPath = $uploadDir . $uuid;

    if (file_put_contents($uploadPath, $fotoData)) {
        $stmt = $pdo->prepare("UPDATE eventos SET foto = :foto WHERE id = :id");
        $stmt->bindParam(':foto', $uuid);
        $stmt->bindParam(':id', $id_evento);

        if ($stmt->execute()) {
            $db->sendResponse(['url' => $uuid]);
        } else {
            $db->sendError('Error al actualizar base de datos');
        }
    } else {
        $db->sendError('Error al guardar archivo');
    }
}

?>