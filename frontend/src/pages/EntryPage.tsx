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
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '2rem 1.25rem',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #4ade80 0%, #facc15 25%, #f97316 50%, #ef4444 75%, #3b82f6 100%)',
      }}
    >
      {/* Content container */}
      <div 
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '24rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        
        {/* Simon Board Logo */}
        <div 
          style={{
            width: '6rem',
            height: '6rem',
            marginBottom: '1.5rem',
            position: 'relative',
            borderRadius: '50%',
            overflow: 'hidden',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)',
            border: '4px solid #1f2937',
          }}
        >
          {/* Green quadrant */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '50%', height: '50%', background: 'linear-gradient(to bottom right, #4ade80, #16a34a)' }} />
          {/* Red quadrant */}
          <div style={{ position: 'absolute', top: 0, right: 0, width: '50%', height: '50%', background: 'linear-gradient(to bottom left, #f87171, #dc2626)' }} />
          {/* Yellow quadrant */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: '50%', height: '50%', background: 'linear-gradient(to top right, #facc15, #ca8a04)' }} />
          {/* Blue quadrant */}
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: '50%', height: '50%', background: 'linear-gradient(to top left, #60a5fa, #2563eb)' }} />
          {/* Vertical divider */}
          <div style={{ position: 'absolute', top: 0, left: '50%', width: '4px', height: '100%', background: '#1f2937', transform: 'translateX(-50%)' }} />
          {/* Horizontal divider */}
          <div style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '4px', background: '#1f2937', transform: 'translateY(-50%)' }} />
          {/* Center */}
          <div 
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '2rem',
              height: '2rem',
              borderRadius: '50%',
              background: '#111827',
              border: '2px solid #4ade80',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ color: '#67e8f9', fontSize: '6px', fontWeight: 'bold', letterSpacing: '0.05em' }}>SIMON</span>
          </div>
        </div>
        
        {/* Join code banner */}
        {isJoining && (
          <div 
            style={{
              width: '100%',
              backgroundColor: '#ffffff',
              borderRadius: '1rem',
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
              padding: '1rem',
              marginBottom: '1rem',
            }}
          >
            <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>Joining game</p>
            <p style={{ textAlign: 'center', fontFamily: 'monospace', fontWeight: 'bold', fontSize: '1.5rem', color: '#1f2937', margin: '0.5rem 0 0 0' }}>{joinCode}</p>
          </div>
        )}
        
        {/* Name Input Card */}
        <div 
          style={{
            width: '100%',
            backgroundColor: '#ffffff',
            borderRadius: '1rem',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
            padding: '1.25rem',
            marginBottom: '1rem',
          }}
        >
          <label style={{ display: 'block', fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.75rem' }}>
            What's your name?
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your name here..."
            maxLength={12}
            autoFocus
            style={{
              width: '100%',
              padding: '0.875rem 1rem',
              backgroundColor: '#f3f4f6',
              border: '2px solid #e5e7eb',
              borderRadius: '0.75rem',
              fontSize: '1.125rem',
              color: '#1f2937',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
        
        {/* Avatar Picker Card */}
        <div 
          style={{
            width: '100%',
            backgroundColor: '#ffffff',
            borderRadius: '1rem',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
            padding: '1.25rem',
            marginBottom: '1rem',
          }}
        >
          <label style={{ display: 'block', fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
            Pick your avatar:
          </label>
          
          {/* Horizontal scrolling avatars with fade edge */}
          <div style={{ position: 'relative' }}>
            <div 
              style={{
                display: 'flex',
                gap: '0.75rem',
                overflowX: 'auto',
                paddingBottom: '0.5rem',
                paddingRight: '2rem',
                scrollbarWidth: 'none',
              }}
            >
              {AVATARS.map((emoji, i) => {
                const isSelected = avatarId === String(i + 1);
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setAvatarId(String(i + 1))}
                    style={{
                      flexShrink: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    <div 
                      style={{
                        width: '3.5rem',
                        height: '3.5rem',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.875rem',
                        transition: 'all 0.15s',
                        border: isSelected ? '3px solid #22c55e' : '3px solid #e5e7eb',
                        backgroundColor: isSelected ? '#f0fdf4' : '#ffffff',
                        transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                        boxShadow: isSelected ? '0 4px 6px -1px rgba(0,0,0,0.1)' : 'none',
                      }}
                    >
                      {emoji}
                    </div>
                    {/* Selection indicator bar */}
                    <div 
                      style={{
                        height: '4px',
                        width: '2rem',
                        borderRadius: '9999px',
                        marginTop: '0.5rem',
                        backgroundColor: isSelected ? '#22c55e' : 'transparent',
                        transition: 'all 0.15s',
                      }}
                    />
                  </button>
                );
              })}
            </div>
            
            {/* Fade gradient on right edge */}
            <div 
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '3rem',
                height: '100%',
                pointerEvents: 'none',
                background: 'linear-gradient(to right, transparent, #ffffff)',
              }}
            />
          </div>
        </div>
        
        {/* Error message */}
        {error && (
          <div 
            style={{
              width: '100%',
              backgroundColor: '#fef2f2',
              border: '2px solid #fecaca',
              color: '#b91c1c',
              padding: '0.75rem 1rem',
              borderRadius: '0.75rem',
              fontSize: '0.875rem',
              marginBottom: '1rem',
              textAlign: 'center',
            }}
          >
            {error}
          </div>
        )}
        
        {/* Create Game Button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading || displayName.length < 3}
          style={{
            width: '100%',
            padding: '1rem',
            borderRadius: '9999px',
            fontWeight: 'bold',
            fontSize: '1.25rem',
            color: '#ffffff',
            border: '2px solid #9333ea',
            cursor: loading || displayName.length < 3 ? 'not-allowed' : 'pointer',
            opacity: loading || displayName.length < 3 ? 0.5 : 1,
            background: 'linear-gradient(180deg, #c084fc 0%, #a855f7 50%, #7c3aed 100%)',
            boxShadow: loading || displayName.length < 3 
              ? 'none' 
              : '0 6px 0 0 #581c87, 0 8px 16px rgba(88, 28, 135, 0.3)',
            transition: 'all 0.15s ease-out',
          }}
        >
          {loading ? 'Loading...' : isJoining ? 'JOIN GAME' : 'CREATE GAME'}
        </button>
      </div>
    </div>
  );
}
