import React, { useState, useCallback } from 'react';
import { Button } from '../components/ui/Button';
import { useAppStore } from '../store/store';
import { useAuth } from '../hooks/useAuth';

/**
 * Onboarding Screen
 * Guides new users through preference selection
 */
const Onboarding = ({ onComplete }: { onComplete: () => void }) => {
  const { setIsOnboarding, user } = useAppStore();
  const { completeOnboarding } = useAuth();
  
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState({
    problem: '',
    reminderStyle: '',
    fallback: '',
  });

  const handleAnswer = useCallback((key: string, value: string) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  }, []);

  const OB_CONFIG = [
    {
      key: 'problem',
      title: 'Managing medicines can be difficult',
      subtitle: 'What happens most often?',
      opts: [
        { label: '⏰ I forget to take them', value: 'forget' },
        { label: '😴 I miss them while sleeping', value: 'sleep' },
        { label: '🤯 I get confused about timing or dose', value: 'confused' },
        { label: '✅ I usually take them on time', value: 'consistent' },
      ],
    },
    {
      key: 'reminderStyle',
      title: 'How should reminders work for you?',
      subtitle: 'Choose what feels comfortable',
      opts: [
        { label: '⏰ Exactly at the scheduled time', value: 'on_time' },
        { label: '🔔 A few minutes before', value: 'before' },
        { label: '🔁 Keep reminding until I confirm', value: 'repeat' },
      ],
    },
    {
      key: 'fallback',
      title: 'If you miss a dose, what should we do?',
      subtitle: 'We’ll handle it automatically',
      opts: [
        { label: '🔁 Remind me again after some time', value: 'repeat' },
        { label: '👨‍👩‍👧 Inform a family member', value: 'family' },
        { label: '📊 Just record it in history', value: 'history' },
      ],
    },
  ];

  const current = OB_CONFIG[step];

  const handleSelect = useCallback((value: string) => {
    handleAnswer(current.key, value);
  }, [current.key, handleAnswer]);

  const handleSkip = useCallback(() => {
    localStorage.setItem('onboardingDone', 'true');
    localStorage.setItem('obAnswers', JSON.stringify(answers));
    onComplete();
  }, [answers, onComplete]);

  const handleNext = useCallback(async () => {
    if (answers[current.key as keyof typeof answers] === '') return;
    if (step < OB_CONFIG.length - 1) {
      setStep(step + 1);
      return;
    }
    // Complete onboarding
    setLoading(true);
    try {
      if (!user) {
        // No authenticated user yet (dev flow or race). Persist answers locally and continue.
        localStorage.setItem('onboardingDone', 'true');
        localStorage.setItem('obAnswers', JSON.stringify(answers));
        setIsOnboarding(false);
        onComplete();
        setLoading(false);
        return;
      }

      await completeOnboarding(answers);
      localStorage.setItem('onboardingDone', 'true');
      localStorage.setItem('obAnswers', JSON.stringify(answers));
      setIsOnboarding(false);
      onComplete();
    } catch (error) {
      console.error('[Onboarding] Failed to complete onboarding:', error);
      // Still mark as done locally
      localStorage.setItem('onboardingDone', 'true');
      localStorage.setItem('obAnswers', JSON.stringify(answers));
      onComplete();
    } finally {
      setLoading(false);
    }
  }, [answers, current.key, step, completeOnboarding, setIsOnboarding, onComplete]);

  return (
    <div className="flex-1 flex flex-col bg-[color:var(--bg)]">
      <div className="bg-teal p-6 shrink-0">
        <h1 className="text-white text-[length:var(--f2x)] font-extrabold">Quick Setup</h1>
        <p className="text-white/80 text-[length:var(--fsm)] mt-1">Takes 10 seconds. Helps you never miss again.</p>
        <p className="text-white/60 text-[length:var(--fss)] mt-2">Step {step + 1} of 3</p>
        <div className="flex gap-2 mt-4">
          {[0, 1, 2].map(i => (
            <div key={i} className={`h-2 rounded-full flex-1 transition-all ${i <= step ? 'bg-white' : 'bg-white/20'}`} />
          ))}
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <h2 className="text-[length:var(--fmd)] font-bold text-[color:var(--text)] mb-2">{current.title}</h2>
        <p className="text-[color:var(--muted)] mb-5">{current.subtitle}</p>

        <div className="flex-1 flex flex-col gap-3">
          {current.opts.map((opt) => {
            const currentAnswer = answers[current.key as keyof typeof answers];
            return (
              <button
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className={`ob-opt p-4 border-2 rounded-2xl text-left flex items-center justify-between transition-all ${
                  currentAnswer === opt.value ? 'on border-teal bg-teal-light text-teal-dark' : 'border-[color:var(--border)] bg-[color:var(--card)]'
                }`}
              >
                <span className="font-bold">{opt.label}</span>
                {currentAnswer === opt.value && (
                  <div className="w-5 h-5 bg-teal rounded-full flex items-center justify-center text-white text-[8px]">✓</div>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="outline" className="flex-1" onClick={handleSkip}>
            Skip
          </Button>
          <Button variant="outline" className="flex-1" onClick={handleNext} disabled={loading || answers[current.key as keyof typeof answers] === ''}>
            {loading ? 'Saving...' : step < OB_CONFIG.length - 1 ? 'Next' : 'Done'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
