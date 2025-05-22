import { ASSETS, loadImage } from '../assets.js';
import { SPRITE_SIZES } from '../constants.js';

export class Boss {
    constructor(canvas, zone = 1) {
        this.canvas = canvas;
        this.width = SPRITE_SIZES.evilSanta.width;
        this.height = SPRITE_SIZES.evilSanta.height;
        this.x = (canvas.width - this.width) / 2;
        this.y = -this.height;
        this.targetY = 50;
        this.zone = zone;
        
        // Salute adattata per mobile (leggermente ridotta)
        this.health = zone === 1 ? 40 : 120; // Ridotto per mobile
        this.maxHealth = zone === 1 ? 40 : 120;
        this.active = true;
        
        // Attacchi ottimizzati per mobile
        this.attackCooldown = 0;
        this.attackInterval = zone === 1 ? 1400 : 1000; // Più lento per mobile
        this.lastAttackTime = 0;
        this.projectiles = [];
        
        // Movimento semplificato per mobile
        this.movementPhase = 0;
        this.movementTimer = 0;
        this.horizontalSpeed = zone === 1 ? 2.5 : 3.5; // Ridotto per mobile
        this.verticalSpeed = zone === 1 ? 1 : 1.5;
        
        this.image = null;
        this.lastUpdateTime = Date.now();
        
        // Effetti ridotti per performance mobile
        this.enableParticles = true;
        this.particleCount = 0;
        this.maxParticles = zone === 1 ? 15 : 25; // Ridotto per mobile
        
        this.initBoss();
    }

    async initBoss() {
        try {
            this.image = await loadImage(ASSETS.evilSanta);
            console.log(`🎯 Boss Zona ${this.zone} caricato per mobile (Salute: ${this.health})`);
        } catch (error) {
            console.error("Errore nel caricamento dell'immagine del boss:", error);
        }
    }

    update(deltaTime) {
        if (!this.active) return;

        const now = Date.now();
        
        // Fase di entrata
        if (this.y < this.targetY) {
            this.y += 2 * (deltaTime / 16.67);
        } else {
            // Movimento semplificato per mobile
            this.updateMovement(deltaTime);
            
            // Attacchi
            if (now - this.lastAttackTime > this.attackInterval) {
                this.attack();
                this.lastAttackTime = now;
            }
        }
        
        // Aggiorna proiettili con ottimizzazioni
        this.updateProjectiles(deltaTime);
    }
    
    updateMovement(deltaTime) {
        this.movementTimer += deltaTime;
        
        // Cambio fase movimento più lento per mobile
        const phaseInterval = this.zone === 1 ? 2500 : 2000;
        if (this.movementTimer > phaseInterval) {
            this.movementPhase = (this.movementPhase + 1) % 4; // Solo 4 fasi per mobile
            this.movementTimer = 0;
        }
        
        const speedMultiplier = deltaTime / 16.67;
        
        switch (this.movementPhase) {
            case 0: // Movimento sinistra
                this.x -= this.horizontalSpeed * speedMultiplier;
                if (this.x < 0) {
                    this.x = 0;
                    this.movementPhase = 1;
                }
                break;
                
            case 1: // Movimento destra
                this.x += this.horizontalSpeed * speedMultiplier;
                if (this.x > this.canvas.width - this.width) { 
                    this.x = this.canvas.width - this.width;
                    this.movementPhase = 0;
                }
                break;
                
            case 2: // Movimento circolare semplificato
                const time = this.movementTimer / 400;
                this.x += this.horizontalSpeed * Math.cos(time) * speedMultiplier;
                this.y += this.verticalSpeed * Math.sin(time) * speedMultiplier * 0.5;
                this.y = Math.min(this.y, this.targetY + 50);
                this.y = Math.max(this.y, this.targetY - 20);
                break;
                
            case 3: // Inseguimento semplificato
                const playerX = this.canvas.width / 2; // Assumi player al centro
                const targetX = playerX - this.width / 2;
                const diffX = targetX - this.x;
                this.x += Math.sign(diffX) * Math.min(Math.abs(diffX), this.horizontalSpeed * speedMultiplier);
                break;
        }
        
        // Mantieni entro i limiti
        this.x = Math.max(0, Math.min(this.canvas.width - this.width, this.x));
    }
    
    updateProjectiles(deltaTime) {
        const speedMultiplier = deltaTime / 16.67;
        
        this.projectiles = this.projectiles.filter(projectile => {
            projectile.y += projectile.speedY * speedMultiplier;
            projectile.x += projectile.speedX * speedMultiplier;
            
            return projectile.y < this.canvas.height + 20 && 
                   projectile.y > -projectile.height && 
                   projectile.x > -projectile.width && 
                   projectile.x < this.canvas.width + projectile.width;
        });
    }

    attack() {
        const baseProjectileSpeed = 5; // Ridotto per mobile
        
        // Attacco base: proiettile centrale
        this.projectiles.push({
            x: this.x + this.width / 2 - 5,
            y: this.y + this.height,
            width: 10,
            height: 10,
            type: 'evilGift',
            speedX: 0,
            speedY: baseProjectileSpeed
        });

        // Attacchi aggiuntivi basati su salute e zona (semplificati per mobile)
        const healthPercentage = this.health / this.maxHealth;
        const isEnraged = healthPercentage < 0.6 || this.zone > 1;

        if (isEnraged) {
            // Attacco triplo semplificato
            for (let i = -1; i <= 1; i++) {
                if (i !== 0) { // Non duplicare il proiettile centrale
                    this.projectiles.push({
                        x: this.x + this.width / 2 - 5 + (i * 25),
                        y: this.y + this.height,
                        width: 8, 
                        height: 8, 
                        type: 'evilGift',
                        speedX: i * (baseProjectileSpeed / 4),
                        speedY: baseProjectileSpeed * 0.9
                    });
                }
            }
        }
        
        // Attacco speciale per zona 2 (semplificato)
        if (this.zone > 1 && Math.random() < 0.3) {
            setTimeout(() => {
                if (this.active && this.projectiles.length < this.maxParticles) {
                    for (let i = 0; i < 2; i++) { // Ridotto da 3 a 2
                        this.projectiles.push({
                            x: this.x + (this.width / 2) - 5 + (Math.random() * 30 - 15),
                            y: this.y + this.height,
                            width: 8, 
                            height: 8, 
                            type: 'evilGift',
                            speedX: (Math.random() - 0.5) * 3,
                            speedY: baseProjectileSpeed + 1
                        });
                    }
                }
            }, 400);
        }
        
        // Attacco pioggia per fase 3 (molto semplificato per mobile)
        if (this.movementPhase === 3 && Math.random() < 0.4) {
            const rainDuration = 800; // Ridotto
            const rainInterval = 250; // Meno frequente
            let rainTime = 0;

            const rainAttack = setInterval(() => {
                if (!this.active || rainTime >= rainDuration) {
                    clearInterval(rainAttack);
                    return;
                }
                
                // Solo 1 proiettile per volta nella pioggia
                if (this.projectiles.length < this.maxParticles) {
                    this.projectiles.push({
                        x: Math.random() * (this.canvas.width - 10),
                        y: -10,
                        width: 10, 
                        height: 10, 
                        type: 'evilGift',
                        speedX: 0,
                        speedY: baseProjectileSpeed * 0.7
                    });
                }
                
                rainTime += rainInterval;
            }, rainInterval);
        }
    }

    draw(ctx) {
        if (!this.active || !this.image) return;
        
        ctx.save();
        
        // Boss con effetto shake se danneggiato di recente
        let offsetX = 0, offsetY = 0;
        if (this.health < this.maxHealth * 0.3) {
            offsetX = (Math.random() - 0.5) * 2;
            offsetY = (Math.random() - 0.5) * 2;
        }
        
        ctx.drawImage(this.image, this.x + offsetX, this.y + offsetY, this.width, this.height);
        
        // Barra della salute ottimizzata per mobile
        this.drawHealthBar(ctx);
        
        // Disegna proiettili semplificati
        this.drawProjectiles(ctx);
        
        ctx.restore();
    }
    
    drawHealthBar(ctx) {
        const barWidth = this.width;
        const barHeight = 8; // Più spessa per mobile
        const barX = this.x;
        const barY = this.y - 15;
        
        // Sfondo
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        
        // Barra salute con colori mobili-friendly
        const healthPercentage = this.health / this.maxHealth;
        let barColor;
        
        if (healthPercentage > 0.6) {
            barColor = '#4CAF50'; // Verde
        } else if (healthPercentage > 0.3) {
            barColor = '#FF9800'; // Arancione
        } else {
            barColor = '#F44336'; // Rosso
        }
        
        ctx.fillStyle = barColor;
        ctx.fillRect(barX, barY, barWidth * healthPercentage, barHeight);
        
        // Bordo
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.strokeRect(barX, barY, barWidth, barHeight);
        
        // Testo salute per mobile
        ctx.fillStyle = 'white';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.strokeText(`${this.health}/${this.maxHealth}`, barX + barWidth/2, barY - 5);
        ctx.fillText(`${this.health}/${this.maxHealth}`, barX + barWidth/2, barY - 5);
    }
    
    drawProjectiles(ctx) {
        this.projectiles.forEach(projectile => {
            // Disegno semplificato dei proiettili per mobile
            ctx.fillStyle = '#8B0000'; // Rosso scuro
            ctx.beginPath();
            ctx.roundRect(projectile.x, projectile.y, projectile.width, projectile.height, 2);
            ctx.fill();
            
            // Bordo chiaro per visibilità
            ctx.strokeStyle = '#FFB6C1';
            ctx.lineWidth = 1;
            ctx.stroke();
        });
    }

    takeDamage(amount = 1) {
        console.log(`[Boss Mobile] Vita PRIMA: ${this.health}, Danno: ${amount}`);
        this.health -= amount;
        console.log(`[Boss Mobile] Vita DOPO: ${this.health}`);
        
        // Feedback aptico per mobile
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
        
        if (this.health <= 0) {
            this.health = 0;
            console.log("[Boss Mobile] Vita <= 0, sconfitta");
            this.defeat();
        }
        
        // Aumenta difficoltà basata su salute (semplificato per mobile)
        const healthPercentage = this.health / this.maxHealth;
        if (healthPercentage < 0.6 && healthPercentage > 0.3) {
            this.horizontalSpeed = this.zone === 1 ? 3 : 4;
            this.attackInterval = this.zone === 1 ? 1200 : 800;
        } else if (healthPercentage <= 0.3) {
            this.horizontalSpeed = this.zone === 1 ? 3.5 : 4.5;
            this.attackInterval = this.zone === 1 ? 1000 : 600;
            this.verticalSpeed = this.zone === 1 ? 1.5 : 2;
        }
    }

    defeat() {
        console.log("[Boss Mobile] Sconfitta");
        this.active = false;
        
        // Feedback aptico di vittoria
        if (navigator.vibrate) {
            navigator.vibrate([100, 50, 100, 50, 200]);
        }
        
        console.log(`[Boss Mobile] active impostato a: ${this.active}`);
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }

    getProjectilesBounds() {
        return this.projectiles.map(proj => ({
            x: proj.x,
            y: proj.y,
            width: proj.width,
            height: proj.height
        }));
    }
    
    // Metodi specifici per mobile
    
    // Riduce la difficoltà per dispositivi meno potenti
    reduceDifficulty() {
        this.maxParticles = Math.floor(this.maxParticles * 0.7);
        this.attackInterval = Math.floor(this.attackInterval * 1.2);
        console.log('🔧 Difficoltà boss ridotta per mobile');
    }
    
    // Informazioni debug per mobile
    getDebugInfo() {
        return {
            health: `${this.health}/${this.maxHealth}`,
            position: { x: Math.floor(this.x), y: Math.floor(this.y) },
            phase: this.movementPhase,
            projectiles: this.projectiles.length,
            active: this.active,
            zone: this.zone
        };
    }
} 