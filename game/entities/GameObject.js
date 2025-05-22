import { ASSETS, loadImage } from '../assets.js';
import { SPRITE_SIZES } from '../constants.js';

export class GameObject {
    constructor(x, y, type, canvas, speed = 2, health = 1) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.canvas = canvas;
        this.speed = speed;
        this.active = true;
        this.width = SPRITE_SIZES[type].width;
        this.height = SPRITE_SIZES[type].height;
        this.image = null;
        this.health = health;
        this.maxHealth = health;
        this.zIndex = type === 'extraLife' ? 1000 : 1;
        this.loadImage();
        
        // Proprietà per ottimizzazioni mobile
        this.creationTime = Date.now();
        this.lastUpdateTime = Date.now();
        this.animationFrame = 0;
        
        // Effetti ridotti per performance
        this.enableEffects = true;
        this.pulseIntensity = 0;
        this.glowRadius = 0;
    }

    async loadImage() {
        try {
            this.image = await loadImage(ASSETS[this.type]);
        } catch (error) {
            console.error(`Errore nel caricamento dell'immagine per ${this.type}:`, error);
        }
    }

    update() {
        const now = Date.now();
        const deltaTime = now - this.lastUpdateTime;
        this.lastUpdateTime = now;
        
        // Movimento più fluido con deltaTime
        this.y += this.speed * (deltaTime / 16.67); // Normalizza a 60 FPS
        
        // Controllo del tempo di vita per oggetti che lo supportano
        if (this.lifespan && this.creationTime) {
            if (now - this.creationTime > this.lifespan) {
                this.active = false;
                console.log(`Oggetto ${this.type} rimosso per scadenza tempo di vita`);
            }
        }
        
        // Aggiorna frame di animazione per effetti
        this.animationFrame += deltaTime / 100;
    }

    draw(ctx) {
        if (!this.image || !this.active) return;
        
        ctx.save();
        
        // Effetti speciali ottimizzati per mobile solo per extraLife
        if (this.type === 'extraLife' && this.enableEffects) {
            this.drawExtraLifeEffects(ctx);
        } else {
            // Rendering normale ottimizzato
            this.drawNormal(ctx);
        }
        
        // Barra della salute per oggetti con più vite (semplificata per mobile)
        if (this.maxHealth > 1 && this.health > 0) {
            this.drawHealthBar(ctx);
        }
        
        ctx.restore();
    }
    
    drawExtraLifeEffects(ctx) {
        // Versione semplificata degli effetti per mobile
        const time = this.animationFrame;
        const pulseFactor = 0.2 + Math.abs(Math.sin(time / 100)) * 0.3; // Effetto più contenuto
        
        // Glow semplificato
        if (Math.random() > 0.7) { // Effetto intermittente per performance
            const glowSize = this.width * (1.5 + pulseFactor);
            const gradient = ctx.createRadialGradient(
                this.x + this.width / 2, this.y + this.height / 2, 0,
                this.x + this.width / 2, this.y + this.height / 2, glowSize
            );
            gradient.addColorStop(0, 'rgba(255, 0, 0, 0.4)');
            gradient.addColorStop(0.7, 'rgba(255, 215, 0, 0.2)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(
                this.x + this.width / 2,
                this.y + this.height / 2,
                glowSize,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }
        
        // Shadow ottimizzata
        ctx.shadowColor = 'red';
        ctx.shadowBlur = 8 + Math.sin(time / 80) * 4;
        
        // Disegna il cuore con scale
        const scale = 1 + pulseFactor;
        const offsetX = (this.width * scale - this.width) / 2;
        const offsetY = (this.height * scale - this.height) / 2;
        
        ctx.drawImage(
            this.image,
            this.x - offsetX,
            this.y - offsetY,
            this.width * scale,
            this.height * scale
        );
        
        // Reset shadow
        ctx.shadowBlur = 0;
    }
    
    drawNormal(ctx) {
        // Rendering standard ottimizzato
        ctx.drawImage(
            this.image,
            this.x,
            this.y,
            this.width,
            this.height
        );
    }
    
    drawHealthBar(ctx) {
        const barWidth = this.width;
        const barHeight = 4;
        const barX = this.x;
        const barY = this.y - 8;
        
        // Sfondo barra semplificato
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        
        // Barra della salute con colori ottimizzati
        const healthPercentage = this.health / this.maxHealth;
        ctx.fillStyle = healthPercentage > 0.5 ? '#4CAF50' : '#F44336';
        const healthWidth = healthPercentage * barWidth;
        ctx.fillRect(barX, barY, healthWidth, barHeight);
        
        // Bordo sottile
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, barY, barWidth, barHeight);
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
    
    // Metodo per danneggiare l'oggetto
    takeDamage(amount = 1) {
        this.health -= amount;
        
        // Feedback visivo per danno su mobile
        this.pulseIntensity = 1;
        
        if (this.health <= 0) {
            this.health = 0;
            this.destroy();
        }
        
        // Trasformazioni sprite per damage states
        if (this.type === 'armoredSnowman' && this.health === 1 && this.maxHealth > 1) {
            this.type = 'snowmanObstacle';
            this.loadImage();
        }
        if (this.type === 'reinforcedObstacle' && this.health === 1 && this.maxHealth > 1) {
            this.type = 'obstacle';
            this.loadImage();
        }
    }
    
    // Metodo per distruggere l'oggetto
    destroy() {
        this.active = false;
        
        // Effetto di distruzione semplificato per mobile
        if (navigator.vibrate && (this.type.includes('Obstacle') || this.type.includes('Snowman'))) {
            navigator.vibrate(30); // Feedback aptico breve
        }
    }
    
    // Metodi specifici per mobile
    
    // Disabilita effetti per migliorare performance
    disableEffects() {
        this.enableEffects = false;
    }
    
    // Riabilita effetti
    enableEffects() {
        this.enableEffects = true;
    }
    
    // Verifica se l'oggetto è visibile sullo schermo
    isVisible() {
        return this.y > -this.height && 
               this.y < this.canvas.height + this.height &&
               this.x > -this.width && 
               this.x < this.canvas.width + this.width;
    }
    
    // Ottimizzazione: aggiorna solo se visibile
    updateIfVisible() {
        if (this.isVisible()) {
            this.update();
            return true;
        }
        return false;
    }
    
    // Metodo per applicare bonus vita con effetti ridotti
    applyExtraLifeEffect() {
        if (this.type === 'extraLife') {
            this.pulseIntensity = 1;
            this.glowRadius = this.width * 2;
            
            // Riduce effetti dopo un po'
            setTimeout(() => {
                this.pulseIntensity = 0.5;
                this.glowRadius = this.width;
            }, 1000);
        }
    }
    
    // Info di debug per sviluppo mobile
    getDebugInfo() {
        return {
            type: this.type,
            position: { x: Math.floor(this.x), y: Math.floor(this.y) },
            health: `${this.health}/${this.maxHealth}`,
            active: this.active,
            visible: this.isVisible(),
            effects: this.enableEffects,
            age: Math.floor((Date.now() - this.creationTime) / 1000) + 's'
        };
    }
} 