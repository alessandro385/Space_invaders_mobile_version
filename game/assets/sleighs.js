export const SLEIGH_SPRITES = {
  sleigh: `data:image/svg+xml;base64,${btoa(`
    <svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <!-- Renna Classica -->
      <rect x="28" y="8" width="8" height="10" fill="#8B4513" /> <!-- Corpo Renna -->
      <circle cx="32" cy="6" r="4" fill="#A0522D" /> <!-- Testa Renna -->
      <path d="M29 3 L27 0 M35 3 L37 0" stroke="#654321" stroke-width="1.5"/> <!-- Corna -->
      <circle cx="32" cy="8" r="1" fill="red"/> <!-- Naso -->
      
      <!-- Corpo Slitta Marrone -->
      <rect x="16" y="30" width="32" height="20" fill="#8B4513" rx="3"/>
      <rect x="14" y="28" width="36" height="5" fill="#A0522D" rx="2"/> <!-- Bordo superiore slitta -->
      <path d="M16 22 L32 16 L48 22" stroke="#654321" stroke-width="2" fill="none"/> <!-- Redini/Collegamento renna -->

      <!-- Pattini Oro -->
      <rect x="12" y="50" width="40" height="4" fill="#FFD700" rx="1"/>
      <rect x="10" y="30" width="4" height="22" fill="#FFD700" rx="1"/>
      <rect x="50" y="30" width="4" height="22" fill="#FFD700" rx="1"/>
      
      <!-- Babbo Natale -->
      <circle cx="32" cy="32" r="7" fill="#FF0000"/> <!-- Corpo/Vestito -->
      <circle cx="32" cy="28" r="4" fill="#FFE4C4"/> <!-- Faccia -->
      <rect x="29" y="24" width="6" height="3" fill="white"/> <!-- Bordo Cappello -->
      <circle cx="32" cy="23" r="2" fill="white"/> <!-- Ponpon -->
    </svg>
  `)}`,

  sleighRed: `data:image/svg+xml;base64,${btoa(`
    <svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <!-- Renna Semplice -->
      <rect x="29" y="9" width="6" height="8" fill="#A0522D" /> <!-- Corpo Renna -->
      <circle cx="32" cy="7" r="3" fill="#D2691E" /> <!-- Testa Renna -->
      <path d="M30 4 L28 1 M34 4 L36 1" stroke="#654321" stroke-width="1"/> <!-- Corna -->
      
      <!-- Corpo Slitta Rosso -->
      <rect x="18" y="30" width="28" height="18" fill="#FF0000" />
      <rect x="16" y="28" width="32" height="4" fill="#CC0000" /> <!-- Bordo superiore slitta -->
      <path d="M18 24 L32 18 L46 24" stroke="#505050" stroke-width="1.5" fill="none"/> <!-- Redini -->

      <!-- Pattini Neri -->
      <rect x="14" y="48" width="36" height="3" fill="#333333" />
      <rect x="12" y="30" width="3" height="20" fill="#333333" />
      <rect x="49" y="30" width="3" height="20" fill="#333333" />
      
      <!-- Babbo Natale Semplice -->
      <circle cx="32" cy="32" r="6" fill="#DC143C"/> <!-- Corpo/Vestito -->
      <circle cx="32" cy="29" r="3" fill="#FFEBCD"/> <!-- Faccia -->
      <rect x="30" y="26" width="4" height="2" fill="white"/> <!-- Bordo Cappello -->
      <circle cx="32" cy="25" r="1.5" fill="white"/> <!-- Ponpon -->
    </svg>
  `)}`,

  sleighGreen: `data:image/svg+xml;base64,${btoa(`
    <svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <!-- Renna Magica (Bianca/Grigio Chiaro) -->
      <rect x="28" y="8" width="8" height="10" fill="#E0E0E0" />
      <circle cx="32" cy="6" r="4" fill="#F5F5F5" />
      <path d="M29 3 L27 0 M35 3 L37 0" stroke="#ADD8E6" stroke-width="2"/> <!-- Corna Azzurro Ghiaccio -->
      <circle cx="32" cy="8" r="1" fill="#90EE90"/> <!-- Naso Verde Chiaro -->
      
      <!-- Corpo Slitta Verde Smeraldo con curve eleganti -->
      <path d="M16 30 C12 32 10 40 12 45 L16 50 L48 50 L52 45 C54 40 52 32 48 30 Z" fill="#006400"/>
      <rect x="14" y="28" width="36" height="5" fill="#2E8B57" rx="2"/>
      <path d="M16 22 L32 16 L48 22" stroke="#F5F5F5" stroke-width="2" fill="none"/> <!-- Redini Bianche -->

      <!-- Pattini Argento/Ghiaccio -->
      <rect x="10" y="50" width="44" height="4" fill="#C0C0C0" rx="1"/>
      <rect x="8" y="30" width="4" height="22" fill="#C0C0C0" rx="1"/>
      <rect x="52" y="30" width="4" height="22" fill="#C0C0C0" rx="1"/>
      
      <!-- Babbo Natale Elfico -->
      <circle cx="32" cy="32" r="7" fill="#228B22"/> <!-- Vestito Verde Scuro -->
      <circle cx="32" cy="28" r="4" fill="#FFE4C4"/>
      <path d="M29 24 L32 21 L35 24 L32 26 Z" fill="#90EE90"/> <!-- Cappello a punta stilizzato -->
    </svg>
  `)}`
}; 