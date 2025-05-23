import { GameState } from './GameState.js';
import { Sleigh } from './entities/Sleigh.js';
import { GameObject } from './entities/GameObject.js';
import { Boss } from './entities/Boss.js';
import { Snowball } from './entities/Snowball.js';
import { Background } from './utils/background.js';
import { InputManager } from './utils/input.js';
import { checkCollision } from './utils/collision.js';
import { GAME_CONFIG, PERFORMANCE_CONFIG, TOUCH_CONFIG, SPAWN_CONFIG, MULTIPLIER_CONFIG, getDynamicSpawnRate } from './constants.js';
import { ForestSection } from './sections/ForestSection.js';

export class Game {
  constructor(canvas, sleighType = 'default', onGameEnd = null) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.sleighType = sleighType;
    this.onGameEnd = onGameEnd;
    
    // NUOVO: Modalità fuoco amico
    this.friendlyFireMode = true; // Default: attiva
    
    // Game entities
    this.sleigh = new Sleigh(canvas, sleighType);
    this.objects = [];
    this.snowballs = [];
    this.boss = null;
    
    // Game systems
    this.state = new GameState();
    this.background = new Background(canvas, this.state.zone);
    this.inputManager = new InputManager();
    
    // NUOVO: Sistema modulare sezioni
    this.currentSection = new ForestSection(); // Inizia con sezione Forest
    this.currentSection.initialize(this);
    this.spawnHistory = []; // Cronologia spawn per bilanciamento
    this.maxSpawnHistory = 20;
    
    // Mobile-specific properties
    this.touchMovement = { x: 0, y: 0 };
    this.lastSpawnTime = 0;
    this.spawnInterval = GAME_CONFIG.SPAWN_RATE;
    this.lastUpdateTime = Date.now();
    
    // Performance optimization
    this.frameCount = 0;
    this.lastFPSCheck = Date.now();
    this.currentFPS = 60;
    this.isLowPerformance = false;
    
    // NUOVO: Moltiplicatori di gioco
    this.fireMultiplier = {
      active: false,
      endTime: 0,
      projectiles: 1,
      cooldownReduction: 1
    };
    
    this.speedMultiplier = {
      active: false,
      endTime: 0,
      boostAmount: 1,
      originalSpeed: 0
    };
    
    this.scoreMultiplier = {
      active: false,
      endTime: 0,
      multiplier: 1
    };
    
    // Migliore sistema spawn
    this.lastObjectWave = 0;
    this.objectsInWave = 0;
    this.currentWaveSize = SPAWN_CONFIG.MIN_OBSTACLES_PER_WAVE;
    
    console.log('🎮 Game Mobile initialized with canvas:', canvas.width, 'x', canvas.height);
  }

  // Touch movement methods
  setTouchMovement(x, y) {
    this.touchMovement.x = x;
    this.touchMovement.y = y;
  }

  clearMovementInput() {
    this.touchMovement.x = 0;
    this.touchMovement.y = 0;
  }

  fireSnowball() {
    const sleighCenter = this.sleigh.x + this.sleigh.width / 2;
    const projectileCount = this.fireMultiplier.active ? this.fireMultiplier.projectiles : 1;
    
    if (projectileCount === 1) {
      // Sparo singolo normale
      const snowball = new Snowball(sleighCenter - 6, this.sleigh.y);
      this.snowballs.push(snowball);
    } else {
      // Sparo multiplo con spread
      const spreadAngle = MULTIPLIER_CONFIG.FIRE_MULTIPLIER.spread_angle;
      const angleStep = (spreadAngle * 2) / (projectileCount - 1);
      const startAngle = -spreadAngle;
      
      for (let i = 0; i < projectileCount; i++) {
        const angle = startAngle + (angleStep * i);
        const radians = (angle * Math.PI) / 180;
        
        const snowball = new Snowball(
          sleighCenter - 6 + Math.sin(radians) * 10,
          this.sleigh.y
        );
        
        // Applica direzione di sparo
        snowball.velocityX = Math.sin(radians) * 2;
        snowball.speed *= 1.1; // Leggermente più veloce
        this.snowballs.push(snowball);
      }
    }
  }

  update() {
    const now = Date.now();
    const deltaTime = now - this.lastUpdateTime;
    this.lastUpdateTime = now;
    
    // Performance monitoring
    this.updatePerformanceStats();
    
    if (this.state.gameOver || this.state.gameWon) {
      return;
    }
    
    // NUOVO: Aggiorna moltiplicatori
    this.updateMultipliers(now);
    
    // Update game state
    this.state.update();
    this.updateDistance();
    
    // NUOVO: Verifica eventi speciali della sezione
    this.checkSectionEvents();
    
    // Handle input
    this.handleInput();
    
    // Update entities
    this.updateEntities(deltaTime);
    
    // Handle spawning
    this.handleSpawning();
    
    // Check collisions
    this.checkCollisions();
    
    // Clean up inactive entities
    this.cleanup();
  }

  updatePerformanceStats() {
    this.frameCount++;
    const now = Date.now();
    
    if (now - this.lastFPSCheck > 1000) {
      this.currentFPS = this.frameCount;
      this.frameCount = 0;
      this.lastFPSCheck = now;
      
      // Auto-optimize if performance is poor
      if (this.currentFPS < PERFORMANCE_CONFIG.MIN_FPS && !this.isLowPerformance) {
        this.optimizeForLowPerformance();
      }
    }
  }

  optimizeForLowPerformance() {
    this.isLowPerformance = true;
    this.spawnInterval = Math.floor(this.spawnInterval * 1.2);
    
    // Reduce existing objects if too many
    if (this.objects.length > PERFORMANCE_CONFIG.MAX_OBJECTS) {
      this.objects = this.objects.slice(0, PERFORMANCE_CONFIG.MAX_OBJECTS);
    }
    
    console.log('🔧 Performance ottimized for mobile device');
  }

  handleInput() {
    // Touch movement
    if (Math.abs(this.touchMovement.x) > TOUCH_CONFIG.JOYSTICK_DEAD_ZONE || 
        Math.abs(this.touchMovement.y) > TOUCH_CONFIG.JOYSTICK_DEAD_ZONE) {
      this.sleigh.moveWithAcceleration(this.touchMovement.x, this.touchMovement.y);
    }
    
    // Legacy keyboard support for testing
    if (this.inputManager.isKeyPressed('ArrowLeft') || this.inputManager.isKeyPressed('a')) {
      this.sleigh.moveLeft();
    }
    if (this.inputManager.isKeyPressed('ArrowRight') || this.inputManager.isKeyPressed('d')) {
      this.sleigh.moveRight();
    }
    if (this.inputManager.isKeyPressed(' ')) {
      this.fireSnowball();
    }
  }

  updateEntities(deltaTime) {
    // Update sleigh
    this.sleigh.update();
    
    // Update background
    this.background.update();
    
    // Update objects
    this.objects.forEach(obj => {
      if (this.isLowPerformance) {
        obj.updateIfVisible?.() || obj.update();
      } else {
        obj.update();
      }
    });
    
    // Update snowballs
    this.snowballs.forEach(snowball => snowball.update());
    
    // Update boss
    if (this.boss && this.boss.active) {
      this.boss.update(deltaTime);
    }
  }

  updateDistance() {
    // Simula movimento in avanti con velocità target di 20m/s
    const now = Date.now();
    const deltaTime = now - (this.lastDistanceUpdate || now);
    this.lastDistanceUpdate = now;
    
    // CORRETTO: Per ottenere 20 m/s reali
    // deltaTime è in millisecondi, vogliamo 20 metri al secondo
    const distanceIncrement = (20 * deltaTime) / 1000; // 20 m/s convertito correttamente
    this.state.updateDistance(this.state.distanceTraveled + distanceIncrement);
    
    // Debug: Log velocità ogni 5 secondi
    if (!this.lastSpeedLog) this.lastSpeedLog = now;
    if (now - this.lastSpeedLog > 5000) {
      const currentSpeed = this.state.getAverageSpeed();
      console.log(`🏃‍♂️ Velocità: ${currentSpeed} m/s | Distanza: ${Math.floor(this.state.distanceTraveled)}m | Livello: ${this.state.level}`);
      this.lastSpeedLog = now;
    }
  }

  // NUOVO: Verifica eventi speciali della sezione corrente
  checkSectionEvents() {
    const specialEvent = this.currentSection.checkSpecialEvents(this.state);
    if (specialEvent) {
      this.currentSection.handleSpecialEvent(specialEvent.type, specialEvent);
      console.log(`🎯 Evento speciale attivato: ${specialEvent.type}`);
    }
  }

  handleSpawning() {
    const now = Date.now();
    
    // Spawn boss if conditions are met
    if (this.state.shouldSpawnBoss() && !this.boss) {
      this.spawnBoss();
      return;
    }
    
    // NUOVO SISTEMA SPAWN BILANCIATO
    if (now - this.lastSpawnTime > this.spawnInterval && !this.boss?.active) {
      this.spawnBalancedWave();
      this.lastSpawnTime = now;
      
      // Calcola intervallo dinamico basato su performance e livello
      this.spawnInterval = this.calculateDynamicSpawnRate();
    }
    
    // Life bonus spawning (meno frequente)
    if (this.state.checkLifeBonusSpawn()) {
      this.spawnLifeBonus();
    }
  }

  // NUOVO: Sistema spawn bilanciato con wave
  spawnBalancedWave() {
    // Resetta la wave se necessario
    if (this.objectsInWave >= this.currentWaveSize) {
      this.objectsInWave = 0;
      this.currentWaveSize = Math.random() < 0.5 ? 
        SPAWN_CONFIG.MIN_OBSTACLES_PER_WAVE : 
        SPAWN_CONFIG.MAX_OBSTACLES_PER_WAVE;
    }
    
    // Determina cosa spawnare basato su probabilità bilanciate
    const rand = Math.random() * 100;
    let objectType;
    
    if (rand < SPAWN_CONFIG.LIFE_CHANCE && this.state.lives < 2) {
      // Solo se poche vite
      objectType = 'extraLife';
    } else if (rand < SPAWN_CONFIG.LIFE_CHANCE + SPAWN_CONFIG.BONUS_CHANCE) {
      // Bonus vari (snowBlower o moveSpeedBoost)
      objectType = Math.random() < 0.5 ? 'snowBlower' : 'moveSpeedBoost';
    } else if (rand < SPAWN_CONFIG.LIFE_CHANCE + SPAWN_CONFIG.BONUS_CHANCE + SPAWN_CONFIG.GIFT_CHANCE) {
      // Regali
      objectType = 'gift';
    } else {
      // Ostacoli (la maggior parte)
      objectType = this.selectObstacleType();
    }
    
    this.spawnSingleObject(objectType);
    this.objectsInWave++;
  }
  
  // NUOVO: Selezione ostacoli tramite sezione corrente
  selectObstacleType() {
    // Usa la sezione corrente per selezionare ostacoli
    return this.currentSection.selectObstacle(this.state.level);
  }
  
  // NUOVO: Selezione pesata migliorata
  weightedRandomSelect(items, weights) {
    const totalWeight = items.reduce((sum, item) => sum + (weights[item] || 1), 0);
    let random = Math.random() * totalWeight;
    
    for (const item of items) {
      random -= weights[item] || 1;
      if (random <= 0) return item;
    }
    
    return items[0]; // Fallback
  }
  
  // NUOVO: Spawn singolo oggetto ottimizzato
  spawnSingleObject(type) {
    const margin = 40;
    const x = margin + Math.random() * (this.canvas.width - margin * 2 - 50);
    const speed = this.calculateSpawnSpeed();
    const health = this.getObjectHealth(type);
    
    const obj = new GameObject(x, -50, type, this.canvas, speed, health);
    
    // Ottimizzazioni performance
    if (this.isLowPerformance && type !== 'extraLife') {
      obj.disableEffects?.();
    }
    
    this.objects.push(obj);
    
    // Log per debug (solo per bonus importanti)
    if (['extraLife', 'snowBlower', 'moveSpeedBoost'].includes(type)) {
      console.log(`🎁 Spawned ${type} at x:${Math.floor(x)}`);
    }
  }

  // NUOVO: Calcolo dinamico spawn rate tramite sezione
  calculateDynamicSpawnRate() {
    // Calcolo base
    let baseInterval = getDynamicSpawnRate(this.currentFPS, PERFORMANCE_CONFIG.TARGET_FPS);
    
    // Adattamento della sezione corrente
    baseInterval = this.currentSection.calculateSpawnRate(baseInterval, this.state.level);
    
    // NUOVO: Adattamento basato su distanza percorsa
    const distanceMultiplier = this.getDistanceSpawnMultiplier();
    baseInterval = baseInterval / distanceMultiplier;
    
    // Adattamento basato su difficoltà generale
    const difficultyMultiplier = Math.min(this.state.difficultyMultiplier, 2.0);
    baseInterval = baseInterval / Math.max(difficultyMultiplier, 0.5);
    
    // Limiti per mobile - RIDOTTI per più spawn
    return Math.max(300, Math.min(1000, baseInterval)); // Era 400-1200
  }
  
  // NUOVO: Calcola moltiplicatore spawn basato su distanza
  getDistanceSpawnMultiplier() {
    const distance = this.state.distanceTraveled;
    const { DISTANCE_MULTIPLIERS } = SPAWN_CONFIG;
    
    // Trova il moltiplicatore appropriato per la distanza corrente
    let multiplier = 1.0;
    for (let i = DISTANCE_MULTIPLIERS.length - 1; i >= 0; i--) {
      if (distance >= DISTANCE_MULTIPLIERS[i].distance) {
        multiplier = DISTANCE_MULTIPLIERS[i].spawnMultiplier;
        break;
      }
    }
    
    // Log per debug ogni 500m
    if (Math.floor(distance) % 500 === 0 && distance > 0) {
      console.log(`📈 Distanza: ${Math.floor(distance)}m | Moltiplicatore spawn: x${multiplier}`);
    }
    
    return multiplier;
  }

  calculateSpawnSpeed() {
    // Velocità base degli oggetti proporzionale alla velocità della slitta (20m/s)
    const baseSpeed = 3; // Velocità base ragionevole per oggetti in pixel/frame
    const levelMultiplier = 1 + (this.state.level - 1) * 0.3;
    const difficultyMultiplier = Math.min(this.state.difficultyMultiplier, 1.5);
    
    return Math.min(
      baseSpeed * levelMultiplier * difficultyMultiplier,
      12 // Velocità massima oggetti
    );
  }

  getObjectHealth(type) {
    const healthMap = {
      'reinforcedObstacle': 2,
      'armoredSnowman': 2,
      'default': 1
    };
    return healthMap[type] || healthMap.default;
  }

  spawnLifeBonus() {
    const x = Math.random() * (this.canvas.width - 40);
    const speed = this.calculateSpawnSpeed() * 0.8; // Slightly slower for easier collection
    
    const lifeBonus = new GameObject(x, -50, 'extraLife', this.canvas, speed, 1);
    lifeBonus.applyExtraLifeEffect?.();
    
    this.objects.push(lifeBonus);
    console.log('❤️ Bonus vita spawned at position:', Math.floor(x));
  }

  spawnBoss() {
    this.boss = new Boss(this.canvas, this.state.zone);
    
    // Optimize boss for mobile if low performance
    if (this.isLowPerformance) {
      this.boss.reduceDifficulty?.();
    }
    
    console.log(`🎯 Boss Zone ${this.state.zone} spawned!`);
  }

  checkCollisions() {
    // Sleigh vs Objects
    this.objects.forEach((obj, objIndex) => {
      if (!obj.active) return;
      
      if (checkCollision(this.sleigh.getBounds(), obj.getBounds())) {
        this.handleSleighObjectCollision(obj, objIndex);
      }
    });
    
    // Snowballs vs Objects
    this.snowballs.forEach((snowball, snowballIndex) => {
      if (!snowball.active) return;
      
      this.objects.forEach((obj, objIndex) => {
        if (!obj.active) return;
        
        if (checkCollision(snowball.getBounds(), obj.getBounds())) {
          this.handleSnowballObjectCollision(snowball, obj, snowballIndex, objIndex);
        }
      });
    });
    
    // Sleigh vs Boss
    if (this.boss && this.boss.active) {
      if (checkCollision(this.sleigh.getBounds(), this.boss.getBounds())) {
        this.handleSleighBossCollision();
      }
      
      // Snowballs vs Boss
      this.snowballs.forEach((snowball, snowballIndex) => {
        if (!snowball.active) return;
        
        if (checkCollision(snowball.getBounds(), this.boss.getBounds())) {
          this.handleSnowballBossCollision(snowball, snowballIndex);
        }
      });
      
      // Sleigh vs Boss Projectiles
      const projectileBounds = this.boss.getProjectilesBounds();
      projectileBounds.forEach(projBound => {
        if (checkCollision(this.sleigh.getBounds(), projBound)) {
          this.handleSleighProjectileCollision();
        }
      });
    }
  }

  // NUOVO: Gestione moltiplicatori nel tempo
  updateMultipliers(currentTime) {
    // Aggiorna moltiplicatore sparo
    if (this.fireMultiplier.active && currentTime > this.fireMultiplier.endTime) {
      this.deactivateFireMultiplier();
    }
    
    // Aggiorna moltiplicatore velocità
    if (this.speedMultiplier.active && currentTime > this.speedMultiplier.endTime) {
      this.deactivateSpeedMultiplier();
    }
    
    // Aggiorna moltiplicatore punteggio
    if (this.scoreMultiplier.active && currentTime > this.scoreMultiplier.endTime) {
      this.deactivateScoreMultiplier();
    }
  }
  
  // NUOVO: Attivazione moltiplicatori
  activateFireMultiplier() {
    const config = MULTIPLIER_CONFIG.FIRE_MULTIPLIER;
    this.fireMultiplier = {
      active: true,
      endTime: Date.now() + config.duration,
      projectiles: config.projectiles,
      cooldownReduction: config.cooldown_reduction
    };
    
    // Feedback visivo e aptico
    if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
    console.log('🔥 Fire Multiplier attivato! Sparo triplo per 15 secondi');
  }
  
  activateSpeedMultiplier() {
    const config = MULTIPLIER_CONFIG.SPEED_MULTIPLIER;
    this.speedMultiplier = {
      active: true,
      endTime: Date.now() + config.duration,
      boostAmount: config.speed_boost,
      originalSpeed: this.sleigh.maxVelocity
    };
    
    // Applica boost immediato
    this.sleigh.maxVelocity *= config.speed_boost;
    if (config.trail_effect) this.sleigh.applyBoost?.();
    
    // Feedback visivo e aptico
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    console.log('⚡ Speed Multiplier attivato! Velocità aumentata per 20 secondi');
  }
  
  activateScoreMultiplier() {
    const config = MULTIPLIER_CONFIG.SCORE_MULTIPLIER;
    this.scoreMultiplier = {
      active: true,
      endTime: Date.now() + config.duration,
      multiplier: config.multiplier
    };
    
    console.log('💰 Score Multiplier attivato! x2 punti per 10 secondi');
  }
  
  // NUOVO: Disattivazione moltiplicatori
  deactivateFireMultiplier() {
    this.fireMultiplier.active = false;
    console.log('🔥 Fire Multiplier terminato');
  }
  
  deactivateSpeedMultiplier() {
    // Ripristina velocità originale
    if (this.speedMultiplier.originalSpeed > 0) {
      this.sleigh.maxVelocity = this.speedMultiplier.originalSpeed;
    }
    this.speedMultiplier.active = false;
    console.log('⚡ Speed Multiplier terminato');
  }
  
  deactivateScoreMultiplier() {
    this.scoreMultiplier.active = false;
    console.log('💰 Score Multiplier terminato');
  }

  handleSleighObjectCollision(obj, objIndex) {
    if (obj.type === 'gift') {
      // Applica moltiplicatore punteggio se attivo
      const points = this.scoreMultiplier.active ? 10 * this.scoreMultiplier.multiplier : 10;
      this.state.addScore(points);
      obj.active = false;
    } else if (obj.type === 'extraLife') {
      this.state.addLife();
      obj.active = false;
    } else if (obj.type === 'snowBlower') {
      // NUOVO: Attiva moltiplicatore sparo
      this.activateFireMultiplier();
      obj.active = false;
    } else if (obj.type === 'moveSpeedBoost') {
      // NUOVO: Attiva moltiplicatore velocità
      this.activateSpeedMultiplier();
      obj.active = false;
    } else {
      // Obstacle collision
      this.state.removeLife();
      this.sleigh.collisionFeedback?.();
      obj.active = false;
    }
  }

  handleSnowballObjectCollision(snowball, obj, snowballIndex, objIndex) {
    snowball.active = false;
    
    // NUOVO: Logica modalità fuoco amico
    const isBonus = (obj.type === 'gift' || obj.type === 'extraLife' || obj.type === 'moveSpeedBoost' || obj.type === 'snowBlower');
    
    if (this.friendlyFireMode) {
      // MODALITÀ FUOCO AMICO ATTIVA: distruggi tutto (comportamento originale)
      if (!isBonus) {
        // Solo gli ostacoli danno punti quando distrutti
        obj.takeDamage(1);
        if (!obj.active) {
          this.state.addScore(5); // Points for destroying obstacles
        }
      } else {
        // Bonus vengono distrutti ma non danno punti aggiuntivi
        obj.active = false;
        console.log(`🔥 Fuoco amico: ${obj.type} distrutto`);
      }
    } else {
      // MODALITÀ FUOCO AMICO DISATTIVA: colpisci solo ostacoli
      if (!isBonus) {
        // Danneggia solo gli ostacoli
        obj.takeDamage(1);
        if (!obj.active) {
          this.state.addScore(5); // Points for destroying obstacles
        }
        console.log(`🎯 Ostacolo ${obj.type} colpito`);
      } else {
        // I bonus sono immuni: il proiettile attraversa senza effetto
        snowball.active = true; // Il proiettile continua il suo percorso
        console.log(`🛡️ Bonus ${obj.type} immune al fuoco`);
      }
    }
  }

  handleSleighBossCollision() {
    this.state.removeLife();
    this.sleigh.collisionFeedback?.();
  }

  handleSnowballBossCollision(snowball, snowballIndex) {
    snowball.active = false;
    this.boss.takeDamage(1);
    
    if (!this.boss.active) {
      this.state.setBossDefeated();
      console.log('🎉 Boss defeated! Game won!');
    }
  }

  handleSleighProjectileCollision() {
    this.state.removeLife();
    this.sleigh.collisionFeedback?.();
  }

  cleanup() {
    // Remove inactive objects
    this.objects = this.objects.filter(obj => {
      if (!obj.active || obj.y > this.canvas.height + 100) {
        return false;
      }
      return true;
    });
    
    // Remove inactive snowballs
    this.snowballs = this.snowballs.filter(snowball => {
      return snowball.active && snowball.y > -50;
    });
    
    // Performance cleanup
    if (this.objects.length > GAME_CONFIG.MAX_OBJECTS) {
      this.objects = this.objects.slice(0, GAME_CONFIG.MAX_OBJECTS);
    }
  }

  draw() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw background
    this.background.draw();
    
    // Sort objects by zIndex for proper rendering
    const sortedObjects = [...this.objects].sort((a, b) => (a.zIndex || 1) - (b.zIndex || 1));
    
    // Draw game entities
    sortedObjects.forEach(obj => obj.draw(this.ctx));
    this.snowballs.forEach(snowball => snowball.draw(this.ctx));
    this.sleigh.draw(this.ctx);
    
    // Draw boss
    if (this.boss && this.boss.active) {
      this.boss.draw(this.ctx);
    }
    
    // Draw debug info if enabled
    if (GAME_CONFIG.DEBUG) {
      this.drawDebugInfo();
    }
  }

  drawDebugInfo() {
    this.ctx.save();
    this.ctx.fillStyle = 'white';
    this.ctx.font = '14px Arial';
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 2;
    
    const debugInfo = [
      `FPS: ${this.currentFPS}`,
      `Objects: ${this.objects.length}`,
      `Snowballs: ${this.snowballs.length}`,
      `Touch: ${this.touchMovement.x.toFixed(2)}, ${this.touchMovement.y.toFixed(2)}`,
      `Low Perf: ${this.isLowPerformance}`,
      `Level: ${this.state.level}`,
      `Distance: ${Math.floor(this.state.distanceTraveled)}m`
    ];
    
    debugInfo.forEach((info, index) => {
      const y = 30 + (index * 20);
      this.ctx.strokeText(info, 10, y);
      this.ctx.fillText(info, 10, y);
    });
    
    this.ctx.restore();
  }

  // Game control methods
  restart() {
    this.state.reset();
    this.sleigh.reset();
    this.objects = [];
    this.snowballs = [];
    this.boss = null;
    this.lastSpawnTime = 0;
    this.touchMovement = { x: 0, y: 0 };
    this.background.setZone(1);
    
    // NUOVO: Reset sezione
    this.currentSection = new ForestSection();
    this.currentSection.initialize(this);
    
    console.log('🔄 Game restarted');
  }

  advanceToNextZone() {
    this.state.advanceToNextZone();
    this.background.setZone(this.state.zone);
    this.boss = null;
    this.objects = [];
    this.snowballs = [];
    
    console.log(`🚀 Advanced to Zone ${this.state.zone}`);
  }

  // Mobile-specific methods
  getMobileStats() {
    return {
      ...this.state.getMobileStats(),
      fps: this.currentFPS,
      lowPerformance: this.isLowPerformance,
      entities: this.objects.length + this.snowballs.length + (this.boss ? 1 : 0)
    };
  }

  optimizeForBattery() {
    this.spawnInterval = Math.floor(this.spawnInterval * 1.3);
    PERFORMANCE_CONFIG.TARGET_FPS = 30;
    
    console.log('🔋 Game optimized for battery saving');
  }

  // NUOVO: Metodo per attivare/disattivare la modalità fuoco amico
  setFriendlyFireMode(mode) {
    this.friendlyFireMode = mode;
    console.log(`🔥 Friendly Fire Mode: ${this.friendlyFireMode ? 'Attiva' : 'Disattiva'}`);
  }
} 