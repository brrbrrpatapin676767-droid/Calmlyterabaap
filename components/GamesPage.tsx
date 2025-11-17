import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { saveGratitudeEntry, getLatestGratitudeEntry } from '../services/activityService';

type Game = null | 'breathing' | 'affirmations' | 'gratitude' | 'sorting' | 'memory';

const BackButton: React.FC<{ onClick: () => void, className?: string }> = ({ onClick, className = '' }) => {
    const { t } = useLanguage();
    return (
        <button onClick={onClick} className={`absolute top-4 left-4 px-4 py-2 font-semibold bg-light-bg-secondary/30 dark:bg-dark-bg-secondary/30 backdrop-blur-md border border-black/5 dark:border-white/5 rounded-full shadow-lg hover:bg-light-bg-secondary/60 dark:hover:bg-dark-bg-secondary/60 transition-colors duration-200 z-20 ${className}`}>
            &larr; {t('back')}
        </button>
    );
};

// --- Breathing Exercise Component ---
const BreathingExercise: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { t } = useLanguage();
  const [phase, setPhase] = useState<'in' | 'hold' | 'out'>('in');
  const [text, setText] = useState(t('breatheIn'));

  useEffect(() => {
    const timings = { in: 4000, hold: 4000, out: 6000 };
    let timer: number;

    if (phase === 'in') {
      setText(t('breatheIn'));
      timer = window.setTimeout(() => setPhase('hold'), timings.in);
    } else if (phase === 'hold') {
      setText(t('hold'));
      timer = window.setTimeout(() => setPhase('out'), timings.out);
    } else if (phase === 'out') {
      setText(t('breatheOut'));
      timer = window.setTimeout(() => setPhase('in'), timings.out);
    }

    return () => clearTimeout(timer);
  }, [phase, t]);

  const circleClass = {
    in: 'scale-100 opacity-100',
    hold: 'scale-100 opacity-100',
    out: 'scale-50 opacity-50',
  }[phase];
  
  const durationClass = {
    in: 'duration-[4000ms]',
    hold: 'duration-[4000ms]',
    out: 'duration-[6000ms]',
  }[phase];

  return (
    <div className="flex flex-col items-center justify-center w-full h-full text-center p-4 relative animate-fade-in overflow-hidden bg-dark-bg">
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-900 via-blue-900 to-cyan-900 bg-[length:200%_200%] animate-aurora opacity-70"></div>
        <BackButton onClick={onBack} className="text-white dark:text-white" />
        <div className="flex-1 flex flex-col items-center justify-center z-10">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
                <div className={`absolute inset-0 bg-gradient-to-tr from-accent to-sky-300 rounded-full transition-all ease-in-out ${durationClass} ${circleClass}`}></div>
                <div className={`absolute inset-0 bg-gradient-to-tr from-accent to-sky-300 rounded-full animate-pulse-slow`}></div>
                <span className="text-2xl sm:text-3xl font-bold text-white z-10">{text}</span>
            </div>
            <p className="mt-12 text-secondary-text-dark">{t('breathingIntro')}</p>
        </div>
    </div>
  );
};

// --- Positive Affirmations Component ---
const PositiveAffirmations: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { t } = useLanguage();
    const affirmations = [
        "I am capable of handling any challenges that come my way.", "I am worthy of love, happiness, and success.",
        "I choose to focus on the positive and let go of the negative.", "I am resilient and can overcome any obstacle.",
        "I am proud of the person I am becoming.", "I trust my intuition and make wise decisions.",
        "I am in control of my own happiness.", "I attract positive energy into my life.",
        "I am grateful for the good things in my life.", "Every day is a new opportunity for growth.",
    ];
    const [currentAffirmation, setCurrentAffirmation] = useState(affirmations[0]);
    const [key, setKey] = useState(0);

    const getNewAffirmation = () => {
        let newAffirmation;
        do { newAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)]; } while (newAffirmation === currentAffirmation);
        setCurrentAffirmation(newAffirmation);
        setKey(prev => prev + 1);
    };

    return (
        <div className="flex flex-col items-center justify-center w-full h-full text-center p-4 relative animate-fade-in">
             <BackButton onClick={onBack} />
            <div className="flex-1 flex flex-col items-center justify-center w-full max-w-lg">
                <div className="w-full h-64 p-6 flex items-center justify-center bg-light-bg-secondary/30 dark:bg-dark-bg-secondary/30 backdrop-blur-md border border-black/5 dark:border-white/5 rounded-3xl shadow-lg">
                    <p key={key} className="text-2xl sm:text-3xl font-semibold text-primary-text-light dark:text-primary-text-dark animate-fade-in">{currentAffirmation}</p>
                </div>
                <p className="text-secondary-text-light dark:text-secondary-text-dark my-6">{t('affirmationsIntro')}</p>
                <button onClick={getNewAffirmation} className="w-full max-w-xs px-6 py-4 font-bold text-white bg-accent rounded-2xl shadow-lg hover:bg-sky-500 focus:outline-none focus:ring-4 focus:ring-accent/50 transition-all duration-300 transform hover:scale-105">
                    {t('newAffirmation')}
                </button>
            </div>
        </div>
    );
};

// --- Gratitude Journal Component ---
const GratitudeJournal: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { t } = useLanguage();
    const [entry, setEntry] = useState('');
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        setEntry(getLatestGratitudeEntry());
    }, []);

    const handleSave = () => {
        saveGratitudeEntry(entry);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    return (
        <div className="flex flex-col items-center justify-center w-full h-full text-center p-4 relative animate-fade-in">
            <BackButton onClick={onBack} />
            <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md">
                <h2 className="text-3xl font-bold text-primary-text-light dark:text-primary-text-dark mb-4">{t('gratitudeIntro')}</h2>
                <textarea
                    value={entry}
                    onChange={(e) => setEntry(e.target.value)}
                    placeholder={t('gratitudePlaceholder')}
                    className="w-full h-48 p-4 bg-light-bg-secondary/30 dark:bg-dark-bg-secondary/30 backdrop-blur-md border border-black/5 dark:border-white/5 rounded-2xl shadow-lg focus:ring-2 focus:ring-accent focus:outline-none transition-shadow duration-200 text-primary-text-light dark:text-primary-text-dark placeholder-secondary-text-light dark:placeholder-secondary-text-dark"
                />
                <button onClick={handleSave} className="mt-6 w-full max-w-xs px-6 py-4 font-bold text-white bg-teal-500 rounded-2xl shadow-lg hover:bg-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-500/50 transition-all duration-300 transform hover:scale-105">
                    {isSaved ? t('entrySaved') : t('saveEntry')}
                </button>
            </div>
        </div>
    );
};

// --- Mindful Sorting Component ---
const MindfulSorting: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { t } = useLanguage();
    const containerRef = useRef<HTMLDivElement>(null);
    const orbColors = { red: 'bg-red-400', blue: 'bg-accent', green: 'bg-lime-400' };
    const zoneColors = { red: 'border-red-400', blue: 'border-accent', green: 'border-lime-400' };
    
    const initialOrbs = [
        { id: 1, color: 'red', x: 30, y: 20, zone: null }, { id: 2, color: 'red', x: 100, y: 100, zone: null },
        { id: 3, color: 'blue', x: 60, y: 150, zone: null }, { id: 4, color: 'blue', x: 160, y: 40, zone: null },
        { id: 5, color: 'green', x: 220, y: 80, zone: null }, { id: 6, color: 'green', x: 250, y: 160, zone: null },
    ];
    
    const [orbs, setOrbs] = useState(initialOrbs);
    const [draggedOrb, setDraggedOrb] = useState<{ id: number; offsetX: number; offsetY: number } | null>(null);

    const handleDragStart = (e: React.MouseEvent | React.TouchEvent, id: number) => {
        const orb = orbs.find(p => p.id === id);
        if (!orb || orb.zone) return;

        const target = e.currentTarget as HTMLDivElement;
        const rect = target.getBoundingClientRect();
        const { clientX, clientY } = 'touches' in e ? e.touches[0] : e;
        const offsetX = clientX - rect.left;
        const offsetY = clientY - rect.top;

        setDraggedOrb({ id, offsetX, offsetY });
        e.preventDefault();
    };

    const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
        if (!draggedOrb || !containerRef.current) return;

        const { clientX, clientY } = 'touches' in e ? e.touches[0] : e;
        const containerRect = (containerRef.current as HTMLDivElement).getBoundingClientRect();
        
        let newX = clientX - containerRect.left - draggedOrb.offsetX;
        let newY = clientY - containerRect.top - draggedOrb.offsetY;
        
        newX = Math.max(0, Math.min(newX, containerRect.width - 40));
        newY = Math.max(0, Math.min(newY, containerRect.height - 40));

        setOrbs(prev => prev.map(p => p.id === draggedOrb.id ? { ...p, x: newX, y: newY } : p));
    }, [draggedOrb]);

    const handleDragEnd = useCallback(() => {
        if (!draggedOrb || !containerRef.current) return;

        const orb = orbs.find(p => p.id === draggedOrb.id);
        if (!orb) return;

        const zones = Array.from((containerRef.current as HTMLDivElement).querySelectorAll<HTMLElement>('[data-zone]'));
        const dropZone = zones.find(zone => {
            const zoneRect = zone.getBoundingClientRect();
            const containerRect = containerRef.current!.getBoundingClientRect();
            const orbCenterX = orb.x + 20 + containerRect.left;
            const orbCenterY = orb.y + 20 + containerRect.top;
            return (
                orbCenterX > zoneRect.left && orbCenterX < zoneRect.right &&
                orbCenterY > zoneRect.top && orbCenterY < zoneRect.bottom
            );
        });
        
        if (dropZone && dropZone.getAttribute('data-zone') === orb.color) {
            setOrbs(prev => prev.map(p => p.id === draggedOrb.id ? { ...p, zone: orb.color } : p));
        }

        setDraggedOrb(null);
    }, [draggedOrb, orbs]);
    
    useEffect(() => {
        window.addEventListener('mousemove', handleDragMove);
        window.addEventListener('touchmove', handleDragMove);
        window.addEventListener('mouseup', handleDragEnd);
        window.addEventListener('touchend', handleDragEnd);

        return () => {
            window.removeEventListener('mousemove', handleDragMove);
            window.removeEventListener('touchmove', handleDragMove);
            window.removeEventListener('mouseup', handleDragEnd);
            window.removeEventListener('touchend', handleDragEnd);
        };
    }, [handleDragMove, handleDragEnd]);
    
    const allSorted = orbs.every(p => p.zone);

    return (
        <div className="flex flex-col items-center justify-center w-full h-full text-center p-4 relative animate-fade-in">
            <BackButton onClick={onBack} />
            <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md">
                <p className="text-secondary-text-light dark:text-secondary-text-dark mb-4">{t('sortingIntro')}</p>
                <div ref={containerRef} className="relative w-full h-96 bg-light-bg-secondary/30 dark:bg-dark-bg-secondary/30 backdrop-blur-md border border-black/5 dark:border-white/5 rounded-3xl shadow-lg overflow-hidden">
                    <div className="absolute inset-x-0 bottom-4 flex justify-around items-center">
                        {Object.entries(zoneColors).map(([color, className]) => (
                             <div key={color} data-zone={color} className={`w-28 h-28 border-2 border-dashed rounded-full ${className} bg-current/10 flex-shrink-0 transition-colors`}></div>
                        ))}
                    </div>
                    {orbs.map(orb => (
                        <div key={orb.id}
                            onMouseDown={(e) => handleDragStart(e, orb.id)}
                            onTouchStart={(e) => handleDragStart(e, orb.id)}
                            className={`absolute w-10 h-10 rounded-full shadow-md cursor-grab ${orbColors[orb.color as keyof typeof orbColors]} ${orb.zone ? 'opacity-30' : ''} ${draggedOrb?.id === orb.id ? 'cursor-grabbing scale-110 shadow-lg z-10' : ''} transition-all duration-200`}
                            style={{ left: orb.x, top: orb.y, touchAction: 'none' }}>
                                 <div className="w-full h-full rounded-full animate-glow" style={{'--glow-color': orb.color} as React.CSSProperties}></div>
                        </div>
                    ))}
                    {allSorted && <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"><p className="text-2xl font-bold text-white animate-fade-in">{t('sortingComplete')}</p></div>}
                </div>
            </div>
        </div>
    );
};

// --- Memory Match Component ---
const MemoryMatch: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { t } = useLanguage();
    
    const cardEmojis = ['😄', '😔', '😡', '😰', '😴', '🙂', '😐', '🥳'];
    
    interface Card { id: number; emoji: string; isFlipped: boolean; isMatched: boolean; }

    const createShuffledDeck = useCallback((): Card[] => {
        const duplicatedEmojis = [...cardEmojis, ...cardEmojis];
        for (let i = duplicatedEmojis.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [duplicatedEmojis[i], duplicatedEmojis[j]] = [duplicatedEmojis[j], duplicatedEmojis[i]];
        }
        return duplicatedEmojis.map((emoji, index) => ({ id: index, emoji, isFlipped: false, isMatched: false, }));
    }, []);

    const [cards, setCards] = useState<Card[]>(createShuffledDeck());
    const [flippedCards, setFlippedCards] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);
    const [isChecking, setIsChecking] = useState(false);
    
    const matchedPairs = cards.filter(card => card.isMatched).length / 2;
    const isGameWon = matchedPairs === cardEmojis.length;

    const resetGame = useCallback(() => {
        setCards(createShuffledDeck());
        setFlippedCards([]);
        setMoves(0);
        setIsChecking(false);
    }, [createShuffledDeck]);

    const handleCardClick = (id: number) => {
        const clickedCard = cards.find(c => c.id === id);
        if (isChecking || !clickedCard || clickedCard.isFlipped || clickedCard.isMatched) return;

        const newFlippedCards = [...flippedCards, id];
        setFlippedCards(newFlippedCards);
        setCards(prev => prev.map(c => c.id === id ? { ...c, isFlipped: true } : c));

        if (newFlippedCards.length === 2) {
            setIsChecking(true);
            setMoves(prev => prev + 1);
            const [firstId, secondId] = newFlippedCards;
            const firstCard = cards.find(c => c.id === firstId);
            const secondCard = cards.find(c => c.id === secondId);

            if (firstCard?.emoji === secondCard?.emoji) {
                setTimeout(() => {
                    setCards(prev => prev.map(c => c.id === firstId || c.id === secondId ? { ...c, isMatched: true } : c));
                    setFlippedCards([]);
                    setIsChecking(false);
                }, 500);
            } else {
                setTimeout(() => {
                    setCards(prev => prev.map(c => c.id === firstId || c.id === secondId ? { ...c, isFlipped: false } : c));
                    setFlippedCards([]);
                    setIsChecking(false);
                }, 1000);
            }
        }
    };
    
    return (
        <div className="flex flex-col items-center justify-between w-full h-full p-4 relative animate-fade-in">
            <style>{`.perspective{perspective:1000px}.transform-style-3d{transform-style:preserve-3d}.rotate-y-180{transform:rotateY(180deg)}.backface-hidden{backface-visibility:hidden;-webkit-backface-visibility:hidden}`}</style>
            <div className="w-full flex items-center justify-between z-10">
                <BackButton onClick={onBack} />
                <div className="flex gap-4 text-primary-text-light dark:text-primary-text-dark font-semibold p-3 bg-light-bg-secondary/30 dark:bg-dark-bg-secondary/30 backdrop-blur-md rounded-2xl">
                    <span>{t('moves')}: {moves}</span>
                    <span>{t('pairsFound')}: {matchedPairs}/{cardEmojis.length}</span>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-2 sm:gap-4 p-2 sm:p-4 flex-1 w-full max-w-md my-4 relative">
                {cards.map((card) => (
                    <div key={card.id} className="perspective aspect-square" onClick={() => handleCardClick(card.id)}>
                        <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d cursor-pointer ${card.isFlipped || card.isMatched ? 'rotate-y-180' : ''}`}>
                            <div className="absolute w-full h-full backface-hidden rounded-lg bg-accent/70 dark:bg-accent/90 flex items-center justify-center shadow-lg"><div className="w-1/2 h-1/2 rounded-full bg-white/20"></div></div>
                            <div className={`absolute w-full h-full backface-hidden rounded-lg flex items-center justify-center shadow-lg rotate-y-180 ${card.isMatched ? 'bg-lime-400 dark:bg-lime-500' : 'bg-light-bg-secondary dark:bg-dark-bg-secondary'}`}>
                                <span className="text-3xl sm:text-5xl">{card.emoji}</span>
                            </div>
                        </div>
                    </div>
                ))}
                {isGameWon && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm rounded-lg animate-fade-in z-10">
                        <p className="text-3xl sm:text-4xl font-bold text-white text-center">{t('youWin')}</p>
                        <button onClick={resetGame} className="mt-6 px-6 py-3 font-bold text-slate-800 bg-white rounded-xl shadow-lg hover:bg-slate-200 focus:outline-none focus:ring-4 focus:ring-slate-300/50 transition-all duration-300 transform hover:scale-105">
                            {t('playAgain')}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};


// --- Main Games Page Component ---
const GamesPage: React.FC = () => {
  const [activeGame, setActiveGame] = useState<Game>(null);
  const { t } = useLanguage();

  const games = [
    { id: 'breathing', title: t('breathingExercise'), description: 'A simple exercise to calm your mind and body.', color: 'text-accent dark:text-accent-glow' },
    { id: 'affirmations', title: t('positiveAffirmations'), description: 'Shift your mindset with empowering affirmations.', color: 'text-teal-500 dark:text-teal-400' },
    { id: 'gratitude', title: t('gratitudeJournal'), description: 'Reflect on what went well and cultivate positivity.', color: 'text-amber-500 dark:text-amber-400' },
    { id: 'sorting', title: t('mindfulSorting'), description: 'A calming activity to focus your mind.', color: 'text-indigo-500 dark:text-indigo-400' },
    { id: 'memory', title: t('memoryGame'), description: 'Test your focus by matching pairs of cards.', color: 'text-purple-500 dark:text-purple-400' },
  ];

  const renderContent = () => {
    switch (activeGame) {
      case 'breathing': return <BreathingExercise onBack={() => setActiveGame(null)} />;
      case 'affirmations': return <PositiveAffirmations onBack={() => setActiveGame(null)} />;
      case 'gratitude': return <GratitudeJournal onBack={() => setActiveGame(null)} />;
      case 'sorting': return <MindfulSorting onBack={() => setActiveGame(null)} />;
      case 'memory': return <MemoryMatch onBack={() => setActiveGame(null)} />;
      default:
        return (
          <div className="flex flex-col items-center w-full min-h-full space-y-8 sm:space-y-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gradient-start to-gradient-end dark:from-sky-300 dark:to-purple-400">
              {t('calmingActivities')}
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl">
              {games.map(game => (
                <button key={game.id} onClick={() => setActiveGame(game.id as Game)} className="group text-left p-6 bg-light-bg-secondary/30 dark:bg-dark-bg-secondary/30 backdrop-blur-md border border-black/5 dark:border-white/5 rounded-3xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-black/10 dark:hover:border-white/20 transform hover:-translate-y-2">
                    <h2 className={`text-2xl font-bold ${game.color}`}>{game.title}</h2>
                    <p className="mt-2 text-secondary-text-light dark:text-secondary-text-dark">{game.description}</p>
                </button>
              ))}
            </div>
          </div>
        );
    }
  };

  return <div className="h-full w-full">{renderContent()}</div>;
};

export default GamesPage;