import { ASSETS, loadImage } from '../assets.js';
import { SPRITE_SIZES, TOUCH_CONFIG, GAME_CONFIG } from '../constants.js';

export class Sleigh {
  constructor(canvas, type = 'default') {
    this.canvas = canvas;
    this.type = type;
    this.width = SPRITE_SIZES.sleigh.width;
    this.height = SPRITE_SIZES.sleigh.height;
    this.x = (canvas.width - this.width) / 2;
    this.y = canvas.height - this.height - 50;
    this.image = null;
    
    // NUOVO: Sistema velocità migliorato dalle configurazioni
    this.speed = GAME_CONFIG.SLEIGH_SPEED.BASE;
    this.velocityX = 0;
    this.velocityY = 0;
    this.friction = GAME_CONFIG.SLEIGH_SPEED.FRICTION;
    this.acceleration = GAME_CONFIG.SLEIGH_SPEED.ACCELERATION;
    this.maxVelocity = GAME_CONFIG.SLEIGH_SPEED.MAX_VELOCITY;
    this.baseMaxVelocity = GAME_CONFIG.SLEIGH_SPEED.MAX_VELOCITY; // Salvato per reset
    
    // Effetti visivi per mobile
    this.tilt = 0; // Inclinazione della slitta
    this.targetTilt = 0;
    this.trail = [];
    this.maxTrailLength = 15;
    
    // Feedback visivo per touch
    this.isMoving = false;
    this.lastMoveTime = 0;
    this.glowIntensity = 0;
    
    this.loadImage();
  }

  async loadImage() {
    try {
      // CORRETTO: Usa i nomi corretti delle chiavi delle slitte
      let assetKey;
      if (this.type === 'sleigh' || this.type === 'default') {
        assetKey = 'sleigh';
      } else if (this.type === 'sleighRed') {
        assetKey = 'sleighRed';
      } else if (this.type === 'sleighGreen') {
        assetKey = 'sleighGreen';
      } else {
        assetKey = 'sleigh'; // Default fallback
      }
      
      console.log(`🚁 Caricamento slitta tipo: ${this.type} -> asset: ${assetKey}`);
      this.image = await loadImage(ASSETS[assetKey]);
    } catch (error) {
      console.error(`Errore nel caricamento dell'immagine della slitta (${this.type}):`, error);
    }
  }

  // Movimento ottimizzato per touch con accelerazione fluida
  moveWithAcceleration(inputX, inputY) {
    // Applica input con sensibilità touch
    const sensitivity = TOUCH_CONFIG.JOYSTICK_SENSITIVITY;
    const targetVelX = inputX * this.maxVelocity * sensitivity;
    const targetVelY = inputY * this.maxVelocity * sensitivity;
    
    // Accelerazione graduale verso la velocità target
    this.velocityX += (targetVelX - this.velocityX) * this.acceleration;
    this.velocityY += (targetVelY - this.velocityY) * this.acceleration;
    
    // Applica dead zone per evitare micro-movimenti
    if (Math.abs(this.velocityX) < 0.5) this.velocityX = 0;
    if (Math.abs(this.velocityY) < 0.5) this.velocityY = 0;
    
    // Aggiorna posizione
    this.x += this.velocityX;
    this.y += this.velocityY;
    
    // CORRETTO: Calcola inclinazione SOLO per movimento orizzontale significativo
    // La slitta si inclina solo quando si muove lateralmente, non per movimento verticale
    if (Math.abs(inputX) > 0.3) {
      // Solo movimento orizzontale significativo causa inclinazione
      this.targetTilt = inputX * 0.15; // Inclinazione basata sull'input, non sulla velocità
    } else {
      // Quando non c'è movimento orizzontale, torna dritta
      this.targetTilt = 0;
    }
    
    // Mantieni entro i limiti dello schermo con margine
    const margin = 5;
    this.x = Math.max(margin, Math.min(this.canvas.width - this.width - margin, this.x));
    this.y = Math.max(margin, Math.min(this.canvas.height - this.height - margin, this.y));
    
    // Aggiorna stato di movimento
    this.isMoving = Math.abs(inputX) > 0.1 || Math.abs(inputY) > 0.1;
    if (this.isMoving) {
      this.lastMoveTime = Date.now();
      this.glowIntensity = Math.min(1, this.glowIntensity + 0.1);
    } else {
      this.glowIntensity = Math.max(0, this.glowIntensity - 0.05);
    }
  }

  // Movimento legacy per compatibilità keyboard
  moveLeft() {
    this.moveWithAcceleration(-1, 0);
  }

  moveRight() {
    this.moveWithAcceleration(1, 0);
  }

  update() {
    // Applica attrito quando non c'è input
    if (!this.isMoving) {
      this.velocityX *= this.friction;
      this.velocityY *= this.friction;
      this.x += this.velocityX;
      this.y += this.velocityY;
      
      // CORRETTO: Quando non si muove, forza il ritorno a posizione dritta
      this.targetTilt = 0;
    }
    
    // MIGLIORATO: Aggiorna inclinazione più velocemente per tornare dritta
    const tiltSpeed = Math.abs(this.targetTilt) > 0 ? 0.15 : 0.25; // Più veloce per tornare a 0
    this.tilt += (this.targetTilt - this.tilt) * tiltSpeed;
    
    // Forza a zero se molto vicino per evitare oscillazioni
    if (Math.abs(this.tilt) < 0.01) {
      this.tilt = 0;
    }
    
    // Aggiorna scia per effetto visivo
    if (this.isMoving || Math.abs(this.velocityX) > 1 || Math.abs(this.velocityY) > 1) {
      this.trail.push({
        x: this.x + this.width / 2,
        y: this.y + this.height,
        opacity: 1,
        time: Date.now()
      });
    }
    
    // Gestisci scia: rimuovi punti vecchi e aggiorna opacità
    const now = Date.now();
    this.trail = this.trail.filter(point => {
      point.opacity -= 0.05;
      return point.opacity > 0 && (now - point.time) < 1000;
    });
    
    if (this.trail.length > this.maxTrailLength) {
      this.trail.shift();
    }
  }

  draw(ctx) {
    if (!this.image) return;
    
    ctx.save();
    
    // Disegna scia se presente
    this.drawTrail(ctx);
    
    // Effetto glow se in movimento
    if (this.glowIntensity > 0) {
      ctx.shadowColor = `rgba(255, 215, 0, ${this.glowIntensity * 0.6})`;
      ctx.shadowBlur = 15 * this.glowIntensity;
    }
    
    // Trasformazioni per inclinazione
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;
    
    ctx.translate(centerX, centerY);
    ctx.rotate(this.tilt);
    
    // Disegna la slitta
    ctx.drawImage(
      this.image,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );
    
    // Effetto particelle se in movimento veloce
    if (this.isMoving && Math.abs(this.velocityX) > 5) {
      this.drawSpeedParticles(ctx);
    }
    
    ctx.restore();
  }
  
  drawTrail(ctx) {
    if (this.trail.length < 2) return;
    
    ctx.save();
    
    // Disegna scia come gradiente
    for (let i = 1; i < this.trail.length; i++) {
      const current = this.trail[i];
      const previous = this.trail[i - 1];
      
      const opacity = current.opacity * 0.3;
      ctx.strokeStyle = `rgba(135, 206, 235, ${opacity})`;
      ctx.lineWidth = 3 * current.opacity;
      ctx.lineCap = 'round';
      
      ctx.beginPath();
      ctx.moveTo(previous.x, previous.y);
      ctx.lineTo(current.x, current.y);
      ctx.stroke();
    }
    
    ctx.restore();
  }
  
  drawSpeedParticles(ctx) {
    // Particelle di velocità laterali
    for (let i = 0; i < 3; i++) {
      const offsetX = (Math.random() - 0.5) * this.width;
      const offsetY = Math.random() * this.height / 2;
      
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.6})`;
      ctx.beginPath();
      ctx.arc(offsetX, offsetY, Math.random() * 2 + 1, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  getBounds() {
    // Hitbox leggermente ridotta per mobile (più permissiva)
    const tolerance = 8;
    return {
      x: this.x + tolerance,
      y: this.y + tolerance,
      width: this.width - (tolerance * 2),
      height: this.height - (tolerance * 2)
    };
  }

  reset() {
    this.x = (this.canvas.width - this.width) / 2;
    this.y = this.canvas.height - this.height - 50;
    this.velocityX = 0;
    this.velocityY = 0;
    this.tilt = 0;
    this.targetTilt = 0;
    this.trail = [];
    this.isMoving = false;
    this.glowIntensity = 0;
  }
  
  // Metodi specifici per mobile
  
  // NUOVO: Applica boost di velocità reale
  applyBoost() {
    // Applica boost velocità usando le configurazioni
    this.maxVelocity = this.baseMaxVelocity * GAME_CONFIG.SLEIGH_SPEED.BOOST_MULTIPLIER;
    this.glowIntensity = 1;
    this.maxTrailLength = 25;
    
    console.log(`⚡ Boost velocità attivato! Velocità: ${this.maxVelocity.toFixed(1)}`);
    
    // Reset dopo 20 secondi (configurazione moltiplicatori)
    setTimeout(() => {
      this.maxVelocity = this.baseMaxVelocity;
      this.maxTrailLength = 15;
      this.glowIntensity = 0;
      console.log('⚡ Boost velocità terminato');
    }, 20000);
  }
  
  // Feedback per collisione
  collisionFeedback() {
    // Effetto "shake" leggero
    this.x += (Math.random() - 0.5) * 4;
    this.y += (Math.random() - 0.5) * 4;
    
    // Mantieni nei limiti
    this.x = Math.max(0, Math.min(this.canvas.width - this.width, this.x));
    this.y = Math.max(0, Math.min(this.canvas.height - this.height, this.y));
  }
  
  // Informazioni di debug
  getDebugInfo() {
    return {
      position: { x: Math.floor(this.x), y: Math.floor(this.y) },
      velocity: { x: this.velocityX.toFixed(2), y: this.velocityY.toFixed(2) },
      tilt: this.tilt.toFixed(3),
      isMoving: this.isMoving,
      trailLength: this.trail.length,
      glowIntensity: this.glowIntensity.toFixed(2)
    };
  }
} 