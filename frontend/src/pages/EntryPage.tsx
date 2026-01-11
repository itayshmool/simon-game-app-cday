/**
 * Entry Page
 * 
 * Vibrant game-inspired design matching splash screen colors
 */

import { useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createSession, joinGame } from '../services/authService';
import { useAuthStore } from '../store/authStore';
import { SimonSplashScreen } from '../components/ui/SimonSplashScreen';

// Glossy Simon Board SVG Component
function SimonBoardLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 130 130" className={className}>
      <defs>
        <linearGradient id="greenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4ade80"/>
          <stop offset="50%" stopColor="#22c55e"/>
          <stop offset="100%" stopColor="#16a34a"/>
        </linearGradient>
        <linearGradient id="redGrad" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f87171"/>
          <stop offset="50%" stopColor="#ef4444"/>
          <stop offset="100%" stopColor="#dc2626"/>
        </linearGradient>
        <linearGradient id="yellowGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fde047"/>
          <stop offset="50%" stopColor="#facc15"/>
          <stop offset="100%" stopColor="#eab308"/>
        </linearGradient>
        <linearGradient id="blueGrad" x1="100%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#60a5fa"/>
          <stop offset="50%" stopColor="#3b82f6"/>
          <stop offset="100%" stopColor="#2563eb"/>
        </linearGradient>
        <radialGradient id="centerGrad" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#374151"/>
          <stop offset="100%" stopColor="#111827"/>
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <circle cx="65" cy="65" r="62" fill="#1f2937" stroke="#374151" strokeWidth="2"/>
      
      {/* Green segment */}
      <path d="M65,65 L65,8 A57,57 0 0,0 8,65 Z" fill="url(#greenGrad)" stroke="#1f2937" strokeWidth="4"/>
      <ellipse cx="36" cy="36" rx="12" ry="6" fill="white" opacity="0.3" transform="rotate(-45,36,36)"/>
      
      {/* Red segment */}
      <path d="M65,65 L122,65 A57,57 0 0,0 65,8 Z" fill="url(#redGrad)" stroke="#1f2937" strokeWidth="4"/>
      <ellipse cx="94" cy="36" rx="12" ry="6" fill="white" opacity="0.3" transform="rotate(45,94,36)"/>
      
      {/* Yellow segment */}
      <path d="M65,65 L8,65 A57,57 0 0,0 65,122 Z" fill="url(#yellowGrad)" stroke="#1f2937" strokeWidth="4"/>
      <ellipse cx="36" cy="94" rx="12" ry="6" fill="white" opacity="0.3" transform="rotate(45,36,94)"/>
      
      {/* Blue segment */}
      <path d="M65,65 L65,122 A57,57 0 0,0 122,65 Z" fill="url(#blueGrad)" stroke="#1f2937" strokeWidth="4"/>
      <ellipse cx="94" cy="94" rx="12" ry="6" fill="white" opacity="0.3" transform="rotate(-45,94,94)"/>
      
      {/* Dividers */}
      <line x1="3" y1="65" x2="127" y2="65" stroke="#1f2937" strokeWidth="5"/>
      <line x1="65" y1="3" x2="65" y2="127" stroke="#1f2937" strokeWidth="5"/>
      
      {/* Center */}
      <circle cx="65" cy="65" r="22" fill="none" stroke="#22c55e" strokeWidth="2" filter="url(#glow)"/>
      <circle cx="65" cy="65" r="18" fill="url(#centerGrad)"/>
      <text x="65" y="69" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="9" fontWeight="bold" fill="#67e8f9" filter="url(#glow)">SIMON</text>
    </svg>
  );
}

// Sparkles component matching splash screen
function Sparkles() {
  const sparkles = [
    { left: '8%', top: '8%', size: 14, delay: 0 },
    { left: '88%', top: '12%', size: 12, delay: 0.3 },
    { left: '6%', top: '45%', size: 10, delay: 0.6 },
    { left: '92%', top: '50%', size: 12, delay: 0.9 },
    { left: '10%', top: '78%', size: 14, delay: 1.2 },
    { left: '85%', top: '82%', size: 10, delay: 0.2 },
    { left: '25%', top: '5%', size: 8, delay: 0.5 },
    { left: '75%', top: '90%', size: 12, delay: 0.8 },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {sparkles.map((sparkle, i) => (
        <div
          key={i}
          className="absolute animate-pulse"
          style={{
            left: sparkle.left,
            top: sparkle.top,
            animationDelay: `${sparkle.delay}s`,
            animationDuration: '2s',
          }}
        >
          <svg width={sparkle.size} height={sparkle.size} viewBox="0 0 20 20">
            <path
              d="M10 0 L11.5 8.5 L20 10 L11.5 11.5 L10 20 L8.5 11.5 L0 10 L8.5 8.5 Z"
              fill="#fef3c7"
              opacity="0.85"
            />
          </svg>
        </div>
      ))}
      {/* Small dots */}
      {[
        { left: '18%', top: '22%' },
        { left: '78%', top: '28%' },
        { left: '12%', top: '65%' },
        { left: '88%', top: '68%' },
      ].map((dot, i) => (
        <div
          key={`dot-${i}`}
          className="absolute w-2 h-2 rounded-full bg-amber-100/70 animate-pulse"
          style={{ left: dot.left, top: dot.top, animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
  );
}

// Avatar options with animal emojis
const AVATARS = ['🦁', '🐯', '🦊', '🐼', '🐸', '🦄', '🐙', '🦋'];

export function EntryPage() {
  const [searchParams] = useSearchParams();
  const joinCode = searchParams.get('join')?.toUpperCase() || null;
  
  const [showForm, setShowForm] = useState(!!joinCode);
  const [displayName, setDisplayName] = useState('');
  const [avatarId, setAvatarId] = useState('1');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const avatarScrollRef = useRef<HTMLDivElement>(null);
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
    return <SimonSplashScreen onComplete={() => setShowForm(true)} />;
  }

  // Form for creating or joining - matching splash screen design
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center px-4 py-6">
      {/* Rainbow gradient background (same as splash) */}
      <div 
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 30% 30%, #4ade80 0%, #facc15 25%, #f97316 50%, #ef4444 75%, #3b82f6 100%)`,
        }}
      />
      
      {/* Swirl overlays */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-green-500/35 blur-3xl" />
        <div className="absolute top-20 -right-20 w-72 h-72 rounded-full bg-red-500/35 blur-3xl" />
        <div className="absolute -bottom-20 right-10 w-96 h-96 rounded-full bg-blue-500/40 blur-3xl" />
        <div className="absolute bottom-40 -left-10 w-64 h-64 rounded-full bg-yellow-500/35 blur-3xl" />
      </div>
      
      {/* Sparkles */}
      <Sparkles />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-sm">
        
        {/* Simon Board Logo */}
        <div className="mb-6 mt-4">
          <SimonBoardLogo className="w-28 h-28 sm:w-32 sm:h-32 drop-shadow-xl" />
        </div>
        
        {/* Join code banner (if joining) */}
        {isJoining && (
          <div className="w-full bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-4 mb-4">
            <p className="text-center text-gray-600 text-sm">Joining game</p>
            <p className="text-center font-mono font-bold text-2xl text-gray-800">{joinCode}</p>
          </div>
        )}
        
        {/* Name Input Card */}
        <div className="w-full bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-5 mb-4">
          <label className="block text-lg font-bold text-gray-800 mb-3">
            What's your name?
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your name here..."
            minLength={3}
            maxLength={12}
            required
            autoFocus
            className="w-full px-4 py-3 bg-slate-100 border-2 border-slate-200 rounded-xl 
                       focus:ring-2 focus:ring-green-500 focus:border-green-500 
                       text-lg text-gray-800 placeholder-slate-400 transition-all"
          />
        </div>
        
        {/* Avatar Picker Card */}
        <div className="w-full bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-5 mb-4">
          <label className="block text-lg font-bold text-gray-800 mb-3">
            Pick your avatar:
          </label>
          
          {/* Horizontal scrolling avatars */}
          <div 
            ref={avatarScrollRef}
            className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {AVATARS.map((emoji, i) => {
              const isSelected = avatarId === String(i + 1);
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setAvatarId(String(i + 1))}
                  className={`flex-shrink-0 flex flex-col items-center transition-all duration-150`}
                  style={{ touchAction: 'manipulation' }}
                >
                  <div className={`
                    w-14 h-14 rounded-full flex items-center justify-center text-2xl
                    transition-all duration-150
                    ${isSelected 
                      ? 'bg-green-500/15 border-[3px] border-green-500 scale-110' 
                      : 'bg-white border-2 border-slate-200 hover:border-slate-300'
                    }
                  `}>
                    {emoji}
                  </div>
                  {/* Selection indicator */}
                  <div className={`
                    h-1 w-8 rounded-full mt-2 transition-all duration-150
                    ${isSelected ? 'bg-green-500' : 'bg-transparent'}
                  `} />
                </button>
              );
            })}
          </div>
          
          <p className="text-center text-slate-400 text-xs mt-2">← Swipe to see more →</p>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="w-full bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-4">
            {error}
          </div>
        )}
        
        {/* Create Game Button (Purple gradient like splash) */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading || displayName.length < 3}
          className="w-full py-4 rounded-full font-bold text-xl text-white
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-150 ease-out
                     hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: 'linear-gradient(to bottom, #c084fc 0%, #a855f7 50%, #7c3aed 100%)',
            boxShadow: '0 6px 0 0 #581c87, 0 8px 16px rgba(88, 28, 135, 0.3)',
            border: '2px solid #9333ea',
            touchAction: 'manipulation',
          }}
        >
          <span className="drop-shadow-md">
            {loading ? 'Loading...' : isJoining ? 'JOIN GAME' : 'CREATE GAME'}
          </span>
        </button>
      </div>
    </div>
  );
}
