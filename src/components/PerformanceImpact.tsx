import React from 'react';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Clock, Zap, Radio, Battery, AlertTriangle } from 'lucide-react';

interface PerformanceImpactProps {
  payload: number;
  translations: any;
  darkMode: boolean;
}

export function PerformanceImpact({ payload, translations, darkMode }: PerformanceImpactProps) {
  // Base specifications for AeroSpectra X1
  const baseSpecs = {
    flightTime: 45, // minutes
    maxSpeed: 72, // km/h
    maxRange: 15, // km
    maxPayload: 5, // kg
  };

  // Calculate performance impact based on payload
  const payloadRatio = payload / baseSpecs.maxPayload;
  
  // Performance degradation formulas (realistic drone physics)
  const currentFlightTime = baseSpecs.flightTime * (1 - payloadRatio * 0.35);
  const currentSpeed = baseSpecs.maxSpeed * (1 - payloadRatio * 0.22);
  const currentRange = baseSpecs.maxRange * (1 - payloadRatio * 0.28);
  const batteryConsumption = 100 + (payloadRatio * 45); // % increase
  
  // Calculate percentages for progress bars
  const flightTimePercent = (currentFlightTime / baseSpecs.flightTime) * 100;
  const speedPercent = (currentSpeed / baseSpecs.maxSpeed) * 100;
  const rangePercent = (currentRange / baseSpecs.maxRange) * 100;

  // Performance level indicators
  const getPerformanceLevel = (percent: number) => {
    if (percent >= 85) return { label: translations.optimal, color: 'text-green-500' };
    if (percent >= 70) return { label: translations.good, color: 'text-blue-500' };
    if (percent >= 50) return { label: translations.reduced, color: 'text-yellow-500' };
    return { label: translations.critical, color: 'text-red-500' };
  };

  const metrics = [
    {
      icon: Clock,
      label: translations.flightTime,
      current: currentFlightTime.toFixed(1),
      base: baseSpecs.flightTime,
      unit: 'min',
      percent: flightTimePercent,
      impact: baseSpecs.flightTime - currentFlightTime,
    },
    {
      icon: Zap,
      label: translations.maxSpeed,
      current: currentSpeed.toFixed(1),
      base: baseSpecs.maxSpeed,
      unit: 'km/h',
      percent: speedPercent,
      impact: baseSpecs.maxSpeed - currentSpeed,
    },
    {
      icon: Radio,
      label: translations.maxRange,
      current: currentRange.toFixed(1),
      base: baseSpecs.maxRange,
      unit: 'km',
      percent: rangePercent,
      impact: baseSpecs.maxRange - currentRange,
    },
  ];

  return (
    <div className="space-y-5">
      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const level = getPerformanceLevel(metric.percent);
          
          return (
            <Card
              key={index}
              className={`p-6 glass shadow-lg transition-all duration-300 hover:scale-[1.02] ${
                darkMode
                  ? 'border-white/10'
                  : 'border-black/8'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <Icon
                  className={`h-5 w-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}
                  strokeWidth={2}
                />
                <span className={`text-[11px] px-2.5 py-1 rounded-full ${level.color}`} style={{ 
                  fontWeight: 600,
                  background: level.color.includes('green') ? 'rgba(52, 199, 89, 0.15)' :
                             level.color.includes('blue') ? 'rgba(0, 122, 255, 0.15)' :
                             level.color.includes('yellow') ? 'rgba(255, 149, 0, 0.15)' :
                             'rgba(255, 59, 48, 0.15)'
                }}>{level.label}</span>
              </div>
              
              <div className={`text-[10px] uppercase tracking-wider mb-2.5 ${
                darkMode ? 'text-white/50' : 'text-black/50'
              }`} style={{ fontWeight: 600, letterSpacing: '0.08em' }}>
                {metric.label}
              </div>
              
              <div className="flex items-baseline gap-2 mb-4">
                <span className={`text-[28px] tabular-nums ${darkMode ? 'text-white' : 'text-black'}`} style={{ fontWeight: 600, letterSpacing: '-0.02em' }}>{metric.current}</span>
                <span className={`text-[13px] ${darkMode ? 'text-white/40' : 'text-black/40'}`} style={{ fontWeight: 400 }}>
                  / {metric.base} {metric.unit}
                </span>
              </div>
              
              <Progress
                value={metric.percent}
                className={`h-2 ${
                  metric.percent >= 85 ? 'bg-green-500/20' :
                  metric.percent >= 70 ? 'bg-blue-500/20' :
                  metric.percent >= 50 ? 'bg-yellow-500/20' : 'bg-red-500/20'
                }`}
              />
              
              <div className={`text-[11px] mt-2.5 ${darkMode ? 'text-white/40' : 'text-black/40'}`} style={{ fontWeight: 400 }}>
                {metric.impact > 0 ? '-' : '+'}{Math.abs(metric.impact).toFixed(1)} {metric.unit} {translations.fromBase}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Battery Impact */}
      <Card
        className={`p-6 glass shadow-lg ${
          darkMode
            ? 'border-white/10'
            : 'border-black/8'
        }`}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <Battery className={`h-5 w-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} strokeWidth={2} />
            <div>
              <div className={`text-[15px] ${darkMode ? 'text-white' : 'text-black'}`} style={{ fontWeight: 600 }}>
                {translations.batteryConsumption}
              </div>
              <div className={`text-[12px] ${darkMode ? 'text-white/50' : 'text-black/50'}`} style={{ fontWeight: 400 }}>
                {translations.comparedToNoLoad}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-[32px] tabular-nums ${
              batteryConsumption > 130 ? 'text-red-500' :
              batteryConsumption > 115 ? 'text-yellow-500' : 'text-green-500'
            }`} style={{ fontWeight: 600, letterSpacing: '-0.02em' }}>
              {batteryConsumption.toFixed(0)}%
            </div>
            <div className={`text-[11px] ${darkMode ? 'text-white/40' : 'text-black/40'}`} style={{ fontWeight: 400 }}>
              +{(batteryConsumption - 100).toFixed(0)}% {translations.increase}
            </div>
          </div>
        </div>
        
        <Progress
          value={Math.min(batteryConsumption, 145)}
          className="h-2.5"
        />
      </Card>

      {/* Recommendations */}
      {payloadRatio > 0.7 && (
        <Card
          className={`p-5 glass shadow-lg ${
            darkMode
              ? 'bg-yellow-500/10 border-yellow-500/30'
              : 'bg-yellow-50 border-yellow-300'
          }`}
        >
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" strokeWidth={2} />
            <div>
              <div className={`text-[14px] mb-1.5 ${darkMode ? 'text-yellow-200' : 'text-yellow-900'}`} style={{ fontWeight: 600 }}>
                {translations.highPayloadWarning}
              </div>
              <div className={`text-[12px] ${darkMode ? 'text-yellow-300/80' : 'text-yellow-800'}`} style={{ fontWeight: 400 }}>
                {translations.highPayloadAdvice}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

