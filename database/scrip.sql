CREATE TABLE roles (
    id_rol SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);



CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    id_rol INTEGER NOT NULL,
    cedula VARCHAR(20) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    telefono VARCHAR(50),
    contrasena VARCHAR(255) NOT NULL,
    fecha_registro DATE NOT NULL DEFAULT CURRENT_DATE,
    estado BOOLEAN NOT NULL DEFAULT FALSE,

    CONSTRAINT fk_usuario_rol
        FOREIGN KEY (id_rol)
        REFERENCES roles(id_rol)
);




CREATE TABLE titular_complejo (
    id SERIAL PRIMARY KEY,
    cedula VARCHAR(20) NOT NULL,
    telefono VARCHAR(50),
    correo VARCHAR(150) NOT NULL,
    fecha_registro DATE NOT NULL DEFAULT CURRENT_DATE
);




CREATE TABLE complejos (
    id_complejo SERIAL PRIMARY KEY,
    id_titular INTEGER NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    nit VARCHAR(30),
    provincia VARCHAR(100) NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    direccion VARCHAR(200) NOT NULL,

    CONSTRAINT fk_complejo_titular
        FOREIGN KEY (id_titular)
        REFERENCES titular_complejo(id)
);



CREATE TABLE prestaciones (
    id_prestaciones SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);




CREATE TABLE complejos_prestaciones (
    id_complejo INTEGER NOT NULL,
    id_prestaciones INTEGER NOT NULL,

    PRIMARY KEY (id_complejo, id_prestaciones),

    CONSTRAINT fk_cp_complejo
        FOREIGN KEY (id_complejo)
        REFERENCES complejos(id_complejo),

    CONSTRAINT fk_cp_prestacion
        FOREIGN KEY (id_prestaciones)
        REFERENCES prestaciones(id_prestaciones)
);




CREATE TABLE canchas (
    id_cancha SERIAL PRIMARY KEY,
    id_complejo INTEGER NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    deporte VARCHAR(100) NOT NULL,
    tipo_piso VARCHAR(100) NOT NULL,
    largo NUMERIC(5,2) NOT NULL,
    ancho NUMERIC(5,2) NOT NULL,
    precio_hora INTEGER NOT NULL,
    duracion_minutos INTEGER NOT NULL,
    techada BOOLEAN NOT NULL,
    otros_deportes VARCHAR(200),

    CONSTRAINT fk_cancha_complejo
        FOREIGN KEY (id_complejo)
        REFERENCES complejos(id_complejo),

    CONSTRAINT chk_largo
        CHECK (largo > 0),

    CONSTRAINT chk_ancho
        CHECK (ancho > 0),

    CONSTRAINT chk_precio_hora
        CHECK (precio_hora >= 0),

    CONSTRAINT chk_duracion
        CHECK (duracion_minutos > 0)
);




CREATE TABLE fotos_canchas (
    id SERIAL PRIMARY KEY,
    id_cancha INTEGER NOT NULL,
    url_foto TEXT NOT NULL,

    CONSTRAINT fk_foto_cancha
        FOREIGN KEY (id_cancha)
        REFERENCES canchas(id_cancha)
);




CREATE TABLE horarios (
    id_horario SERIAL PRIMARY KEY,
    id_cancha INTEGER NOT NULL,
    fecha DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    estado VARCHAR(30) NOT NULL DEFAULT 'DISPONIBLE',

    CONSTRAINT fk_horario_cancha
        FOREIGN KEY (id_cancha)
        REFERENCES canchas(id_cancha),

    CONSTRAINT chk_horas
        CHECK (hora_fin > hora_inicio),

    CONSTRAINT uq_horario_cancha
        UNIQUE (
            id_cancha,
            fecha,
            hora_inicio,
            hora_fin
        )
);



CREATE TABLE solicitudes (
    id SERIAL PRIMARY KEY,
    estado VARCHAR(30) NOT NULL DEFAULT 'PENDIENTE',
    fecha_solicitud DATE NOT NULL DEFAULT CURRENT_DATE,
    fecha_revision DATE,
    observacion TEXT,
    como_nos_conocio VARCHAR(150)
);



CREATE TABLE solicitud_cancha (
    id SERIAL PRIMARY KEY,
    solicitud_id INTEGER NOT NULL,
    cancha_id INTEGER NOT NULL,

    CONSTRAINT fk_sc_solicitud
        FOREIGN KEY (solicitud_id)
        REFERENCES solicitudes(id),

    CONSTRAINT fk_sc_cancha
        FOREIGN KEY (cancha_id)
        REFERENCES canchas(id_cancha),

    CONSTRAINT uq_solicitud_cancha
        UNIQUE (solicitud_id, cancha_id)
);




CREATE TABLE reservas (
    id_reserva SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    horario_id INTEGER NOT NULL,
    fecha_creacion DATE NOT NULL DEFAULT CURRENT_DATE,
    estado VARCHAR(30) NOT NULL DEFAULT 'PENDIENTE',

    CONSTRAINT fk_reserva_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id_usuario),

    CONSTRAINT fk_reserva_horario
        FOREIGN KEY (horario_id)
        REFERENCES horarios(id_horario)
);




CREATE UNIQUE INDEX uq_reserva_horario_activo
ON reservas(horario_id)
WHERE estado IN ('PENDIENTE', 'CONFIRMADA');




CREATE TABLE pagos (
    id SERIAL PRIMARY KEY,
    reserva_id INTEGER NOT NULL,
    metodo_pago VARCHAR(50) NOT NULL,
    monto INTEGER NOT NULL,
    estado VARCHAR(30) NOT NULL,
    fecha_pago DATE NOT NULL DEFAULT CURRENT_DATE,

    CONSTRAINT fk_pago_reserva
        FOREIGN KEY (reserva_id)
        REFERENCES reservas(id_reserva),

    CONSTRAINT chk_monto
        CHECK (monto >= 0)
);


INSERT INTO roles (nombre)
VALUES
('ADMIN'),
('USUARIO');


INSERT INTO usuarios
(id_rol, cedula, nombre, email, telefono, contrasena, fecha_registro, estado)
VALUES
(1, '1000000001', 'Administrador TuCancha', 'admin@tucancha.com', '3001112233', 'admin123', CURRENT_DATE, TRUE),
(2, '1000000002', 'Miguel Ospina', 'miguel@email.com', '3002223344', 'miguel123', CURRENT_DATE, TRUE),
(2, '1000000003', 'Laura Gomez', 'laura@email.com', '3003334455', 'laura123', CURRENT_DATE, TRUE);


INSERT INTO titular_complejo
(cedula, telefono, correo, fecha_registro)
VALUES
('900100200', '3105556677', 'contacto@altura360.com', CURRENT_DATE),
('900200300', '3116667788', 'contacto@zonaf7.com', CURRENT_DATE);


INSERT INTO complejos
(id_titular, nombre, nit, provincia, ciudad, direccion)
VALUES
(1, 'Complejo Deportivo Altura 360', '900100200-1', 'Antioquia', 'Medellín', 'Cra. 65 #48-32'),
(2, 'Zona F7', '900200300-2', 'Antioquia', 'Envigado', 'Calle 35 Sur #40-20');


INSERT INTO prestaciones (nombre)
VALUES
('Parqueadero'),
('Baños'),
('Duchas'),
('Cafetería'),
('Wifi'),
('Vestidores');


INSERT INTO complejos_prestaciones
(id_complejo, id_prestaciones)
VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 6),
(2, 1),
(2, 2),
(2, 5);


INSERT INTO canchas
(
    id_complejo,
    nombre,
    deporte,
    tipo_piso,
    largo,
    ancho,
    precio_hora,
    duracion_minutos,
    techada,
    otros_deportes
)
VALUES
(1, 'Cancha Titán', 'Fútbol 5', 'Sintética', 40.00, 20.00, 80000, 60, FALSE, NULL),
(1, 'Cancha Centauro', 'Fútbol 5', 'Sintética', 42.00, 22.00, 90000, 60, TRUE, 'Fútbol 6'),
(2, 'Cancha Elite', 'Fútbol 7', 'Sintética', 50.00, 30.00, 110000, 60, FALSE, NULL);


INSERT INTO fotos_canchas
(id_cancha, url_foto)
VALUES
(1, 'https://ejemplo.com/cancha-titan-1.jpg'),
(1, 'https://ejemplo.com/cancha-titan-2.jpg'),
(2, 'https://ejemplo.com/cancha-centauro-1.jpg'),
(2, 'https://ejemplo.com/cancha-centauro-2.jpg'),
(3, 'https://ejemplo.com/cancha-elite-1.jpg');


INSERT INTO horarios
(id_cancha, fecha, hora_inicio, hora_fin, estado)
VALUES
(1, '2026-09-15', '18:00', '19:00', 'DISPONIBLE'),
(1, '2026-09-15', '19:00', '20:00', 'DISPONIBLE'),
(1, '2026-09-16', '18:00', '19:00', 'DISPONIBLE'),
(2, '2026-09-15', '18:00', '19:00', 'DISPONIBLE'),
(2, '2026-09-15', '19:00', '20:00', 'DISPONIBLE'),
(3, '2026-09-20', '10:00', '11:00', 'DISPONIBLE');


INSERT INTO solicitudes
(estado, fecha_solicitud, fecha_revision, observacion, como_nos_conocio)
VALUES
('APROBADA', '2026-09-01', '2026-09-02', 'Canchas verificadas correctamente', 'Instagram'),
('PENDIENTE', '2026-09-02', NULL, NULL, 'Google');


INSERT INTO solicitud_cancha
(solicitud_id, cancha_id)
VALUES
(1, 1),
(1, 2),
(2, 3);


INSERT INTO reservas
(usuario_id, horario_id, fecha_creacion, estado)
VALUES
(2, 1, '2026-09-02', 'CONFIRMADA'),
(3, 4, '2026-09-02', 'CONFIRMADA'),
(2, 6, '2026-09-02', 'PENDIENTE');


INSERT INTO pagos
(reserva_id, metodo_pago, monto, estado, fecha_pago)
VALUES
(1, 'PSE', 80000, 'APROBADO', '2026-09-02'),
(2, 'TARJETA', 90000, 'APROBADO', '2026-09-02'),
(3, 'PSE', 110000, 'PENDIENTE', '2026-09-02');