let puntosJugador1 = 0;
let puntosJugador2 = 0;
let esContraComputadora = false;
let turno = 1; 
let puntoActual = null;

function mostrarInstrucciones() {
    document.getElementById("menuInicial").classList.add("oculto");
    document.getElementById("instrucciones").classList.remove("oculto");
}

function ocultarInstrucciones() {
    document.getElementById("instrucciones").classList.add("oculto");
    document.getElementById("menuInicial").classList.remove("oculto");
}

function mostrarOpcionesJuego() {
    document.getElementById("menuInicial").classList.add("oculto");
    document.getElementById("seleccionModoJuego").classList.remove("oculto");
}

function iniciarJuego(contraComputadora) {
    esContraComputadora = contraComputadora;
    puntosJugador1 = 0;
    puntosJugador2 = 0;
    turno = 1;
    puntoActual = null;

    document.getElementById("seleccionModoJuego").classList.add("oculto");
    document.getElementById("gameArea").classList.remove("oculto");
    document.getElementById("scoreboard").classList.remove("oculto"); // Mostrar marcador
    document.getElementById("turno").innerText = `Turno del Jugador 1`;
    actualizarPuntos();
    habilitarBotonLanzar();
}

//Generacion Pseudo-Aleatoria
function generadorCongruencialMixto(semilla, a, c, m) {
    return (a * semilla + c) % m;
}

// Parámetros para el método congruencial mixto
let semilla = Math.floor(Math.random() * 100); // Semilla inicial aleatoria
const m = 100; // Escoge un valor suficientemente grande para m
const a = Math.floor(Math.random() * (m - 1)) + 1; // Escoge a aleatorio en rango 1 < a < m
const c = Math.floor(Math.random() * m); // Escoge c aleatorio entre 0 y m

function generarNumeroPseudoaleatorio() {
    semilla = generadorCongruencialMixto(semilla, a, c, m);
    return semilla;
}


function lanzarDados() {
    document.getElementById("sonidoDados").play(); // Reproduce sonido
    deshabilitarBotonLanzar();

    let dado1 = (generarNumeroPseudoaleatorio() % 6) + 1;
    let dado2 = (generarNumeroPseudoaleatorio() % 6) + 1;
    let suma = dado1 + dado2;

    animarDados(dado1, dado2);

    setTimeout(() => {
        if ((suma === 7 || suma === 11) && puntoActual === null) {
            actualizarResultado(`¡Ganó la ronda con ${suma}!`);
            sumarPunto(turno);
            if (puntosJugador1 >= 10 || puntosJugador2 >= 10) {
                mostrarGanador();
            } else if (esTurnoComputadora()) {
                setTimeout(lanzarDados, 1200); // La computadora sigue lanzando automáticamente al ganar
            } else {
                habilitarBotonLanzar(); // Permite que el jugador continúe lanzando
            }
        } else if ((suma === 2 || suma === 3 || suma === 12) && puntoActual === null) {
            actualizarResultado(`Perdió la ronda con ${suma}`);
            restarPunto(turno);
            finalizarTurno(); // Cambia de turno solo al perder
        } else {
            if (puntoActual === null) {
                puntoActual = suma;
                actualizarResultado(`El "punto" es: ${puntoActual}`);
                if (esTurnoComputadora()) {
                    setTimeout(lanzarDados, 1200); // La computadora sigue lanzando si establece un "punto"
                } else {
                    habilitarBotonLanzar();
                }
            } else if (suma === puntoActual) {
                actualizarResultado("Repitió el 'punto' y ganó la ronda.");
                sumarPunto(turno);
                puntoActual = null;
                if (puntosJugador1 >= 10 || puntosJugador2 >= 10) {
                    mostrarGanador();
                } else if (esTurnoComputadora()) {
                    setTimeout(lanzarDados, 1200); // La computadora sigue lanzando automáticamente
                } else {
                    habilitarBotonLanzar(); // Permite que el jugador continúe lanzando
                }
            } else if (suma === 7) {
                actualizarResultado("Salió un 7 y perdió la ronda.");
                restarPunto(turno);
                puntoActual = null;
                finalizarTurno();
            } else {
                if (esTurnoComputadora()) {
                    setTimeout(lanzarDados, 1200); // La computadora sigue lanzando si no obtiene un 7 o el "punto"
                } else {
                    habilitarBotonLanzar();
                }
            }
        }
        actualizarPuntos();
    }, 1000);
}



function animarDados(dado1, dado2) {
    const dadoEl1 = document.getElementById("dado1");
    const dadoEl2 = document.getElementById("dado2");

    dadoEl1.classList.add("rolling");
    dadoEl2.classList.add("rolling");

    setTimeout(() => {
        dadoEl1.classList.remove("rolling");
        dadoEl2.classList.remove("rolling");
        dadoEl1.innerText = `🎲 ${dado1}`;
        dadoEl2.innerText = `🎲 ${dado2}`;
    }, 1250);
}

function actualizarResultado(texto) {
    document.getElementById("resultadosTexto").innerText = texto;
}

function cambiarTurno() {
    mostrarMensajeTurno(); // Mostrar mensaje de cambio de turno
    setTimeout(() => {
        turno = turno === 1 ? 2 : 1;
        document.getElementById("turno").innerText = `Turno del ${turno === 1 ? "Jugador 1" : esContraComputadora ? "Computadora" : "Jugador 2"}`;
        
        if (esTurnoComputadora()) {
            deshabilitarBotonLanzar(); // Desactiva el botón de lanzar para el jugador
            setTimeout(lanzarDados, 1200); // La computadora lanza automáticamente después de un breve retraso
        } else {
            habilitarBotonLanzar(); // Activa el botón para el turno del jugador
        }
    }, 1000); // Espera para dar tiempo al mensaje de turno
}

// Función para mostrar el mensaje de cambio de turno
function mostrarMensajeTurno() {
    const mensajeTurno = document.getElementById("mensajeTurno");
    mensajeTurno.classList.remove("oculto");
    setTimeout(() => {
        mensajeTurno.classList.add("oculto");
    }, 1000);
}

function finalizarTurno() {
    if (puntosJugador1 >= 10 || puntosJugador2 >= 10) {
        mostrarGanador();
    } else {
        cambiarTurno();
    }
}



function esTurnoComputadora() {
    return esContraComputadora && turno === 2;
}


function mostrarGanador() {
    if (puntosJugador1 >= 10) {
        alert("¡Jugador 1 gana la partida!");
    } else if (puntosJugador2 >= 10) {
        alert("¡Computadora gana la partida!");
    }
    deshabilitarBotonLanzar();
}

function sumarPunto(jugador) {
    if (jugador === 1) {
        puntosJugador1++;
    } else {
        puntosJugador2++;
    }
}

function restarPunto(jugador) {
    if (jugador === 1 && puntosJugador1 > 0) {
        puntosJugador1--;
    } else if (jugador === 2 && puntosJugador2 > 0) {
        puntosJugador2--;
    }
}

function actualizarPuntos() {
    document.getElementById("turno").innerText = `Turno del ${turno === 1 ? "Jugador 1" : esContraComputadora ? "Computadora" : "Jugador 2"}`;
}

function deshabilitarBotonLanzar() {
    document.getElementById("lanzarBtn").disabled = true;
}

function habilitarBotonLanzar() {
    document.getElementById("lanzarBtn").disabled = false;
}

function actualizarPuntos() {
    document.getElementById("turno").innerText = `Turno del ${turno === 1 ? "Jugador 1" : esContraComputadora ? "Computadora" : "Jugador 2"}`;
    document.getElementById("puntosJugador1").innerText = `Jugador 1: ${puntosJugador1} puntos`;
    document.getElementById("puntosJugador2").innerText = esContraComputadora
        ? `Computadora: ${puntosJugador2} puntos`
        : `Jugador 2: ${puntosJugador2} puntos`;
}

function mostrarGanador() {
    const ganador = puntosJugador1 >= 10 ? "Jugador 1" : "Computadora";
    const modal = document.getElementById("modalVictoria");
    document.getElementById("mensajeVictoria").innerText = `¡${ganador} ha ganado la partida! 🎉`;
    document.getElementById("mensajeVictoria").appendChild(document.createTextNode(ganador === "Computadora" ? "¡Mejor suerte la próxima vez!" : "¡Felicidades!"));
    modal.classList.remove("oculto");
    deshabilitarBotonLanzar();
}


function cerrarModalVictoria() {
    document.getElementById("modalVictoria").classList.add("oculto");
    // Reiniciar el juego o redirigir al menú principal si lo deseas
}

function reiniciarJuego() {
    puntosJugador1 = 0;
    puntosJugador2 = 0;
    turno = 1;
    puntoActual = null;
    esContraComputadora = false;

    document.getElementById("modalVictoria").classList.add("oculto"); // Oculta el modal de victoria
    document.getElementById("gameArea").classList.add("oculto"); // Oculta el área de juego
    document.getElementById("scoreboard").classList.add("oculto"); // Oculta el marcador
    document.getElementById("menuInicial").classList.remove("oculto"); // Muestra el menú inicial
    actualizarPuntos();
}

function volverAlMenu() {
    puntosJugador1 = 0;
    puntosJugador2 = 0;
    turno = 1;
    puntoActual = null;
    esContraComputadora = false;

    document.getElementById("gameArea").classList.add("oculto"); // Oculta el área de juego
    document.getElementById("scoreboard").classList.add("oculto"); // Oculta el marcador
    document.getElementById("menuInicial").classList.remove("oculto"); // Muestra el menú inicial
    actualizarPuntos();
}


