//Importo la funcion que me da los datos actuales del array
import { calcularStockTotal } from "./js/funciones.js";

////////// Llamo a la funcion calcularStockTotal() que muestra los textos en la pagina principal cuando cargue ////////// 
window.addEventListener('load', function() {
    //llamo a mi función
    calcularStockTotal();
});