export class InputManager {
  constructor() {
    this.keys = new Set();
    this.touches = new Map();
    this.touchSupported = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    this.setupListeners();
  }

  setupListeners() {
    // Keyboard listeners per debug/test su desktop
    window.addEventListener('keydown', (e) => {
      this.keys.add(e.key);
      // Previene lo scroll per i tasti freccia e spazio
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '].includes(e.key)) {
        e.preventDefault();
      }
    });
    
    window.addEventListener('keyup', (e) => this.keys.delete(e.key));
    
    // Touch listeners ottimizzati per mobile
    if (this.touchSupported) {
      this.setupTouchListeners();
    }
  }

  setupTouchListeners() {
    // Previeni comportamenti di default del browser mobile
    document.addEventListener('touchstart', (e) => {
      // Permetti solo il primo touch per alcuni elementi specifici
      if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
      }
    }, { passive: false });

    document.addEventListener('touchmove', (e) => {
      e.preventDefault(); // Previeni scroll durante il gioco
    }, { passive: false });

    document.addEventListener('touchend', (e) => {
      // Gestione touch end - pulisce eventuali touch rimasti
      for (let touch of e.changedTouches) {
        this.touches.delete(touch.identifier);
      }
    });

    document.addEventListener('touchcancel', (e) => {
      // Gestione touch cancel - pulisce eventuali touch interrotti
      for (let touch of e.changedTouches) {
        this.touches.delete(touch.identifier);
      }
    });
  }

  // Metodi per keyboard (mantenuti per compatibilità)
  isKeyPressed(key) {
    return this.keys.has(key);
  }

  // Metodi specifici per touch
  addTouch(touchId, x, y, element = null) {
    this.touches.set(touchId, {
      x: x,
      y: y, 
      startTime: Date.now(),
      element: element
    });
  }

  updateTouch(touchId, x, y) {
    const touch = this.touches.get(touchId);
    if (touch) {
      touch.x = x;
      touch.y = y;
    }
  }

  removeTouch(touchId) {
    this.touches.delete(touchId);
  }

  getTouch(touchId) {
    return this.touches.get(touchId);
  }

  getAllTouches() {
    return Array.from(this.touches.values());
  }

  getTouchCount() {
    return this.touches.size;
  }

  // Utility per gesture recognition
  getTouchDuration(touchId) {
    const touch = this.touches.get(touchId);
    return touch ? Date.now() - touch.startTime : 0;
  }

  // Pulisce tutti gli input
  clear() {
    this.keys.clear();
    this.touches.clear();
  }

  // Debugging utility
  getDebugInfo() {
    return {
      keys: Array.from(this.keys),
      touchCount: this.touches.size,
      touchSupported: this.touchSupported,
      activeTouches: Array.from(this.touches.keys())
    };
  }
} 