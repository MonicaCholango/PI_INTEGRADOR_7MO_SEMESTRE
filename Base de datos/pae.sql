-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 26-09-2025 a las 05:22:45
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `pae`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `adoptantes`
--

CREATE TABLE `adoptantes` (
  `id` int(11) NOT NULL,
  `nombres` varchar(100) NOT NULL,
  `apellidos` varchar(100) NOT NULL,
  `cedula` varchar(20) NOT NULL,
  `correo` varchar(100) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `celular` varchar(20) DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `intentos_fallidos` int(11) DEFAULT 0,
  `bloqueado` tinyint(1) DEFAULT 0,
  `password` varchar(255) DEFAULT NULL,
  `ciudad_id` int(11) DEFAULT NULL,
  `ultima_conexion` datetime DEFAULT NULL,
  `fecha_registro` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `adoptantes`
--

INSERT INTO `adoptantes` (`id`, `nombres`, `apellidos`, `cedula`, `correo`, `telefono`, `celular`, `fecha_nacimiento`, `intentos_fallidos`, `bloqueado`, `password`, `ciudad_id`, `ultima_conexion`, `fecha_registro`) VALUES
(1, 'Katerine Monica', 'Colaguazo Colango', '1234567890', 'monicacc11@uniandes.edu.ec', '022054566', '0988333720', '1999-07-31', 0, 0, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, '2025-09-15 21:36:52', NULL),
(2, 'Darwin', 'Correa', '1722590948', 'dacopan@proton.me', '022379779', '0983003814', '1994-11-20', 0, 0, '$2y$10$mpKHFJmkVwZwtN2CBiprO.Imr9oi/vpQ4H/RwzbJLFiZxDGValprO', 2, '2025-07-21 01:23:52', NULL),
(3, 'Vanessa', 'Sandoval', '1719871327', 'vanesa@email.com', '0999999999', '0987654321', '2007-09-17', 0, 0, '$2y$10$xfaqIr8kPUfZE4GdBc20S.X4qJ91cnY8.mldyhUi.AD1V6EJM7DoG', 4, '2025-09-25 21:34:05', '2025-09-17 15:28:56');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `centros`
--

CREATE TABLE `centros` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `activo` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `centros`
--

INSERT INTO `centros` (`id`, `nombre`, `activo`) VALUES
(1, 'Clínica Veterinaria Quito', 1),
(2, 'Clínica Veterinaria Tumbaco', 1),
(3, 'Clínica Veterinaria Alusi', 1),
(4, 'Clinica Tumbaco', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ciudades`
--

CREATE TABLE `ciudades` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `activo` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ciudades`
--

INSERT INTO `ciudades` (`id`, `nombre`, `activo`) VALUES
(1, 'Quito - Cotocollao', 1),
(2, 'Quito - Tumbaco', 1),
(3, 'Sangolquí - Rumipamba', 1),
(4, 'Cayambe - Ayora', 1),
(5, 'Cayambe - Cangahua', 1),
(6, 'Cayambe - Olmedo', 1),
(7, 'Cayambe - Otón', 1),
(8, 'Cayambe - Santa Rosa de Cuzubamba', 1),
(9, 'Cayambe - Ascázubi', 1),
(10, 'Machachi - Aloasí', 1),
(11, 'Machachi - Aloag', 1),
(12, 'Machachi - Cutuglahua', 1),
(13, 'Machachi - El Chaupi', 1),
(14, 'Machachi - Tambillo', 1),
(15, 'Machachi - Uyumbicho', 1),
(16, 'Pedro Vicente Maldonado - San Miguel de los Bancos', 1),
(17, 'Puerto Quito - Puerto Quito', 1),
(18, 'Quito - Chillogallo', 1),
(19, 'Quito - Chimbacalle', 1),
(20, 'Quito - El Condado', 1),
(21, 'Quito - Guamaní', 1),
(22, 'Quito - Iñaquito', 1),
(23, 'Quito - Itchimbía', 1),
(24, 'Quito - Jipijapa', 1),
(25, 'Quito - Kennedy', 1),
(26, 'Quito - La Argelia', 1),
(27, 'Quito - La Ecuatoriana', 1),
(28, 'Quito - La Ferroviaria', 1),
(29, 'Quito - Magdalena', 1),
(30, 'Quito - Mariscal Sucre', 1),
(31, 'Quito - Ponceano', 1),
(32, 'Quito - Puengasí', 1),
(33, 'Quito - Quitumbe', 1),
(34, 'Quito - Rumipamba', 1),
(35, 'Quito - San Bartolo', 1),
(36, 'Quito - San Isidro del Inca', 1),
(37, 'Quito - Solanda', 1),
(38, 'Quito - Turubamba', 1),
(39, 'Quito - Alangasí', 1),
(40, 'Quito - Amaguaña', 1),
(41, 'Quito - Atahualpa', 1),
(42, 'Quito - Calacalí', 1),
(43, 'Quito - Calderón', 1),
(44, 'Quito - Conocoto', 1),
(45, 'Quito - Cumbayá', 1),
(46, 'Quito - El Quinche', 1),
(47, 'Quito - Gualea', 1),
(48, 'Quito - Guayllabamba', 1),
(49, 'Quito - La Merced', 1),
(50, 'Quito - Llano Chico', 1),
(51, 'Quito - Lloa', 1),
(52, 'Quito - Nanegal', 1),
(53, 'Quito - Nanegalito', 1),
(54, 'Quito - Nayón', 1),
(55, 'Quito - Nono', 1),
(56, 'Quito - Pacto', 1),
(57, 'Quito - Perucho', 1),
(58, 'Quito - Pifo', 1),
(59, 'Quito - Pintag', 1),
(60, 'Quito - Puéllaro', 1),
(61, 'Quito - San Antonio de Pichincha', 1),
(62, 'Quito - San José de Minas', 1),
(63, 'Quito - Tababela', 1),
(64, 'Quito - Yaruquí', 1),
(65, 'Quito - Zámbiza', 1),
(66, 'Sangolquí - Cotogchoa', 1),
(67, 'San Miguel de los Bancos - Mindo', 1),
(68, 'San Miguel de los Bancos - San Miguel de los Bancos', 1),
(69, 'Tabacundo - La Esperanza', 1),
(70, 'Tabacundo - Malchinguí', 1),
(71, 'Tabacundo - Tocachi', 1),
(72, 'Tabacundo - Tupigachi', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `denuncias`
--

CREATE TABLE `denuncias` (
  `id` int(11) NOT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `observaciones` varchar(255) DEFAULT NULL,
  `ciudad_id` int(11) DEFAULT NULL,
  `tipo_mascota_id` int(11) DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `denunciante_nombre` varchar(200) DEFAULT NULL,
  `denunciante_email` varchar(200) DEFAULT NULL,
  `denunciante_telefono` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `denuncias`
--

INSERT INTO `denuncias` (`id`, `direccion`, `observaciones`, `ciudad_id`, `tipo_mascota_id`, `foto`, `denunciante_nombre`, `denunciante_email`, `denunciante_telefono`) VALUES
(1, 'tumbaco', 'en la calle', 4, 3, '681f3b570b92.jpg', NULL, NULL, NULL),
(2, 'dfgghj', 'obs', 4, 1, '2b1cd3262e27.jpg', 'arwin', 'dacopan@proton.me', '0983003814'),
(3, 'Av 12 de octubre y orellana', 'El animalito sufre de maltratos', 21, 2, 'ab6d7bfca52c.jpg', 'Vanessa Leon', 'vanessa.leon@email.com', '0987654432');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empleados`
--

CREATE TABLE `empleados` (
  `id` int(11) NOT NULL,
  `nombres` varchar(100) NOT NULL,
  `apellidos` varchar(100) NOT NULL,
  `cedula` varchar(20) NOT NULL,
  `correo` varchar(100) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `celular` varchar(20) DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `intentos_fallidos` int(11) DEFAULT 0,
  `bloqueado` tinyint(1) DEFAULT 0,
  `password` varchar(255) DEFAULT NULL,
  `centro_id` int(11) DEFAULT NULL,
  `ciudad_id` int(11) DEFAULT NULL,
  `area` varchar(100) DEFAULT NULL,
  `ultima_conexion` datetime DEFAULT NULL,
  `fecha_registro` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `empleados`
--

INSERT INTO `empleados` (`id`, `nombres`, `apellidos`, `cedula`, `correo`, `telefono`, `celular`, `fecha_nacimiento`, `intentos_fallidos`, `bloqueado`, `password`, `centro_id`, `ciudad_id`, `area`, `ultima_conexion`, `fecha_registro`) VALUES
(1, 'Monica Katherine', 'Cholango Collaguazo', '1752135911', 'moniiikatty@gmail.com', '022054566', '0995082509', '1999-07-31', 0, 0, '$2y$10$xfaqIr8kPUfZE4GdBc20S.X4qJ91cnY8.mldyhUi.AD1V6EJM7DoG', 2, 1, 'Veterinaria', '2025-09-25 21:40:46', NULL),
(11, 'Darwin', 'Correa', '1722590948', 'dacopan@proton.me', '0983003814', '0983003814', '2025-07-30', 0, 0, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, NULL, '', NULL, '2025-07-26 22:35:57'),
(14, 'Jose', 'Arevalo', '1103667968', 'joseas68@uniandes.edu.ec', '', '0967929273', '1998-01-01', 0, 0, '$2y$10$BlG0T7oCTR1bvXHZ5kaUyu4NB4OaqO1Zqp3jfjSDR4r5gqKknzz4u', 3, 22, 'Enfermeria', NULL, '2025-09-17 16:25:54'),
(18, 'Byron', 'Torres', '0705766350', 'byronta50@uniandes.edu.ec', '', '0999127644', '1997-12-31', 0, 0, '$2y$10$q4xSEUIg9gEPPmaEha5XjeyHluPkGIeTtQ/OOpDFmRQIfaePl4pki', 2, 58, 'Soporte', NULL, '2025-09-17 16:29:42');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estados`
--

CREATE TABLE `estados` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estados`
--

INSERT INTO `estados` (`id`, `nombre`) VALUES
(1, 'Enfermo'),
(2, 'Autanasia'),
(3, 'Adoptado'),
(4, 'En veterinaria'),
(5, 'Fallecido'),
(6, 'Disponible');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estados_salud`
--

CREATE TABLE `estados_salud` (
  `id` int(11) NOT NULL,
  `estado` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estados_salud`
--

INSERT INTO `estados_salud` (`id`, `estado`) VALUES
(1, 'Esterilizado'),
(2, 'Sin Esterilizar');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estado_adopcion`
--

CREATE TABLE `estado_adopcion` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estado_adopcion`
--

INSERT INTO `estado_adopcion` (`id`, `nombre`) VALUES
(1, 'Pendiente'),
(2, 'Aprobado'),
(3, 'En revision'),
(4, 'Rechazado'),
(5, 'Cancelado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `eventos`
--

CREATE TABLE `eventos` (
  `id` int(11) NOT NULL,
  `titulo` varchar(200) NOT NULL,
  `descripcion` text NOT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `fecha_evento` datetime NOT NULL,
  `fecha_fin_evento` datetime DEFAULT NULL,
  `fecha_inicio_vigencia` datetime NOT NULL DEFAULT current_timestamp(),
  `fecha_fin_vigencia` datetime NOT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `activo` tinyint(1) DEFAULT 1,
  `destacado` tinyint(1) DEFAULT 0,
  `tipo_evento` enum('Campaña','Evento','Noticia','Adopción') DEFAULT 'Evento',
  `ciudad_id` int(11) DEFAULT NULL,
  `centro_id` int(11) DEFAULT NULL,
  `creado_por` int(11) DEFAULT NULL,
  `fecha_creacion` datetime DEFAULT current_timestamp(),
  `fecha_actualizacion` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `contacto_telefono` varchar(20) DEFAULT NULL,
  `contacto_email` varchar(100) DEFAULT NULL,
  `url_externa` varchar(500) DEFAULT NULL,
  `cupo_maximo` int(11) DEFAULT NULL,
  `cupo_actual` int(11) DEFAULT 0,
  `requiere_registro` tinyint(1) DEFAULT 0,
  `tags` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `eventos`
--

INSERT INTO `eventos` (`id`, `titulo`, `descripcion`, `direccion`, `fecha_evento`, `fecha_fin_evento`, `fecha_inicio_vigencia`, `fecha_fin_vigencia`, `foto`, `activo`, `destacado`, `tipo_evento`, `ciudad_id`, `centro_id`, `creado_por`, `fecha_creacion`, `fecha_actualizacion`, `contacto_telefono`, `contacto_email`, `url_externa`, `cupo_maximo`, `cupo_actual`, `requiere_registro`, `tags`) VALUES
(5, 'Campaña de Esterilizacion', 'C', 'Av Interocenica, ventura mall', '2025-09-26 15:00:00', '2025-09-26 23:00:00', '2025-09-25 21:47:05', '2025-10-26 04:59:59', 'evento_68d5fea9bc6073.83698481.jpg', 1, 1, 'Campaña', 2, 2, 1, '2025-09-25 21:47:05', '2025-09-25 21:47:05', '0987654432', 'vanessa.leon@email.com', '', NULL, 0, 0, 'campaña');

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `eventos_vigentes`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `eventos_vigentes` (
`id` int(11)
,`titulo` varchar(200)
,`descripcion` text
,`direccion` varchar(255)
,`fecha_evento` datetime
,`fecha_fin_evento` datetime
,`fecha_inicio_vigencia` datetime
,`fecha_fin_vigencia` datetime
,`foto` varchar(255)
,`activo` tinyint(1)
,`destacado` tinyint(1)
,`tipo_evento` enum('Campaña','Evento','Noticia','Adopción')
,`ciudad_id` int(11)
,`centro_id` int(11)
,`creado_por` int(11)
,`fecha_creacion` datetime
,`fecha_actualizacion` datetime
,`contacto_telefono` varchar(20)
,`contacto_email` varchar(100)
,`url_externa` varchar(500)
,`cupo_maximo` int(11)
,`cupo_actual` int(11)
,`requiere_registro` tinyint(1)
,`tags` varchar(255)
,`ciudad_nombre` varchar(100)
,`centro_nombre` varchar(100)
,`creador_nombre` varchar(201)
,`estado_vigencia` varchar(10)
,`estado_cupo` varchar(10)
);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mascotas`
--

CREATE TABLE `mascotas` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `edad` varchar(50) DEFAULT NULL,
  `fecha_registro` date DEFAULT NULL,
  `fecha_ingreso` date DEFAULT NULL,
  `fecha_salida` date DEFAULT NULL,
  `estado_adopcion_id` int(11) DEFAULT NULL,
  `centro_id` int(11) DEFAULT NULL,
  `ciudad_id` int(11) DEFAULT NULL,
  `estado_id` int(11) DEFAULT NULL,
  `estados_salud_id` int(11) DEFAULT NULL,
  `responsable_id` int(11) DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `tipo_mascota_id` int(11) DEFAULT 1,
  `foto` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `mascotas`
--

INSERT INTO `mascotas` (`id`, `nombre`, `edad`, `fecha_registro`, `fecha_ingreso`, `fecha_salida`, `estado_adopcion_id`, `centro_id`, `ciudad_id`, `estado_id`, `estados_salud_id`, `responsable_id`, `observaciones`, `tipo_mascota_id`, `foto`) VALUES
(1, 'Max', '1 año', '2025-01-01', '2025-05-01', '2025-07-01', 3, 2, 1, 6, 1, 1, 'Estado de la adopción: Aprobado', 1, NULL),
(2, 'tobias3', '14', '2025-07-20', '2025-07-20', NULL, 1, 3, 9, 6, 1, 1, 'quien', 1, 'foto_68cb29665481c8.69327514.jpg'),
(3, 'Pepito', '1 mes', '2025-09-17', '2025-09-17', NULL, 1, 3, 45, 6, 2, 18, 'Pepito es un perro jugueton, sano y le gusta la naturaleza, busca una familia con la que pueda compartir momentos', 1, 'foto_68cb29765e99e8.65234648.jpg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reset_codes`
--

CREATE TABLE `reset_codes` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `code` varchar(10) NOT NULL,
  `tabla` enum('adoptantes','empleados') NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `reset_codes`
--

INSERT INTO `reset_codes` (`id`, `email`, `code`, `tabla`, `created_at`) VALUES
(1, 'moniiikatty@gmail.com', '798347', 'empleados', '2025-09-16 23:17:30'),
(2, 'moniiikatty@gmail.com', '988462', 'empleados', '2025-09-16 23:17:32'),
(3, 'moniiikatty@gmail.com', '160451', 'empleados', '2025-09-16 23:17:33'),
(4, 'moniiikatty@gmail.com', '378896', 'empleados', '2025-09-16 23:17:33'),
(5, 'moniiikatty@gmail.com', '490932', 'empleados', '2025-09-16 23:17:38'),
(6, 'moniiikatty@gmail.com', '461120', 'empleados', '2025-09-17 11:32:13'),
(7, 'moniiikatty@gmail.com', '387833', 'empleados', '2025-09-17 11:44:36'),
(8, 'moniiikatty@gmail.com', '768809', 'empleados', '2025-09-17 15:34:04'),
(9, 'moniiikatty@gmail.com', '318165', 'empleados', '2025-09-17 15:34:14'),
(10, 'moniiikatty@gmail.com', '246108', 'empleados', '2025-09-17 15:41:29'),
(11, 'moniiikatty@gmail.com', '258673', 'empleados', '2025-09-17 15:41:32'),
(12, 'moniiikatty@gmail.com', '648653', 'empleados', '2025-09-17 15:41:55'),
(13, 'moniiikatty@gmail.com', '347122', 'empleados', '2025-09-17 15:45:33'),
(14, 'moniiikatty@gmail.com', '417935', 'empleados', '2025-09-17 15:45:38');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `solicitudes`
--

CREATE TABLE `solicitudes` (
  `id` int(11) NOT NULL,
  `mascota_id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `usuario_tipo` enum('adoptante','empleado') DEFAULT 'adoptante',
  `estado` enum('Pendiente','Aprobado','En revision','Rechazado','Cancelado') DEFAULT 'Pendiente',
  `fecha_solicitud` timestamp NOT NULL DEFAULT current_timestamp(),
  `observaciones` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `solicitudes`
--

INSERT INTO `solicitudes` (`id`, `mascota_id`, `usuario_id`, `usuario_tipo`, `estado`, `fecha_solicitud`, `observaciones`) VALUES
(1, 1, 1, 'adoptante', 'Rechazado', '2025-07-14 03:56:28', 'Solicitud puesta en revisión'),
(2, 2, 2, 'adoptante', 'Rechazado', '2025-07-20 18:07:00', 'xq me caiste mal'),
(3, 3, 3, 'adoptante', 'En revision', '2025-09-18 20:39:39', 'Solicitud puesta en revisión'),
(4, 2, 3, 'adoptante', 'En revision', '2025-09-18 20:40:16', 'Solicitud puesta en revisión');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_mascotas`
--

CREATE TABLE `tipo_mascotas` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `activo` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tipo_mascotas`
--

INSERT INTO `tipo_mascotas` (`id`, `nombre`, `activo`) VALUES
(1, 'Perro', 1),
(2, 'Gato', 1),
(3, 'Conejo', 1),
(4, 'Ave', 1);

-- --------------------------------------------------------

--
-- Estructura para la vista `eventos_vigentes`
--
DROP TABLE IF EXISTS `eventos_vigentes`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `eventos_vigentes`  AS SELECT `e`.`id` AS `id`, `e`.`titulo` AS `titulo`, `e`.`descripcion` AS `descripcion`, `e`.`direccion` AS `direccion`, `e`.`fecha_evento` AS `fecha_evento`, `e`.`fecha_fin_evento` AS `fecha_fin_evento`, `e`.`fecha_inicio_vigencia` AS `fecha_inicio_vigencia`, `e`.`fecha_fin_vigencia` AS `fecha_fin_vigencia`, `e`.`foto` AS `foto`, `e`.`activo` AS `activo`, `e`.`destacado` AS `destacado`, `e`.`tipo_evento` AS `tipo_evento`, `e`.`ciudad_id` AS `ciudad_id`, `e`.`centro_id` AS `centro_id`, `e`.`creado_por` AS `creado_por`, `e`.`fecha_creacion` AS `fecha_creacion`, `e`.`fecha_actualizacion` AS `fecha_actualizacion`, `e`.`contacto_telefono` AS `contacto_telefono`, `e`.`contacto_email` AS `contacto_email`, `e`.`url_externa` AS `url_externa`, `e`.`cupo_maximo` AS `cupo_maximo`, `e`.`cupo_actual` AS `cupo_actual`, `e`.`requiere_registro` AS `requiere_registro`, `e`.`tags` AS `tags`, `c`.`nombre` AS `ciudad_nombre`, `ce`.`nombre` AS `centro_nombre`, concat(`emp`.`nombres`,' ',`emp`.`apellidos`) AS `creador_nombre`, CASE WHEN current_timestamp() between `e`.`fecha_inicio_vigencia` and `e`.`fecha_fin_vigencia` THEN 'vigente' WHEN current_timestamp() < `e`.`fecha_inicio_vigencia` THEN 'programado' ELSE 'vencido' END AS `estado_vigencia`, CASE WHEN `e`.`cupo_maximo` is not null THEN CASE WHEN `e`.`cupo_actual` >= `e`.`cupo_maximo` THEN 'lleno' ELSE 'disponible' END ELSE 'sin_limite' END AS `estado_cupo` FROM (((`eventos` `e` left join `ciudades` `c` on(`e`.`ciudad_id` = `c`.`id`)) left join `centros` `ce` on(`e`.`centro_id` = `ce`.`id`)) left join `empleados` `emp` on(`e`.`creado_por` = `emp`.`id`)) WHERE `e`.`activo` = 1 ;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `adoptantes`
--
ALTER TABLE `adoptantes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `cedula` (`cedula`),
  ADD KEY `ciudad_id` (`ciudad_id`);

--
-- Indices de la tabla `centros`
--
ALTER TABLE `centros`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `ciudades`
--
ALTER TABLE `ciudades`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `denuncias`
--
ALTER TABLE `denuncias`
  ADD PRIMARY KEY (`id`),
  ADD KEY `denuncias_ciudades_id_fk` (`ciudad_id`),
  ADD KEY `tipo_mascota_fk1` (`tipo_mascota_id`);

--
-- Indices de la tabla `empleados`
--
ALTER TABLE `empleados`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `cedula` (`cedula`),
  ADD KEY `centro_id` (`centro_id`),
  ADD KEY `ciudad_id` (`ciudad_id`);

--
-- Indices de la tabla `estados`
--
ALTER TABLE `estados`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `estados_salud`
--
ALTER TABLE `estados_salud`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `estado_adopcion`
--
ALTER TABLE `estado_adopcion`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `eventos`
--
ALTER TABLE `eventos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_fecha_evento` (`fecha_evento`),
  ADD KEY `idx_vigencia` (`fecha_inicio_vigencia`,`fecha_fin_vigencia`),
  ADD KEY `idx_activo_destacado` (`activo`,`destacado`),
  ADD KEY `idx_tipo_evento` (`tipo_evento`),
  ADD KEY `fk_eventos_ciudad` (`ciudad_id`),
  ADD KEY `fk_eventos_centro` (`centro_id`),
  ADD KEY `fk_eventos_creador` (`creado_por`),
  ADD KEY `idx_vigencia_activo` (`fecha_inicio_vigencia`,`fecha_fin_vigencia`,`activo`);

--
-- Indices de la tabla `mascotas`
--
ALTER TABLE `mascotas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `estado_adopcion_id` (`estado_adopcion_id`),
  ADD KEY `centro_id` (`centro_id`),
  ADD KEY `ciudad_id` (`ciudad_id`),
  ADD KEY `estado_id` (`estado_id`),
  ADD KEY `salud2_id` (`estados_salud_id`),
  ADD KEY `responsable_id` (`responsable_id`),
  ADD KEY `tipo_mascota_id` (`tipo_mascota_id`);

--
-- Indices de la tabla `reset_codes`
--
ALTER TABLE `reset_codes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_code` (`code`),
  ADD KEY `idx_email` (`email`);

--
-- Indices de la tabla `solicitudes`
--
ALTER TABLE `solicitudes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `mascota_id` (`mascota_id`);

--
-- Indices de la tabla `tipo_mascotas`
--
ALTER TABLE `tipo_mascotas`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `adoptantes`
--
ALTER TABLE `adoptantes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `centros`
--
ALTER TABLE `centros`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `ciudades`
--
ALTER TABLE `ciudades`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=73;

--
-- AUTO_INCREMENT de la tabla `denuncias`
--
ALTER TABLE `denuncias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `empleados`
--
ALTER TABLE `empleados`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `estados`
--
ALTER TABLE `estados`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `estados_salud`
--
ALTER TABLE `estados_salud`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `estado_adopcion`
--
ALTER TABLE `estado_adopcion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `eventos`
--
ALTER TABLE `eventos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `mascotas`
--
ALTER TABLE `mascotas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `reset_codes`
--
ALTER TABLE `reset_codes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `solicitudes`
--
ALTER TABLE `solicitudes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `tipo_mascotas`
--
ALTER TABLE `tipo_mascotas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `adoptantes`
--
ALTER TABLE `adoptantes`
  ADD CONSTRAINT `adoptantes_ibfk_1` FOREIGN KEY (`ciudad_id`) REFERENCES `ciudades` (`id`);

--
-- Filtros para la tabla `denuncias`
--
ALTER TABLE `denuncias`
  ADD CONSTRAINT `denuncias_ciudades_id_fk` FOREIGN KEY (`ciudad_id`) REFERENCES `ciudades` (`id`),
  ADD CONSTRAINT `tipo_mascota_fk1` FOREIGN KEY (`tipo_mascota_id`) REFERENCES `tipo_mascotas` (`id`);

--
-- Filtros para la tabla `empleados`
--
ALTER TABLE `empleados`
  ADD CONSTRAINT `empleados_ibfk_1` FOREIGN KEY (`centro_id`) REFERENCES `centros` (`id`),
  ADD CONSTRAINT `empleados_ibfk_2` FOREIGN KEY (`ciudad_id`) REFERENCES `ciudades` (`id`);

--
-- Filtros para la tabla `eventos`
--
ALTER TABLE `eventos`
  ADD CONSTRAINT `fk_eventos_centro` FOREIGN KEY (`centro_id`) REFERENCES `centros` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_eventos_ciudad` FOREIGN KEY (`ciudad_id`) REFERENCES `ciudades` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_eventos_creador` FOREIGN KEY (`creado_por`) REFERENCES `empleados` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `mascotas`
--
ALTER TABLE `mascotas`
  ADD CONSTRAINT `mascotas_ibfk_1` FOREIGN KEY (`estado_adopcion_id`) REFERENCES `estado_adopcion` (`id`),
  ADD CONSTRAINT `mascotas_ibfk_2` FOREIGN KEY (`centro_id`) REFERENCES `centros` (`id`),
  ADD CONSTRAINT `mascotas_ibfk_3` FOREIGN KEY (`ciudad_id`) REFERENCES `ciudades` (`id`),
  ADD CONSTRAINT `mascotas_ibfk_4` FOREIGN KEY (`estado_id`) REFERENCES `estados` (`id`),
  ADD CONSTRAINT `mascotas_ibfk_5` FOREIGN KEY (`estados_salud_id`) REFERENCES `estados_salud` (`id`),
  ADD CONSTRAINT `mascotas_ibfk_6` FOREIGN KEY (`responsable_id`) REFERENCES `empleados` (`id`),
  ADD CONSTRAINT `mascotas_ibfk_7` FOREIGN KEY (`tipo_mascota_id`) REFERENCES `tipo_mascotas` (`id`);

--
-- Filtros para la tabla `solicitudes`
--
ALTER TABLE `solicitudes`
  ADD CONSTRAINT `solicitudes_ibfk_1` FOREIGN KEY (`mascota_id`) REFERENCES `mascotas` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
