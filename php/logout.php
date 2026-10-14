<?php
session_start(); //inicia sesión para saber cupal destruir
session_destroy();
header("Location: ../index.html"); //redirige a url