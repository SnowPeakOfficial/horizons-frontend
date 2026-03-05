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
          background: 'rgba(61,51,64,0.55)',
          zIndex: 2000,
          backdropFilter: 'blur(6px)',
        }}
      />

      {/* Modal */}
      <div style={{
        position: 'fixed',
        top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        width: 'min(460px, 94vw)',
        maxHeight: '90vh',
        background: theme.bg.elevated,
        borderRadius: theme.radius.xl,
        boxShadow: theme.shadow['2xl'],
        zIndex: 2001,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
          borderBottom: `1px solid ${theme.border.light}`,
          background: theme.colors.rose[50],
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: theme.radius.md,
              background: theme.colors.rose[100],
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ModeIcon sx={{ fontSize: 18, color: theme.colors.rose[600] }} />
            </div>
            <span style={{ ...typography.styles.body, fontWeight: 600, color: theme.text.primary }}>
              {phase === 'review' ? `Use this ${modeLabel.toLowerCase()}?` : `Capture ${modeLabel}`}
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: theme.colors.rose[100],
              border: 'none',
              borderRadius: '50%',
              width: 32, height: 32, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: theme.transition.fast,
            }}
          >
            <Close sx={{ fontSize: 16, color: theme.text.secondary }} />
          </button>
        </div>

        {/* Body */}
        <div style={{
          padding: theme.spacing.xl,
          display: 'flex', flexDirection: 'column', gap: theme.spacing.lg,
          overflowY: 'auto', flex: 1,
        }}>

          {/* Permission error */}
          {permissionError && (
            <div style={{
              padding: `${theme.spacing.md} ${theme.spacing.lg}`,
              borderRadius: theme.radius.md,
              background: theme.colors.rose[50],
              border: `1px solid ${theme.border.dark}`,
              color: theme.text.secondary,
              ...typography.styles.caption,
              display: 'flex', gap: 8, alignItems: 'flex-start',
            }}>
              <span style={{ color: theme.colors.rose[600], flexShrink: 0 }}>⚠️</span>
              {permissionError}
            </div>
          )}

          {/* Live viewfinder — photo & video */}
          {mode !== 'voice' && phase !== 'review' && (
            <div style={{
              borderRadius: theme.radius.lg,
              overflow: 'hidden',
              background: '#111',
              aspectRatio: '4/3',
              position: 'relative',
              boxShadow: theme.shadow.md,
              maxHeight: '42vh',
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
                  background: 'rgba(61,51,64,0.72)',
                  backdropFilter: 'blur(4px)',
                  borderRadius: theme.radius.full,
                  padding: '5px 12px',
                  display: 'flex', alignItems: 'center', gap: 6,
                  color: '#fff', fontSize: 13, fontWeight: 600,
                }}>
                  <FiberManualRecord sx={{ fontSize: 12, color: theme.semantic.error }} />
                  {fmt(recordingSeconds)}
                </div>
              )}
            </div>
          )}

          {/* Voice recorder UI */}
          {mode === 'voice' && phase !== 'review' && (
            <div style={{
              borderRadius: theme.radius.lg,
              background: theme.colors.rose[50],
              border: `1px solid ${theme.border.medium}`,
              padding: '36px 24px', textAlign: 'center',
            }}>
              <div style={{
                width: 88, height: 88, borderRadius: '50%',
                background: phase === 'recording'
                  ? `${theme.semantic.error}20`
                  : theme.colors.rose[100],
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px',
                transition: theme.transition.base,
                boxShadow: phase === 'recording'
                  ? `0 0 0 8px ${theme.semantic.error}15`
                  : 'none',
              }}>
                <Mic sx={{ fontSize: 38, color: phase === 'recording' ? theme.semantic.error : theme.colors.rose[500] }} />
              </div>
              {phase === 'recording' ? (
                <div style={{
                  ...typography.styles.h4,
                  color: theme.semantic.error,
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {fmt(recordingSeconds)}
                </div>
              ) : (
                <div style={{ ...typography.styles.body, color: theme.text.secondary }}>
                  Press <strong>Record</strong> to start
                </div>
              )}
            </div>
          )}

          {/* Review — captured photo */}
          {phase === 'review' && mode === 'photo' && capturedUrl && (
            <img
              src={capturedUrl}
              alt="Captured"
              style={{
                width: '100%',
                borderRadius: theme.radius.lg,
                display: 'block',
                boxShadow: theme.shadow.md,
                maxHeight: '42vh',
                objectFit: 'contain',
              }}
            />
          )}

          {/* Review — captured audio */}
          {phase === 'review' && mode === 'voice' && capturedUrl && (
            <div style={{
              padding: theme.spacing.xl,
              borderRadius: theme.radius.lg,
              background: theme.colors.rose[50],
              border: `1px solid ${theme.border.medium}`,
              textAlign: 'center',
            }}>
              <Mic sx={{ fontSize: 32, color: theme.colors.rose[500], marginBottom: 12 }} />
              <audio controls src={capturedUrl} style={{ width: '100%' }} />
            </div>
          )}

          {/* Review — captured video */}
          {phase === 'review' && mode === 'video' && capturedUrl && (
            <video
              controls
              src={capturedUrl}
              style={{
                width: '100%',
                borderRadius: theme.radius.lg,
                boxShadow: theme.shadow.md,
                maxHeight: '42vh',
              }}
            />
          )}

          {/* Hidden canvas for photo capture */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />

          {/* Action buttons */}
          <div style={{
            display: 'flex', gap: theme.spacing.md,
            justifyContent: 'center',
            paddingTop: theme.spacing.sm,
          }}>
            {phase === 'preview' && mode === 'photo' && (
              <button
                onClick={handleTakePhoto}
                disabled={!!permissionError}
                style={permissionError ? { ...captureBtn, opacity: 0.45, cursor: 'not-allowed' } : captureBtn}
              >
                <CameraAlt sx={{ fontSize: 20 }} /> Take Photo
              </button>
            )}
            {phase === 'preview' && mode !== 'photo' && (
              <button
                onClick={handleStartRecording}
                disabled={Boolean(permissionError)}
                style={permissionError ? { ...captureBtn, opacity: 0.45, cursor: 'not-allowed' } : captureBtn}
              >
                <FiberManualRecord sx={{ fontSize: 18, color: theme.semantic.error }} /> Record
              </button>
            )}
            {phase === 'recording' && (
              <button onClick={handleStopRecording} style={stopBtn}>
                <Stop sx={{ fontSize: 20 }} /> Stop Recording
              </button>
            )}
            {phase === 'review' && (
              <>
                <button onClick={handleRetake} style={ghostBtn}>
                  <Replay sx={{ fontSize: 18 }} /> Retake
                </button>
                <button onClick={handleUse} style={captureBtn}>
                  <Check sx={{ fontSize: 18 }} /> Use this
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// ── Shared button base ──────────────────────────────────────────
const btnBase: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 8,
  padding: '11px 24px',
  borderRadius: theme.radius.full,
  border: 'none', cursor: 'pointer',
  fontWeight: 600, fontSize: 14,
  fontFamily: 'inherit',
  transition: 'all 200ms ease',
  whiteSpace: 'nowrap',
};

const captureBtn: React.CSSProperties = {
  ...btnBase,
  background: theme.colors.rose[600],
  color: theme.text.inverse,
  boxShadow: `0 4px 12px ${theme.colors.rose[300]}`,
};

const stopBtn: React.CSSProperties = {
  ...btnBase,
  background: theme.semantic.error,
  color: theme.text.inverse,
  boxShadow: `0 4px 12px ${theme.colors.rose[300]}`,
};

const ghostBtn: React.CSSProperties = {
  ...btnBase,
  background: theme.colors.rose[50],
  color: theme.text.secondary,
  border: `1px solid ${theme.border.dark}`,
  boxShadow: 'none',
};
