/**
 * Classe base per tutte le sezioni del gioco
 * Fornisce l'interfaccia comune per gestire spawn, ostacoli, bonus e progressione
 */
export class BaseSection {
  constructor(name, theme, difficultyMultiplier = 1.0) {
    this.name = name;
    this.theme = theme;
    this.difficultyMultiplier = difficultyMultiplier;
    
    // Configurazioni base che possono essere override dalle sezioni
    this.spawnConfig = {
      obstacleChance: 65,
      giftChance: 25,
      bonusChance: 8,
      lifeChance: 2
    };
    
    // Ostacoli disponibili in questa sezione
    this.availableObstacles = ['obstacle'];
    
    // Bonus speciali per questa sezione
    this.specialBonuses = [];
    
    // Background specifico
    this.backgroundSettings = {
      snowfall: true,
      stars: true,
      speed: 1.0
    };
  }

  /**
   * Inizializza la sezione (chiamato quando si entra nella sezione)
   */
  initialize(game) {
    this.game = game;
    console.log(`🎮 Inizializzazione sezione: ${this.name}`);
  }

  /**
   * Seleziona un ostacolo per il spawn basato sulla difficoltà della sezione
   */
  selectObstacle(level) {
    // Implementazione base - può essere override
    const obstacles = this.getAvailableObstacles(level);
    const weights = this.getObstacleWeights(level);
    return this.weightedRandomSelect(obstacles, weights);
  }

  /**
   * Restituisce gli ostacoli disponibili per il livello corrente
   */
  getAvailableObstacles(level) {
    return this.availableObstacles;
  }

  /**
   * Restituisce i pesi per la selezione degli ostacoli
   */
  getObstacleWeights(level) {
    // Implementazione base - bilanciata
    return {
      'obstacle': 40,
      'snowmanObstacle': 25,
      'lampPostObstacle': 20,
      'reinforcedObstacle': 10,
      'armoredSnowman': 5
    };
  }

  /**
   * Seleziona un bonus speciale per questa sezione
   */
  selectSpecialBonus() {
    if (this.specialBonuses.length === 0) return null;
    return this.specialBonuses[Math.floor(Math.random() * this.specialBonuses.length)];
  }

  /**
   * Calcola la velocità di spawn per questa sezione
   */
  calculateSpawnRate(baseRate, level) {
    return baseRate * this.difficultyMultiplier;
  }

  /**
   * Gestisce eventi speciali della sezione
   */
  handleSpecialEvent(eventType, data) {
    // Implementazione base vuota - override nelle sezioni specifiche
  }

  /**
   * Verifica se è il momento di attivare un evento speciale
   */
  checkSpecialEvents(gameState) {
    // Implementazione base vuota - override nelle sezioni specifiche
    return null;
  }

  /**
   * Restituisce le impostazioni di background per questa sezione
   */
  getBackgroundSettings() {
    return this.backgroundSettings;
  }

  /**
   * Utility per selezione pesata
   */
  weightedRandomSelect(items, weights) {
    const totalWeight = items.reduce((sum, item) => sum + (weights[item] || 1), 0);
    let random = Math.random() * totalWeight;
    
    for (const item of items) {
      random -= weights[item] || 1;
      if (random <= 0) return item;
    }
    
    return items[0];
  }

  /**
   * Restituisce informazioni di debug per la sezione
   */
  getDebugInfo() {
    return {
      name: this.name,
      theme: this.theme,
      difficulty: this.difficultyMultiplier,
      obstacles: this.availableObstacles.length,
      specialBonuses: this.specialBonuses.length
    };
  }
} 