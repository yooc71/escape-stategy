import { useState } from 'react';
import { serverTimestamp } from 'firebase/firestore';
import { useT } from '../i18n';

const LANGUAGES = [
  'English', 'Hebrew', 'Spanish', 'French', 'German',
  'Arabic', 'Portuguese', 'Russian', 'Italian', 'Japanese',
];

export default function Onboarding({ saveProfile }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [language, setLanguage] = useState('English');
  const [cigsPerDay, setCigsPerDay] = useState('');
  const [packPrice, setPackPrice] = useState('');
  const [saving, setSaving] = useState(false);

  const t = useT(language);

  const advance = (next) => {
    setStep(next);
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 80);
  };

  const handleSubmit = async () => {
    if (!name.trim() || !language || !cigsPerDay || !packPrice) return;
    setSaving(true);
    try {
      await saveProfile({
        name: name.trim(),
        preferredLanguage: language,
        cigsPerDay: parseInt(cigsPerDay, 10),
        packPrice: parseFloat(packPrice),
        packSize: 20,
        setupDate: serverTimestamp(),
        quitDate: null,
        homeworkProgress: {
          letter: false,
          letterContent: '',
          colorAudit: false,
          colorAuditData: [],
          tasteTaste: false,
          tasteTasteContent: '',
        },
      });
    } catch (err) {
      console.error(err);
      setSaving(false);
    }
  };

  // RTL only after Hebrew is selected
  const isRTL = language === 'Hebrew' || language === 'Arabic';

  return (
    <div className="onboarding-wrap" dir={isRTL ? 'rtl' : 'ltr'}>

      {/* Hero visual */}
      <div className="onboarding-hero" style={{ animation: 'fadeUp 0.7s ease both' }}>
        <div className="hero-visual">
          {/* Bird breaking free - SVG illustration */}
          <svg viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="hero-svg">
            {/* Broken chain links */}
            <g opacity="0.35">
              <rect x="130" y="175" width="22" height="14" rx="7" stroke="#F59E0B" strokeWidth="2.5" />
              <rect x="155" y="175" width="22" height="14" rx="7" stroke="#F59E0B" strokeWidth="2.5" />
              <line x1="152" y1="182" x2="155" y2="182" stroke="#F59E0B" strokeWidth="2" strokeDasharray="3 2" />
            </g>
            {/* Smoke wisps fading out */}
            <path d="M160 160 Q155 140 162 125 Q167 112 158 100" stroke="rgba(245,158,11,0.18)" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M168 155 Q175 138 168 122 Q163 110 170 98" stroke="rgba(245,158,11,0.12)" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M152 158 Q145 144 150 130 Q154 118 148 106" stroke="rgba(245,158,11,0.1)" strokeWidth="2" strokeLinecap="round" fill="none" />
            {/* Central bird / figure soaring */}
            {/* Body */}
            <ellipse cx="160" cy="90" rx="14" ry="9" fill="rgba(245,158,11,0.9)" />
            {/* Left wing - spread */}
            <path d="M146 90 Q118 68 95 75 Q110 88 130 92" fill="rgba(245,158,11,0.85)" />
            <path d="M146 90 Q115 72 92 80" stroke="rgba(245,158,11,0.5)" strokeWidth="1.5" fill="none" />
            {/* Right wing - spread */}
            <path d="M174 90 Q202 68 225 75 Q210 88 190 92" fill="rgba(245,158,11,0.85)" />
            <path d="M174 90 Q205 72 228 80" stroke="rgba(245,158,11,0.5)" strokeWidth="1.5" fill="none" />
            {/* Tail */}
            <path d="M160 99 Q155 115 148 118 Q157 110 160 118 Q163 110 172 118 Q165 115 160 99Z" fill="rgba(245,158,11,0.75)" />
            {/* Head */}
            <circle cx="172" cy="84" r="8" fill="rgba(245,158,11,0.95)" />
            {/* Eye */}
            <circle cx="175" cy="82" r="1.8" fill="#0D0D14" />
            {/* Beak */}
            <path d="M179 84 L185 83 L179 86Z" fill="#D97706" />
            {/* Glow */}
            <ellipse cx="160" cy="90" rx="40" ry="28" fill="rgba(245,158,11,0.07)" />
            {/* Stars / freedom sparkles */}
            <circle cx="90" cy="55" r="2" fill="rgba(245,158,11,0.6)" />
            <circle cx="230" cy="60" r="2" fill="rgba(245,158,11,0.6)" />
            <circle cx="70" cy="100" r="1.5" fill="rgba(245,158,11,0.4)" />
            <circle cx="248" cy="95" r="1.5" fill="rgba(245,158,11,0.4)" />
            <circle cx="115" cy="40" r="1.5" fill="rgba(245,158,11,0.35)" />
            <circle cx="205" cy="42" r="1.5" fill="rgba(245,158,11,0.35)" />
            <circle cx="160" cy="30" r="2.5" fill="rgba(245,158,11,0.5)" />
          </svg>
        </div>
        <h1 className="display display-xl hero-title">The Escape<br />Strategist</h1>
        <p className="hero-sub">
          No willpower required. No sacrifice. Just the truth - and the Monster dies on its own.
        </p>
      </div>

      {/* Step 0 - Name */}
      <div className="dialogue-step" style={{ animationDelay: '0.1s' }}>
        <p className="dialogue-q">{t('q_name')}</p>
        <input
          className="input"
          type="text"
          placeholder={t('q_name_placeholder')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && name.trim() && step === 0 && advance(1)}
          autoFocus
        />
        {step === 0 && name.trim() && (
          <button
            className="btn btn-gold mt-4"
            onClick={() => advance(1)}
            style={{ animation: 'fadeUp 0.35s ease both' }}
          >
            {t('q_name_btn')}
          </button>
        )}
      </div>

      {/* Step 1 - Language */}
      {step >= 1 && (
        <div className="dialogue-step" style={{ animationDelay: '0s' }}>
          <p className="dialogue-q">{t('q_language')}</p>
          <div className="chip-grid">
            {LANGUAGES.map((lang) => (
              <button
                key={lang}
                className={`chip ${language === lang ? 'active' : ''}`}
                onClick={() => {
                  setLanguage(lang);
                  if (step === 1) advance(2);
                }}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2 - Cigs per day */}
      {step >= 2 && (
        <div className="dialogue-step" style={{ animationDelay: '0s' }}>
          <p className="dialogue-q">{t('q_cigs')}</p>
          <input
            className="input"
            type="number"
            placeholder={t('q_cigs_placeholder')}
            min="1"
            max="200"
            value={cigsPerDay}
            onChange={(e) => setCigsPerDay(e.target.value)}
            onKeyDown={(e) =>
              e.key === 'Enter' && cigsPerDay && parseInt(cigsPerDay) > 0 && step === 2 && advance(3)
            }
            autoFocus
          />
          {step === 2 && cigsPerDay && parseInt(cigsPerDay) > 0 && (
            <button
              className="btn btn-gold mt-4"
              onClick={() => advance(3)}
              style={{ animation: 'fadeUp 0.35s ease both' }}
            >
              {t('q_cigs_btn')}
            </button>
          )}
        </div>
      )}

      {/* Step 3 - Pack price */}
      {step >= 3 && (
        <div className="dialogue-step" style={{ animationDelay: '0s' }}>
          <p className="dialogue-q">{t('q_price')}</p>
          <input
            className="input"
            type="number"
            placeholder={t('q_price_placeholder')}
            min="0.01"
            step="0.01"
            value={packPrice}
            onChange={(e) => setPackPrice(e.target.value)}
            autoFocus
          />
          {packPrice && parseFloat(packPrice) > 0 && (
            <button
              className="btn btn-escape btn-full mt-6"
              onClick={handleSubmit}
              disabled={saving}
              style={{ animation: 'fadeUp 0.4s ease both' }}
            >
              {saving ? t('q_saving') : t('q_submit')}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
