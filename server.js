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
        INICIAR SERVIDOR
=========================================*/

app.listen(3000, () => {

    console.log(

        "🚀 Servidor ejecutándose en http://localhost:3000"

    );

});