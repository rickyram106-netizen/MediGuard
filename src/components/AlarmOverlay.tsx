import React, { useState, useEffect, useCallback } from 'react';
import { Medicine } from '../types';
import { Button } from './ui/Button';
import { motion, AnimatePresence } from 'motion/react';
import { Pill, Check, Clock, X } from 'lucide-react';

interface Props {
  medicine: Medicine | null;
  onTake: () => void;
  onSnooze: () => void;
  onDismiss: () => void;
}

export const AlarmOverlay = ({ medicine, onTake, onSnooze, onDismiss }: Props) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!medicine) {
      setElapsed(0);
      return;
    }
    const interval = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [medicine]);

  const formatElapsed = useCallback((seconds: number) => {
    const hh = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const mm = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const ss = String(seconds % 60).padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  }, []);

  if (!medicine) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-teal-dark/95 z-50 flex flex-col items-center justify-center gap-4 p-8"
      >
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1.2, times: [0, 0.5, 1] }}
          className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center text-4xl shadow-xl"
        >
          <Pill size={44} className="text-white" />
        </motion.div>
        
        <div className="text-center">
          <h2 className="text-white text-[length:var(--f2x)] font-extrabold mb-1">{medicine.name}</h2>
          <p className="text-white/80 text-[length:var(--fsm)]">You haven't marked this dose as taken!</p>
        </div>

        <div className="bg-white/10 rounded-2xl p-4 w-full text-center">
          <p className="text-white/60 text-[12px] mb-1">Time elapsed since reminder</p>
          <div className="text-white text-3xl font-black">{formatElapsed(elapsed)}</div>
        </div>

        <div className="w-full flex flex-col gap-3 mt-4">
          <Button 
            className="bg-white text-teal-dark active:bg-white/90" 
            onClick={onTake}
          >
            <Check size={16} /> Mark as Taken
          </Button>
          <Button 
            variant="outline" 
            className="border-white/50 text-white" 
            onClick={onSnooze}
          >
            <Clock size={16} /> Snooze 10 min
          </Button>
          <button 
            className="bg-none border-none text-white/60 text-xs py-2 cursor-pointer hover:text-white/80 transition-colors"
            onClick={onDismiss}
          >
            <X size={16} className="inline mr-1" />
            Dismiss (log as missed)
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
