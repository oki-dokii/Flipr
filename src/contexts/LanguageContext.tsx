
import React, { createContext, useContext, useEffect, useState } from 'react';
import { translations, Language, SUPPORTED_LANGUAGES } from '../i18n';

interface LanguageContextType {
    currentLanguage: string;
    changeLanguage: (code: string) => void;
    t: (key: keyof typeof translations['en']) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentLanguage, setCurrentLanguage] = useState<string>('en');

    useEffect(() => {
        // Read language from cookie on mount
        const cookies = document.cookie.split('; ');
        const googCookie = cookies.find(row => row.startsWith('googtrans='));
        if (googCookie) {
            // Cookie format: /en/hi -> we want 'hi'
            const val = googCookie.split('=')[1];
            const parts = val.split('/');
            if (parts.length === 3) {
                setCurrentLanguage(parts[2]);
            }
        }
    }, []);

    const changeLanguage = (code: string) => {
        // Set Google Translate Cookie: /auto/target_lang
        // Domain path must be root
        document.cookie = `googtrans=/en/${code}; path=/; domain=${window.location.hostname}`;
        document.cookie = `googtrans=/en/${code}; path=/`; // Fallback for localhost

        setCurrentLanguage(code);

        // Reload to trigger Google Translate
        window.location.reload();
    };

    const t = (key: keyof typeof translations['en']): string => {
        const langCode = currentLanguage as Language;
        // Fallback to English if translation missing or language not manually supported
        if (translations[langCode] && translations[langCode][key]) {
            return translations[langCode][key];
        }
        return translations['en'][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ currentLanguage, changeLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
