//importo la funcion para obtener el array actualizado del localstorage
import { obtenerListaProductos } from "./funciones.js";
import { generarUrlProductos } from "./funciones.js";

//obtengo los datos almacenados en la url anteriormente creada
let params = new URLSearchParams(location.search);
let nombreProducto = params.get("nombreProducto");
let stockProducto = params.get("stockProducto");
let compraProducto = params.get("precioCompra");
let porcentajeProducto = params.get("porcentajeProducto");

//mostrar los datos seleccionados anteriormente
let cantidadTotalElemento = document.getElementById("productos-actualizar");
cantidadTotalElemento.textContent = nombreProducto;

let stockTotalElemento = document.getElementById("stock-actualizar");
stockTotalElemento.textContent = stockProducto;

let compraTotalElemento = document.getElementById("compra-actualizar");
compraTotalElemento.textContent = compraProducto;

let porcentajeTotalElemento = document.getElementById("porcentaje-actualizar");
porcentajeTotalElemento.textContent = porcentajeProducto;

//Funcion para actualizar el producto
function actualizarProducto(productoNombre, stock, porcentaje, compra) {
    //creo un if para validar si hay un campo vacio
    if (stock === "" || porcentaje === "") {
        mostrarError('Alguno de los campos esta vacio');
        return;
    }

    //obtengo en una variable nueva los productos almacenados en el localstorage
    let productos = obtenerListaProductos();

    //realizo un map en el array para obtener unicamente los nombres de mi array
    // let nombres = productos.map( producto => producto.nombre);

    //recorro un for del array con los valores del localstorage para encontrar un nombre y reemplazar los datos viejos
    for (let producto of productos) {
        if (producto.nombre === productoNombre) {
            //asigno los nuevos valores a mi objeto
            producto.porcentaje = porcentaje;
            producto.stock = stock;
            producto.precio = compra;
        }
    }

    //almaceno mi nuevo array en el localstorage
    localStorage.setItem('productosLista', JSON.stringify(productos));

    //Muestro una alerta de que se realizo correctamente
    Swal.fire({
        icon: 'success',
        title: `El producto ${productoNombre} ha sido actualizado con éxito.`,
        text: 'Producto actualizado',
    }).then(() => {
        window.location.href = "./tabla-actualizar.html";
    });
}

//Event listener para agregar productos
//Obtengo el formulario y le agrego un event listener para escuchar el evento submit
const form = document.getElementById('formulario-actualizar');
form.addEventListener('submit', (event) => {
    //Prevenir el comportamiento por defecto del evento submit
    event.preventDefault();

    //Obtengo los valores de los inputs del formulario
    let [stock, porcentaje, compra] = [
        document.getElementById('stock').value,
        document.getElementById('porcentaje').value,
        document.getElementById('compra').value
    ];

    //Llamo a la función actualizarProductos() con los valores obtenidos
    actualizarProducto(nombreProducto, stock, porcentaje, compra);
});

//Funcion para mostrar mensaje de error
function mostrarError(mensaje) {
    Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Error',
        text: `${mensaje}`,
        showConfirmButton: false,
        timer: 1500
    })
}