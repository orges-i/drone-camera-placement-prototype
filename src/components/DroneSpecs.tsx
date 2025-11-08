import React from 'react';
import { Card } from './ui/card';
import { Clock, Zap, Radio, ArrowUp, Package, Camera } from 'lucide-react';

interface DroneSpecsProps {
  translations: any;
  darkMode: boolean;
}

export function DroneSpecs({ translations, darkMode }: DroneSpecsProps) {
  const specs = [
    { label: translations.flightTime, value: '45 min', icon: Clock },
    { label: translations.maxSpeed, value: '72 km/h', icon: Zap },
    { label: translations.maxRange, value: '15 km', icon: Radio },
    { label: translations.maxAltitude, value: '500 m', icon: ArrowUp },
    { label: translations.maxPayload, value: '5 kg', icon: Package },
    { label: translations.cameraRes, value: '4K UHD', icon: Camera },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {specs.map((spec, index) => {
        const Icon = spec.icon;
        return (
          <Card
            key={index}
            className={`p-5 glass transition-all duration-300 hover:scale-[1.02] ${
              darkMode 
                ? 'border-white/10 hover:border-blue-400/30' 
                : 'border-black/8 hover:border-blue-500/30'
            }`}
            style={{ 
              background: darkMode 
                ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%)' 
                : 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(255, 255, 255, 0.5) 100%)'
            }}
          >
            <Icon className={`h-5 w-5 mb-3.5 ${
              darkMode ? 'text-blue-400' : 'text-blue-600'
            }`} strokeWidth={2} />
            <div className={`text-[10px] uppercase tracking-wider mb-1.5 ${
              darkMode ? 'text-blue-300/70' : 'text-blue-700/70'
            }`} style={{ fontWeight: 600, letterSpacing: '0.08em' }}>{spec.label}</div>
            <div className={`text-[22px] tabular-nums ${darkMode ? 'text-white' : 'text-black'}`} style={{ fontWeight: 600, letterSpacing: '-0.01em' }}>{spec.value}</div>
          </Card>
        );
      })}
    </div>
  );
}
