// Particle Animation
const canvas = document.getElementById('particle-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 80;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(99, 102, 241, 0.5)';
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        particles.forEach((p1, i) => {
            particles.slice(i + 1).forEach(p2 => {
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(99, 102, 241, ${0.2 * (1 - distance / 150)})`;
                    ctx.stroke();
                }
            });
        });

        requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Contact Form Handler
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
        const body = encodeURIComponent(`From: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
        const mailtoUrl = `mailto:ikajalpatel21@gmail.com?subject=${subject}&body=${body}`;

        // Diagnostic log to help debug why mailto might not open in some environments
        console.log('Contact form mailto URL:', mailtoUrl);

        // First try: navigate to the mailto URL (works in most browsers when run from http/https)
        try {
            window.location.href = mailtoUrl;
        } catch (err) {
            console.warn('Direct navigation to mailto failed:', err);
        }

        // Fallback: create a temporary anchor and programmatically click it. This can succeed when
        // direct assignment to window.location is blocked (e.g., some file:// contexts or strict browsers).
        setTimeout(() => {
            const testAnchor = document.createElement('a');
            testAnchor.href = mailtoUrl;
            testAnchor.style.display = 'none';
            testAnchor.target = '_blank';
            document.body.appendChild(testAnchor);
            testAnchor.click();
            document.body.removeChild(testAnchor);
        }, 150);
    });
}

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Add logging for mailto anchors to help debug when clicking email links doesn't open a mail client.
document.querySelectorAll('a[href^="mailto:"]').forEach(a => {
    a.addEventListener('click', (e) => {
        console.log('mailto link clicked:', a.href);
        // allow default behavior to proceed; if it's blocked we leave logs to investigate
        // Optional: preventDefault and try programmatic click fallback similar to the form if desired
    });
});