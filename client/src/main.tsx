import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';
import Navbar from './components/Navbar.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Calculator from './pages/Calculator.tsx';
import Gamification from './pages/Gamification.tsx';
import OffsetMarketplace from './pages/OffsetMarketplace.tsx';
import Login from './pages/Login.tsx';
import VerifyEmail from './pages/VerifyEmail.tsx';
import './index.css';

function App() {
  const { user } = useAuth();
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);

  const handleStatsUpdate = (pts: number, strk: number) => {
    setPoints(pts);
    setStreak(strk);
  };

  if (!user) {
    return <Login />;
  }

  if (!user.emailVerified) {
    return <VerifyEmail />;
  }

  return (
    <div className="app-container">
      <Navbar userPoints={points} userStreak={streak} />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Dashboard onStatsUpdate={handleStatsUpdate} />} />
          <Route path="/calculator" element={<Calculator onStatsUpdate={handleStatsUpdate} />} />
          <Route path="/gamification" element={<Gamification onStatsUpdate={handleStatsUpdate} />} />
          <Route path="/offset" element={<OffsetMarketplace onStatsUpdate={handleStatsUpdate} />} />
        </Routes>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <App />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
