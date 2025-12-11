document.addEventListener('DOMContentLoaded', () => {
    // Scroll Reveal Animation
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Animate feature cards on scroll
    document.querySelectorAll('.feature-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });

    // Handle intersection changes
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });

    document.querySelectorAll('.feature-card').forEach(card => revealObserver.observe(card));

    // Video Modal
    const modal = document.getElementById("videoModal");
    const btn = document.getElementById("openVideo");
    const closeBtn = document.getElementsByClassName("close")[0];
    const iframe = document.getElementById("modalIframe");

    if (btn) {
        btn.onclick = function () {
            modal.style.display = "flex";
            // Autoplay when modal opens
            iframe.src = "https://www.youtube.com/embed/0bvw4mu8jRQ?autoplay=1&si=vXq5Xq5Xq5Xq5Xq5";
        }
    }

    if (closeBtn) {
        closeBtn.onclick = function () {
            modal.style.display = "none";
            // Stop video
            iframe.src = "";
        }
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
            iframe.src = "";
        }
    }

    // Navbar transparency on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(5, 10, 20, 0.95)';
            navbar.style.padding = '1rem 5%';
            navbar.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
        } else {
            navbar.style.background = 'rgba(5, 10, 20, 0.8)';
            navbar.style.padding = '1.5rem 5%';
            navbar.style.boxShadow = 'none';
        }
    });
});
