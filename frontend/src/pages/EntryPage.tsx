/**
 * Entry Page
 * 
 * Vibrant game-inspired design matching splash screen colors
 */

import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createSession, joinGame } from '../services/authService';
import { useAuthStore } from '../store/authStore';
import { SimonSplashScreen } from '../components/ui/SimonSplashScreen';

// Avatar options
const AVATARS = ['🦁', '🐯', '🦊', '🐼', '🐸', '🦄', '🐙', '🦋', '🐨', '🦉'];

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

  const handleSubmit = async () => {
    if (displayName.length < 3) return;
    
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
    return <SimonSplashScreen onComplete={() => setShowForm(true)} />;
  }

  // Create Game Form
  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center px-5 py-8 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #4ade80 0%, #facc15 25%, #f97316 50%, #ef4444 75%, #3b82f6 100%)',
      }}
    >
      {/* Swirl overlays */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-green-400 rounded-full opacity-40 blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute top-32 right-0 w-64 h-64 bg-red-400 rounded-full opacity-40 blur-3xl translate-x-1/2" />
      <div className="absolute bottom-0 right-10 w-80 h-80 bg-blue-400 rounded-full opacity-40 blur-3xl translate-y-1/2" />
      <div className="absolute bottom-32 left-0 w-56 h-56 bg-yellow-400 rounded-full opacity-40 blur-3xl -translate-x-1/2" />
      
      {/* Sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-[8%] w-3 h-3 bg-amber-100 rotate-45 opacity-80 animate-pulse" />
        <div className="absolute top-[15%] right-[10%] w-2.5 h-2.5 bg-amber-100 rotate-45 opacity-80 animate-pulse" style={{ animationDelay: '0.3s' }} />
        <div className="absolute top-[45%] left-[5%] w-2 h-2 bg-amber-100 rotate-45 opacity-70 animate-pulse" style={{ animationDelay: '0.6s' }} />
        <div className="absolute top-[50%] right-[8%] w-2.5 h-2.5 bg-amber-100 rotate-45 opacity-80 animate-pulse" style={{ animationDelay: '0.9s' }} />
        <div className="absolute bottom-[20%] left-[10%] w-3 h-3 bg-amber-100 rotate-45 opacity-80 animate-pulse" style={{ animationDelay: '1.2s' }} />
        <div className="absolute bottom-[15%] right-[12%] w-2 h-2 bg-amber-100 rotate-45 opacity-70 animate-pulse" style={{ animationDelay: '0.4s' }} />
      </div>
      
      {/* Content container */}
      <div className="relative z-10 w-full max-w-sm flex flex-col items-center">
        
        {/* Simon Board Logo */}
        <div className="w-24 h-24 mb-6 relative rounded-full overflow-hidden shadow-xl border-4 border-gray-800">
          {/* Green quadrant */}
          <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-green-400 to-green-600" />
          {/* Red quadrant */}
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-red-400 to-red-600" />
          {/* Yellow quadrant */}
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-yellow-400 to-yellow-600" />
          {/* Blue quadrant */}
          <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-blue-400 to-blue-600" />
          {/* Dividers */}
          <div className="absolute top-0 left-1/2 w-1 h-full bg-gray-800 -translate-x-1/2" />
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-800 -translate-y-1/2" />
          {/* Center */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gray-900 border-2 border-green-400 flex items-center justify-center shadow-lg">
            <span className="text-cyan-300 text-[6px] font-bold tracking-wide">SIMON</span>
          </div>
        </div>
        
        {/* Join code banner */}
        {isJoining && (
          <div className="w-full bg-white rounded-2xl shadow-lg p-4 mb-4">
            <p className="text-center text-gray-500 text-sm">Joining game</p>
            <p className="text-center font-mono font-bold text-2xl text-gray-800">{joinCode}</p>
          </div>
        )}
        
        {/* Name Input Card */}
        <div className="w-full bg-white rounded-2xl shadow-lg p-5 mb-4">
          <label className="block text-lg font-bold text-gray-800 mb-3">
            What's your name?
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your name here..."
            maxLength={12}
            autoFocus
            className="w-full px-4 py-3.5 bg-gray-100 border-2 border-gray-200 rounded-xl 
                       text-lg text-gray-800 placeholder-gray-400 
                       focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 
                       transition-all"
          />
        </div>
        
        {/* Avatar Picker Card */}
        <div className="w-full bg-white rounded-2xl shadow-lg p-5 mb-4">
          <label className="block text-lg font-bold text-gray-800 mb-4">
            Pick your avatar:
          </label>
          
          {/* Horizontal scrolling avatars with fade edge */}
          <div className="relative">
            <div 
              className="flex gap-3 overflow-x-auto pb-2 pr-8"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {AVATARS.map((emoji, i) => {
                const isSelected = avatarId === String(i + 1);
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setAvatarId(String(i + 1))}
                    className="flex-shrink-0 flex flex-col items-center"
                  >
                    <div className={`
                      w-14 h-14 rounded-full flex items-center justify-center text-3xl
                      transition-all duration-150 border-[3px]
                      ${isSelected 
                        ? 'bg-green-50 border-green-500 scale-110 shadow-md' 
                        : 'bg-white border-gray-200 hover:border-gray-300'
                      }
                    `}>
                      {emoji}
                    </div>
                    {/* Selection indicator bar */}
                    <div className={`
                      h-1 w-8 rounded-full mt-2 transition-all duration-150
                      ${isSelected ? 'bg-green-500' : 'bg-transparent'}
                    `} />
                  </button>
                );
              })}
            </div>
            
            {/* Fade gradient on right edge to indicate more content */}
            <div 
              className="absolute top-0 right-0 w-12 h-full pointer-events-none"
              style={{
                background: 'linear-gradient(to right, transparent, white)',
              }}
            />
          </div>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="w-full bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-4 text-center">
            {error}
          </div>
        )}
        
        {/* Create Game Button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading || displayName.length < 3}
          className={`
            w-full py-4 rounded-full font-bold text-xl text-white
            transition-all duration-150 ease-out border-2 border-purple-600
            ${loading || displayName.length < 3 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:translate-y-[-2px] active:translate-y-[2px]'
            }
          `}
          style={{
            background: 'linear-gradient(180deg, #c084fc 0%, #a855f7 50%, #7c3aed 100%)',
            boxShadow: loading || displayName.length < 3 
              ? 'none' 
              : '0 6px 0 0 #581c87, 0 8px 16px rgba(88, 28, 135, 0.3)',
          }}
        >
          {loading ? 'Loading...' : isJoining ? 'JOIN GAME' : 'CREATE GAME'}
        </button>
      </div>
    </div>
  );
}
