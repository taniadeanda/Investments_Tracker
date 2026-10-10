//comportamiento
const bottonAgregar = document.querySelector("#botonAgregarNuevaInversion");
const nuevaInversion = document.querySelector("#nuevaInversion"); //#accede con id
const overlay = document.querySelector("#overlay");
const ventanaRegistrar = $("#ventanaRegistrar");
const ventanaIngresar = $("#ventanaIngresar");
const ventanaEditarInversion = $("#ventanaEditarInversion");
let inversionesActuales = [];
const botonEditarInversion = $("#botonEditarInversion");
const botonEliminarInversion = $("#botonEliminarInversion");

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

/*botonEditarInversion.addEventListener("click", function() {
    ventanaEditarInversion.show();
});

botonEliminarInversion.addEventListener("click", function() {
    //ventanaEliminarInversion.show();
});*/

bottonAgregar.addEventListener("click", function() {
    //alert("Botton funcionando");
    nuevaInversion.style.display = "block"; //hace que muestre la sección de nuevainversion
    overlay.style.display = "block";
});

//const bottonGuardarInversion = document.querySelector("#botonGuardarInversion");
$("#botonGuardarInversion").on("click", function () { //con jquery
    const plataforma = $("#plataforma").val().trim();
    const cantidad = parseFloat($("#cantidad").val());
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
    $("#nuevaInversion, #overlay").hide();
    $("#plataforma, #cantidad, #rendimiento").val("");
    alert("¡Nueva inversión creada!");
});

function agregarFila(plataforma, cantidad, rendimiento) { 
    const signo = rendimiento > 0 ? "+" : "";
    $("#botonEliminarInversion").before(
        $("<div>").addClass("celda nombre").text(plataforma),
        $("<div>").addClass("celda total").text("$" + cantidad),
        $("<div>").addClass("celda rendimiento").text(signo + rendimiento + "%")
    );
};

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
    $("#ventanaTerminosCondiciones").hide();
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
    overlay.style.display = "none"; //muestra fondo gris
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
    actualizarGrafica(inversionesActuales);
    },
    error: function () {
        console.error("No se pudo cargar inversiones.json");
    }
});