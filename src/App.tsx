import React, { useEffect, useState, useCallback } from 'react';
import { createDefaultUserProfile } from './utils/userDefaults';

// Screens
import Splash from './screens/Splash';
import Login from './screens/Login';
import Onboarding from './screens/Onboarding';
import Dashboard from './screens/Dashboard';
import AddMedicine from './screens/AddMedicine';
import Family from './screens/Family';
import History from './screens/History';
import Settings from './screens/Settings';
import Profile from './screens/Profile';

// Components
import { StatusBar } from './components/StatusBar';
import { BottomNav } from './components/BottomNav';
import { AlarmOverlay } from './components/AlarmOverlay';
import { ErrorBoundary } from './components/ErrorBoundary';

// Hooks
import { useAuth } from './hooks/useAuth';
import { useMedicines } from './hooks/useMedicines';
import { useAppStore } from './store/store';

// Types and Utils
import { Medicine } from './types';
import { nowMinutes, timeToMinutes } from './utils/dateUtils';
import { updateDoc, doc } from 'firebase/firestore';
import { getDb } from './services/firebase';
import { FEATURES } from './config/environment';

/**
 * Main App Component
 * Orchestrates screen navigation, authentication, and data subscriptions
 * Uses custom hooks for clean separation of concerns
 */
const App = () => {
  // ========================================================================
  // HOOKS & STATE
  // ========================================================================

  // Auth hook manages auth state and Firebase subscription
  const { sendOTP, verifyOTP } = useAuth();
  const { user, isAuthLoading, setUser, setIsOnboarding } = useAppStore();

  // Medicines hook manages medicines subscription and operations
  const { medicines, markAsTaken, markAsMissed, snooze } = useMedicines(user?.uid);

  // Local UI state
  const [activeTab, setActiveTab] = useState('home');
  const [screen, setScreen] = useState<'splash' | 'login' | 'onboard' | 'main'>('splash');
  const [alarmMed, setAlarmMed] = useState<Medicine | null>(null);

  // ========================================================================
  // EFFECT: SCREEN NAVIGATION BASED ON AUTH STATE
  // ========================================================================

  useEffect(() => {
    // Only update screen based on auth state if we're still loading or after auth settles
    // Don't override manual screen changes (like clicking Get Started or Sign In buttons)
    console.log('[App.useEffect] Checking screen navigation:', { screen, user: !!user, isAuthLoading });
    
    if (isAuthLoading) {
      // While auth is loading, do not override the user's navigation choice.
      // This prevents the app from forcing the UI back to splash when the
      // user intentionally navigates to `login` or `onboard`.
      console.log('[App.useEffect] Auth loading; skipping automatic navigation');
      return;
    } else if (!user) {
      // User is not logged in - only reset to splash if they're on main/protected screens
      // Allow them to stay on splash, login, or onboarding screens
      console.log('[App.useEffect] User not logged in. Checking if screen should be reset. Screen:', screen, 'Allowed:', !['splash', 'login', 'onboard'].includes(screen));
      if (!['splash', 'login', 'onboard'].includes(screen)) {
        console.log('[App.useEffect] Setting screen to splash (protected screen)');
        setScreen('splash');
      }
      // Return early to avoid checking onboarding state for non-authenticated users
    } else if (!user.onboarding.done && screen !== 'onboard') {
      // User hasn't completed onboarding - navigate there
      console.log('[App.useEffect] Setting screen to onboard');
      setScreen('onboard');
    } else if (user.onboarding.done && screen !== 'main') {
      // User is authenticated and onboarded - show main app
      console.log('[App.useEffect] Setting screen to main');
      setScreen('main');
    }
  }, [user, isAuthLoading, screen]);

  // ========================================================================
  // EFFECT: DEV MODE BYPASS (FOR TESTING)
  // ========================================================================

  useEffect(() => {
    if (localStorage.getItem('devModeBypass') === 'true' && !user && screen === 'splash') {
      const uid = localStorage.getItem('devModeUid') || 'dev-user-' + Date.now();
      const devUser = createDefaultUserProfile(uid, '9999999999', 'Test User');
      setUser(devUser);
      localStorage.removeItem('devModeBypass');
    }
  }, []);

  // ========================================================================
  // EFFECT: HANDLE ONBOARDING COMPLETION
  // ========================================================================

  useEffect(() => {
    if (user && localStorage.getItem('onboardingDone')) {
      const answers = JSON.parse(localStorage.getItem('obAnswers') || '{}');

      if (FEATURES.enableFirebase) {
        updateDoc(doc(getDb(), 'users', user.uid), {
          'onboarding.done': true,
          'onboarding.problem': answers.problem,
          'onboarding.reminderStyle': answers.reminderStyle,
          'onboarding.fallback': answers.fallback,
        }).catch(error => console.error('[App] Onboarding update failed:', error));
      } else {
        console.log('[App] Skipping onboarding write - Firebase disabled');
      }

      setUser({
        ...user,
        onboarding: {
          done: true,
          problem: answers.problem,
          reminderStyle: answers.reminderStyle,
          fallback: answers.fallback,
        }
      });

      localStorage.removeItem('onboardingDone');
      localStorage.removeItem('obAnswers');
    }
  }, [user?.uid]);

  // ========================================================================
  // EFFECT: ALARM DETECTION
  // ========================================================================

  useEffect(() => {
    if (screen !== 'main' || !medicines.length || alarmMed) return;

    const checkAlarms = useCallback(() => {
      const now = nowMinutes();
      const graceMinutes = 15;

      for (const med of medicines) {
        if (med.takenToday) continue;

        // Skip if snoozed
        if (med.snoozeUntil) {
          const snoozeTime = med.snoozeUntil.toDate?.() || med.snoozeUntil;
          if (snoozeTime > new Date()) continue;
        }

        // Check if overdue
        const isOverdue = med.reminderTimes.some(t => {
          const mins = timeToMinutes(t);
          return now - mins >= graceMinutes;
        });

        if (isOverdue) {
          setAlarmMed(med);
          return;
        }
      }
    }, [medicines]);

    const interval = setInterval(checkAlarms, 60000);
    checkAlarms();
    return () => clearInterval(interval);
  }, [screen, medicines, alarmMed]);

  // ========================================================================
  // HANDLERS
  // ========================================================================

  const handleAlarmTake = useCallback(async () => {
    if (alarmMed) {
      try {
        await markAsTaken(alarmMed.id);
        setAlarmMed(null);
      } catch (error) {
        console.error('[App] Failed to mark medicine as taken:', error);
      }
    }
  }, [alarmMed, markAsTaken]);

  const handleAlarmSnooze = useCallback(async () => {
    if (alarmMed) {
      try {
        await snooze(alarmMed.id, 10);
        setAlarmMed(null);
      } catch (error) {
        console.error('[App] Failed to snooze medicine:', error);
      }
    }
  }, [alarmMed, snooze]);

  const handleAlarmDismiss = useCallback(async () => {
    if (alarmMed) {
      try {
        await markAsMissed(alarmMed.id);
        setAlarmMed(null);
      } catch (error) {
        console.error('[App] Failed to dismiss medicine:', error);
      }
    }
  }, [alarmMed, markAsMissed]);

  const handleScreenChange = useCallback((newScreen: typeof screen) => {
    console.log('[App] handleScreenChange called with:', newScreen);
    setScreen(newScreen);
  }, []);

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  // ========================================================================
  // RENDER
  // ========================================================================

  const renderScreen = () => {
    console.log('[App] renderScreen called with screen:', screen);
    switch (screen) {
      case 'splash':
        return (
          <Splash
            onGetStarted={() => handleScreenChange('onboard')}
            onSignIn={() => handleScreenChange('login')}
          />
        );

      case 'login':
        console.log('[App] Rendering Login screen');
        return <Login onBack={() => handleScreenChange('splash')} />;

      case 'onboard':
        return <Onboarding onComplete={() => handleScreenChange('main')} />;

      case 'main':
        switch (activeTab) {
          case 'home':
            return <Dashboard />;
          case 'add':
            return <AddMedicine onBack={() => handleTabChange('home')} />;
          case 'family':
            return <Family />;
          case 'history':
            return <History />;
          case 'settings':
            return <Settings onProfile={() => handleTabChange('profile')} />;
          case 'profile':
            return <Profile onBack={() => handleTabChange('settings')} />;
          default:
            return <Dashboard />;
        }

      default:
        return (
          <Splash
            onGetStarted={() => handleScreenChange('onboard')}
            onSignIn={() => handleScreenChange('login')}
          />
        );
    }
  };

  return (
    <ErrorBoundary>
      <div className={user?.settings.darkMode ? 'dark' : 'light'}>
        <div className={`fs-${user?.settings.fontSize || 'large'}`}>
          <div className="phone-container">
            <StatusBar />
            <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col min-h-0">
              {renderScreen()}
              <AlarmOverlay
                medicine={alarmMed}
                onTake={handleAlarmTake}
                onSnooze={handleAlarmSnooze}
                onDismiss={handleAlarmDismiss}
              />
            </div>
            {screen === 'main' && !['profile', 'add'].includes(activeTab) && (
              <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default App;
