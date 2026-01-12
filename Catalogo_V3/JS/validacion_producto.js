
// Espera a que cargue el DOM
window.addEventListener("DOMContentLoaded", () => {

    //formulario html
    const form = document.getElementById('formProducto');
    //boton del formulario html
    const btn = form.querySelector("button");

    //boton submit del formulario al que se le llama la funcion añadir_producto para que funcione el añadir un producto
    form.addEventListener("submit", añadir_Producto);

    async function añadir_Producto(event) {
        event.preventDefault();
        limpiarErrores();

        const id = document.getElementById("id_producto").value.trim();
        const nombre = document.getElementById("nombre_producto").value.trim();
        const descripcion = document.getElementById("descripcion").value.trim();
        const precio = document.getElementById("precio").value;
        const imagenFile = document.getElementById("imagen").files[0];

        // Validación rápida (síncrona)
        let valido = true;

        if (id === "") {
            mostrarError("error_id", "El ID no puede estar vacío");
            valido = false;
        }

        if (nombre === "") {
            mostrarError("error_nombre", "El nombre no puede estar vacío");
            valido = false;
        }

        if (precio === "" || precio <= 0) {
            mostrarError("error_precio", "Precio inválido");
            valido = false;
        }

        if (!imagenFile) {
            mostrarError("error_imagen", "Debes subir una imagen");
            valido = false;
        }

        if (!valido) return;

        // Validación asíncrona de imagen
        try {
            //generamos URl temporal de la imagen subida por el usuario
            await validarImagen(URL.createObjectURL(imagenFile)); 
        } catch (e) {
            mostrarError("error_imagen", "La imagen no se puede cargar");
            return;
        }

       // BLOQUEA el botón
            btn.disabled = true;
            btn.textContent = "Guardando...";

            try {
                await guardarProductoBackend({ id, nombre, descripcion, precio });
                crearTarjeta(id, nombre, descripcion, precio, imagenFile);
                form.reset();
                actualizarContador();
                alert("Producto guardado correctamente");

            } catch (e) {
                mostrarError("error_id", e);

            } finally {
                // RESTAURACIÓN VISUAL GARANTIZADA (UX)
                btn.disabled = false;
                btn.textContent = "Añadir Producto";
            }
    }

        /*---------------------------------------------------------------------------------------------------------------------------------*/

   // Crear tarjeta del producto
function crearTarjeta(id, nombre, descripcion, precio, imagen) {
    const catalogo = document.getElementById("catalogo");
    const div = document.createElement("div");
    div.classList.add("producto");

    const imgURL = URL.createObjectURL(imagen);

    div.innerHTML = `
        <div class="imagen-container">
            <img src="${imgURL}" alt="${nombre}">
            <div class="overlay">${nombre}</div>
        </div>
        <div class="info">
            <p><strong>ID:</strong> ${id}</p>
            <p><strong>Nombre:</strong> ${nombre}</p>
            <p><strong>Precio:</strong> ${precio} €</p>
            <p><strong>Descripción:</strong> ${descripcion}</p>
        </div>
    `;

    catalogo.appendChild(div);
    
    // Quitamos el URL solo después de que la imagen cargue
    
    //
    const img = div.querySelector("img");
    
    // liberamos la imagen de manera temporal para liberar memoria
    img.onload = () => URL.revokeObjectURL(imgURL);

    const info = div.querySelector(".info");

    img.addEventListener("click", () => info.classList.toggle("visible"));


    // BORRADO ASINCRÓNICO
    //invocacion con click derecho
    div.addEventListener("contextmenu", async (e) => {
        e.preventDefault(); //desactivamos el menú del navegador para que no se entrometa en la funcion

        if (!confirm(`¿Eliminar producto "${nombre}"?`)) return;

        //la tarjeta se pone semitrasnparenete cuando se da la opcion de confirmar borrado
        div.style.opacity = "0.5";

        try {
            //llamamos a la API para borrar el producto
            await borrarProductoBackend(id);
            div.remove(); //eliminanos la tarjeat del DOM
            actualizarContador(); //hace conteo de cuantos productos hay guardados en el catalogo

        } catch (e) {
            //borrado falla, entonces la opacidad se vuelve a uno
            div.style.opacity = "1";
            //se muestra el mensaje de error de que ha salido mal el proceso
            alert("Error al eliminar en el servidor: " + e);
        }
    });
}

        /*---------------------------------------------------------------------------------------------------------------------------------*/

    function actualizarContador() {
        document.getElementById("contador").textContent =
            document.getElementById("catalogo").children.length;
    }
        /*---------------------------------------------------------------------------------------------------------------------------------*/

    function mostrarError(idSpan, mensaje) {

        //mensaje es el texto de error del html, es id: error_nombre
        document.getElementById(idSpan).textContent = mensaje;
        //remplazamos el error_ por el id del nuestro input del formulario que es nombre_producto
        const input = document.querySelector(`#${idSpan.replace("error_", "")}`);
        //si el input existe, agregamos una clase css que es error-input
        //sirve para resaltar el input de manera visual
        if (input) input.classList.add("error-input");
    }
        /*---------------------------------------------------------------------------------------------------------------------------------*/

    function limpiarErrores() {
        document.querySelectorAll(".error").forEach(e => e.textContent = "");
        document.querySelectorAll("input, textarea").forEach(e => e.classList.remove("error-input"));
    }
        /*---------------------------------------------------------------------------------------------------------------------------------*/

        
    // VALIDAR IMAGEN CON PROMESA
    function validarImagen(url) { //url = imagenFile,
        //creamos promesa asincrona
        return new Promise((resolve, reject) => { 
            //creamos cosntante imagen
            const img = new Image();
            img.onload = resolve; //si imagen carga, la promesa se resuelve 
            img.onerror = reject; //fallo al cargar la imagen por x motivo, entra el catch del formulario
            img.src = url;
        });
    }

 //FUNCIONES NECESARIAS PARA QUE JS RECONOZCA PHP

 //guardamos el producto
    async function guardarProductoBackend(producto) {
        //creamos constante response que guarda un fetch opara llamar a la base de datos
        // le colocamos el action guardar vinculado en el php para ejecute la funcion guardarProducto, (un GET)
        const response = await fetch("/api.php?action=guardar",  {
            method: "POST", //enviamos datos que se van a guardar, a parte de ser leidos
            headers: { "Content-Type": "application/json" }, //le decimos al servidor que el contenido enviadoe es en JSON
            body: JSON.stringify(producto) //el objeto producto lo convertimos a una cadena JSON, para que PHP lo pueda leer correctamente.
        });

        const data = await response.json(); //respueta la convertimos en un objeto JS
        if (!data.success) throw data.error; //si hay un error al guardar, lanaz el mensaje de error
        return data;
    }

    //borrado de producto
    async function borrarProductoBackend(id) {

        //creacion de una cosntante que tiene la funcion borrar del API de php
        const response = await fetch("/api.php?action=borrar", {
            method: "POST", //enviamos datos que se van a guardar, a parte de ser leidos
            headers: { "Content-Type": "application/json" }, //le decimos al servidor que el contenido enviadoe es en JSON
            body: JSON.stringify({ id }) //el id lo convertimos a una cadena JSON, para que PHP lo pueda leer correctamente.
        });
        const data = await response.json(); //respueta la convertimos en un objeto JS
        if (!data.success) throw data.error; //si hay un error al guardar, lanaz el mensaje de error
        return data; //devuelve el mensaje
    }
});
