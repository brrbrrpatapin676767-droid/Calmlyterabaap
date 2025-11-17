import React, { useState, useRef, useEffect, useCallback } from 'react';

interface CameraModalProps {
  onPhotoTaken: (dataUrl: string) => void;
  onClose: () => void;
}

const CameraModal: React.FC<CameraModalProps> = ({ onPhotoTaken, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Could not access camera. Please check permissions.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setStream(null);
  }, [stream]);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      const dataUrl = canvas.toDataURL('image/jpeg');
      onPhotoTaken(dataUrl);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="relative w-full max-w-lg bg-dark-bg-secondary rounded-2xl overflow-hidden shadow-lg">
        <video ref={videoRef} autoPlay playsInline className="w-full h-auto" />
        {error && <p className="text-red-500 p-4 text-center">{error}</p>}
        <canvas ref={canvasRef} className="hidden" />

        <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-center items-center bg-gradient-to-t from-black/70">
          <button 
            onClick={handleCapture}
            disabled={!stream}
            className="w-20 h-20 rounded-full bg-white/90 border-4 border-white/30 focus:outline-none focus:ring-4 focus:ring-accent disabled:opacity-50"
            aria-label="Capture photo"
          ></button>
        </div>
        
        <button onClick={onClose} className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70" aria-label="Close camera">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
        </button>
      </div>
    </div>
  );
};

export default CameraModal;
