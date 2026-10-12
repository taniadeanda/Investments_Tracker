const ventanaRegistrar = $("#ventanaRegistrar");
const ventanaIngresar = $("#ventanaIngresar");
const overlay = document.querySelector(".overlay");
const ventanaTerminosyCondiciones = $("#ventanaTerminosCondiciones");

overlay.addEventListener("click", function () { //se guardan datos ingresados por el usuario y después se muestran
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
    overlay.style.display = "none"; // fondo gris
});


$("#linkTerminosCondiciones").on("click", function (e) {
    e.stopPropagation(); //para que al seleccionar el link no se presione chechbox
    e.preventDefault();  // evita que el # recargue la página
    $("#ventanaTerminosCondiciones").show();
    overlay.style.display = "block"; //muestra fondo gris
});

$("#linkTerminosCondicionesFooter").on("click", function (e) {
    e.stopPropagation(); //para que al seleccionar el link no se presione chechbox
    e.preventDefault();  // evita que el # recargue la página
    ventanaTerminosyCondiciones.show();
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