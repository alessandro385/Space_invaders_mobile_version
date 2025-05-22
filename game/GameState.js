import { DIFFICULTY_CONFIG } from './constants.js';

export class GameState {
  constructor() {
    this.score = 0;
    this.lives = 3;
    this.level = 1;
    this.gameOver = false;
    this.difficultyMultiplier = 1;
    this.lastDifficultyIncrease = Date.now();
    this.distanceTraveled = 0;
    this.lastLifeBonusDistance = 0;
    this.lifeBonusInterval = DIFFICULTY_CONFIG.LIFE_BONUS_INTERVAL;
    this.gameWon = false;
    this.zone = 1;
    
    // Soglie di avanzamento livello ottimizzate per mobile
    this.levelThresholds = DIFFICULTY_CONFIG.LEVEL_THRESHOLDS;
    
    // Flag per il boss
    this.bossSpawned = false;
    this.bossDefeated = false;
    
    // Statistiche mobile-specific
    this.touchScore = 0; // Punti guadagnati tramite touch
    this.survivalTime = 0; // Tempo di sopravvivenza
    this.startTime = Date.now();
  }

  update() {
    const now = Date.now();
    
    // Aggiorna tempo di sopravvivenza
    this.survivalTime = now - this.startTime;
    
    // Difficoltà aumenta più gradualmente su mobile
    if (now - this.lastDifficultyIncrease >= 15000) { // Ogni 15 secondi invece di 10
      this.difficultyMultiplier += 0.03; // Aumento più graduale
      this.lastDifficultyIncrease = now;
    }
    
    // Controllo avanzamento livello
    this.checkLevelProgress();
  }

  addScore(points) {
    console.log(`Punteggio aumentato di ${points} punti. Nuovo totale: ${this.score + points}`);
    this.score += points;
    this.touchScore += points;
    
    // Controlla se l'avanzamento di punteggio cambia il livello
    this.checkLevelProgress();
  }

  removeLife() {
    this.lives--;
    
    // Su mobile, feedback aptico quando si perde una vita
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }
    
    if (this.lives <= 0) {
      this.gameOver = true;
      console.log('Game Over! Tempo sopravvivenza:', Math.floor(this.survivalTime / 1000), 'secondi');
    }
  }
  
  addLife() {
    this.lives++;
    console.log("Vita aggiunta! Vite totali:", this.lives);
    
    // Feedback aptico positivo su mobile
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }
  }
  
  // NUOVO: Sistema distanza migliorato per mobile
  updateDistance(distance) {
    const previousDistance = this.distanceTraveled;
    this.distanceTraveled = distance;
    
    // Log ogni 500 metri per debug
    const currentMeter = Math.floor(distance / 500) * 500;
    const previousMeter = Math.floor(previousDistance / 500) * 500;
    
    if (currentMeter > previousMeter && currentMeter > 0) {
      console.log(`📏 Distanza: ${currentMeter}m | Livello: ${this.level} | Regali: ${this.score}`);
    }
    
    // Controlla se l'avanzamento di distanza cambia il livello
    this.checkLevelProgress();
  }
  
  // NUOVO: Ottieni distanza formattata per UI
  getFormattedDistance() {
    const meters = Math.floor(this.distanceTraveled);
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)}km`;
    }
    return `${meters}m`;
  }
  
  // NUOVO: Ottieni velocità media (metri al secondo)
  getAverageSpeed() {
    const timeElapsed = (Date.now() - this.startTime) / 1000; // secondi
    if (timeElapsed > 0) {
      return (this.distanceTraveled / timeElapsed).toFixed(1);
    }
    return 0;
  }
  
  // NUOVO: Sistema bonus vita molto più restrittivo per mobile
  checkLifeBonusSpawn() {
    // NON spawnare cuori se il player ha 3+ vite
    if (this.lives >= 3) {
      return false;
    }
    
    const currentDistance = Math.floor(this.distanceTraveled);
    
    // Sistema MOLTO più restrittivo: solo emergenza vera
    let urgencyDistance = 0;
    
    if (this.lives === 1) {
      // Con 1 vita: ogni 600m MAX
      urgencyDistance = Math.max(600, DIFFICULTY_CONFIG.LIFE_BONUS_MAX_FREQUENCY || 1000);
    } else if (this.lives === 2) {
      // Con 2 vite: ogni 800m MAX
      urgencyDistance = Math.max(800, (DIFFICULTY_CONFIG.LIFE_BONUS_MAX_FREQUENCY || 1000) * 1.3);
    } else {
      // 3+ vite: MAI
      return false;
    }
    
    // Controlla se è passato abbastanza tempo/distanza
    if (currentDistance >= this.lastLifeBonusDistance + urgencyDistance) {
      // Probabilità ridotta: 30% quando si qualifica
      if (Math.random() < 0.3) {
        this.lastLifeBonusDistance = currentDistance;
        
        console.log("❤️ VITA EMERGENCY SPAWN");
        console.log("Vite:", this.lives, "| Distanza:", currentDistance);
        console.log("Prossimo possibile:", currentDistance + urgencyDistance);
        
        return true;
      }
    }
    
    return false;
  }
  
  // Controlla se è ora di avanzare di livello
  checkLevelProgress() {
    for (let i = this.levelThresholds.length - 1; i >= 0; i--) {
      const threshold = this.levelThresholds[i];
      
      // Controllo normale: distanza E regali richiesti
      if (this.distanceTraveled >= threshold.distance && 
          this.score >= threshold.gifts && 
          this.level < threshold.level) {
        
        this.level = threshold.level;
        console.log(`🎮 Livello ${this.level} raggiunto! Distanza: ${Math.floor(this.distanceTraveled)}m, Regali: ${this.score}`);
        
        // Feedback aptico per level up su mobile
        if (navigator.vibrate) {
          navigator.vibrate([150, 50, 150, 50, 200]);
        }
        
        return true;
      }
      
      // NUOVO: Avanzamento automatico basato solo sulla distanza per evitare blocchi
      // Se hai raggiunto la distanza ma mancano regali, avanza comunque dopo un po'
      if (this.distanceTraveled >= threshold.distance + 300 && // 300m di grazia (15 secondi)
          this.level < threshold.level) {
        
        this.level = threshold.level;
        console.log(`🎮 Livello ${this.level} raggiunto per DISTANZA! (Regali: ${this.score}/${threshold.gifts})`);
        console.log(`⚠️ Avanzamento automatico attivato per evitare blocchi`);
        
        // Feedback aptico diverso per avanzamento automatico
        if (navigator.vibrate) {
          navigator.vibrate([100, 100, 100, 100, 300]);
        }
        
        return true;
      }
    }
    return false;
  }
  
  // Controlla se è ora di spawnare il boss
  shouldSpawnBoss() {
    const bossThreshold = this.levelThresholds[this.levelThresholds.length - 1];
    
    if (!this.bossSpawned && 
        this.distanceTraveled >= bossThreshold.distance &&
        this.score >= bossThreshold.gifts) {
      
      this.bossSpawned = true;
      console.log("🎯 BOSS SPAWNING! Distanza:", Math.floor(this.distanceTraveled), "Regali:", this.score);
      
      // Feedback aptico drammatico per boss spawn
      if (navigator.vibrate) {
        navigator.vibrate([300, 100, 300, 100, 500]);
      }
      
      return true;
    }
    return false;
  }
  
  // Calcola e restituisce le informazioni per il prossimo livello
  getNextLevelInfo() {
    const currentLevelIndex = this.levelThresholds.findIndex(t => t.level === this.level);
    if (currentLevelIndex < this.levelThresholds.length - 1) {
      const nextThreshold = this.levelThresholds[currentLevelIndex + 1];
      return {
        distanceRequired: nextThreshold.distance,
        distanceRemaining: Math.max(0, nextThreshold.distance - this.distanceTraveled),
        giftsRequired: nextThreshold.gifts,
        giftsRemaining: Math.max(0, nextThreshold.gifts - this.score)
      };
    }
    return null; // Se è l'ultimo livello
  }
  
  // Gestisce la vittoria sul boss
  setBossDefeated() {
    this.bossDefeated = true;
    this.gameWon = true;
    
    console.log("🎉 Boss sconfitto! Zona", this.zone, "completata!");
    
    // Celebrazione aptica per vittoria
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200, 100, 200, 100, 400]);
    }
  }
  
  // Passa alla zona successiva
  advanceToNextZone() {
    console.log("[GameState.js Mobile] Avanzamento alla zona successiva");
    this.zone++;
    this.level = 1;
    this.bossSpawned = false;
    this.bossDefeated = false;
    this.gameWon = false;
    this.lastLifeBonusDistance = 0; // Reset bonus vita per nuova zona
    
    // Manteniamo punteggio e vite, ma resettiamo alcune statistiche
    this.startTime = Date.now(); // Reset timer sopravvivenza per nuova zona
    
    console.log(`🚀 Zona ${this.zone} iniziata! Vite: ${this.lives}, Score: ${this.score}`);
  }
  
  // Metodi specifici per mobile
  
  // Calcola statistiche di performance per mobile
  getMobileStats() {
    const survivalSeconds = Math.floor(this.survivalTime / 1000);
    const avgPointsPerSecond = survivalSeconds > 0 ? (this.touchScore / survivalSeconds).toFixed(1) : 0;
    
    return {
      survivalTime: survivalSeconds,
      avgPointsPerSecond: avgPointsPerSecond,
      totalTouchScore: this.touchScore,
      currentLevel: this.level,
      currentZone: this.zone,
      livesRemaining: this.lives
    };
  }
  
  // Reset ottimizzato per mobile
  reset() {
    this.score = 0;
    this.lives = 3;
    this.level = 1;
    this.gameOver = false;
    this.difficultyMultiplier = 1;
    this.lastDifficultyIncrease = Date.now();
    this.distanceTraveled = 0;
    this.lastLifeBonusDistance = 0;
    this.gameWon = false;
    this.zone = 1;
    this.bossSpawned = false;
    this.bossDefeated = false;
    this.touchScore = 0;
    this.survivalTime = 0;
    this.startTime = Date.now();
    
    console.log("🔄 GameState reset per mobile");
  }
} 