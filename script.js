const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});

// --- Lluvia de Pétalos ---
class Petal {
  constructor() {
    this.reset();
    this.y = Math.random() * height;
  }

  reset() {
    this.x = Math.random() * width;
    this.y = -20;
    this.size = Math.random() * 8 + 6;
    this.speedY = Math.random() * 1.5 + 0.8;
    this.speedX = Math.random() * 0.8 - 0.4;
    this.angle = Math.random() * Math.PI * 2;
    this.spin = (Math.random() - 0.5) * 0.03;
    this.color = ['#FFD700', '#FFEB3B', '#FBC02D', '#FFF176'][Math.floor(Math.random() * 4)];
    this.opacity = Math.random() * 0.5 + 0.5;
  }

  update() {
    this.y += this.speedY;
    this.x += Math.sin(this.y * 0.01) + this.speedX;
    this.angle += this.spin;

    if (this.y > height + 20) {
      this.reset();
    }
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.globalAlpha = this.opacity;

    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(this.size, -this.size, this.size * 1.5, this.size, 0, this.size * 1.5);
    ctx.bezierCurveTo(-this.size * 1.5, this.size, -this.size, -this.size, 0, 0);
    ctx.fill();

    ctx.restore();
  }
}

const petals = Array.from({ length: 50 }, () => new Petal());

// --- Dibujar 1 flor individual ---
function drawSingleFlower(centerX, centerY, angleRad, stemCurve, petalScale = 1) {
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(angleRad);

  // Tallo
  ctx.beginPath();
  ctx.moveTo(0, 20);
  ctx.quadraticCurveTo(stemCurve * 0.5, 110, 0, 210);
  ctx.strokeStyle = '#4CAF50';
  ctx.lineWidth = 10 * petalScale;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Hoja Izquierda
  ctx.beginPath();
  ctx.moveTo(-5, 140);
  ctx.quadraticCurveTo(-50, 110, -55, 150);
  ctx.quadraticCurveTo(-25, 170, -5, 150);
  ctx.fillStyle = '#388E3C';
  ctx.fill();

  // Hoja Derecha
  ctx.beginPath();
  ctx.moveTo(3, 100);
  ctx.quadraticCurveTo(50, 70, 55, 110);
  ctx.quadraticCurveTo(25, 130, 3, 110);
  ctx.fillStyle = '#388E3C';
  ctx.fill();

  // Pétalos
  const numPetals = 16;
  const petalRadius = 65 * petalScale;

  for (let i = 0; i < numPetals; i++) {
    const pAngle = (i * 2 * Math.PI) / numPetals;
    ctx.save();
    ctx.rotate(pAngle);

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-18 * petalScale, -35 * petalScale, -15 * petalScale, -petalRadius, 0, -petalRadius - (15 * petalScale));
    ctx.bezierCurveTo(15 * petalScale, -petalRadius, 18 * petalScale, -35 * petalScale, 0, 0);

    const grad = ctx.createLinearGradient(0, 0, 0, -petalRadius);
    grad.addColorStop(0, '#FFA000');
    grad.addColorStop(0.4, '#FFD54F');
    grad.addColorStop(1, '#FFF59D');

    ctx.fillStyle = grad;
    ctx.fill();

    ctx.strokeStyle = '#F57F17';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore();
  }

  // Centro de la flor
  ctx.beginPath();
  ctx.arc(0, 0, 32 * petalScale, 0, Math.PI * 2);
  ctx.fillStyle = '#5D4037';
  ctx.fill();
  ctx.strokeStyle = '#3E2723';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, 0, 24 * petalScale, 0, Math.PI * 2);
  ctx.fillStyle = '#4E342E';
  ctx.fill();

  ctx.restore();
}

// --- Papel Trasero ---
function drawBackPaper(centerX, centerY) {
  ctx.save();
  ctx.translate(centerX, centerY + 180);

  ctx.beginPath();
  ctx.moveTo(0, 160);
  ctx.bezierCurveTo(-160, 20, -205, -200, -185, -320);
  ctx.bezierCurveTo(-95, -345, 95, -345, 185, -320);
  ctx.bezierCurveTo(205, -200, 160, 20, 0, 160);

  ctx.fillStyle = '#D7CCC8';
  ctx.fill();
  ctx.strokeStyle = '#8D6E63';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Pliegues
  ctx.beginPath();
  ctx.moveTo(-50, 60);
  ctx.quadraticCurveTo(-105, -100, -130, -270);
  ctx.moveTo(50, 60);
  ctx.quadraticCurveTo(105, -100, 130, -270);
  ctx.strokeStyle = '#A1887F';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.restore();
}

// --- Papel Frontal ---
function drawFrontPaper(centerX, centerY) {
  ctx.save();
  ctx.translate(centerX, centerY + 180);

  ctx.beginPath();
  ctx.moveTo(0, 160);
  ctx.bezierCurveTo(-90, 80, -160, -20, -170, -120);
  ctx.bezierCurveTo(-80, -105, 80, -105, 170, -120);
  ctx.bezierCurveTo(160, -20, 90, 80, 0, 160);

  ctx.fillStyle = '#C8B9B3';
  ctx.fill();
  ctx.strokeStyle = '#8D6E63';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Solapa diagonal
  ctx.beginPath();
  ctx.moveTo(0, 160);
  ctx.lineTo(-40, -110);
  ctx.strokeStyle = '#A1887F';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.restore();
}

// --- Moño ---
function drawBow(centerX, centerY) {
  ctx.save();
  ctx.translate(centerX, centerY + 180);

  ctx.fillStyle = '#E53935';
  ctx.strokeStyle = '#B71C1C';
  ctx.lineWidth = 2;

  // Lazo Izquierdo
  ctx.beginPath();
  ctx.bezierCurveTo(-40, -30, -60, 10, -10, 10);
  ctx.bezierCurveTo(-30, 25, -10, 30, 0, 0);
  ctx.fill();
  ctx.stroke();

  // Lazo Derecho
  ctx.beginPath();
  ctx.bezierCurveTo(40, -30, 60, 10, 10, 10);
  ctx.bezierCurveTo(30, 25, 10, 30, 0, 0);
  ctx.fill();
  ctx.stroke();

  // Nudo Central
  ctx.beginPath();
  ctx.arc(0, 0, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Cintas
  ctx.beginPath();
  ctx.moveTo(-4, 8);
  ctx.quadraticCurveTo(-18, 35, -12, 60);
  ctx.lineTo(-22, 63);
  ctx.quadraticCurveTo(-25, 35, -10, 10);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(4, 8);
  ctx.quadraticCurveTo(18, 35, 12, 60);
  ctx.lineTo(22, 63);
  ctx.quadraticCurveTo(25, 35, 10, 10);
  ctx.fill();

  ctx.restore();
}

// --- Dibujar Ramo ---
function drawBouquet(centerX, centerY) {
  // 1. Papel de atrás
  drawBackPaper(centerX, centerY);

  // 2. Flores y tallos
  // Capa Atrás
  drawSingleFlower(centerX - 120, centerY - 70, -0.18, 60, 0.88);
  drawSingleFlower(centerX + 120, centerY - 70, 0.18, -60, 0.88);
  drawSingleFlower(centerX + 15, centerY - 100, 0, -15, 0.9);

  // Capa Medio
  drawSingleFlower(centerX - 80, centerY - 15, 0.22, 50, 0.91);
  drawSingleFlower(centerX + 90, centerY - 25, -0.10, -50, 0.93);

  // Capa Adelante
  drawSingleFlower(centerX - 60, centerY + 25, -0.08, 30, 0.95);
  drawSingleFlower(centerX + 60, centerY + 25, 0.08, -30, 0.95);
  drawSingleFlower(centerX - 15, centerY - 25, 0, 15, 1);

  // 3. Papel frontal y moño
  drawFrontPaper(centerX, centerY);
  drawBow(centerX, centerY);
}

// --- Bucle de Animación ---
function animate() {
  const centerX = width / 2;
  const centerY = height / 2 - 10;

  // Fondo cálido con luz centrada
  const bgGradient = ctx.createRadialGradient(
    centerX, centerY - 30, 20,
    centerX, centerY, Math.max(width, height) * 0.65
  );
  bgGradient.addColorStop(0, '#4A3B10');
  bgGradient.addColorStop(0.35, '#1F1705');
  bgGradient.addColorStop(1, '#080602');

  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, height);

  // Ramo
  drawBouquet(centerX, centerY);

  // Pétalos
  petals.forEach(p => {
    p.update();
    p.draw();
  });

  requestAnimationFrame(animate);
}

animate();