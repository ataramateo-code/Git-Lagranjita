Use la_granjita;
-- ==========================================
-- TABLA USUARIO
-- ==========================================

CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    telefono VARCHAR(20),
    contrasena VARCHAR(255) NOT NULL,
    direccion VARCHAR(150),
    rol ENUM('Administrador','Cliente') NOT NULL
);

-- ==========================================
-- TABLA PRODUCTO
-- ==========================================

CREATE TABLE producto (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    tipo ENUM('Huevos','Gallinas') NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL
);

-- ==========================================
-- TABLA PEDIDO
-- ==========================================

CREATE TABLE pedido (
    id_pedido INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    fecha DATE NOT NULL,
    estado ENUM(
        'Pendiente',
        'Pagado',
        'Enviado',
        'Entregado',
        'Cancelado'
    ) NOT NULL,
    total DECIMAL(10,2) NOT NULL,

    CONSTRAINT fk_pedido_usuario
        FOREIGN KEY(id_usuario)
        REFERENCES usuario(id_usuario)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- ==========================================
-- TABLA DETALLE PEDIDO
-- ==========================================

CREATE TABLE detalle_pedido (

    id_detalle INT AUTO_INCREMENT PRIMARY KEY,

    id_pedido INT NOT NULL,

    id_producto INT NOT NULL,

    cantidad INT NOT NULL,

    precio_unitario DECIMAL(10,2) NOT NULL,

    subtotal DECIMAL(10,2) NOT NULL,

    CONSTRAINT fk_detalle_pedido
        FOREIGN KEY(id_pedido)
        REFERENCES pedido(id_pedido)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT fk_detalle_producto
        FOREIGN KEY(id_producto)
        REFERENCES producto(id_producto)
        ON UPDATE CASCADE
        ON DELETE RESTRICT

);

-- ==========================================
-- TABLA PAGO
-- ==========================================

CREATE TABLE pago (

    id_pago INT AUTO_INCREMENT PRIMARY KEY,

    id_pedido INT UNIQUE NOT NULL,

    metodo_pago ENUM(
        'Efectivo',
        'Tarjeta',
        'Transferencia',
        'Nequi',
        'Daviplata'
    ) NOT NULL,

    fecha_pago DATE,

    estado_pago ENUM(
        'Pendiente',
        'Aprobado',
        'Rechazado'
    ) NOT NULL,

    CONSTRAINT fk_pago_pedido
        FOREIGN KEY(id_pedido)
        REFERENCES pedido(id_pedido)
        ON UPDATE CASCADE
        ON DELETE CASCADE

);

-- ==========================================
-- TABLA ENVIO
-- ==========================================

CREATE TABLE envio (

    id_envio INT AUTO_INCREMENT PRIMARY KEY,

    id_pedido INT UNIQUE NOT NULL,

    direccion_entrega VARCHAR(200),

    fecha_envio DATE,

    estado_envio ENUM(
        'Pendiente',
        'En camino',
        'Entregado'
    ) NOT NULL,

    CONSTRAINT fk_envio_pedido
        FOREIGN KEY(id_pedido)
        REFERENCES pedido(id_pedido)
        ON UPDATE CASCADE
        ON DELETE CASCADE

);

-- ==========================================
-- DATOS DE EJEMPLO
-- ==========================================

INSERT INTO usuario
(nombre,apellido,correo,telefono,contrasena,direccion,rol)
VALUES
('Mateo','Atará','mateo@lagranjita.com','3000000000','123456','tunja','Administrador');

INSERT INTO producto
(nombre,descripcion,tipo,precio,stock)
VALUES
('Huevos AA','Bandeja por 30 unidades','Huevos',18000,100),
('Huevos Criollos','Huevos frescos','Huevos',22000,80),
('Gallina Ponedora','Gallina lista para producción','Gallinas',45000,20);

-- ==========================================
-- FIN DEL SCRIPT
-- ==========================================