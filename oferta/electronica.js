// Animación del contador de egresados - Versión mejorada
document.addEventListener('DOMContentLoaded', function() {
    const counter = document.getElementById('graduate-counter');
    if (counter) {
        let target = +153;
        let current = 0;
        // Ajustamos la velocidad: incremento más pequeño para mayor duración
        let increment = Math.max(1, Math.floor(target / 200)); // Más pasos = animación más larga
        
        let timer = setInterval(function() {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
                // Agregar el signo "+" al inicio con el mismo estilo
                counter.textContent = "+" + current.toLocaleString('es-MX');
            } else {
                // Mostrar número con separador de miles (coma)
                counter.textContent = current.toLocaleString('es-MX');
            }
        }, 15); // Ajustamos a 30ms para una animación más suave y larga
    }
    
    // Manejo del menú activo
    highlightActiveMenu();
    
    // Inicializar animaciones de scroll
    initScrollAnimation();
});

// Resaltar elemento activo en el menú
function highlightActiveMenu() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Manejo especial para el dropdown de oferta educativa
    if (currentPage === 'mantenimiento_automotriz.html' || currentPage === '') {
        const dropdownToggle = document.querySelector('.nav-link.dropdown-toggle');
        if (dropdownToggle) {
            dropdownToggle.classList.add('active');
        }
    }
}

// Smooth scrolling para anclas
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId !== '#') {
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Efecto de aparición para elementos al hacer scroll
function initScrollAnimation() {
    const animatedElements = document.querySelectorAll('.feature-box, .gallery-item, .info-box');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(element);
    });
}