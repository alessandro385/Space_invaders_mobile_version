export const OBSTACLE_SPRITES = {
  // ALBERO OSTACOLO - FORMA IDENTICA (capovolto)
  obstacle: `data:image/svg+xml;base64,${btoa(`
    <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="treeGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#228B22;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#006400;stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <!-- Tronco capovolto -->
      <path d="M20 3 L20 18 Q24 19 28 18 L28 3 Z" 
            fill="#8B4513" stroke="#654321" stroke-width="1"/>
      
      <!-- Foglie capovolte -->
      <g transform="rotate(180 24 24)">
        <path d="M24 5 L10 20 L38 20 Z" fill="url(#treeGrad)"/>
        <path d="M24 12 L8 28 L40 28 Z" fill="url(#treeGrad)"/>
        <path d="M24 18 L6 35 L42 35 Z" fill="url(#treeGrad)"/>
      </g>
    </svg>
  `)}`,

  // PUPAZZO DI NEVE - FORMA IDENTICA
  snowmanObstacle: `data:image/svg+xml;base64,${btoa(`
    <svg width="48" height="60" viewBox="0 0 48 60" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="45" r="14" fill="white" stroke="#D3D3D3" stroke-width="1"/>
      <circle cx="24" cy="25" r="10" fill="white" stroke="#D3D3D3" stroke-width="1"/>
      <circle cx="24" cy="10" r="7" fill="white" stroke="#D3D3D3" stroke-width="1"/>
      <rect x="20" y="0" width="8" height="8" fill="black" />
      <line x1="18" y1="5" x2="30" y2="5" stroke="black" stroke-width="2"/>
      <circle cx="22" cy="9" r="1" fill="black"/>
      <circle cx="26" cy="9" r="1" fill="black"/>
      <polygon points="24,12 22,14 26,14" fill="orange"/>
      <circle cx="24" cy="22" r="1.5" fill="black"/>
      <circle cx="24" cy="28" r="1.5" fill="black"/>
      <line x1="10" y1="25" x2="0" y2="22" stroke="#8B4513" stroke-width="2"/>
      <line x1="38" y1="25" x2="48" y2="22" stroke="#8B4513" stroke-width="2"/>
    </svg>
  `)}`,

  // LAMPIONE - FORMA IDENTICA  
  lampPostObstacle: `data:image/svg+xml;base64,${btoa(`
    <svg width="32" height="70" viewBox="0 0 32 70" xmlns="http://www.w3.org/2000/svg">
      <rect x="12" y="15" width="8" height="55" fill="#404040"/>
      <rect x="8" y="65" width="16" height="5" fill="#303030"/>
      <path d="M16 15 Q28 15 28 5 Q24 0 16 0 Q8 0 12 5 Q12 15 16 15 Z" fill="#FFFF00"/>
      <rect x="26" y="5" width="4" height="10" fill="#303030" transform="rotate(15 28 10)"/>
      <circle cx="28" cy="10" r="3" fill="red" transform="rotate(15 28 10)"/>
    </svg>
  `)}`,

  // FIOCCO DI NEVE BLOWER - FORMA IDENTICA
  snowBlower: `data:image/svg+xml;base64,${btoa(`
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#DDD;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#999;stop-opacity:1" />
        </linearGradient>
      </defs>
      <path d="M8 16 L24 16 L28 20 L4 20 Z" fill="url(#metalGrad)"/>
      <circle cx="16" cy="14" r="8" fill="#4169E1"/>
      <path d="M12 14 L20 14" stroke="white" stroke-width="2"/>
      <circle cx="16" cy="14" r="3" fill="white"/>
    </svg>
  `)}`,
  
  // ALBERO RINFORZATO - FORMA IDENTICA
  reinforcedObstacle: `data:image/svg+xml;base64,${btoa(`
    <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="treeGradReinforced" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#228B22;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#006400;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="metalGradReinforced" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#DDD;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#777;stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <!-- Tronco capovolto -->
      <path d="M20 3 L20 18 Q24 19 28 18 L28 3 Z" 
            fill="#8B4513" stroke="#654321" stroke-width="1"/>
      
      <!-- Foglie capovolte -->
      <g transform="rotate(180 24 24)">
        <path d="M24 5 L10 20 L38 20 Z" fill="url(#treeGradReinforced)"/>
        <path d="M24 12 L8 28 L40 28 Z" fill="url(#treeGradReinforced)"/>
        <path d="M24 18 L6 35 L42 35 Z" fill="url(#treeGradReinforced)"/>
      </g>
      
      <!-- Puntale di ferro -->
      <path d="M24 0 L21 5 L27 5 Z" fill="url(#metalGradReinforced)" stroke="#555" stroke-width="1"/>
      <rect x="22.5" y="4" width="3" height="4" fill="url(#metalGradReinforced)" stroke="#555" stroke-width="0.5"/>
    </svg>
  `)}`,
  
  // PUPAZZO CORAZZATO - FORMA IDENTICA
  armoredSnowman: `data:image/svg+xml;base64,${btoa(`
    <svg width="48" height="60" viewBox="0 0 48 60" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="armorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#AAA;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#777;stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <!-- Corpo del pupazzo -->
      <circle cx="24" cy="45" r="14" fill="white" stroke="#D3D3D3" stroke-width="1"/>
      <circle cx="24" cy="25" r="10" fill="white" stroke="#D3D3D3" stroke-width="1"/>
      <circle cx="24" cy="10" r="7" fill="white" stroke="#D3D3D3" stroke-width="1"/>
      
      <!-- Cappello da soldato -->
      <path d="M18 5 L30 5 L28 0 L20 0 Z" fill="#444"/>
      <rect x="18" y="3" width="12" height="3" fill="#555"/>
      
      <!-- Occhi e naso -->
      <circle cx="22" cy="9" r="1" fill="black"/>
      <circle cx="26" cy="9" r="1" fill="black"/>
      <polygon points="24,12 22,14 26,14" fill="orange"/>
      
      <!-- Armatura -->
      <path d="M17 20 Q24 16 31 20 L31 30 Q24 34 17 30 Z" fill="url(#armorGrad)" stroke="#555" stroke-width="1"/>
      <path d="M15 30 Q24 26 33 30 L33 42 Q24 46 15 42 Z" fill="url(#armorGrad)" stroke="#555" stroke-width="1"/>
      
      <!-- Insegne dell'armatura -->
      <circle cx="24" cy="25" r="3" fill="#AA0000" stroke="#555"/>
      <path d="M23 25 L25 25 M24 24 L24 26" stroke="white" stroke-width="0.5"/>
      
      <!-- Braccia -->
      <line x1="10" y1="25" x2="0" y2="22" stroke="#8B4513" stroke-width="2"/>
      <line x1="38" y1="25" x2="48" y2="22" stroke="#8B4513" stroke-width="2"/>
    </svg>
  `)}`
}; 