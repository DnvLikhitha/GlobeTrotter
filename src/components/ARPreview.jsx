// AR (Augmented Reality) Preview Component using device camera

import { useState, useRef, useEffect } from 'react';
import { Camera, X, Maximize2, Download } from 'lucide-react';

const ARPreview = ({ destination, onClose }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: 1280, height: 720 },
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsActive(true);
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setError('Unable to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsActive(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Add AR overlay
    drawAROverlay(context, canvas.width, canvas.height);

    // Convert to image
    const imageData = canvas.toDataURL('image/png');
    setCapturedImage(imageData);
  };

  const drawAROverlay = (context, width, height) => {
    // Destination name overlay
    context.font = 'bold 48px Arial';
    context.fillStyle = 'rgba(255, 255, 255, 0.9)';
    context.strokeStyle = 'rgba(0, 0, 0, 0.8)';
    context.lineWidth = 3;
    const text = destination.name || 'Destination';
    const textWidth = context.measureText(text).width;
    const x = (width - textWidth) / 2;
    const y = 100;
    
    context.strokeText(text, x, y);
    context.fillText(text, x, y);

    // Info card
    const cardX = 50;
    const cardY = height - 250;
    const cardWidth = 400;
    const cardHeight = 200;

    // Card background
    context.fillStyle = 'rgba(0, 0, 0, 0.7)';
    context.roundRect(cardX, cardY, cardWidth, cardHeight, 20);
    context.fill();

    // Card content
    context.fillStyle = 'white';
    context.font = 'bold 24px Arial';
    context.fillText(destination.name || 'Unknown', cardX + 20, cardY + 40);

    context.font = '18px Arial';
    context.fillText(`📍 ${destination.country || 'Country'}`, cardX + 20, cardY + 75);
    context.fillText(`⭐ Rating: ${destination.rating || 'N/A'}`, cardX + 20, cardY + 110);
    context.fillText(`💰 Cost: ${destination.cost || 'N/A'}`, cardX + 20, cardY + 145);

    // AR markers/pointers
    const markerSize = 60;
    const markerX = width / 2 - markerSize / 2;
    const markerY = height / 2 - markerSize / 2;

    // Crosshair marker
    context.strokeStyle = 'rgba(0, 255, 0, 0.8)';
    context.lineWidth = 3;
    context.beginPath();
    context.arc(width / 2, height / 2, 50, 0, Math.PI * 2);
    context.stroke();

    context.beginPath();
    context.moveTo(width / 2 - 70, height / 2);
    context.lineTo(width / 2 - 50, height / 2);
    context.moveTo(width / 2 + 50, height / 2);
    context.lineTo(width / 2 + 70, height / 2);
    context.moveTo(width / 2, height / 2 - 70);
    context.lineTo(width / 2, height / 2 - 50);
    context.moveTo(width / 2, height / 2 + 50);
    context.lineTo(width / 2, height / 2 + 70);
    context.stroke();

    // Corner markers
    const cornerSize = 30;
    const corners = [
      { x: cardX, y: cardY },
      { x: cardX + cardWidth, y: cardY },
      { x: cardX, y: cardY + cardHeight },
      { x: cardX + cardWidth, y: cardY + cardHeight }
    ];

    context.strokeStyle = 'rgba(0, 255, 255, 0.8)';
    context.lineWidth = 4;
    corners.forEach(corner => {
      context.strokeRect(corner.x - 5, corner.y - 5, 10, 10);
    });
  };

  const downloadImage = () => {
    if (!capturedImage) return;

    const link = document.createElement('a');
    link.download = `ar-preview-${destination.name}-${Date.now()}.png`;
    link.href = capturedImage;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/70 to-transparent p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-white text-xl font-bold flex items-center gap-2">
            <Camera className="w-6 h-6" />
            AR Preview: {destination.name}
          </h2>
          <button
            onClick={onClose}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Camera View */}
      {!capturedImage ? (
        <div className="relative w-full h-full">
          {error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-white">
                <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">{error}</p>
              </div>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              
              {/* AR Overlay Canvas */}
              <canvas
                ref={canvasRef}
                className="hidden"
              />

              {/* Real-time AR Overlay */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-24 h-24 border-4 border-green-500 rounded-full animate-pulse"></div>
                </div>
              </div>

              {/* Info Card Overlay */}
              <div className="absolute bottom-20 left-4 right-4 bg-black/80 backdrop-blur-lg rounded-2xl p-6 text-white">
                <h3 className="text-2xl font-bold mb-3">{destination.name}</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>📍 {destination.country}</div>
                  <div>⭐ Rating: {destination.rating || 'N/A'}</div>
                  <div>💰 Cost: {destination.cost || 'N/A'}</div>
                  <div>🌡️ {destination.weather || 'Sunny'}</div>
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        /* Captured Image Preview */
        <div className="relative w-full h-full">
          <img
            src={capturedImage}
            alt="AR Capture"
            className="w-full h-full object-contain"
          />
        </div>
      )}

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
        <div className="flex items-center justify-center gap-6">
          {!capturedImage ? (
            <>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={capturePhoto}
                disabled={!isActive}
                className="w-20 h-20 bg-white hover:bg-gray-200 rounded-full shadow-lg transition-transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <div className="w-16 h-16 border-4 border-black rounded-full"></div>
              </button>
              <button
                onClick={() => {}}
                className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors"
              >
                <Maximize2 className="w-6 h-6" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setCapturedImage(null)}
                className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors"
              >
                Retake
              </button>
              <button
                onClick={downloadImage}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold transition-colors flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors"
              >
                Done
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ARPreview;
