import React from 'react';
import { Card } from './ui/card';
import { Building2, Mountain, Trees } from 'lucide-react';

interface EnvironmentSimulatorProps {
  translations: any;
  selectedEnvironment: string;
  onSelectEnvironment: (env: string) => void;
  darkMode: boolean;
}

export function EnvironmentSimulator({
  translations,
  selectedEnvironment,
  onSelectEnvironment,
  darkMode,
}: EnvironmentSimulatorProps) {
  const environments = [
    {
      id: 'urban',
      name: translations.urban,
      icon: Building2,
      description: translations.urbanDesc,
      effects: translations.urbanEffects,
    },
    {
      id: 'mountain',
      name: translations.mountain,
      icon: Mountain,
      description: translations.mountainDesc,
      effects: translations.mountainEffects,
    },
    {
      id: 'openfield',
      name: translations.openField,
      icon: Trees,
      description: translations.openFieldDesc,
      effects: translations.openFieldEffects,
    },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {environments.map((env) => {
          const Icon = env.icon;
          return (
            <Card
              key={env.id}
              className={`p-6 cursor-pointer transition-all duration-300 glass shadow-lg hover:scale-[1.02] ${
                selectedEnvironment === env.id
                  ? darkMode
                    ? 'bg-blue-500/20 border-blue-400/50 ring-2 ring-blue-400/30'
                    : 'bg-blue-100/80 border-blue-500/50 ring-2 ring-blue-500/30'
                  : darkMode
                    ? 'border-white/10 hover:border-blue-400/30'
                    : 'border-black/8 hover:border-blue-500/30'
              }`}
              onClick={() => onSelectEnvironment(env.id)}
            >
              <Icon className={`h-8 w-8 mb-4 ${
                darkMode ? 'text-blue-400' : 'text-blue-600'
              }`} strokeWidth={2} />
              <div className={`text-[18px] mb-2 ${darkMode ? 'text-white' : 'text-black'}`} style={{ fontWeight: 600, letterSpacing: '-0.01em' }}>{env.name}</div>
              <div className={`text-[13px] leading-relaxed ${
                darkMode ? 'text-white/60' : 'text-black/60'
              }`} style={{ fontWeight: 400 }}>{env.description}</div>
            </Card>
          );
        })}
      </div>

      {/* Selected environment details */}
      {selectedEnvironment && (
        <Card className={`p-6 glass shadow-lg ${
          darkMode 
            ? 'border-blue-400/30 bg-blue-500/10' 
            : 'border-blue-500/30 bg-blue-50/80'
        }`}>
          <div className={`uppercase tracking-wider text-[11px] mb-3 ${
            darkMode ? 'text-blue-300' : 'text-blue-700'
          }`} style={{ fontWeight: 600, letterSpacing: '0.08em' }}>{translations.environmentEffects}</div>
          <div className={`text-[14px] leading-relaxed ${
            darkMode ? 'text-white/80' : 'text-black/80'
          }`} style={{ fontWeight: 400 }}>
            {environments.find((e) => e.id === selectedEnvironment)?.effects}
          </div>
        </Card>
      )}
    </div>
  );
}
