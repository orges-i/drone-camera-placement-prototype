import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { MessageCircle, X, Send } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface DroneChatbotProps {
  translations: any;
  language: string;
  darkMode: boolean;
}

export function DroneChatbot({ translations, language, darkMode }: DroneChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const knowledgeBase = {
    sq: {
      greeting: 'Përshëndetje! Unë jam asistenti i AeroSpectra X1. Si mund t\'ju ndihmoj sot?',
      cameraAngle: 'Këndi i kamerës përcakton sa shumë zonë mbulon droni. Një kënd më i gjerë (p.sh. 90°) mbulon një zonë më të madhe, por me më pak detaje. Një kënd më i ngushtë (p.sh. 45°) jep më shumë detaje por mbulon një zonë më të vogël.',
      payload: 'Ngarkesa maksimale e AeroSpectra X1 është 5kg. Ngarkesa më e rëndë redukton kohën e fluturimit dhe shpejtësinë, por mund të mbajë pajisje më të sofistikuara.',
      altitude: 'Lartësia optimale varet nga misioni juaj. Lartësi më e lartë jep mbulim më të gjerë por detaje më pak të qarta. Për inspektime të detajuara, përdorni 20-50m. Për hartografi, 100-200m është ideale.',
      environment: 'Urban: Kërkojnë kontroll të kujdesshëm dhe lartësi më të ulëta. Mal: Mbështetni erërat e forta dhe terrenet e vështira. Fushë e hapur: Ideale për testime dhe mbulim të gjerë.',
      specs: 'AeroSpectra X1 ka kohë fluturimi 45 min, shpejtësi maksimale 72 km/h, distancë 15 km, lartësi 500m, ngarkesë 5kg, dhe kamerë 4K UHD.',
      default: 'Më falni, nuk e kuptova plotësisht. Mund të pyes rreth: këndit të kamerës, ngarkesës, lartësisë, mjediseve, ose specifikave të dronit.',
    },
    en: {
      greeting: 'Hello! I\'m the AeroSpectra X1 assistant. How can I help you today?',
      cameraAngle: 'Camera angle determines how much area the drone covers. A wider angle (e.g., 90°) covers more area but with less detail. A narrower angle (e.g., 45°) provides more detail but covers less area.',
      payload: 'The maximum payload of AeroSpectra X1 is 5kg. Heavier payloads reduce flight time and speed, but can carry more sophisticated equipment.',
      altitude: 'Optimal altitude depends on your mission. Higher altitude gives wider coverage but less clear details. For detailed inspections, use 20-50m. For mapping, 100-200m is ideal.',
      environment: 'Urban: Requires careful control and lower altitudes. Mountain: Account for strong winds and difficult terrain. Open field: Ideal for testing and wide coverage.',
      specs: 'AeroSpectra X1 has 45 min flight time, 72 km/h max speed, 15 km range, 500m altitude, 5kg payload, and 4K UHD camera.',
      default: 'Sorry, I didn\'t fully understand. You can ask about: camera angle, payload, altitude, environments, or drone specs.',
    },
  };

  useEffect(() => {
    if (messages.length === 0 && isOpen) {
      addBotMessage(knowledgeBase[language as keyof typeof knowledgeBase].greeting);
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const addBotMessage = (text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text,
        sender: 'bot',
        timestamp: new Date(),
      },
    ]);
  };

  const getBotResponse = (userMessage: string): string => {
    const kb = knowledgeBase[language as keyof typeof knowledgeBase];
    const msg = userMessage.toLowerCase();

    if (msg.includes('kamera') || msg.includes('camera') || msg.includes('kënd') || msg.includes('angle') || msg.includes('fov')) {
      return kb.cameraAngle;
    } else if (msg.includes('ngarkesë') || msg.includes('payload') || msg.includes('weight') || msg.includes('peshë')) {
      return kb.payload;
    } else if (msg.includes('lartësi') || msg.includes('altitude') || msg.includes('height') || msg.includes('alt')) {
      return kb.altitude;
    } else if (msg.includes('mjedis') || msg.includes('environment') || msg.includes('urban') || msg.includes('mal') || msg.includes('mountain') || msg.includes('fushë') || msg.includes('field')) {
      return kb.environment;
    } else if (msg.includes('spec') || msg.includes('info') || msg.includes('informacion') || msg.includes('detail')) {
      return kb.specs;
    } else if (msg.includes('përshëndetje') || msg.includes('hello') || msg.includes('hi') || msg.includes('help') || msg.includes('ndihmë')) {
      return kb.greeting;
    }
    return kb.default;
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    // Simulate bot thinking
    setTimeout(() => {
      const botResponse = getBotResponse(inputValue);
      addBotMessage(botResponse);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 right-8 h-16 w-16 rounded-full bg-blue-600 hover:bg-blue-700 shadow-2xl hover:shadow-blue-500/30 hover:scale-110 transition-all duration-300 z-50"
          size="icon"
          style={{ backdropFilter: 'blur(10px)' }}
        >
          <MessageCircle className="h-7 w-7" strokeWidth={2} />
        </Button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className={`fixed bottom-8 right-8 w-[420px] h-[600px] rounded-2xl glass shadow-2xl flex flex-col z-50 overflow-hidden ${
          darkMode 
            ? 'border-white/10' 
            : 'border-black/8'
        }`} style={{ backdropFilter: 'blur(40px)' }}>
          {/* Header */}
          <div className={`p-6 flex items-center justify-between ${
            darkMode 
              ? 'bg-gradient-to-r from-blue-600/40 to-blue-700/40 border-b border-white/10' 
              : 'bg-gradient-to-r from-blue-600/20 to-blue-700/20 border-b border-black/8'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                darkMode ? 'bg-blue-500/20' : 'bg-blue-500/10'
              }`}>
                <MessageCircle className="h-5 w-5 text-blue-500" strokeWidth={2} />
              </div>
              <div>
                <div className={`text-[15px] ${darkMode ? 'text-white' : 'text-black'}`} style={{ fontWeight: 600 }}>{translations.chatbotTitle}</div>
                <div className={`text-[12px] ${darkMode ? 'text-white/50' : 'text-black/50'}`} style={{ fontWeight: 400 }}>{translations.chatbotSubtitle}</div>
              </div>
            </div>
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="icon"
              className={`h-9 w-9 rounded-full ${darkMode ? 'hover:bg-white/10' : 'hover:bg-black/10'}`}
            >
              <X className="h-4 w-4" strokeWidth={2} />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-6" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 transition-all duration-200 ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                        : darkMode
                          ? 'bg-white/5 border border-white/10 text-white'
                          : 'bg-black/5 border border-black/10 text-black'
                    }`}
                  >
                    <div className="text-[14px] leading-relaxed" style={{ fontWeight: 400 }}>{message.text}</div>
                    <div
                      className={`text-[11px] mt-2 ${
                        message.sender === 'user' 
                          ? 'text-blue-200/60' 
                          : darkMode 
                            ? 'text-white/40' 
                            : 'text-black/40'
                      }`}
                      style={{ fontWeight: 400 }}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className={`p-5 border-t ${
            darkMode 
              ? 'border-white/10' 
              : 'border-black/8'
          }`}>
            <div className="flex gap-2.5">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={translations.chatPlaceholder}
                className={`flex-1 rounded-xl ${
                  darkMode 
                    ? 'bg-white/5 border-white/10 focus:border-blue-400/50' 
                    : 'bg-black/5 border-black/10 focus:border-blue-500/50'
                }`}
                style={{ fontWeight: 400 }}
              />
              <Button 
                onClick={handleSendMessage} 
                size="icon" 
                className="bg-blue-600 hover:bg-blue-700 shrink-0 h-11 w-11 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-200"
              >
                <Send className="h-4 w-4" strokeWidth={2} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

