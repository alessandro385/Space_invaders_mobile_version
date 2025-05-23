# 🎅 Babbo Natale Mobile - Genera APK

Un'avventura natalizia mobile ottimizzata per dispositivi Android, con controlli touch intuitivi e nuove funzionalità di personalizzazione!

## 🚀 Nuove Funzionalità

### 🚁 Selezione della Slitta
- **3 slitte uniche** tra cui scegliere:
  - **Slitta Classica**: La tradizionale slitta di Babbo Natale con renna marrone
  - **Slitta Rossa**: Versione sportiva con design più veloce 
  - **Slitta Elfica**: Slitta magica con renna bianca e design elfico
- Selezione accessibile dal menu principale

### ❄️ Sistema Sparo Migliorato
- **Sparo continuo con hold**: Tieni premuto il pulsante per sparare ogni **0.8 secondi** (migliorato!)
- **Rilascia per fermare**: Quando rilasci il pulsante, la slitta smette di sparare
- **Feedback visivo**: Il pulsante cambia aspetto quando attivo
- **Feedback aptico**: Vibrazione al tocco (su dispositivi supportati)

### 🔥 Modalità Fuoco Amico
Personalizza il comportamento dei tuoi colpi:

#### **🔥 MODALITÀ ATTIVA (Default)**
- I tuoi colpi distruggono **tutti gli oggetti** (ostacoli, regali, bonus)
- Comportamento classico del gioco
- Ideale per azione intensa

#### **🛡️ MODALITÀ DISATTIVA**
- I tuoi colpi colpiscono **solo gli ostacoli**
- **Regali e bonus sono immuni** ai colpi
- Strategia più precisa richiesta
- Ideale per gameplay strategico

### 📈 Progressione Intensificata
- **Spawn aumentato**: Fino a 12 oggetti per wave (era 8)
- **Frequenza incrementale**: Ogni 500m la frequenza di spawn aumenta del 20%
- **Intensità finale**: A 3000m+ la frequenza raddoppia per un finale esplosivo
- **Bilanciamento**: 70% ostacoli, 12% bonus, mantenendo la sfida bilanciata

## 🎮 Come Giocare

### 🚁 Primo Avvio - AGGIORNATO!
1. **Clicca "🚀 Inizia l'Avventura!"** → Ti porta automaticamente alla selezione slitta
2. **Scegli tra 3 slitte uniche** con le loro vere immagini SVG:
   - 🛷 **Classica**: Renna marrone, slitta tradizionale
   - 🛷 **Rossa**: Design sportivo veloce
   - 🛷 **Elfica**: Renna bianca magica
3. **Seleziona la tua slitta** → Il gioco inizia automaticamente!
4. **Configura la modalità fuoco amico** nelle opzioni del menu principale

### 🕹️ Controlli
- **Joystick virtuale (sinistra)**: Muovi Babbo Natale
  - Movimento fluido a 360 gradi
  - Zona morta configurabile per precisione
- **Pulsante sparo (destra)**: Spara palle di neve
  - **Tieni premuto** = sparo continuo ogni 0.9 secondi
  - **Rilascia** = ferma lo sparo
  - Feedback visivo quando attivo

### 🎯 Obiettivi
- **Raccogli regali** 🎁 per aumentare il punteggio
- **Evita o distruggi ostacoli** (alberi, pupazzi di neve, lampioni)
- **Raccogli power-ups**:
  - ❤️ **Vita extra**: Aumenta le tue vite
  - ⚡ **Velocità**: Muoviti più velocemente
  - 🔥 **Sparo triplo**: Spara 3 palle di neve contemporaneamente
- **Sopravvivi** e **progredisci** attraverso 4 livelli per sezione

### 🔥 Modalità Fuoco Amico

#### Quando è **ATTIVA** (🔥 FUOCO AMICO):
- Le tue palle di neve distruggono **qualsiasi oggetto**
- Puoi distruggere regali e bonus per errore
- Azione più intensa e caotica

#### Quando è **DISATTIVA** (🛡️ SOLO OSTACOLI):
- Le tue palle di neve attraversano regali e bonus senza danneggiarli
- Puoi mirare liberamente senza perdere bonus
- Gameplay più strategico e preciso

### 🏆 Progressione
- Ogni **sezione** ha 4 livelli
- Requisiti per avanzare: **distanza percorsa** + **regali raccolti**
- **Boss finale** alla fine di ogni sezione
- Difficoltà crescente con più ostacoli e velocità aumentata

### 📱 Interfaccia HUD
- **❤️ Vite** (angolo alto-sinistra)
- **🎁 Punteggio** (regali raccolti)
- **📏 Distanza** percorsa in metri
- **Liv.** attuale
- **🔥/🛡️ Indicatore modalità** fuoco amico

## 📱 Il Tuo Gioco è Pronto per Android!

Ho analizzato il tuo progetto e configurato tutto il necessario per generare un APK del gioco "Babbo Natale Mobile". Il gioco è un fantastico endless runner natalizio con:

- ✅ **Controlli touch ottimizzati** (joystick virtuale + pulsante sparo)
- ✅ **Fullscreen mobile** con orientamento landscape
- ✅ **Grafica SVG ottimizzata** per performance mobile
- ✅ **Feedback aptico** (vibrazione) per azioni
- ✅ **Sistema di livelli** con boss finale
- ✅ **Sound design** integrato

## 🚀 Generazione APK - Metodo Veloce

### Opzione 1: Script Automatico (Raccomandato)
```powershell
# Apri PowerShell nella cartella del progetto ed esegui:
.\build.ps1
```

### Opzione 2: Comandi Manuali
```powershell
# 1. Copia file aggiornati
Copy-Item -Path "*.html", "*.css", "*.js", "game", "manifest.json" -Destination "dist" -Recurse -Force

# 2. Sincronizza con Android
npx cap sync android

# 3. Apri Android Studio
npx cap open android
```

## 🏗️ Build in Android Studio

Una volta aperto Android Studio:

1. **Attendi che il progetto si carichi completamente**
2. Vai su **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
3. Attendi il completamento (2-5 minuti)
4. L'APK sarà in: `android/app/build/outputs/apk/debug/app-debug.apk`

## 📋 Requisiti per Build Automatico

Per il build da linea di comando installa:

1. **[Android Studio](https://developer.android.com/studio)** 
2. **Android SDK** (tramite Android Studio)
3. **Configura ANDROID_HOME**:
   ```powershell
   # Windows - Aggiungi alle variabili d'ambiente
   ANDROID_HOME = C:\Users\%USERNAME%\AppData\Local\Android\Sdk
   ```

## 📱 Installazione APK

### Su dispositivo Android:
1. Abilita **"Origini sconosciute"** nelle impostazioni di sicurezza
2. Trasferisci l'APK sul dispositivo (USB/email/cloud)
3. Tocca il file APK per installare

### Via USB con ADB:
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

## 🎮 Caratteristiche dell'APK

L'APK che genererai includerà:

### 🎯 Gameplay
- **Endless runner** natalizio con Babbo Natale
- **4 sezioni** di gioco con difficoltà crescente  
- **Boss finale** (Grinch malvagio)
- **Sistema di punteggi** basato su regali raccolti
- **Power-ups**: velocità, sparo triplo, vite extra

### 📱 Mobile Features
- **Controlli touch fluidi** ottimizzati per mobile
- **Fullscreen immersivo** senza barre del browser
- **Orientamento landscape** bloccato per gaming
- **Feedback aptico** per collisioni e azioni
- **Performance ottimizzate** per dispositivi Android

### 🎨 Grafica & UI
- **Sprite SVG** ad alta qualità scalabili
- **Effetti particellari** per neve e esplosioni
- **UI mobile-friendly** con elementi grandi per touch
- **Temi stagionali** (foresta, città, montagne)

## 📊 Dimensioni e Compatibilità

- **Dimensione APK**: ~15-20 MB (debug), ~8-12 MB (release)
- **Android minimo**: API 21 (Android 5.0+)
- **Orientamento**: Landscape (orizzontale)
- **Permessi**: Vibrazione (opzionale)

## 🔧 File di Configurazione Creati

Ho creato questi file per semplificare il processo:

- `package.json` - Dipendenze Node.js e Capacitor
- `capacitor.config.json` - Configurazione app mobile
- `manifest.json` - Manifest PWA per installazione
- `build.ps1` - Script rapido per Windows
- `build-apk.sh` - Script per Linux/Mac
- `BUILD_APK_GUIDE.md` - Guida dettagliata
- `android-build-commands.md` - Comandi di riferimento

## 🆘 Risoluzione Problemi

### Android Studio non si apre
```powershell
# Verifica che Capacitor sia installato
npx cap --version

# Rigenera il progetto Android
npx cap add android --force
```

### Errore durante build
```powershell
# Pulisci la cache Gradle
cd android
.\gradlew.bat clean
.\gradlew.bat assembleDebug
```

### APK non si installa
- Verifica che "Origini sconosciute" sia abilitato
- Controlla che il dispositivo abbia Android 5.0+
- Prova a disinstallare versioni precedenti

## 🎁 Prossimi Passi

Dopo aver generato l'APK puoi:

1. **Testare** su diversi dispositivi Android
2. **Ottimizzare** per build di produzione firmato
3. **Pubblicare** su Google Play Store
4. **Aggiungere** più livelli e funzionalità

---

## 📞 Supporto

Se hai problemi:

1. Consulta `BUILD_APK_GUIDE.md` per istruzioni dettagliate
2. Verifica i prerequisiti (Node.js, Android Studio)
3. Esegui `npx cap doctor` per diagnostica
4. Controlla i log in Android Studio

**🎄 Buona fortuna con la pubblicazione del tuo gioco! 🎅**

---

*Progetto configurato con Capacitor per la massima compatibilità mobile* 