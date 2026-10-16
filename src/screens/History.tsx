import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store/store';
import { getDb } from '../services/firebase';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { HistoryEntry } from '../types';
import { dateLabel } from '../utils/dateUtils';
import { cn } from '../utils/helpers';
import { BarChart3, Pill, CheckCircle2, XCircle } from 'lucide-react';

/**
 * History Screen
 * Displays medicine adherence log
 */
const History = () => {
  const { user } = useAppStore();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      try {
        const q = query(
        collection(getDb(), 'history'),
          where('uid', '==', user.uid),
          orderBy('timestamp', 'desc'),
          limit(50)
        );
        const snap = await getDocs(q);
        setHistory(snap.docs.map(d => ({ ...d.data(), id: d.id } as HistoryEntry)));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const taken = history.filter(h => h.status === 'taken').length;
  const missed = history.filter(h => h.status === 'missed').length;
  const adherence = history.length > 0 ? Math.round((taken / (taken + missed)) * 100) : 0;

  return (
    <div className="flex-1 flex flex-col bg-[color:var(--bg)]">
      <div className="bg-teal p-6 shrink-0">
        <h1 className="text-white text-[length:var(--f2x)] font-extrabold">Medicine History</h1>
        <p className="text-white/80 text-[length:var(--fsm)] mt-1">Your dose log</p>
      </div>

      <div className="flex-1 overflow-y-auto pb-6">
        <div className="flex gap-3 p-4">
          <div className="flex-1 bg-success/10 rounded-2xl p-4 text-center">
            <div className="text-[length:var(--f2x)] font-black text-success">{adherence}%</div>
            <div className="text-[10px] font-bold text-success/70 uppercase">Adherence</div>
          </div>
          <div className="flex-1 bg-teal-light rounded-2xl p-4 text-center">
            <div className="text-[length:var(--f2x)] font-black text-teal-dark">{taken}</div>
            <div className="text-[10px] font-bold text-teal-dark/70 uppercase">Taken</div>
          </div>
          <div className="flex-1 bg-danger/10 rounded-2xl p-4 text-center">
            <div className="text-[length:var(--f2x)] font-black text-danger">{missed}</div>
            <div className="text-[10px] font-bold text-danger/70 uppercase">Missed</div>
          </div>
        </div>

        {loading ? (
          <div className="p-20 text-center text-[color:var(--muted)]">Loading logs...</div>
        ) : history.length === 0 ? (
          <div className="p-20 text-center opacity-50 flex flex-col items-center gap-2">
            <BarChart3 size={48} className="text-teal" />
            <div className="font-bold">No history yet</div>
            <p className="text-sm">Logs appear here as you take doses</p>
          </div>
        ) : (
          <div className="flex flex-col gap-px bg-[color:var(--border)] mt-2">
            {history.map((h) => {
              const Icon = h.status === 'taken' ? CheckCircle2 : XCircle;
              const color = h.status === 'taken' ? 'text-success' : 'text-danger';
              return (
                <div key={h.id} className="bg-[color:var(--card)] p-4 flex items-center gap-4">
                  <div className={cn("w-2 h-2 rounded-full", h.status === 'taken' ? 'bg-success' : 'bg-danger')} />
                  <div className="flex-1">
                    <div className="text-[length:var(--fbase)] font-bold">{h.medicineName}</div>
                    <div className="text-[11px] text-[color:var(--muted)]">
                      {dateLabel(h.date)} · {h.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <div className={cn("flex items-center gap-1 font-bold text-[11px]", color)}>
                    <Icon size={14} /> {h.status === 'taken' ? 'Taken' : 'Missed'}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
