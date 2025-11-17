import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface IntroductionPageProps {
  onStart: () => void;
}

const IntroductionPage: React.FC<IntroductionPageProps> = ({ onStart }) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full text-center p-4 sm:p-6 bg-dark-bg text-primary-text-dark overflow-hidden">
      <div className="absolute inset-0 -z-0 h-full w-full bg-slate-950">
        <div className="absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(0,169,255,0.7),rgba(255,255,255,0))]"></div>
        <div className="absolute bottom-0 right-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(74,0,224,0.6),rgba(255,255,255,0))]"></div>
      </div>
      
      <main className="relative z-10 flex flex-col items-center max-w-3xl">
        <div 
            className="px-6 py-2 bg-black/20 text-primary-text-dark border border-white/10 rounded-full text-sm font-medium animate-fade-in-down"
            style={{ animationDelay: '0.2s' }}
        >
          {t('welcomeToCalmly')}
        </div>

        <h1 
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold mt-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400 animate-fade-in-up"
            style={{ animationDelay: '0.4s' }}
        >
          {t('yourSafeSpace')}
        </h1>
        
        <p 
            className="mt-6 max-w-xl text-base sm:text-lg text-secondary-text-dark leading-relaxed animate-fade-in-up"
            style={{ animationDelay: '0.6s' }}
        >
          {t('introDescription')}
        </p>

        <div 
            className="mt-12 w-full flex justify-center animate-fade-in-up"
            style={{ animationDelay: '0.8s' }}
        >
          <button
            onClick={onStart}
            className="relative inline-flex h-14 w-full sm:w-auto items-center justify-center rounded-full bg-gradient-to-r from-gradient-start to-gradient-end px-10 font-medium text-white transition-all duration-300 hover:shadow-[0_0_20px] hover:shadow-accent/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent focus:ring-offset-dark-bg"
          >
            <span className="animate-glow" style={{['--glow-color' as any]: 'rgba(0,169,255,0.3)'}}>{t('getStarted')}</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default IntroductionPage;