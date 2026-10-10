//comportamiento
const bottonAgregar = document.querySelector("#botonAgregarNuevaInversion");
const nuevaInversion = document.querySelector("#nuevaInversion"); //#accede con id
const overlay = document.querySelector("#overlay");
const ventanaRegistrar = $("#ventanaRegistrar");
const ventanaIngresar = $("#ventanaIngresar");
const ventanaEditarInversion = $("#ventanaEditarInversion");
const ventanaEliminarInversion = $("#ventanaEliminarInversion");
let inversionesActuales = [];
const botonEditarInversion = $("#botonEditarInversion");
const botonEliminarInversion = $("#botonEliminarInversion");
const botonEditarEliminarInversion = $("#botonEditarEliminarInversion");

nuevaInversion.style.display = "none"; //hace que se oculte la sección de nuevainversion
//overlay.style.display = "none";
//$("#ventanaRegistrar").hide(); //hace que se oculte la ventanaregistrar con jquery
//$("#ventanaIngresar").hide(); //o ventanaIngresar.hide(); pq ya esta declarado
//$("#ventanaTerminosCondiciones").hide();
let graficaInversiones = null;

const coloresPastel = [
    "#CDB4DB", // Lavanda
    "#FFC8DD", // Rosa
    "#BDE0FE", // Azul cielo
    "#CDEAC0", // Verde menta
    "#FFE5A5", // Amarillo suave
    "#FFD6A5", // Durazno
    "#A8DADC", // Turquesa pastel
    "#E7C6FF"  // Lila
];

function actualizarGrafica(inversiones) {
    actualizarResumen(inversiones);
    const plataformas = inversiones.map(
        inversion => inversion.plataforma
    );
    const cantidades = inversiones.map(
        inversion => Number(inversion.cantidad)
    );
    const colores = inversiones.map(
        (_, indice) => coloresPastel[indice % coloresPastel.length]
    );
    const total = cantidades.reduce(
        (suma, cantidad) => suma + cantidad,
        0
    );
    // Crear o actualizar la gráfica
    const contexto = document
        .querySelector("#graficaInversiones")
        .getContext("2d");
    if (graficaInversiones) {
        graficaInversiones.data.labels = plataformas;
        graficaInversiones.data.datasets[0].data = cantidades;
        graficaInversiones.data.datasets[0].backgroundColor = colores;
        graficaInversiones.update();
    } else {
        graficaInversiones = new Chart(contexto, {
            type: "pie",
            data: {
                labels: plataformas,
                datasets: [{
                    data: cantidades,
                    backgroundColor: colores,
                    borderColor: "#FFFFFF",
                    borderWidth: 3,
                    hoverOffset: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(contexto) {
                                const cantidad = contexto.raw;
                                const porcentaje = total > 0
                                    ? (cantidad / total * 100).toFixed(1)
                                    : "0.0";
                                return ` $${cantidad.toLocaleString("es-MX")} MXN (${porcentaje}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    // Crear las etiquetas de colores a un lado
    const leyenda = document.querySelector("#leyendaInversiones");
    leyenda.innerHTML = "";
    inversiones.forEach((inversion, indice) => {
        const cantidad = Number(inversion.cantidad);
        const porcentaje = total > 0
            ? (cantidad / total * 100).toFixed(1)
            : "0.0";
        const etiqueta = document.createElement("div");
        etiqueta.className = "etiqueta-inversion";
        const color = document.createElement("span");
        color.className = "color-etiqueta";
        color.style.backgroundColor = colores[indice];
        const detalle = document.createElement("div");
        detalle.className = "detalle-inversion";
        const nombre = document.createElement("span");
        nombre.className = "nombre-plataforma";
        nombre.textContent = inversion.plataforma;
        const monto = document.createElement("span");
        monto.className = "monto-inversion";
        monto.textContent =
            `$${cantidad.toLocaleString("es-MX")} MXN · ${porcentaje}%`;
        detalle.append(nombre, monto);
        etiqueta.append(color, detalle);
        leyenda.appendChild(etiqueta);
    });
};

botonEditarInversion.on("click", function() {
    limpiarFormularioEditar();
    listaDesplegableInversiones();
    ventanaEditarInversion.show();
    overlay.style.display = "block";
});

botonEliminarInversion.on("click", function() {
    limpiarFormularioEditar();
    listaDesplegableInversiones();
    ventanaEliminarInversion.show();
    overlay.style.display = "block";
});

bottonAgregar.addEventListener("click", function() {
    //alert("Botton funcionando");
    nuevaInversion.style.display = "block"; //hace que muestre la sección de nuevainversion
    overlay.style.display = "block";
});

botonEditarEliminarInversion.on("click", function () {
    const select = document.getElementById("listaInversionesEliminar");
    const indice = parseInt(select.value, 10);
    if (isNaN(indice)) {
        alert("Selecciona una inversión de la lista.");
        return;
    }
    const eliminada = inversionesActuales[indice];
    if (!confirm(`¿Seguro que quieres eliminar "${eliminada.plataforma}"?`)) {
        return;
    }
    inversionesActuales.splice(indice, 1);   // quita del arreglo
    renderizarTabla();                        // actualiza la tabla
    actualizarGrafica(inversionesActuales);   // actualiza la gráfica
    listaDesplegableInversiones();            // actualiza los selects
    ventanaEliminarInversion.hide();
    overlay.style.display = "none";
    alert(`La inversión "${eliminada.plataforma}" se eliminó correctamente.`);
});

$("#listaInversionesEditar").on("change", function () {
    const indice = parseInt(this.value, 10);
    if (isNaN(indice)) return;
    const inv = inversionesActuales[indice];
    $("#plataformaEditar").val(inv.plataforma);
    $("#cantidadEditar").val(
        Number(inv.cantidad).toLocaleString("es-MX", { maximumFractionDigits: 2 })
    );
    $("#rendimientoEditar").val(inv.rendimiento);
});

$("#botonEditarGuardarInversion").on("click", function () {
    const indice = parseInt($("#listaInversionesEditar").val(), 10);
    if (isNaN(indice)) {
        alert("Selecciona una inversión de la lista.");
        return;
    }
    const plataforma = $("#plataformaEditar").val().trim();
    const cantidad = quitarFormato($("#cantidadEditar").val());    const rendimiento = parseFloat($("#rendimientoEditar").val());
    if (!plataforma || isNaN(cantidad) || isNaN(rendimiento) || cantidad <= 0) {
        alert("Por favor completa todos los campos correctamente.");
        return;
    }
    inversionesActuales[indice] = {
        plataforma: plataforma,
        cantidad: cantidad,
        rendimiento: rendimiento
    };
    renderizarTabla();                       // la función del paso anterior
    actualizarGrafica(inversionesActuales);
    listaDesplegableInversiones();
    limpiarFormularioEditar();
    ventanaEditarInversion.hide();
    overlay.style.display = "none";
    alert("¡Inversión actualizada!");
});

function limpiarFormularioEditar() {
    $("#plataformaEditar, #cantidadEditar, #rendimientoEditar").val("");
}

function renderizarTabla() { //confomre al arreglo
    $(".fila-inversion").remove();
    inversionesActuales.forEach(function (inv) {
        agregarFila(inv.plataforma, inv.cantidad, inv.rendimiento);
    });
}

//const bottonGuardarInversion = document.querySelector("#botonGuardarInversion");
$("#botonGuardarInversion").on("click", function () { //con jquery
    const plataforma = $("#plataforma").val().trim();
    const cantidad = quitarFormato($("#cantidad").val());
    const rendimiento = parseFloat($("#rendimiento").val());
    if (!plataforma || isNaN(cantidad) || isNaN(rendimiento) || cantidad <= 0) {
        alert("Por favor completa todos los campos correctamente.");
        return;
    }
    const nueva = {
        plataforma: plataforma,
        cantidad: cantidad,
        rendimiento: rendimiento
    };
    inversionesActuales.push(nueva); 
    agregarFila(plataforma, cantidad, rendimiento);
    actualizarGrafica(inversionesActuales);
    listaDesplegableInversiones();
    $("#nuevaInversion, #overlay").hide();
    $("#plataforma, #cantidad, #rendimiento").val("");
    alert("¡Nueva inversión creada!");
});

function agregarFila(plataforma, cantidad, rendimiento) {
    const signo = rendimiento > 0 ? "+" : "";
    $("#botonEliminarInversion").before(
        $("<div>").addClass("celda nombre fila-inversion").text(plataforma),
        $("<div>").addClass("celda total fila-inversion")
            .text("$" + Number(cantidad).toLocaleString("es-MX", { maximumFractionDigits: 2 })),        $("<div>").addClass("celda rendimiento fila-inversion").text(signo + rendimiento + "%")
        );
}

const botonCancelarGuardar = document.querySelector("#botonCancelarInversion");
botonCancelarGuardar.addEventListener("click", function () { //se guardan datos ingresados por el usuario y después se muestran
    nuevaInversion.style.display = "none";
    overlay.style.display = "none"; //se oculta
});

overlay.addEventListener("click", function () { //se guardan datos ingresados por el usuario y después se muestran
    nuevaInversion.style.display = "none";
    overlay.style.display = "none"; //se ocultan todas las ventanas si se presiona el fondo
    $("#ventanaRegistrar").hide();
    $("#ventanaIngresar").hide();
    $("#ventanaRecuperarCuenta").hide();
    ventanaEliminarInversion.hide();
    $("#ventanaTerminosCondiciones").hide();
    ventanaEditarInversion.hide();
});

$("#botonRegistrarte").on("click", function () { //con jquery
    $("#ventanaRegistrar").show(); //que se muestre el forumalio de registar
    //ventanaRegistrar.style.display = "block"; //hace que muestre la sección
    overlay.style.display = "block";
});

$("#botonRegistrarme").on("click", function () { //con jquery
    const correo = $("#correoRegistrar").val().trim();
    const contraseña = $("#contraseñaRegistrar").val().trim();
    const contraseñaConfirmacion = $("#contraseñaConfirmacion").val().trim();
    const aceptoTerminos = $("#checkTerminos").is(":checked");
    // Validaciones
    if (!correo) {
        alert("El correo es obligatorio.");
        return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) { //regex
        alert("El correo no tiene un formato válido.");
        return;
    }
    if (!contraseña || !contraseñaConfirmacion) {
        alert("Completa ambos campos de contraseña.");
        return;
    }
    if (contraseña !== contraseñaConfirmacion) {
        alert("Las contraseñas no coinciden.");
        return;
    }
    if (!aceptoTerminos) {
        alert("Debes aceptar los términos y condiciones.");
        return;
    }
    //crear cuenta
    alert("Tu cuenta ha sido creada con éxito. Verifica tu correo electrónico");
    $("#correoRegistrar").val(""); //que se borren campos
    $("#contraseñaRegistrar").val("");
    $("#contraseñaConfirmacion").val("");
    $("#checkTerminos").prop("checked", false); 
});


$("#botonIngresar").on("click", function () { //con jquery
    $("#ventanaIngresar").show(); //que se muestre el forumalio de registar
    overlay.style.display = "block"; //muestra fondo gris
});

$("#botonIniciarSesion").on("click", function () { //con jquery
    const correo = $("#correoInicioSesion").val().trim();
    const contraseña = $("#contraseñaInicioSesion").val().trim();
    // Validaciones
    if (!correo) {
        alert("El correo es obligatorio.");
        return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) { //regex
        alert("El correo no tiene un formato válido.");
        return;
    }
    if (!contraseña) { 
        alert("Completa ambos campos de contraseña.");
        return;
    } 
    //if contraseña y correo no coinciden con lo de la base de datos
      //alert("Tu contraseña y/o correo son inconrectos.");
        //return;
    //}
    $("#correoInicioSesion").val(""); //que se borren campos
    $("#contraseñaInicioSesion").val("");
    $("#ventanaIngresar").hide(); //que se muestre el forumalio de registar
    overlay.style.display = "none"; // fondo gris
});

$("#botonCancelarEditarInversion").on("click", function () { //con jquery
    ventanaEditarInversion.hide(); //que se muestre el forumalio de registar
    overlay.style.display = "none"; //oculta fondo gris
});

$("#botonCancelarEliminarInversion").on("click", function () { //con jquery
    ventanaEliminarInversion.hide(); //que se muestre el forumalio de registar
    overlay.style.display = "none"; //oculda fondo gris
});

$("#linkTerminosCondiciones").on("click", function (e) {
    e.stopPropagation(); //para que al seleccionar el link no se presione chechbox
    e.preventDefault();  // evita que el # recargue la página
    $("#ventanaTerminosCondiciones").show();
    overlay.style.display = "block"; //muestra fondo gris
});

$("#LinkOlvideContraseña").on("click", function (e) {
    e.preventDefault();  // evita que el # recargue la página
    $("#ventanaRecuperarCuenta").show();
    $("#ventanaIngresar").hide();
    overlay.style.display = "block"; //muestra fondo gris
});

$("#botonRecuperarCuenta").on("click", function () { //con jquery
    const correo = $("#correoRecuperarCuenta").val().trim();
    // Validaciones
    if (!correo) {
        alert("El correo es obligatorio.");
        return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) { //regex
        alert("El correo no tiene un formato válido.");
        return;
    }
    //if hay un correo en esa base de datos registrado con eso entonces mandale un link para reestablecer contraseña
        //return;
    //}
    alert("Se ha enviado un correo con enlace de restablecimiento a tu correo.");
    $("#correoRecuperarCuenta").val(""); //que se borren campos
    $("#ventanaRecuperarCuenta").hide(); //que se muestre el forumalio de registar
    overlay.style.display = "none"; //muestra fondo gris
});

function listaDesplegableInversiones () { //solo aparecen las que existen
  ["listaInversionesEditar", "listaInversionesEliminar"].forEach((id) => {
    const select = document.getElementById(id);
    select.innerHTML = '<option value="" disabled selected>— Selecciona —</option>';
    inversionesActuales.forEach((inversion, indice) => {
      const option = document.createElement("option");
      option.value = indice;
      option.textContent =
        `${inversion.plataforma} — $${Number(inversion.cantidad).toLocaleString("es-MX")} MXN`;
      select.appendChild(option);
    });
  });
}


// Convierte "1234567.5" en "1,234,567.5" (máximo 2 decimales)
function formatearNumero(valor) {
    const limpio = valor.replace(/[^\d.]/g, "");   // solo dígitos y punto
    const partes = limpio.split(".");
    let entero = partes[0].replace(/^0+(?=\d)/, ""); // quita ceros a la izquierda
    entero = entero.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    if (partes.length > 1) {
        return entero + "." + partes.slice(1).join("").slice(0, 2);
    }
    return entero;
}

// Convierte "1,234,567.5" en el número 1234567.5
function quitarFormato(valor) {
    return parseFloat(String(valor).replace(/,/g, ""));
}

// Formatea mientras el usuario escribe, sin mover el cursor
$(document).on("input", ".input-moneda", function () {
    const textoAnterior = this.value;
    const posicion = this.selectionStart;
    const digitosAntes = textoAnterior.slice(0, posicion).replace(/,/g, "").length;
    this.value = formatearNumero(textoAnterior);
    // Reponer el cursor en el mismo dígito
    let nuevaPos = 0;
    let contados = 0;
    while (nuevaPos < this.value.length && contados < digitosAntes) {
        if (this.value[nuevaPos] !== ",") contados++;
        nuevaPos++;
    }
    this.setSelectionRange(nuevaPos, nuevaPos);
});

function formatearMoneda(numero) {
    return "$" + numero.toLocaleString("es-MX", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function actualizarResumen(inversiones) {
    const totalInvertido = inversiones.reduce(
        (suma, inv) => suma + Number(inv.cantidad), 0
    );
    // Ganancia de cada inversión = cantidad * (rendimiento / 100)
    const ganancias = inversiones.reduce(
        (suma, inv) => suma + Number(inv.cantidad) * Number(inv.rendimiento) / 100, 0
    );
    const rendimientoPromedio = inversiones.length > 0
        ? inversiones.reduce((s, inv) => s + Number(inv.rendimiento), 0) / inversiones.length
        : 0;
    $("#totalInvertido").text(formatearMoneda(totalInvertido));
    $("#rendimientoPromedio").text(rendimientoPromedio.toFixed(2) + "%");
    $("#gananciasEstimadas").text(formatearMoneda(ganancias));
    $("#valorPortafolio").text(formatearMoneda(totalInvertido + ganancias) + " MXN");
}











$.ajax({ //traer/pedir datos del servidor sin recargar la pagina
    url: "inversiones.json",
    method: "GET",
    dataType: "json",
    success: function(datos) {
        inversionesActuales = datos;
        $.each(inversionesActuales, function(indice, inversion) {
        agregarFila(
            inversion.plataforma,
            inversion.cantidad,
            inversion.rendimiento
        );
    });
    listaDesplegableInversiones();
    actualizarGrafica(inversionesActuales);
    },
    error: function () {
        console.error("No se pudo cargar inversiones.json");
    }
});