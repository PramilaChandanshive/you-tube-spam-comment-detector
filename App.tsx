import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import DetectorDashboard from './components/DetectorDashboard';
import { AppView } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('landing');

  return (
    <div className="min-h-screen">
      {view === 'landing' ? (
        <LandingPage onStart={() => setView('detector')} />
      ) : (
        <DetectorDashboard onBack={() => setView('landing')} />
      )}
    </div>
  );
};

export default App;
