/*=====================================
        LA GRANJITA
        productos.js
======================================*/

document.addEventListener("DOMContentLoaded", () => {

    iniciarBusqueda();
    iniciarCategorias();
    iniciarFavoritos();
    iniciarCarrito();
    cargarContador();

});

/*=====================================
        BUSCADOR
======================================*/

function iniciarBusqueda(){

    const buscador=document.getElementById("buscador");

    if(!buscador) return;

    buscador.addEventListener("keyup",function(){

        let texto=this.value.toLowerCase();

        let productos=document.querySelectorAll(".card");

        productos.forEach(producto=>{

            let nombre=producto.innerText.toLowerCase();

            if(nombre.includes(texto)){

                producto.style.display="block";

            }else{

                producto.style.display="none";

            }

        });

    });

}

/*=====================================
        CATEGORÍAS
======================================*/

function iniciarCategorias(){

    const botones=document.querySelectorAll("[data-categoria]");

    if(botones.length===0) return;

    botones.forEach(boton=>{

        boton.addEventListener("click",()=>{

            let categoria=boton.dataset.categoria;

            let productos=document.querySelectorAll(".card");

            productos.forEach(card=>{

                if(categoria==="todos"){

                    card.style.display="block";
                    return;

                }

                if(card.dataset.categoria===categoria){

                    card.style.display="block";

                }else{

                    card.style.display="none";

                }

            });

        });

    });

}

/*=====================================
        FAVORITOS
======================================*/

function iniciarFavoritos(){

    const favoritos=document.querySelectorAll(".favorito");

    favoritos.forEach(icono=>{

        icono.addEventListener("click",()=>{

            icono.classList.toggle("text-red-600");
            icono.classList.toggle("text-gray-400");

            mostrarToast("Producto agregado a favoritos ❤️");

        });

    });

}

/*=====================================
        CARRITO
======================================*/

function iniciarCarrito(){

    const botones=document.querySelectorAll(".btn-comprar");

    botones.forEach(boton=>{

        boton.addEventListener("click",()=>{

            let cantidad=localStorage.getItem("carrito");

            cantidad=cantidad?parseInt(cantidad):0;

            cantidad++;

            localStorage.setItem("carrito",cantidad);

            cargarContador();

            mostrarToast("Producto agregado al carrito");

        });

    });

}

/*=====================================
        CONTADOR
======================================*/

function cargarContador(){

    let contador=document.getElementById("contadorCarrito");

    if(!contador) return;

    let cantidad=localStorage.getItem("carrito");

    cantidad=cantidad?cantidad:0;

    contador.innerHTML=cantidad;

}

/*=====================================
        TOAST
======================================*/

function mostrarToast(texto){

    let toast=document.createElement("div");

    toast.innerHTML=texto;

    toast.style.position="fixed";
    toast.style.top="20px";
    toast.style.right="20px";
    toast.style.background="#1E8529";
    toast.style.color="white";
    toast.style.padding="15px 25px";
    toast.style.borderRadius="10px";
    toast.style.boxShadow="0 10px 20px rgba(0,0,0,.2)";
    toast.style.zIndex="9999";

    document.body.appendChild(toast);

    setTimeout(()=>{

        toast.remove();

    },2500);

}

/*=====================================
        PAGINACIÓN
======================================*/

const paginas=document.querySelectorAll(".pagina");

paginas.forEach(pagina=>{

    pagina.addEventListener("click",()=>{

        mostrarToast("Función disponible en la siguiente versión.");

    });

});