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


// Generación Pseudo-Aleatoria con restricciones específicas
function generadorCongruencialMixto(semilla, a, c, m) {
    return (a * semilla + c) % m;
}

// Función para verificar si un número es primo
function esPrimo(num) {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;
    for (let i = 5; i * i <= num; i += 6) {
        if (num % i === 0 || num % (i + 2) === 0) return false;
    }
    return true;
}

// Generar un número primo menor a 2^64
function generarM() {
    let m;
    do {
        m = Math.floor(Math.random() * (2 ** 16)) + 1; // Usa 2^16 para evitar desbordamientos en JS
    } while (!esPrimo(m));
    return m;
}

// Generar 'a' como un número impar no divisible entre 3 o 5
function generarA() {
    let a;
    do {
        a = Math.floor(Math.random() * 100) + 1;
    } while (a % 2 === 0 || a % 3 === 0 || a % 5 === 0);
    return a;
}

// Generar 'c' relativamente primo con 'm', impar, y cumpliendo c % 8 = 5
function generarC(m) {
    let c;
    do {
        c = Math.floor(Math.random() * m);
    } while (c % 8 !== 5 || c % 2 === 0 || gcd(c, m) !== 1);
    return c;
}

// Función para calcular el máximo común divisor
function gcd(a, b) {
    while (b !== 0) {
        [a, b] = [b, a % b];
    }
    return a;
}

// Generar valores iniciales bajo las restricciones
const m = generarM();
const a = generarA();
const c = generarC(m);
let semilla = Math.floor(Math.random() * m); // Cualquier valor inicial para x en el rango [0, m)

// Función para generar un número pseudoaleatorio
function generarNumeroPseudoaleatorio() {
    semilla = generadorCongruencialMixto(semilla, a, c, m);
    return semilla / m; // Normaliza el valor entre 0 y 1
}

function obtenerValorDado(numeroAleatorio) {
    if (numeroAleatorio < 1 / 6) {
        return 1;
    } else if (numeroAleatorio < 2 / 6) {
        return 2;
    } else if (numeroAleatorio < 3 / 6) {
        return 3;
    } else if (numeroAleatorio < 4 / 6) {
        return 4;
    } else if (numeroAleatorio < 5 / 6) {
        return 5;
    } else {
        return 6;
    }
}

function lanzarDados() {
    document.getElementById("sonidoDados").play(); // Reproduce sonido
    deshabilitarBotonLanzar();

    // Genera valores de los dados usando el método congruencial mixto
    let dado1 = obtenerValorDado(generarNumeroPseudoaleatorio());
    let dado2 = obtenerValorDado(generarNumeroPseudoaleatorio());
    let suma = dado1 + dado2;

    // Aplica la rotación correspondiente para mostrar la cara correcta
    rotarDado(document.getElementById("dadoJuego1"), dado1);
    rotarDado(document.getElementById("dadoJuego2"), dado2);

    setTimeout(() => {
        if ((suma === 7 || suma === 11) && puntoActual === null) {
            actualizarResultado(`¡Ganó la ronda con ${suma}!`);
            sumarPunto(turno);
            puntoActual = null; // Limpiar punto actual al ganar
            document.getElementById("puntoActualTexto").innerText = "Punto actual: ";
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
            puntoActual = null; // Limpiar punto actual al perder
            document.getElementById("puntoActualTexto").innerText = "Punto actual: ";
            finalizarTurno(); // Cambia de turno solo al perder
        } else {
            if (puntoActual === null) {
                // Establece un nuevo punto
                puntoActual = suma;
                actualizarResultado(`El "punto" es: ${puntoActual}`);
                document.getElementById("puntoActualTexto").innerText = `Punto actual: ${puntoActual}`;
                if (esTurnoComputadora()) {
                    setTimeout(lanzarDados, 1200); // La computadora sigue lanzando si establece un "punto"
                } else {
                    habilitarBotonLanzar();
                }
            } else if (suma === puntoActual) {
                // Gana la ronda al repetir el punto
                actualizarResultado("Repitió el 'punto' y ganó la ronda.");
                sumarPunto(turno);
                puntoActual = null; // Limpia el punto actual
                document.getElementById("puntoActualTexto").innerText = "Punto actual: ";
                if (puntosJugador1 >= 10 || puntosJugador2 >= 10) {
                    mostrarGanador();
                } else if (esTurnoComputadora()) {
                    setTimeout(lanzarDados, 1200); // La computadora sigue lanzando automáticamente
                } else {
                    habilitarBotonLanzar(); // Permite que el jugador continúe lanzando
                }
            } else if (suma === 7) {
                // Pierde la ronda al sacar un 7
                actualizarResultado("Salió un 7 y perdió la ronda.");
                restarPunto(turno);
                puntoActual = null; // Limpia el punto actual
                document.getElementById("puntoActualTexto").innerText = "Punto actual: ";
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
    
    // Muestra los resultados en el elemento resultadosTexto
    document.getElementById("resultadosTexto").innerText = `Resultados: ${dado1} y ${dado2}`;
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

function rotarDado(dado, numero) {
    let rotacion;
    switch (numero) {
        case 1:
            rotacion = "rotateX(0deg) rotateY(0deg)";
            break;
        case 4:
            rotacion = "rotateY(90deg) rotateX(0deg)";
            break;
        case 3:
            rotacion = "rotateY(180deg) rotateX(0deg)";
            break;
        case 2:
            rotacion = "rotateY(-90deg) rotateX(0deg)";
            break;
        case 6:
            rotacion = "rotateX(90deg) rotateY(0deg)";
            break;
        case 5:
            rotacion = "rotateX(-90deg) rotateY(0deg)";
            break;
    }
    dado.style.transform = rotacion;
}