const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const explosionSound = new Audio('./explosion.mp3'); // Fichier audio pour les explosions

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Classe pour les particules
class Particle {
    constructor(x, y, color, speedX, speedY, size) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.speedX = speedX;
        this.speedY = speedY;
        this.size = size;
        this.alpha = 1;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha -= 0.02;
        this.size *= 0.95;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
}

function createFirework(x, y) {
    const particles = [];
    const numParticles = 50 + Math.random() * 50;
    for (let i = 0; i < numParticles; i++) {
        const angle = Math.random() * 2 * Math.PI;
        const speed = Math.random() * 5 + 2;
        const size = Math.random() * 3 + 2;
        const color = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.8)`;
        particles.push(new Particle(x, y, color, Math.cos(angle) * speed, Math.sin(angle) * speed, size));
    }
    return particles;
}

let fireworks = [];
function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    fireworks.forEach((firework, index) => {
        firework.forEach((particle, i) => {
            particle.update();
            particle.draw();
            if (particle.alpha <= 0) firework.splice(i, 1);
        });
        if (firework.length === 0) fireworks.splice(index, 1);
    });

    requestAnimationFrame(animate);
}

// Générer des feux aléatoires
setInterval(() => {
    fireworks.push(createFirework(Math.random() * canvas.width, Math.random() * (canvas.height / 2)));
    explosionSound.currentTime = 0;
    explosionSound.play();
}, 800);

// Interaction utilisateur
canvas.addEventListener('click', (e) => {
    fireworks.push(createFirework(e.clientX, e.clientY));
    explosionSound.currentTime = 0;
    explosionSound.play();
});

// Compte à rebours
const countdownEl = document.getElementById('countdown');
let countdown = 10;
const countdownInterval = setInterval(() => {
    countdownEl.textContent = countdown--;
    if (countdown < 0) {
        countdownEl.style.display = 'none';
        clearInterval(countdownInterval);
    }
}, 1000);

// Plein écran
document.getElementById('fullscreen').addEventListener('click', () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
});

// Messages festifs
const messages = ['Bonne Année ! 🎉', '🎆 Félicitations !', '🎇 Nouvel An, Nouveau Départ !', 'Plein de Bonheur 🎊'];
const messageEl = document.getElementById('message');
setInterval(() => {
    messageEl.textContent = messages[Math.floor(Math.random() * messages.length)];
}, 3000);

animate();
