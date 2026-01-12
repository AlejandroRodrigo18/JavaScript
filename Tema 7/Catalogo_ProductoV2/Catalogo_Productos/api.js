
class API {
    constructor() { //codigo en el que se ejecutará la constante api
        this.productos = []; // "Base de datos" simulada
    }

    guardarProducto(producto) {
        return new Promise((resolve, reject) => { //simulacion para guardar los datos en el servidor
            setTimeout(() => { //devuelva la promesa con un delay de 2 segundos

                // Validación: ID duplicado
                //buscamos si hay un producto con el mismo id
                const existe = this.productos.some(p => p.id === producto.id);

                if (existe) {
                    reject("Error: El ID ya existe en la base de datos");
                    return;
                }

                //en caso de no existir, añade el producto al array producto
                this.productos.push(producto);
                //llamamos al resolve para resolver la promesa con un mnesaje de exito
                resolve("Producto guardado");
            }, 2000);
        });
    }
    
        /*---------------------------------------------------------------------------------------------------------------------------------*/

    borrarProducto(id) {

        return new Promise((resolve, reject) => {
            setTimeout(() => {

                // 10% de error simulado
                if (Math.random() < 0.1) {
                    reject("Error al eliminar en el servidor");
                    return;
                }

                //sino falla lo anterior, se invoca este apartado para crear un array vacio sin ID (en caso de ser este el primer ID)
                this.productos = this.productos.filter(p => p.id !== id);
                resolve("Producto eliminado");
            }, 1500);
        });
    }
}
//creamos instancia de la clase
const api = new API();
//expones la instancia para poder importarla a otros ficheros js 
export default api;
