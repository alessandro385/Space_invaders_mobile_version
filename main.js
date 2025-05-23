import { Game } from './game/Game.js';
import { ASSETS } from './game/assets.js';
import { SLEIGH_SPRITES } from './game/assets/sleighs.js';

class MobileGameManager {
  constructor() {
    this.game = null;
    this.canvas = null;
    this.joystick = null;
    this.fireButton = null;
    this.isPlaying = false;
    this.touchStartTime = 0;
    
    // NUOVO: Selezione slitta e modalità fuoco amico
    this.selectedSleigh = 'sleigh'; // Default
    this.friendlyFireMode = true; // Default: fuoco amico attivo
    
    // Touch tracking
    this.activeTouches = new Map();
    this.joystickActive = false;
    this.joystickTouchId = null;
    this.joystickCenter = { x: 0, y: 0 };
    this.joystickKnob = null;
    
    // Movement state
    this.moveX = 0;
    this.moveY = 0;
    
    // NUOVO: Sistema sparo continuo con hold - CAMBIATO: 0.8 secondi
    this.isFiring = false;
    this.fireInterval = null;
    this.fireRate = 800; // 0.8 secondi in millisecondi
    
    this.init();
  }

  init() {
    this.setupViewport();
    this.setupHTML();
    this.setupFullscreen();
    this.setupOrientationWarning();
    this.setupEventListeners();
    this.showMenu();
  }

  setupViewport() {
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      
      console.log('📱 Viewport aggiornato:', {
        windowHeight: window.innerHeight,
        screenHeight: screen.height,
        vh: vh + 'px'
      });
    };

    setViewportHeight();

    window.addEventListener('resize', () => {
      setTimeout(setViewportHeight, 100);
    });

    window.addEventListener('orientationchange', () => {
      setTimeout(setViewportHeight, 300);
    });

    let isFirstScroll = true;
    window.addEventListener('scroll', () => {
      if (isFirstScroll) {
        window.scrollTo(0, 1);
        isFirstScroll = false;
        setTimeout(setViewportHeight, 500);
      }
    });

    setTimeout(() => {
      window.scrollTo(0, 1);
      setViewportHeight();
    }, 100);
  }

  setupHTML() {
    document.querySelector('#app').innerHTML = `
      <!-- Warning per orientamento portrait -->
      <div class="orientation-warning">
        <div class="orientation-icon">📱➡️📱</div>
        <h2>Ruota il dispositivo</h2>
        <p>Per una migliore esperienza di gioco,<br>usa il dispositivo in orizzontale</p>
      </div>
      
      <!-- Container del gioco -->
      <div id="gameContainer">
        <canvas id="gameCanvas"></canvas>
        
        <!-- HUD Mobile Minimalista -->
        <div class="mobile-hud hidden" id="mobileHUD">
          <div class="hud-left">
            <div id="livesDisplay">❤️ 3</div>
            <div id="scoreDisplay">🎁 0</div>
          </div>
          <div class="hud-center hidden" id="bonusAlert">
            ❤️ BONUS VITA!
          </div>
          <div class="hud-right">
            <div id="levelDisplay">Liv. 1</div>
            <div id="distanceDisplay">📏 0m</div>
            <div id="friendlyFireIndicator" class="friendly-fire-indicator">🔥 FUOCO AMICO</div>
          </div>
        </div>
        
        <!-- Controlli Touch -->
        <div id="touchControlsOverlay">
          <div class="virtual-joystick" id="virtualJoystick">
            <div class="joystick-knob" id="joystickKnob"></div>
          </div>
          <button id="fireButtonTouch">❄️</button>
        </div>
        
        <!-- Menu Principale -->
        <div class="menu" id="gameMenu">
          <h1>🎅 La Corsa di Babbo Natale Mobile 🎄</h1>
          <button id="startGameBtn">🚀 Inizia l'Avventura! 🎁</button>
          <button id="instructionsBtn">📋 Come Giocare</button>
          
          <!-- NUOVO: Opzioni modalità fuoco amico -->
          <div class="game-options">
            <h3>⚙️ Opzioni</h3>
            <div class="option-row">
              <label for="friendlyFireToggle">🔥 Modalità Fuoco Amico:</label>
              <button id="friendlyFireToggle" class="toggle-button active">ON</button>
            </div>
            <p class="option-description">
              <strong>ON:</strong> I tuoi colpi distruggono anche regali e bonus<br>
              <strong>OFF:</strong> I tuoi colpi distruggono solo ostacoli
            </p>
          </div>
        </div>
        
        <!-- NUOVO: Menu Selezione Slitta - Layout Orizzontale Mobile -->
        <div class="menu hidden" id="sleighSelectionMenu">
          <h2>🚁 Scegli la tua Slitta</h2>
          <div class="sleigh-options-mobile">
            <div class="sleigh-option-mobile" data-sleigh="sleigh">
              <div class="sleigh-preview-mobile">
                <img id="sleighPreview1" src="" alt="Slitta Classica">
              </div>
              <h3>Classica</h3>
              <p>Tradizionale</p>
              <button class="select-sleigh-btn" data-sleigh="sleigh">Seleziona</button>
            </div>
            <div class="sleigh-option-mobile" data-sleigh="sleighRed">
              <div class="sleigh-preview-mobile">
                <img id="sleighPreview2" src="" alt="Slitta Rossa">
              </div>
              <h3>Rossa</h3>
              <p>Sportiva</p>
              <button class="select-sleigh-btn" data-sleigh="sleighRed">Seleziona</button>
            </div>
            <div class="sleigh-option-mobile" data-sleigh="sleighGreen">
              <div class="sleigh-preview-mobile">
                <img id="sleighPreview3" src="" alt="Slitta Elfica">
              </div>
              <h3>Elfica</h3>
              <p>Magica</p>
              <button class="select-sleigh-btn" data-sleigh="sleighGreen">Seleziona</button>
            </div>
          </div>
          <button id="backToMenuFromSleigh">⬅️ Torna al Menu</button>
        </div>
        
        <!-- Istruzioni -->
        <div class="menu hidden" id="instructionsMenu">
          <h2>🎮 Come Giocare</h2>
          <p style="text-align: left; max-width: 300px; line-height: 1.6;">
            🕹️ <strong>Movimento:</strong> Usa il joystick virtuale<br>
            ❄️ <strong>Sparo continuo:</strong> Tieni premuto per sparare ogni 0.9s<br>
            🎁 <strong>Raccogli regali</strong> per punti<br>
            ❤️ <strong>Prendi i cuori</strong> per vite extra<br>
            🚫 <strong>Evita gli ostacoli</strong> o distruggili!<br>
            📏 <strong>Progressione:</strong> Livelli basati su distanza e regali<br>
            🔥 <strong>Fuoco Amico:</strong> Scegli se distruggere anche i bonus
          </p>
          <button id="backToMenuBtn">⬅️ Torna al Menu</button>
        </div>
      </div>
      
      <!-- Indicatori di stato -->
      <div id="statusIndicator" class="status-indicator hidden"></div>
    `;

    this.canvas = document.getElementById('gameCanvas');
    this.joystick = document.getElementById('virtualJoystick');
    this.joystickKnob = document.getElementById('joystickKnob');
    this.fireButton = document.getElementById('fireButtonTouch');
  }

  setupFullscreen() {
    const requestFullscreen = () => {
      const element = document.documentElement;
      
      if (element.requestFullscreen) {
        element.requestFullscreen({ navigationUI: "hide" }).catch(e => 
          console.log('Fullscreen standard non supportato:', e));
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      }
      
      if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
        window.scrollTo(0, 1);
        document.body.style.height = '100vh';
      }
    };

    const enableFullscreen = () => {
      requestFullscreen();
      
      setTimeout(() => {
        window.scrollTo(0, 1);
      }, 100);
    };

    document.addEventListener('touchstart', enableFullscreen, { once: true });
    document.addEventListener('click', enableFullscreen, { once: true });
    
    window.addEventListener('load', () => {
      setTimeout(() => {
        window.scrollTo(0, 1);
        document.body.style.height = window.innerHeight + 'px';
      }, 0);
    });
  }

  setupOrientationWarning() {
    const updateOrientation = () => {
      const warning = document.querySelector('.orientation-warning');
      if (window.innerHeight > window.innerWidth) {
        warning.style.display = 'flex';
      } else {
        warning.style.display = 'none';
      }
    };

    window.addEventListener('orientationchange', () => {
      setTimeout(updateOrientation, 100);
    });
    window.addEventListener('resize', updateOrientation);
    updateOrientation();
  }

  setupEventListeners() {
    // CAMBIATO: "Inizia l'avventura" ora va alla selezione slitta automaticamente
    document.getElementById('startGameBtn').addEventListener('click', () => this.showSleighSelection());
    document.getElementById('instructionsBtn').addEventListener('click', () => this.showInstructions());
    document.getElementById('backToMenuBtn').addEventListener('click', () => this.showMenu());
    
    // NUOVO: Eventi per selezione slitta
    document.getElementById('backToMenuFromSleigh').addEventListener('click', () => this.showMenu());
    
    // NUOVO: Eventi per selezione delle slitte - ORA AVVIA IL GIOCO DIRETTAMENTE
    document.querySelectorAll('.select-sleigh-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const sleighType = e.target.getAttribute('data-sleigh');
        this.selectSleighAndStartGame(sleighType);
      });
    });
    
    // NUOVO: Toggle modalità fuoco amico
    document.getElementById('friendlyFireToggle').addEventListener('click', () => this.toggleFriendlyFire());
    
    // Touch e joystick
    this.setupJoystick();
    this.setupFireButton();
    
    document.addEventListener('contextmenu', (e) => e.preventDefault());
    
    document.addEventListener('touchmove', (e) => {
      if (this.isPlaying) {
        e.preventDefault();
      }
    }, { passive: false });
    
    // NUOVO: Carica le immagini SVG delle slitte
    this.loadSleighImages();
  }

  setupJoystick() {
    const joystickArea = this.joystick;
    const knob = this.joystickKnob;
    const maxDistance = 40;

    const updateJoystickCenter = () => {
      const rect = joystickArea.getBoundingClientRect();
      this.joystickCenter = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };
    };

    const handleJoystickStart = (touch) => {
      if (this.joystickTouchId !== null) return;
      
      updateJoystickCenter();
      this.joystickTouchId = touch.identifier;
      this.joystickActive = true;
      knob.classList.add('active');
      
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    };

    const handleJoystickMove = (touch) => {
      if (touch.identifier !== this.joystickTouchId) return;
      
      const deltaX = touch.clientX - this.joystickCenter.x;
      const deltaY = touch.clientY - this.joystickCenter.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      if (distance <= maxDistance) {
        knob.style.transform = `translate(-50%, -50%) translate(${deltaX}px, ${deltaY}px)`;
        this.moveX = deltaX / maxDistance;
        this.moveY = deltaY / maxDistance;
      } else {
        const angle = Math.atan2(deltaY, deltaX);
        const limitedX = Math.cos(angle) * maxDistance;
        const limitedY = Math.sin(angle) * maxDistance;
        
        knob.style.transform = `translate(-50%, -50%) translate(${limitedX}px, ${limitedY}px)`;
        this.moveX = limitedX / maxDistance;
        this.moveY = limitedY / maxDistance;
      }

      if (this.game) {
        this.game.setTouchMovement(this.moveX, this.moveY);
      }
    };

    const handleJoystickEnd = (touch) => {
      if (touch.identifier !== this.joystickTouchId) return;
      
      this.joystickTouchId = null;
      this.joystickActive = false;
      knob.classList.remove('active');
      knob.style.transform = 'translate(-50%, -50%)';
      this.moveX = 0;
      this.moveY = 0;
      
      if (this.game) {
        this.game.clearMovementInput();
      }
    };

    joystickArea.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.changedTouches[0];
      handleJoystickStart(touch);
    });

    document.addEventListener('touchmove', (e) => {
      if (this.joystickActive) {
        e.preventDefault();
        for (let touch of e.changedTouches) {
          if (touch.identifier === this.joystickTouchId) {
            handleJoystickMove(touch);
            break;
          }
        }
      }
    }, { passive: false });

    document.addEventListener('touchend', (e) => {
      for (let touch of e.changedTouches) {
        handleJoystickEnd(touch);
      }
    });

    window.addEventListener('resize', updateJoystickCenter);
    window.addEventListener('orientationchange', () => {
      setTimeout(updateJoystickCenter, 100);
    });
  }

  setupFireButton() {
    // NUOVO: Sistema sparo continuo con hold - tieni premuto per sparare ogni 0.9s
    
    const startContinuousFiring = () => {
      if (!this.isFiring && this.game) {
        this.isFiring = true;
        
        // Primo sparo immediato
        this.game.fireSnowball();
        
        // Avvia sparo continuo ogni 0.9 secondi
        const continuousFire = () => {
          if (this.isFiring && this.game) {
            this.game.fireSnowball();
            this.fireInterval = setTimeout(continuousFire, this.fireRate);
          }
        };
        
        // Inizia il ciclo dopo il primo sparo
        this.fireInterval = setTimeout(continuousFire, this.fireRate);
        
        console.log('🔫 Sparo continuo AVVIATO - ogni 0.9s');
        
        // Feedback visivo - cambia aspetto pulsante
        this.fireButton.style.backgroundColor = '#ff6b6b';
        this.fireButton.style.boxShadow = '0 0 15px rgba(255, 107, 107, 0.8)';
        this.fireButton.style.transform = 'scale(1.1)';
      }
    };
    
    const stopContinuousFiring = () => {
      if (this.isFiring) {
        this.isFiring = false;
        
        if (this.fireInterval) {
          clearTimeout(this.fireInterval);
          this.fireInterval = null;
        }
        
        console.log('🔫 Sparo continuo FERMATO');
        
        // Ripristina aspetto pulsante
        this.fireButton.style.backgroundColor = '';
        this.fireButton.style.boxShadow = '';
        this.fireButton.style.transform = '';
      }
    };

    // Eventi touch per hold - NUOVO: touchstart avvia, touchend ferma
    this.fireButton.addEventListener('touchstart', (e) => {
      e.preventDefault();
      startContinuousFiring();
      
      // Feedback aptico
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    });
    
    this.fireButton.addEventListener('touchend', (e) => {
      e.preventDefault();
      stopContinuousFiring();
    });
    
    this.fireButton.addEventListener('touchcancel', (e) => {
      e.preventDefault();
      stopContinuousFiring();
    });
    
    // Previeni context menu
    this.fireButton.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });

    // Gestisci quando il gioco si ferma
    this.stopFiring = stopContinuousFiring;
  }

  showMenu() {
    // Ferma lo sparo continuo quando si va al menu
    if (this.stopFiring) {
      this.stopFiring();
    }
    
    document.getElementById('gameMenu').classList.remove('hidden');
    document.getElementById('instructionsMenu').classList.add('hidden');
    document.getElementById('sleighSelectionMenu').classList.add('hidden');
    document.getElementById('mobileHUD').classList.add('hidden');
    document.getElementById('touchControlsOverlay').style.display = 'none';
    this.isPlaying = false;
  }

  showInstructions() {
    document.getElementById('gameMenu').classList.add('hidden');
    document.getElementById('instructionsMenu').classList.remove('hidden');
    document.getElementById('sleighSelectionMenu').classList.add('hidden');
  }

  startGame() {
    document.getElementById('gameMenu').classList.add('hidden');
    document.getElementById('instructionsMenu').classList.add('hidden');
    document.getElementById('sleighSelectionMenu').classList.add('hidden');
    document.getElementById('mobileHUD').classList.remove('hidden');
    document.getElementById('touchControlsOverlay').style.display = 'flex';
    
    this.isPlaying = true;
    this.setupCanvas();
    this.game = new Game(this.canvas, this.selectedSleigh, () => this.onGameEnd());
    if (this.game.setFriendlyFireMode) {
      this.game.setFriendlyFireMode(this.friendlyFireMode);
    }
    this.startGameLoop();
    
    this.updateFriendlyFireIndicator();
    
    this.showStatusIndicator(`🚀 Gioco Iniziato con ${this.getSleighName(this.selectedSleigh)}!`, 2000);
  }

  setupCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    
    window.addEventListener('resize', () => {
      if (this.isPlaying) {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        if (this.game) {
          this.game.canvas = this.canvas;
          this.game.ctx = this.canvas.getContext('2d');
        }
      }
    });
  }

  startGameLoop() {
    const gameLoop = () => {
      if (this.game && this.isPlaying) {
        this.game.update();
        this.game.draw();
        this.updateMobileHUD();
        requestAnimationFrame(gameLoop);
      }
    };
    gameLoop();
  }

  updateMobileHUD() {
    if (!this.game) return;
    
    const state = this.game.state;
    document.getElementById('livesDisplay').textContent = `❤️ ${state.lives}`;
    document.getElementById('scoreDisplay').textContent = `🎁 ${state.score}`;
    document.getElementById('levelDisplay').textContent = `Liv. ${state.level}`;
    
    // NUOVO: Mostra distanza formattata
    const distanceElement = document.getElementById('distanceDisplay');
    if (distanceElement) {
      distanceElement.textContent = `📏 ${state.getFormattedDistance()}`;
    }
    
    const bonusAlert = document.getElementById('bonusAlert');
    const hasHearts = this.game.objects && this.game.objects.some(obj => obj.type === 'extraLife' && obj.active);
    
    if (hasHearts) {
      bonusAlert.classList.remove('hidden');
    } else {
      bonusAlert.classList.add('hidden');
    }
    
    if (state.gameOver) {
      this.showGameOver();
    } else if (state.gameWon) {
      this.showVictory();
    }
  }

  showGameOver() {
    this.isPlaying = false;
    
    // Ferma lo sparo continuo al game over
    if (this.stopFiring) {
      this.stopFiring();
    }
    
    document.getElementById('touchControlsOverlay').style.display = 'none';
    document.getElementById('mobileHUD').classList.add('hidden');
    
    const overlay = document.createElement('div');
    overlay.className = 'game-overlay';
    overlay.innerHTML = `
      <div class="overlay-title">Game Over!</div>
      <div class="overlay-score">🎁 Regali Raccolti: ${this.game.state.score}</div>
      <button class="overlay-button" onclick="mobileGame.restartGame()">🔄 Riprova</button>
      <button class="overlay-button secondary" onclick="mobileGame.goToMenu()">🏠 Menu</button>
    `;
    document.getElementById('gameContainer').appendChild(overlay);
    
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }
  }

  showVictory() {
    this.isPlaying = false;
    
    // Ferma lo sparo continuo anche in vittoria
    if (this.stopFiring) {
      this.stopFiring();
    }
    
    document.getElementById('touchControlsOverlay').style.display = 'none';
    document.getElementById('mobileHUD').classList.add('hidden');
    
    const overlay = document.createElement('div');
    overlay.className = 'game-overlay';
    overlay.innerHTML = `
      <div class="overlay-title">🎉 Vittoria!</div>
      <div class="overlay-score">🎁 Regali Consegnati: ${this.game.state.score}</div>
      <div class="overlay-score">Zona ${this.game.state.zone} Completata!</div>
      <button class="overlay-button" onclick="mobileGame.nextZone()">🚀 Zona Successiva</button>
      <button class="overlay-button secondary" onclick="mobileGame.restartGame()">🔄 Ricomincia</button>
    `;
    document.getElementById('gameContainer').appendChild(overlay);
    
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100, 50, 200]);
    }
  }

  restartGame() {
    this.clearOverlays();
    
    // Ferma lo sparo continuo prima di riavviare
    if (this.stopFiring) {
      this.stopFiring();
    }
    
    if (this.game) {
      this.game.restart();
    }
    this.startGame();
  }

  nextZone() {
    this.clearOverlays();
    
    // Ferma lo sparo continuo prima di avanzare
    if (this.stopFiring) {
      this.stopFiring();
    }
    
    if (this.game) {
      this.game.advanceToNextZone();
    }
    this.startGame();
  }

  // NUOVO: Metodo per tornare al menu principale
  goToMenu() {
    this.clearOverlays();
    
    // Ferma lo sparo continuo
    if (this.stopFiring) {
      this.stopFiring();
    }
    
    // Reset completo del gioco
    this.isPlaying = false;
    this.game = null;
    
    // Mostra il menu
    this.showMenu();
  }

  onGameEnd() {
    this.goToMenu();
  }

  clearOverlays() {
    const overlays = document.querySelectorAll('.game-overlay');
    overlays.forEach(overlay => overlay.remove());
  }

  showStatusIndicator(message, duration = 2000) {
    const indicator = document.getElementById('statusIndicator');
    indicator.textContent = message;
    indicator.classList.remove('hidden');
    
    setTimeout(() => {
      indicator.classList.add('hidden');
    }, duration);
  }

  // NUOVO: Metodi per gestire le nuove funzionalità
  showSleighSelection() {
    document.getElementById('gameMenu').classList.add('hidden');
    document.getElementById('sleighSelectionMenu').classList.remove('hidden');
    this.updateSleighSelection();
  }
  
  selectSleighAndStartGame(sleighType) {
    this.selectedSleigh = sleighType;
    this.showStatusIndicator(`🚁 Slitta ${this.getSleighName(sleighType)} selezionata!`, 1500);
    
    // Avvia il gioco dopo una breve pausa per mostrare la selezione
    setTimeout(() => {
      this.startGame();
    }, 500);
  }
  
  updateSleighSelection() {
    // Rimuovi selezione precedente
    document.querySelectorAll('.sleigh-option-mobile').forEach(option => {
      option.classList.remove('selected');
    });
    
    // Aggiungi selezione corrente
    const selectedOption = document.querySelector(`[data-sleigh="${this.selectedSleigh}"]`);
    if (selectedOption) {
      selectedOption.classList.add('selected');
    }
  }
  
  getSleighName(sleighType) {
    const names = {
      'sleigh': 'Classica',
      'sleighRed': 'Rossa',
      'sleighGreen': 'Elfica'
    };
    return names[sleighType] || 'Classica';
  }
  
  toggleFriendlyFire() {
    this.friendlyFireMode = !this.friendlyFireMode;
    const toggle = document.getElementById('friendlyFireToggle');
    
    if (this.friendlyFireMode) {
      toggle.textContent = 'ON';
      toggle.classList.add('active');
      this.showStatusIndicator('🔥 Fuoco Amico ATTIVATO - Distruggi tutto!', 2000);
    } else {
      toggle.textContent = 'OFF';
      toggle.classList.remove('active');
      this.showStatusIndicator('🛡️ Fuoco Amico DISATTIVATO - Solo ostacoli!', 2000);
    }
  }

  updateFriendlyFireIndicator() {
    const indicator = document.getElementById('friendlyFireIndicator');
    if (this.friendlyFireMode) {
      indicator.textContent = '🔥 FUOCO AMICO';
      indicator.classList.add('active');
    } else {
      indicator.textContent = '🛡️ SOLO OSTACOLI';
      indicator.classList.remove('active');
    }
  }

  // NUOVO: Carica le vere immagini SVG delle slitte
  loadSleighImages() {
    document.getElementById('sleighPreview1').src = SLEIGH_SPRITES.sleigh;
    document.getElementById('sleighPreview2').src = SLEIGH_SPRITES.sleighRed;
    document.getElementById('sleighPreview3').src = SLEIGH_SPRITES.sleighGreen;
  }
}

const mobileGame = new MobileGameManager();

window.mobileGame = mobileGame;