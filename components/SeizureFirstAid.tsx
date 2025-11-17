import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 mr-3 text-green-500 flex-shrink-0"><path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" /></svg>;
const CrossIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 mr-3 text-red-500 flex-shrink-0"><path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z" clipRule="evenodd" /></svg>;

interface SeizureFirstAidProps {
  onClose: () => void;
}

const SeizureFirstAid: React.FC<SeizureFirstAidProps> = ({ onClose }) => {
  const { t } = useLanguage();

  const dos = [t('seizureDo1'), t('seizureDo2'), t('seizureDo3'), t('seizureDo4'), t('seizureDo5')];
  const donts = [t('seizureDont1'), t('seizureDont2'), t('seizureDont3'), t('seizureDont4')];

  return (
    <div className="fixed inset-0 bg-light-bg dark:bg-dark-bg z-50 flex flex-col p-4 overflow-y-auto animate-fade-in-up">
      <div className="container max-w-2xl p-4 sm:p-6 md:p-8 my-auto">
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-primary-text-light dark:text-primary-text-dark">{t('seizureTitle')}</h1>
            <button
              onClick={onClose}
              className="p-3 rounded-full bg-light-bg-secondary/30 dark:bg-dark-bg-secondary/30 hover:bg-light-bg-secondary/80 dark:hover:bg-dark-bg-secondary/80 transition-colors duration-200"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
            </button>
        </div>

        <div className="p-4 mb-6 bg-amber-400/10 dark:bg-amber-500/10 border-l-4 border-amber-500 text-amber-800 dark:text-amber-200">
            <p className="font-semibold">{t('seizureDisclaimer')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-green-500/10 dark:bg-green-500/10 rounded-2xl border border-green-500/20">
                <h2 className="text-xl font-bold text-green-700 dark:text-green-300 mb-4">{t('dos')}</h2>
                <ul className="space-y-3">
                    {dos.map((item, index) => (
                        <li key={index} className="flex items-start text-primary-text-light dark:text-primary-text-dark">
                            <CheckIcon />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="p-6 bg-red-500/10 dark:bg-red-500/10 rounded-2xl border border-red-500/20">
                <h2 className="text-xl font-bold text-red-700 dark:text-red-300 mb-4">{t('donts')}</h2>
                <ul className="space-y-3">
                    {donts.map((item, index) => (
                        <li key={index} className="flex items-start text-primary-text-light dark:text-primary-text-dark">
                            <CrossIcon />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
             <button onClick={() => window.location.href = 'tel:112'} className="px-6 py-4 text-lg font-bold text-white bg-red-500 rounded-xl shadow-lg hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-500/50 transition-all duration-300 transform hover:scale-105 animate-pulse-slow">
                {t('callEmergency')} (112)
            </button>
            <button onClick={() => window.location.href = 'tel:911'} className="px-6 py-4 text-lg font-bold text-white bg-red-500 rounded-xl shadow-lg hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-500/50 transition-all duration-300 transform hover:scale-105 animate-pulse-slow">
                {t('callEmergency')} (911)
            </button>
        </div>

      </div>
    </div>
  );
};

export default SeizureFirstAid;