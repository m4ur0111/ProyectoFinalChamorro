//importo la funcion para obtener el array actualizado del localstorage
import { obtenerListaProductos } from "./funciones.js";

//obtengo los datos almacenados en la url anteriormente creada
let params = new URLSearchParams(location.search);
let nombreProducto = params.get("nombreProducto");
let stockProducto = params.get("stockProducto");
let porcentajeProducto = params.get("porcentajeProducto");

//mostrar los datos seleccionados anteriormente
let cantidadTotalElemento = document.getElementById("productos-actualizar");
cantidadTotalElemento.textContent = nombreProducto;

let stockTotalElemento = document.getElementById("stock-actualizar");
stockTotalElemento.textContent = stockProducto;

let porcentajeTotalElemento = document.getElementById("porcentaje-actualizar");
porcentajeTotalElemento.textContent = porcentajeProducto;

//Funcion para actualizar el producto
function actualizarProducto(stock, porcentaje, productoNombre) {
    //creo un if para validar si hay un campo vacio
    if (stock === "" || porcentaje === "") {
        Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'Error',
            text: 'Alguno de los campos esta vacio',
            showConfirmButton: false,
            timer: 1500
        })
        return;
    }

    //obtengo en una variable nueva los productos almacenados en el localstorage
    let productos = obtenerListaProductos();

    //realizo un map en el array para obtener unicamente los nombres de mi array
    let nombres = productos.map( producto => producto.nombre);

    //recorro un for del array con los valores del localstorage para encontrar un nombre y reemplazar los datos viejos
    for (let i = 0; i < nombres.length; i++) {
        if (productoNombre === nombres[i]) {
            //asigno los nuevos valores a mi array
            productos[i].porcentaje = porcentaje;
            productos[i].stock = stock;
        }
    }

    //almaceno mi nuevo array en el localstorage
    localStorage.setItem('productosLista', JSON.stringify(productos));

    Swal.fire({
        icon: 'success',
        title: 'El producto ha sido actualizado con éxito.',
        text: 'Producto actualizado',
    }).then(() => {
        window.location.href = "./botones-actualizar.html";
    });
}

//Event listener para agregar productos
//Obtenemos el formulario y le agregamos un event listener para escuchar el evento submit
const form = document.getElementById('formulario-actualizar');
form.addEventListener('submit', (event) => {
    //Prevenimos el comportamiento por defecto del evento submit
    event.preventDefault();

    //Obtenemos los valores de los inputs del formulario
    let stock = document.getElementById('stock').value;
    let porcentaje = document.getElementById('porcentaje').value;

    //Llamamos a la función addProduct con los valores obtenidos
    actualizarProducto(stock, porcentaje, nombreProducto);
});