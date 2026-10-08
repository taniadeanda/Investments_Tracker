//comportamiento
const bottonAgregar = document.querySelector("#botonAgregarNuevaInversion");
const nuevaInversion = document.querySelector("#nuevaInversion"); //#accede con id
const overlay = document.querySelector("#overlay");

bottonAgregar.addEventListener("click", function() {
    //alert("Botton funcionando");
    nuevaInversion.style.display = "block"; //hace que muestre la sección de nuevainversion
    overlay.style.display = "block";
});

nuevaInversion.style.display = "none"; //hace que se oculte la sección de nuevainversion
overlay.style.display = "none";

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
    overlay.style.display = "none"; //se oculta
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