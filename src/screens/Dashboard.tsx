import React, { useCallback } from 'react';
import { useAppStore } from '../store/store';
import { useMedicines } from '../hooks/useMedicines';
import { MedicineCard } from '../components/MedicineCard';
import { getGreeting } from '../utils/dateUtils';
import { UserCircle, Flame, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

/**
 * Dashboard Screen
 * Displays today's medicines and adherence progress
 */
const Dashboard = () => {
  const { user } = useAppStore();
  const { medicines, markAsTaken, snooze } = useMedicines(user?.uid);

  const total = medicines.length;
  const taken = medicines.filter(m => m.takenToday).length;
  const pct = total > 0 ? Math.round((taken / total) * 100) : 0;
  const circum = 175.9;
  const offset = circum - (pct / 100) * circum;

  const handleTake = useCallback(async (id: string) => {
    try {
      await markAsTaken(id);
    } catch (error) {
      console.error('[Dashboard] Failed to mark medicine as taken:', error);
    }
  }, [markAsTaken]);

  const handleSnooze = useCallback(async (id: string) => {
    try {
      await snooze(id, 10);
    } catch (error) {
      console.error('[Dashboard] Failed to snooze medicine:', error);
    }
  }, [snooze]);

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-teal p-5 shrink-0">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-white text-[length:var(--f2x)] font-bold">{getGreeting(user?.name)}</h1>
            <p className="text-white/80 text-[length:var(--fsm)] mt-0.5">
              {total > 0 ? `${taken} of ${total} medicines done` : 'Add your first medicine'}
            </p>
          </div>
          <button className="bg-white/20 border-none w-10 h-10 rounded-full flex items-center justify-center text-white">
            {user?.photoURL ? (
              <img src={user.photoURL} className="w-full h-full rounded-full object-cover" />
            ) : (
              <UserCircle size={24} />
            )}
          </button>
        </div>

        {user?.onboarding?.fallback === 'family' && (
          <div className="bg-blue-100 text-blue-800 p-3 rounded-lg mt-4 mx-4">
            Family will be notified if a dose is missed
          </div>
        )}
        {user?.onboarding?.problem === 'forget' && (
          <div className="bg-green-100 text-green-800 p-3 rounded-lg mt-4 mx-4">
            We’ll help you stay consistent
          </div>
        )}

        <div className="flex items-center gap-4 mt-4 bg-white/10 rounded-2xl p-4">
          <div className="relative w-[68px] h-[68px]">
            <svg width="68" height="68" viewBox="0 0 68 68" className="-rotate-90">
              <circle cx="34" cy="34" r="28" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="7" />
              <motion.circle 
                cx="34" cy="34" r="28" fill="none" stroke="white" strokeWidth="7"
                strokeLinecap="round" strokeDasharray={circum}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-white font-black text-sm">{pct}%</div>
          </div>
          <div className="flex-1">
            <div className="text-xl font-bold text-white">{pct === 100 ? '🎉 All Done!' : 'Keep it up!'}</div>
            <div className="text-[12px] text-white/70">Click cards to mark as taken</div>
          </div>
        </div>
      </div>


      <div className="flex-1 overflow-y-auto pb-6">
        <div className="px-4 py-3 flex items-center justify-between">
          <span className="text-[11px] font-bold text-[color:var(--muted)] uppercase tracking-wider">Today's Medicines</span>
        </div>

        {medicines.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-10 text-center opacity-50">
            <AlertCircle size={48} className="text-teal mb-2" />
            <div className="font-bold">No medicines today</div>
            <p className="text-sm">Tap + Add Med to get started</p>
          </div>
        ) : (
          medicines.map(med => (
            <MedicineCard 
              key={med.id} 
              medicine={med} 
              onTake={handleTake} 
              onSnooze={handleSnooze} 
            />
          ))
        )}

        <div className="bg-[color:var(--teal-dark)] rounded-2xl mx-4 mt-2 p-4 flex items-center gap-4 text-white">
          <div className="text-4xl font-extrabold flex items-center gap-1">
            <Flame size={32} className="text-orange-400" />
            {user?.streak || 0}
          </div>
          <div className="flex-1">
            <div className="text-lg font-bold">Day Streak!</div>
            <div className="text-[11px] text-white/70">Take all meds to keep it going</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
