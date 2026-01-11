/**
 * Entry Page
 * 
 * Vibrant game-inspired design with Simon board SVG
 */

import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createSession, joinGame } from '../services/authService';
import { useAuthStore } from '../store/authStore';
import { SimonSplashScreen } from '../components/ui/SimonSplashScreen';

// SVG Simon Board Component (used in form)
function SimonBoardSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className}>
      {/* Outer ring */}
      <circle cx="100" cy="100" r="95" fill="#1a1a2e" stroke="#2d2d44" strokeWidth="4"/>
      
      {/* Green quadrant (top-left) */}
      <path
        d="M 100 100 L 100 15 A 85 85 0 0 0 15 100 Z"
        fill="#22c55e"
        className="drop-shadow-lg"
      />
      
      {/* Red quadrant (top-right) */}
      <path
        d="M 100 100 L 185 100 A 85 85 0 0 0 100 15 Z"
        fill="#ef4444"
        className="drop-shadow-lg"
      />
      
      {/* Blue quadrant (bottom-right) */}
      <path
        d="M 100 100 L 100 185 A 85 85 0 0 0 185 100 Z"
        fill="#3b82f6"
        className="drop-shadow-lg"
      />
      
      {/* Yellow quadrant (bottom-left) */}
      <path
        d="M 100 100 L 15 100 A 85 85 0 0 0 100 185 Z"
        fill="#eab308"
        className="drop-shadow-lg"
      />
      
      {/* Center circle with glow */}
      <circle cx="100" cy="100" r="30" fill="#1a1a2e"/>
      <circle cx="100" cy="100" r="28" fill="none" stroke="#22c55e" strokeWidth="2" opacity="0.8"/>
      <circle cx="100" cy="100" r="25" fill="#0f0f1a"/>
      
      {/* SIMON text */}
      <text
        x="100"
        y="105"
        textAnchor="middle"
        fill="white"
        fontSize="12"
        fontWeight="bold"
        fontFamily="system-ui"
        letterSpacing="2"
      >
        SIMON
      </text>
    </svg>
  );
}

// Sparkle component (used in form background)
function Sparkles() {
  const sparklePositions = [
    { left: '10%', top: '15%', delay: '0s' },
    { left: '85%', top: '20%', delay: '0.3s' },
    { left: '20%', top: '75%', delay: '0.6s' },
    { left: '90%', top: '70%', delay: '0.9s' },
    { left: '5%', top: '45%', delay: '1.2s' },
    { left: '95%', top: '45%', delay: '1.5s' },
    { left: '30%', top: '10%', delay: '0.2s' },
    { left: '70%', top: '85%', delay: '0.8s' },
    { left: '15%', top: '90%', delay: '1.1s' },
    { left: '80%', top: '5%', delay: '0.5s' },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {sparklePositions.map((pos, i) => (
        <div
          key={i}
          className="absolute animate-pulse"
          style={{
            left: pos.left,
            top: pos.top,
            animationDelay: pos.delay,
            animationDuration: '2s',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20">
            <path
              d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z"
              fill="white"
              opacity="0.7"
            />
          </svg>
        </div>
      ))}
    </div>
  );
}

export function EntryPage() {
  const [searchParams] = useSearchParams();
  const joinCode = searchParams.get('join')?.toUpperCase() || null;
  
  const [showForm, setShowForm] = useState(!!joinCode);
  const [displayName, setDisplayName] = useState('');
  const [avatarId, setAvatarId] = useState('1');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { setSession } = useAuthStore();
  const navigate = useNavigate();
  
  const isJoining = !!joinCode;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isJoining) {
        const response = await joinGame(displayName, avatarId, joinCode);
        setSession(response.session);
      } else {
        const response = await createSession(displayName, avatarId);
        setSession(response.session);
      }
      navigate('/waiting');
    } catch (err) {
      setError(err instanceof Error ? err.message : isJoining ? 'Failed to join game' : 'Failed to create game');
    } finally {
      setLoading(false);
    }
  };

  // Landing page with Simon splash screen
  if (!showForm) {
    return <SimonSplashScreen onCreateGame={() => setShowForm(true)} />;
  }

  // Form for creating or joining
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Rainbow swirl background */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            conic-gradient(
              from 0deg at 50% 50%,
              #22c55e 0deg,
              #eab308 90deg,
              #3b82f6 180deg,
              #ef4444 270deg,
              #22c55e 360deg
            )
          `,
        }}
      />
      <div className="absolute inset-0 bg-black/40" />
      <Sparkles />
      
      <div className="relative z-10 bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 sm:p-8 max-w-md w-full">
        {!isJoining && (
          <button
            onClick={() => setShowForm(false)}
            className="text-gray-500 hover:text-gray-700 mb-4 text-sm font-medium"
          >
            ← Back
          </button>
        )}
        
        {/* Mini Simon board */}
        <div className="flex justify-center mb-4">
          <SimonBoardSVG className="w-20 h-20" />
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          {isJoining ? 'Join Game' : 'Create Game'}
        </h2>
        
        {isJoining && (
          <div className="bg-blue-50 border-2 border-blue-200 text-blue-800 px-4 py-3 rounded-xl text-sm mb-5 text-center">
            🎮 Joining game: <span className="font-mono font-bold text-lg">{joinCode}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Your Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your name"
              minLength={3}
              maxLength={12}
              required
              autoFocus
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg transition-all"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Choose Avatar
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['😀', '🎮', '🚀', '⚡', '🎨', '🎯', '🏆', '🌟'].map((emoji, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setAvatarId(String(i + 1))}
                  className={`p-3 rounded-xl border-2 transition-all duration-100 text-2xl min-h-[56px] ${
                    avatarId === String(i + 1)
                      ? 'border-green-500 bg-green-50 scale-105 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  style={{ touchAction: 'manipulation' }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
          
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 
                       disabled:from-gray-400 disabled:to-gray-500
                       text-white font-bold py-4 px-6 rounded-xl 
                       shadow-lg hover:shadow-xl active:scale-[0.98]
                       transition-all duration-100 text-lg min-h-[56px]"
            style={{ touchAction: 'manipulation' }}
          >
            {loading ? 'Loading...' : isJoining ? '🎮 Join Game' : '🎮 Create Game'}
          </button>
        </form>
      </div>
    </div>
  );
}
