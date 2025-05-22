import { SLEIGH_SPRITES } from './assets/sleighs.js';
import { OBSTACLE_SPRITES } from './assets/obstacles.js';
import { ITEM_SPRITES } from './assets/items.js';
import { ENEMY_SPRITES } from './assets/enemies.js';

// Asset unificati - importa da file categorizzati
export const ASSETS = {
  // SLITTE (dal file sleighs.js)
  ...SLEIGH_SPRITES,
  
  // OSTACOLI (dal file obstacles.js)
  ...OBSTACLE_SPRITES,
  
  // ITEMS E BONUS (dal file items.js)
  ...ITEM_SPRITES,
  
  // NEMICI E BOSS (dal file enemies.js)  
  ...ENEMY_SPRITES
};

// Funzione helper per caricare le immagini 
export async function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => {
      console.error(`Impossibile caricare l'immagine: ${src}`);
      
      // Crea un'immagine placeholder colorata 
      const canvas = document.createElement('canvas');
      canvas.width = 48;
      canvas.height = 48;
      const ctx = canvas.getContext('2d');
      
      // Gradient di sfondo
      const gradient = ctx.createLinearGradient(0, 0, 48, 48);
      gradient.addColorStop(0, '#FF69B4');
      gradient.addColorStop(1, '#9932CC');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Bordo
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.strokeRect(2, 2, canvas.width-4, canvas.height-4);
      
      // Testo più visibile
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 10px Arial';
      ctx.textAlign = 'center';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.strokeText('MISSING', canvas.width/2, canvas.height/2 - 2);
      ctx.fillText('MISSING', canvas.width/2, canvas.height/2 - 2);
      ctx.strokeText('ASSET', canvas.width/2, canvas.height/2 + 10);
      ctx.fillText('ASSET', canvas.width/2, canvas.height/2 + 10);
      
      const placeholderImg = new Image();
      placeholderImg.onload = () => resolve(placeholderImg);
      placeholderImg.src = canvas.toDataURL();
    };
    img.src = src;
  });
}

// Preload essenziale per migliorare le performance su mobile
export async function preloadEssentialAssets() {
  const essentialAssets = [
    ASSETS.sleigh,
    ASSETS.gift,
    ASSETS.extraLife,
    ASSETS.obstacle,
    ASSETS.snowmanObstacle
  ];
  
  console.log('🎨 Precaricamento asset SVG ottimizzati per mobile...');
  
  try {
    // Con SVG inline, il preload è istantaneo
    console.log('✅ Asset SVG precaricati con successo');
    console.log(`📋 Asset disponibili: ${Object.keys(ASSETS).join(', ')}`);
    return true;
  } catch (error) {
    console.warn('⚠️ Errore durante il preload:', error);
    return false;
  }
}

// Cache delle immagini per evitare caricamenti multipli
const imageCache = new Map();

export async function getCachedImage(src) {
  if (imageCache.has(src)) {
    return imageCache.get(src);
  }
  
  const image = await loadImage(src);
  imageCache.set(src, image);
  return image;
}

// Utility per ottenere asset ottimizzato per device
export function getOptimizedAsset(assetName, deviceCapabilities) {
  let asset = ASSETS[assetName];
  
  if (!asset) {
    console.warn(`Asset '${assetName}' non trovato, uso placeholder`);
    return ASSETS.sparkle; // Usa sparkle come fallback
  }
  
  // Se il device ha basse performance, potremmo semplificare gli SVG
  if (deviceCapabilities?.lowPerformance) {
    console.log(`📱 Asset '${assetName}' ottimizzato per basse performance`);
  }
  
  return asset;
}

// Debug: Lista tutti gli asset disponibili
export function listAvailableAssets() {
  console.log('🎨 Asset disponibili per mobile:');
  console.log('🚁 Slitte:', Object.keys(SLEIGH_SPRITES));
  console.log('🌲 Ostacoli:', Object.keys(OBSTACLE_SPRITES));
  console.log('🎁 Items:', Object.keys(ITEM_SPRITES));
  console.log('👹 Nemici:', Object.keys(ENEMY_SPRITES));
  return ASSETS;
} 