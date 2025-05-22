export const ENEMY_SPRITES = {
  // BOSS FINALE - FORMA IDENTICA
  evilSanta: `data:image/svg+xml;base64,${btoa(`
    <svg width="96" height="120" viewBox="0 0 96 120" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grinchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1D8348;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#0B5345;stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <!-- Corpo del Grinch -->
      <ellipse cx="48" cy="70" rx="25" ry="35" fill="url(#grinchGrad)"/>
      
      <!-- Testa -->
      <circle cx="48" cy="30" r="20" fill="url(#grinchGrad)"/>
      
      <!-- Pelliccia del collo -->
      <path d="M30 45 Q48 55 66 45 Q48 35 30 45 Z" fill="#FFF" stroke="#EEE"/>
      
      <!-- Faccia perfida -->
      <ellipse cx="42" cy="25" rx="3" ry="4" fill="#FFD700"/>
      <ellipse cx="54" cy="25" rx="3" ry="4" fill="#FFD700"/>
      <path d="M41 25 L43 25 M53 25 L55 25" stroke="black" stroke-width="0.7"/>
      
      <!-- Sorriso malvagio -->
      <path d="M38 35 Q48 45 58 35" fill="none" stroke="#B22222" stroke-width="2"/>
      
      <!-- Sopracciglia arcuate -->
      <path d="M38 20 L46 16" stroke="#003300" stroke-width="2"/>
      <path d="M58 20 L50 16" stroke="#003300" stroke-width="2"/>
      
      <!-- Cappello di Natale rubato -->
      <path d="M30 18 Q48 0 66 18" fill="#B22222"/>
      <ellipse cx="48" cy="18" rx="18" ry="5" fill="#B22222"/>
      <circle cx="66" cy="10" r="5" fill="white"/>
      
      <!-- Braccia -->
      <path d="M23 60 Q10 45 5 30" fill="none" stroke="url(#grinchGrad)" stroke-width="5"/>
      <path d="M73 60 Q86 45 91 30" fill="none" stroke="url(#grinchGrad)" stroke-width="5"/>
      
      <!-- Mani con dita lunghe -->
      <path d="M5 30 L1 25 M5 30 L3 28 M5 30 L7 26 M5 30 L9 27" stroke="url(#grinchGrad)" stroke-width="2"/>
      <path d="M91 30 L95 25 M91 30 L93 28 M91 30 L89 26 M91 30 L85 27" stroke="url(#grinchGrad)" stroke-width="2"/>
      
      <!-- Sacco di regali rubati -->
      <path d="M70 60 Q90 70 85 90 Q75 115 48 115 Q21 115 11 90 Q6 70 26 60" fill="#B22222" stroke="#910000" stroke-width="2"/>
      <path d="M30 75 L40 85 M55 80 L65 70 M45 85 L40 95" stroke="#FFD700" stroke-width="2"/>
    </svg>
  `)}`,

  // Proiettili nemici (semplificati per ora, si possono aggiungere altri)
  evilProjectile: `data:image/svg+xml;base64,${btoa(`
    <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="6" fill="#8B0000" stroke="#FFB6C1" stroke-width="1"/>
      <circle cx="8" cy="8" r="3" fill="#FF0000"/>
    </svg>
  `)}`
}; 