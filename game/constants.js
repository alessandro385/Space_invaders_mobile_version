// Configurazioni di gioco ottimizzate per mobile
export const GAME_CONFIG = {
  DEBUG: false,
  // NUOVO: Sistema velocità migliorato per mobile - 20m/s target
  BASE_SPEED: 200, // Aumentato per raggiungere 20m/s
  SLEIGH_SPEED: {
    BASE: 8,           // Velocità base slitta (pixel/frame)
    MAX_VELOCITY: 15,  // Velocità massima
    ACCELERATION: 0.9, // Accelerazione touch
    FRICTION: 0.82,    // Attrito per movimento naturale
    BOOST_MULTIPLIER: 1.8  // Moltiplicatore per boost velocità
  },
  // NUOVO: Sistema sparo migliorato
  FIRING_SYSTEM: {
    BASE_RATE: 120,           // Millisecondi tra spari base
    RAPID_FIRE_RATE: 80,      // Rate per sparo rapido
    BURST_FIRE_RATE: 60,      // Rate per burst fire
    COOLDOWN_REDUCTION: 0.7,  // Riduzione cooldown con bonus
    MAX_PROJECTILES: 3        // Massimo proiettili simultanei
  },
  MAX_SPEED: 600, // Velocità massima generale
  SPAWN_RATE: 800, // RIDOTTO per più oggetti (era 1200)
  COLLISION_TOLERANCE: 8, // Maggiore tolleranza per touch
  // Performance ottimizzate per mobile
  MAX_OBJECTS: 35, // AUMENTATO (era 25)
  MAX_PARTICLES: 50, // Ridotto per performance
};

// Controlli - Non necessari per mobile ma mantenuti per compatibilità
export const CONTROLS = {
  LEFT: ['ArrowLeft', 'a', 'A'],
  RIGHT: ['ArrowRight', 'd', 'D'],
  UP: ['ArrowUp', 'w', 'W'],
  DOWN: ['ArrowDown', 's', 'S'],
  FIRE: [' ']
};

// Dimensioni sprite ottimizzate per mobile (leggermente più grandi)
export const SPRITE_SIZES = {
  sleigh: { width: 64, height: 48 },
  sleighRed: { width: 64, height: 48 },
  sleighGreen: { width: 64, height: 48 },
  
  // Ostacoli più grandi per migliore visibilità su mobile
  obstacle: { width: 40, height: 60 }, // +8px width, +8px height
  snowmanObstacle: { width: 40, height: 60 },
  lampPostObstacle: { width: 24, height: 64 },
  reinforcedObstacle: { width: 40, height: 60 },
  armoredSnowman: { width: 40, height: 60 },
  
  // Collectibles più grandi per touch più facile
  gift: { width: 36, height: 36 }, // +4px
  extraLife: { width: 36, height: 36 }, // +4px  
  snowBlower: { width: 36, height: 36 }, // +4px
  moveSpeedBoost: { width: 36, height: 36 }, // +4px
  
  // Boss proporzionalmente più grande
  evilSanta: { width: 96, height: 96 }, // +16px
  
  // Proiettili
  snowball: { width: 12, height: 12 }, // +2px per migliore visibilità
  
  // Zone di collisione per touch - più permissive
  touchZone: { 
    joystick: 140,
    fireButton: 100,
    menuButton: 60
  }
};

// Configurazioni touch specifiche per mobile
export const TOUCH_CONFIG = {
  // Joystick
  JOYSTICK_DEAD_ZONE: 0.15, // Zona morta per evitare drift
  JOYSTICK_SENSITIVITY: 1.3, // AUMENTATO: Sensibilità del movimento
  JOYSTICK_MAX_DISTANCE: 45, // AUMENTATO: Distanza massima dal centro
  
  // NUOVO: Sistema sparo touch migliorato
  FIRE_BUTTON: {
    BASE_RATE: 120,        // ms tra spari base
    HOLD_RATE: 80,         // ms tra spari tenendo premuto
    BURST_RATE: 60,        // ms per burst fire
    INITIAL_DELAY: 50,     // Delay primo sparo
    ACCELERATION: 0.9,     // Accelerazione firing rate
    MAX_RATE: 40          // Rate massimo (25 spari/sec)
  },
  
  // Fire button legacy (deprecato ma mantenuto per compatibilità)
  FIRE_REPEAT_RATE: 120, // Ridotto da 150 per spari più rapidi
  HAPTIC_FEEDBACK: true, // Vibrazione se supportata
  
  // Gesture recognition
  SWIPE_THRESHOLD: 50, // Soglia per riconoscimento swipe
  TAP_TIMEOUT: 200, // Timeout per distinguere tap da hold
  
  // Performance
  TOUCH_SAMPLE_RATE: 60, // FPS per sampling touch
  RENDER_SCALE: 1.0 // Scala rendering (1.0 = nativo)
};

// NUOVA SEZIONE: Configurazioni spawn bilanciate
export const SPAWN_CONFIG = {
  // Probabilità spawn oggetti (su 100)
  OBSTACLE_CHANCE: 65, // AUMENTATO (era implicito 40-50)
  GIFT_CHANCE: 25, // RIDOTTO per bilanciare
  BONUS_CHANCE: 8, // Bonus vari
  LIFE_CHANCE: 2, // DRASTICAMENTE RIDOTTO (era ~10)
  
  // Numero oggetti per wave
  MIN_OBSTACLES_PER_WAVE: 3, // AUMENTATO (era 2)
  MAX_OBSTACLES_PER_WAVE: 8, // AUMENTATO (era 6)
  MIN_GIFTS_PER_WAVE: 1,
  MAX_GIFTS_PER_WAVE: 3,
  
  // Intervalli spawn per livello
  LEVEL_SPAWN_RATES: [
    { level: 1, interval: 1000, difficulty: 0.8 },
    { level: 2, interval: 800, difficulty: 1.0 }, 
    { level: 3, interval: 600, difficulty: 1.3 },
    { level: 4, interval: 500, difficulty: 1.5 }
  ]
};

// NUOVA SEZIONE: Configurazioni moltiplicatori
export const MULTIPLIER_CONFIG = {
  // Moltiplicatore sparo
  FIRE_MULTIPLIER: {
    duration: 15000, // 15 secondi
    projectiles: 3, // Sparo triplo
    cooldown_reduction: 0.5, // 50% più veloce
    spread_angle: 15 // Gradi di spread
  },
  
  // Moltiplicatore velocità movimento
  SPEED_MULTIPLIER: {
    duration: 20000, // 20 secondi  
    speed_boost: 1.8, // 80% più veloce
    trail_effect: true, // Effetto scia
    glow_effect: true // Effetto luminoso
  },
  
  // Moltiplicatore punteggio (opzionale)
  SCORE_MULTIPLIER: {
    duration: 10000, // 10 secondi
    multiplier: 2, // x2 punti
    effect_color: '#FFD700' // Colore effetto
  }
};

// Configurazioni di difficoltà ottimizzate per mobile
export const DIFFICULTY_CONFIG = {
  // Progressione con durata minima 1 minuto per livello (1200m a 20m/s)
  LEVEL_THRESHOLDS: [
    { level: 1, distance: 0, gifts: 0 },         // Livello 1: 0-1200m (1 min), 10 regali
    { level: 2, distance: 1200, gifts: 10 },     // Livello 2: 1200-2400m (1 min), +10 regali  
    { level: 3, distance: 2400, gifts: 20 },     // Livello 3: 2400-3600m (1 min), +15 regali
    { level: 4, distance: 3600, gifts: 35 }      // Boss finale: 3600m, totale 35 regali
  ],
  
  // Spawn rates ottimizzati per mobile
  BASE_SPAWN_INTERVAL: 900, // RIDOTTO (era 1200)
  MIN_SPAWN_INTERVAL: 400, // RIDOTTO (era 800)
  SPAWN_DECREASE_RATE: 0.96, // AUMENTATA progressione (era 0.98)
  
  // Vita bonus MOLTO MENO frequente su mobile
  LIFE_BONUS_INTERVAL: 600, // Ogni 600m (30 secondi a 20m/s)
  LIFE_BONUS_URGENCY_FACTOR: 0.8, // RIDOTTO urgency (era 0.6)
  LIFE_BONUS_MAX_FREQUENCY: 800 // Massimo ogni 800m (40 secondi)
};

// Configurazioni UI per mobile MIGLIORATE
export const UI_CONFIG = {
  // Font sizes ottimizzate per mobile
  FONT_SIZES: {
    small: '14px', // Ridotto per più spazio
    medium: '18px', // Ridotto 
    large: '24px', // Ridotto
    xlarge: '32px', // Ridotto
    title: '42px' // Ridotto
  },
  
  // Colori ottimizzati per schermi mobili
  COLORS: {
    primary: '#1a472a',
    secondary: '#d42c29', 
    accent: '#f4d03f',
    success: '#4CAF50',
    warning: '#FF9800',
    danger: '#F44336',
    info: '#2196F3'
  },
  
  // Layout spacing per touch MIGLIORATO
  SPACING: {
    touch_target: 48, // AUMENTATO (era 44px)
    margin: 12, // RIDOTTO per più spazio (era 16)
    padding: 8, // RIDOTTO (era 12)
    border_radius: 6 // RIDOTTO (era 8)
  },
  
  // NUOVO: Configurazioni responsive
  RESPONSIVE: {
    // Breakpoints per diversi schermi
    SMALL_SCREEN: 480, // px
    MEDIUM_SCREEN: 768, // px  
    LARGE_SCREEN: 1024, // px
    
    // Scale factors per elementi UI
    SCALE_FACTORS: {
      small: 0.8,
      medium: 1.0,
      large: 1.2
    },
    
    // Margini adattivi
    ADAPTIVE_MARGINS: {
      small: 8,
      medium: 12,
      large: 16
    }
  }
};

// Configurazioni performance per mobile
export const PERFORMANCE_CONFIG = {
  // Riduzione dettagli per performance
  PARTICLE_LIMIT: 20, // RIDOTTO (era 30)
  SHADOW_QUALITY: 'low', // low, medium, high
  ANTIALIASING: false, // Disabilitato per performance
  
  // Frame rate targeting
  TARGET_FPS: 60,
  MIN_FPS: 30,
  
  // Memory management
  CLEANUP_INTERVAL: 3000, // RIDOTTO (era 5000) - cleanup più frequente
  MAX_TEXTURE_CACHE: 15, // RIDOTTO (era 20)
  
  // Network/loading
  PRELOAD_ESSENTIAL_ONLY: true,
  LAZY_LOAD_THRESHOLD: 3 // Carica asset quando necessari
};

// Funzione helper per ottenere hitbox con tolleranza mobile
export function getHitbox(type, x, y) {
  const size = SPRITE_SIZES[type];
  const tolerance = GAME_CONFIG.COLLISION_TOLERANCE;
  
  return {
    x: x + tolerance,
    y: y + tolerance,
    width: size.width - (tolerance * 2),
    height: size.height - (tolerance * 2)
  };
}

// NUOVA: Funzione helper per calcolare dimensioni responsive MIGLIORATA
export function getResponsiveSize(baseSize, screenWidth, screenHeight, minSize = 24, maxSize = 80) {
  // Calcola scala basata su entrambe le dimensioni
  const widthScale = screenWidth / 800; // Baseline 800px width
  const heightScale = screenHeight / 600; // Baseline 600px height
  const scale = Math.min(widthScale, heightScale); // Usa la scala minore
  
  // Applica scala con limiti
  const scaledSize = baseSize * Math.min(scale, 2.0); // Max 2x scaling
  return Math.max(minSize, Math.min(maxSize, scaledSize));
}

// NUOVA: Funzione per ottenere configurazioni UI responsive
export function getResponsiveUIConfig(screenWidth, screenHeight) {
  const { RESPONSIVE } = UI_CONFIG;
  
  let screenSize = 'medium';
  if (screenWidth < RESPONSIVE.SMALL_SCREEN) {
    screenSize = 'small';
  } else if (screenWidth > RESPONSIVE.LARGE_SCREEN) {
    screenSize = 'large';
  }
  
  return {
    screenSize,
    scaleFactor: RESPONSIVE.SCALE_FACTORS[screenSize],
    margins: RESPONSIVE.ADAPTIVE_MARGINS[screenSize],
    isSmallScreen: screenSize === 'small',
    isLargeScreen: screenSize === 'large'
  };
}

// Funzione per rilevare capacità del dispositivo
export function getDeviceCapabilities() {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const isAndroid = /Android/.test(navigator.userAgent);
  const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
  
  return {
    // Platform detection
    isIOS,
    isAndroid,
    isSafari,
    platform: isIOS ? 'ios' : isAndroid ? 'android' : 'other',
    
    // Touch support
    hasTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    
    // Hardware capabilities  
    hardwareConcurrency: navigator.hardwareConcurrency || 2,
    deviceMemory: navigator.deviceMemory || 2,
    
    // Display
    pixelRatio: window.devicePixelRatio || 1,
    screenSize: {
      width: window.screen.width,
      height: window.screen.height
    },
    
    // Sensors
    hasGyroscope: 'DeviceOrientationEvent' in window,
    hasAccelerometer: 'DeviceMotionEvent' in window,
    hasVibration: 'vibrate' in navigator && !isIOS, // iOS non supporta vibrazione
    
    // Browser features
    hasWebGL: !!document.createElement('canvas').getContext('webgl'),
    hasWorkers: 'Worker' in window,
    hasOffscreenCanvas: 'OffscreenCanvas' in window,
    
    // Fullscreen support
    hasFullscreen: !!(document.documentElement.requestFullscreen || 
                     document.documentElement.webkitRequestFullscreen ||
                     document.documentElement.mozRequestFullScreen),
    
    // iOS specific features
    iosVersion: isIOS ? parseFloat(navigator.userAgent.match(/OS (\d+)_/)?.[1] || '0') : null
  };
}

// NUOVA: Funzione per calcolare spawn rate dinamico basato su performance
export function getDynamicSpawnRate(currentFPS, targetFPS = 60) {
  const performanceRatio = currentFPS / targetFPS;
  const baseRate = SPAWN_CONFIG.LEVEL_SPAWN_RATES[0].interval;
  
  if (performanceRatio < 0.8) {
    // Performance bassa: riduci spawn
    return baseRate * 1.4;
  } else if (performanceRatio > 1.1) {
    // Performance alta: aumenta spawn
    return baseRate * 0.8;
  }
  
  return baseRate; // Performance normale
} 