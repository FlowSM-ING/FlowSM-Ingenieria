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

const formspreeEndpoint = "https://formspree.io/f/mwllvekk";

const contactForm = document.getElementById("contact-form");
const formMessage = document.getElementById("form-message");
const serviceSelect = document.getElementById("servicio");
const submitButton = contactForm.querySelector('button[type="submit"]');

function showFormMessage(text, state) {
    formMessage.textContent = text;
    formMessage.dataset.state = state || "";
}

// Preseleccionar el servicio desde las tarjetas.
document.querySelectorAll("[data-service]").forEach(function (link) {
    link.addEventListener("click", function () {
        serviceSelect.value = link.dataset.service;
    });
});

// Quitar errores cuando el usuario corrige un campo.
contactForm.addEventListener("input", function (event) {
    event.target.removeAttribute("aria-invalid");

    if (formMessage.dataset.state === "error") {
        showFormMessage(
            "Completá el formulario y enviá tu consulta.",
            ""
        );
    }
});

contactForm.addEventListener("submit", async function (event) {
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

    const originalButtonHTML = submitButton.innerHTML;

    submitButton.disabled = true;
    submitButton.textContent = "Enviando consulta...";

    showFormMessage("Enviando tu consulta...", "");

    try {
        const response = await fetch(formspreeEndpoint, {
            method: "POST",
            body: new FormData(contactForm),
            headers: {
                Accept: "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("No se pudo enviar el formulario.");
        }

        contactForm.reset();

        showFormMessage(
            "¡Gracias por contactarnos! Recibimos tu consulta y te responderemos a la brevedad.",
            "success"
        );
    } catch (error) {
        showFormMessage(
            "No pudimos enviar tu consulta. Intentá nuevamente o escribinos por correo.",
            "error"
        );
    } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonHTML;
    }
});

