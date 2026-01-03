import React, { useEffect, useRef, useState } from 'react';
import { Globe, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

const Globe3D = ({ trips = [], selectedTrip = null, onTripClick }) => {
  const canvasRef = useRef(null);
  const [rotation, setRotation] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const animationRef = useRef(null);

  // Extract unique locations from trips
  const locations = trips.flatMap(trip => 
    trip.stops?.map(stop => ({
      city: stop.city,
      country: stop.country,
      tripId: trip.id,
      // Mock coordinates - in production, use geocoding API
      lat: Math.random() * 180 - 90,
      lng: Math.random() * 360 - 180
    })) || []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) / 2 - 20;

    const drawGlobe = (rotationAngle) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw globe sphere with gradient
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      gradient.addColorStop(0, '#4A90E2');
      gradient.addColorStop(0.5, '#357ABD');
      gradient.addColorStop(1, '#1E5A8E');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      // Draw globe lines (latitude/longitude)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;

      // Latitude lines
      for (let i = -60; i <= 60; i += 30) {
        ctx.beginPath();
        const latRadius = radius * Math.cos((i * Math.PI) / 180);
        const yPos = centerY - radius * Math.sin((i * Math.PI) / 180);
        ctx.ellipse(centerX, yPos, latRadius, latRadius * 0.3, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Longitude lines
      for (let i = 0; i < 12; i++) {
        const angle = (i * 30 + rotationAngle) * Math.PI / 180;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, radius * Math.sin(angle + Math.PI / 2), radius, angle, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw location markers
      locations.forEach((loc, index) => {
        const angle = (loc.lng + rotationAngle) * Math.PI / 180;
        const latAngle = loc.lat * Math.PI / 180;
        
        // 3D projection
        const x = centerX + radius * Math.cos(latAngle) * Math.sin(angle);
        const y = centerY - radius * Math.sin(latAngle);
        const z = radius * Math.cos(latAngle) * Math.cos(angle);

        // Only draw visible points (front of globe)
        if (z > 0) {
          const size = 6 + (z / radius) * 4; // Size based on depth
          const opacity = 0.5 + (z / radius) * 0.5;

          // Marker
          ctx.fillStyle = selectedTrip === loc.tripId 
            ? `rgba(255, 215, 0, ${opacity})`
            : `rgba(255, 99, 132, ${opacity})`;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();

          // Glow effect
          ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.5})`;
          ctx.lineWidth = 2;
          ctx.stroke();

          // Label
          if (size > 8) {
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.font = '11px Arial';
            ctx.fillText(loc.city, x + 10, y + 4);
          }
        }
      });

      // Draw connections between consecutive stops
      trips.forEach(trip => {
        if (!trip.stops || trip.stops.length < 2) return;
        
        for (let i = 0; i < trip.stops.length - 1; i++) {
          const loc1 = locations.find(l => l.city === trip.stops[i].city);
          const loc2 = locations.find(l => l.city === trip.stops[i + 1].city);
          
          if (loc1 && loc2) {
            const angle1 = (loc1.lng + rotationAngle) * Math.PI / 180;
            const latAngle1 = loc1.lat * Math.PI / 180;
            const x1 = centerX + radius * Math.cos(latAngle1) * Math.sin(angle1);
            const y1 = centerY - radius * Math.sin(latAngle1);
            const z1 = radius * Math.cos(latAngle1) * Math.cos(angle1);

            const angle2 = (loc2.lng + rotationAngle) * Math.PI / 180;
            const latAngle2 = loc2.lat * Math.PI / 180;
            const x2 = centerX + radius * Math.cos(latAngle2) * Math.sin(angle2);
            const y2 = centerY - radius * Math.sin(latAngle2);
            const z2 = radius * Math.cos(latAngle2) * Math.cos(angle2);

            if (z1 > 0 && z2 > 0) {
              ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)';
              ctx.lineWidth = 2;
              ctx.setLineDash([5, 5]);
              ctx.beginPath();
              ctx.moveTo(x1, y1);
              ctx.lineTo(x2, y2);
              ctx.stroke();
              ctx.setLineDash([]);
            }
          }
        }
      });
    };

    const animate = () => {
      if (isAnimating) {
        setRotation(prev => (prev + 0.5) % 360);
      }
      drawGlobe(rotation);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [rotation, isAnimating, locations, trips, selectedTrip]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={600}
        height={600}
        className="w-full h-auto max-w-2xl mx-auto cursor-grab active:cursor-grabbing"
        onClick={() => setIsAnimating(!isAnimating)}
      />
      
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button
          onClick={() => setIsAnimating(!isAnimating)}
          className="p-2 bg-white/90 backdrop-blur rounded-lg shadow-lg hover:bg-white transition-colors"
          title={isAnimating ? 'Pause' : 'Play'}
        >
          {isAnimating ? '⏸️' : '▶️'}
        </button>
        <button
          onClick={() => setRotation(0)}
          className="p-2 bg-white/90 backdrop-blur rounded-lg shadow-lg hover:bg-white transition-colors"
          title="Reset"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-lg text-center">
          <Globe className="w-8 h-8 mx-auto mb-2 text-blue-600" />
          <p className="text-2xl font-bold text-gray-900">{locations.length}</p>
          <p className="text-sm text-gray-600">Destinations</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg text-center">
          <span className="text-3xl">🌍</span>
          <p className="text-2xl font-bold text-gray-900">{new Set(locations.map(l => l.country)).size}</p>
          <p className="text-sm text-gray-600">Countries</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg text-center">
          <span className="text-3xl">✈️</span>
          <p className="text-2xl font-bold text-gray-900">{trips.length}</p>
          <p className="text-sm text-gray-600">Total Trips</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-lg text-center">
          <span className="text-3xl">🗺️</span>
          <p className="text-2xl font-bold text-gray-900">
            {Math.round((locations.length / 195) * 100)}%
          </p>
          <p className="text-sm text-gray-600">World Explored</p>
        </div>
      </div>
    </div>
  );
};

export default Globe3D;
