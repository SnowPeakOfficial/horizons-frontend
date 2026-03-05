import React, { useRef, useState, useEffect, useCallback } from 'react';
import { theme } from '../../styles/theme';
import { typography } from '../../styles/typography';
import Close from '@mui/icons-material/Close';
import CameraAlt from '@mui/icons-material/CameraAlt';
import Mic from '@mui/icons-material/Mic';
import Videocam from '@mui/icons-material/Videocam';
import Stop from '@mui/icons-material/Stop';
import FiberManualRecord from '@mui/icons-material/FiberManualRecord';
import Check from '@mui/icons-material/Check';
import Replay from '@mui/icons-material/Replay';

export type CaptureMode = 'photo' | 'voice' | 'video';

interface MediaCaptureModalProps {
  isOpen: boolean;
  mode: CaptureMode;
  onCapture: (file: File) => void;
  onClose: () => void;
}

type Phase = 'preview' | 'recording' | 'review';

export const MediaCaptureModal: React.FC<MediaCaptureModalProps> = ({
  isOpen,
  mode,
  onCapture,
  onClose,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const [phase, setPhase] = useState<Phase>('preview');
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [capturedUrl, setCapturedUrl] = useState<string | null>(null);
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
  const [permissionError, setPermissionError] = useState('');

  // Stop all tracks and clear stream
  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  // Start camera/mic stream
  const startStream = useCallback(async () => {
    setPermissionError('');
    try {
      const constraints: MediaStreamConstraints =
        mode === 'voice'
          ? { audio: true }
          : { video: { facingMode: 'user' }, audio: mode === 'video' };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current && mode !== 'voice') {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch {
      setPermissionError('Camera/microphone access denied. Please allow access in your browser settings.');
    }
  }, [mode]);

  // Init / cleanup on open
  useEffect(() => {
    if (isOpen) {
      setPhase('preview');
      setRecordingSeconds(0);
      setCapturedUrl(null);
      setCapturedBlob(null);
      setPermissionError('');
      chunksRef.current = [];
      startStream();
    } else {
      stopStream();
      if (mediaRecorderRef.current?.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    }
    return () => { stopStream(); };
  }, [isOpen, startStream, stopStream]);

  // Recording timer
  useEffect(() => {
    if (phase !== 'recording') return;
    const id = setInterval(() => setRecordingSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [phase]);

  // === Actions ===

  const handleTakePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) return;
      setCapturedBlob(blob);
      setCapturedUrl(URL.createObjectURL(blob));
      setPhase('review');
      stopStream();
    }, 'image/jpeg', 0.92);
  };

  const handleStartRecording = () => {
    if (!streamRef.current) return;
    chunksRef.current = [];
    const mimeType = mode === 'voice' ? 'audio/webm' : 'video/webm';
    const recorder = new MediaRecorder(streamRef.current, { mimeType });
    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: mimeType });
      setCapturedBlob(blob);
      setCapturedUrl(URL.createObjectURL(blob));
      setPhase('review');
      stopStream();
    };
    recorder.start();
    mediaRecorderRef.current = recorder;
    setRecordingSeconds(0);
    setPhase('recording');
  };

  const handleStopRecording = () => {
    mediaRecorderRef.current?.stop();
  };

  const handleRetake = () => {
    if (capturedUrl) URL.revokeObjectURL(capturedUrl);
    setCapturedUrl(null);
    setCapturedBlob(null);
    chunksRef.current = [];
    setPhase('preview');
    startStream();
  };

  const handleUse = () => {
    if (!capturedBlob) return;
    const ext = mode === 'photo' ? 'jpg' : mode === 'voice' ? 'webm' : 'webm';
    const mimeType = mode === 'photo' ? 'image/jpeg' : 'audio/webm';
    const file = new File([capturedBlob], `capture-${Date.now()}.${ext}`, { type: mimeType });
    onCapture(file);
    onClose();
  };

  if (!isOpen) return null;

  const fmt = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const modeLabel = mode === 'photo' ? 'Photo' : mode === 'voice' ? 'Voice' : 'Video';
  const ModeIcon = mode === 'photo' ? CameraAlt : mode === 'voice' ? Mic : Videocam;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.72)',
          zIndex: 2000,
          backdropFilter: 'blur(4px)',
        }}
      />

      {/* Modal */}
      <div style={{
        position: 'fixed',
        top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        width: '480px',
        maxWidth: '95vw',
        background: '#1a1a2e',
        borderRadius: '20px',
        boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
        zIndex: 2001,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ModeIcon sx={{ fontSize: 20, color: theme.colors.rose[400] }} />
            <span style={{ ...typography.styles.body, fontWeight: 600, color: '#fff' }}>
              {phase === 'review' ? `Use this ${modeLabel.toLowerCase()}?` : `Capture ${modeLabel}`}
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '50%',
              width: 32, height: 32, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Close sx={{ fontSize: 18, color: '#fff' }} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Permission error */}
          {permissionError && (
            <div style={{
              padding: '12px 16px', borderRadius: 10,
              background: 'rgba(212,144,154,0.15)',
              border: '1px solid rgba(212,144,154,0.4)',
              color: theme.colors.rose[300],
              ...typography.styles.caption,
            }}>
              {permissionError}
            </div>
          )}

          {/* Live viewfinder — photo & video */}
          {mode !== 'voice' && phase !== 'review' && (
            <div style={{
              borderRadius: 12, overflow: 'hidden',
              background: '#000', aspectRatio: '4/3',
              position: 'relative',
            }}>
              <video
                ref={videoRef}
                muted
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              {phase === 'recording' && (
                <div style={{
                  position: 'absolute', top: 12, left: 12,
                  background: 'rgba(0,0,0,0.55)', borderRadius: 20,
                  padding: '4px 10px',
                  display: 'flex', alignItems: 'center', gap: 6,
                  color: '#fff', fontSize: 13, fontWeight: 600,
                }}>
                  <FiberManualRecord sx={{ fontSize: 12, color: '#f44' }} />
                  {fmt(recordingSeconds)}
                </div>
              )}
            </div>
          )}

          {/* Voice recorder UI */}
          {mode === 'voice' && phase !== 'review' && (
            <div style={{
              borderRadius: 12, background: 'rgba(255,255,255,0.04)',
              padding: '32px', textAlign: 'center',
            }}>
              <div style={{
                width: 80, height: 80, borderRadius: '50%',
                background: phase === 'recording' ? 'rgba(244,68,68,0.2)' : 'rgba(212,144,154,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
                transition: 'background 0.3s',
              }}>
                <Mic sx={{ fontSize: 36, color: phase === 'recording' ? '#f44' : theme.colors.rose[400] }} />
              </div>
              {phase === 'recording' ? (
                <div style={{ color: '#f44', fontWeight: 700, fontSize: 22 }}>{fmt(recordingSeconds)}</div>
              ) : (
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>Press record to start</div>
              )}
            </div>
          )}

          {/* Review — captured photo */}
          {phase === 'review' && mode === 'photo' && capturedUrl && (
            <img src={capturedUrl} alt="Captured" style={{ width: '100%', borderRadius: 12, display: 'block' }} />
          )}

          {/* Review — captured audio */}
          {phase === 'review' && mode === 'voice' && capturedUrl && (
            <div style={{ padding: '24px', textAlign: 'center' }}>
              <audio controls src={capturedUrl} style={{ width: '100%' }} />
            </div>
          )}

          {/* Review — captured video */}
          {phase === 'review' && mode === 'video' && capturedUrl && (
            <video controls src={capturedUrl} style={{ width: '100%', borderRadius: 12 }} />
          )}

          {/* Hidden canvas for photo capture */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            {phase === 'preview' && mode === 'photo' && (
              <button onClick={handleTakePhoto} disabled={!!permissionError} style={captureBtn}>
                <CameraAlt sx={{ fontSize: 22 }} /> Take Photo
              </button>
            )}
            {phase === 'preview' && mode !== 'photo' && (
              <button onClick={handleStartRecording} disabled={!!permissionError} style={captureBtn}>
                <FiberManualRecord sx={{ fontSize: 22, color: '#f44' }} /> Record
              </button>
            )}
            {phase === 'recording' && (
              <button onClick={handleStopRecording} style={{ ...captureBtn, background: '#f44' }}>
                <Stop sx={{ fontSize: 22 }} /> Stop
              </button>
            )}
            {phase === 'review' && (
              <>
                <button onClick={handleRetake} style={ghostBtn}>
                  <Replay sx={{ fontSize: 20 }} /> Retake
                </button>
                <button onClick={handleUse} style={captureBtn}>
                  <Check sx={{ fontSize: 20 }} /> Use this
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// Styles
const captureBtn: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 8,
  padding: '10px 22px', borderRadius: 40,
  background: theme.colors.rose[500], color: '#fff',
  border: 'none', cursor: 'pointer',
  fontWeight: 600, fontSize: 15,
  fontFamily: 'inherit',
};

const ghostBtn: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 8,
  padding: '10px 22px', borderRadius: 40,
  background: 'rgba(255,255,255,0.1)', color: '#fff',
  border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer',
  fontWeight: 600, fontSize: 15,
  fontFamily: 'inherit',
};
