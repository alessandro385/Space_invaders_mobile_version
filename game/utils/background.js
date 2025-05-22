import { PERFORMANCE_CONFIG } from '../constants.js';

export class Background {
  constructor(canvas, zone = 1) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.offset = 0;
    this.speed = 2;
    this.zone = zone;
    this.snowflakes = this.createSnowflakes();
    this.lastUpdateTime = Date.now();
    
    // Performance tracking per mobile
    this.frameCount = 0;
    this.lastFPSCheck = Date.now();
    this.currentFPS = 60;
  }

  createSnowflakes() {
    const flakes = [];
    
    // Ridotto numero di fiocchi per performance mobile
    const layers = [
      { count: 60, size: 2, speed: 1, opacity: 0.7 },    // Ridotto da 150
      { count: 40, size: 3, speed: 1.5, opacity: 0.8 },  // Ridotto da 100
      { count: 30, size: 4, speed: 2, opacity: 0.9 }     // Ridotto da 70
    ];

    layers.forEach(layer => {
      for (let i = 0; i < layer.count; i++) {
        flakes.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          size: layer.size + Math.random(), // Leggera variazione
          speed: layer.speed + (Math.random() * 0.5 - 0.25),
          opacity: layer.opacity + (Math.random() * 0.2 - 0.1),
          wind: Math.random() * 0.3 - 0.15, // Ridotto movimento laterale
          angle: Math.random() * Math.PI * 2 // Per rotazione
        });
      }
    });

    return flakes;
  }

  update() {
    const now = Date.now();
    const deltaTime = now - this.lastUpdateTime;
    this.lastUpdateTime = now;
    
    // FPS monitoring per ottimizzazione automatica
    this.frameCount++;
    if (now - this.lastFPSCheck > 1000) {
      this.currentFPS = this.frameCount;
      this.frameCount = 0;
      this.lastFPSCheck = now;
      
      // Auto-ottimizzazione se FPS troppo bassi
      if (this.currentFPS < PERFORMANCE_CONFIG.MIN_FPS) {
        this.optimizeForPerformance();
      }
    }
    
    // Aggiorna fiocchi di neve con delta time per fluidità
    const speedMultiplier = deltaTime / 16.67; // Normalizza a 60 FPS
    
    this.snowflakes.forEach(flake => {
      flake.y += flake.speed * speedMultiplier;
      flake.x += flake.wind * speedMultiplier;
      flake.angle += 0.02 * speedMultiplier; // Rotazione leggera

      // Reset position quando escono dallo schermo
      if (flake.y > this.canvas.height + 10) {
        flake.y = -10;
        flake.x = Math.random() * this.canvas.width;
      }
      if (flake.x > this.canvas.width + 10) {
        flake.x = -10;
      } else if (flake.x < -10) {
        flake.x = this.canvas.width + 10;
      }
    });
  }

  draw() {
    // Gradient background ottimizzato
    let gradient;
    
    if (this.zone === 1) {
      gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
      gradient.addColorStop(0, '#87CEEB');
      gradient.addColorStop(1, '#FFFFFF');
    } else {
      gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
      gradient.addColorStop(0, '#0C1445');
      gradient.addColorStop(0.7, '#2A3B80');
      gradient.addColorStop(1, '#6B7DB3');
    }

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Stelle per zona 2+ (ottimizzate)
    if (this.zone > 1) {
      this.drawStars();
    }

    // Disegna fiocchi di neve con ottimizzazioni
    this.drawSnowflakes();
  }
  
  drawStars() {
    const time = Date.now() / 1000;
    const starCount = this.currentFPS > 45 ? 60 : 30; // Adatta in base alle performance
    
    this.ctx.save();
    
    for (let i = 0; i < starCount; i++) {
      // Posizioni pseudo-casuali ma stabili
      const x = (Math.sin(i * 573.23) * 0.5 + 0.5) * this.canvas.width;
      const y = (Math.cos(i * 324.45) * 0.5 + 0.5) * this.canvas.height * 0.7;
      
      // Dimensione e opacità animate ma semplificate
      const baseSize = 1 + (i % 3);
      const size = baseSize + Math.sin(i + time * 0.5) * 0.5;
      const opacity = 0.6 + Math.sin(i + time * 0.3) * 0.3;
      
      this.ctx.beginPath();
      this.ctx.arc(x, y, size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      this.ctx.fill();
    }
    
    this.ctx.restore();
  }
  
  drawSnowflakes() {
    this.ctx.save();
    
    // Raggruppa flakes per dimensione per ridurre i cambio di stato
    const flakesBySize = new Map();
    
    this.snowflakes.forEach(flake => {
      const size = Math.floor(flake.size);
      if (!flakesBySize.has(size)) {
        flakesBySize.set(size, []);
      }
      flakesBySize.get(size).push(flake);
    });
    
    // Disegna per gruppi di dimensione
    flakesBySize.forEach((flakes, size) => {
      flakes.forEach(flake => {
        this.ctx.save();
        this.ctx.globalAlpha = flake.opacity;
        
        // Per flakes più grandi, aggiungi rotazione
        if (size >= 3) {
          this.ctx.translate(flake.x, flake.y);
          this.ctx.rotate(flake.angle);
          this.drawSnowflakeShape(0, 0, flake.size);
          this.ctx.restore();
        } else {
          // Flakes piccoli come cerchi semplici
          this.ctx.beginPath();
          this.ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
          this.ctx.fillStyle = 'white';
          this.ctx.fill();
          this.ctx.restore();
        }
      });
    });
    
    this.ctx.restore();
  }
  
  // Disegna forma fiocco di neve semplificata
  drawSnowflakeShape(x, y, size) {
    this.ctx.strokeStyle = 'white';
    this.ctx.lineWidth = 1;
    this.ctx.lineCap = 'round';
    
    // Forma semplificata a 6 punte
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const x1 = x + Math.cos(angle) * size;
      const y1 = y + Math.sin(angle) * size;
      
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.ctx.lineTo(x1, y1);
      this.ctx.stroke();
    }
  }
  
  // Ottimizzazione automatica per performance
  optimizeForPerformance() {
    // Riduce il numero di fiocchi se le performance sono scarse
    if (this.snowflakes.length > 60) {
      this.snowflakes = this.snowflakes.slice(0, Math.floor(this.snowflakes.length * 0.8));
      console.log('🔧 Background ottimizzato per performance mobile. Fiocchi ridotti a:', this.snowflakes.length);
    }
  }
  
  // Imposta zona con aggiornamento dei parametri
  setZone(zone) {
    this.zone = zone;
    
    // Aggiorna i fiocchi per la nuova zona se necessario
    if (zone > 1 && this.snowflakes.length < 100) {
      // Zona notturna, può permettersi più fiocchi se le performance lo consentono
      if (this.currentFPS > 50) {
        const additionalFlakes = this.createSnowflakes().slice(0, 20);
        this.snowflakes.push(...additionalFlakes);
      }
    }
  }
  
  // Resize handler per mobile
  handleResize(newWidth, newHeight) {
    this.canvas.width = newWidth;
    this.canvas.height = newHeight;
    
    // Redistribuisci i fiocchi per le nuove dimensioni
    this.snowflakes.forEach(flake => {
      if (flake.x > newWidth) flake.x = Math.random() * newWidth;
      if (flake.y > newHeight) flake.y = Math.random() * newHeight;
    });
  }
  
  // Debug info per sviluppo
  getDebugInfo() {
    return {
      snowflakeCount: this.snowflakes.length,
      currentFPS: this.currentFPS,
      zone: this.zone,
      canvasSize: `${this.canvas.width}x${this.canvas.height}`
    };
  }
} 