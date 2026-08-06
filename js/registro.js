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

function registrarUsuario(e) {

    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const apellido = document.getElementById("apellido").value.trim();
    const documento = document.getElementById("documento").value.trim();
    const fecha = document.getElementById("fecha").value;
    const correo = document.getElementById("correo").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const password = document.getElementById("password").value;
    const confirmar = document.getElementById("confirmar").value;

    if (
        !validarNombre(nombre) ||
        !validarNombre(apellido)
    ) {
        mostrarMensaje("Ingrese nombres y apellidos válidos.", false);
        return;
    }

    if (documento.length < 6) {
        mostrarMensaje("Documento inválido.", false);
        return;
    }

    if (!validarCorreo(correo)) {
        mostrarMensaje("Correo electrónico incorrecto.", false);
        return;
    }

    if (!validarTelefono(telefono)) {
        mostrarMensaje("Número de celular incorrecto.", false);
        return;
    }

    if (password.length < 6) {
        mostrarMensaje("La contraseña debe tener mínimo 6 caracteres.", false);
        return;
    }

    if (password !== confirmar) {
        mostrarMensaje("Las contraseñas no coinciden.", false);
        return;
    }

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const existe = usuarios.find(u => u.correo === correo);

    if (existe) {

        mostrarMensaje("Este correo ya se encuentra registrado.", false);

        return;

    }

    const usuario = {

        nombre,
        apellido,
        documento,
        fecha,
        correo,
        telefono,
        password

    };

    usuarios.push(usuario);

    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    mostrarMensaje("Registro exitoso.", true);

    document.getElementById("formRegistro").reset();

    setTimeout(() => {

        window.location.href = "login.html";

    }, 2500);

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

    const mensaje = document.getElementById("mensajeRegistro");

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