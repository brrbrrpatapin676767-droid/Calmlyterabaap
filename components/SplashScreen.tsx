import React from 'react';

const SplashScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-dark-bg text-primary-text-dark overflow-hidden animate-splash-fade-out" style={{animationDelay: '2.2s'}}>
      <style>{`
          .animate-logo-draw {
            stroke-dasharray: 1;
            stroke-dashoffset: 1;
          }
      `}</style>
      <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-4">
        <path d="M21.5 12C21.5 17.2467 17.2467 21.5 12 21.5C6.75329 21.5 2.5 17.2467 2.5 12C2.5 6.75329 6.75329 2.5 12 2.5C14.7356 2.5 17.2215 3.57861 19 5.5" 
            stroke="#00A9FF" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            className="animate-logo-draw" 
            style={{ animationDelay: '0s' }}
        />
        <path d="M7 12C7 12 8.5 14 10 14C11.5 14 12.5 10 14 10C15.5 10 17 12 17 12" 
            stroke="#00A9FF" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            className="animate-logo-draw opacity-0" 
            style={{ animationDelay: '0.7s' }}
        />
      </svg>
      <h1 className="text-3xl font-bold tracking-wider text-primary-text-dark opacity-0 animate-logo-text-fade" style={{animationDelay: '1.4s'}}>
        Calmly
      </h1>
    </div>
  );
};

export default SplashScreen;
