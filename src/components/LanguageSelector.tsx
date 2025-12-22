
import { Globe, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { SUPPORTED_LANGUAGES } from '../i18n';

const LanguageSelector = () => {
    const { currentLanguage, changeLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const currentLangName = SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage)?.native || 'English';

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                title="Select Language"
            >
                <Globe className="w-4 h-4 text-blue-400" />
                <span className="hidden md:inline text-sm font-medium">{currentLangName}</span>
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 py-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-[100] animate-in fade-in zoom-in-95 duration-200 origin-top-right max-h-[300px] overflow-y-auto ring-1 ring-black/5">
                    {SUPPORTED_LANGUAGES.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => {
                                changeLanguage(lang.code);
                                setIsOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-white/10 flex items-center justify-between group"
                        >
                            <div className="flex flex-col">
                                <span className="font-medium text-gray-200 group-hover:text-white">
                                    {lang.native}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {lang.name}
                                </span>
                            </div>
                            {currentLanguage === lang.code && (
                                <Check className="w-4 h-4 text-blue-400" />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LanguageSelector;
