/*=========================================
        LA GRANJITA
        login.js
=========================================*/

document.addEventListener("DOMContentLoaded", () => {

    iniciarLogin();
    mostrarPassword();

});

/*=========================================
        LOGIN
=========================================*/

function iniciarLogin() {

    const formulario = document.getElementById("formLogin");

    if (!formulario) return;

    formulario.addEventListener("submit", function (e) {

        e.preventDefault();

        const correo = document.getElementById("correo").value.trim();
        const password = document.getElementById("password").value;

        let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

        const usuario = usuarios.find(u =>
            u.correo === correo &&
            u.password === password
        );

        if (!usuario) {

            mostrarMensaje(
                "Correo o contraseña incorrectos.",
                false
            );

            return;

        }

        localStorage.setItem(
            "usuarioActivo",
            JSON.stringify(usuario)
        );

        mostrarMensaje(
            "Bienvenido " + usuario.nombre,
            true
        );

        setTimeout(() => {

            window.location.href = "index.html";

        }, 2000);

    });

}

/*=========================================
        MOSTRAR PASSWORD
=========================================*/

function mostrarPassword() {

    const boton = document.getElementById("mostrarPassword");

    if (!boton) return;

    boton.addEventListener("click", () => {

        const input = document.getElementById("password");

        if (input.type === "password") {

            input.type = "text";

            boton.innerHTML =
                '<i class="fa-solid fa-eye-slash"></i>';

        } else {

            input.type = "password";

            boton.innerHTML =
                '<i class="fa-solid fa-eye"></i>';

        }

    });

}

/*=========================================
        MENSAJES
=========================================*/

function mostrarMensaje(texto, correcto) {

    const mensaje = document.getElementById("mensajeLogin");

    mensaje.classList.remove("hidden");

    if (correcto) {

        mensaje.className =
            "mt-8 p-5 rounded-xl bg-green-100 border border-green-500 text-green-700";

    } else {

        mensaje.className =
            "mt-8 p-5 rounded-xl bg-red-100 border border-red-500 text-red-700";

    }

    mensaje.innerHTML = `

        <div class="flex items-center">

            <i class="fa-solid fa-circle-info text-3xl mr-4"></i>

            <div>

                <h3 class="font-bold text-xl">

                    ${correcto ? "Inicio de sesión exitoso" : "Error"}

                </h3>

                <p>${texto}</p>

            </div>

        </div>

    `;

}