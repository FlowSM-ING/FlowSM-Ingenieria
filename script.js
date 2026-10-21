
/* ========================================
   1. MENÚ PARA CELULARES
======================================== */

const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");

menuToggle.addEventListener("click", function () {
    const isOpen = navMenu.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Cerrar menú" : "Abrir menú"
    );
});

// Cerrar el menú después de seleccionar una sección.
navMenu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
        navMenu.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Abrir menú");
    });
});


/* ========================================
   2. AÑO AUTOMÁTICO
======================================== */

const yearElement = document.getElementById("year");

yearElement.textContent = new Date().getFullYear();


/* ========================================
   3. FORMULARIO DE CONTACTO
======================================== */

// CAMBIAR por tu correo comercial antes de publicar.
const contactEmail = "tuemail@ejemplo.com";

const contactForm = document.getElementById("contact-form");
const formMessage = document.getElementById("form-message");

contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!contactForm.reportValidity()) {
        return;
    }

    // Evita abrir un correo dirigido a una dirección ficticia.
    if (contactEmail === "tuemail@ejemplo.com") {
        formMessage.textContent =
            "El formulario funciona, pero primero tenés que configurar " +
            "tu correo comercial en script.js.";

        return;
    }

    const formData = new FormData(contactForm);

    const nombre = formData.get("nombre");
    const email = formData.get("email");
    const servicio = formData.get("servicio");
    const detalle = formData.get("detalle");

    const subject = encodeURIComponent(
        "Consulta de ingeniería - " + nombre
    );

    const body = encodeURIComponent(
        "Nueva consulta desde la web\n\n" +
        "Nombre: " + nombre + "\n" +
        "Correo: " + email + "\n" +
        "Servicio: " + servicio + "\n\n" +
        "Descripción del proyecto:\n" + detalle
    );

    const mailtoLink =
        "mailto:" + contactEmail +
        "?subject=" + subject +
        "&body=" + body;

    window.location.href = mailtoLink;
});
