/*=========================================
        LA GRANJITA
        carrito.js
=========================================*/

/*
    Cuando la página termina de cargar,
    iniciamos las funciones del carrito.
*/

document.addEventListener("DOMContentLoaded", () => {

    mostrarCarrito();

    actualizarResumen();

    iniciarBotonVaciar();

    iniciarBotonComprar();

});


/*=========================================
        OBTENER CARRITO
=========================================*/

function obtenerCarrito(){

    return JSON.parse(
        localStorage.getItem("carritoProductos")
    ) || [];

}


/*=========================================
        GUARDAR CARRITO
=========================================*/

function guardarCarrito(carrito){

    localStorage.setItem(
        "carritoProductos",
        JSON.stringify(carrito)
    );

}


/*=========================================
        MOSTRAR CARRITO
=========================================*/

function mostrarCarrito() {

    const contenedor =
        document.getElementById("listaCarrito");

    if (!contenedor) return;

    const carrito =
        obtenerCarrito();

    contenedor.innerHTML = "";

    if (carrito.length === 0) {

        contenedor.innerHTML = `
            <div class="bg-white rounded-xl shadow-lg p-8 text-center">

                <i class="fa-solid fa-cart-shopping text-5xl text-gray-400"></i>

                <h3 class="text-2xl font-bold mt-4">
                    Tu carrito está vacío
                </h3>

                <p class="text-gray-500 mt-2">
                    Agrega productos de La Granjita para continuar.
                </p>

                <a
                    href="index.html"
                    class="inline-block bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-lg mt-5">
                    Ver productos
                </a>

            </div>
        `;

        return;
    }


    carrito.forEach(producto => {

        const precio =
            Number(producto.precio) || 0;

        const cantidad =
            Number(producto.cantidad) || 1;

        const subtotal =
            precio * cantidad;


        const tarjeta =
            document.createElement("div");

        tarjeta.className =
            "bg-white rounded-xl shadow-lg p-6";


        tarjeta.innerHTML = `

            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                <div class="flex-1">

                    <h3 class="text-2xl font-bold text-gray-800">
                        ${producto.nombre}
                    </h3>

                    <p class="text-gray-500 mt-1">
                        ${producto.tipo || ""}
                    </p>

                    <p class="text-green-700 font-bold text-xl mt-3">
                        $${formatearPrecio(precio)}
                    </p>

                </div>


                <div class="flex items-center gap-3">

                    <button
                        class="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded"
                        onclick="cambiarCantidad(${producto.id_producto}, -1)">
                        -
                    </button>

                    <span class="font-bold text-lg">
                        ${cantidad}
                    </span>

                    <button
                        class="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded"
                        onclick="cambiarCantidad(${producto.id_producto}, 1)">
                        +
                    </button>

                </div>


                <div class="text-right">

                    <p class="text-sm text-gray-500">
                        Subtotal
                    </p>

                    <p class="text-xl font-bold text-green-700">
                        $${formatearPrecio(subtotal)}
                    </p>

                    <button
                        class="text-red-600 hover:text-red-800 mt-2"
                        onclick="eliminarProducto(${producto.id_producto})">

                        <i class="fa-solid fa-trash mr-1"></i>
                        Eliminar

                    </button>

                </div>

            </div>
        `;

        contenedor.appendChild(tarjeta);

    });


    actualizarResumen();
    actualizarContador();
}


/*=========================================
        CAMBIAR CANTIDAD
=========================================*/

function cambiarCantidad(id, cambio){

    const carrito =
        obtenerCarrito();

    const producto =
        carrito.find(
            item => item.id_producto === id
        );

    if(!producto) return;

    producto.cantidad += cambio;


    if(producto.cantidad <= 0){

        const nuevoCarrito =
            carrito.filter(
                item => item.id_producto !== id
            );

        guardarCarrito(nuevoCarrito);

    }else{

        guardarCarrito(carrito);

    }


    mostrarCarrito();

    actualizarResumen();

    actualizarContador();

}


/*=========================================
        ELIMINAR PRODUCTO
=========================================*/

function eliminarProducto(id){

    const carrito =
        obtenerCarrito();

    const nuevoCarrito =
        carrito.filter(
            producto =>
                producto.id_producto !== id
        );

    guardarCarrito(nuevoCarrito);

    mostrarCarrito();

    actualizarResumen();

    actualizarContador();

}


/*=========================================
        ACTUALIZAR RESUMEN
=========================================*/

function actualizarResumen(){

    const carrito =
        obtenerCarrito();

    let cantidadTotal = 0;

    let precioTotal = 0;


    carrito.forEach(producto => {

        cantidadTotal += producto.cantidad;

        precioTotal +=
            Number(producto.precio) *
            producto.cantidad;

    });


    const cantidad =
        document.getElementById("totalProductos");

    const total =
        document.getElementById("totalCarrito");


    if(cantidad){

        cantidad.innerText =
            cantidadTotal;

    }


    if(total){

        total.innerText =
            "$" + formatearPrecio(precioTotal);

    }

}


/*=========================================
        VACIAR CARRITO
=========================================*/

function iniciarBotonVaciar(){

    const boton =
        document.getElementById("btnVaciar");

    if(!boton) return;


    boton.addEventListener("click", () => {

        const carrito =
            obtenerCarrito();

        if(carrito.length === 0){

            toast("El carrito ya está vacío.");

            return;

        }


        localStorage.removeItem(
            "carritoProductos"
        );

        mostrarCarrito();

        actualizarResumen();

        actualizarContador();

        toast(
            "Carrito vaciado correctamente."
        );

    });

}


/*=========================================
        CONTINUAR COMPRA
=========================================*/

function iniciarBotonComprar(){

    const boton =
        document.getElementById("btnComprar");

    if(!boton) return;


    boton.addEventListener("click", async () => {

        /*
            Recuperamos el usuario que inició sesión.
        */

        const usuarioGuardado =
            localStorage.getItem(
                "usuarioActivo"
            );


        /*
            Recuperamos los productos del carrito.
        */

        const carrito =
            obtenerCarrito();


        if(carrito.length === 0){

            toast(
                "Agregue productos al carrito."
            );

            return;

        }


        /*
            El usuario debe iniciar sesión
            antes de realizar un pedido.
        */

        if(!usuarioGuardado){

            toast(
                "Debe iniciar sesión para continuar."
            );

            setTimeout(() => {

                window.location.href =
                    "login.html";

            },1500);

            return;

        }


        try{

            const usuario =
                JSON.parse(
                    usuarioGuardado
                );


            /*
                Enviamos el usuario y los
                productos al servidor.
            */

            const respuesta =
                await fetch(
                    "http://localhost:3000/pedidos",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            id_usuario:
                                usuario.id_usuario,

                            productos:
                                carrito

                        })

                    }
                );


            const datos =
                await respuesta.json();


            if(!respuesta.ok){

                toast(
                    datos.mensaje ||
                    "No se pudo crear el pedido."
                );

                return;

            }


            /*
                El pedido fue guardado
                correctamente en MySQL.
            */

            toast(
                "Pedido #" +
                datos.id_pedido +
                " creado correctamente."
            );


            /*
                Limpiamos el carrito después
                de crear exitosamente el pedido.
            */

            localStorage.removeItem(
                "carritoProductos"
            );

            localStorage.removeItem(
                "carrito"
            );


            actualizarContador();


            setTimeout(() => {

                mostrarCarrito();

                actualizarResumen();

            },1000);


        }catch(error){

            console.error(
                "❌ Error al crear pedido:",
                error
            );

            toast(
                "No se pudo conectar con el servidor."
            );

        }

    });

}


/*=========================================
        CONTADOR
=========================================*/

function actualizarContador(){

    const contador =
        document.getElementById(
            "contadorCarrito"
        );

    if(!contador) return;


    const carrito =
        obtenerCarrito();

    const cantidad =
        carrito.reduce(
            (total, producto) =>
                total + producto.cantidad,
            0
        );

    contador.innerText =
        cantidad;

}


/*=========================================
        FORMATEAR PRECIO
=========================================*/

function formatearPrecio(precio){

    return Number(precio).toLocaleString(
        "es-CO"
    );

}