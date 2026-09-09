/*=========================================
        LA GRANJITA
        registro.js
=========================================*/

document.addEventListener("DOMContentLoaded", () => {

    const formulario = document.getElementById("formRegistro");

    if (formulario) {
        formulario.addEventListener("submit", registrarUsuario);
    }

});


/*=========================================
        REGISTRO
=========================================*/

async function registrarUsuario(e) {

    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const apellido = document.getElementById("apellido").value.trim();
    const documento = document.getElementById("documento").value.trim();
    const fecha = document.getElementById("fecha").value;
    const correo = document.getElementById("correo").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const password = document.getElementById("password").value;
    const confirmar = document.getElementById("confirmar").value;


    /*=========================================
            VALIDACIONES
    =========================================*/

    if (
        !validarNombre(nombre) ||
        !validarNombre(apellido)
    ) {

        mostrarMensaje(
            "Ingrese nombres y apellidos válidos.",
            false
        );

        return;
    }


    if (documento.length < 6) {

        mostrarMensaje(
            "Documento inválido.",
            false
        );

        return;
    }


    if (!fecha) {

        mostrarMensaje(
            "Seleccione su fecha de nacimiento.",
            false
        );

        return;
    }


    if (!validarCorreo(correo)) {

        mostrarMensaje(
            "Correo electrónico incorrecto.",
            false
        );

        return;
    }


    if (!validarTelefono(telefono)) {

        mostrarMensaje(
            "Número de celular incorrecto.",
            false
        );

        return;
    }


    if (password.length < 6) {

        mostrarMensaje(
            "La contraseña debe tener mínimo 6 caracteres.",
            false
        );

        return;
    }


    if (password !== confirmar) {

        mostrarMensaje(
            "Las contraseñas no coinciden.",
            false
        );

        return;
    }


    /*=========================================
            ENVIAR DATOS A NODE.JS
    =========================================*/

    try {

        const respuesta = await fetch(
            "http://localhost:3000/registro",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    nombre: nombre,
                    apellido: apellido,
                    documento: documento,
                    fecha: fecha,
                    correo: correo,
                    telefono: telefono,
                    password: password

                })
            }
        );


        const datos = await respuesta.json();


        /*=========================================
                RESPUESTA DEL SERVIDOR
        =========================================*/

        if (!respuesta.ok) {

            mostrarMensaje(
                datos.mensaje,
                false
            );

            return;
        }


        /*=========================================
                REGISTRO EXITOSO
        =========================================*/

        mostrarMensaje(
            datos.mensaje,
            true
        );


        document
            .getElementById("formRegistro")
            .reset();


        setTimeout(() => {

            window.location.href = "login.html";

        }, 2500);


    } catch (error) {

        console.error(
            "Error al conectar con el servidor:",
            error
        );

        mostrarMensaje(
            "No se pudo conectar con el servidor. Verifique que Node.js esté ejecutándose.",
            false
        );
    }

}


/*=========================================
        VALIDACIONES
=========================================*/

function validarNombre(texto) {

    return /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/.test(texto);

}


function validarCorreo(correo) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

}


function validarTelefono(numero) {

    return /^[0-9]{10}$/.test(numero);

}


/*=========================================
        MENSAJES
=========================================*/

function mostrarMensaje(texto, correcto) {

    const mensaje =
        document.getElementById("mensajeRegistro");


    mensaje.classList.remove("hidden");


    if (correcto) {

        mensaje.classList.remove("bg-red-100");
        mensaje.classList.remove("border-red-500");
        mensaje.classList.remove("text-red-700");

        mensaje.classList.add("bg-green-100");
        mensaje.classList.add("border-green-500");
        mensaje.classList.add("text-green-700");

    } else {

        mensaje.classList.remove("bg-green-100");
        mensaje.classList.remove("border-green-500");
        mensaje.classList.remove("text-green-700");

        mensaje.classList.add("bg-red-100");
        mensaje.classList.add("border-red-500");
        mensaje.classList.add("text-red-700");

    }


    mensaje.innerHTML = `

        <div class="flex items-center">

            <i class="fa-solid fa-circle-info text-3xl mr-4"></i>

            <div>

                <h3 class="font-bold text-xl">

                    ${correcto ? "Proceso exitoso" : "Error"}

                </h3>

                <p>${texto}</p>

            </div>

        </div>

    `;


    window.scrollTo({

        top: 0,
        behavior: "smooth"

    });

}
