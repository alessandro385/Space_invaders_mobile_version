import { BaseSection } from './BaseSection.js';

/**
 * Sezione 1: La Foresta Incantata
 * Prima sezione del gioco con difficoltà progressiva e ostacoli forestali
 */
export class ForestSection extends BaseSection {
  constructor() {
    super('Foresta Incantata', 'forest', 1.0);
    
    // Configurazioni spawn specifiche per la foresta
    this.spawnConfig = {
      obstacleChance: 60,  // Più ostacoli nella foresta
      giftChance: 30,      // Più regali per iniziare bene
      bonusChance: 8,      
      lifeChance: 2
    };
    
    // Ostacoli disponibili nella foresta (progressivi per livello)
    this.availableObstacles = ['obstacle', 'snowmanObstacle'];
    
    // Bonus speciali della foresta
    this.specialBonuses = ['moveSpeedBoost', 'snowBlower'];
    
    // Impostazioni background forestale
    this.backgroundSettings = {
      snowfall: true,
      stars: true,
      speed: 1.0,
      theme: 'forest',
      treeCount: 5, // Alberi di sfondo
      snowIntensity: 0.7
    };
    
    // Progressione livelli della foresta
    this.levelProgression = {
      1: {
        maxDistance: 2500,
        giftsRequired: 15,
        obstacles: ['obstacle'],
        spawnRate: 1.0,
        description: 'Sentiero del Villaggio'
      },
      2: {
        maxDistance: 5000,
        giftsRequired: 35,
        obstacles: ['obstacle', 'snowmanObstacle'],
        spawnRate: 1.2,
        description: 'Bosco Fitto'
      },
      3: {
        maxDistance: 8000,
        giftsRequired: 60,
        obstacles: ['obstacle', 'snowmanObstacle', 'lampPostObstacle'],
        spawnRate: 1.4,
        description: 'Radura dei Lampioni'
      },
      4: {
        maxDistance: 12000,
        giftsRequired: 100,
        obstacles: ['obstacle', 'snowmanObstacle', 'lampPostObstacle', 'reinforcedObstacle'],
        spawnRate: 1.6,
        description: 'Confine del Bosco'
      }
    };
  }

  /**
   * Inizializza la sezione foresta
   */
  initialize(game) {
    super.initialize(game);
    
    // Configura il background per la foresta
    if (game.background && game.background.setTheme) {
      game.background.setTheme('forest');
    }
    
    console.log('🌲 Sezione Foresta inizializzata');
    console.log(`📍 Livelli disponibili: ${Object.keys(this.levelProgression).length}`);
  }

  /**
   * Restituisce gli ostacoli disponibili per il livello corrente
   */
  getAvailableObstacles(level) {
    const levelConfig = this.levelProgression[level] || this.levelProgression[4];
    return levelConfig.obstacles || this.availableObstacles;
  }

  /**
   * Pesi specifici per la foresta - bilancia ostacoli per difficoltà graduale
   */
  getObstacleWeights(level) {
    const baseWeights = {
      'obstacle': 50,           // Albero base - sempre presente
      'snowmanObstacle': 30,    // Pupazzo di neve - da livello 2
      'lampPostObstacle': 15,   // Lampione - da livello 3
      'reinforcedObstacle': 5   // Albero rinforzato - da livello 4
    };

    // Adatta i pesi in base al livello
    if (level === 1) {
      return { 'obstacle': 100 }; // Solo alberi al primo livello
    } else if (level === 2) {
      return { 
        'obstacle': 60, 
        'snowmanObstacle': 40 
      };
    } else if (level === 3) {
      return { 
        'obstacle': 45, 
        'snowmanObstacle': 35, 
        'lampPostObstacle': 20 
      };
    }

    return baseWeights; // Livello 4+ usa tutti gli ostacoli
  }

  /**
   * Calcola la velocità di spawn specifica per la foresta
   */
  calculateSpawnRate(baseRate, level) {
    const levelConfig = this.levelProgression[level] || this.levelProgression[4];
    return baseRate / levelConfig.spawnRate; // Più alto = spawn più frequente
  }

  /**
   * Eventi speciali della foresta
   */
  checkSpecialEvents(gameState) {
    // Evento: Tempesta di neve (riduce visibilità, più regali)
    if (gameState.distanceTraveled > 3000 && 
        gameState.distanceTraveled < 3200 && 
        Math.random() < 0.1) {
      return {
        type: 'snowstorm',
        duration: 5000,
        effects: {
          giftBonus: 2.0,      // Doppi regali durante la tempesta
          visibility: 0.7,     // Riduce visibilità
          snowfall: 2.0        // Nevicata intensa
        }
      };
    }

    // Evento: Benedizione della Foresta (più vite)
    if (gameState.distanceTraveled > 6000 && 
        gameState.distanceTraveled < 6100 && 
        gameState.lives <= 2 && 
        Math.random() < 0.15) {
      return {
        type: 'forest_blessing',
        duration: 3000,
        effects: {
          lifeChance: 15,      // Più cuori per 3 secondi
          healing: true        // Guarigione graduale
        }
      };
    }

    // Evento: Sentiero Libero (meno ostacoli, più velocità)
    if (gameState.distanceTraveled > 9000 && 
        gameState.distanceTraveled < 9200 && 
        Math.random() < 0.08) {
      return {
        type: 'clear_path',
        duration: 4000,
        effects: {
          obstacleReduction: 0.4, // 60% meno ostacoli
          speedBoost: 1.3         // 30% più veloce
        }
      };
    }

    return null;
  }

  /**
   * Gestisce gli eventi speciali della foresta
   */
  handleSpecialEvent(eventType, data) {
    switch (eventType) {
      case 'snowstorm':
        console.log('🌨️ Tempesta di neve in arrivo!');
        if (this.game && this.game.background) {
          this.game.background.setSnowIntensity(2.0);
        }
        break;

      case 'forest_blessing':
        console.log('✨ La foresta ti benedice!');
        // Logica per aumentare spawn di vite
        break;

      case 'clear_path':
        console.log('🛤️ Sentiero libero davanti a te!');
        // Logica per ridurre ostacoli temporaneamente
        break;
    }
  }

  /**
   * Verifica se il livello è completato
   */
  isLevelCompleted(level, gameState) {
    const levelConfig = this.levelProgression[level];
    if (!levelConfig) return false;

    return gameState.distanceTraveled >= levelConfig.maxDistance && 
           gameState.score >= levelConfig.giftsRequired;
  }

  /**
   * Restituisce il prossimo livello disponibile
   */
  getNextLevel(currentLevel, gameState) {
    if (this.isLevelCompleted(currentLevel, gameState)) {
      const nextLevel = currentLevel + 1;
      return this.levelProgression[nextLevel] ? nextLevel : null;
    }
    return null;
  }

  /**
   * Restituisce informazioni sul livello corrente
   */
  getLevelInfo(level) {
    const config = this.levelProgression[level];
    if (!config) return null;

    return {
      level: level,
      name: config.description,
      maxDistance: config.maxDistance,
      giftsRequired: config.giftsRequired,
      obstacles: config.obstacles,
      difficulty: config.spawnRate
    };
  }

  /**
   * Verifica se la sezione è completata
   */
  isSectionCompleted(gameState) {
    const maxLevel = Math.max(...Object.keys(this.levelProgression).map(Number));
    return this.isLevelCompleted(maxLevel, gameState);
  }

  /**
   * Restituisce statistiche di progressione
   */
  getProgressStats(gameState) {
    const currentLevel = gameState.level;
    const levelConfig = this.levelProgression[currentLevel];
    
    if (!levelConfig) return null;

    const distanceProgress = Math.min(100, (gameState.distanceTraveled / levelConfig.maxDistance) * 100);
    const giftProgress = Math.min(100, (gameState.score / levelConfig.giftsRequired) * 100);

    return {
      level: currentLevel,
      description: levelConfig.description,
      distanceProgress: Math.floor(distanceProgress),
      giftProgress: Math.floor(giftProgress),
      completed: this.isLevelCompleted(currentLevel, gameState)
    };
  }

  /**
   * Debug info specifico per la foresta
   */
  getDebugInfo() {
    return {
      ...super.getDebugInfo(),
      levels: Object.keys(this.levelProgression).length,
      specialEvents: ['snowstorm', 'forest_blessing', 'clear_path'],
      currentTheme: 'forest'
    };
  }
} 