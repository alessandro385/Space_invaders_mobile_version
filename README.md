# 🎅 La Corsa di Babbo Natale - Versione Mobile 📱

Una versione completamente ottimizzata per dispositivi mobili del gioco natalizio, progettata per offrire la migliore esperienza di gioco su smartphone e tablet.

## 🚀 Caratteristiche Mobile

### Controlli Touch Ottimizzati
- **Joystick Virtuale**: Controllo movimento fluido e responsivo
- **Pulsante Fuoco**: Sparo continuo con feedback aptico
- **Gesture Support**: Riconoscimento gesti naturali
- **Feedback Tattile**: Vibrazione per eventi importanti (se supportata)

### Interface Minimalista
- **HUD Semplificato**: Solo informazioni essenziali
- **Font Grandi**: Leggibilità ottimale su schermi piccoli
- **Menu Touch-Friendly**: Pulsanti grandi e ben spaziati
- **Orientamento Landscape**: Esperienza ottimale in orizzontale

### Performance Ottimizzate
- **Frame Rate Adattivo**: 60 FPS target con auto-ottimizzazione
- **Particelle Ridotte**: Effetti bilanciati per performance
- **Memory Management**: Gestione intelligente della memoria
- **Battery Efficiency**: Ottimizzazioni per durata batteria

### Gameplay Adattato
- **Velocità Realistica**: 20 metri al secondo per simulazione realistica
- **Livelli Bilanciati**: Ogni livello dura 1 minuto (1200m a 20m/s)
  - Livello 1: 0-1200m (1 min) + 10 regali
  - Livello 2: 1200-2400m (1 min) + 10 regali
  - Livello 3: 2400-3600m (1 min) + 15 regali
- **Boss Finale**: Appare a 3600m (3 minuti totali)
- **Sparo Continuo**: Sistema toggle per sparo automatico senza dover tenere premuto
- **Collisioni Permissive**: Maggiore tolleranza per controlli touch

## 🎮 Come Giocare

### Controlli
1. **Movimento**: Usa il joystick virtuale in basso a sinistra
2. **Sparo Continuo**: Tocca il pulsante rosso per attivare/disattivare lo sparo automatico
3. **Menu**: Tocca i pulsanti sullo schermo per navigare

### Obiettivi
- 🎁 **Raccogli Regali**: Aumenta il punteggio
- ❤️ **Prendi Cuori**: Ottieni vite extra
- 🚫 **Evita Ostacoli**: O distruggili con le palle di neve
- 🎯 **Sconfiggi i Boss**: Completa le zone

### Powerups
- ❄️ **Spara-neve Potenziato**: Sparo triplo temporaneo
- ⚡ **Boost Velocità**: Movimento più rapido
- 🛡️ **Protezione Extra**: Maggiore resistenza

## 🔧 Installazione

### Opzione 1: Server di Sviluppo
```bash
# Naviga nella cartella mobile
cd mobile

# Avvia un server locale (esempio con Python)
python -m http.server 8000

# Oppure con Node.js
npx serve .

# Apri il browser su: http://localhost:8000
```

### Opzione 2: Deploy Web
1. Carica tutti i file della cartella `mobile/` su un server web
2. Assicurati che i percorsi degli asset siano corretti
3. Accedi al gioco tramite browser mobile

## 📱 Compatibilità

### Browser Supportati
- **Chrome Mobile** ✅ (Consigliato)
- **Safari iOS** ✅
- **Firefox Mobile** ✅
- **Samsung Internet** ✅
- **Edge Mobile** ✅

### Dispositivi Testati
- **Android**: 7.0+ (API 24+)
- **iOS**: 12.0+
- **Tablet**: Android e iPad
- **Chrome OS**: Touch-enabled devices

### Funzionalità Richieste
- **Touch Screen**: Necessario per i controlli
- **Canvas 2D**: Supporto HTML5 Canvas
- **ES6**: Moduli JavaScript moderni
- **Vibration API**: Opzionale per feedback aptico

## ⚙️ Configurazioni

### Performance
Il gioco si auto-ottimizza in base alle capacità del dispositivo:
- **Dispositivi Potenti**: Tutti gli effetti attivi
- **Dispositivi Medi**: Effetti ridotti
- **Dispositivi Basici**: Solo elementi essenziali

### Controlli
```javascript
// File: mobile/game/constants.js
export const TOUCH_CONFIG = {
  JOYSTICK_SENSITIVITY: 1.2,    // Sensibilità movimento
  FIRE_REPEAT_RATE: 150,        // Velocità sparo continuo
  HAPTIC_FEEDBACK: true         // Vibrazione abilitata
};
```

## 🎯 Differenze dalla Versione Desktop

### Ottimizzazioni Mobile
- **Controlli**: Touch invece di tastiera
- **UI**: Interface ridisegnata per dita
- **Performance**: Effetti ridotti per fluidità
- **Gameplay**: Difficoltà riequilibrata per touch

### Rimozioni/Modifiche
- ❌ Pannelli laterali informativi
- ❌ Selezione slitta complessa  
- ❌ Effetti particellari intensivi
- ✅ HUD minimalista
- ✅ Menu semplificati
- ✅ Auto-fullscreen

## 🔍 Debug e Sviluppo

### Console Log
Il gioco fornisce log dettagliati per il debug:
- Performance monitoring
- Touch events tracking
- Game state changes
- Error handling

### Test su Desktop
Anche se ottimizzato per mobile, il gioco funziona su desktop per test:
- Chrome DevTools: Device simulation
- Firefox: Responsive design mode
- Touch simulation disponibile

## 📝 Note Tecniche

### Struttura File
```
mobile/
├── index.html          # Entry point
├── main.js            # Game manager mobile
├── style.css          # Stili ottimizzati
├── game/
│   ├── Game.js        # Core engine mobile
│   ├── GameState.js   # Stato gioco
│   ├── assets.js      # Gestione asset
│   ├── constants.js   # Configurazioni mobile
│   ├── entities/      # Entità di gioco
│   ├── ui/           # Interface mobile
│   └── utils/        # Utility ottimizzate
└── README.md         # Questo file
```

### Performance Tips
- Chiudi altre app per più memoria
- Usa modalità landscape
- Connessione stabile per asset
- Dispositivo con batteria sufficiente

## 🐛 Risoluzione Problemi

### Problemi Comuni
1. **Joystick non risponde**: Ricarica la pagina
2. **Audio non funziona**: Tocca lo schermo per attivare
3. **Lag/stuttering**: Chiudi altre app
4. **Controlli imprecisi**: Calibra in impostazioni device

### Supporto
Per problemi tecnici o suggerimenti:
- Controlla la console del browser per errori
- Verifica compatibilità dispositivo
- Prova in modalità incognito
- Aggiorna il browser

## 🎉 Buon Divertimento!

Aiuta Babbo Natale a consegnare tutti i regali in questa avventura mobile ottimizzata! 

**Tocca per iniziare! 🎅🎁** 