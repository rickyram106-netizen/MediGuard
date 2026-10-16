import React, { useCallback } from 'react';
import { useAppStore } from '../store/store';
import { useAuth } from '../hooks/useAuth';
import { User, Bell, Volume2, Moon, Type, Globe, Shield, HelpCircle, ChevronRight, LogOut } from 'lucide-react';
import { cn } from '../utils/helpers';
import { Button } from '../components/ui/Button';

interface Props {
  onProfile: () => void;
}

/**
 * Settings Screen
 * User preferences and application settings
 */
const Settings = ({ onProfile }: Props) => {
  const { user, updateSettings } = useAppStore();
  const { signOut } = useAuth();
  
  const [loading, setLoading] = React.useState(false);

  const handleLogout = useCallback(async () => {
    setLoading(true);
    try {
      await signOut();
    } catch (error) {
      console.error('[Settings] Logout failed:', error);
    } finally {
      setLoading(false);
    }
  }, [signOut]);

  const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="mt-6 px-4">
      <div className="text-[10px] font-bold text-[color:var(--muted)] uppercase tracking-widest mb-2">{title}</div>
      <div className="bg-[color:var(--card)] rounded-2xl border border-[color:var(--border)] overflow-hidden">
        {children}
      </div>
    </div>
  );

  const Row = ({ icon: Icon, title, value, onClick, children }: any) => (
    <div 
      className="flex items-center gap-4 p-4 border-b border-[color:var(--border)] last:border-0 active:bg-black/5"
      onClick={onClick}
    >
      <Icon size={20} className="text-teal shrink-0" />
      <div className="flex-1 text-[length:var(--fbase)] font-medium">{title}</div>
      {value && <div className="text-[length:var(--fsm)] text-[color:var(--muted)]">{value}</div>}
      {children}
      {!children && <ChevronRight size={18} className="text-[color:var(--muted)]" />}
    </div>
  );

  const Toggle = ({ on, onToggle }: { on: boolean, onToggle: () => void }) => (
    <div 
      className={cn("w-12 h-6 rounded-full relative cursor-pointer transition-all", on ? "bg-teal" : "bg-gray-300")}
      onClick={(e) => { e.stopPropagation(); onToggle(); }}
    >
      <div className={cn("absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm", on && "translate-x-6")} />
    </div>
  );

  return (
    <div className="flex-1 flex flex-col bg-[color:var(--bg)]">
      <div className="bg-teal p-6 shrink-0">
        <h1 className="text-white text-[length:var(--f2x)] font-extrabold">Settings</h1>
        <p className="text-white/80 text-[length:var(--fsm)] mt-1">Customize your experience</p>
      </div>

      <div className="flex-1 overflow-y-auto pb-10">
        <Section title="Account">
          <Row icon={User} title="My Profile" value={user?.name || "No name"} onClick={onProfile} />
        </Section>

        <Section title="Notifications">
          <Row icon={Bell} title="Push alerts">
            <Toggle on={!!user?.settings.pushAlerts} onToggle={() => updateSettings({ pushAlerts: !user?.settings.pushAlerts })} />
          </Row>
          <Row icon={Volume2} title="Sound">
            <Toggle on={!!user?.settings.sound} onToggle={() => updateSettings({ sound: !user?.settings.sound })} />
          </Row>
        </Section>

        <Section title="Display">
          <Row icon={Moon} title="Dark mode" onClick={() => updateSettings({ darkMode: !user?.settings.darkMode })}>
             <Toggle on={!!user?.settings.darkMode} onToggle={() => updateSettings({ darkMode: !user?.settings.darkMode })} />
          </Row>
          <div className="p-4 border-b border-[color:var(--border)]">
             <div className="flex items-center gap-4 mb-3">
               <Type size={20} className="text-teal" />
               <div className="text-[length:var(--fbase)] font-medium">Font size</div>
             </div>
             <div className="flex gap-2 ml-9">
               {['normal', 'large', 'xlarge'].map(s => (
                 <button 
                  key={s} 
                  onClick={() => updateSettings({ fontSize: s as any })}
                  className={cn(
                    "px-3 py-1.5 rounded-lg border-2 text-xs font-bold capitalize",
                    user?.settings.fontSize === s ? "border-teal bg-teal-light text-teal-dark" : "border-[color:var(--border)]"
                  )}
                 >
                   {s}
                 </button>
               ))}
             </div>
          </div>
        </Section>

        <Section title="About">
          <Row icon={Shield} title="Privacy Policy" />
          <Row icon={HelpCircle} title="Contact Support" />
        </Section>

        <div className="px-4 mt-8 pb-4">
          <Button variant="outline" disabled={loading} className="w-full text-danger border-danger/20 active:bg-danger/5" onClick={handleLogout}>
            <LogOut size={18} /> {loading ? 'Signing out...' : 'Log Out'}
          </Button>
          <p className="text-center text-[color:var(--muted)] text-[10px] mt-4">Version 2.0.0 Refactored</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
