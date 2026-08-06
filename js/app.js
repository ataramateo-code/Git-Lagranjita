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
        BOTONES COMPRAR
=========================================*/

function iniciarBotonesComprar(){

    const botones=document.querySelectorAll(".btn-comprar");

    botones.forEach(btn=>{

        btn.addEventListener("click",()=>{

            toast("Producto agregado al carrito");

            let cantidad=Number(localStorage.getItem("carrito")) || 0;

            cantidad++;

            localStorage.setItem("carrito",cantidad);

            contadorCarrito();

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