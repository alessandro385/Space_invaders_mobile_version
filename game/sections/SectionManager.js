import { ForestSection } from './ForestSection.js';
import { CitySection } from './CitySection.js';

/**
 * Manager per gestire tutte le sezioni del gioco
 * Facilita l'aggiunta di nuove sezioni e la progressione tra di esse
 */
export class SectionManager {
  constructor() {
    // Registro di tutte le sezioni disponibili
    this.availableSections = new Map([
      [1, ForestSection],
      [2, CitySection]
      // Aggiungi nuove sezioni qui:
      // [3, MountainSection],
      // [4, ArcticSection],
      // [5, SpaceSection]
    ]);
    
    this.currentSectionId = 1;
    this.currentSection = null;
  }

  /**
   * Inizializza il manager con la prima sezione
   */
  initialize(game) {
    this.game = game;
    this.loadSection(1);
  }

  /**
   * Carica una sezione specifica
   */
  loadSection(sectionId) {
    const SectionClass = this.availableSections.get(sectionId);
    
    if (!SectionClass) {
      console.error(`❌ Sezione ${sectionId} non trovata!`);
      return false;
    }

    // Crea e inizializza la nuova sezione
    this.currentSection = new SectionClass();
    this.currentSectionId = sectionId;
    
    if (this.game) {
      this.currentSection.initialize(this.game);
    }

    console.log(`🎮 Sezione ${sectionId} caricata: ${this.currentSection.name}`);
    return true;
  }

  /**
   * Passa alla sezione successiva
   */
  advanceToNextSection() {
    const nextSectionId = this.currentSectionId + 1;
    
    if (this.availableSections.has(nextSectionId)) {
      return this.loadSection(nextSectionId);
    } else {
      console.log('🎉 Tutte le sezioni completate!');
      return false;
    }
  }

  /**
   * Verifica se la sezione corrente è completata
   */
  isCurrentSectionCompleted(gameState) {
    if (!this.currentSection) return false;
    return this.currentSection.isSectionCompleted?.(gameState) || false;
  }

  /**
   * Ottieni la sezione corrente
   */
  getCurrentSection() {
    return this.currentSection;
  }

  /**
   * Ottieni informazioni su tutte le sezioni
   */
  getAllSectionsInfo() {
    const sections = [];
    
    for (const [id, SectionClass] of this.availableSections) {
      const tempSection = new SectionClass();
      sections.push({
        id: id,
        name: tempSection.name,
        theme: tempSection.theme,
        difficulty: tempSection.difficultyMultiplier,
        description: this.getSectionDescription(id)
      });
    }
    
    return sections;
  }

  /**
   * Ottieni descrizione di una sezione
   */
  getSectionDescription(sectionId) {
    const descriptions = {
      1: 'La magica foresta incantata dove inizia l\'avventura',
      2: 'La vivace città natalizia piena di luci e traffico',
      3: 'Le pericolose montagne innevate con valanghe',
      4: 'L\'artico ghiacciato con tempeste di neve',
      5: 'Lo spazio infinito per la consegna galattica'
    };
    
    return descriptions[sectionId] || 'Sezione misteriosa da scoprire';
  }

  /**
   * Ottieni statistiche di progressione
   */
  getProgressionStats(gameState) {
    if (!this.currentSection) return null;

    const sectionStats = this.currentSection.getProgressStats?.(gameState);
    const totalSections = this.availableSections.size;
    
    return {
      currentSectionId: this.currentSectionId,
      currentSectionName: this.currentSection.name,
      sectionProgress: sectionStats,
      overallProgress: {
        sectionsCompleted: this.currentSectionId - 1,
        totalSections: totalSections,
        percentComplete: ((this.currentSectionId - 1) / totalSections) * 100
      }
    };
  }

  /**
   * Reset manager alla prima sezione
   */
  reset() {
    this.currentSectionId = 1;
    this.currentSection = null;
    
    if (this.game) {
      this.loadSection(1);
    }
    
    console.log('🔄 Section Manager reset');
  }

  /**
   * Debug: Salta a una sezione specifica (solo per testing)
   */
  jumpToSection(sectionId) {
    if (this.availableSections.has(sectionId)) {
      console.log(`🔧 DEBUG: Saltando alla sezione ${sectionId}`);
      return this.loadSection(sectionId);
    }
    
    console.error(`❌ DEBUG: Sezione ${sectionId} non esiste`);
    return false;
  }

  /**
   * Ottieni informazioni di debug
   */
  getDebugInfo() {
    return {
      currentSectionId: this.currentSectionId,
      currentSectionName: this.currentSection?.name || 'Nessuna',
      availableSections: Array.from(this.availableSections.keys()),
      totalSections: this.availableSections.size,
      sectionDetails: this.currentSection?.getDebugInfo?.() || null
    };
  }
}

/**
 * GUIDA PER AGGIUNGERE NUOVE SEZIONI:
 * 
 * 1. Crea una nuova classe nella cartella sections/ che estende BaseSection
 * 2. Implementa i metodi richiesti (vedi ForestSection.js come esempio)
 * 3. Aggiungi la classe al registro availableSections sopra
 * 4. Aggiungi una descrizione in getSectionDescription()
 * 5. La sezione sarà automaticamente disponibile nel gioco!
 * 
 * Esempio:
 * 
 * // In sections/MountainSection.js
 * export class MountainSection extends BaseSection {
 *   constructor() {
 *     super('Montagne Innevate', 'mountain', 1.4);
 *     // ... configurazioni specifiche
 *   }
 * }
 * 
 * // In SectionManager.js
 * import { MountainSection } from './MountainSection.js';
 * 
 * this.availableSections = new Map([
 *   [1, ForestSection],
 *   [2, CitySection], 
 *   [3, MountainSection], // <- Aggiungi qui
 * ]);
 */