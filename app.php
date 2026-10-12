<?php
session_start();
if (!isset($_SESSION["usuario_id"])) {
    header("Location: index.html");
    exit;
} #para proteger y verificar
?>

<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="css/style.css">
  <link rel="icon" type="image/jpeg" href="/assets/logo.png">
  <title>Investment Tracker</title>
</head>
<body>
  <header class="menu">
    <h1>Investment Tracker</h1>
    <nav>
      <button id="botonCerrarSesion">Cerrar sesión</button>
    </nav>
  </header>

  <main class="contenido">
    
    <section class="resumen">
      <h2>Resumen</h2>
        <div class="cards">
        <div class="card">
          <h3>Invertido</h3>
          <p id="totalInvertido">$0</p>
        </div>
        <div class="card">
          <h3>Rendimiento Promedio</h3>
          <p id="rendimientoPromedio">0%</p>
        </div>
        <div class="card">
          <h3>Ganancias Estimadas</h3>
          <p id="gananciasEstimadas">$0</p>
        </div>
      </div>
    </section>

    <section class="inversiones">
      <h2>Mis inversiones</h2>
      <div class="tabla-inversiones">
        <button id="botonEliminarInversion" class="boton">Eliminar inversión</button>
        <button id="botonEditarInversion" class="boton">Editar inversión</button>
        <button id="botonAgregarNuevaInversion" class="boton">Agregar inversión +</button>
      </div>
    </section>

  <div class="overlay"></div>
<div class="ventana" id="ventanaEditarInversion">
  <h2>Editar inversión</h2>
  <label class="encabezado">Selecciona la inversión</label><br>
  <select class="listaDesplegable" id="listaInversionesEditar">
    <option value="" disabled selected>— Selecciona —</option>
  </select><br>
  <label class="encabezado">Plataforma</label>
  <input class="input" id="plataformaEditar" type="text" required>
  <label class="encabezado">Cantidad</label>
  <input class="input input-moneda" id="cantidadEditar" type="text" inputmode="decimal" required>
  <label class="encabezado">Rendimiento</label>
  <input class="input" id="rendimientoEditar" type="number" step="any" required>
  <div id="botonesEditarInversion">
    <button class="botones" id="botonCancelarEditarInversion">Cancelar</button>
    <button class="botones" id="botonEditarGuardarInversion">Guardar</button>
  </div>
</div>

  <div class="overlay"></div>
  <div class="ventana" id="ventanaEliminarInversion">
    <h2>Eliminar inversión</h2>
    <label class="encabezado">Nombre</label><br>
    <select class="listaDesplegable" id="listaInversionesEliminar">
      <option value="" disabled selected>— Selecciona —</option>
    </select><br>
    <div id="botonesEliminarInversion">
      <button class="botones" id="botonCancelarEliminarInversion">Cancelar</button>
      <button class="botones" id="botonEditarEliminarInversion">Eliminar</button>
    </div>
  </div>

  <section id="grafica">
  <h2></h2>
    <div class="contenedor-grafica">
      <div class="pastel">
        <canvas id="graficaInversiones"></canvas>
      </div>
      <div id="leyendaInversiones"></div>
    </div>
  </section>

  <div class="overlay"></div>
    <section class="ventana" id="nuevaInversion">
      <h2>Nueva Inversión</h2>
      <label class="encabezado">Plataforma</label>
      <input class="input" id="plataforma" type="text" required>
      <label class="encabezado">Cantidad</label>
      <input class="input input-moneda" id="cantidad" type="text" inputmode="decimal" required>
      <label class="encabezado">Rendimiento</label>
      <input class="input" id="rendimiento" type="number" required>
      <div id="botonesAgregarInversion">
        <button class="botones" id = "botonCancelarInversion">Cancelar</button>
        <button class="botones" id = "botonGuardarInversion">Guardar</button>
      </div>
    </section>

  </main>

  
    <footer class="footer">
  <div class="footer-grid">
    <div>
      <h4>Soporte</h4>
      <ul>
        <li><a href="mailto:tania.deanda9291@alumnos.udg.mx">Contacto</a></li>
      </ul>
    </div>
    <div>
      <h4>Legal</h4>
      <ul>
        <li><a href="/default.html">Privacidad</a></li> <!--MODIFICAR ESTOO -->
        <li><a href="#" id="linkTerminosCondicionesFooter" class="linksVentanas">Términos y condiciones</a></li>
      </ul>
    </div>
  </div>
  <div class="copyright">
    © 2026 Investment Tracker. Todos los derechos reservados.
  </div>
</footer>

  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script> <!-- el orden importa-->
  <script src="js/app.js"></script>
</body>
</html>