import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Label } from './ui/label';
import { AlertCircle, Eye, EyeOff, Layers } from 'lucide-react';

interface BlindSpotAnalyzerProps {
  cameraAngle: number;
  altitude: number;
  translations: any;
  darkMode: boolean;
}

export function BlindSpotAnalyzer({
  cameraAngle,
  altitude,
  translations,
  darkMode,
}: BlindSpotAnalyzerProps) {
  const [showBlindSpots, setShowBlindSpots] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [comparisonAltitude, setComparisonAltitude] = useState(100);

  // Calculate coverage metrics
  const fovRadians = (cameraAngle * Math.PI) / 180;
  const coverageRadius = altitude * Math.tan(fovRadians / 2);
  const coverageArea = Math.PI * Math.pow(coverageRadius, 2);
  const coverageDiameter = coverageRadius * 2;

  // Calculate for comparison altitude
  const compCoverageRadius = comparisonAltitude * Math.tan(fovRadians / 2);
  const compCoverageArea = Math.PI * Math.pow(compCoverageRadius, 2);

  // Calculate optimal camera angle for different use cases
  const optimalAngles = {
    inspection: { angle: 45, reason: translations.inspectionReason },
    mapping: { angle: 75, reason: translations.mappingReason },
    surveillance: { angle: 60, reason: translations.surveillanceReason },
    photography: { angle: 50, reason: translations.photographyReason },
  };

  // Determine coverage quality
  const getCoverageQuality = () => {
    const pixelDensity = 4000 / coverageArea; // Assuming 4K camera
    if (pixelDensity > 2) return { level: translations.excellent, color: 'text-green-500', percent: 95 };
    if (pixelDensity > 1) return { level: translations.good, color: 'text-blue-500', percent: 80 };
    if (pixelDensity > 0.5) return { level: translations.moderate, color: 'text-yellow-500', percent: 60 };
    return { level: translations.poor, color: 'text-red-500', percent: 40 };
  };

  const quality = getCoverageQuality();

  return (
    <div className="space-y-5">
      {/* Blind Spot Visualization */}
      <Card
        className={`p-6 glass shadow-lg ${
          darkMode
            ? 'border-white/10'
            : 'border-black/8'
        }`}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className={`text-[11px] uppercase tracking-wider ${
            darkMode ? 'text-blue-400' : 'text-blue-600'
          }`} style={{ fontWeight: 600, letterSpacing: '0.08em' }}>
            {translations.coverageAnalysis}
          </h3>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={showBlindSpots ? 'default' : 'outline'}
              onClick={() => setShowBlindSpots(!showBlindSpots)}
              className={`text-[12px] rounded-full ${darkMode ? 'border-white/10' : 'border-black/10'}`}
              style={{ fontWeight: 500 }}
            >
              <EyeOff className="h-3.5 w-3.5 mr-1.5" strokeWidth={2} />
              {translations.blindSpots}
            </Button>
            <Button
              size="sm"
              variant={showGrid ? 'default' : 'outline'}
              onClick={() => setShowGrid(!showGrid)}
              className={`text-[12px] rounded-full ${darkMode ? 'border-white/10' : 'border-black/10'}`}
              style={{ fontWeight: 500 }}
            >
              <Layers className="h-3.5 w-3.5 mr-1.5" strokeWidth={2} />
              {translations.grid}
            </Button>
          </div>
        </div>

        {/* Visualization Canvas */}
        <div className="relative">
          <svg
            viewBox="0 0 400 300"
            className={`w-full rounded-2xl ${
              darkMode 
                ? 'bg-gradient-to-b from-blue-500/10 to-blue-600/5' 
                : 'bg-gradient-to-b from-blue-50/50 to-white/50'
            }`}
            style={{ filter: 'drop-shadow(0 4px 20px rgba(0, 122, 255, 0.1))' }}
          >
            {/* Grid */}
            {showGrid && (
              <g opacity="0.2">
                {[...Array(20)].map((_, i) => (
                  <React.Fragment key={i}>
                    <line
                      x1={i * 20}
                      y1="0"
                      x2={i * 20}
                      y2="300"
                      stroke={darkMode ? '#60A5FA' : '#3B82F6'}
                      strokeWidth="0.5"
                    />
                    <line
                      x1="0"
                      y1={i * 15}
                      x2="400"
                      y2={i * 15}
                      stroke={darkMode ? '#60A5FA' : '#3B82F6'}
                      strokeWidth="0.5"
                    />
                  </React.Fragment>
                ))}
              </g>
            )}

            {/* Coverage area (top-down view) */}
            <circle
              cx="200"
              cy="150"
              r={Math.min(coverageRadius * 0.8, 140)}
              fill="rgba(59, 130, 246, 0.2)"
              stroke="rgba(59, 130, 246, 0.6)"
              strokeWidth="2"
            />

            {/* Drone position */}
            <circle cx="200" cy="150" r="5" fill="#EF4444" />
            <text
              x="200"
              y="135"
              textAnchor="middle"
              className={`text-xs ${darkMode ? 'fill-gray-400' : 'fill-gray-600'}`}
            >
              {translations.drone}
            </text>

            {/* Blind spots (areas outside coverage) */}
            {showBlindSpots && (
              <>
                <rect
                  x="0"
                  y="0"
                  width="400"
                  height="300"
                  fill="rgba(239, 68, 68, 0.1)"
                  mask="url(#coverageMask)"
                />
                <defs>
                  <mask id="coverageMask">
                    <rect x="0" y="0" width="400" height="300" fill="white" />
                    <circle
                      cx="200"
                      cy="150"
                      r={Math.min(coverageRadius * 0.8, 140)}
                      fill="black"
                    />
                  </mask>
                </defs>
              </>
            )}

            {/* Coverage radius indicator */}
            <line
              x1="200"
              y1="150"
              x2={200 + Math.min(coverageRadius * 0.8, 140)}
              y2="150"
              stroke="rgba(59, 130, 246, 0.8)"
              strokeWidth="1"
              strokeDasharray="5,5"
            />
            <text
              x={200 + Math.min(coverageRadius * 0.8, 140) / 2}
              y="145"
              textAnchor="middle"
              className={`text-xs ${darkMode ? 'fill-blue-400' : 'fill-blue-600'}`}
            >
              {coverageRadius.toFixed(1)}m
            </text>
          </svg>
        </div>
      </Card>

      {/* Coverage Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className={`p-5 glass shadow-lg transition-all duration-300 hover:scale-[1.02] ${
          darkMode 
            ? 'border-white/10' 
            : 'border-black/8'
        }`}>
          <div className={`text-[10px] uppercase tracking-wider mb-2 ${
            darkMode ? 'text-white/50' : 'text-black/50'
          }`} style={{ fontWeight: 600, letterSpacing: '0.08em' }}>
            {translations.diameter}
          </div>
          <div className={`text-[24px] tabular-nums ${darkMode ? 'text-white' : 'text-black'}`} style={{ fontWeight: 600, letterSpacing: '-0.01em' }}>{coverageDiameter.toFixed(1)} m</div>
        </Card>

        <Card className={`p-5 glass shadow-lg transition-all duration-300 hover:scale-[1.02] ${
          darkMode 
            ? 'border-white/10' 
            : 'border-black/8'
        }`}>
          <div className={`text-[10px] uppercase tracking-wider mb-2 ${
            darkMode ? 'text-white/50' : 'text-black/50'
          }`} style={{ fontWeight: 600, letterSpacing: '0.08em' }}>
            {translations.coverageArea}
          </div>
          <div className={`text-[24px] tabular-nums ${darkMode ? 'text-white' : 'text-black'}`} style={{ fontWeight: 600, letterSpacing: '-0.01em' }}>{coverageArea.toFixed(1)} m²</div>
        </Card>

        <Card className={`p-5 glass shadow-lg transition-all duration-300 hover:scale-[1.02] ${
          darkMode 
            ? 'border-white/10' 
            : 'border-black/8'
        }`}>
          <div className={`text-[10px] uppercase tracking-wider mb-2 ${
            darkMode ? 'text-white/50' : 'text-black/50'
          }`} style={{ fontWeight: 600, letterSpacing: '0.08em' }}>
            {translations.imageQuality}
          </div>
          <div className={`text-[24px] ${quality.color}`} style={{ fontWeight: 600, letterSpacing: '-0.01em' }}>{quality.level}</div>
        </Card>

        <Card className={`p-5 glass shadow-lg transition-all duration-300 hover:scale-[1.02] ${
          darkMode 
            ? 'border-white/10' 
            : 'border-black/8'
        }`}>
          <div className={`text-[10px] uppercase tracking-wider mb-2 ${
            darkMode ? 'text-white/50' : 'text-black/50'
          }`} style={{ fontWeight: 600, letterSpacing: '0.08em' }}>
            {translations.coverage}
          </div>
          <div className={`text-[24px] tabular-nums ${quality.color}`} style={{ fontWeight: 600, letterSpacing: '-0.01em' }}>{quality.percent}%</div>
        </Card>
      </div>

      {/* Altitude Comparison */}
      <Card className={`p-6 glass shadow-lg ${
        darkMode
          ? 'border-white/10'
          : 'border-black/8'
      }`}>
        <div className={`text-[11px] uppercase tracking-wider mb-5 ${
          darkMode ? 'text-blue-400' : 'text-blue-600'
        }`} style={{ fontWeight: 600, letterSpacing: '0.08em' }}>
          {translations.altitudeComparison}
        </div>
        
        <div className="space-y-3 mb-5">
          <div className="flex items-center justify-between">
            <Label className={`text-[13px] ${darkMode ? 'text-white/70' : 'text-black/70'}`} style={{ fontWeight: 500 }}>{translations.compareAt}</Label>
            <span className={`text-[15px] tabular-nums ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} style={{ fontWeight: 600 }}>
              {comparisonAltitude}m
            </span>
          </div>
          <Slider
            value={[comparisonAltitude]}
            onValueChange={(val) => setComparisonAltitude(val[0])}
            min={10}
            max={200}
            step={5}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className={`text-[11px] mb-1.5 ${darkMode ? 'text-white/50' : 'text-black/50'}`} style={{ fontWeight: 400 }}>
              {translations.current} ({altitude}m)
            </div>
            <div className={`text-[22px] tabular-nums ${darkMode ? 'text-white' : 'text-black'}`} style={{ fontWeight: 600, letterSpacing: '-0.01em' }}>{coverageArea.toFixed(1)} m²</div>
          </div>
          <div>
            <div className={`text-[11px] mb-1.5 ${darkMode ? 'text-white/50' : 'text-black/50'}`} style={{ fontWeight: 400 }}>
              {translations.comparison} ({comparisonAltitude}m)
            </div>
            <div className={`text-[22px] tabular-nums ${darkMode ? 'text-white' : 'text-black'}`} style={{ fontWeight: 600, letterSpacing: '-0.01em' }}>{compCoverageArea.toFixed(1)} m²</div>
          </div>
        </div>
        
        <div className={`mt-4 text-[12px] ${darkMode ? 'text-white/40' : 'text-black/40'}`} style={{ fontWeight: 400 }}>
          {compCoverageArea > coverageArea ? '▲' : '▼'}{' '}
          {Math.abs(((compCoverageArea - coverageArea) / coverageArea) * 100).toFixed(1)}% {translations.difference}
        </div>
      </Card>

      {/* Optimal Angle Recommendations */}
      <Card className={`p-6 glass shadow-lg ${
        darkMode
          ? 'border-white/10'
          : 'border-black/8'
      }`}>
        <div className={`text-[11px] uppercase tracking-wider mb-5 ${
          darkMode ? 'text-blue-400' : 'text-blue-600'
        }`} style={{ fontWeight: 600, letterSpacing: '0.08em' }}>
          {translations.optimalAngles}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(optimalAngles).map(([key, value]) => (
            <div
              key={key}
              className={`p-4 rounded-xl transition-all duration-200 ${
                darkMode 
                  ? 'bg-white/5 hover:bg-white/10 border border-white/10' 
                  : 'bg-black/3 hover:bg-black/5 border border-black/5'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-[14px] capitalize ${
                  darkMode ? 'text-white' : 'text-black'
                }`} style={{ fontWeight: 600 }}>
                  {translations[key]}
                </span>
                <span className={`text-[14px] tabular-nums ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} style={{ fontWeight: 600 }}>
                  {value.angle}°
                </span>
              </div>
              <div className={`text-[12px] ${darkMode ? 'text-white/50' : 'text-black/50'}`} style={{ fontWeight: 400 }}>
                {value.reason}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
