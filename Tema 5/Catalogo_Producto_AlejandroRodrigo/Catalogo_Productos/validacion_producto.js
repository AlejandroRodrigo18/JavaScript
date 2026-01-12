// Espera a que el DOM esté cargado
window.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('formProducto');
    form.addEventListener('submit', añadir_Producto);

    function añadir_Producto(event) {
        event.preventDefault(); // evita que el form recargue la página

        // Limpiar mensajes y clases de error
        document.querySelectorAll(".error").forEach(e => e.textContent = "");
        document.querySelectorAll("input, textarea").forEach(e => e.classList.remove("error-input"));

        let valido = true;

        const idProducto = document.getElementById("id_producto").value.trim();
        const nombreProducto = document.getElementById("nombre_producto").value.trim();
        const descripcion = document.getElementById("descripción").value.trim();
        const precio = document.getElementById("precio").value;
        const imagen = document.getElementById("imagen").files[0];

        // Validaciones
        if (idProducto === "") {
            document.getElementById("error_id").textContent = "El ID no puede estar vacío";
            document.getElementById("id_producto").classList.add("error-input");
            valido = false;
        }

        if (nombreProducto === "") {
            document.getElementById("error_nombre").textContent = "El nombre no puede estar vacío";
            document.getElementById("nombre_producto").classList.add("error-input");
            valido = false;
        }

        if (precio === "" || precio <= 0 || isNaN(precio)) {
            document.getElementById("error_precio").textContent = "Precio inválido";
            document.getElementById("precio").classList.add("error-input");
            valido = false;
        }

        if (!imagen) {
            document.getElementById("error_imagen").textContent = "Debes subir una imagen";
            document.getElementById("imagen").classList.add("error-input");
            valido = false;
        }

        if (valido) {
            crearProducto(idProducto, nombreProducto, descripcion, precio, imagen);
            form.reset();
            actualizarContador();
        }
    }

    function crearProducto(id, nombre, descripcion, precio, imagen) {
        
        const catalogo = document.getElementById("catalogo");
        const productoDiv = document.createElement("div");

        productoDiv.classList.add("producto");

        productoDiv.innerHTML = `
            <div class="imagen-container">
                <img src="${URL.createObjectURL(imagen)}" alt="${nombre}" width="150">
                <div class="overlay">${nombre}</div>
            </div>
            <div class="info">
                <p><strong>ID:</strong> ${id}</p>
                <p><strong>Nombre:</strong> ${nombre}</p>
                <p><strong>Precio:</strong> ${precio} €</p>
                <p><strong>Descripción:</strong> ${descripcion}</p>
            </div>
        `;

        catalogo.appendChild(productoDiv);

        const img = productoDiv.querySelector('img');
        const infoDiv = productoDiv.querySelector('.info');

        // Mostrar/Ocultar info al hacer click en la imagen
        img.addEventListener('click', () => {
            infoDiv.classList.toggle('visible');
        });

        // Eliminar producto con clic derecho
        productoDiv.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            if (confirm(`¿Quieres eliminar el producto "${nombre}"?`)) {
                productoDiv.remove();
                actualizarContador();
            }
        });
    }

    function actualizarContador() {
        const catalogo = document.getElementById("catalogo");
        const contador = document.getElementById("contador");
        contador.textContent = catalogo.children.length;
    }

});
