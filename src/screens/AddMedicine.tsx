import React, { useState, useCallback } from 'react';
import { useAppStore } from '../store/store';
import { useMedicines } from '../hooks/useMedicines';
import { Button } from '../components/ui/Button';
import { ArrowLeft, Clock, Plus, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '../utils/helpers';
import { formatTime } from '../utils/dateUtils';

interface Props {
  onBack: () => void;
}

interface FormErrors {
  name?: string;
  times?: string;
}

/**
 * Add Medicine Screen
 * Allows user to add new medicines with reminder times
 */
const AddMedicine = ({ onBack }: Props) => {
  const { user } = useAppStore();
  const { addMedicine } = useMedicines(user?.uid);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  
  const [form, setForm] = useState({
    name: '',
    dosage: '',
    unit: 'Tablet',
    frequency: 'Daily',
    missedAction: 'Repeat alert 10 min',
    notes: '',
  });
  const [times, setTimes] = useState<string[]>(['08:00 AM', '08:00 PM']);
  const [customTime, setCustomTime] = useState('08:00');

  const units = ['Tablet', 'Capsule', 'ml', 'Drops', 'Syrup'];
  const presets = ['06:00 AM', '08:00 AM', '12:00 PM', '02:00 PM', '08:00 PM', '10:00 PM'];

  const validateForm = useCallback((): boolean => {
    const errors: FormErrors = {};
    
    if (!form.name.trim()) {
      errors.name = 'Medicine name is required';
    }
    
    if (times.length === 0) {
      errors.times = 'Please select at least one reminder time';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [form.name, times.length]);

  const toggleTime = useCallback((time: string) => {
    setTimes(prev => prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time]);
    if (formErrors.times) setFormErrors({ ...formErrors, times: undefined });
  }, [formErrors]);

  const addCustomTime = useCallback(() => {
    const formatted = formatTime(customTime);
    if (!times.includes(formatted)) {
      setTimes([...times, formatted]);
      if (formErrors.times) setFormErrors({ ...formErrors, times: undefined });
    }
  }, [customTime, times, formErrors]);

  const handleSave = useCallback(async () => {
    setError(null);
    setSuccess(false);
    
    if (!validateForm() || !user) return;
    
    setLoading(true);
    try {
      await addMedicine({
        uid: user.uid,
        name: form.name,
        dosage: form.dosage,
        unit: form.unit,
        frequency: form.frequency,
        missedAction: form.missedAction,
        notes: form.notes,
        reminderTimes: times,
      });
      setSuccess(true);
      setTimeout(() => onBack(), 1500);
    } catch (err: any) {
      console.error('[AddMedicine] Failed to save:', err);
      setError(err.message || 'Failed to save medicine. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [validateForm, user, addMedicine, form, times, onBack]);

  return (
    <div className="flex-1 flex flex-col pb-6">
      <div className="bg-teal p-4 flex items-center gap-3 shrink-0">
        <button onClick={onBack} className="bg-white/20 border-none text-white w-9 h-9 rounded-full flex items-center justify-center cursor-pointer">
          <ArrowLeft size={18} />
        </button>
        <span className="text-white text-[length:var(--flg)] font-bold">Add Medicine</span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-6">
        {error && (
          <div className="mt-4 bg-danger/10 border border-danger/30 rounded-xl p-3 flex items-start gap-3">
            <AlertCircle size={16} className="text-danger shrink-0 mt-0.5" />
            <div className="flex-1 text-sm text-danger">{error}</div>
          </div>
        )}

        {success && (
          <div className="mt-4 bg-success/10 border border-success/30 rounded-xl p-3 flex items-start gap-3">
            <CheckCircle size={16} className="text-success shrink-0 mt-0.5" />
            <div className="flex-1 text-sm text-success">Medicine saved successfully!</div>
          </div>
        )}

        <label className="label-text">Medicine name <span className="text-danger">*</span></label>
        <input 
          className={cn("input-field", formErrors.name && "border-danger")}
          placeholder="e.g. Metformin 500mg"
          value={form.name}
          onChange={(e) => {
            setForm({ ...form, name: e.target.value });
            if (formErrors.name) setFormErrors({ ...formErrors, name: undefined });
          }}
        />
        {formErrors.name && <div className="text-xs text-danger mt-1">{formErrors.name}</div>}

        <label className="label-text">Dosage</label>
        <input 
          className="input-field" 
          placeholder="e.g. 1 tablet, 5ml"
          value={form.dosage}
          onChange={(e) => setForm({ ...form, dosage: e.target.value })}
        />

        <label className="label-text">Unit</label>
        <div className="flex flex-wrap gap-2">
          {units.map(u => (
            <button 
              key={u}
              onClick={() => setForm({ ...form, unit: u })}
              className={cn(
                "px-3 py-2 border-2 border-[color:var(--border)] rounded-xl text-[length:var(--fsm)] font-bold bg-[color:var(--card)] transition-all",
                form.unit === u && "border-teal bg-teal-light text-teal-dark"
              )}
            >
              {u}
            </button>
          ))}
        </div>

        <label className="label-text">Reminder times <span className="text-danger">*</span></label>
        <div className="flex flex-wrap gap-2">
          {presets.map(t => (
            <button 
              key={t}
              onClick={() => toggleTime(t)}
              className={cn(
                "px-3 py-2 border-2 border-[color:var(--border)] rounded-xl text-[length:var(--fsm)] font-bold bg-[color:var(--card)] transition-all",
                times.includes(t) && "border-teal bg-teal-light text-teal-dark"
              )}
            >
              {t}
            </button>
          ))}
        </div>
        {formErrors.times && <div className="text-xs text-danger mt-2">{formErrors.times}</div>}
        
        <div className="flex gap-2 mt-4">
          <input 
            type="time" 
            className="input-field flex-1 py-2 text-sm" 
            value={customTime}
            onChange={(e) => setCustomTime(e.target.value)}
          />
          <button 
            className="bg-teal text-white rounded-xl px-4 py-2 text-xs font-bold whitespace-nowrap hover:opacity-90 transition-opacity"
            onClick={addCustomTime}
          >
            <Plus size={14} className="inline mr-1" /> Add
          </button>
        </div>

        <div className="flex flex-wrap gap-1 mt-2">
          {times.map(t => (
            <span key={t} className="bg-teal-light text-teal-dark rounded-lg px-2 py-1 text-[11px] font-bold flex items-center gap-1">
              {t}
              <button 
                onClick={() => setTimes(times.filter(x => x !== t))}
                className="text-teal-dark/50 hover:text-teal-dark"
              >
                ✕
              </button>
            </span>
          ))}
        </div>

        <label className="label-text">Notes (optional)</label>
        <input 
          className="input-field" 
          placeholder="e.g. Take after food"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />

        <Button 
          className="mt-8 w-full" 
          disabled={!form.name || times.length === 0 || loading || success}
          onClick={handleSave}
        >
          {loading ? "Saving..." : success ? "✓ Saved" : "+ Save Medicine"}
        </Button>
      </div>
    </div>
  );
};

export default AddMedicine;
