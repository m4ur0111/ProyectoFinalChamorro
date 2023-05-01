////////// Funcion para guardar en LocalStorage //////////
export function almacenarLocalStorage(listaProducto){
    //almaceno la lista en el localstorage
    localStorage.setItem('productosLista', JSON.stringify(listaProducto));
}

////////// Funcion para agregar productos ////////// 
export function agregarProducto(nombre, stock, precio, porcentaje, ganancia){
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

    //Recorro el array para verificar si el nombre ya existe
    for (let i = 0; i < productos.length; i++) {
        if (productos[i].nombre === nombre) {
            Swal.fire({
                icon: 'warning',
                title: 'Error',
                text: 'Este producto ya fue ingresado',
            })
            //Termino el ingreso de de datos en caso de que el nombre exista
            return; 
        }
    }

    //genero un constructor para ese nuevo producto
    let nuevoProducto = { nombre: nombre, stock: stock, precio: precio, porcentaje: porcentaje, ganancia: ganancia };
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

    //obtengo los datos de mi array
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
        let celdaVenta = document.createElement('td');

        //recorro el array haciendo los calculos correspondientes para mostrar todas las ganancias esperadas por cada producto
            let precioTotal = productos[i].stock * productos[i].precio;
            let gananciaProducto = ((precioTotal * productos[i].porcentaje) / 100) + precioTotal;

            //sumo las ganancias de cada producto para tener una cuenta general
            gastoTotalesProductos += precioTotal;
            gananciasTotalesProductos += gananciaProducto;
            gananciaReal = gananciasTotalesProductos - gastoTotalesProductos;

        //almaceno cada valor a su variable 
        celdaNombre.textContent = productos[i].nombre;
        celdaGanancia.textContent = gananciaProducto;
        celdaVenta.textContent = productos[i].ganancia;
        

        //se genera la fila con el producto correspondiente
        fila.appendChild(celdaNombre);
        fila.appendChild(celdaGanancia);
        fila.appendChild(celdaVenta);
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

    //inicializo las variables necesarias para mostrar en los graficos
    let etiquetas = [];
    let datos = [];
    let ventasProducto = [];

    for (let i = 0; i < productos.length; i++) {
        //Agrego el nombre del producto como etiqueta en el array de etiquetas
        etiquetas.push(productos[i].nombre);

        //Calculo la ganancia del producto y  lo agrego el resultado en el array de datos
        let precioTotal = productos[i].stock * productos[i].precio;
        let gananciaProducto = ((precioTotal * productos[i].porcentaje) / 100) + precioTotal;
        datos.push(gananciaProducto);

        ventasProducto.push(productos[i].ganancia)
}

//Consigo el elemento canvas del HTML y creo el objeto chart con los datos correspondientes
    let ctx = document.getElementById('grafico-ganancias').getContext('2d');
    //Defino las variables y opciones de la tabla 
    let chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: etiquetas,
            datasets: [{
            label: 'Ganancias por producto',
            data: datos,
            borderColor: 'rgb(75, 192, 192)',
            borderRadius: 15,
            borderWidth: 2,
            fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
        }
    });

    let ventas = document.getElementById('grafico-ventas').getContext('2d');

    //Defino las variables y opciones de la tabla 
    let tablaVentas = new Chart(ventas, {
        type: 'bar',
        data: {
            labels: etiquetas,
            datasets: [{
            label: 'Ganancias por ventas',
            data: ventasProducto,
            borderColor: 'rgb(220, 180, 200)',
            borderRadius: 15,
            borderWidth: 2,
            fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
        }
    });
}

////////// Funcion para eliminar productos del localStorage ////////// 
export function eliminarProducto(producto){ 
    //almaceno el array del localstorage en una variable
    let listaProductos = obtenerListaProductos();
    let indice = listaProductos.findIndex(p => p.nombre === producto.nombre);
    //muestro una alerta que indique si desea eliminar el producto
    Swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás revertir esta acción.",
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText : "Cancelar",
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Eliminar'
    }).then((result) => {
        if (result.isConfirmed) {
            listaProductos.splice(indice, 1);
            localStorage.setItem('productosLista', JSON.stringify(listaProductos));
            Swal.fire(
                'Eliminado!',
                'El producto ha sido eliminado con éxito.',
                'success'
            ).then(() => {
                window.location.href = "../html/eliminar.html";
            });
        }
    });
}

////////// Funcion para mostrar los productos del localStorage en una tabla //////////
export function mostrarProductosTabla() {
//almaceno mi array guardado en el localstorage
let productos = obtenerListaProductos();

let tbody = document.querySelector('tbody');
let productoSeleccionado;

//recorro el for para almacenar los datos y crear elementos de tipo tabla
for (let producto of productos) {
    let fila = document.createElement('tr');
    let celdaNombre = document.createElement('td');
    let celdaStock = document.createElement('td');
    let celdaPrecio = document.createElement('td');
    let celdaPorcentaje = document.createElement('td');
    let celdaVentas = document.createElement('td');
    let celdaValorStock = document.createElement('td');
    let celdaIconoComparar = document.createElement('td');

    //almaceno cada valor a su variable
    celdaNombre.textContent = producto.nombre;
    celdaStock.textContent = producto.stock;
    celdaPrecio.textContent = producto.precio;
    celdaPorcentaje.textContent = producto.porcentaje;
    celdaVentas.textContent = producto.ganancia;

    //creo una clase para mostrar el icono que me permita editar el producto que contenga menos de 3 existencias
    let icono = document.createElement("i");
    icono.classList.add("far", "fa-pen-to-square");
    icono.setAttribute("id", "boton-reponer");

    //creo una clase para mostrar el icono para comparar los productos con Mercado Libre
    let iconoComparar = document.createElement("i");
    iconoComparar.classList.add("fa-regular", "fa-money-bill-1");
    iconoComparar.setAttribute("id", "boton-comparar");

    //verifico cuanta cantidad de productos tiene cada elemento y en base a eso muestro un mensaje personalizado
    if (producto.stock >= 10) {
        celdaValorStock.innerHTML = "OK";
        celdaValorStock.classList.add("stock-ok");
    } else if (producto.stock > 3 && producto.stock < 10) {
        celdaValorStock.innerHTML = "Bajo";
        celdaValorStock.classList.add("stock-bajo");
    } else {
        let texto = document.createElement("span");
        texto.textContent = "Reponer";
        celdaValorStock.classList.add("stock-reponer");
        celdaValorStock.appendChild(texto);
        celdaValorStock.appendChild(icono);
        productoSeleccionado = producto;
        //Abro el modale para editar el producto
        icono.addEventListener("click", abrirModal);
    }

    //Guardo el icono con el valor del producto
    celdaIconoComparar.appendChild(iconoComparar);

    //Genero un eventListener para redigir a comparar
    iconoComparar.addEventListener("click", function() {
        generarUrlProductos(producto);
    });


    //se genera la fila con el producto correspondiente
    fila.appendChild(celdaNombre);
    fila.appendChild(celdaStock);
    fila.appendChild(celdaPrecio);
    fila.appendChild(celdaPorcentaje);
    fila.appendChild(celdaVentas);
    fila.appendChild(celdaValorStock);
    fila.appendChild(celdaIconoComparar);
    tbody.appendChild(fila);
    }

    let inputBusqueda = document.querySelector("#busqueda");
    let mensajeBusqueda = document.querySelector("#mensaje-busqueda"); // agregado
    inputBusqueda.addEventListener("keyup", function() {
        let valorBusqueda = inputBusqueda.value.toUpperCase();
        let filasTabla = tbody.getElementsByTagName("tr");
        let encontrados = 0; // agregado
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
            if (coincide) {
            filasTabla[i].classList.remove("hidden");
            encontrados++; // agregado
            } else {
            filasTabla[i].classList.add("hidden");
            }
        }
        if (encontrados === 0) { // agregado
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
    

    //Funcion que abre una ventana para poder editar el producto
    function abrirModal(producto) {
        //genero una alerta que contiene los elementos seleccionados
        Swal.fire({
            title: 'Actualizar producto',
            html:
                `<label for="nombre">Nombre</label><input id="nombre" type="text" class="swal2-input" value="${productoSeleccionado.nombre}" readonly>` +
                `<label for="stock">Stock</label><input id="stock" type="number" class="swal2-input" value="${productoSeleccionado.stock}" required>` +
                `<label for="porcentaje">Porcentaje</label><input id="porcentaje" type="number" class="swal2-input" value="${productoSeleccionado.porcentaje}" required>`,
            focusConfirm: false,
            preConfirm: () => {
                const nombre = Swal.getPopup().querySelector('#nombre').value;
                const stock = Swal.getPopup().querySelector('#stock').value;
                const porcentaje = Swal.getPopup().querySelector('#porcentaje').value;
                if (!stock || !porcentaje) {
                    Swal.showValidationMessage('Por favor, complete todos los campos');
                }   
                return { nombre, stock, porcentaje };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const productos = obtenerListaProductos();
                const indice = productos.findIndex((p) => p.nombre === productoSeleccionado.nombre);
                if (indice > -1) {
                    //cargo los nuevos datos del producto
                    productos[indice].stock = result.value.stock;
                    productos[indice].porcentaje = result.value.porcentaje;
                    //lo almaceno en el localstorage y muestro un mensaje de exito
                    localStorage.setItem('productosLista', JSON.stringify(productos));
                    Swal.fire({
                        title: 'El producto ha sido actualizado con éxito.',
                        text: 'Producto actualizado',
                        icon: 'success',
                        timer: 2000,
                        showConfirmButton: false
                    }).then(() => {
                        setTimeout(() => {
                        window.location.href = "./mostrar-productos.html";
                        }, 50);
                    });
                }else {
                    Swal.fire({
                        title: 'Error al actualizar el producto',
                        text: 'No se encontró el producto en la lista',
                        icon: 'error'
                    });
                }
            }
        });
    }
}

////////// Funcion que genera una url personalizada con los datos del producto seleccionado para usar los datos ////////// 
export function generarUrlProductos(productoSeleccionado){

    //asignacion de los datos
    let nombreProducto = productoSeleccionado.nombre;
    let stockProducto = productoSeleccionado.stock;
    let porcentajeProducto = productoSeleccionado.porcentaje;
    let precioProducto = productoSeleccionado.precio;


    if (window.location.href.indexOf("/html/actualizar/tabla-actualizar.html") != -1) {
        //generacion de la url con los datos necesarios a utilizar
        location.href = `../../html/actualizar/actualizar.html?nombreProducto=${nombreProducto}&stockProducto=${stockProducto}&porcentajeProducto=${porcentajeProducto}&precioCompra=${precioProducto}`;
    } else if (window.location.href.indexOf("/html/vender/vender.html") != -1) {
        //generacion de la url con los datos necesarios a utilizar
        location.href = `../../html/vender/vender-form.html?nombreProducto=${nombreProducto}&stockProducto=${stockProducto}&porcentajeProducto=${porcentajeProducto}&precioProducto=${precioProducto}`;
    }else if (window.location.href.indexOf("/html/mostrar-productos.html") != -1){
        //generacion de la url con los datos necesarios a utilizar
        location.href = `../../html/consultar.html?nombreProducto=${nombreProducto}&precioProducto=${precioProducto}&porcentajeProducto=${porcentajeProducto}`;
    }
}

// ////////// Funcion para cargar el excel y guardarlo en el localstorage ////////// 
// Funcion para cargar el excel al localstorage
export function agregarProductosExcel(event) {
    const files = event.target.files;
    const reader = new FileReader();

    reader.onload = function(e) {
        const data = e.target.result;
        procesamientodelArchivo(data);
    };

    reader.readAsArrayBuffer(files[0]);
}

function procesamientodelArchivo(data) {
    const workbook = XLSX.read(data, { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_row_object_array(sheet);

    //Creo la instancia necesaria de Notyf
    const notyf = new Notyf();  

    //Obtengo los productos del array para compararlos
    const productos = JSON.parse(localStorage.getItem('productosLista')) || [];

    let cantidadGuardada = 0;
    let productosDuplicados = 0;

    //Recorro todo el archivo y almacenandolos
    rows.forEach((row) => {
        const index = productos.findIndex((p) => p.nombre === row.nombre);
        if (index === -1) { // El producto no existe en el array
            const producto = {
                nombre: row.nombre,
                stock: Number(row.stock),
                precio: Number(row.precio),
                porcentaje: Number(row.porcentaje),
                ganancia: Number(row.ganancia),
            };
            productos.push(producto);
            cantidadGuardada++;
        } else { // El producto ya existe en el array
            productosDuplicados++;
        }
    });

    //Verifico la cantidad de productos duplicados y lo informo
    if(productosDuplicados > 0){
        const mensajeDuplicado = `${productosDuplicados} productos duplicados no se almacenaron.`;
        notyf.open({
            type: 'error',
            message: mensajeDuplicado,
            duration: 2500,
        });
    }

    //Informo la cantidad de productos almacenados
    if (cantidadGuardada > 0) {
        notyf.success(`Se guardaron ${cantidadGuardada} productos.`, {
            type: "success",
            duration: 2500,
        });
    }

    //Almaceno los productos que se guardaron en el LocalStorage
    localStorage.setItem('productosLista', JSON.stringify(productos));
}
