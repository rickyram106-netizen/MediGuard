import React from 'react';
import { Button } from '../components/ui/Button';

interface Props {
  onGetStarted: () => void;
  onSignIn: () => void;
}

const Splash = ({ onGetStarted, onSignIn }: Props) => {
  console.log('[Splash] Rendering with props:', { onGetStarted: !!onGetStarted, onSignIn: !!onSignIn });
  
  const handleSignIn = () => {
    console.log('[Splash] Sign In clicked!');
    onSignIn();
  };
  
  const handleGetStarted = () => {
    console.log('[Splash] Get Started clicked!');
    onGetStarted();
  };

  return (
    <div className="flex-1 bg-gradient-to-br from-teal-dark via-teal to-[#1dd3a5] flex flex-col items-center justify-center p-10">
      <div className="text-6xl mb-4">💊</div>
      <h1 className="text-white text-[length:var(--f3x)] font-extrabold text-center leading-tight">MediGuard</h1>
      <p className="text-white/85 text-[length:var(--fbase)] mt-2 text-center leading-relaxed">
        Your personal medication<br />reminder & adherence tracker
      </p>
      
      <div className="mt-10 w-full flex flex-col gap-3">
        <Button className="bg-white text-teal-dark" onClick={handleGetStarted}>
          🚀 Get Started
        </Button>
        <Button variant="outline" className="border-white/50 text-white" onClick={handleSignIn}>
          📱 Sign In with Phone
        </Button>
      </div>
      
      <p className="text-white/60 text-[11px] mt-6 text-center">
        Trusted by 1M+ patients across India
      </p>
    </div>
  );
};

export default Splash;
