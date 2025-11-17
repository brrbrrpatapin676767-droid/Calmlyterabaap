import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 sm:w-20 sm:h-20 text-white/80"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639l4.418-5.58a1.012 1.012 0 0 1 1.58 0l4.418 5.58a1.012 1.012 0 0 1 0 .639l-4.418 5.58a1.012 1.012 0 0 1-1.58 0l-4.418-5.58Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>;
const TouchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 sm:w-20 sm:h-20 text-white/80"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" /></svg>;
const HearIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 sm:w-20 sm:h-20 text-white/80"><path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" /></svg>;
const SmellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 sm:w-20 sm:h-20 text-white/80"><path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-2.25-1.313M21 7.5v2.25m0-2.25-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3 2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75 2.25-1.313M12 21.75V19.5m0 2.25-2.25-1.313m0-16.875L12 2.25l2.25 1.313M12 7.5V5.25m0 2.25-2.25-1.313m2.25-1.313L9.75 3.938M7.5 4.25l2.25-1.313M7.5 4.25 9.75 5.57M16.5 4.25l-2.25-1.313M16.5 4.25 14.25 5.57M4.5 19.5l2.25-1.313M4.5 19.5l2.25 1.313M19.5 19.5l-2.25-1.313M19.5 19.5l-2.25 1.313" /></svg>;
const TasteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 sm:w-20 sm:h-20 text-white/80"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.092c-.381-1.24-.623-2.544-.623-3.875a9.75 9.75 0 0 1 5.006-8.414 4.482 4.482 0 0 0 2.433-3.69C19.27 4.212 21 7.845 21 12Z" /></svg>;

interface PanicAttackAidProps {
  onClose: () => void;
}

const PanicAttackAid: React.FC<PanicAttackAidProps> = ({ onClose }) => {
  const { t } = useLanguage();
  const [step, setStep] = useState(0);

  const stepsContent = [
    { text: t('panicTitle') },
    { number: 5, icon: <EyeIcon />, text: t('panicStep5') },
    { number: 4, icon: <TouchIcon />, text: t('panicStep4') },
    { number: 3, icon: <HearIcon />, text: t('panicStep3') },
    { number: 2, icon: <SmellIcon />, text: t('panicStep2') },
    { number: 1, icon: <TasteIcon />, text: t('panicStep1') },
    { text: t('panicEnd') },
  ];
  
  const handleNextStep = () => {
    if (step < stepsContent.length - 1) {
      setStep(s => s + 1);
    } else {
      onClose();
    }
  };
  
  const currentStep = stepsContent[step];

  return (
    <div 
        onClick={handleNextStep}
        className="fixed inset-0 bg-dark-bg text-primary-text-dark z-50 flex flex-col items-center p-8 text-center animate-fade-in overflow-hidden cursor-pointer"
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-900 via-blue-900 to-cyan-900 bg-[length:200%_200%] animate-aurora"></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center h-full w-full">
        <div key={step} className="animate-fade-in-up w-full">
          {currentStep.number && (
            <>
              <div className="text-8xl sm:text-9xl font-extrabold text-white/80 mb-2">{currentStep.number}</div>
              <div className="flex justify-center mb-6">{currentStep.icon}</div>
            </>
          )}
          <p className="text-3xl sm:text-4xl font-semibold max-w-2xl mx-auto leading-relaxed text-white">{currentStep.text}</p>
        </div>
      </div>
       
       <div className="absolute bottom-8 left-0 right-0 w-full px-8 z-20">
            {step < stepsContent.length -1 && step > 0 &&(
                <div className="flex justify-center items-center gap-3 mb-4">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className={`w-3 h-3 rounded-full transition-colors duration-300 ${step > index ? 'bg-white' : 'bg-white/30'}`}></div>
                    ))}
                </div>
            )}
            {step === stepsContent.length - 1 ? (
                <button
                    onClick={onClose}
                    className="mt-12 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full transition-colors duration-300 animate-fade-in"
                >
                    {t('finish')}
                </button>
            ) : (
                <p className="text-white/50 text-sm tracking-widest uppercase">Tap anywhere to continue</p>
            )}
       </div>
    </div>
  );
};

export default PanicAttackAid;
