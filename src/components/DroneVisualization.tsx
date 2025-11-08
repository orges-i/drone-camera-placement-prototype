import React from 'react';

interface DroneVisualizationProps {
  width: number;
  height: number;
  cameraAngle: number;
  payload: number;
  altitude: number;
  darkMode: boolean;
  coverageRadiusLabel: string;
  coverageAreaLabel: string;
}

export function DroneVisualization({
  width,
  height,
  cameraAngle,
  payload,
  altitude,
  darkMode,
  coverageRadiusLabel,
  coverageAreaLabel,
}: DroneVisualizationProps) {
  // Calculate coverage area based on camera angle and altitude
  const fovRadians = (cameraAngle * Math.PI) / 180;
  const coverageRadius = altitude * Math.tan(fovRadians / 2);
  const coverageArea = Math.PI * Math.pow(coverageRadius, 2);

  // SVG dimensions
  const svgWidth = 600;
  const svgHeight = 500;
  const scale = 2;

  // Drone position (center top)
  const droneX = svgWidth / 2;
  const droneY = 80;

  // Ground level
  const groundY = svgHeight - 50;

  // Camera FOV triangle
  const fovLeftX = droneX - (altitude * scale * Math.tan(fovRadians / 2));
  const fovRightX = droneX + (altitude * scale * Math.tan(fovRadians / 2));
  const fovBottomY = droneY + altitude * scale;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8">
      <svg
        width={svgWidth}
        height={svgHeight}
        className={`rounded-2xl ${
          darkMode 
            ? 'bg-gradient-to-b from-blue-500/10 to-blue-600/5' 
            : 'bg-gradient-to-b from-blue-50/50 to-white/50'
        }`}
        style={{
          filter: 'drop-shadow(0 4px 20px rgba(0, 122, 255, 0.1))'
        }}
      >
        {/* Ground */}
        <rect
          x="0"
          y={groundY}
          width={svgWidth}
          height="50"
          fill="url(#groundGradient)"
        />

        {/* Coverage area visualization */}
        <polygon
          points={`${droneX},${droneY} ${fovLeftX},${fovBottomY} ${fovRightX},${fovBottomY}`}
          fill="rgba(59, 130, 246, 0.2)"
          stroke="rgba(59, 130, 246, 0.6)"
          strokeWidth="2"
        />

        {/* Coverage cone lines */}
        <line
          x1={droneX}
          y1={droneY}
          x2={fovLeftX}
          y2={fovBottomY}
          stroke="rgba(59, 130, 246, 0.8)"
          strokeWidth="1"
          strokeDasharray="5,5"
        />
        <line
          x1={droneX}
          y1={droneY}
          x2={fovRightX}
          y2={fovBottomY}
          stroke="rgba(59, 130, 246, 0.8)"
          strokeWidth="1"
          strokeDasharray="5,5"
        />

        {/* Center line */}
        <line
          x1={droneX}
          y1={droneY}
          x2={droneX}
          y2={fovBottomY}
          stroke="rgba(59, 130, 246, 0.4)"
          strokeWidth="1"
        />

        {/* Drone body */}
        <g transform={`translate(${droneX}, ${droneY})`}>
          {/* Main body */}
          <rect
            x={-width / 4}
            y={-height / 4}
            width={width / 2}
            height={height / 2}
            fill="url(#droneGradient)"
            stroke="rgb(59, 130, 246)"
            strokeWidth="2"
            rx="4"
          />
          {/* Propellers */}
          <circle cx="-20" cy="-20" r="8" fill="rgba(59, 130, 246, 0.5)" />
          <circle cx="20" cy="-20" r="8" fill="rgba(59, 130, 246, 0.5)" />
          <circle cx="-20" cy="20" r="8" fill="rgba(59, 130, 246, 0.5)" />
          <circle cx="20" cy="20" r="8" fill="rgba(59, 130, 246, 0.5)" />
          {/* Camera indicator */}
          <circle cx="0" cy="0" r="4" fill="rgb(239, 68, 68)" />
        </g>

        {/* Coverage width indicators */}
        <line
          x1={fovLeftX}
          y1={fovBottomY + 10}
          x2={fovRightX}
          y2={fovBottomY + 10}
          stroke="rgba(59, 130, 246, 0.8)"
          strokeWidth="2"
        />
        <line
          x1={fovLeftX}
          y1={fovBottomY + 5}
          x2={fovLeftX}
          y2={fovBottomY + 15}
          stroke="rgba(59, 130, 246, 0.8)"
          strokeWidth="2"
        />
        <line
          x1={fovRightX}
          y1={fovBottomY + 5}
          x2={fovRightX}
          y2={fovBottomY + 15}
          stroke="rgba(59, 130, 246, 0.8)"
          strokeWidth="2"
        />

        {/* Gradients */}
        <defs>
          <linearGradient id="droneGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgb(59, 130, 246)" />
            <stop offset="100%" stopColor="rgb(37, 99, 235)" />
          </linearGradient>
          <linearGradient id="groundGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(34, 197, 94, 0.3)" />
            <stop offset="100%" stopColor="rgba(34, 197, 94, 0.1)" />
          </linearGradient>
        </defs>
      </svg>

      {/* Coverage stats */}
      <div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-md">
        <div className={`rounded-2xl p-5 ${
          darkMode 
            ? 'bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-400/20' 
            : 'bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200/50'
        }`} style={{ backdropFilter: 'blur(10px)' }}>
          <div className={`text-[10px] uppercase tracking-wider mb-2 ${
            darkMode ? 'text-blue-300/80' : 'text-blue-700/80'
          }`} style={{ fontWeight: 600, letterSpacing: '0.08em' }}>{coverageRadiusLabel}</div>
          <div className={`text-[26px] tabular-nums ${darkMode ? 'text-white' : 'text-black'}`} style={{ fontWeight: 600, letterSpacing: '-0.02em' }}>{coverageRadius.toFixed(2)} m</div>
        </div>
        <div className={`rounded-2xl p-5 ${
          darkMode 
            ? 'bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-400/20' 
            : 'bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200/50'
        }`} style={{ backdropFilter: 'blur(10px)' }}>
          <div className={`text-[10px] uppercase tracking-wider mb-2 ${
            darkMode ? 'text-blue-300/80' : 'text-blue-700/80'
          }`} style={{ fontWeight: 600, letterSpacing: '0.08em' }}>{coverageAreaLabel}</div>
          <div className={`text-[26px] tabular-nums ${darkMode ? 'text-white' : 'text-black'}`} style={{ fontWeight: 600, letterSpacing: '-0.02em' }}>{coverageArea.toFixed(2)} m²</div>
        </div>
      </div>
    </div>
  );
}
