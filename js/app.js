/*=========================================
        LA GRANJITA
        app.js
=========================================*/

document.addEventListener("DOMContentLoaded", () => {

    console.log("La Granjita iniciada correctamente.");

    iniciarMenu();

    iniciarBuscador();

    iniciarScroll();

    iniciarBotonArriba();

    iniciarBotonesComprar();

    actualizarAnio();

    contadorCarrito();

    gestionarSesion();

    cargarProductos();

});


/*=========================================
        MENU RESPONSIVE
=========================================*/

function iniciarMenu(){

    const boton = document.querySelector("#menu-btn");
    const menu = document.querySelector("#menu");

    if(!boton || !menu) return;

    boton.addEventListener("click",()=>{

        menu.classList.toggle("hidden");

    });

}
/*=========================================
        SESIÓN DEL USUARIO
=========================================*/

function gestionarSesion(){

    const usuarioGuardado =
        localStorage.getItem("usuarioActivo");

    if(!usuarioGuardado) return;

    try{

        const usuario =
            JSON.parse(usuarioGuardado);

        const menu =
            document.querySelector("#menu");

        if(!menu) return;

        /*
            Buscamos el enlace de inicio de sesión
            para reemplazarlo por la información
            del usuario autenticado.
        */

        const enlaces =
            menu.querySelectorAll("a");

        enlaces.forEach(enlace => {

            if(
                enlace.getAttribute("href") ===
                "login.html"
            ){

                const li = enlace.parentElement;

                li.innerHTML = `
                    <span class="font-semibold">
                        <i class="fa-solid fa-user mr-1"></i>
                        Hola, ${usuario.nombre}
                    </span>

                    <button
                        id="cerrarSesion"
                        class="ml-3 text-yellow-300 hover:text-white">

                        Cerrar sesión

                    </button>
                `;

            }

        });

        const cerrarSesion =
            document.querySelector("#cerrarSesion");

        if(cerrarSesion){

            cerrarSesion.addEventListener(
                "click",
                cerrarSesionUsuario
            );

        }

    }catch(error){

        console.error(
            "❌ Error al recuperar la sesión:",
            error
        );

        localStorage.removeItem(
            "usuarioActivo"
        );

    }

}


/*=========================================
        CERRAR SESIÓN
=========================================*/

function cerrarSesionUsuario(){

    /*
        Eliminamos la información del
        usuario actualmente autenticado.
    */

    localStorage.removeItem(
        "usuarioActivo"
    );

    /*
        Mostramos mensaje antes de regresar
        al inicio.
    */

    toast("Sesión cerrada correctamente.");

    setTimeout(() => {

        window.location.href =
            "index.html";

    },1000);

}


/*=========================================
        BUSCADOR
=========================================*/

function iniciarBuscador(){

    const input = document.querySelector("#buscador");

    if(!input) return;

    input.addEventListener("keyup",(e)=>{

        const texto = e.target.value.toLowerCase();

        const cards = document.querySelectorAll(".card");

        cards.forEach(card=>{

            const nombre = card.innerText.toLowerCase();

            if(nombre.includes(texto)){

                card.style.display="block";

            }else{

                card.style.display="none";

            }

        });

    });

}


/*=========================================
        SCROLL SUAVE
=========================================*/

function iniciarScroll(){

    const enlaces = document.querySelectorAll("a[href^='#']");

    enlaces.forEach(enlace=>{

        enlace.addEventListener("click",(e)=>{

            e.preventDefault();

            const destino=document.querySelector(enlace.getAttribute("href"));

            if(destino){

                destino.scrollIntoView({

                    behavior:"smooth"

                });

            }

        });

    });

}


/*=========================================
        BOTON VOLVER ARRIBA
=========================================*/

function iniciarBotonArriba(){

    const boton=document.createElement("button");

    boton.innerHTML="↑";

    boton.id="btnTop";

    boton.style.position="fixed";
    boton.style.bottom="25px";
    boton.style.right="25px";
    boton.style.width="55px";
    boton.style.height="55px";
    boton.style.borderRadius="50%";
    boton.style.border="none";
    boton.style.background="#1E8529";
    boton.style.color="white";
    boton.style.fontSize="24px";
    boton.style.cursor="pointer";
    boton.style.display="none";
    boton.style.boxShadow="0 5px 15px rgba(0,0,0,.3)";
    boton.style.zIndex="999";

    document.body.appendChild(boton);

    window.addEventListener("scroll",()=>{

        if(window.scrollY>350){

            boton.style.display="block";

        }else{

            boton.style.display="none";

        }

    });

    boton.onclick=()=>{

        window.scrollTo({

            top:0,

            behavior:"smooth"

        });

    }

}


/*=========================================
        TOAST
=========================================*/

function toast(mensaje){

    const div=document.createElement("div");

    div.innerText=mensaje;

    div.style.position="fixed";
    div.style.top="30px";
    div.style.right="30px";
    div.style.background="#1E8529";
    div.style.color="white";
    div.style.padding="18px";
    div.style.borderRadius="10px";
    div.style.boxShadow="0 10px 25px rgba(0,0,0,.2)";
    div.style.zIndex="9999";

    document.body.appendChild(div);

    setTimeout(()=>{

        div.remove();

    },2500);

}


/*=========================================
        AGREGAR PRODUCTOS AL CARRITO
=========================================*/

function iniciarBotonesComprar(){

    const botones =
        document.querySelectorAll(".btn-comprar");


    botones.forEach(btn => {

        btn.addEventListener("click", () => {

            // Obtener información del producto
            const producto = {

                id_producto:
                    Number(btn.dataset.id),

                nombre:
                    btn.dataset.nombre,

                descripcion:
                    btn.dataset.descripcion,

                tipo:
                    btn.dataset.tipo,

                precio:
                    Number(btn.dataset.precio),

                cantidad: 1

            };


            // Obtener carrito existente
            let carrito =
                JSON.parse(
                    localStorage.getItem(
                        "carritoProductos"
                    )
                ) || [];


            // Buscar si el producto ya existe
            const productoExistente =
                carrito.find(
                    item =>
                        Number(item.id_producto) ===
                        producto.id_producto
                );


            if(productoExistente){

                productoExistente.cantidad++;

            }else{

                carrito.push(producto);

            }


            // Guardar carrito
            localStorage.setItem(
                "carritoProductos",
                JSON.stringify(carrito)
            );


            // Mantener contador anterior
            let cantidadCarrito =
                Number(
                    localStorage.getItem(
                        "carrito"
                    )
                ) || 0;

            cantidadCarrito++;

            localStorage.setItem(
                "carrito",
                cantidadCarrito
            );


            // Actualizar contador
            contadorCarrito();


            // Mostrar mensaje
            toast(
                producto.nombre +
                " agregado al carrito."
            );


            console.log(
                "🛒 Producto agregado:",
                producto
            );

        });

    });

}

/*=========================================
        CONTADOR CARRITO
=========================================*/

function contadorCarrito(){

    const contador=document.querySelector("#contadorCarrito");

    if(!contador) return;

    let cantidad=Number(localStorage.getItem("carrito")) || 0;

    contador.innerText=cantidad;

}


/*=========================================
        AÑO FOOTER
=========================================*/

function actualizarAnio(){

    const anio=document.querySelector("#anio");

    if(anio){

        anio.innerHTML=new Date().getFullYear();

    }

}


/*=========================================
        ANIMACIONES
=========================================*/

const elementos=document.querySelectorAll(".fade");

const observer=new IntersectionObserver((entradas)=>{

    entradas.forEach((entrada)=>{

        if(entrada.isIntersecting){

            entrada.target.classList.add("mostrar");

        }

    });

});

elementos.forEach((elemento)=>{

    observer.observe(elemento);

});


/*=========================================
        HEADER STICKY
=========================================*/

window.addEventListener("scroll",()=>{

    const header=document.querySelector("header");

    if(!header) return;

    if(window.scrollY>80){

        header.style.boxShadow="0 5px 20px rgba(0,0,0,.15)";

    }else{

        header.style.boxShadow="none";

    }

});


/*=========================================
        PRELOADER (opcional)
=========================================*/

window.onload=()=>{

    const loader=document.querySelector("#loader");

    if(loader){

        loader.style.display="none";

    }

};

/*=========================================
        CARGAR PRODUCTOS DESDE MYSQL
=========================================*/

async function cargarProductos(){

    const contenedor =
        document.querySelector(".productos");

    if(!contenedor) return;

    try{

        const respuesta = await fetch(
            "http://localhost:3000/productos"
        );

        if(!respuesta.ok){

            throw new Error(
                "No se pudieron consultar los productos."
            );

        }

        const productos =
            await respuesta.json();

        /*
            Limpiamos los productos escritos
            directamente en HTML.
        */

        contenedor.innerHTML = "";

        /*
            Generamos las tarjetas utilizando
            la información proveniente de MySQL.
        */

        productos.forEach(producto => {

            const tarjeta =
                document.createElement("div");

            tarjeta.className =
                "card bg-white rounded-xl shadow-lg overflow-hidden fade";

            tarjeta.innerHTML = `

                <div class="p-6">

                    <div class="flex justify-between items-start">

                        <h3 class="text-2xl font-bold">

                            ${producto.nombre}

                        </h3>

                        <span class="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">

                            ${producto.tipo}

                        </span>

                    </div>

                    <p class="text-gray-600 mt-2">

                        ${producto.descripcion}

                    </p>

                    <p class="text-green-700 text-3xl font-bold mt-4">

                        $${formatearPrecio(producto.precio)}

                    </p>

                    <p class="text-gray-500 mt-2">

                        Stock disponible:
                        ${producto.stock}

                    </p>

                    <button
    class="btn-comprar bg-green-700 text-white w-full py-3 rounded mt-5"
    data-id="${producto.id_producto}"
    data-nombre="${producto.nombre}"
    data-descripcion="${producto.descripcion || ""}"
    data-tipo="${producto.tipo}"
    data-precio="${producto.precio}"
    data-stock="${producto.stock}">
    Agregar al carrito
</button>

                </div>

            `;

            contenedor.appendChild(tarjeta);

        });

        /*
            Los botones son creados después de cargar
            los productos, por eso debemos iniciar
            nuevamente su funcionamiento.
        */

        iniciarBotonesComprar();

        console.log(
            "✅ Productos cargados desde MySQL."
        );

    }catch(error){

        console.error(
            "❌ Error al cargar productos:",
            error
        );

        toast(
            "No se pudieron cargar los productos."
        );

    }

}


/*=========================================
        FORMATEAR PRECIO
=========================================*/

function formatearPrecio(precio){

    return Number(precio).toLocaleString(
        "es-CO"
    );

}