import {agregarProducto} from "./funciones.js";
import { agregarProductosExcel } from "./funciones.js";

//Event listener para agregar productos
//Obtengo el formulario y le agrego un event listener para escuchar el evento submit
const form = document.getElementById('formulario-productos');
form.addEventListener('submit', (event) => {
    //Prevengo el comportamiento por defecto del evento submit
    event.preventDefault();

    //Obtengo los valores de los inputs del formulario
    let nombre = document.getElementById('nombre').value;
    let stock = document.getElementById('stock').value;
    let precio = document.getElementById('precio').value;
    let porcentaje = document.getElementById('porcentaje').value;
    let ganancia = 0;

    //Llamo a la función addProduct con los valores obtenidos
    agregarProducto(nombre, stock, precio, porcentaje, ganancia);
});

// EventListener al input para ejecutar la funcion
document.getElementById('subir-excel').addEventListener('change', agregarProductosExcel, false);
