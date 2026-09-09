const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());


/*=========================================
        CONEXIÓN A MYSQL
=========================================*/

const conexion = mysql.createConnection({

    host: "localhost",
    user: "root",
    password: "mateo123",
    database: "la_granjita",
    port: 3305

});


conexion.connect((error) => {

    if (error) {

        console.error(
            "❌ Error al conectar con MySQL:",
            error
        );

        return;
    }

    console.log(
        "✅ Conectado correctamente a MySQL"
    );

});


/*=========================================
        RUTA PRINCIPAL
=========================================*/

app.get("/", (req, res) => {

    res.send(
        "Servidor de La Granjita funcionando"
    );

});


/*=========================================
        PRUEBA DE CONEXIÓN MYSQL
=========================================*/

app.get("/prueba-mysql", (req, res) => {

    conexion.query(
        "SELECT 1 AS conexion",
        (error, resultado) => {

            if (error) {

                console.error(
                    "❌ Error en MySQL:",
                    error
                );

                return res.status(500).json({

                    mensaje:
                        "Error en la conexión con MySQL"

                });
            }

            res.json({

                mensaje:
                    "MySQL responde correctamente",

                resultado:
                    resultado

            });

        }
    );

});


/*=========================================
        REGISTRO DE USUARIOS
=========================================*/

app.post("/registro", (req, res) => {

    const {

        nombre,
        apellido,
        documento,
        fecha,
        correo,
        telefono,
        password

    } = req.body;


    /*=========================================
            VALIDAR CAMPOS
    =========================================*/

    if (

        !nombre ||
        !apellido ||
        !documento ||
        !fecha ||
        !correo ||
        !telefono ||
        !password

    ) {

        return res.status(400).json({

            mensaje:
                "Todos los campos son obligatorios."

        });

    }


    /*=========================================
            VERIFICAR CORREO
    =========================================*/

    const verificarCorreo = `

        SELECT id_usuario

        FROM usuario

        WHERE correo = ?

    `;


    conexion.query(

        verificarCorreo,

        [correo],

        (error, resultados) => {

            if (error) {

                console.error(
                    "❌ Error al verificar correo:",
                    error
                );

                return res.status(500).json({

                    mensaje:
                        "Error al consultar la base de datos."

                });

            }


            /*=========================================
                    CORREO YA EXISTE
            =========================================*/

            if (resultados.length > 0) {

                return res.status(400).json({

                    mensaje:
                        "Este correo ya se encuentra registrado."

                });

            }


            /*=========================================
                    INSERTAR USUARIO
            =========================================*/

            const sql = `

                INSERT INTO usuario

                (

                    nombre,
                    apellido,
                    documento,
                    fecha_nacimiento,
                    correo,
                    telefono,
                    contrasena,
                    rol

                )

                VALUES (?, ?, ?, ?, ?, ?, ?, ?)

            `;


            conexion.query(

                sql,

                [

                    nombre,
                    apellido,
                    documento,
                    fecha,
                    correo,
                    telefono,
                    password,
                    "Cliente"

                ],

                (error, resultado) => {

                    if (error) {

                        console.error(
                            "❌ Error al registrar usuario:",
                            error
                        );


                        /*=========================================
                                DOCUMENTO O CORREO REPETIDO
                        =========================================*/

                        if (
                            error.code ===
                            "ER_DUP_ENTRY"
                        ) {

                            return res.status(400).json({

                                mensaje:
                                    "El documento o correo ya se encuentra registrado."

                            });

                        }


                        return res.status(500).json({

                            mensaje:
                                "Error al guardar el usuario en la base de datos."

                        });

                    }


                    /*=========================================
                            REGISTRO EXITOSO
                    =========================================*/

                    console.log(

                        "✅ Usuario registrado con ID:",

                        resultado.insertId

                    );


                    res.status(201).json({

                        mensaje:
                            "Registro exitoso.",

                        id_usuario:
                            resultado.insertId

                    });

                }

            );

        }

    );

});

/*=========================================
        INICIO DE SESIÓN
=========================================*/

app.post("/login", (req, res) => {

    const {
        correo,
        password
    } = req.body;

    /*=========================================
            VALIDAR CAMPOS
    =========================================*/

    if (!correo || !password) {

        return res.status(400).json({
            mensaje: "El correo y la contraseña son obligatorios."
        });

    }

    /*=========================================
            BUSCAR USUARIO
    =========================================*/

    const sql = `
        SELECT
            id_usuario,
            nombre,
            apellido,
            documento,
            fecha_nacimiento,
            correo,
            telefono,
            contrasena,
            rol
        FROM usuario
        WHERE correo = ?
        LIMIT 1
    `;

    conexion.query(
        sql,
        [correo],
        (error, resultados) => {

            if (error) {

                console.error(
                    "❌ Error al consultar usuario:",
                    error
                );

                return res.status(500).json({
                    mensaje:
                        "Error al consultar la base de datos."
                });

            }

            /*=========================================
                    USUARIO NO EXISTE
            =========================================*/

            if (resultados.length === 0) {

                return res.status(401).json({
                    mensaje:
                        "Correo o contraseña incorrectos."
                });

            }

            const usuario = resultados[0];

            /*=========================================
                    COMPROBAR CONTRASEÑA
            =========================================*/

            if (usuario.contrasena !== password) {

                return res.status(401).json({
                    mensaje:
                        "Correo o contraseña incorrectos."
                });

            }

            /*=========================================
                    LOGIN EXITOSO
            =========================================*/

            console.log(
                "✅ Inicio de sesión:",
                usuario.correo
            );

            /* No enviar la contraseña al navegador */

            delete usuario.contrasena;

            return res.status(200).json({

                mensaje:
                    "Inicio de sesión exitoso.",

                usuario:
                    usuario

            });

        }
    );

});

/*=========================================
        CONSULTAR PRODUCTOS
=========================================*/

app.get("/productos", (req, res) => {

    const sql = `
        SELECT
            id_producto,
            nombre,
            descripcion,
            tipo,
            precio,
            stock
        FROM producto
        ORDER BY id_producto ASC
    `;

    conexion.query(
        sql,
        (error, resultados) => {

            if (error) {

                console.error(
                    "❌ Error al consultar productos:",
                    error
                );

                return res.status(500).json({
                    mensaje:
                        "Error al consultar los productos."
                });

            }

            console.log(
                "✅ Productos consultados:",
                resultados.length
            );

            res.status(200).json(
                resultados
            );

        }
    );

});

/*=========================================
        CREAR PEDIDO
=========================================*/

app.post("/pedidos", (req, res) => {

    const {
        id_usuario,
        productos
    } = req.body;


    /*
        Validamos los datos recibidos.
    */

    if (
        !id_usuario ||
        !Array.isArray(productos) ||
        productos.length === 0
    ) {

        return res.status(400).json({
            mensaje:
                "El usuario y los productos son obligatorios."
        });

    }


    /*
        Calculamos la fecha actual.
    */

    const fecha =
        new Date()
            .toISOString()
            .slice(0, 10);


    /*
        Iniciamos una transacción.
        Esto permite que todas las operaciones
        se confirmen juntas o se cancelen juntas.
    */

    conexion.beginTransaction(error => {

        if (error) {

            console.error(
                "❌ Error al iniciar transacción:",
                error
            );

            return res.status(500).json({
                mensaje:
                    "No se pudo iniciar la transacción."
            });

        }


        /*
            Consultamos nuevamente los productos
            directamente desde MySQL.

            NO confiamos en el precio enviado
            por el navegador.
        */

        const ids = productos.map(
            producto => producto.id_producto
        );


        const placeholders =
            ids.map(() => "?").join(",");


        const sqlProductos = `
            SELECT
                id_producto,
                nombre,
                precio,
                stock
            FROM producto
            WHERE id_producto IN (${placeholders})
            FOR UPDATE
        `;


        conexion.query(
            sqlProductos,
            ids,
            (error, productosBD) => {

                if (error) {

                    return conexion.rollback(() => {

                        console.error(
                            "❌ Error al consultar productos:",
                            error
                        );

                        res.status(500).json({
                            mensaje:
                                "No se pudieron consultar los productos."
                        });

                    });

                }


                /*
                    Verificamos que todos los productos
                    existan en la base de datos.
                */

                if (
                    productosBD.length !==
                    productos.length
                ) {

                    return conexion.rollback(() => {

                        res.status(400).json({
                            mensaje:
                                "Uno o más productos ya no existen."
                        });

                    });

                }


                let total = 0;

                const detalles = [];


                /*
                    Validamos stock y calculamos
                    los valores directamente con
                    los precios de MySQL.
                */

                for(
                    const productoCarrito
                    of productos
                ){

                    const productoBD =
                        productosBD.find(
                            producto =>
                                producto.id_producto ===
                                Number(
                                    productoCarrito.id_producto
                                )
                        );


                    if(!productoBD){

                        return conexion.rollback(() => {

                            res.status(400).json({
                                mensaje:
                                    "Producto no encontrado."
                            });

                        });

                    }


                    const cantidad =
                        Number(
                            productoCarrito.cantidad
                        );


                    /*
                        Validamos que la cantidad
                        sea un número válido.
                    */

                    if(
                        !Number.isInteger(cantidad) ||
                        cantidad <= 0
                    ){

                        return conexion.rollback(() => {

                            res.status(400).json({
                                mensaje:
                                    "La cantidad del producto no es válida."
                            });

                        });

                    }


                    /*
                        Comprobamos el stock disponible.
                    */

                    if(
                        cantidad >
                        productoBD.stock
                    ){

                        return conexion.rollback(() => {

                            res.status(400).json({
                                mensaje:
                                    `No hay suficiente stock de ${productoBD.nombre}. Stock disponible: ${productoBD.stock}.`
                            });

                        });

                    }


                    const precio =
                        Number(
                            productoBD.precio
                        );


                    const subtotal =
                        cantidad * precio;


                    total += subtotal;


                    detalles.push({

                        id_producto:
                            productoBD.id_producto,

                        cantidad:
                            cantidad,

                        precio:
                            precio,

                        subtotal:
                            subtotal

                    });

                }


                /*
                    Creamos el pedido.
                */

                const sqlPedido = `
                    INSERT INTO pedido
                    (
                        id_usuario,
                        fecha,
                        estado,
                        total
                    )
                    VALUES (?, ?, ?, ?)
                `;


                conexion.query(
                    sqlPedido,
                    [
                        id_usuario,
                        fecha,
                        "Pendiente",
                        total
                    ],
                    (error, resultado) => {

                        if(error){

                            return conexion.rollback(() => {

                                console.error(
                                    "❌ Error al crear pedido:",
                                    error
                                );

                                res.status(500).json({
                                    mensaje:
                                        "No se pudo crear el pedido."
                                });

                            });

                        }


                        const idPedido =
                            resultado.insertId;


                        /*
                            Guardamos cada detalle.
                        */

                        let procesados = 0;


                        detalles.forEach(detalle => {

                            const sqlDetalle = `
                                INSERT INTO detalle_pedido
                                (
                                    id_pedido,
                                    id_producto,
                                    cantidad,
                                    precio_unitario,
                                    subtotal
                                )
                                VALUES (?, ?, ?, ?, ?)
                            `;


                            conexion.query(
                                sqlDetalle,
                                [
                                    idPedido,
                                    detalle.id_producto,
                                    detalle.cantidad,
                                    detalle.precio,
                                    detalle.subtotal
                                ],
                                (error) => {

                                    if(error){

                                        return conexion.rollback(() => {

                                            console.error(
                                                "❌ Error al guardar detalle:",
                                                error
                                            );

                                            res.status(500).json({
                                                mensaje:
                                                    "No se pudo guardar el detalle del pedido."
                                            });

                                        });

                                    }


                                    /*
                                        Actualizamos el stock.
                                    */

                                    const sqlStock = `
                                        UPDATE producto
                                        SET stock = stock - ?
                                        WHERE id_producto = ?
                                    `;


                                    conexion.query(
                                        sqlStock,
                                        [
                                            detalle.cantidad,
                                            detalle.id_producto
                                        ],
                                        (error) => {

                                            if(error){

                                                return conexion.rollback(() => {

                                                    console.error(
                                                        "❌ Error al actualizar stock:",
                                                        error
                                                    );

                                                    res.status(500).json({
                                                        mensaje:
                                                            "No se pudo actualizar el stock."
                                                    });

                                                });

                                            }


                                            procesados++;


                                            /*
                                                Cuando todos los detalles
                                                fueron procesados,
                                                confirmamos la transacción.
                                            */

                                            if(
                                                procesados ===
                                                detalles.length
                                            ){

                                                conexion.commit(
                                                    error => {

                                                        if(error){

                                                            return conexion.rollback(
                                                                () => {

                                                                    console.error(
                                                                        "❌ Error al confirmar pedido:",
                                                                        error
                                                                    );

                                                                    res.status(500).json({
                                                                        mensaje:
                                                                            "No se pudo confirmar el pedido."
                                                                    });

                                                                }
                                                            );

                                                        }


                                                        console.log(
                                                            "✅ Pedido creado:",
                                                            idPedido
                                                        );


                                                        res.status(201).json({

                                                            mensaje:
                                                                "Pedido creado correctamente.",

                                                            id_pedido:
                                                                idPedido,

                                                            total:
                                                                total

                                                        });

                                                    }
                                                );

                                            }

                                        }
                                    );

                                }
                            );

                        });

                    }
                );

            }
        );

    });

});

/*=========================================
        INICIAR SERVIDOR
=========================================*/

app.listen(3000, () => {

    console.log(

        "🚀 Servidor ejecutándose en http://localhost:3000"

    );

});