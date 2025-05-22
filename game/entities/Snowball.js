import { SPRITE_SIZES } from '../constants.js';

export class Snowball {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = SPRITE_SIZES.snowball.width;
    this.height = SPRITE_SIZES.snowball.height;
    this.speed = 12; // Leggermente più lenta per mobile
    this.active = true;
    
    // NUOVO: Supporto movimento laterale per sparo multiplo
    this.velocityX = 0; // Velocità laterale
    this.velocityY = this.speed; // Velocità verticale
    
    // Proprietà per effetti visivi su mobile
    this.trail = [];
    this.maxTrailLength = 8; // Scia più corta per performance
  }

  update() {
    if (!this.active) return;
    
    // NUOVO: Aggiorna posizione con entrambe le velocità
    this.x += this.velocityX;
    this.y -= this.velocityY; // Movimento verso l'alto
    
    // Aggiorna scia per effetto visivo
    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > this.maxTrailLength) {
      this.trail.shift();
    }
    
    // Rimuovi se esce dallo schermo (anche lateralmente)
    if (this.y < -this.height || this.x < -this.width || this.x > window.innerWidth + this.width) {
      this.active = false;
    }
  }

  draw(ctx) {
    if (!this.active) return;
    
    ctx.save();
    
    // Disegna scia per effetto movimento su mobile
    if (this.trail.length > 1) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = Math.max(1, this.width / 3);
      ctx.lineCap = 'round';
      
      for (let i = 1; i < this.trail.length; i++) {
        const opacity = i / this.trail.length * 0.6;
        ctx.globalAlpha = opacity;
        
        ctx.beginPath();
        ctx.moveTo(this.trail[i-1].x + this.width/2, this.trail[i-1].y + this.height/2);
        ctx.lineTo(this.trail[i].x + this.width/2, this.trail[i].y + this.height/2);
        ctx.stroke();
      }
    }
    
    // Reset alpha per la snowball principale
    ctx.globalAlpha = 1;
    
    // Disegna la palla di neve con effetto luminoso
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;
    const radius = this.width / 2;
    
    // Ombra/glow
    ctx.shadowColor = 'rgba(173, 216, 230, 0.8)';
    ctx.shadowBlur = 8;
    
    // Cerchio principale bianco
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Highlight per effetto 3D
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.beginPath();
    ctx.arc(centerX - radius/3, centerY - radius/3, radius/2, 0, Math.PI * 2);
    ctx.fill();
    
    // Bordo sottile per migliore visibilità su mobile
    ctx.strokeStyle = 'rgba(200, 200, 255, 0.8)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.restore();
  }

  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }
  
  // Metodo specifico per mobile: imposta scia più lunga per powerup
  setPowerupTrail() {
    this.maxTrailLength = 12;
    this.velocityY = 15; // Più veloce
  }
  
  // NUOVO: Imposta velocità laterale per sparo multiplo
  setLateralVelocity(vx) {
    this.velocityX = vx;
  }
  
  // Metodo per debugging su mobile
  getDebugInfo() {
    return {
      position: { x: this.x, y: this.y },
      velocity: { x: this.velocityX, y: this.velocityY },
      active: this.active,
      speed: this.speed,
      trailLength: this.trail.length
    };
  }
} 