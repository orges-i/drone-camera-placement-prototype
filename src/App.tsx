import React, { useState, useEffect } from 'react';
import { Card } from './components/ui/card';
import { Slider } from './components/ui/slider';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Button } from './components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Switch } from './components/ui/switch';
import { DroneVisualization } from './components/DroneVisualization';
import { DroneSpecs } from './components/DroneSpecs';
import { EnvironmentSimulator } from './components/EnvironmentSimulator';
import { DroneChatbot } from './components/DroneChatbot';
import { PerformanceImpact } from './components/PerformanceImpact';
import { BlindSpotAnalyzer } from './components/BlindSpotAnalyzer';
import { translations } from './lib/translations';
import { Moon, Sun, Globe, Save, FolderOpen } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog';
import { toast } from 'sonner@2.0.3';
import { Toaster } from './components/ui/sonner';

interface Preset {
  id: string;
  name: string;
  width: number;
  height: number;
  payload: number;
  cameraAngle: number;
  altitude: number;
  environment: string;
}

export default function App() {
  // State
  const [language, setLanguage] = useState<'sq' | 'en'>('sq');
  const [darkMode, setDarkMode] = useState(true);
  const [droneWidth, setDroneWidth] = useState(80);
  const [droneHeight, setDroneHeight] = useState(30);
  const [payload, setPayload] = useState(2);
  const [cameraAngle, setCameraAngle] = useState(60);
  const [altitude, setAltitude] = useState(50);
  const [selectedEnvironment, setSelectedEnvironment] = useState('openfield');
  const [presets, setPresets] = useState<Preset[]>([]);
  const [presetName, setPresetName] = useState('');
  const [isPresetDialogOpen, setIsPresetDialogOpen] = useState(false);

  const t = translations[language];

  // Load presets from localStorage
  useEffect(() => {
    const savedPresets = localStorage.getItem('dronePresets');
    if (savedPresets) {
      setPresets(JSON.parse(savedPresets));
    }
  }, []);

  // Save presets to localStorage
  useEffect(() => {
    if (presets.length > 0) {
      localStorage.setItem('dronePresets', JSON.stringify(presets));
    }
  }, [presets]);

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleSavePreset = () => {
    if (!presetName.trim()) {
      toast.error(language === 'sq' ? 'Ju lutem shkruani një emër' : 'Please enter a name');
      return;
    }

    const newPreset: Preset = {
      id: Date.now().toString(),
      name: presetName,
      width: droneWidth,
      height: droneHeight,
      payload,
      cameraAngle,
      altitude,
      environment: selectedEnvironment,
    };

    setPresets([...presets, newPreset]);
    setPresetName('');
    setIsPresetDialogOpen(false);
    toast.success(language === 'sq' ? 'Konfigurimi u ruajt' : 'Configuration saved');
  };

  const handleLoadPreset = (preset: Preset) => {
    setDroneWidth(preset.width);
    setDroneHeight(preset.height);
    setPayload(preset.payload);
    setCameraAngle(preset.cameraAngle);
    setAltitude(preset.altitude);
    setSelectedEnvironment(preset.environment);
    toast.success(language === 'sq' ? 'Konfigurimi u ngarkua' : 'Configuration loaded');
  };

  const handleDeletePreset = (id: string) => {
    setPresets(presets.filter((p) => p.id !== id));
    toast.success(language === 'sq' ? 'Konfigurimi u fshi' : 'Configuration deleted');
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${darkMode ? 'bg-black text-white' : 'bg-[#f5f5f7] text-gray-900'}`}>
      <Toaster />
      
      {/* Header */}
      <header className={`glass border-b sticky top-0 z-50 ${darkMode ? 'border-white/10' : 'border-black/8'}`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-4xl tracking-tight ${darkMode ? 'text-white' : 'text-black'}`} style={{ fontWeight: 700, letterSpacing: '-0.03em' }}>
                {t.brand}
              </h1>
              <p className={`text-[15px] mt-1 ${darkMode ? 'text-white/60' : 'text-black/60'}`} style={{ fontWeight: 400 }}>{t.subtitle}</p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Language Selector */}
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full glass-subtle ${darkMode ? 'hover:bg-white/5' : 'hover:bg-black/5'} transition-all duration-200`}>
                <Globe className={`h-4 w-4 ${darkMode ? 'text-white/60' : 'text-black/60'}`} strokeWidth={2} />
                <Select value={language} onValueChange={(val) => setLanguage(val as 'sq' | 'en')}>
                  <SelectTrigger className={`w-24 border-none bg-transparent shadow-none h-auto p-0 text-[14px] font-medium`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass">
                    <SelectItem value="sq">{t.albanian}</SelectItem>
                    <SelectItem value="en">{t.english}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Dark Mode Toggle */}
              <div className={`flex items-center gap-2.5 px-3 py-1.5 rounded-full glass-subtle ${darkMode ? 'hover:bg-white/5' : 'hover:bg-black/5'} transition-all duration-200`}>
                <Sun className={`h-4 w-4 ${darkMode ? 'text-white/40' : 'text-yellow-500'}`} strokeWidth={2} />
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                <Moon className={`h-4 w-4 ${darkMode ? 'text-blue-400' : 'text-black/40'}`} strokeWidth={2} />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-1 space-y-5">
            <Card className={`p-6 glass shadow-lg ${darkMode ? 'border-white/10' : 'border-black/8'}`}>
              <h2 className={`text-[11px] uppercase tracking-wider mb-6 ${
                darkMode ? 'text-blue-400' : 'text-blue-600'
              }`} style={{ fontWeight: 600, letterSpacing: '0.08em' }}>{t.controls}</h2>
              
              <div className="space-y-4">
                {/* Drone Dimensions */}
                <div className={`p-4 rounded-2xl ${
                  darkMode ? 'bg-white/5 border border-white/10' : 'bg-black/3 border border-black/5'
                }`}>
                  <div className={`text-[11px] uppercase tracking-wider mb-4 ${
                    darkMode ? 'text-white/50' : 'text-black/50'
                  }`} style={{ fontWeight: 600, letterSpacing: '0.08em' }}>{t.dimensions}</div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <Label className={`text-[13px] ${darkMode ? 'text-white/70' : 'text-black/70'}`} style={{ fontWeight: 500 }}>{t.droneWidth}</Label>
                        <span className={`text-[15px] tabular-nums ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} style={{ fontWeight: 600 }}>{droneWidth} {t.cm}</span>
                      </div>
                      <Slider
                        value={[droneWidth]}
                        onValueChange={(val) => setDroneWidth(val[0])}
                        min={40}
                        max={150}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <Label className={`text-[13px] ${darkMode ? 'text-white/70' : 'text-black/70'}`} style={{ fontWeight: 500 }}>{t.droneHeight}</Label>
                        <span className={`text-[15px] tabular-nums ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} style={{ fontWeight: 600 }}>{droneHeight} {t.cm}</span>
                      </div>
                      <Slider
                        value={[droneHeight]}
                        onValueChange={(val) => setDroneHeight(val[0])}
                        min={15}
                        max={60}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Camera Settings */}
                <div className={`p-4 rounded-2xl ${
                  darkMode ? 'bg-white/5 border border-white/10' : 'bg-black/3 border border-black/5'
                }`}>
                  <div className={`text-[11px] uppercase tracking-wider mb-4 ${
                    darkMode ? 'text-white/50' : 'text-black/50'
                  }`} style={{ fontWeight: 600, letterSpacing: '0.08em' }}>{t.cameraSettings}</div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <Label className={`text-[13px] ${darkMode ? 'text-white/70' : 'text-black/70'}`} style={{ fontWeight: 500 }}>{t.cameraAngle}</Label>
                        <span className={`text-[15px] tabular-nums ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} style={{ fontWeight: 600 }}>{cameraAngle}{t.degrees}</span>
                      </div>
                      <Slider
                        value={[cameraAngle]}
                        onValueChange={(val) => setCameraAngle(val[0])}
                        min={30}
                        max={120}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <Label className={`text-[13px] ${darkMode ? 'text-white/70' : 'text-black/70'}`} style={{ fontWeight: 500 }}>{t.altitude}</Label>
                        <span className={`text-[15px] tabular-nums ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} style={{ fontWeight: 600 }}>{altitude} {t.meters}</span>
                      </div>
                      <Slider
                        value={[altitude]}
                        onValueChange={(val) => setAltitude(val[0])}
                        min={10}
                        max={200}
                        step={5}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Payload */}
                <div className={`p-4 rounded-2xl ${
                  darkMode ? 'bg-white/5 border border-white/10' : 'bg-black/3 border border-black/5'
                }`}>
                  <div className={`text-[11px] uppercase tracking-wider mb-4 ${
                    darkMode ? 'text-white/50' : 'text-black/50'
                  }`} style={{ fontWeight: 600, letterSpacing: '0.08em' }}>{t.payload}</div>
                  
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <Label className={`text-[13px] ${darkMode ? 'text-white/70' : 'text-black/70'}`} style={{ fontWeight: 500 }}>{t.weight}</Label>
                      <span className={`text-[15px] tabular-nums ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} style={{ fontWeight: 600 }}>{payload} {t.kg}</span>
                    </div>
                    <Slider
                      value={[payload]}
                      onValueChange={(val) => setPayload(val[0])}
                      min={0}
                      max={5}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Presets */}
            <Card className={`p-6 glass shadow-lg ${darkMode ? 'border-white/10' : 'border-black/8'}`}>
              <div className="flex items-center justify-between mb-5">
                <h2 className={`text-[11px] uppercase tracking-wider ${
                  darkMode ? 'text-blue-400' : 'text-blue-600'
                }`} style={{ fontWeight: 600, letterSpacing: '0.08em' }}>{t.presets}</h2>
                <Dialog open={isPresetDialogOpen} onOpenChange={setIsPresetDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline" className={`gap-2 rounded-full ${darkMode ? 'border-white/10 hover:bg-white/5' : 'border-black/10 hover:bg-black/5'}`}>
                      <Save className="h-3.5 w-3.5" strokeWidth={2} />
                      <span className="text-[12px]" style={{ fontWeight: 500 }}>{t.savePreset}</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent aria-describedby={undefined} className="glass">
                    <DialogHeader>
                      <DialogTitle style={{ fontWeight: 600 }}>{t.savePreset}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label style={{ fontWeight: 500 }}>{t.presetName}</Label>
                        <Input
                          value={presetName}
                          onChange={(e) => setPresetName(e.target.value)}
                          placeholder={t.presetName}
                          className="rounded-xl"
                        />
                      </div>
                      <Button onClick={handleSavePreset} className="w-full rounded-xl" style={{ fontWeight: 500 }}>
                        {t.savePreset}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-2">
                {presets.length === 0 ? (
                  <p className={`text-[13px] text-center py-6 ${
                    darkMode ? 'text-white/40' : 'text-black/40'
                  }`} style={{ fontWeight: 400 }}>{t.noPresets}</p>
                ) : (
                  presets.map((preset) => (
                    <div
                      key={preset.id}
                      className={`flex items-center justify-between p-3.5 rounded-xl transition-all duration-200 ${
                        darkMode ? 'bg-white/5 hover:bg-white/10 border border-white/10' : 'bg-black/3 hover:bg-black/5 border border-black/5'
                      }`}
                    >
                      <span className="text-[14px]" style={{ fontWeight: 500 }}>{preset.name}</span>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleLoadPreset(preset)}
                          className={`h-8 w-8 p-0 rounded-lg ${darkMode ? 'hover:bg-white/10' : 'hover:bg-black/10'}`}
                        >
                          <FolderOpen className="h-3.5 w-3.5" strokeWidth={2} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeletePreset(preset.id)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-lg"
                        >
                          <span className="text-lg leading-none">×</span>
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Right Panel - Tabbed Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className={`grid w-full grid-cols-4 mb-5 glass p-1 h-auto ${
                darkMode ? 'bg-white/5' : 'bg-black/5'
              }`}>
                <TabsTrigger value="overview" className="rounded-lg py-2.5 text-[13px] data-[state=active]:shadow-sm" style={{ fontWeight: 500 }}>{t.overview}</TabsTrigger>
                <TabsTrigger value="performance" className="rounded-lg py-2.5 text-[13px] data-[state=active]:shadow-sm" style={{ fontWeight: 500 }}>{t.performance}</TabsTrigger>
                <TabsTrigger value="coverage" className="rounded-lg py-2.5 text-[13px] data-[state=active]:shadow-sm" style={{ fontWeight: 500 }}>{t.coverage}</TabsTrigger>
                <TabsTrigger value="environment" className="rounded-lg py-2.5 text-[13px] data-[state=active]:shadow-sm" style={{ fontWeight: 500 }}>{t.environment}</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-5 mt-0">
                <Card className={`glass shadow-lg ${darkMode ? 'border-white/10' : 'border-black/8'}`}>
                  <DroneVisualization
                    width={droneWidth}
                    height={droneHeight}
                    cameraAngle={cameraAngle}
                    payload={payload}
                    altitude={altitude}
                    darkMode={darkMode}
                    coverageRadiusLabel={t.coverageRadius}
                    coverageAreaLabel={t.coverageArea}
                  />
                </Card>

                <div>
                  <h2 className={`text-[11px] uppercase tracking-wider mb-5 ${
                    darkMode ? 'text-blue-400' : 'text-blue-600'
                  }`} style={{ fontWeight: 600, letterSpacing: '0.08em' }}>{t.specs}</h2>
                  <DroneSpecs translations={t} darkMode={darkMode} />
                </div>
              </TabsContent>

              {/* Performance Tab */}
              <TabsContent value="performance" className="space-y-5 mt-0">
                <PerformanceImpact
                  payload={payload}
                  translations={t}
                  darkMode={darkMode}
                />
              </TabsContent>

              {/* Coverage Tab */}
              <TabsContent value="coverage" className="space-y-5 mt-0">
                <BlindSpotAnalyzer
                  cameraAngle={cameraAngle}
                  altitude={altitude}
                  translations={t}
                  darkMode={darkMode}
                />
              </TabsContent>

              {/* Environment Tab */}
              <TabsContent value="environment" className="space-y-5 mt-0">
                <EnvironmentSimulator
                  translations={t}
                  selectedEnvironment={selectedEnvironment}
                  onSelectEnvironment={setSelectedEnvironment}
                  darkMode={darkMode}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`glass border-t mt-12 ${darkMode ? 'border-white/10' : 'border-black/8'}`}>
        <div className="container mx-auto px-6 py-6 text-center">
          <p className={`text-[13px] ${darkMode ? 'text-white/40' : 'text-black/40'}`} style={{ fontWeight: 400 }}>
            © 2025 AeroSpectra. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Chatbot */}
      <DroneChatbot translations={t} language={language} darkMode={darkMode} />
    </div>
  );
}
