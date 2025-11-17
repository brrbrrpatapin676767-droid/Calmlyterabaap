import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { EmergencyContact } from '../types';
import { getContact, saveContact, deleteContact } from '../services/contactService';
import { COUNTRIES } from '../constants/countries';
import PanicAttackAid from './PanicAttackAid';
import SeizureFirstAid from './SeizureFirstAid';

const SOSPage: React.FC = () => {
    const { t } = useLanguage();
    const [contact, setContact] = useState<EmergencyContact | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [activeAid, setActiveAid] = useState<'none' | 'panic' | 'seizure'>('none');

    useEffect(() => {
        setContact(getContact());
    }, []);

    const handleSave = (newContact: EmergencyContact) => {
        saveContact(newContact);
        setContact(newContact);
        setIsEditing(false);
    };

    const handleDelete = () => {
        deleteContact();
        setContact(null);
        setIsEditing(false);
    };

    if (activeAid === 'panic') {
        return <PanicAttackAid onClose={() => setActiveAid('none')} />;
    }

    if (activeAid === 'seizure') {
        return <SeizureFirstAid onClose={() => setActiveAid('none')} />;
    }

    return (
        <div className="flex flex-col items-center w-full min-h-full space-y-8 sm:space-y-12 animate-fade-in">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300">
                {t('sosTitle')}
            </h1>

            <div className="w-full max-w-2xl p-6 bg-light-bg-secondary/30 dark:bg-dark-bg-secondary/30 backdrop-blur-md border border-black/5 dark:border-white/5 rounded-3xl shadow-lg">
                <h2 className="text-2xl font-bold text-primary-text-light dark:text-primary-text-dark">{t('immediateHelp')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <AidButton 
                        title={t('panicAttackAid')} 
                        description={t('panicAttackAidDescription')}
                        onClick={() => setActiveAid('panic')}
                    />
                    <AidButton 
                        title={t('seizureFirstAid')} 
                        description={t('seizureFirstAidDescription')}
                        onClick={() => setActiveAid('seizure')}
                    />
                </div>
            </div>

            <div className="w-full max-w-2xl p-6 bg-light-bg-secondary/30 dark:bg-dark-bg-secondary/30 backdrop-blur-md border border-black/5 dark:border-white/5 rounded-3xl shadow-lg">
                <h2 className="text-2xl font-bold text-primary-text-light dark:text-primary-text-dark">{t('emergencyContact')}</h2>
                <p className="mt-2 text-secondary-text-light dark:text-secondary-text-dark">{t('sosDescription')}</p>
                
                <div className="mt-6">
                    {contact && !isEditing ? (
                        <DisplayContact contact={contact} onEdit={() => setIsEditing(true)} />
                    ) : (
                        <ContactForm
                            contact={contact}
                            onSave={handleSave}
                            onCancel={() => setIsEditing(false)}
                            onDelete={handleDelete}
                        />
                    )}
                </div>
            </div>

            <div className="w-full max-w-2xl p-6 bg-light-bg-secondary/30 dark:bg-dark-bg-secondary/30 backdrop-blur-md border border-black/5 dark:border-white/5 rounded-3xl shadow-lg">
                <h2 className="text-2xl font-bold text-primary-text-light dark:text-primary-text-dark">{t('quickAccess')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <QuickAccessButton label={`${t('callEmergency')} (112)`} onClick={() => window.location.href = 'tel:112'} isEmergency />
                    <QuickAccessButton label={`${t('callEmergency')} (911)`} onClick={() => window.location.href = 'tel:911'} isEmergency />
                </div>
            </div>
        </div>
    );
};

const AidButton: React.FC<{ title: string; description: string; onClick: () => void; }> = ({ title, description, onClick }) => (
    <button onClick={onClick} className="group relative text-left p-4 bg-light-bg-secondary/30 dark:bg-dark-bg-secondary/30 rounded-2xl shadow-lg hover:shadow-accent/20 dark:hover:shadow-accent/30 focus:outline-none focus:ring-4 focus:ring-accent/50 transition-all duration-300 transform hover:-translate-y-1 border border-black/5 dark:border-white/10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-accent/0 via-accent/0 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <h3 className="relative font-bold text-accent dark:text-accent-glow">{title}</h3>
        <p className="relative text-sm text-secondary-text-light dark:text-secondary-text-dark mt-1">{description}</p>
    </button>
);

const DisplayContact: React.FC<{ contact: EmergencyContact; onEdit: () => void; }> = ({ contact, onEdit }) => {
    const { t } = useLanguage();
    return (
        <div className="p-4 bg-black/5 dark:bg-white/5 rounded-2xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <div>
                    <p className="font-bold text-xl">{contact.name}</p>
                    <p className="text-lg text-primary-text-light dark:text-primary-text-dark font-mono mt-1">{contact.countryCode} {contact.phone}</p>
                </div>
                <div className="flex items-center gap-2 mt-4 sm:mt-0">
                    <button onClick={onEdit} className="px-4 py-2 text-sm font-semibold bg-black/10 dark:bg-white/10 rounded-lg hover:bg-black/20 dark:hover:bg-white/20 transition">
                        {t('editContact')}
                    </button>
                    <button onClick={() => window.location.href = `tel:${contact.countryCode}${contact.phone}`} className="px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition animate-pulse-slow">
                        {t('call')}
                    </button>
                </div>
            </div>
        </div>
    );
};

const ContactForm: React.FC<{
    contact: EmergencyContact | null;
    onSave: (contact: EmergencyContact) => void;
    onCancel: () => void;
    onDelete: () => void;
}> = ({ contact, onSave, onCancel, onDelete }) => {
    const { t } = useLanguage();
    const [name, setName] = useState(contact?.name || '');
    const [countryCode, setCountryCode] = useState(contact?.countryCode || '+1');
    const [phone, setPhone] = useState(contact?.phone || '');
    const [countrySearch, setCountrySearch] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [generatedOtp, setGeneratedOtp] = useState('');
    const [error, setError] = useState('');
    const [info, setInfo] = useState('');

    const filteredCountries = useMemo(() => 
        COUNTRIES.filter(c => 
            c.name.toLowerCase().includes(countrySearch.toLowerCase()) || 
            c.dial_code.includes(countrySearch)
        ), [countrySearch]);
        
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsDropdownOpen(false);
          }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSendOtp = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const phoneRegex = /^\d{10,}$/;
        if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
            setError(t('invalidPhoneNumber'));
            return;
        }

        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(newOtp);
        console.log(`%c[Calmly OTP] Your verification code is: ${newOtp}`, 'color: #0ea5e9; font-weight: bold;');
        setInfo(t('otpSentTo'));
        setIsOtpSent(true);
    };

    const handleVerifyOtp = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (otp === generatedOtp) {
            if (name && countryCode && phone) {
                onSave({ name, countryCode, phone });
            }
        } else {
            setError(t('invalidOtp'));
        }
    };
    
    const handleNumberChange = () => {
        setIsOtpSent(false);
        setOtp('');
        setGeneratedOtp('');
        setError('');
        setInfo('');
    };

    return (
        <form onSubmit={isOtpSent ? handleVerifyOtp : handleSendOtp} className="space-y-4">
            <div>
                <label htmlFor="contact-name" className="block text-sm font-bold text-secondary-text-light dark:text-secondary-text-dark mb-1">{t('contactName')}</label>
                <input id="contact-name" type="text" value={name} onChange={e => setName(e.target.value)} required disabled={isOtpSent} className="w-full p-2 h-10 bg-light-bg-secondary/50 dark:bg-dark-bg-secondary/50 border border-black/10 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-accent focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed" />
            </div>
            
            {!isOtpSent ? (
                <div>
                     <label className="block text-sm font-bold text-secondary-text-light dark:text-secondary-text-dark mb-1">{t('phoneNumber')}</label>
                     <div className="flex">
                        <div className="relative" ref={dropdownRef}>
                             <button type="button" onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center justify-center p-2 h-10 w-24 bg-light-bg-secondary/50 dark:bg-dark-bg-secondary/50 border border-r-0 border-black/10 dark:border-white/10 rounded-l-lg focus:ring-2 focus:ring-accent focus:outline-none" aria-expanded={isDropdownOpen} aria-haspopup="listbox">
                                <span>{countryCode}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-3 h-3 ml-2 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                             </button>
                             {isDropdownOpen && (
                                <div className="absolute top-full left-0 mt-1 w-64 bg-light-bg dark:bg-dark-bg border border-black/10 dark:border-white/10 rounded-lg shadow-lg z-10 max-h-60">
                                    <input type="text" placeholder={t('searchCountry')} value={countrySearch} onChange={e => setCountrySearch(e.target.value)} className="w-full p-2 sticky top-0 bg-light-bg/80 dark:bg-dark-bg/80 backdrop-blur-sm border-b border-black/10 dark:border-white/10 focus:outline-none"/>
                                    <ul role="listbox" className="overflow-y-auto max-h-48">
                                        {filteredCountries.map(c => ( <li key={c.code} onClick={() => { setCountryCode(c.dial_code); setIsDropdownOpen(false); setCountrySearch(''); }} className="px-3 py-2 hover:bg-accent/10 cursor-pointer text-sm" role="option" aria-selected={countryCode === c.dial_code}>{c.name} ({c.dial_code})</li>))}
                                    </ul>
                                </div>
                            )}
                        </div>
                        <input id="phone-number" type="tel" value={phone} onChange={e => setPhone(e.target.value)} required className="w-full p-2 h-10 bg-light-bg-secondary/50 dark:bg-dark-bg-secondary/50 border border-black/10 dark:border-white/10 rounded-r-lg focus:ring-2 focus:ring-accent focus:outline-none" />
                     </div>
                </div>
            ) : (
                 <div>
                    {info && <p className="my-2 p-2 bg-accent/10 text-accent dark:text-accent-glow rounded-md text-sm text-center font-semibold">{info}</p>}
                    <label htmlFor="otp-input" className="block text-sm font-bold text-secondary-text-light dark:text-secondary-text-dark mb-1">{t('enterOtp')}</label>
                    <div className="flex items-center gap-2">
                        <input id="otp-input" type="text" value={otp} onChange={e => setOtp(e.target.value)} required className="w-full p-2 h-10 bg-light-bg-secondary/50 dark:bg-dark-bg-secondary/50 border border-black/10 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-accent focus:outline-none" />
                        <button type="button" onClick={handleNumberChange} className="text-sm font-semibold text-accent dark:text-accent-glow hover:underline whitespace-nowrap">{t('changeNumber')}</button>
                    </div>
                </div>
            )}

            {error && <p className="mt-2 text-sm text-red-500 animate-fade-in">{error}</p>}
            
            <div className="flex items-center justify-end gap-2 pt-2">
                {contact && (
                    <button type="button" onClick={onDelete} disabled={isOtpSent} className="px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition mr-auto disabled:opacity-50 disabled:cursor-not-allowed">
                        {t('removeContactBtn')}
                    </button>
                )}
                 {contact && ( <button type="button" onClick={onCancel} disabled={isOtpSent} className="px-4 py-2 text-sm font-semibold bg-black/10 dark:bg-white/10 rounded-lg hover:bg-black/20 dark:hover:bg-white/20 transition disabled:opacity-50 disabled:cursor-not-allowed">Cancel</button>)}
                <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-accent rounded-lg hover:bg-sky-500 transition">
                    {isOtpSent ? t('verifyAndSave') : t('sendOtp')}
                </button>
            </div>
        </form>
    );
};

const QuickAccessButton: React.FC<{ label: string; onClick: () => void; isEmergency?: boolean }> = ({ label, onClick, isEmergency = false }) => (
    <button 
      onClick={onClick} 
      className={`group relative w-full px-4 py-4 font-bold rounded-xl shadow-lg focus:outline-none focus:ring-4 transition-all duration-300 transform hover:scale-105 overflow-hidden
        ${isEmergency 
          ? 'text-white bg-red-500/90 hover:bg-red-600 focus:ring-red-500/50' 
          : 'text-primary-text-light dark:text-primary-text-dark bg-light-bg-secondary/50 dark:bg-dark-bg-secondary/50 hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary/80 focus:ring-accent/50'
        }`}
    >
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
        <span className="relative z-10">{label}</span>
    </button>
);

export default SOSPage;