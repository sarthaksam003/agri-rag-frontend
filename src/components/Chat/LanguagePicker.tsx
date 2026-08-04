import { useState, useRef, useEffect } from 'react';
import { HiOutlineLanguage, HiOutlineChevronDown } from 'react-icons/hi2';
import { useConversationStore } from '@/features/conversation/store/conversation.store';

const LANGUAGES = [
  { code: 'or', label: 'ଓଡ଼ିଆ', labelEn: 'Odia', flag: '🇮🇳' },
  { code: 'en', label: 'English', labelEn: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'हिन्दी', labelEn: 'Hindi', flag: '🇮🇳' },
  { code: 'bn', label: 'বাংলা', labelEn: 'Bengali', flag: '🇮🇳' },
  { code: 'ta', label: 'தமிழ்', labelEn: 'Tamil', flag: '🇮🇳' },
  { code: 'te', label: 'తెలుగు', labelEn: 'Telugu', flag: '🇮🇳' },
  { code: 'mr', label: 'मराठी', labelEn: 'Marathi', flag: '🇮🇳' },
  { code: 'gu', label: 'ગુજરાતી', labelEn: 'Gujarati', flag: '🇮🇳' },
  { code: 'kn', label: 'ಕನ್ನಡ', labelEn: 'Kannada', flag: '🇮🇳' },
  { code: 'ml', label: 'മലയാളം', labelEn: 'Malayalam', flag: '🇮🇳' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ', labelEn: 'Punjabi', flag: '🇮🇳' },
];

const LanguagePicker = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { sourceLanguage, setSourceLanguage } = useConversationStore();

  const selected = LANGUAGES.find((l) => l.code === sourceLanguage) || LANGUAGES[0];

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    // document.addEventListener("mousedown", handler);

    return () =>
      document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-border
          hover:bg-surface-darker transition-colors text-sm"
        title="Select language for voice & TTS"
      >
        <HiOutlineLanguage className="w-4 h-4 text-odia-primary" />
        <span className="text-text-primary font-medium">{selected.label}</span>
        <HiOutlineChevronDown
          className={`w-3 h-3 text-text-muted transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute bottom-full mb-2 left-0 w-56 bg-white border border-border
          rounded-xl shadow-lg overflow-hidden z-50 animate-fade-in">
          <div className="px-3 py-2 border-b border-border">
            <p className="text-xs font-medium text-text-muted">
              Voice & TTS Language
            </p>
          </div>
          <div className="max-h-64 overflow-y-auto py-1">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setSourceLanguage(lang.code);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors
                  ${sourceLanguage === lang.code
                    ? 'bg-odia-bg text-odia-dark font-medium'
                    : 'text-text-secondary hover:bg-surface-darker'
                  }`}
              >
                <span className="text-base">{lang.flag}</span>
                <span>{lang.label}</span>
                <span className="text-xs text-text-muted ml-auto">{lang.labelEn}</span>
                {sourceLanguage === lang.code && (
                  <span className="w-2 h-2 rounded-full bg-odia-primary" />
                )}
              </button>
            ))}
          </div>
          <div className="px-3 py-2 border-t border-border">
            <p className="text-xs text-text-muted">
              Text chat works in any language automatically
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguagePicker;
