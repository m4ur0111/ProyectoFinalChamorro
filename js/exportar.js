//EventListener que llama a la funcion notificacionDescargapdf()
document.addEventListener("DOMContentLoaded", function() {
  const downloadBtn = document.getElementById("descargar-btn-pdf");
  downloadBtn.addEventListener("click", notificacionDescargaPdf);
});

//EventListener que llama a la funcion notificacionDescargaexcel()
document.addEventListener("DOMContentLoaded", function() {
  const downloadBtn = document.getElementById("descargar-btn-excel");
  downloadBtn.addEventListener("click", notificacionDescargarExcel);
});


//Creo la instancia necesaria de Notyf
const notyf = new Notyf();

///////////////// Funcion para mostrar una alerta de descarga en formato pdf /////////////////////////////
async function notificacionDescargaPdf(){
notyf.open({
  type: 'success',
  message: 'La descarga se está ejecutando',
  duration: 2500,
});
//Espero 2.5 segundos y luego ejecuto la otra función
setTimeout(() => {
  descargarListapdf();
}, 2500);
}

///////////////// Funcion para mostrar una alerta de descarga en formato excel /////////////////////////////
async function notificacionDescargarExcel(){
  notyf.open({
    type: 'success',
    message: 'La descarga se está ejecutando',
    duration: 2500,
  });
  //Espero 2.5 segundos y luego ejecuto la otra función
  setTimeout(() => {
    descargarListaexcel();
  }, 2500);
  }

///////////////// Funcion para descargar la tabla en formato pdf /////////////////////////////
function descargarListapdf() {
  try{
    //Obtengo el array del localStorage
    const productos = JSON.parse(localStorage.getItem("productosLista"));

  //Verifico si hay alguna existencia en el localstorage
  if (!productos) {
    notyf.open({
      type: 'error',
      message: 'No se encontraron datos en el localStorage',
      duration: 2500,
    });
    return;
  }

    //Creo un nuevo documento jsPDF
    const doc = new jsPDF();

    //Creo una instancia del objeto Date
    const fechaActual = new Date();
    //Obtengo el día actual
    const dia = fechaActual.getDate();
    //Obtengo el mes actual (le sumo 1 ya que los meses empiezan en 0)
    const mes = fechaActual.getMonth() + 1;
    //Obtengo el año actual
    const anio = fechaActual.getFullYear();
    //Adapto la fecha en formato DD/MM/YYYY
    const fechaFormateada = `${dia.toString().padStart(2, '0')}/${mes.toString().padStart(2, '0')}/${anio}`;

    //Obtengo la hora actual en formato HH:MM
    const horas = fechaActual.getHours().toString().padStart(2, '0');
    const minutos = fechaActual.getMinutes().toString().padStart(2, '0');
    const horaFormateada = `${horas}:${minutos}`;

    //Obtengo el ancho de la fecha y establezco la posición X
    const anchoFecha = doc.getTextWidth(fechaFormateada);
    const margenDerecho = 15; // Puedes ajustar el margen a tu gusto
    const posFechaX = doc.internal.pageSize.width - anchoFecha - margenDerecho;

    //Defino la posición inicial del texto
    let y = 35;
    //Declaro la variable totalGanancias
    let totalGanancias = 0;
    let stockTotal = 0;  

    //Defino el titulo del documento
    const titulo = "Listado de Productos";

    //Obtengo el ancho del titulo y establezco la posición X
    const anchoTitulo = doc.getTextWidth(titulo);
    const posX = (doc.internal.pageSize.width - anchoTitulo) / 2;

    //Aasigno estilos a los textos
    doc.setFont("helvetica");
    doc.setFontSize(20);
    //Muestro el titulo centrado
    doc.text(titulo, posX, 15);
    doc.setFontSize(12);
    // Muestro la fecha a la derecha del título
    doc.text(`Fecha: ${fechaFormateada}`, posFechaX, 15);
    doc.text(`Hora: ${horaFormateada}`, posFechaX, 20);

    //Itero el array y agrego cada elemento como un bloque de texto en el documento
    productos.forEach((element) => {
      doc.setFontSize(11);
      doc.text(`Nombre: ${element.nombre}`, 20, y);
      doc.text(`Stock: ${element.stock}`, 60, y);
      doc.text(`Precio: ${element.precio}`, 90, y);
      doc.text(`Porcentaje: ${element.porcentaje}`, 120, y);
      doc.text(`Ganancia: ${element.ganancia}`, 160, y);
      y += 15;
      
      //Actualizo la variable totalGanancias
      stockTotal += parseInt(element.stock);
      totalGanancias += parseFloat(element.ganancia); 
    });

    doc.setFontSize(14);
    //Muestro el total de las ganancias
    doc.text(`Total de ganancias: ${totalGanancias.toFixed(2)} $`, 20, y + 10);
    //Muestro el total del stock
    doc.text(`Stock total: ${stockTotal}`, 20, y + 20);

    //Creo el archivo de Excel con el nombre y la fecha actual
    const nombreArchivo = `lista-productos-${fechaFormateada}.pdf`;

    //Descargo el documento con el nombre "productos.pdf"
    doc.save(nombreArchivo);
  } catch{
    console.error(error);
    notyf.error({
      message: 'Error al descargar el archivo',
      duration: 2500,
    });
  }
}

///////////////// Funcion para descargar la tabla en formato excel /////////////////////////////
function descargarListaexcel() {
  //Obtengo los datos del localStorage
  const lista = JSON.parse(localStorage.getItem('productosLista'));

  //Verifico si hay alguna existencia en el localstorage
  if (!lista) {
    notyf.open({
      type: 'error',
      message: 'No se encontraron datos en el localStorage',
      duration: 2500,
    });
    return;
  }

  //Creo una hoja de cálculo con los datos de la lista
  const worksheet = XLSX.utils.json_to_sheet(lista);

  //Modifico la cabecera de la hoja de cálculo
  const headers = ['Nombre', 'Stock', 'Precio', 'Porcentaje', 'Ganancia'];
  XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: 'A1' });

  //Creo el archivo de Excel con el nombre y la fecha actual
  const fechaActual = new Date();
  const dia = fechaActual.getDate().toString().padStart(2, '0');
  const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
  const anio = fechaActual.getFullYear();
  const fechaFormateada = `${dia}/${mes}/${anio}`;
  const nombreArchivo = `lista-productos-${fechaFormateada}.xlsx`;

  //Creo el archivo de Excel y lo descargo
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Lista de productos');
  XLSX.writeFile(workbook, nombreArchivo);
}