/**
 * Simon Splash Screen Component
 * 
 * Uses the SVG splash design with an overlay clickable button
 */

interface SimonSplashScreenProps {
  onCreateGame: () => void;
}

export function SimonSplashScreen({ onCreateGame }: SimonSplashScreenProps) {
  return (
    <div 
      className="fixed inset-0 w-screen h-screen overflow-hidden"
      style={{ 
        background: `radial-gradient(ellipse at 30% 30%, #4ade80 0%, #facc15 25%, #f97316 50%, #ef4444 75%, #3b82f6 100%)`,
      }}
    >
      {/* SVG Splash Screen - covers full viewport */}
      <img 
        src="/simon-splash.svg" 
        alt="Simon's Sequence"
        className="w-full h-full object-cover"
        draggable={false}
      />
      
      {/* Clickable button overlay - positioned over the CREATE GAME area in the SVG */}
      <button
        onClick={onCreateGame}
        className="absolute left-1/2 -translate-x-1/2 
                   w-[220px] h-[60px] rounded-full
                   cursor-pointer bg-transparent border-none outline-none
                   hover:bg-white/5 active:bg-white/10 
                   transition-all duration-150
                   focus:ring-4 focus:ring-purple-400/50"
        style={{ 
          bottom: '4%',
          touchAction: 'manipulation',
        }}
        aria-label="Create Game"
      />
    </div>
  );
}
