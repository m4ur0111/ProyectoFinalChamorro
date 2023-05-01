//Importo la funcion que me da los datos actuales del array
import { obtenerListaProductos } from "./funciones.js";

/////////////////////////////////////////////////////
//almaceno mi array guardado en el localstorage
let productos = obtenerListaProductos();

let tbody = document.querySelector('tbody');
let productoSeleccionado;

//recorro el for para almacenar los datos y crear elementos de tipo tabla
for (let producto of productos) {
    let fila = document.createElement('tr');
    let celdaNombre = document.createElement('td');
    let celdaStock = document.createElement('td');
    let celdaPorcentaje = document.createElement('td');
    let celdaIcono = document.createElement('td');

    //almaceno el nombre del producto a su variable
    celdaNombre.textContent = producto.nombre;
    celdaStock.textContent = producto.stock;
    celdaPorcentaje.textContent = producto.porcentaje;

    //creo una clase para mostrar el icono que me permita editar el producto que contenga menos de 3 existencias
    let icono = document.createElement("i");
    icono.classList.add("far", "fa-credit-card");
    icono.classList.add('icono-vender');
    icono.setAttribute("id", "boton-reponer-" + producto.id); // agregar un identificador único para cada icono

    //verifico cuanta cantidad de productos tiene cada elemento y en base a eso muestro un mensaje personalizado

    //Agrego un event listener al icono de edición
    icono.addEventListener("click", function() {
        // Redirigir al usuario a la página "vender-form.html" con los parametros correspondientes
        productoSeleccionado = producto;
        let nombreProducto = productoSeleccionado.nombre;
        let stockProducto = productoSeleccionado.stock;
        let porcentajeProducto = productoSeleccionado.porcentaje;
        let precioProducto = productoSeleccionado.precio;
        location.href = `../../html/vender/vender-form.html?nombreProducto=${nombreProducto}&stockProducto=${stockProducto}&porcentajeProducto=${porcentajeProducto}&precioProducto=${precioProducto}`;
    });

    celdaIcono.appendChild(icono);
    productoSeleccionado = producto;
    //Abro el modal para editar el producto

    //se genera la fila con el producto correspondiente
    fila.appendChild(celdaNombre);
    fila.appendChild(celdaStock);
    fila.appendChild(celdaPorcentaje);
    fila.appendChild(celdaIcono);
    tbody.appendChild(fila);
}

//creo un buscador con el input para filtrar los resultados
let inputBusqueda = document.querySelector("#busqueda");
let mensajeBusqueda = document.querySelector("#mensaje-busqueda");
inputBusqueda.addEventListener("keyup", function() {
    let valorBusqueda = inputBusqueda.value.toUpperCase();
    let filasTabla = tbody.getElementsByTagName("tr");
    let encontrados = 0;
    for (let i = 0; i < filasTabla.length; i++) {
        let celdasFila = filasTabla[i].getElementsByTagName("td");
        let coincide = false;
        for (let j = 0; j < celdasFila.length; j++) {
            let textoCelda = celdasFila[j].textContent.toUpperCase();
            if (textoCelda.indexOf(valorBusqueda) > -1) {
                coincide = true;
                break;
            }
        }
        //si no coincide muestro un texto de error
        if (coincide) {
            filasTabla[i].classList.remove("hidden");
            encontrados++;
        } else {
            filasTabla[i].classList.add("hidden");
        }
    }
    //si la variable encontrado es igual a 0 detecto un error 
    if (encontrados === 0) { 
        mensajeBusqueda.classList.remove("hidden");
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
        })
            Toast.fire({
                icon: 'warning',
                title: 'No se encontraron coincidencias'
            })
        } else {
            mensajeBusqueda.classList.add("hidden");
        }
});