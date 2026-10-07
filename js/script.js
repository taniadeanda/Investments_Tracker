//comportamiento
const bottonAgregar = document.querySelector("#botonAgregarNuevaInversion");
const nuevaInversion = document.querySelector("#nuevaInversion"); //#accede con id

bottonAgregar.addEventListener("click", function() {
    //alert("Botton funcionando");
    nuevaInversion.style.display = "block"; //hace que muestre la sección de nuevainversion
});

nuevaInversion.style.display = "none"; //hace que se oculte la sección de nuevainversion

const bottonGuardarInversion = document.querySelector("#botonGuardarInversion");
bottonGuardarInversion.addEventListener("click", function () { //se guardan datos ingresados por el usuario y después se muestran
    const inputPlataforma = document.querySelector("#plataforma").value; //obtener valores
    const inputCantidad = document.querySelector("#cantidad").value;
    const inputRendimiento = document.querySelector("#rendimiento").value;
    const cantidadN = parseFloat(inputCantidad); //convertir a numero float
    const rendimientoN = parseFloat(inputRendimiento);
    if (cantidadN <= 0 || rendimientoN <= 0 || !inputPlataforma) { //validación de todos los campos llenos
        alert("Por favor completa todos los campos correctamente.");
        return; //se sale de la funcion
    } //else
    const celdaNombre = document.createElement("div");
    const celdaTotal = document.createElement("div"); //se crean div para agregar en cada uno sus datos 
    const celdaRendimiento = document.createElement("div");

    celdaNombre.className = "celda nombre";
    celdaTotal.className = "celda total";
    celdaRendimiento.className = "celda rendimiento";

    celdaNombre.textContent = inputPlataforma;
    celdaTotal.textContent = "$" + cantidadN;
    celdaRendimiento.textContent = "+" + rendimientoN + "%";

    const listaInversiones = document.querySelector(".tabla-inversiones");
    listaInversiones.appendChild(celdaNombre);
    listaInversiones.appendChild(celdaTotal);
    listaInversiones.appendChild(celdaRendimiento);

    nuevaInversion.style.display = "none";
    document.querySelector("#plataforma").value = "";
    document.querySelector("#cantidad").value = "";
    document.querySelector("#rendimiento").value = "";
    alert("Datos guardados. Nueva inversión creada!");
});
