// Force scroll to top on page reload
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
} else {
    window.onbeforeunload = function () {
        window.scrollTo(0, 0);
    }
}
window.onload = function () {
    window.scrollTo(0, 0);
};

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(0, 0, 0, 0.95)';
        navbar.style.padding = '15px 40px';
    } else {
        navbar.style.background = 'rgba(0, 0, 0, 0.8)';
        navbar.style.padding = '20px 40px';
    }
});

// Simple Intersection Observer for Fade-in animations
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Stop observing once visible if we only want it to animate once
            // observer.unobserve(entry.target); 
        }
    });
}, observerOptions);

document.querySelectorAll('.info-content, .grid-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 1s cubic-bezier(0.2, 0.8, 0.2, 1), transform 1s cubic-bezier(0.2, 0.8, 0.2, 1)';
    observer.observe(el);
});

// Parallax Effect for Hero & Content
window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;

    // Hero Parallax
    const heroBg = document.querySelector('.hero-bg');
    const heroContent = document.querySelector('.hero-content');

    if (heroBg && scrollPosition < window.innerHeight) {
        heroBg.style.transform = `translateY(${scrollPosition * 0.5}px)`;
        if (heroContent) heroContent.style.transform = `translateY(${scrollPosition * 0.2}px)`;
    }

    // Content Parallax (Floating Sections)
    document.querySelectorAll('.info-section').forEach(section => {
        const distance = window.scrollY - section.offsetTop;
        if (Math.abs(distance) < window.innerHeight) {
            // Move content slightly to create depth against fixed bg
            const content = section.querySelector('.info-content');
            if (content) {
                content.style.transform = `translateY(${distance * 0.1}px)`;
            }
        }
    });
});

// Particle Network Animation
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;
let lastScrollY = window.scrollY; // Track scroll

// Create particle
class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY; // Natural drift
        this.size = size;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = 'rgba(255, 153, 0, 0.6)';
        ctx.fill();
    }

    update(scrollDelta) {
        // Natural movement
        this.x += this.directionX;
        this.y += this.directionY;

        // Scroll influence (Parallax: Move up as we scroll down)
        // Scroll influence (Parallax: Move up as we scroll down)
        // scrollDelta > 0 means scrolled down. We want particles to move UP (-y).
        // Background images are fixed (speed 0 relative to viewport).
        // To make particles appear "closer" than background but "behind" content,
        // they should move slightly (speed > 0). 
        // 0.2 provides a subtle shift against the fixed background.
        this.y -= scrollDelta * 0.2;

        // Boundary / Looping Management
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }

        // Wrap vertically to maintain density
        if (this.y < 0) {
            this.y = canvas.height;
            this.x = Math.random() * canvas.width; // Randomize x on wrap to avoid patterns
        }
        if (this.y > canvas.height) {
            this.y = 0;
            this.x = Math.random() * canvas.width;
        }

        this.draw();
    }
}

// create particle array
function init() {
    particlesArray = [];
    // Increase density: Divide by smaller number (e.g. 10000)
    let numberOfParticles = (canvas.height * canvas.width) / 10000;
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 2) + 1;
        // Create scattered particles, avoiding the center 40% of the screen
        // to keep text readable and distinct.
        let x = Math.random() * canvas.width;
        // If x is in the middle 40% (0.3 to 0.7), re-roll or offset
        if (x > canvas.width * 0.3 && x < canvas.width * 0.7) {
            if (Math.random() > 0.5) {
                x = Math.random() * (canvas.width * 0.3); // Left side
            } else {
                x = (canvas.width * 0.7) + Math.random() * (canvas.width * 0.3); // Right side
            }
        }

        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);

        // Natural drift: Bias upwards slightly
        let directionX = (Math.random() * 0.2) - 0.1;
        let directionY = (Math.random() * 0.2) - 0.15; // More negative bias

        let color = '#ff9900';

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

// check if particles are close enough to draw line between them
function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
                + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                opacityValue = 1 - (distance / 20000);
                // Visible lines (max 0.4)
                ctx.strokeStyle = 'rgba(255, 153, 0,' + (opacityValue * 0.4) + ')';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

// animation loop
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    // Calculate Scroll Delta
    const currentScrollY = window.scrollY;
    const scrollDelta = currentScrollY - lastScrollY;
    lastScrollY = currentScrollY;

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update(scrollDelta);
    }
    connect();
}

// resize event
window.addEventListener('resize',
    function () {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        init();
    }
);

init();
animate();

// Add class for visible state in CSS (dynamic injection for simplicity)
const style = document.createElement('style');
style.textContent = `
    .visible {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);
