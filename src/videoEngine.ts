import { scenes, typographySchedule } from './data';

// Real image URLs for each scene
export const sceneImages = [
  'https://image.qwenlm.ai/generated-images/ae11797e-353a-4200-8e82-f6f26265469d/_result.png', // Scene 1: Mountain path sunrise
  'https://image.qwenlm.ai/generated-images/c0bbf073-90b5-4579-bcdf-7d335aca6892/_result.png', // Scene 2: Hiker climbing
  'https://image.qwenlm.ai/generated-images/13ad952c-d050-4f45-80b6-f56424c666bc/_result.png', // Scene 3: Bird taking off
  'https://image.qwenlm.ai/generated-images/897bc89f-5d45-4830-9aea-426cd000f91a/_result.png', // Scene 4: Eagle flying
  'https://image.qwenlm.ai/generated-images/c8061b5b-5d42-4062-96e9-bbb23def8703/_result.png', // Scene 5: Summit victory
  'https://image.qwenlm.ai/generated-images/971c185b-e26a-47c3-9596-fe27bdb184e3/_result.png', // Scene 6: Autumn tree
  'https://image.qwenlm.ai/generated-images/32cce6a5-4bff-4102-87e6-177671e490b0/_result.png', // Scene 7: Winter tree
  'https://image.qwenlm.ai/generated-images/645f5b71-2881-4e6b-b976-a6bfe2574c45/_result.png', // Scene 8: Walking to light
  'https://image.qwenlm.ai/generated-images/ad0ac815-a721-4bab-8ccf-3c6daf0e2783/_result.png', // Scene 9: Raindrop macro
  'https://image.qwenlm.ai/generated-images/9eb284e1-5c3e-49ce-825e-c32561017f77/_result.png', // Scene 10: Spring tree
  'https://image.qwenlm.ai/generated-images/9eb284e1-5c3e-49ce-825e-c32561017f77/_result.png', // Scene 11: Same as 10
];

// Scene durations in seconds
export const sceneDurations = [7, 7, 7, 6, 7, 8, 7, 6, 7, 5, 2];

// Get total duration
export const totalDuration = sceneDurations.reduce((a, b) => a + b, 0); // 69

// Image cache
const imageCache: Map<string, HTMLImageElement> = new Map();
let imagesLoaded = false;

// Preload all images
export async function preloadImages(): Promise<void> {
  if (imagesLoaded) return;
  
  const promises = sceneImages.map(url => {
    return new Promise<void>((resolve) => {
      if (imageCache.has(url)) {
        resolve();
        return;
      }
      
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        imageCache.set(url, img);
        resolve();
      };
      img.onerror = () => {
        console.warn('Failed to load image:', url);
        resolve();
      };
      img.src = url;
    });
  });
  
  await Promise.all(promises);
  imagesLoaded = true;
}

// Get active typography for a given time - now centered
export function getActiveTypography(time: number): { text: string; opacity: number; offsetY: number; scale: number; bold: boolean; glowColor: string } | null {
  const fadeInDuration = 0.6;
  const fadeOutDuration = 0.5;
  const displayDuration = 2.5;

  for (const item of typographySchedule) {
    const [min, sec] = item.time.split(':').map(Number);
    const startTime = min * 60 + sec;
    const endTime = startTime + displayDuration;

    if (time >= startTime && time <= endTime) {
      const elapsed = time - startTime;
      let opacity = 1;
      let offsetY = 0;
      let scale = 1;

      // Determine glow color based on scene
      const { sceneIndex } = getSceneAtTime(time);
      const glowColors = [
        '#d4a853', // Scene 1: Gold
        '#c9952c', // Scene 2: Amber
        '#a0aec0', // Scene 3: Silver
        '#63b3ed', // Scene 4: Blue
        '#fbbf24', // Scene 5: Bright gold
        '#d97706', // Scene 6: Orange
        '#93c5fd', // Scene 7: Ice blue
        '#d4a853', // Scene 8: Gold
        '#4ade80', // Scene 9: Green
        '#22c55e', // Scene 10: Bright green
        '#4ade80', // Scene 11: Green
      ];
      const glowColor = glowColors[sceneIndex];

      if (elapsed < fadeInDuration) {
        const progress = elapsed / fadeInDuration;
        opacity = progress;
        offsetY = 30 * (1 - progress);
        scale = 0.85 + 0.15 * progress;
      } else if (elapsed > displayDuration - fadeOutDuration) {
        const progress = (elapsed - (displayDuration - fadeOutDuration)) / fadeOutDuration;
        opacity = 1 - progress;
      }

      return { text: item.text, opacity, offsetY, scale, bold: item.bold, glowColor };
    }
  }
  return null;
}

// Get current scene info based on time
export function getSceneAtTime(time: number): { sceneIndex: number; sceneProgress: number } {
  let accumulated = 0;
  for (let i = 0; i < sceneDurations.length; i++) {
    if (time < accumulated + sceneDurations[i]) {
      return {
        sceneIndex: i,
        sceneProgress: (time - accumulated) / sceneDurations[i],
      };
    }
    accumulated += sceneDurations[i];
  }
  return { sceneIndex: sceneDurations.length - 1, sceneProgress: 1 };
}

// Draw a single frame on canvas
export function drawFrame(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number
) {
  const { sceneIndex, sceneProgress } = getSceneAtTime(time);
  const scene = scenes[sceneIndex];

  // Clear
  ctx.clearRect(0, 0, width, height);

  // Draw background image
  const imageUrl = sceneImages[sceneIndex];
  const img = imageCache.get(imageUrl);
  
  if (img) {
    // Calculate cover dimensions
    const imgAspect = img.width / img.height;
    const canvasAspect = width / height;
    
    let drawWidth, drawHeight, drawX, drawY;
    
    if (imgAspect > canvasAspect) {
      // Image is wider - fit height
      drawHeight = height;
      drawWidth = height * imgAspect;
      drawX = (width - drawWidth) / 2;
      drawY = 0;
    } else {
      // Image is taller - fit width
      drawWidth = width;
      drawHeight = width / imgAspect;
      drawX = 0;
      drawY = (height - drawHeight) / 2;
    }
    
    // Apply subtle Ken Burns effect (slow zoom)
    const zoomScale = 1 + sceneProgress * 0.05; // 5% zoom over scene duration
    const zoomOffset = (zoomScale - 1) / 2;
    
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.scale(zoomScale, zoomScale);
    ctx.translate(-width / 2, -height / 2);
    
    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    ctx.restore();
  } else {
    // Fallback gradient if image not loaded
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(1, '#0a0a0f');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  // Draw atmospheric particles
  drawParticles(ctx, width, height, time, sceneIndex);

  // Draw transition overlay
  drawTransition(ctx, width, height, time, sceneIndex, sceneProgress);

  // Draw typography in center
  const typo = getActiveTypography(time);
  if (typo) {
    drawTypographyCentered(ctx, width, height, typo);
  }

  // Draw fade in at start
  if (time < 1) {
    ctx.fillStyle = `rgba(0, 0, 0, ${1 - time})`;
    ctx.fillRect(0, 0, width, height);
  }

  // Draw fade out at end
  if (time > totalDuration - 2) {
    const fadeProgress = (time - (totalDuration - 2)) / 2;
    ctx.fillStyle = `rgba(0, 0, 0, ${fadeProgress})`;
    ctx.fillRect(0, 0, width, height);
  }

  // Draw scene info overlay (subtle)
  drawSceneInfo(ctx, width, height, scene, time);
}

function drawParticles(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  sceneIndex: number
) {
  const seed = sceneIndex * 1000;

  // Different particle effects for different scenes
  if (sceneIndex === 5) { // Autumn - falling leaves
    for (let i = 0; i < 15; i++) {
      const x = ((seed + i * 100 + time * 30) % width);
      const y = ((seed + i * 70 + time * 40 + Math.sin(time + i) * 30) % height);
      const rotation = time * 2 + i;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.fillStyle = `rgba(217, 119, 6, ${0.4 + (i % 4) * 0.1})`;
      ctx.beginPath();
      ctx.ellipse(0, 0, 6, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  } else if (sceneIndex === 6) { // Winter - snow
    for (let i = 0; i < 40; i++) {
      const x = ((seed + i * 80 + time * 15 + Math.sin(time * 0.5 + i) * 20) % width);
      const y = ((seed + i * 50 + time * 30) % height);
      const size = 1.5 + (i % 3) * 0.5;
      ctx.fillStyle = `rgba(255, 255, 255, ${0.4 + (i % 5) * 0.1})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (sceneIndex === 8) { // Rain
    for (let i = 0; i < 50; i++) {
      const x = ((seed + i * 60) % width);
      const y = ((seed + i * 40 + time * 200) % height);
      ctx.strokeStyle = `rgba(110, 231, 183, ${0.3 + (i % 3) * 0.1})`;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - 1, y + 12);
      ctx.stroke();
    }
  } else if (sceneIndex === 0 || sceneIndex === 1 || sceneIndex === 4) { // Dust/light particles
    for (let i = 0; i < 20; i++) {
      const x = ((seed + i * 137 + time * 20) % width);
      const y = ((seed + i * 89 + time * 10) % height);
      const size = 1.5 + (i % 3);
      ctx.fillStyle = `rgba(212, 168, 83, ${0.2 + (i % 5) * 0.05})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawTransition(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  sceneIndex: number,
  progress: number
) {
  // Cross dissolve at start of each scene
  const transitionDuration = 0.5;
  let accumulated = 0;
  for (let i = 0; i < sceneIndex; i++) {
    accumulated += sceneDurations[i];
  }
  const sceneStartTime = accumulated;
  const elapsed = time - sceneStartTime;

  if (elapsed < transitionDuration && sceneIndex > 0) {
    const fadeProgress = elapsed / transitionDuration;
    ctx.fillStyle = `rgba(0, 0, 0, ${0.4 * (1 - fadeProgress)})`;
    ctx.fillRect(0, 0, width, height);
  }
}

function drawTypographyCentered(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  typo: { text: string; opacity: number; offsetY: number; scale: number; bold: boolean; glowColor: string }
) {
  ctx.save();
  ctx.globalAlpha = typo.opacity;
  
  const fontSize = Math.min(width * 0.06, 56);
  ctx.font = `${typo.bold ? '900' : '700'} ${fontSize * typo.scale}px Vazirmatn, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  const x = width / 2;
  const y = height / 2 - typo.offsetY;
  
  // Multi-layer glow effect
  ctx.shadowColor = typo.glowColor;
  ctx.shadowBlur = 30;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  
  // Draw glow layers
  for (let i = 0; i < 3; i++) {
    ctx.shadowBlur = 20 + i * 10;
    ctx.fillStyle = typo.glowColor;
    ctx.globalAlpha = typo.opacity * 0.3;
    ctx.fillText(typo.text, x, y);
  }
  
  // Main text with strong shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 15;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 4;
  ctx.globalAlpha = typo.opacity;
  
  // Text color based on bold
  ctx.fillStyle = typo.bold ? '#ffffff' : '#fef3c7';
  ctx.fillText(typo.text, x, y);
  
  // Inner glow for bold text
  if (typo.bold) {
    ctx.shadowColor = typo.glowColor;
    ctx.shadowBlur = 10;
    ctx.fillStyle = typo.glowColor;
    ctx.globalAlpha = typo.opacity * 0.5;
    ctx.fillText(typo.text, x, y);
  }
  
  ctx.restore();
}

function drawSceneInfo(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  scene: typeof scenes[0],
  time: number
) {
  // Subtle scene number in corner
  ctx.save();
  ctx.globalAlpha = 0.4;
  ctx.font = '14px Vazirmatn, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 5;
  ctx.fillText(`صحنه ${scene.id}`, 20, 20);
  
  // Time code
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  const frames = Math.floor((time % 1) * 24);
  ctx.textAlign = 'right';
  ctx.fillText(`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(frames).padStart(2, '0')}`, width - 20, 20);
  ctx.restore();
}
