//comportamiento
const bottonAgregar = document.querySelector("#botonAgregarNuevaInversion");
const nuevaInversion = document.querySelector("#nuevaInversion"); //#accede con id
const overlay = document.querySelector("#overlay");
const ventanaRegistrar = $("#ventanaRegistrar");
const ventanaIngresar = $("#ventanaIngresar");

nuevaInversion.style.display = "none"; //hace que se oculte la sección de nuevainversion
//overlay.style.display = "none";
//$("#ventanaRegistrar").hide(); //hace que se oculte la ventanaregistrar con jquery
//$("#ventanaIngresar").hide(); //o ventanaIngresar.hide(); pq ya esta declarado
//$("#ventanaTerminosCondiciones").hide();

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
    agregarFila(plataforma, cantidad, rendimiento); //los recibe del formulario
    $("#nuevaInversion, #overlay").hide();
    $("#plataforma, #cantidad, #rendimiento").val("");
    alert("Datos guardados. Nueva inversión creada!");
});

function agregarFila(plataforma, cantidad, rendimiento) { 
    const signo = rendimiento > 0 ? "+" : "";
    $("#botonEliminarInversion").before(
        $("<div>").addClass("celda nombre").text(plataforma),
        $("<div>").addClass("celda total").text("$" + cantidad),
        $("<div>").addClass("celda rendimiento").text(signo + rendimiento + "%")
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
    //alert("Se ha enviado un correo con enlace de restablecimiento a tu correo.");
    $("#correoRecuperarCuenta").val(""); //que se borren campos
    $("#ventanaRecuperarCuenta").hide(); //que se muestre el forumalio de registar
    overlay.style.display = "none"; //muestra fondo gris
});










$.ajax({ //traer/pedir datos del servidor sin recargar la pagina
    url: "inversiones.json",
    method: "GET",
    dataType: "json",
    success: function (datos) { 
        $.each(datos, function (indice, inversion) { //si la peticion es exitosa entonces
            agregarFila(inversion.plataforma, inversion.cantidad, inversion.rendimiento); //toma los datos de json y los muestra/trae a la pagina
        });
    },
    error: function () {
        console.error("No se pudo cargar inversiones.json");
    }
});