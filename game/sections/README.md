# 🎮 Sistema Modulare delle Sezioni

Questo sistema permette di aggiungere facilmente nuove sezioni (livelli/mondi) al gioco mobile.

## 📁 Struttura Files

```
mobile/game/sections/
├── BaseSection.js       # Classe base per tutte le sezioni
├── ForestSection.js     # Sezione 1: Foresta Incantata
├── CitySection.js       # Sezione 2: Città Natalizia (esempio)
├── SectionManager.js    # Manager per gestire le sezioni
└── README.md           # Questa documentazione
```

## 🔧 Come Funziona

### BaseSection.js
- **Classe astratta** che definisce l'interfaccia comune
- Gestisce spawn, ostacoli, bonus e eventi speciali
- Tutte le sezioni devono estendere questa classe

### Sezioni Specifiche
- **ForestSection.js**: Prima sezione implementata completamente
- **CitySection.js**: Esempio di seconda sezione con nuovi ostacoli
- Ogni sezione ha le proprie configurazioni e meccaniche

### SectionManager.js
- **Gestisce tutte le sezioni** registrate
- Permette progressione automatica tra sezioni
- Facilita debug e testing

## 🚀 Come Aggiungere Nuove Sezioni

### 1. Crea la Classe della Sezione

```javascript
// In sections/MountainSection.js
import { BaseSection } from './BaseSection.js';

export class MountainSection extends BaseSection {
  constructor() {
    super('Montagne Innevate', 'mountain', 1.4);
    
    // Configurazioni specifiche
    this.spawnConfig = {
      obstacleChance: 75,
      giftChance: 15,
      bonusChance: 10,
      lifeChance: 3
    };
    
    // Nuovi ostacoli
    this.availableObstacles = [
      'rockObstacle',      // NUOVO: Rocce
      'avalancheObstacle', // NUOVO: Valanga
      'iceObstacle'        // NUOVO: Ghiaccio
    ];
    
    // Nuovi bonus
    this.specialBonuses = [
      'mountainClimber',   // NUOVO: Scalatore
      'iceBreaker'         // NUOVO: Rompighiaccio
    ];
  }
  
  // Implementa metodi specifici...
}
```

### 2. Registra nel SectionManager

```javascript
// In SectionManager.js
import { MountainSection } from './MountainSection.js';

this.availableSections = new Map([
  [1, ForestSection],
  [2, CitySection],
  [3, MountainSection], // <- Aggiungi qui
]);
```

### 3. Aggiungi Descrizione

```javascript
getSectionDescription(sectionId) {
  const descriptions = {
    1: 'La magica foresta incantata...',
    2: 'La vivace città natalizia...',
    3: 'Le pericolose montagne innevate...', // <- Aggiungi qui
  };
}
```

## 🎯 Caratteristiche Implementate

### ✅ Sistema Velocità Slitta
- **Configurazioni ottimizzate** per mobile nelle costanti
- **Accelerazione fluida** con touch
- **Boost temporanei** con moltiplicatori
- **Feedback visivo** con scia e particelle

### ✅ Frequenza di Tiro
- **Sistema progressivo**: più tieni premuto, più spari veloce
- **Rate dinamici**: 120ms → 80ms → 60ms
- **Moltiplicatori**: sparo triplo con spread angolare
- **Feedback aptico** per mobile

### ✅ Sistema Metri/Distanza
- **Calcolo preciso** basato su deltaTime
- **Visualizzazione formattata** (es: "2.5km")
- **Log automatici** ogni 500 metri
- **Velocità media** calcolata in tempo reale

### ✅ Gestione Livelli Sezione 1
- **4 livelli progressivi** nella ForestSection
- **Ostacoli crescenti**: alberi → pupazzi → lampioni → rinforzati
- **Requisiti bilanciati**: distanza + regali
- **Eventi speciali**: tempesta, benedizione, sentiero libero

### ✅ Struttura Modulare
- **BaseSection**: interfaccia comune per tutte le sezioni
- **SectionManager**: gestione automatica delle progressioni
- **Estensibilità**: aggiungi nuove sezioni in 3 passi
- **Debug integrato**: info dettagliate per ogni sezione

## 🎮 Meccaniche di Gioco

### Progressione Livelli
- Ogni sezione ha **4 sottoli velli**
- Requisiti: **distanza percorsa + regali raccolti**
- Difficoltà crescente con più ostacoli

### Eventi Speciali
- **ForestSection**: Tempesta di neve, Benedizione, Sentiero libero
- **CitySection**: Ora di punta, Blackout, Festa di Natale
- Triggers automatici basati su distanza e probabilità

### Sistema Spawn Bilanciato
- **Probabilità configurabili** per ogni tipo di oggetto
- **Pesi dinamici** basati sul livello corrente
- **Wave system** per variare la densità degli ostacoli

## 🔧 Debug e Testing

### Debug Info Disponibili
```javascript
// Ottieni info della sezione corrente
const debugInfo = game.currentSection.getDebugInfo();

// Ottieni info del section manager
const managerInfo = sectionManager.getDebugInfo();

// Salta a una sezione specifica (solo debug)
sectionManager.jumpToSection(2);
```

### Console Logs
- **📏 Distanza**: Log ogni 500 metri
- **🎮 Livello**: Avanzamenti di livello
- **🎯 Eventi**: Attivazione eventi speciali
- **⚡ Boost**: Attivazione/disattivazione moltiplicatori

## 🚀 Futuro Sviluppo

Il sistema è progettato per supportare facilmente:

- **Nuove sezioni**: Montagne, Artico, Spazio, ecc.
- **Nuovi ostacoli**: Semplicemente aggiungi al registro
- **Nuovi bonus**: Sistema modulare per power-ups
- **Boss specializzati**: Ogni sezione può avere boss unici
- **Meccaniche uniche**: Gravità, vento, temperatura, ecc.

## 📖 Guida Rapida

1. **Analizza ForestSection.js** per capire la struttura
2. **Copia e modifica** per creare nuove sezioni
3. **Registra in SectionManager.js**
4. **Testa con il debug** del section manager
5. **Goditi la nuova sezione!** 🎉

---

**Note**: Questo sistema è ottimizzato per dispositivi mobili con controlli touch, performance bilanciate e feedback aptico appropriato. 