import React from 'react';
import { Medicine } from '../types';
import { Button } from './ui/Button';
import { formatTime } from '../utils/dateUtils';
import { Pill, Check, Clock } from 'lucide-react';
import { cn } from '../utils/helpers';

interface Props {
  medicine: Medicine;
  onTake: (id: string, name: string) => void;
  onSnooze: (id: string) => void;
}

const COLORS = ['bg-[#EAF3DE]', 'bg-[#FAEEDA]', 'bg-[#E1F5EE]', 'bg-[#FEE2E2]'];

/**
 * Get a consistent color for a medicine based on its ID
 * Uses simple hash to ensure same medicine always gets same color
 */
const getMedicineColor = (medicineId: string): string => {
  let hash = 0;
  for (let i = 0; i < medicineId.length; i++) {
    hash = ((hash << 5) - hash) + medicineId.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  const index = Math.abs(hash) % COLORS.length;
  return COLORS[index];
};

export const MedicineCard = ({ medicine, onTake, onSnooze }: Props) => {
  const isTaken = medicine.takenToday;
  const cardColor = getMedicineColor(medicine.id);
  
  return (
    <div className="bg-[color:var(--card)] rounded-2xl mx-4 mb-3 border border-[color:var(--border)] overflow-hidden">
      <div className="p-4 flex items-center gap-3">
        <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center text-xl", cardColor)}>
          <Pill className="text-teal" size={20} />
        </div>
        <div className="flex-1">
          <div className="text-[length:var(--fmd)] font-bold text-[color:var(--text)]">{medicine.name}</div>
          <div className="text-[length:var(--fxs)] text-[color:var(--muted)] mt-0.5">
            <Clock size={12} className="inline mr-1" />
            {(medicine.reminderTimes || []).map(formatTime).join(', ')}
            {medicine.dosage && ` · ${medicine.dosage}`}
          </div>
        </div>
        <span className={cn(
          "px-2.5 py-1 rounded-full text-[11px] font-bold",
          isTaken ? "bg-success/20 text-success" : "bg-warning/20 text-warning"
        )}>
          {isTaken ? '✓ Taken' : 'Pending'}
        </span>
      </div>
      {!isTaken && (
        <div className="px-4 pb-3 flex gap-2">
          <Button 
            className="flex-1 py-3 text-[length:var(--fmd)]" 
            onClick={() => onTake(medicine.id, medicine.name)}
          >
            <Check size={16} /> TAKEN
          </Button>
          <Button 
            variant="outline" 
            className="flex-[0.5] py-3 text-[length:var(--fsm)] border-warning/30 text-warning"
            onClick={() => onSnooze(medicine.id)}
          >
            Snooze
          </Button>
        </div>
      )}
    </div>
  );
};
