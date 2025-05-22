import { BaseSection } from './BaseSection.js';

/**
 * Sezione 2: La Città Natalizia
 * Seconda sezione del gioco con nuovi ostacoli urbani e meccaniche uniche
 * ESEMPIO per mostrare l'estensibilità del sistema
 */
export class CitySection extends BaseSection {
  constructor() {
    super('Città Natalizia', 'city', 1.2); // Più difficile della foresta
    
    // Configurazioni spawn specifiche per la città
    this.spawnConfig = {
      obstacleChance: 70,  // Più ostacoli in città
      giftChance: 20,      // Meno regali
      bonusChance: 10,     // Più bonus
      lifeChance: 3        // Leggermente più vite
    };
    
    // Ostacoli urbani disponibili
    this.availableObstacles = [
      'obstacle',           // Alberi urbani
      'lampPostObstacle',   // Lampioni stradali
      'reinforcedObstacle', // Semafori
      'buildingObstacle',   // NUOVO: Edifici
      'carObstacle'         // NUOVO: Auto ferme
    ];
    
    // Bonus speciali della città
    this.specialBonuses = [
      'cityBooster',        // NUOVO: Boost urbano
      'trafficCleaner',     // NUOVO: Pulisce traffico
      'nightVision'         // NUOVO: Visione notturna
    ];
    
    // Impostazioni background urbano
    this.backgroundSettings = {
      snowfall: true,
      stars: false,         // Luci cittadine invece di stelle
      speed: 1.2,          // Più veloce
      theme: 'city',
      buildingCount: 8,    // Palazzi di sfondo
      streetLights: true,  // Illuminazione stradale
      snowIntensity: 0.5   // Meno neve in città
    };
    
    // Progressione livelli della città
    this.levelProgression = {
      1: {
        maxDistance: 3000,
        giftsRequired: 25,
        obstacles: ['lampPostObstacle', 'reinforcedObstacle'],
        spawnRate: 1.1,
        description: 'Periferia Urbana'
      },
      2: {
        maxDistance: 6000,
        giftsRequired: 50,
        obstacles: ['lampPostObstacle', 'reinforcedObstacle', 'buildingObstacle'],
        spawnRate: 1.3,
        description: 'Centro Storico'
      },
      3: {
        maxDistance: 10000,
        giftsRequired: 80,
        obstacles: ['lampPostObstacle', 'reinforcedObstacle', 'buildingObstacle', 'carObstacle'],
        spawnRate: 1.5,
        description: 'Distretto Commerciale'
      },
      4: {
        maxDistance: 15000,
        giftsRequired: 120,
        obstacles: ['lampPostObstacle', 'reinforcedObstacle', 'buildingObstacle', 'carObstacle'],
        spawnRate: 1.8,
        description: 'Grattacieli del Centro'
      }
    };
  }

  /**
   * Inizializza la sezione città
   */
  initialize(game) {
    super.initialize(game);
    
    // Configura il background per la città
    if (game.background && game.background.setTheme) {
      game.background.setTheme('city');
    }
    
    console.log('🏙️ Sezione Città inizializzata');
    console.log(`🚦 Nuovi ostacoli urbani disponibili`);
  }

  /**
   * Pesi specifici per la città - ostacoli urbani bilanciati
   */
  getObstacleWeights(level) {
    const baseWeights = {
      'lampPostObstacle': 35,   // Comune in città
      'reinforcedObstacle': 25, // Semafori
      'buildingObstacle': 20,   // Edifici - da livello 2
      'carObstacle': 15,        // Auto - da livello 3
      'obstacle': 5             // Pochi alberi in città
    };

    // Adatta i pesi in base al livello
    if (level === 1) {
      return { 
        'lampPostObstacle': 60, 
        'reinforcedObstacle': 40 
      };
    } else if (level === 2) {
      return { 
        'lampPostObstacle': 40, 
        'reinforcedObstacle': 30,
        'buildingObstacle': 30
      };
    } else if (level === 3) {
      return { 
        'lampPostObstacle': 30, 
        'reinforcedObstacle': 25,
        'buildingObstacle': 25,
        'carObstacle': 20
      };
    }

    return baseWeights;
  }

  /**
   * Eventi speciali della città
   */
  checkSpecialEvents(gameState) {
    // Evento: Ora di Punta (più traffico, ma più bonus)
    if (gameState.distanceTraveled > 4000 && 
        gameState.distanceTraveled < 4200 && 
        Math.random() < 0.12) {
      return {
        type: 'rush_hour',
        duration: 6000,
        effects: {
          carSpawnIncrease: 2.0,   // Più auto
          bonusChance: 15,         // Più bonus
          scoreMultiplier: 1.5     // Più punti durante traffico
        }
      };
    }

    // Evento: Blackout (visibilità ridotta, spawning rallentato)
    if (gameState.distanceTraveled > 8000 && 
        gameState.distanceTraveled < 8100 && 
        Math.random() < 0.08) {
      return {
        type: 'blackout',
        duration: 4000,
        effects: {
          visibility: 0.4,         // Molto buio
          spawnReduction: 0.6,     // Meno ostacoli
          streetLightsOff: true    // Luci spente
        }
      };
    }

    // Evento: Festa di Natale (bonus extra, atmosfera festosa)
    if (gameState.distanceTraveled > 12000 && 
        gameState.distanceTraveled < 12200 && 
        Math.random() < 0.1) {
      return {
        type: 'christmas_party',
        duration: 5000,
        effects: {
          giftBonus: 3.0,          // Tripli regali
          bonusSpawnIncrease: 2.0, // Più bonus
          festiveLights: true      // Luci natalizie
        }
      };
    }

    return null;
  }

  /**
   * Gestisce gli eventi speciali della città
   */
  handleSpecialEvent(eventType, data) {
    switch (eventType) {
      case 'rush_hour':
        console.log('🚗 Ora di punta! Attenzione al traffico!');
        break;

      case 'blackout':
        console.log('💡 Blackout in città! Visibilità ridotta!');
        if (this.game && this.game.background) {
          this.game.background.setDarkness(0.6);
        }
        break;

      case 'christmas_party':
        console.log('🎉 Festa di Natale in corso! Bonus ovunque!');
        break;
    }
  }

  /**
   * Seleziona bonus speciali della città
   */
  selectSpecialBonus() {
    const cityBonuses = [
      'cityBooster',    // Velocità urbana aumentata
      'trafficCleaner', // Rimuove ostacoli auto temporaneamente
      'nightVision'     // Migliora visibilità di notte
    ];
    
    return cityBonuses[Math.floor(Math.random() * cityBonuses.length)];
  }

  /**
   * Debug info specifico per la città
   */
  getDebugInfo() {
    return {
      ...super.getDebugInfo(),
      levels: Object.keys(this.levelProgression).length,
      specialEvents: ['rush_hour', 'blackout', 'christmas_party'],
      currentTheme: 'city',
      newObstacles: ['buildingObstacle', 'carObstacle'],
      newBonuses: ['cityBooster', 'trafficCleaner', 'nightVision']
    };
  }
} 