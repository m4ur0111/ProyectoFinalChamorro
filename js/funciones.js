////////// Funcion para guardar en LocalStorage //////////
export function almacenarLocalStorage(listaProducto){
    //almaceno la lista en el localstorage
    localStorage.setItem('productosLista', JSON.stringify(listaProducto));
}

////////// Funcion para agregar productos ////////// 
export function agregarProducto(nombre, stock, precio, porcentaje){
    //obtengo la lista actualizada del localstorage
    let productos = obtenerListaProductos();

    //verifico si alguno de los campos esta vacio
    if (nombre === "" || stock === "" || precio === "" || porcentaje === "") {
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

    // Recorremos el array para verificar si el nombre ya existe
    for (let i = 0; i < productos.length; i++) {
        if (productos[i].nombre === nombre) {
            Swal.fire({
                icon: 'warning',
                title: 'Error',
                text: 'Este producto ya fue ingresado',
            })
            return; // Terminamos la secuencia de ingreso de datos
        }
    }

    //genero un constructor para ese nuevo producto
    let nuevoProducto = { nombre: nombre, stock: stock, precio: precio, porcentaje: porcentaje };
    //le hago un push al array
    productos.push(nuevoProducto);
    //almaceno esa nueva secuencia al localstorage
    almacenarLocalStorage(productos);

    Swal.fire({
        icon: 'success',
        title: 'El producto fue agregado exitosamente',
        text: 'Producto agregado',
    })

    //Limpiamos los valores de los inputs del formulario
    document.getElementById('nombre').value = '';
    document.getElementById('stock').value = '';
    document.getElementById('precio').value = '';
    document.getElementById('porcentaje').value = '';
}

////////// Funcion para pedir los datos del localstorage ////////// 
export function obtenerListaProductos(){
    //guardo el array del localstorage en una variable nueva
    let productosLista = localStorage.getItem('productosLista');
    
    //si tiene datos devuelvo la lista convertida y sino genero una lista vacia
    if (productosLista) {
        return JSON.parse(productosLista);
    }else {
        return [];
    }
}

////////// Calcular precio total de todos los productos y la cantidad de productos de la pagina index ////////// 
export function calcularStockTotal(){
    let stockTotal = 0;
    let cantidadProductos = 0;

    let productos = obtenerListaProductos();

    //recorro todo el array incrementando una variable con la cantidad total de productos que contenga mi array
    for (let i = 0; i < productos.length; i++) {
        stockTotal += Number(productos[i].stock);
        cantidadProductos++;
    }

    //asigno los datos almacenados anteriormente para mostrarlos en el html
    let cantidadTotalElemento = document.getElementById("productos-total");
    cantidadTotalElemento.textContent = `${cantidadProductos}`;

    let stockTotalElemento = document.getElementById("stock-total");
    stockTotalElemento.textContent = `${stockTotal}`;
}

////////// Funcion que genera los datos necesarios para saber el total gastado y ganancia esperada de la pagina de total-gastado ////////// 
export function calcularGanancias(){

    let productos = obtenerListaProductos();

    let gananciasTotalesProductos = 0;
    let gastoTotalesProductos = 0;
    let gananciaReal = 0;

    let tbody = document.querySelector('tbody');

    //recorro el for para almacenar los datos y crear elementos de tipo tabla
    for (let i = 0; i < productos.length; i++) {
        let fila = document.createElement('tr');
        let celdaNombre = document.createElement('td');
        let celdaGanancia = document.createElement('td');

        //recorro el array haciendo los calculos correspondientes para mostrar todas las ganancias esperadas por cada producto
            let precioTotal = productos[i].stock * productos[i].precio;
            let gananciaProducto = ((precioTotal * productos[i].porcentaje) / 100) + precioTotal;

            console.log(precioTotal);
            //sumo las ganancias de cada producto para tener una cuenta general
            gastoTotalesProductos += precioTotal;
            gananciasTotalesProductos += gananciaProducto;
            gananciaReal = gananciasTotalesProductos - gastoTotalesProductos;
            console.log(gastoTotalesProductos);

        //almaceno cada valor a su variable 
        celdaNombre.textContent = productos[i].nombre;
        celdaGanancia.textContent = gananciaProducto;
        

        //se genera la fila con el producto correspondiente
        fila.appendChild(celdaNombre);
        fila.appendChild(celdaGanancia);
        tbody.appendChild(fila);
    
    
        //asigno los datos almacenados anteriormente para mostrarlos en el html
        let cantidadTotalElemento = document.getElementById("ganancia-total");
        cantidadTotalElemento.textContent = `${gananciasTotalesProductos} $`;

        //asigno los datos almacenados anteriormente para mostrarlos en el html
        let gastoTotalElemento = document.getElementById("gasto-total");
        gastoTotalElemento.textContent = `${gastoTotalesProductos} $`;

        //asigno los datos almacenados anteriormente para mostrarlos en el html
        let gananciaRealElemento = document.getElementById("ganancia-real");
        gananciaRealElemento.textContent = `${gananciaReal} $`;
    }
}

////////// Funcion para eliminar productos del localStorage ////////// 
export function eliminarProducto(){ 
    //almaceno el array del localstorage en una variable
    let listaProductos = obtenerListaProductos();

    //genero un contenedor para los botones
    let contenedor = document.getElementById("botones");

    //utilizo un ciclo for para generar la cantidad de botones segun los productos que tenga con sus respectivos nombres
    for (let i = 0; i < listaProductos.length; i++) {
        let boton = document.createElement("button");
        boton.innerHTML = listaProductos[i].nombre;
        boton.classList.add("boton-producto"); // Asignar la clase CSS "boton-producto"

        boton.addEventListener("click", function() {
            // Redirigir al usuario a la página "producto.html" con el parámetro "id" correspondiente
            producto = listaProductos[i];

            Swal.fire({
                title: 'Estas seguro?',
                text: "No podras revertir esta acción!",
                icon: 'warning',
                showCancelButton: true,
                cancelButtonText : "Cancelar",
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Eliminar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        Swal.fire(
                            'Eliminado!',
                            'El producto fue borrado con exito.',
                            'success'
                        ).then(() => {
                        listaProductos.splice(i, 1);
                        //almaceno mi nuevo array en el localstorage
                        localStorage.setItem('productosLista', JSON.stringify(listaProductos));
                        window.location.href = "../html/eliminar.html";
                        console.log(listaProductos[i]);
                        });
                    }
                })        
            });
        contenedor.appendChild(boton);
    }
}

////////// Funcion para mostrar los productos del localStorage en una tabla ////////// 
export function mostrarProductosTabla(){
    //almaceno mi array guardado en el localstorage
    let productos = obtenerListaProductos();

    let tbody = document.querySelector('tbody');

    //recorro el for para almacenar los datos y crear elementos de tipo tabla
    for (let producto of productos) {
        let fila = document.createElement('tr');
        let celdaNombre = document.createElement('td');
        let celdaStock = document.createElement('td');
        let celdaPrecio = document.createElement('td');
        let celdaPorcentaje = document.createElement('td');
        let celdaValorStock = document.createElement('td');

        //almaceno cada valor a su variable 
        celdaNombre.textContent = producto.nombre;
        celdaStock.textContent = producto.stock;
        celdaPrecio.textContent = producto.precio;
        celdaPorcentaje.textContent = producto.porcentaje
        celdaValorStock.textContent = celdaValorStock;

        // Establecer el estado del inventario basado en la cantidad de stock
        if (producto.stock >= 10) {
            celdaValorStock.textContent = "OK";
            celdaValorStock.classList.add("stock-ok");
        } else if (producto.stock > 3 && producto.stock < 10) {
            celdaValorStock.textContent = "Bajo";
            celdaValorStock.classList.add("stock-bajo");
        } else {
            celdaValorStock.textContent = "Reponer";
            celdaValorStock.classList.add("stock-reponer");
        }

        //se genera la fila con el producto correspondiente
        fila.appendChild(celdaNombre);
        fila.appendChild(celdaStock);
        fila.appendChild(celdaPrecio);
        fila.appendChild(celdaPorcentaje);
        fila.appendChild(celdaValorStock);
        tbody.appendChild(fila);
    }
}

////////// Dato global que uso para las 2 funciones inferiores ////////// 
let producto;

////////// Funcion que genera la cantidad de botones dependiendo los productos existentes ////////// 
export function generarBotones(){
    //almaceno el array del localstorage en una variable
    let listaProductos = obtenerListaProductos();

    //genero un contenedor para los botones
    let contenedor = document.getElementById("botones");

    //utilizo un ciclo for para generar la cantidad de botones segun los productos que tenga con sus respectivos nombres
    for (let i = 0; i < listaProductos.length; i++) {
        let boton = document.createElement("button");
        boton.innerHTML = listaProductos[i].nombre;
        boton.classList.add("boton-producto"); // Asignar la clase CSS "boton-producto"

        boton.addEventListener("click", function() {
            // Redirigir al usuario a la página "producto.html" con el parámetro "id" correspondiente
            producto = listaProductos[i];

            //llamo a la funcion que rediriga a la pagina para actualizar
            actualizarProducto();
        });
        contenedor.appendChild(boton);
    }
}

////////// Funcion que genera una url personalizada con los datos del producto seleccionado para usar los datos ////////// 
function actualizarProducto(){

    //asignacion de los datos
    let nombreProducto = producto.nombre;
    let stockProducto = producto.stock;
    let porcentajeProducto = producto.porcentaje;
    let precioProducto = producto.precio;


    if (window.location.href.indexOf("/html/actualizar/botones-actualizar.html") != -1) {
        //generacion de la url con los datos necesarios a utilizar
        location.href = `../../html/actualizar/actualizar.html?nombreProducto=${nombreProducto}&stockProducto=${stockProducto}&porcentajeProducto=${porcentajeProducto}`;
    } else if (window.location.href.indexOf("/html/vender/vender.html") != -1) {
        //generacion de la url con los datos necesarios a utilizar
        location.href = `../../html/vender/vender-form.html?nombreProducto=${nombreProducto}&stockProducto=${stockProducto}&porcentajeProducto=${porcentajeProducto}&precioProducto=${precioProducto}`;
    }
}
