/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  BookOpen, 
  Wrench, 
  Cpu, 
  Shield, 
  Zap, 
  Layers, 
  Cloud, 
  Code, 
  Activity, 
  Layout, 
  ChevronRight, 
  Search,
  MessageSquare,
  Send,
  X,
  Maximize2,
  ExternalLink,
  Github
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { ARCHITECTURE_PATTERNS, TOOLS, ArchitecturePattern, Tool } from './types';

// Initialize Gemini
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const IconMap: Record<string, any> = {
  Layers, Zap, Shield, Cloud, Code, Activity, Layout
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'handbook' | 'builder' | 'tester'>('handbook');
  const [selectedPattern, setSelectedPattern] = useState<ArchitecturePattern | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState<{role: 'user' | 'ai', content: string}[]>([
    { role: 'ai', content: 'System initialized. I am your Architecture Architect. Describe your project needs, and I will hack together a robust architecture for you.' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMsg = inputMessage;
    setInputMessage('');
    setAiMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    try {
      const model = genAI.models.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `You are a world-class software architect. The user wants to build: "${userMsg}". 
      Provide a high-level architecture design including:
      1. Recommended Pattern
      2. Key Components
      3. Technology Stack
      4. Potential Challenges
      Keep it concise and professional but with a "hacker" tone.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      setAiMessages(prev => [...prev, { role: 'ai', content: text }]);
    } catch (error) {
      console.error("AI Error:", error);
      setAiMessages(prev => [...prev, { role: 'ai', content: "Error: Connection to neural network interrupted. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const filteredPatterns = ARCHITECTURE_PATTERNS.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-hacker-bg text-gray-300 font-mono flex flex-col">
      {/* Header */}
      <header className="border-b border-hacker-border p-4 flex items-center justify-between bg-hacker-bg/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-hacker-green/10 rounded-lg border border-hacker-green/30">
            <Terminal className="text-hacker-green w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tighter uppercase">
              Arch<span className="text-hacker-green">Hacker</span> Handbook
            </h1>
            <div className="text-[10px] text-hacker-green/60 flex items-center gap-2">
              <span className="animate-pulse">●</span> SYSTEM_READY: v1.0.42
            </div>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-1 bg-hacker-card p-1 rounded-xl border border-hacker-border">
          <button 
            onClick={() => setActiveTab('handbook')}
            className={`px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${activeTab === 'handbook' ? 'bg-hacker-green text-hacker-bg font-bold' : 'hover:bg-white/5'}`}
          >
            <BookOpen size={16} /> Handbook
          </button>
          <button 
            onClick={() => setActiveTab('builder')}
            className={`px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${activeTab === 'builder' ? 'bg-hacker-green text-hacker-bg font-bold' : 'hover:bg-white/5'}`}
          >
            <Wrench size={16} /> Builder
          </button>
          <button 
            onClick={() => setActiveTab('tester')}
            className={`px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${activeTab === 'tester' ? 'bg-hacker-green text-hacker-bg font-bold' : 'hover:bg-white/5'}`}
          >
            <Activity size={16} /> Tester
          </button>
        </nav>

        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search patterns..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-hacker-card border border-hacker-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-hacker-green/50 transition-colors w-64"
            />
          </div>
          <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <Github size={20} />
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar - Patterns List */}
        <aside className="w-80 border-r border-hacker-border hidden lg:flex flex-col bg-hacker-bg">
          <div className="p-4 border-b border-hacker-border bg-hacker-card/30">
            <h2 className="text-xs font-bold text-hacker-green uppercase tracking-widest mb-1">Architecture Library</h2>
            <p className="text-[10px] text-gray-500">Select a blueprint to analyze</p>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredPatterns.map(pattern => {
              const Icon = IconMap[pattern.icon] || Layers;
              return (
                <button
                  key={pattern.id}
                  onClick={() => setSelectedPattern(pattern)}
                  className={`w-full text-left p-3 rounded-xl transition-all group relative overflow-hidden ${selectedPattern?.id === pattern.id ? 'bg-hacker-green/10 border border-hacker-green/30' : 'hover:bg-white/5 border border-transparent'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${selectedPattern?.id === pattern.id ? 'bg-hacker-green text-hacker-bg' : 'bg-hacker-card text-gray-400 group-hover:text-hacker-green'}`}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white group-hover:text-hacker-green transition-colors">{pattern.name}</div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-tighter">{pattern.category} • {pattern.complexity}</div>
                    </div>
                  </div>
                  {selectedPattern?.id === pattern.id && (
                    <motion.div 
                      layoutId="active-indicator"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-hacker-green"
                    >
                      <ChevronRight size={16} />
                    </motion.div>
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Content Area */}
        <section className="flex-1 overflow-y-auto p-6 bg-[radial-gradient(circle_at_top_right,rgba(0,255,65,0.03),transparent_40%)]">
          <AnimatePresence mode="wait">
            {activeTab === 'handbook' && (
              <motion.div
                key="handbook"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-4xl mx-auto space-y-8"
              >
                {!selectedPattern ? (
                  <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-hacker-green blur-3xl opacity-10 animate-pulse"></div>
                      <Cpu className="w-24 h-24 text-hacker-green mb-4 relative" />
                    </div>
                    <div>
                      <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">Welcome, Architect.</h2>
                      <p className="text-gray-500 max-w-md mx-auto">
                        The handbook contains the blueprints for the world's most robust systems. 
                        Select a pattern from the sidebar or use the AI Architect to build your own.
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => setIsAiOpen(true)}
                        className="bg-hacker-green text-hacker-bg px-8 py-3 rounded-xl font-bold uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-2"
                      >
                        <Zap size={18} /> Launch AI Architect
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="px-2 py-0.5 bg-hacker-green/10 text-hacker-green text-[10px] font-bold rounded border border-hacker-green/30 uppercase">
                            {selectedPattern.category}
                          </span>
                          <span className="px-2 py-0.5 bg-white/5 text-gray-400 text-[10px] font-bold rounded border border-white/10 uppercase">
                            {selectedPattern.complexity}
                          </span>
                        </div>
                        <h2 className="text-5xl font-black text-white uppercase tracking-tighter mb-4">{selectedPattern.name}</h2>
                        <p className="text-xl text-gray-400 leading-relaxed max-w-2xl">
                          {selectedPattern.description}
                        </p>
                      </div>
                      <div className="p-6 bg-hacker-card rounded-2xl border border-hacker-border hacker-border-glow">
                        {React.createElement(IconMap[selectedPattern.icon] || Layers, { className: "w-16 h-16 text-hacker-green" })}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-6 bg-hacker-card rounded-2xl border border-hacker-border space-y-4">
                        <h3 className="text-hacker-green font-bold uppercase text-xs tracking-widest flex items-center gap-2">
                          <Shield size={14} /> Core Principles
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                          <li className="flex items-center gap-2"><div className="w-1 h-1 bg-hacker-green rounded-full"></div> High Cohesion</li>
                          <li className="flex items-center gap-2"><div className="w-1 h-1 bg-hacker-green rounded-full"></div> Low Coupling</li>
                          <li className="flex items-center gap-2"><div className="w-1 h-1 bg-hacker-green rounded-full"></div> Horizontal Scaling</li>
                        </ul>
                      </div>
                      <div className="p-6 bg-hacker-card rounded-2xl border border-hacker-border space-y-4">
                        <h3 className="text-hacker-green font-bold uppercase text-xs tracking-widest flex items-center gap-2">
                          <Zap size={14} /> Use Cases
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                          <li className="flex items-center gap-2"><div className="w-1 h-1 bg-hacker-green rounded-full"></div> High Traffic Apps</li>
                          <li className="flex items-center gap-2"><div className="w-1 h-1 bg-hacker-green rounded-full"></div> Distributed Teams</li>
                          <li className="flex items-center gap-2"><div className="w-1 h-1 bg-hacker-green rounded-full"></div> Rapid Deployment</li>
                        </ul>
                      </div>
                      <div className="p-6 bg-hacker-card rounded-2xl border border-hacker-border space-y-4">
                        <h3 className="text-hacker-green font-bold uppercase text-xs tracking-widest flex items-center gap-2">
                          <Code size={14} /> Tech Stack
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedPattern.tags.map(tag => (
                            <span key={tag} className="px-2 py-1 bg-white/5 rounded text-[10px] text-gray-400 border border-white/10">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="p-8 bg-hacker-card rounded-3xl border border-hacker-border relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Layout size={120} />
                      </div>
                      <div className="relative z-10">
                        <h3 className="text-2xl font-bold text-white mb-4">Architecture Visualization</h3>
                        <div className="aspect-video bg-hacker-bg rounded-xl border border-hacker-border flex items-center justify-center">
                          <div className="text-center space-y-4">
                            <div className="flex items-center justify-center gap-8">
                              <div className="w-20 h-20 border-2 border-dashed border-hacker-green/30 rounded-lg flex items-center justify-center text-hacker-green/50">Client</div>
                              <div className="w-8 h-0.5 bg-hacker-green/30"></div>
                              <div className="w-24 h-24 border-2 border-hacker-green rounded-xl flex items-center justify-center text-hacker-green font-bold">API Gateway</div>
                              <div className="w-8 h-0.5 bg-hacker-green/30"></div>
                              <div className="space-y-2">
                                <div className="w-16 h-8 border border-hacker-green/50 rounded flex items-center justify-center text-[10px]">Service A</div>
                                <div className="w-16 h-8 border border-hacker-green/50 rounded flex items-center justify-center text-[10px]">Service B</div>
                                <div className="w-16 h-8 border border-hacker-green/50 rounded flex items-center justify-center text-[10px]">Service C</div>
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 font-mono italic">// auto-generated system diagram</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'builder' && (
              <motion.div
                key="builder"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="max-w-5xl mx-auto"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Tool Builder</h2>
                      <p className="text-gray-500">Construct custom developer tools and boilerplate generators.</p>
                    </div>
                    
                    <div className="space-y-4">
                      {TOOLS.map(tool => (
                        <button 
                          key={tool.id}
                          className="w-full p-6 bg-hacker-card border border-hacker-border rounded-2xl text-left hover:border-hacker-green/50 transition-all group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-hacker-bg rounded-xl text-gray-400 group-hover:text-hacker-green transition-colors">
                              {React.createElement(IconMap[tool.icon] || Code, { size: 24 })}
                            </div>
                            <div>
                              <h4 className="font-bold text-white group-hover:text-hacker-green transition-colors">{tool.name}</h4>
                              <p className="text-xs text-gray-500">{tool.description}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-hacker-card rounded-3xl border border-hacker-border p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                      </div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-widest">Terminal Output</div>
                    </div>
                    <div className="flex-1 bg-hacker-bg rounded-xl p-4 font-mono text-xs text-hacker-green overflow-y-auto space-y-2">
                      <p className="opacity-50 tracking-tighter">Initializing builder engine...</p>
                      <p className="opacity-50 tracking-tighter">Loading templates [####################] 100%</p>
                      <p className="text-white">Ready for input.</p>
                      <div className="flex items-center gap-2">
                        <span>$</span>
                        <span className="terminal-cursor"></span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'tester' && (
              <motion.div
                key="tester"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-4xl mx-auto text-center space-y-12 py-12"
              >
                <div className="space-y-4">
                  <div className="inline-flex p-4 bg-hacker-green/10 rounded-full border border-hacker-green/20 mb-4">
                    <Activity className="w-12 h-12 text-hacker-green animate-pulse" />
                  </div>
                  <h2 className="text-4xl font-black text-white uppercase tracking-tighter">System Stress Tester</h2>
                  <p className="text-gray-500 max-w-lg mx-auto">
                    Simulate real-world traffic, latency, and failure scenarios on your architectural designs.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Latency', value: '24ms', color: 'text-hacker-green' },
                    { label: 'Throughput', value: '12.4k/s', color: 'text-blue-400' },
                    { label: 'Error Rate', value: '0.02%', color: 'text-yellow-400' },
                    { label: 'Uptime', value: '99.99%', color: 'text-purple-400' }
                  ].map(stat => (
                    <div key={stat.label} className="p-6 bg-hacker-card rounded-2xl border border-hacker-border">
                      <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">{stat.label}</div>
                      <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
                    </div>
                  ))}
                </div>

                <div className="p-12 bg-hacker-card rounded-3xl border border-hacker-border border-dashed">
                  <p className="text-gray-500 italic mb-6">Upload your system configuration or connect a live endpoint to start testing.</p>
                  <button className="px-8 py-3 border border-hacker-border rounded-xl hover:bg-white/5 transition-colors uppercase text-xs font-bold tracking-widest">
                    Connect Endpoint
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      {/* AI Assistant Floating Panel */}
      <AnimatePresence>
        {isAiOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-6 right-6 w-96 h-[500px] bg-hacker-card border border-hacker-border rounded-3xl shadow-2xl flex flex-col z-[100] overflow-hidden"
          >
            <div className="p-4 border-b border-hacker-border flex items-center justify-between bg-hacker-bg/50">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-hacker-green rounded-full animate-pulse"></div>
                <span className="text-xs font-bold text-white uppercase tracking-widest">AI Architect</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-1 hover:bg-white/10 rounded transition-colors text-gray-500"><Maximize2 size={14} /></button>
                <button 
                  onClick={() => setIsAiOpen(false)}
                  className="p-1 hover:bg-white/10 rounded transition-colors text-gray-500"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
              {aiMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${msg.role === 'user' ? 'bg-hacker-green text-hacker-bg font-bold' : 'bg-hacker-bg border border-hacker-border text-gray-300'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-hacker-bg border border-hacker-border p-3 rounded-2xl flex gap-1">
                    <div className="w-1 h-1 bg-hacker-green rounded-full animate-bounce"></div>
                    <div className="w-1 h-1 bg-hacker-green rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1 h-1 bg-hacker-green rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-4 border-t border-hacker-border bg-hacker-bg/50">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                className="relative"
              >
                <input 
                  type="text" 
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask the architect..."
                  className="w-full bg-hacker-card border border-hacker-border rounded-xl pl-4 pr-10 py-3 text-xs focus:outline-none focus:border-hacker-green/50 transition-colors"
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-hacker-green hover:bg-hacker-green/10 rounded-lg transition-colors"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      {!isAiOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsAiOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-hacker-green text-hacker-bg rounded-full shadow-lg flex items-center justify-center z-50 hacker-glow"
        >
          <MessageSquare size={24} />
        </motion.button>
      )}

      {/* Footer Status Bar */}
      <footer className="border-t border-hacker-border p-2 px-4 flex items-center justify-between text-[10px] text-gray-500 bg-hacker-bg">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <span className="text-hacker-green">CPU:</span> 12%
          </div>
          <div className="flex items-center gap-1">
            <span className="text-hacker-green">MEM:</span> 2.4GB
          </div>
          <div className="flex items-center gap-1">
            <span className="text-hacker-green">NET:</span> 128kbps
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-hacker-green animate-pulse"></span>
            CONNECTED_TO_GRID
          </div>
          <div className="uppercase tracking-widest">
            UTC: {new Date().toISOString().split('T')[1].split('.')[0]}
          </div>
        </div>
      </footer>
    </div>
  );
}
