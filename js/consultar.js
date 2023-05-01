//obtengo los datos almacenados en la url anteriormente creada
let params = new URLSearchParams(location.search);

//obtengo los valores de la url
let nombreProducto = params.get("nombreProducto");
let compraProducto = params.get("precioProducto");
let porcentajeProducto = Number(params.get("porcentajeProducto"));

//realizo la suma para mostrarle al usuario el vlaor aproximado de venta por unidad
let precioProd = Number((Number(compraProducto) * Number(porcentajeProducto)) / 100);
let precioAproxProducto = Number(Number(precioProd) + Number(compraProducto));

//mostrar los datos seleccionados anteriormente
let nombreElemento = document.getElementById("productos-nombre");
nombreElemento.textContent = nombreProducto;

//mostrar los datos seleccionados anteriormente
let precioElemento = document.getElementById("precio-producto");
precioElemento.textContent = precioAproxProducto;

//genero un window.onload para mostrar el loader y llamar a la funcion buscarProductos
window.onload = function() {
    //Obtengo el elemento del loader
    const loader = document.getElementById("preloader");

    //Muestro el loader
    loader.style.display = "block";

    consultarProductos(nombreProducto, loader);
};


//Función para buscar productos con la API de Mercado Libre
function consultarProductos(nombreProducto, loader) {
    //Genero la URL de la consulta con el nombre del producto
    const url = `https://api.mercadolibre.com/sites/MLA/search?q=${nombreProducto}`;

    //Hago la solicitud a la API
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            //Obtengo el array de precios de los productos
            const precios = data.results.map(producto => producto.price);
            
            //Calculo el precio promedio
            const precioPromedio = precios.reduce((acumulador, precio) => acumulador + precio, 0) / precios.length;

            //mostrar los datos seleccionados anteriormente
            let precioElementoPromedio = document.getElementById("precio-promedio");
            precioElementoPromedio.textContent = precioPromedio.toFixed(2);

            //Obtengo la tabla
            let tabla = $("#tabla-productos");
            
            //Destruyo la tabla si ya existia
            if ($.fn.DataTable.isDataTable(tabla)) {
                tabla.DataTable().destroy();
            }

            //Creo una fila de la tabla para cada producto
            let filas = data.results.map(producto => {
                return [
                    producto.title,
                    producto.price ? `$${producto.price}` : 'No disponible',
                    producto.original_price ? `$${producto.original_price}` : 'No disponible',
                    producto.currency_id ? `${producto.currency_id}` : 'No disponible'
                ];
            });

            //Oculto el loader
            loader.style.display = "none";

            //Inicializo la tabla con DataTables
            tabla.DataTable({
                language: {
                    url: "https://cdn.datatables.net/plug-ins/1.11.3/i18n/es_es.json"
                },
                data: filas,
                columns: [
                    { title: "Nombre" },
                    { title: "Precio" },
                    { title: "Precio regular" },
                    { title: "Moneda" }
                ]
            });
        })
        .catch(error => {
            console.error(error);
            //Oculto el loader en caso de error
            loader.style.display = "none";
        });
}
