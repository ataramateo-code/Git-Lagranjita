const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const conexion = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "mateo123",
    database: "la_granjita",
    port: 3305
});

conexion.connect((error) => {

    if (error) {
        console.error("Error al conectar con MySQL:", error);
        return;
    }

    console.log("✅ Conectado correctamente a MySQL");

});

app.get("/", (req, res) => {

    res.send("Servidor de La Granjita funcionando");

});

/*=========================================
        REGISTRO DE USUARIOS
=========================================*/

app.post("/registro", (req, res) => {

    const {
        nombre,
        apellido,
        correo,
        telefono,
        password
    } = req.body;

    const sql = `
    INSERT INTO usuario
    (nombre, apellido, correo, telefono, contrasena, rol)
    VALUES (?, ?, ?, ?, ?, ?)
`;

    conexion.query(
        sql,
        [
            nombre,
            apellido,
            correo,
            telefono,
            password,
            "Cliente"
        ],
        (error, resultado) => {

            if (error) {
                console.error("Error al registrar usuario:", error);

                if (error.code === "ER_DUP_ENTRY") {
                    return res.status(400).json({
                        mensaje: "Este correo ya se encuentra registrado."
                    });
                }

                return res.status(500).json({
                    mensaje: "Error al guardar el usuario en la base de datos."
                });
            }

            console.log("✅ Usuario registrado con ID:", resultado.insertId);

            res.status(201).json({
                mensaje: "Registro exitoso."
            });
        }
    );
});

app.listen(3000, () => {

    console.log("🚀 Servidor ejecutándose en http://localhost:3000");

});
