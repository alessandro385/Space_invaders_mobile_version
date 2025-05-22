export const ITEM_SPRITES = {
  // REGALO - FORMA IDENTICA ALL'ORIGINALE
  gift: `data:image/svg+xml;base64,${btoa(`
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="giftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#FF4040;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#CC0000;stop-opacity:1" />
        </linearGradient>
        <filter id="giftShadow">
          <feDropShadow dx="1" dy="1" stdDeviation="1" flood-color="#000" flood-opacity="0.3"/>
        </filter>
      </defs>
      
      <g filter="url(#giftShadow)">
        <rect x="6" y="12" width="20" height="16" fill="url(#giftGrad)" rx="2"/>
        <rect x="4" y="8" width="24" height="6" fill="url(#giftGrad)" rx="2"/>
        
        <rect x="14" y="8" width="4" height="20" fill="#FFD700" rx="1"/>
        <rect x="6" y="14" width="20" height="4" fill="#FFD700" rx="1"/>
        
        <path d="M16 4 Q20 8 16 12 Q12 8 16 4" fill="#FFD700" stroke="#CC9900"/>
        <path d="M13 6 Q16 10 19 6" fill="none" stroke="#FFD700" stroke-width="2"/>
      </g>
    </svg>
  `)}`,

  // BOOST VELOCITÀ - IDENTICO CON X2
  moveSpeedBoost: `data:image/svg+xml;base64,${btoa(`
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <!-- Sfondo circolare con effetto neve -->
      <circle cx="16" cy="16" r="15" fill="#FF4040"/>
      <circle cx="16" cy="16" r="13" fill="#CC0000"/>
      
      <!-- Testo X2 in stile natalizio -->
      <text x="16" y="22" 
            font-family="Mountains of Christmas, cursive" 
            font-size="16" 
            font-weight="bold" 
            fill="#FFD700" 
            text-anchor="middle"
            stroke="#FFFFFF"
            stroke-width="1">X2</text>
      
      <!-- Decorazioni natalizie -->
      <path d="M8 8 L12 12 M20 8 L24 12" 
            stroke="#FFD700" 
            stroke-width="2"
            stroke-linecap="round"/>
      
      <!-- Fiocchi di neve decorativi -->
      <circle cx="6" cy="6" r="1" fill="#FFFFFF"/>
      <circle cx="26" cy="6" r="1" fill="#FFFFFF"/>
      <circle cx="6" cy="26" r="1" fill="#FFFFFF"/>
      <circle cx="26" cy="26" r="1" fill="#FFFFFF"/>
    </svg>
  `)}`,

  // VITA EXTRA - FORMA IDENTICA SEMPLIFICATA
  extraLife: `data:image/svg+xml;base64,${btoa(`
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <!-- Background circolare luminoso -->
      <circle cx="16" cy="16" r="15" fill="#FFD700" opacity="0.6"/>
      
      <!-- Cuore rosso brillante e semplice -->
      <path d="M16 12 L13 9 Q10 9 10 12 Q10 14 12 16 L16 20 L20 16 Q22 14 22 12 Q22 9 19 9 Z" 
            fill="#FF0000" 
            stroke="#FFFFFF" 
            stroke-width="1.5"/>
    </svg>
  `)}`,

  // EFFETTI
  explosion: `data:image/svg+xml;base64,${btoa(`
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="12" fill="#FF4500" opacity="0.8"/>
      <circle cx="16" cy="16" r="8" fill="#FFD700" opacity="0.9"/>
      <circle cx="16" cy="16" r="4" fill="#FFFFFF"/>
    </svg>
  `)}`,
  
  sparkle: `data:image/svg+xml;base64,${btoa(`
    <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
      <polygon points="8,2 9,7 14,8 9,9 8,14 7,9 2,8 7,7" fill="#FFFF99"/>
    </svg>
  `)}`
}; 