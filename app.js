// =====================================================
// VARIABLES
// =====================================================

let indiceActual = 0;
let ventanaPlayer = null;

// =====================================================
// ELEMENTOS
// =====================================================

const qrContainer = document.getElementById("codigoQR");

const alumno = document.getElementById("alumno");
const cancion = document.getElementById("cancion");

const btnAnterior = document.getElementById("btnAnterior");
const btnSiguiente = document.getElementById("btnSiguiente");
const btnRandom = document.getElementById("btnRandom");

const btnProyecto = document.getElementById("btnProyecto");
const menuProyecto = document.getElementById("menuProyecto");

const listaProyectos = document.getElementById("listaProyectos");
const buscarAlumno = document.getElementById("buscarAlumno");

const actual = document.getElementById("actual");
const total = document.getElementById("total");

// =====================================================
// INICIALIZACIÓN
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    total.textContent = projects.length;

    crearLista();

    mostrarProyecto();

});

// =====================================================
// MOSTRAR PROYECTO
// =====================================================

function mostrarProyecto() {

    const proyecto = projects[indiceActual];

    alumno.textContent = proyecto.alumno;
    cancion.textContent = proyecto.cancion;

    actual.textContent = indiceActual + 1;

    // Limpiar QR anterior
    qrContainer.innerHTML = "";

    // Crear QR
    new QRCode(qrContainer, {
        text: proyecto.player,
        width: 420,
        height: 420,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });

}

// =====================================================
// ABRIR PLAYER
// =====================================================

function abrirProyecto() {

    const url = projects[indiceActual].player;

    const ancho = Math.round(screen.availWidth / 3);
    const alto = Math.round(screen.availHeight * 3 / 4);

    const izquierda = screen.availWidth - ancho;
    const arriba = Math.round((screen.availHeight - alto) / 2);

    if (ventanaPlayer && !ventanaPlayer.closed) {

        ventanaPlayer.location.href = url;
        ventanaPlayer.focus();

    } else {

        ventanaPlayer = window.open(
            url,
            "MusicLabPlayer",
            `width=${ancho},height=${alto},left=${izquierda},top=${arriba},resizable=yes,scrollbars=yes`
        );

    }

}

// =====================================================
// CERRAR PLAYER
// =====================================================

function cerrarPlayer() {

    if (ventanaPlayer && !ventanaPlayer.closed) {

        ventanaPlayer.close();

    }

    ventanaPlayer = null;

}

// =====================================================
// LISTA DE PROYECTOS
// =====================================================

function crearLista(filtro = "") {

    listaProyectos.innerHTML = "";

    projects.forEach((p, index) => {

        if (!p.alumno.toLowerCase().includes(filtro.toLowerCase()))
            return;

        const item = document.createElement("div");

        item.className = "item";

        item.innerHTML = `
            <strong>${p.alumno}</strong><br>
            <small>${p.cancion}</small>
        `;

        item.addEventListener("click", () => {

            cerrarPlayer();

            indiceActual = index;

            mostrarProyecto();

            menuProyecto.classList.add("oculto");

        });

        listaProyectos.appendChild(item);

    });

}

// =====================================================
// BUSCADOR
// =====================================================

buscarAlumno.addEventListener("input", e => {

    crearLista(e.target.value);

});

// =====================================================
// MENÚ
// =====================================================

btnProyecto.addEventListener("click", e => {

    e.stopPropagation();

    menuProyecto.classList.toggle("oculto");

});

document.addEventListener("click", e => {

    if (
        !menuProyecto.contains(e.target) &&
        !btnProyecto.contains(e.target)
    ) {

        menuProyecto.classList.add("oculto");

    }

});

// =====================================================
// NAVEGACIÓN
// =====================================================

btnAnterior.addEventListener("click", () => {

    cerrarPlayer();

    indiceActual--;

    if (indiceActual < 0)
        indiceActual = projects.length - 1;

    mostrarProyecto();

});

btnSiguiente.addEventListener("click", () => {

    cerrarPlayer();

    indiceActual++;

    if (indiceActual >= projects.length)
        indiceActual = 0;

    mostrarProyecto();

});

// =====================================================
// ALEATORIO
// =====================================================

btnRandom.addEventListener("click", () => {

    cerrarPlayer();

    if (projects.length === 1)
        return;

    let nuevo;

    do {

        nuevo = Math.floor(Math.random() * projects.length);

    } while (nuevo === indiceActual);

    indiceActual = nuevo;

    mostrarProyecto();

});

// =====================================================
// ABRIR DESDE EL QR
// =====================================================

qrContainer.addEventListener("click", abrirProyecto);


// =====================================================
// CERRAR PLAYER AL SALIR
// =====================================================

window.addEventListener("beforeunload", () => {

    cerrarPlayer();

});

document.addEventListener("keydown", (e) => {

    switch (e.key) {

        case "ArrowLeft":
            btnAnterior.click();
            break;

        case "ArrowRight":
            btnSiguiente.click();
            break;

        case " ":
            e.preventDefault();
            btnRandom.click();
            break;

        case "Enter":
            abrirProyecto();
            break;
    }

});