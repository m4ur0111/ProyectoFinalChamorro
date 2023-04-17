//Importo la funcion que me da los datos actuales del array
import { calcularGanancias } from "./funciones.js";

////////// Llamo a la funcion calcularGanancias() que muestra los textos en la pagina de gastos cuando cargue //////////
window.addEventListener('load', function() {
    //llamo a mi función
    calcularGanancias();
});
