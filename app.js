//Crear el array de objetos vacio para almacenar los datos ingresador por el usuario
let productos = [];

//Funcion para agregar productos
function agregarProducto() {
    let nombre = prompt("Ingrese el nombre del producto:");
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
    //Ingreso de los datos del producto mediante el usuario
    let stock = prompt("Ingrese el stock del producto (unidades):");
    let compra = prompt("Ingrese el valor por el cual compro cada producto:");
    let porcentaje = prompt(`Ingrese el porcentaje de ganancia esperado por los ${stock} productos:`);

    //Verifico si alguno de los campos se ingreso vacio para no ingresar el producto
    if (nombre === '' || compra === '' || stock === '' || porcentaje === "" || nombre === null || compra === null || stock === null || porcentaje === null) {
        Swal.fire({
            icon: 'warning',
            title: 'No agrego ningún producto',
            text: 'Ha cancelado la operación',
        })
    return;
    }

    //Ingreso el nuevo producto al array
    let nuevoProducto = { nombre: nombre, stock: stock, compra: compra, porcentaje: porcentaje };
    productos.push(nuevoProducto);

    Swal.fire({
        icon: 'success',
        title: 'El producto fue agregado exitosamente',
        text: 'Producto agregado',
    })

    //actualizo los datos mostrados en el html
    calcularStockTotal();
}

//Funcion para actualizar productos
function actualizarProducto() {
    //creo un texto vacio para poder personalizar mi alert
    let productosTexto = '';
    for (let i = 0; i < productos.length; i++){
        let producto = productos[i];
        let nombre = producto.nombre;
        let stock = producto.stock;
        productosTexto += `- ${nombre} con ${stock} en stock\n`;
    }

    let nombre = prompt(`Lista de productos:\n${productosTexto}\nIngrese el nombre del producto que desea actualizar::`);
    if (nombre === '') {
        return;
    }

    let productoEncontrado = false;

    //Recorro el array buscando la coincidencia exacta con el valor que ingreso el usuario
    for (let i = 0; i < productos.length; i++) {
        if (productos[i].nombre === nombre) {

            //Ingreso de las nuevas variables
            let nuevoPorcentaje = prompt("Ingrese el nuevo porcentaje de ganancia del producto:");
            let nuevoStock = prompt("Ingrese el nuevo stock del producto:");

            // Validar que los valores ingresados sean números válidos
            if (isNaN(parseInt(nuevoPorcentaje)) || isNaN(parseInt(nuevoStock))) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ingrese valores numéricos válidos',
                });
                return;
            }

            //asignar los nuevos valores a los valores anteriores de ese producto
            productos[i].porcentaje = nuevoPorcentaje;
            productos[i].stock = nuevoStock;

            productoEncontrado = true;
            Swal.fire({
                icon: 'success',
                title: 'El producto ha sido actualizado con éxito.',
                text: 'Producto actualizado',
            })
            calcularStockTotal();
            break;
        }
    }

    if (!productoEncontrado) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se ha encontrado un producto con ese nombre...',
        })
    }
}

//Funcion para eliminar productos
function eliminarProducto() {
    let productosTexto = '';
    for (let i = 0; i < productos.length; i++){
        let producto = productos[i];
        let nombre = producto.nombre;
        productosTexto += `- ${nombre}\n`;
    }

    //verifico que el nombre del producto obtenga algun dato
    if (productosTexto === '') {
        Swal.fire({
            icon: 'warning',
            title: 'No hay productos',
            text: 'Se ha cancelado la operación',
        })
    return;
    }

    //Si el nombre esta vacio termina la secuencia
    let nombre = prompt(`Lista de productos:\n${productosTexto}\nIngrese el nombre del producto que desea eliminar:`);
    if (nombre === '') {
        return;
    }

    let productoEncontrado = false;
    //recorro el array buscando un nombre que coincida con el ingresado
    for (let i = 0; i < productos.length; i++) {
        if (productos[i].nombre === nombre) {
            productos.splice(i, 1);
            productoEncontrado = true;
            Swal.fire({
                icon: 'success',
                title: 'El producto ha sido eliminado con éxito.',
                text: 'Producto eliminado',
            })
            //actualizo los datos mostrados en el html
            calcularStockTotal();
            productosTexto = '';
            for (let j = 0; j < productos.length; j++) {
                let producto = productos[j];
                let nombre = producto.nombre;
                productosTexto += `- ${nombre},\n`;
            }
        break;
        }
    }

    if (!productoEncontrado) {
        Swal.fire({
            icon: 'warning',
            title: 'Error',
            text: 'No se ha encontrado un producto con ese nombre.',
        })
    }
}

//Funcion para mostrar los productos almacenados en el array
function mostrarProductos() {
    let productosTexto = "Lista de productos:\n\n";

    //recorro todo el array mostrando producto por producto con sus valores correspondientes
    for (let i = 0; i < productos.length; i++) {
        let producto = productos[i];
        let nombre = producto.nombre;
        let porcentaje = producto.porcentaje;
        let stock = producto.stock;
        let compra = producto.compra;
        productosTexto += `- ${nombre}, $${compra} Precio Compra, ${stock} Unidades, ${porcentaje}% Ganancias esperadas\n`;
    }

    alert(productosTexto);
}

//Funcion para vender algun producto
function venderProductos() {
        //creo el texto personalizado para el alert
        let productosTexto = '';
        for (let i = 0; i < productos.length; i++){
            let producto = productos[i];
            let nombre = producto.nombre;
            let stock = producto.stock;
            productosTexto += `- ${nombre}: ${stock} unidades\n`;
        }

        if (productosTexto === '' || productosTexto === null) {
            Swal.fire({
                icon: 'warning',
                title: 'No hay productos',
                text: 'Se ha cancelado la operación',
            })
        return;
        }

        //verifico que el nombre ingresado por el usuario sea valido
        let nombre = prompt(`Lista de productos:\n${productosTexto}\nIngrese el nombre del producto que desea vender:`);
        if (nombre === '' || nombre === null) {
            Swal.fire({
                icon: 'warning',
                title: 'No agrego ningún producto',
                text: 'Ha cancelado la operación',
            })
        return;
        }
    
        let productoEncontrado = false;

        //recorro el array buscando el nombre que el usuario ingreso
        for (let i = 0; i < productos.length; i++) {
            if (productos[i].nombre === nombre) {
                let producto = productos[i];
                let stock = producto.stock;

                //verifico que si el stock del nombre del producto que yo ingrese es = 0 no sea posible vender nada
                if (stock === 0) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No puede vender productos sin stock',
                    });
                    return;
                }

                let cantidadVendida = prompt("Ingrese la cantidad de productos que se vendieron: ");

                //verifico que si la cantidad que el usuario quiere vender es mayor a mi stock, no sea posible
                if (cantidadVendida > stock){
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'La cantidad ingresada es mayor a tu stock actual',
                    });
                    return;                    
                }            

                // Validar que los valores ingresados sean números válidos
                if (isNaN(parseInt(cantidadVendida))) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Ingrese valores numéricos válidos',
                    });
                    return;
                }

                //le resta el stock vendido al stock existente del producto
                productos[i].stock -= cantidadVendida;
            }
            
            productoEncontrado = true;
            Swal.fire({
                icon: 'success',
                title: 'El producto se ha vendido con éxito.',
                text: 'Producto vendido',
            })
            calcularStockTotal();
            break;
        }

    if (!productoEncontrado) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se ha encontrado un producto con ese nombre...',
        })
    }
}

//Calcular precio total de todos los productos y la cantidad de productos
function calcularStockTotal() {
    let stockTotal = 0;
    let cantidadProductos = 0;

    //recorro todo el array incrementando una variable con la cantidad total de productos que contenga mi array
    for (let i = 0; i < productos.length; i++) {
        stockTotal += Number(productos[i].stock);
        cantidadProductos++;
    }

    let cantidadTotalElemento = document.getElementById("productos-total");
    cantidadTotalElemento.textContent = `${cantidadProductos}`;

    let stockTotalElemento = document.getElementById("stock-total");
    stockTotalElemento.textContent = `${stockTotal}`;
}

//Funcion para calcular las ganancias por cada producto individualmente
function calcularGanancias() {
    let ganancias = [];
    let nombres = [];
    let gananciasTotalesProductos = 0;

    //recorro el array haciendo los calculos correspondientes para mostrar todas las ganancias esperadas por cada producto
    productos.forEach(producto => {
        let precioTotal = producto.stock * producto.compra;
        let gananciaProducto = (precioTotal * producto.porcentaje) / 100;
        let nombreProducto = producto.nombre;

        //sumo las ganancias de cada producto para tener una cuenta general
        gananciasTotalesProductos += gananciaProducto;

        nombres.push(nombreProducto);
        ganancias.push(gananciaProducto);
    });

    let mensaje = "La ganancia esperada por cada producto es: \n\n";
    for(let i = 0; i < ganancias.length; i++) {
        mensaje += nombres[i] + ": ganancia esperada " + ganancias[i] + " pesos\n";
    }

    mensaje += "\nLa ganancia total esperada entre todos los productos es de: " + gananciasTotalesProductos;

    alert(mensaje);
}

//Funcion para vender productos individualmente


//Event listener para agregar productos
let botonAgregar = document.getElementById("boton-agregar");
botonAgregar.onclick = agregarProducto;

//Event listener para eliminar productos
let botonEliminar = document.getElementById("boton-eliminar");
botonEliminar.onclick = eliminarProducto;

//Event listener para actualizar productos
let botonActualizar = document.getElementById("boton-actualizar");
botonActualizar.onclick = actualizarProducto;

//Event listener para actualizar productos
let botonMostrar = document.getElementById("boton-mostrar");
botonMostrar.onclick = mostrarProductos;

//Event listener para mostrar las ganancias y pagos
let botonGastos = document.getElementById("boton-gastos");
botonGastos.onclick = calcularGanancias;

//Event listener para mostrar las ganancias y pagos
let botonVender = document.getElementById("boton-vender");
botonVender.onclick = venderProductos;
