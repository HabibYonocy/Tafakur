import { useRef, useState, useEffect, useCallback } from 'react';
import {
  drawFrame,
  totalDuration,
  getSceneAtTime,
  sceneDurations,
  getActiveTypography,
} from './videoEngine';
import { scenes } from './data';

type PlaybackState = 'idle' | 'playing' | 'recording' | 'finished';

export default function VideoPlayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const currentTimeRef = useRef<number>(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [playbackState, setPlaybackState] = useState<PlaybackState>('idle');
  const [currentTime, setCurrentTime] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordProgress, setRecordProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const canvasWidth = 1280;
  const canvasHeight = 720;

  // Draw a single frame at given time
  const renderFrame = useCallback((time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawFrame(ctx, canvasWidth, canvasHeight, time);
  }, []);

  // Initial render
  useEffect(() => {
    renderFrame(0);
  }, [renderFrame]);

  // Playback loop
  const play = useCallback(() => {
    if (playbackState === 'recording') return;
    
    setPlaybackState('playing');
    setIsPlaying(true);
    startTimeRef.current = performance.now() - currentTimeRef.current * 1000;

    const animate = () => {
      const elapsed = (performance.now() - startTimeRef.current) / 1000;
      
      if (elapsed >= totalDuration) {
        currentTimeRef.current = totalDuration;
        setCurrentTime(totalDuration);
        renderFrame(totalDuration);
        setPlaybackState('finished');
        setIsPlaying(false);
        return;
      }

      currentTimeRef.current = elapsed;
      setCurrentTime(elapsed);
      renderFrame(elapsed);
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
  }, [playbackState, renderFrame]);

  const pause = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    setPlaybackState('idle');
    setIsPlaying(false);
  }, []);

  const stop = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    currentTimeRef.current = 0;
    setCurrentTime(0);
    renderFrame(0);
    setPlaybackState('idle');
    setIsPlaying(false);
  }, [renderFrame]);

  const seek = useCallback((time: number) => {
    currentTimeRef.current = time;
    setCurrentTime(time);
    renderFrame(time);
    if (isPlaying) {
      startTimeRef.current = performance.now() - time * 1000;
    }
  }, [renderFrame, isPlaying]);

  // Record video
  const startRecording = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Stop any current playback
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }

    setPlaybackState('recording');
    setIsRecording(true);
    setRecordProgress(0);
    setDownloadUrl(null);
    chunksRef.current = [];

    // Reset to beginning
    currentTimeRef.current = 0;
    setCurrentTime(0);

    const stream = canvas.captureStream(24);
    
    // Try different codecs
    let mimeType = 'video/webm;codecs=vp9';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/webm;codecs=vp8';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm';
      }
    }

    const recorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: 5000000,
    });

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setIsRecording(false);
      setPlaybackState('finished');
      setRecordProgress(100);
    };

    mediaRecorderRef.current = recorder;
    recorder.start(100); // Collect data every 100ms

    // Start animation for recording
    startTimeRef.current = performance.now();

    const animate = () => {
      const elapsed = (performance.now() - startTimeRef.current) / 1000;

      if (elapsed >= totalDuration) {
        currentTimeRef.current = totalDuration;
        setCurrentTime(totalDuration);
        renderFrame(totalDuration);
        recorder.stop();
        stream.getTracks().forEach(track => track.stop());
        return;
      }

      currentTimeRef.current = elapsed;
      setCurrentTime(elapsed);
      setRecordProgress((elapsed / totalDuration) * 100);
      renderFrame(elapsed);
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
  }, [renderFrame]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
      }
    };
  }, [downloadUrl]);

  // Scene info
  const { sceneIndex } = getSceneAtTime(currentTime);
  const currentScene = scenes[sceneIndex];
  const activeTypo = getActiveTypography(currentTime);

  // Timeline markers
  const timelineMarkers = scenes.map((scene: typeof scenes[0], i: number) => {
    let acc = 0;
    for (let j = 0; j < i; j++) acc += sceneDurations[j];
    return { scene, time: acc, duration: sceneDurations[i] };
  });

  const formatTime = (t: number) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    const f = Math.floor((t % 1) * 24);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}:${String(f).padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Canvas */}
      <div className="relative rounded-2xl overflow-hidden bg-black shadow-2xl shadow-black/50 border border-white/5">
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          className="w-full h-auto block"
        />
        
        {/* Overlay info */}
        {playbackState === 'recording' && (
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600/90 px-3 py-1.5 rounded-lg">
            <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse"></div>
            <span className="text-white text-xs font-bold">REC</span>
            <span className="text-white/80 text-xs">{Math.round(recordProgress)}%</span>
          </div>
        )}

        {/* Play button overlay when idle */}
        {playbackState === 'idle' && currentTime === 0 && (
          <button
            onClick={play}
            className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors group"
          >
            <div className="w-20 h-20 rounded-full bg-gold-400/90 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
              <svg className="w-8 h-8 text-cinematic-900 mr-[-2px]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </button>
        )}
      </div>

      {/* Controls */}
      <div className="mt-4 glass-card rounded-xl p-4">
        {/* Timeline */}
        <div className="relative mb-4">
          <div className="h-2 bg-cinematic-700 rounded-full overflow-hidden cursor-pointer"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const progress = x / rect.width;
              seek(progress * totalDuration);
            }}
          >
            <div
              className="h-full bg-gradient-to-l from-gold-400 to-spring-500 rounded-full transition-all duration-100"
              style={{ width: `${(currentTime / totalDuration) * 100}%` }}
            ></div>
          </div>
          
          {/* Scene markers */}
          <div className="absolute top-0 left-0 right-0 h-2 flex">
            {timelineMarkers.map((marker: { scene: typeof scenes[0]; time: number; duration: number }, i: number) => {
              const left = (marker.time / totalDuration) * 100;
              const width = (marker.duration / totalDuration) * 100;
              return (
                <div
                  key={i}
                  className="absolute top-0 h-full border-l border-white/20"
                  style={{ left: `${left}%`, width: `${width}%` }}
                >
                  <span className="absolute -bottom-5 left-0 text-[9px] text-gray-500 whitespace-nowrap">
                    {i + 1}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Time display */}
        <div className="flex items-center justify-between mb-4 mt-6">
          <span className="text-xs font-mono text-gray-400">{formatTime(currentTime)}</span>
          <span className="text-xs text-gray-500">/ {formatTime(totalDuration)}</span>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Play/Pause */}
          <button
            onClick={isPlaying ? pause : play}
            disabled={isRecording}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-400/20 text-gold-400 hover:bg-gold-400/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPlaying ? (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
                <span className="text-sm">توقف</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                <span className="text-sm">پخش</span>
              </>
            )}
          </button>

          {/* Stop */}
          <button
            onClick={stop}
            disabled={isRecording}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h12v12H6z"/></svg>
            <span className="text-sm">بازنشانی</span>
          </button>

          {/* Record */}
          <button
            onClick={startRecording}
            disabled={isRecording}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-red-400'}`}></div>
            <span className="text-sm">{isRecording ? 'در حال ضبط...' : 'ضبط ویدیو'}</span>
          </button>

          {/* Download */}
          {downloadUrl && (
            <a
              href={downloadUrl}
              download="tarbiyat-salem-video.webm"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-spring-500/20 text-spring-400 hover:bg-spring-500/30 transition-colors animate-pulse-gold"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span className="text-sm font-bold">دانلود ویدیو</span>
            </a>
          )}
        </div>

        {/* Recording progress */}
        {isRecording && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-red-400">در حال ضبط ویدیو...</span>
              <span className="text-xs text-gray-400">{Math.round(recordProgress)}%</span>
            </div>
            <div className="h-1.5 bg-cinematic-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-500 rounded-full transition-all duration-200"
                style={{ width: `${recordProgress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Current Scene Info */}
      <div className="mt-4 glass-card rounded-xl p-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gold-400/20 flex items-center justify-center">
              <span className="text-gold-400 text-xs font-bold">{currentScene.id}</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{currentScene.title}</p>
              <p className="text-xs text-gray-400">{currentScene.time}</p>
            </div>
          </div>
          {activeTypo && (
            <div className="text-left">
              <p className={`text-sm ${activeTypo.bold ? 'font-extrabold text-gold-400' : 'text-gray-200'}`}>
                {activeTypo.text}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-4 glass-card rounded-xl p-4 border border-gold-400/10">
        <h4 className="text-sm font-bold text-gold-400 mb-2">راهنمای استفاده</h4>
        <ul className="space-y-1.5 text-xs text-gray-400">
          <li className="flex items-start gap-2">
            <span className="text-gold-400">۱.</span>
            <span>دکمه <strong className="text-white">پخش</strong> را بزنید تا پیش‌نمایش ویدیو شروع شود.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gold-400">۲.</span>
            <span>دکمه <strong className="text-red-400">ضبط ویدیو</strong> را بزنید تا ویدیوی ۶۹ ثانیه‌ای با فرمت WebM ضبط شود.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gold-400">۳.</span>
            <span>پس از اتمام ضبط، دکمه <strong className="text-spring-400">دانلود ویدیو</strong> ظاهر می‌شود.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gold-400">۴.</span>
            <span>ویدیو شامل تمام ۱۱ صحنه، متن‌های فارسی، ترنزیشن‌ها و مسیر رنگ است.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
