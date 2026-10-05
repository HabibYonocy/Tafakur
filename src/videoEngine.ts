import { scenes, typographySchedule } from './data';

export interface VideoFrame {
  sceneIndex: number;
  progress: number; // 0-1 within scene
  globalTime: number; // total seconds elapsed
}

// Scene visual configurations - gradient backgrounds simulating stock footage
export const sceneVisuals = [
  // Scene 1: Rocky path sunrise
  { bg: ['#1a0f05', '#3d2b1f', '#8b5e3c', '#d4a853'], particles: 'dust', camera: 'push-in' },
  // Scene 2: Hiker climbing
  { bg: ['#2d1f0f', '#5c3d2e', '#8b6b4a', '#c9952c'], particles: 'dust', camera: 'tracking' },
  // Scene 3: Bird on cliff
  { bg: ['#1a2332', '#2d3748', '#4a5568', '#a0aec0'], particles: 'wind', camera: 'slow-zoom' },
  // Scene 4: Flying through clouds
  { bg: ['#1e3a5f', '#2b6cb0', '#63b3ed', '#bee3f8'], particles: 'clouds', camera: 'pan' },
  // Scene 5: Summit golden light
  { bg: ['#4a3520', '#8b6914', '#d4a853', '#fef3c7'], particles: 'light', camera: 'pull-back' },
  // Scene 6: Autumn tree
  { bg: ['#3d2b1f', '#92400e', '#d97706', '#fbbf24'], particles: 'leaves', camera: 'static' },
  // Scene 7: Winter tree
  { bg: ['#1e293b', '#334155', '#64748b', '#93c5fd'], particles: 'snow', camera: 'static' },
  // Scene 8: Walking to light
  { bg: ['#0a0a0f', '#1a1a2e', '#4a3520', '#d4a853'], particles: 'light-rays', camera: 'push-in' },
  // Scene 9: Spring rain
  { bg: ['#064e3b', '#065f46', '#10b981', '#6ee7b7'], particles: 'rain', camera: 'macro' },
  // Scene 10: Green tree golden
  { bg: ['#14532d', '#166534', '#22c55e', '#d4a853'], particles: 'light', camera: 'pull-back' },
  // Scene 11: Peaceful ending
  { bg: ['#14532d', '#166534', '#4ade80', '#fef3c7'], particles: 'light', camera: 'fade-out' },
];

// Scene durations in seconds
export const sceneDurations = [7, 7, 7, 6, 7, 8, 7, 6, 7, 5, 2];

// Get total duration
export const totalDuration = sceneDurations.reduce((a, b) => a + b, 0); // 69

// Get active typography for a given time
export function getActiveTypography(time: number): { text: string; opacity: number; offsetY: number; scale: number; bold: boolean } | null {
  const fadeInDuration = 0.4;
  const fadeOutDuration = 0.35;
  const displayDuration = 2.0;

  for (const item of typographySchedule) {
    const [min, sec] = item.time.split(':').map(Number);
    const startTime = min * 60 + sec;
    const endTime = startTime + displayDuration;

    if (time >= startTime && time <= endTime) {
      const elapsed = time - startTime;
      let opacity = 1;
      let offsetY = 0;
      let scale = 1;

      if (elapsed < fadeInDuration) {
        const progress = elapsed / fadeInDuration;
        opacity = progress;
        offsetY = 15 * (1 - progress);
        scale = 0.97 + 0.03 * progress;
      } else if (elapsed > displayDuration - fadeOutDuration) {
        const progress = (elapsed - (displayDuration - fadeOutDuration)) / fadeOutDuration;
        opacity = 1 - progress;
      }

      return { text: item.text, opacity, offsetY, scale, bold: item.bold };
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
  const visual = sceneVisuals[sceneIndex];
  const scene = scenes[sceneIndex];

  // Clear
  ctx.clearRect(0, 0, width, height);

  // Draw background gradient
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  visual.bg.forEach((color, i) => {
    gradient.addColorStop(i / (visual.bg.length - 1), color);
  });
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Draw atmospheric particles
  drawParticles(ctx, width, height, time, visual.particles, sceneIndex);

  // Draw scene-specific elements
  drawSceneElements(ctx, width, height, time, sceneIndex, sceneProgress);

  // Draw transition overlay
  drawTransition(ctx, width, height, time, sceneIndex, sceneProgress);

  // Draw typography
  const typo = getActiveTypography(time);
  if (typo) {
    drawTypography(ctx, width, height, typo);
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
  type: string,
  sceneIndex: number
) {
  const seed = sceneIndex * 1000;

  switch (type) {
    case 'dust':
      for (let i = 0; i < 30; i++) {
        const x = ((seed + i * 137 + time * 20) % width);
        const y = ((seed + i * 89 + time * 10) % height);
        const size = 1 + (i % 3);
        ctx.fillStyle = `rgba(212, 168, 83, ${0.1 + (i % 5) * 0.05})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
      break;

    case 'wind':
      for (let i = 0; i < 20; i++) {
        const x = ((seed + i * 150 + time * 80) % (width + 200)) - 100;
        const y = ((seed + i * 67) % height);
        ctx.strokeStyle = `rgba(160, 174, 192, ${0.1 + (i % 3) * 0.05})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + 30 + i * 2, y + Math.sin(time + i) * 5);
        ctx.stroke();
      }
      break;

    case 'clouds':
      for (let i = 0; i < 8; i++) {
        const x = ((seed + i * 200 + time * 15) % (width + 300)) - 150;
        const y = 50 + i * 60 + Math.sin(time * 0.5 + i) * 20;
        const w = 200 + i * 30;
        const h = 40 + i * 10;
        ctx.fillStyle = `rgba(190, 227, 248, ${0.05 + (i % 3) * 0.02})`;
        ctx.beginPath();
        ctx.ellipse(x, y, w, h, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      break;

    case 'light':
      for (let i = 0; i < 15; i++) {
        const x = width * 0.5 + Math.cos(time * 0.3 + i * 0.7) * width * 0.4;
        const y = height * 0.3 + Math.sin(time * 0.2 + i * 0.5) * height * 0.3;
        const size = 2 + Math.sin(time + i) * 1.5;
        ctx.fillStyle = `rgba(254, 243, 199, ${0.2 + Math.sin(time + i) * 0.1})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
      break;

    case 'leaves':
      for (let i = 0; i < 20; i++) {
        const x = ((seed + i * 100 + time * 30) % width);
        const y = ((seed + i * 70 + time * 40 + Math.sin(time + i) * 30) % height);
        const rotation = time * 2 + i;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.fillStyle = `rgba(217, 119, 6, ${0.3 + (i % 4) * 0.1})`;
        ctx.beginPath();
        ctx.ellipse(0, 0, 4, 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      break;

    case 'snow':
      for (let i = 0; i < 50; i++) {
        const x = ((seed + i * 80 + time * 15 + Math.sin(time * 0.5 + i) * 20) % width);
        const y = ((seed + i * 50 + time * 30) % height);
        const size = 1 + (i % 3) * 0.5;
        ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + (i % 5) * 0.1})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
      break;

    case 'rain':
      for (let i = 0; i < 60; i++) {
        const x = ((seed + i * 60) % width);
        const y = ((seed + i * 40 + time * 200) % height);
        ctx.strokeStyle = `rgba(110, 231, 183, ${0.2 + (i % 3) * 0.1})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - 1, y + 10);
        ctx.stroke();
      }
      break;

    case 'light-rays':
      for (let i = 0; i < 5; i++) {
        const x = width * 0.7 + i * 30;
        const opacity = 0.03 + Math.sin(time * 0.5 + i) * 0.02;
        ctx.fillStyle = `rgba(212, 168, 83, ${opacity})`;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x - 100, height);
        ctx.lineTo(x + 50, height);
        ctx.closePath();
        ctx.fill();
      }
      break;
  }
}

function drawSceneElements(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  sceneIndex: number,
  progress: number
) {
  // Draw silhouette elements based on scene
  switch (sceneIndex) {
    case 0: // Mountain path
      drawMountains(ctx, width, height, time, '#1a0f05', 0.6);
      drawPath(ctx, width, height, progress);
      break;
    case 1: // Hiker
      drawMountains(ctx, width, height, time, '#2d1f0f', 0.5);
      drawHiker(ctx, width, height, progress);
      break;
    case 2: // Bird on cliff
      drawCliff(ctx, width, height);
      drawBird(ctx, width, height, progress, false);
      break;
    case 3: // Flying bird
      drawBird(ctx, width, height, progress, true);
      break;
    case 4: // Summit
      drawMountains(ctx, width, height, time, '#4a3520', 0.7);
      drawHiker(ctx, width, height, 0.9);
      drawSunRays(ctx, width, height, time);
      break;
    case 5: // Autumn tree
      drawTree(ctx, width, height, 'autumn', progress);
      break;
    case 6: // Winter tree
      drawTree(ctx, width, height, 'winter', progress);
      break;
    case 7: // Walking to light
      drawLightBeam(ctx, width, height, time);
      drawWalkingSilhouette(ctx, width, height, progress);
      break;
    case 8: // Rain macro
      drawLeafMacro(ctx, width, height, time);
      break;
    case 9: // Green tree
      drawTree(ctx, width, height, 'spring', progress);
      drawSunRays(ctx, width, height, time);
      break;
    case 10: // Ending
      drawTree(ctx, width, height, 'spring', 0.5);
      break;
  }
}

function drawMountains(ctx: CanvasRenderingContext2D, width: number, height: number, time: number, color: string, scale: number) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, height);
  for (let x = 0; x <= width; x += 20) {
    const y = height * (1 - scale * 0.5) + Math.sin(x * 0.005 + time * 0.1) * 50 + Math.sin(x * 0.01) * 80;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(width, height);
  ctx.closePath();
  ctx.fill();
}

function drawPath(ctx: CanvasRenderingContext2D, width: number, height: number, progress: number) {
  ctx.strokeStyle = 'rgba(139, 94, 60, 0.4)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(width * 0.5, height);
  ctx.quadraticCurveTo(width * 0.4, height * 0.7, width * 0.5, height * 0.4);
  ctx.stroke();
}

function drawHiker(ctx: CanvasRenderingContext2D, width: number, height: number, progress: number) {
  const x = width * 0.45 + progress * width * 0.1;
  const y = height * 0.75 - progress * height * 0.15;
  
  ctx.fillStyle = 'rgba(30, 20, 10, 0.8)';
  // Body
  ctx.beginPath();
  ctx.ellipse(x, y, 8, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  // Head
  ctx.beginPath();
  ctx.arc(x, y - 25, 7, 0, Math.PI * 2);
  ctx.fill();
  // Backpack
  ctx.fillStyle = 'rgba(50, 35, 20, 0.8)';
  ctx.fillRect(x - 10, y - 15, 8, 18);
}

function drawCliff(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.fillStyle = 'rgba(45, 55, 72, 0.6)';
  ctx.beginPath();
  ctx.moveTo(0, height * 0.7);
  ctx.lineTo(width * 0.3, height * 0.5);
  ctx.lineTo(width * 0.35, height * 0.55);
  ctx.lineTo(width * 0.4, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fill();
}

function drawBird(ctx: CanvasRenderingContext2D, width: number, height: number, progress: number, flying: boolean) {
  let x: number, y: number;
  
  if (flying) {
    x = width * 0.3 + progress * width * 0.4;
    y = height * 0.4 - Math.sin(progress * Math.PI) * height * 0.15;
  } else {
    x = width * 0.35;
    y = height * 0.45;
  }

  const wingSpan = flying ? 30 + Math.sin(progress * 20) * 10 : 15 + progress * 15;
  
  ctx.fillStyle = 'rgba(30, 30, 40, 0.9)';
  ctx.beginPath();
  // Body
  ctx.ellipse(x, y, 10, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  // Wings
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.quadraticCurveTo(x - wingSpan * 0.5, y - wingSpan, x - wingSpan, y - wingSpan * 0.3);
  ctx.moveTo(x, y);
  ctx.quadraticCurveTo(x + wingSpan * 0.5, y - wingSpan, x + wingSpan, y - wingSpan * 0.3);
  ctx.strokeStyle = 'rgba(30, 30, 40, 0.9)';
  ctx.lineWidth = 3;
  ctx.stroke();
}

function drawTree(ctx: CanvasRenderingContext2D, width: number, height: number, season: string, progress: number) {
  const x = width * 0.5;
  const baseY = height * 0.85;
  const trunkHeight = height * 0.4;

  // Trunk
  ctx.fillStyle = season === 'winter' ? 'rgba(71, 85, 105, 0.8)' : 'rgba(92, 61, 46, 0.8)';
  ctx.beginPath();
  ctx.moveTo(x - 8, baseY);
  ctx.lineTo(x - 5, baseY - trunkHeight);
  ctx.lineTo(x + 5, baseY - trunkHeight);
  ctx.lineTo(x + 8, baseY);
  ctx.closePath();
  ctx.fill();

  // Branches
  const branchColor = season === 'winter' ? 'rgba(71, 85, 105, 0.7)' : 'rgba(92, 61, 46, 0.7)';
  ctx.strokeStyle = branchColor;
  ctx.lineWidth = 2;
  
  for (let i = 0; i < 6; i++) {
    const by = baseY - trunkHeight * (0.4 + i * 0.1);
    const dir = i % 2 === 0 ? -1 : 1;
    const len = 30 + i * 10;
    ctx.beginPath();
    ctx.moveTo(x, by);
    ctx.quadraticCurveTo(x + dir * len * 0.5, by - 15, x + dir * len, by - 25);
    ctx.stroke();
  }

  // Foliage (not in winter)
  if (season !== 'winter') {
    let foliageColor: string;
    switch (season) {
      case 'autumn': foliageColor = 'rgba(217, 119, 6, 0.5)'; break;
      case 'spring': foliageColor = 'rgba(34, 197, 94, 0.4)'; break;
      default: foliageColor = 'rgba(34, 197, 94, 0.4)';
    }
    
    const topY = baseY - trunkHeight - 20;
    ctx.fillStyle = foliageColor;
    ctx.beginPath();
    ctx.ellipse(x, topY, 60, 50, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x - 30, topY + 20, 40, 35, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + 30, topY + 20, 40, 35, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Ground
  let groundColor: string;
  switch (season) {
    case 'autumn': groundColor = 'rgba(146, 64, 14, 0.3)'; break;
    case 'winter': groundColor = 'rgba(147, 197, 253, 0.2)'; break;
    case 'spring': groundColor = 'rgba(34, 197, 94, 0.2)'; break;
    default: groundColor = 'rgba(34, 197, 94, 0.2)';
  }
  ctx.fillStyle = groundColor;
  ctx.fillRect(0, baseY, width, height - baseY);
}

function drawLightBeam(ctx: CanvasRenderingContext2D, width: number, height: number, time: number) {
  const gradient = ctx.createRadialGradient(width * 0.75, height * 0.3, 0, width * 0.75, height * 0.3, width * 0.5);
  gradient.addColorStop(0, 'rgba(212, 168, 83, 0.3)');
  gradient.addColorStop(1, 'rgba(212, 168, 83, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function drawWalkingSilhouette(ctx: CanvasRenderingContext2D, width: number, height: number, progress: number) {
  const x = width * 0.3 + progress * width * 0.3;
  const y = height * 0.7;
  
  ctx.fillStyle = 'rgba(10, 10, 15, 0.9)';
  ctx.beginPath();
  ctx.ellipse(x, y, 10, 25, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x, y - 30, 8, 0, Math.PI * 2);
  ctx.fill();
  // Legs
  ctx.strokeStyle = 'rgba(10, 10, 15, 0.9)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x - 3, y + 20);
  ctx.lineTo(x - 8, y + 45);
  ctx.moveTo(x + 3, y + 20);
  ctx.lineTo(x + 8, y + 45);
  ctx.stroke();
}

function drawLeafMacro(ctx: CanvasRenderingContext2D, width: number, height: number, time: number) {
  // Large leaf
  ctx.fillStyle = 'rgba(16, 185, 129, 0.6)';
  ctx.beginPath();
  ctx.ellipse(width * 0.5, height * 0.5, width * 0.3, height * 0.2, -0.3, 0, Math.PI * 2);
  ctx.fill();
  
  // Leaf vein
  ctx.strokeStyle = 'rgba(6, 78, 59, 0.4)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(width * 0.3, height * 0.55);
  ctx.lineTo(width * 0.7, height * 0.45);
  ctx.stroke();

  // Water drop
  const dropX = width * 0.5 + Math.sin(time) * 5;
  const dropY = height * 0.48;
  const dropGradient = ctx.createRadialGradient(dropX - 3, dropY - 3, 0, dropX, dropY, 15);
  dropGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
  dropGradient.addColorStop(0.5, 'rgba(110, 231, 183, 0.5)');
  dropGradient.addColorStop(1, 'rgba(16, 185, 129, 0.3)');
  ctx.fillStyle = dropGradient;
  ctx.beginPath();
  ctx.ellipse(dropX, dropY, 12, 15, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawSunRays(ctx: CanvasRenderingContext2D, width: number, height: number, time: number) {
  const gradient = ctx.createRadialGradient(width * 0.7, height * 0.2, 0, width * 0.7, height * 0.2, width * 0.6);
  gradient.addColorStop(0, `rgba(254, 243, 199, ${0.15 + Math.sin(time * 0.5) * 0.05})`);
  gradient.addColorStop(1, 'rgba(254, 243, 199, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
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
  const transitionDuration = 0.4;
  let accumulated = 0;
  for (let i = 0; i < sceneIndex; i++) {
    accumulated += sceneDurations[i];
  }
  const sceneStartTime = accumulated;
  const elapsed = time - sceneStartTime;

  if (elapsed < transitionDuration && sceneIndex > 0) {
    const fadeProgress = elapsed / transitionDuration;
    ctx.fillStyle = `rgba(0, 0, 0, ${0.3 * (1 - fadeProgress)})`;
    ctx.fillRect(0, 0, width, height);
  }
}

function drawTypography(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  typo: { text: string; opacity: number; offsetY: number; scale: number; bold: boolean }
) {
  ctx.save();
  ctx.globalAlpha = typo.opacity;
  
  const fontSize = Math.min(width * 0.05, 48);
  ctx.font = `${typo.bold ? '800' : '600'} ${fontSize * typo.scale}px Vazirmatn, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 2;
  
  // Text color
  ctx.fillStyle = typo.bold ? '#d4a853' : '#fef3c7';
  
  const x = width / 2;
  const y = height * 0.85 - typo.offsetY;
  
  ctx.fillText(typo.text, x, y);
  
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
  ctx.globalAlpha = 0.3;
  ctx.font = '12px Vazirmatn, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(`Scene ${scene.id}`, 15, 15);
  
  // Time code
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  const frames = Math.floor((time % 1) * 24);
  ctx.textAlign = 'right';
  ctx.fillText(`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(frames).padStart(2, '0')}`, width - 15, 15);
  ctx.restore();
}
