//Importo la funcion que me da los datos actuales del array
import { obtenerListaProductos } from "./funciones.js";

//obtengo los datos almacenados en la url anteriormente creada
let params = new URLSearchParams(location.search);
let nombreProducto = params.get("nombreProducto");
let stockProducto = params.get("stockProducto");
let porcentajeProducto = params.get("porcentajeProducto");
let precioProducto = params.get("precioProducto");

//realizo la suma para mostrarle al usuario el vlaor aproximado de venta por unidad
let precioProd = Number((Number(precioProducto) * Number(porcentajeProducto)) / 100);

let precioAproxProducto = Number(Number(precioProd) + Number(precioProducto));

//mostrar los datos seleccionados anteriormente
let cantidadTotalElemento = document.getElementById("productos-vender");
cantidadTotalElemento.textContent = nombreProducto;

let stockTotalElemento = document.getElementById("stock-vender");
stockTotalElemento.textContent = stockProducto;

let porcentajeTotalElemento = document.getElementById("porcentaje-vender");
porcentajeTotalElemento.textContent = porcentajeProducto;

let ventaAproxElemento = document.getElementById("ventaaprox-vender");
ventaAproxElemento.textContent = precioAproxProducto;

//Event listener para agregar productos
//Obtenemos el formulario y le agregamos un event listener para escuchar el evento submit
const form = document.getElementById('formulario-vender');
form.addEventListener('submit', (event) => {
    //Prevenimos el comportamiento por defecto del evento submit
    event.preventDefault();

    //Obtenemos los valores de los inputs del formulario
    let cantidad = document.getElementById('cantidad').value;
    let venta = document.getElementById('venta').value;

    //Llamamos a la función addProduct con los valores obtenidos
    venderProducto(cantidad, venta, stockProducto, nombreProducto);
});

//Funcion para actualizar el producto
function venderProducto(cantidad, venta, stockProducto, nombreProducto) {
    //creo un if para validar si hay un campo vacio
    if (cantidad === "" || venta === "") {
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
    if (parseInt(cantidad) > parseInt(stockProducto)) {
        Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'Error',
            text: 'No hay stock suficiente',
            showConfirmButton: false,
            timer: 1500
        })
        return;
    }

    //obtengo en una variable nueva los productos almacenados en el localstorage
    let productos = obtenerListaProductos();

    let nombres = productos.map( producto => producto.nombre);

    //recorro un for del array con los valores del localstorage para encontrar un nombre y reemplazar los datos viejos
    for (let i = 0; i < nombres.length; i++){
        if (nombreProducto === nombres[i]){
                // mueve esta línea de código aquí dentro del if
                productos[i].stock -= cantidad;
                //asigno la ganancia del producto
                let gananciaProducto = cantidad * venta;
                productos[i].ganancia += Number(gananciaProducto);

                //almaceno mi nuevo array en el localstorage
                localStorage.setItem('productosLista', JSON.stringify(productos));

                //mesnaje de que el producto fue vendido
                Swal.fire({
                    icon: 'success',
                    title: 'El producto ha sido vendido con éxito.',
                    text: 'Producto vendido',
                }).then(() => {
                    window.location.href = "./vender.html";
                });
                // agrega una declaración de salida del ciclo
                break;
            }
        } 
}
