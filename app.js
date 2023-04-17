import { agregarProducto } from "./js/funciones.js";

//Event listener para agregar productos
//Obtenemos el formulario y le agregamos un event listener para escuchar el evento submit
const form = document.getElementById('formulario-productos');
form.addEventListener('submit', (event) => {
    //Prevenimos el comportamiento por defecto del evento submit
    event.preventDefault();

    //Obtenemos los valores de los inputs del formulario
    let nombre = document.getElementById('nombre').value;
    let stock = document.getElementById('stock').value;
    let precio = document.getElementById('precio').value;
    let porcentaje = document.getElementById('porcentaje').value;

    //Llamamos a la función addProduct con los valores obtenidos
    agregarProducto(nombre, stock, precio, porcentaje);

});

