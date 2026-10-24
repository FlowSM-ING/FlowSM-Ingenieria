/* ========================================
   1. MENÚ PARA CELULARES
======================================== */

const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");

function setMenu(open) {
    navMenu.classList.toggle("open", open);
    menuToggle.classList.toggle("is-open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
}

menuToggle.addEventListener("click", function () {
    setMenu(!navMenu.classList.contains("open"));
});

// Cerrar el menú después de seleccionar una sección.
navMenu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
        setMenu(false);
    });
});

// Cerrar con la tecla Escape.
document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && navMenu.classList.contains("open")) {
        setMenu(false);
        menuToggle.focus();
    }
});

// Cerrar al hacer clic fuera del menú.
document.addEventListener("click", function (event) {
    const clickedInside =
        navMenu.contains(event.target) || menuToggle.contains(event.target);

    if (!clickedInside && navMenu.classList.contains("open")) {
        setMenu(false);
    }
});

// Al pasar a pantalla grande, el menú vuelve a su estado normal.
window.matchMedia("(min-width: 761px)").addEventListener("change", function (e) {
    if (e.matches) {
        setMenu(false);
    }
});


/* ========================================
   2. SOMBRA DEL ENCABEZADO AL HACER SCROLL
======================================== */

const header = document.getElementById("header");

function updateHeaderShadow() {
    header.classList.toggle("scrolled", window.scrollY > 10);
}

window.addEventListener("scroll", updateHeaderShadow, { passive: true });
updateHeaderShadow();


/* ========================================
   3. AÑO AUTOMÁTICO
======================================== */

const yearElement = document.getElementById("year");

yearElement.textContent = new Date().getFullYear();


/* ========================================
   4. SECCIÓN ACTIVA EN EL MENÚ
======================================== */

const navLinks = Array.from(navMenu.querySelectorAll("a:not(.nav-cta)"));

const trackedSections = navLinks
    .map(function (link) {
        return document.querySelector(link.getAttribute("href"));
    })
    .filter(Boolean);

function setActiveLink(id) {
    navLinks.forEach(function (link) {
        const isActive = link.getAttribute("href") === "#" + id;

        link.classList.toggle("active", isActive);

        if (isActive) {
            link.setAttribute("aria-current", "true");
        } else {
            link.removeAttribute("aria-current");
        }
    });
}

if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    setActiveLink(entry.target.id);
                }
            });
        },
        { rootMargin: "-40% 0px -55% 0px" }
    );

    trackedSections.forEach(function (section) {
        sectionObserver.observe(section);
    });

    // En el inicio de la página no se resalta ningún enlace.
    window.addEventListener(
        "scroll",
        function () {
            if (window.scrollY < 200) {
                setActiveLink("");
            }
        },
        { passive: true }
    );
}


/* ========================================
   5. ANIMACIONES DE APARICIÓN
======================================== */

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
        function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealElements.forEach(function (element, index) {
        // Pequeño retraso escalonado para tarjetas hermanas.
        element.style.transitionDelay = (index % 4) * 70 + "ms";
        revealObserver.observe(element);
    });
} else {
    revealElements.forEach(function (element) {
        element.classList.add("is-visible");
    });
}


/* ========================================
   6. FORMULARIO DE CONTACTO
======================================== */

// CAMBIAR por tu correo comercial antes de publicar.
const contactEmail = "tuemail@ejemplo.com";

const contactForm = document.getElementById("contact-form");
const formMessage = document.getElementById("form-message");
const serviceSelect = document.getElementById("servicio");

function showFormMessage(text, state) {
    formMessage.textContent = text;
    formMessage.dataset.state = state || "";
}

// Al consultar un servicio desde su tarjeta, se preselecciona en el formulario.
document.querySelectorAll("[data-service]").forEach(function (link) {
    link.addEventListener("click", function () {
        serviceSelect.value = link.dataset.service;
    });
});

// Quita el estado de error en cuanto el usuario corrige el campo.
contactForm.addEventListener("input", function (event) {
    event.target.removeAttribute("aria-invalid");

    if (formMessage.dataset.state === "error") {
        showFormMessage(
            "Se abrirá tu aplicación de correo para enviar la consulta.",
            ""
        );
    }
});

contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
        const invalidFields = contactForm.querySelectorAll(":invalid");

        invalidFields.forEach(function (field) {
            field.setAttribute("aria-invalid", "true");
        });

        showFormMessage(
            "Revisá los campos marcados antes de continuar.",
            "error"
        );

        invalidFields[0].focus();
        return;
    }

    // Evita abrir un correo dirigido a una dirección ficticia.
    if (contactEmail === "tuemail@ejemplo.com") {
        showFormMessage(
            "El formulario funciona, pero primero tenés que configurar " +
            "tu correo comercial en script.js.",
            "error"
        );

        return;
    }

    const formData = new FormData(contactForm);

    const nombre = String(formData.get("nombre")).trim();
    const email = String(formData.get("email")).trim();
    const servicio = String(formData.get("servicio")).trim();
    const detalle = String(formData.get("detalle")).trim();

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

    showFormMessage(
        "Abriendo tu aplicación de correo. Si no se abre, escribinos a " +
        contactEmail + ".",
        "success"
    );

    window.location.href = mailtoLink;
});
