import { useState, useEffect, useRef, useCallback } from 'react';
import { Camera, CameraOff, Video, Activity } from 'lucide-react';
import { FaceLandmarker, FilesetResolver, DrawingUtils } from '@mediapipe/tasks-vision';
import * as faceapi from '@vladmandic/face-api';
import { expressionTranslations } from './lib/translations';

function App() {
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expression, setExpression] = useState('');
  const [error, setError] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const landmarkerRef = useRef(null);
  const frameRef = useRef(null);
  const lastVideoTime = useRef(-1);

  useEffect(() => {
    const init = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks('/wasm');
        landmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: '/models/face_landmarker.task',
            delegate: 'GPU'
          },
          outputFaceBlendshapes: false,
          runningMode: 'VIDEO',
          numFaces: 1
        });

        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        await faceapi.nets.faceExpressionNet.loadFromUri('/models');

        setLoading(false);
      } catch (err) {
        setError("کێشەیەک ڕوویدا لە دابەزاندنی زیرەکی دەستکرد.");
      }
    };
    init();
  }, []);

  const tick = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !active || loading || !landmarkerRef.current) return;
    
    const video = videoRef.current;
    if (video.readyState !== 4) {
      frameRef.current = requestAnimationFrame(tick);
      return;
    }
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }

    const t0 = performance.now();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    
    try {
      if (lastVideoTime.current !== video.currentTime) {
        lastVideoTime.current = video.currentTime;
        const res = landmarkerRef.current.detectForVideo(video, t0);
        
        if (res.faceLandmarks) {
          const draw = new DrawingUtils(ctx);
          const c = { color: '#39ff14' };
          
          for (const marks of res.faceLandmarks) {
            draw.drawConnectors(marks, FaceLandmarker.FACE_LANDMARKS_TESSELATION, { ...c, lineWidth: 1.5 });
            draw.drawConnectors(marks, FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE, { ...c, lineWidth: 2 });
            draw.drawConnectors(marks, FaceLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW, { ...c, lineWidth: 2 });
            draw.drawConnectors(marks, FaceLandmarker.FACE_LANDMARKS_LEFT_EYE, { ...c, lineWidth: 2 });
            draw.drawConnectors(marks, FaceLandmarker.FACE_LANDMARKS_LEFT_EYEBROW, { ...c, lineWidth: 2 });
            draw.drawConnectors(marks, FaceLandmarker.FACE_LANDMARKS_FACE_OVAL, { ...c, lineWidth: 2 });
            draw.drawConnectors(marks, FaceLandmarker.FACE_LANDMARKS_LIPS, { ...c, lineWidth: 2 });
          }
        }
      }
      
      ctx.restore();

      const det = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions();
      
      if (det) {
        let bestExpr = 'neutral';
        let maxP = 0;
        
        for (const [expr, p] of Object.entries(det.expressions)) {
          if (p > maxP) {
            maxP = p;
            bestExpr = expr;
          }
        }
        
        setExpression(maxP >= 0.5 ? bestExpr : 'neutral');
      } else {
        setExpression('');
      }

    } catch (e) {
      ctx.restore(); 
    }
    
    frameRef.current = requestAnimationFrame(tick);
  }, [active, loading]);

  const startStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
      setActive(true);
      setError(null);
    } catch (err) {
      setError("کێشەیەک ڕوویدا لە کاتی کردنەوەی کامێراکە. تکایە دڵنیابە لەوەی مۆڵەتی ڕێگەپێدانت داوە.");
      setActive(false);
    }
  };

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setActive(false);
    setExpression('');
    
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }
  }, []);

  useEffect(() => {
    if (active && !loading) {
      frameRef.current = requestAnimationFrame(tick);
    }
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [active, loading, tick]);

  useEffect(() => stopStream, [stopStream]);

  return (
    <div className="app-container">
      <header className="header">
        <h1 className="title">دیاریکردنی دەربڕینی دەموچاو</h1>
        <p className="subtitle">کامێراکەت بکەوە بۆ ئەوەی ڕاستەوخۆ دەموچاوت بخوێنێتەوە.</p>
      </header>

      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      <main className="main-content">
        <div className="video-wrapper">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="webcam-video"
            style={{ display: active ? 'block' : 'none' }}
          />
          
          <canvas ref={canvasRef} className="drawing-canvas" />
          
          {!active && (
            <div className="video-placeholder">
              <Video size={64} style={{ color: '#475569', marginBottom: '1rem' }} />
              <p style={{ color: '#94a3b8' }}>
                {loading ? 'چاوەڕێبە... مۆدێلەکان دادەبەزن ⏳' : 'کامێرا داخراوە'}
              </p>
            </div>
          )}

          <div className="camera-overlay-controls">
            {!active ? (
              <button onClick={startStream} className="control-btn active" disabled={loading}>
                <Camera size={20} />
                <span>{loading ? 'دابەزاندن...' : 'کردنەوەی کامێرا'}</span>
              </button>
            ) : (
              <button onClick={stopStream} className="control-btn">
                <CameraOff size={20} />
                <span>داخستنی کامێرا</span>
              </button>
            )}
          </div>
          
          {active && (
            <div className="status-indicator">
              <span className="dot ready" style={{ backgroundColor: '#10b981', boxShadow: '0 0 8px #10b981', width: '8px', height: '8px', borderRadius: '50%', display: 'inline-block'}} />
              <span>MediaPipe + FaceAPI</span>
            </div>
          )}
        </div>

        <div className="description-panel">
          {expression ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={32} color="#39ff14" />
              <p className="description-text" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
                {expressionTranslations[expression] || "ئاسایی"}
              </p>
            </div>
          ) : active ? (
            <div className="placeholder-text">
              <span style={{ fontSize: '2rem' }}>🔍</span>
              <span>کامێراکە ڕووبەڕووی دەموچاوت بکە...</span>
            </div>
          ) : (
            <p className="placeholder-text" style={{ opacity: 0.5 }}>پێشەکی کامێراکە بکەوە...</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
