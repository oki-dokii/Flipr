import { Globe, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { SUPPORTED_LANGUAGES } from '../i18n';

const LanguageSelector = () => {
    const { currentLanguage, changeLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownStyle, setDropdownStyle] = useState<{ top: number; right: number }>({ top: 0, right: 0 });
    const buttonRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Calculate position from button's real bounding rect → never clipped
    const openDropdown = () => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setDropdownStyle({
                top: rect.bottom + 8,
                right: window.innerWidth - rect.right,
            });
        }
        setIsOpen(true);
    };

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                !buttonRef.current?.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const currentLangName =
        SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage)?.native || 'English';

    return (
        <div className="relative">
            <button
                ref={buttonRef}
                onClick={() => (isOpen ? setIsOpen(false) : openDropdown())}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                title="Select Language"
            >
                <Globe className="w-4 h-4 text-blue-400" />
                <span className="hidden md:inline text-sm font-medium">{currentLangName}</span>
            </button>

            {isOpen &&
                createPortal(
                    <div
                        ref={dropdownRef}
                        className="fixed w-52 py-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 origin-top-right max-h-[60vh] overflow-y-auto ring-1 ring-black/5"
                        style={{
                            top: dropdownStyle.top,
                            right: dropdownStyle.right,
                            zIndex: 9999,
                        }}
                    >
                        {SUPPORTED_LANGUAGES.map(lang => (
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
                                    <span className="text-xs text-gray-500">{lang.name}</span>
                                </div>
                                {currentLanguage === lang.code && (
                                    <Check className="w-4 h-4 text-blue-400 flex-shrink-0" />
                                )}
                            </button>
                        ))}
                    </div>,
                    document.body
                )}
        </div>
    );
};

export default LanguageSelector;
