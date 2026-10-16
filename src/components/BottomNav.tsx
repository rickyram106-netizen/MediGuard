import React from 'react';
import { Home, PlusCircle, Users, BarChart2, Settings } from 'lucide-react';
import { cn } from '../utils/helpers';

interface NavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNav = ({ activeTab, onTabChange }: NavProps) => {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'add', icon: PlusCircle, label: 'Add Med' },
    { id: 'family', icon: Users, label: 'Family' },
    { id: 'history', icon: BarChart2, label: 'History' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="bg-[color:var(--nav-bg)] border-t border-[color:var(--border)] flex shrink-0 pb-3 pt-2">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="flex-1 flex flex-col items-center gap-1 p-1 border-none bg-none cursor-pointer"
          >
            <Icon size={20} className={cn(isActive ? 'text-teal' : 'text-[color:var(--muted)]')} />
            <span className={cn('text-[10px] font-medium', isActive ? 'text-teal font-bold' : 'text-[color:var(--muted)]')}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
