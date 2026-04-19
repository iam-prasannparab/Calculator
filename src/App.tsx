/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback, useEffect, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calculator, History, Moon, Sun, Trash2, Delete, Percent, Divide, X, Minus, Plus, Equal, Terminal, BookOpen } from 'lucide-react';

type Operation = '+' | '-' | '*' | '/' | null;

export default function App() {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<Operation>(null);
  const [isNewNumber, setIsNewNumber] = useState(true);
  const [history, setHistory] = useState<{ expression: string; result: string }[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isDark, setIsDark] = useState(false); // Default to false to match "Clean Minimalism" light bg

  const calculate = useCallback((first: number, second: number, op: Operation): number => {
    switch (op) {
      case '+': return first + second;
      case '-': return first - second;
      case '*': return first * second;
      case '/': return second !== 0 ? first / second : NaN;
      default: return second;
    }
  }, []);

  const handleDigit = useCallback((digit: string) => {
    if (isNewNumber) {
      setDisplay(digit === '.' ? '0.' : digit);
      setIsNewNumber(false);
    } else {
      if (digit === '.' && display.includes('.')) return;
      setDisplay(prev => prev === '0' && digit !== '.' ? digit : prev + digit);
    }
  }, [display, isNewNumber]);

  const handleOperator = useCallback((nextOp: Operation) => {
    const current = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(current);
    } else if (operation) {
      const result = calculate(prevValue, current, operation);
      setPrevValue(result);
      setDisplay(String(result));
    }

    setOperation(nextOp);
    setIsNewNumber(true);
  }, [display, operation, prevValue, calculate]);

  const handleEqual = useCallback(() => {
    if (operation === null || prevValue === null) return;

    const current = parseFloat(display);
    const result = calculate(prevValue, current, operation);
    
    setHistory(prev => [
      { expression: `${prevValue} ${operation} ${current} =`, result: String(result) },
      ...prev.slice(0, 9)
    ]);

    setDisplay(String(result));
    setPrevValue(null);
    setOperation(null);
    setIsNewNumber(true);
  }, [display, operation, prevValue, calculate]);

  const handleClear = useCallback(() => {
    setDisplay('0');
    setPrevValue(null);
    setOperation(null);
    setIsNewNumber(true);
  }, []);

  const handlePercent = useCallback(() => {
    setDisplay(String(parseFloat(display) / 100));
  }, [display]);

  const handleToggleSign = useCallback(() => {
    setDisplay(String(parseFloat(display) * -1));
  }, [display]);

  const handleBackspace = useCallback(() => {
    if (display.length > 1) {
      setDisplay(prev => prev.slice(0, -1));
    } else {
      setDisplay('0');
      setIsNewNumber(true);
    }
  }, [display]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') handleDigit(e.key);
      if (e.key === '.') handleDigit('.');
      if (e.key === '+') handleOperator('+');
      if (e.key === '-') handleOperator('-');
      if (e.key === '*') handleOperator('*');
      if (e.key === '/') handleOperator('/');
      if (e.key === 'Enter' || e.key === '=') handleEqual();
      if (e.key === 'Escape') handleClear();
      if (e.key === 'Backspace') handleBackspace();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDigit, handleOperator, handleEqual, handleClear, handleBackspace]);

  const Button = ({ 
    children, 
    onClick, 
    className = "", 
    variant = "default" 
  }: { 
    children: ReactNode; 
    onClick: () => void; 
    className?: string;
    variant?: "default" | "operator" | "action" | "accent"
  }) => {
    const variants = {
      default: "bg-slate-800 text-white hover:bg-slate-700",
      operator: "bg-orange-500 text-white hover:bg-orange-400 text-2xl font-light",
      action: "bg-slate-700 text-white hover:bg-slate-600",
      accent: "bg-orange-500 text-white hover:bg-orange-400 text-2xl font-light"
    };

    return (
      <motion.button
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        onClick={onClick}
        className={`h-14 w-14 rounded-full flex items-center justify-center text-xl font-medium transition-colors ${variants[variant]} ${className}`}
      >
        {children}
      </motion.button>
    );
  };

  return (
    <div className={`min-h-screen w-full flex items-center justify-center p-8 transition-colors duration-500 overflow-hidden ${isDark ? 'bg-zinc-950 text-white' : 'bg-[#F4F4F7] text-slate-800'}`}>
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Side: README Preview */}
        <div className={`hidden lg:flex col-span-7 rounded-2xl shadow-sm border p-10 h-[640px] flex-col overflow-hidden transition-all duration-500 ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`}>
          <div className={`flex items-center gap-2 mb-8 border-b pb-4 ${isDark ? 'border-zinc-800' : 'border-slate-100'}`}>
            <div className={`w-3 h-3 rounded-full ${isDark ? 'bg-zinc-700' : 'bg-slate-300'}`}></div>
            <div className={`w-3 h-3 rounded-full ${isDark ? 'bg-zinc-700' : 'bg-slate-300'}`}></div>
            <div className={`w-3 h-3 rounded-full ${isDark ? 'bg-zinc-700' : 'bg-slate-300'}`}></div>
            <span className={`ml-4 text-xs font-mono uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>README.md</span>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-4">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className={`w-6 h-6 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`} />
              <h1 className="text-3xl font-bold tracking-tight">Arithmos v1.0</h1>
            </div>
            <p className={`text-lg mb-8 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
              A lightweight, high-performance calculator built with modern web technologies.
            </p>
            
            <h3 className={`text-xs font-semibold uppercase tracking-widest mb-3 ${isDark ? 'text-zinc-600' : 'text-slate-400'}`}>Project Setup</h3>
            <div className={`rounded-xl p-6 font-mono text-xs mb-8 leading-relaxed border ${isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-400' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
              1. Clone the repository<br/>
              2. Run <span className="text-orange-500">npm install</span><br/>
              3. Execute <span className="text-orange-500">npm run dev</span>
            </div>

            <h3 className={`text-xs font-semibold uppercase tracking-widest mb-4 ${isDark ? 'text-zinc-600' : 'text-slate-400'}`}>Core Capabilities</h3>
            <ul className={`space-y-3 text-sm mb-8 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                Floating point precision arithmetic
              </li>
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                Native keyboard support for rapid input
              </li>
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                Real-time history logging
              </li>
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                Adaptive themes (Dark/Light)
              </li>
            </ul>
          </div>

          <div className={`pt-6 border-t ${isDark ? 'border-zinc-800' : 'border-slate-100'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-orange-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-orange-600">PA</div>
                  <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-blue-600">AI</div>
                </div>
                <span className={`text-xs italic ${isDark ? 'text-zinc-600' : 'text-slate-400'}`}>Maintained by developer community</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsDark(!isDark)}
                  className={`p-2 rounded-xl transition-colors ${isDark ? 'bg-zinc-800 text-yellow-400 hover:bg-zinc-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Calculator Interface */}
        <div className="col-span-1 lg:col-span-5 flex flex-col items-center justify-center">
          <div className="w-[340px] bg-slate-900 rounded-[3rem] p-8 shadow-2xl border-8 border-slate-800 relative ring-1 ring-white/10">
            
            {/* Controls Row (Top) */}
            <div className="absolute top-8 left-8 right-8 flex items-center justify-between z-20">
              <div className="flex items-center gap-2 opacity-30 text-white">
                <Terminal className="w-4 h-4" />
                <span className="text-[10px] font-mono uppercase tracking-[0.2em]">Live.calc</span>
              </div>
              <button 
                onClick={() => setShowHistory(!showHistory)}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-colors"
              >
                <History className="w-4 h-4" />
              </button>
            </div>

            {/* Screen */}
            <div className="h-40 flex flex-col justify-end items-end px-4 mb-8">
              <AnimatePresence mode="wait">
                {operation && prevValue !== null && (
                  <motion.span 
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 0.4, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-slate-400 text-sm mb-1 font-mono tracking-wider"
                  >
                    {prevValue} {operation}
                  </motion.span>
                )}
              </AnimatePresence>
              <div className="w-full text-right overflow-hidden">
                <motion.span 
                  key={display}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-white text-6xl font-light tracking-tighter block truncate"
                >
                  {display}
                </motion.span>
              </div>
            </div>

            {/* History Panel Overlay */}
            <AnimatePresence>
              {showHistory && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute inset-0 z-10 bg-slate-900/98 backdrop-blur-md rounded-[2.5rem] p-8 pt-20"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-white text-lg font-medium">History</h3>
                    <button 
                      onClick={() => setHistory([])}
                      className="text-white/40 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-3 max-h-[360px] overflow-y-auto pr-2 custom-scrollbar">
                    {history.length === 0 ? (
                      <div className="text-center py-20 text-white/20 text-sm italic">Clean slate</div>
                    ) : (
                      history.map((item, i) => (
                        <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5">
                          <div className="text-[10px] text-white/30 font-mono mb-1">{item.expression}</div>
                          <div className="text-white font-medium">{item.result}</div>
                        </div>
                      ))
                    )}
                  </div>
                  <button 
                    onClick={() => setShowHistory(false)}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] text-white/40 hover:text-white uppercase tracking-[0.3em]"
                  >
                    Close
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Grid */}
            <div className="grid grid-cols-4 gap-4">
              <Button variant="action" onClick={handleClear}>AC</Button>
              <Button variant="action" onClick={handleToggleSign}>±</Button>
              <Button variant="action" onClick={handlePercent}><Percent className="w-5 h-5" /></Button>
              <Button variant="operator" onClick={() => handleOperator('/')}>÷</Button>

              <Button onClick={() => handleDigit('7')}>7</Button>
              <Button onClick={() => handleDigit('8')}>8</Button>
              <Button onClick={() => handleDigit('9')}>9</Button>
              <Button variant="operator" onClick={() => handleOperator('*')}>×</Button>

              <Button onClick={() => handleDigit('4')}>4</Button>
              <Button onClick={() => handleDigit('5')}>5</Button>
              <Button onClick={() => handleDigit('6')}>6</Button>
              <Button variant="operator" onClick={() => handleOperator('-')}>−</Button>

              <Button onClick={() => handleDigit('1')}>1</Button>
              <Button onClick={() => handleDigit('2')}>2</Button>
              <Button onClick={() => handleDigit('3')}>3</Button>
              <Button variant="operator" onClick={() => handleOperator('+')}>+</Button>

              <Button className="col-span-2 w-full text-left px-8" onClick={() => handleDigit('0')}>0</Button>
              <Button onClick={() => handleDigit('.')}>.</Button>
              <Button variant="accent" onClick={handleEqual}>=</Button>
            </div>
          </div>
          <p className="mt-8 text-slate-400 text-[10px] font-bold tracking-[0.4em] uppercase opacity-50">Active Session</p>
        </div>

      </div>
    </div>
  );
}
