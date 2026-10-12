const ventanaRegistrar = $("#ventanaRegistrar");
const ventanaIngresar = $("#ventanaIngresar");
const overlay = document.querySelector(".overlay");
const ventanaTerminosyCondiciones = $("#ventanaTerminosCondiciones");

function mensajeErrorAjax(xhr, textStatus) {
    if (xhr.responseJSON && xhr.responseJSON.mensaje) {
        return xhr.responseJSON.mensaje;
    }
    if (textStatus === "parsererror") {
        console.error("El servidor devolvió una respuesta que no es JSON válido:", xhr.responseText);
        return "El servidor respondió, pero envió una respuesta inválida. Actualiza la página e inténtalo de nuevo desde http://localhost/Investment_Tracker/.";
    }
    if (xhr.status) {
        return `El servidor respondió con un error (${xhr.status}).`;
    }
    return "No se pudo conectar con el servidor.";
}

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

$("#botonRegistrarme").on("click", function () {
    const correo = $("#correoRegistrar").val().trim();
    const nombre = $("#nombreRegistrar").val().trim();
    const contraseña = $("#contraseñaRegistrar").val().trim();
    const contraseñaConfirmacion = $("#contraseñaConfirmacion").val().trim();
    const aceptoTerminos = $("#checkTerminos").is(":checked");
    // Validaciones
    if (!correo) {
        alert("El correo es obligatorio.");
        return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
        alert("El correo no tiene un formato válido.");
        return;
    }
    if (!contraseña || !contraseñaConfirmacion) {
        alert("Completa ambos campos de contraseña.");
        return;
    }
    if (contraseña.length < 8) {
        alert("La contraseña debe tener al menos 8 caracteres.");
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
    if (!nombre) {
        alert("Nombre es obligatorio.");
        return;
    }
    // Crear cuenta
    $.post("php/registro.php", { nombre: nombre, correo: correo, contrasena: contraseña }, function (resp) {
        alert(resp.mensaje);
        if (resp.ok) {
            $("#nombreRegistrar").val("");
            $("#correoRegistrar").val("");
            $("#contraseñaRegistrar").val("");
            $("#contraseñaConfirmacion").val("");
            $("#checkTerminos").prop("checked", false);
            $("#ventanaRegistrar").hide();
            overlay.style.display = "none";
        }
    }, "json").fail(function (xhr, textStatus) {
        alert(mensajeErrorAjax(xhr, textStatus));
    });
});


$("#botonIngresar").on("click", function () { //con jquery
    $("#ventanaIngresar").show(); //que se muestre el forumalio de registar
    overlay.style.display = "block"; //muestra fondo gris
});

$("#botonIniciarSesion").on("click", function () {
    const correo = $("#correoInicioSesion").val().trim();
    const contraseña = $("#contraseñaInicioSesion").val().trim();
    // Validaciones
    if (!correo) {
        alert("El correo es obligatorio.");
        return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
        alert("El correo no tiene un formato válido.");
        return;
    }
    if (!contraseña) {
        alert("Ingresa tu contraseña.");
        return;
    }

    $.post("php/login.php", { correo: correo, contrasena: contraseña }, function (resp) {
        if (resp.ok) {
            window.location.href = "app.php";
        } else {
            alert(resp.mensaje);
            $("#contraseñaInicioSesion").val(""); // solo borra la contraseña para reintentar
        }
    }, "json").fail(function (xhr, textStatus) {
        alert(mensajeErrorAjax(xhr, textStatus));
    });
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