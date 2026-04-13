import { useState, useEffect } from 'react';
import { useT } from '../i18n';

function formatMoney(amount) {
  if (amount >= 10000) return `$${(amount / 1000).toFixed(1)}k`;
  if (amount >= 1000)  return `$${(amount / 1000).toFixed(2)}k`;
  return `$${amount.toFixed(2)}`;
}

function formatMinutes(totalMins) {
  if (totalMins < 60) return `${Math.floor(totalMins)}m`;
  const hours = totalMins / 60;
  if (hours < 48) return `${hours.toFixed(1)}h`;
  const days = hours / 24;
  return `${days.toFixed(1)}d`;
}

const STRATEGIST_MESSAGES = [
  "That craving you just felt - if you felt one - is the Monster's death rattle. It is not asking for a cigarette. It is dying and making noise about it. The discomfort is the sound of your freedom being purchased.",
  "Other people who have escaped using this method do not describe white-knuckling through it. They describe a quiet realisation: there was never anything to give up. You are experiencing that right now.",
  "The physical withdrawal - the actual nicotine craving - is no worse than mild hunger. Everything beyond that is just a thought pattern. And you have already seen through it.",
  "The money calculation on your screen is not hypothetical. It is yours. Every hour that passes adds to it. The Monster was not just stealing your lungs - it was stealing your wealth and your time, one cigarette at a time.",
  "If a thought comes - 'just one wouldn't hurt' - that is the Monster's last script. It has been using that line for years. It is not a new insight. It is a recorded message from an addiction that is running out of tricks.",
  "You did not need willpower to stop believing in Santa Claus. You just understood the truth. That is exactly what has happened here. The illusion is gone.",
  "21 days. The brain has substantially rewired by now. Not because you fought hard enough - because you understood clearly enough. Allen Carr was right about that.",
];

const STRATEGIST_MESSAGES_HE = [
  "התשוקה שהרגשת זה עתה - אם הרגשת - היא גסיסת המפלצת. היא לא מבקשת סיגריה. היא מתה ומשמיעה רעש בגלל זה. האי-נוחות היא קול החופש שלך שנרכש.",
  "אנשים שנמלטו בשיטה הזאת לא מתארים התאפקות בכוח. הם מתארים הבנה שקטה: מעולם לא היה מה לוותר עליו. אתה חווה את זה עכשיו.",
  "הגמילה הפיזית - התשוקה לניקוטין - אינה חמורה יותר מרעב קל. כל מה שמעבר לזה הוא רק דפוס מחשבה. וכבר ראית דרך זה.",
  "חישוב הכסף על המסך שלך אינו היפותטי. הוא שלך. כל שעה שעוברת מוסיפה לו. המפלצת לא רק גנבה את הריאות שלך - היא גנבה את עושרך ואת זמנך, סיגריה אחת בכל פעם.",
  "אם מגיעה מחשבה - 'אחת לא תזיק' - זה הסקריפט האחרון של המפלצת. היא השתמשה בשורה הזאת שנים. זה לא תובנה חדשה. זו הודעה מוקלטת מהתמכרות שנגמרים לה הקלפים.",
  "לא היית צריך רצון כדי להפסיק להאמין בסנטה קלאוס. פשוט הבנת את האמת. זה בדיוק מה שקרה כאן. האשליה נעלמה.",
  "21 יום. המוח עבר כבר שינוי מהותי. לא כי נלחמת מספיק חזק - כי הבנת מספיק ברור. אלן קאר צדק בעניין זה.",
];

const MILESTONES_EN = [
  { days: 1,  icon: '🌅', text: 'The first 24 hours. The hardest psychological moment - and you are through it.' },
  { days: 3,  icon: '🔋', text: 'Nicotine is almost fully cleared from your system. The physical dependency is dissolving.' },
  { days: 7,  icon: '🧠', text: 'One week free. Taste and smell are already sharper. Circulation is visibly improving.' },
  { days: 14, icon: '💪', text: 'Two weeks. Lung cilia are regenerating. Each breath is measurably more efficient.' },
  { days: 21, icon: '🎖', text: '21 days. The psychological rewiring is complete. You are not a smoker who stopped. You are a non-smoker.' },
];

const MILESTONES_HE = [
  { days: 1,  icon: '🌅', text: '24 השעות הראשונות. הרגע הפסיכולוגי הקשה ביותר - ועברת אותו.' },
  { days: 3,  icon: '🔋', text: 'הניקוטין כמעט לחלוטין פונה מהגוף שלך. התלות הפיזית מתמוססת.' },
  { days: 7,  icon: '🧠', text: 'שבוע חופשי. טעם וריח כבר חדים יותר. מחזור הדם משתפר.' },
  { days: 14, icon: '💪', text: 'שבועיים. ריסי הריאות מתחדשים. כל נשימה יעילה יותר.' },
  { days: 21, icon: '🎖', text: '21 יום. השיווץ הפסיכולוגי הושלם. אינך מעשן שהפסיק. אתה לא-מעשן.' },
];

export default function Phase2({ profile }) {
  const [now, setNow] = useState(Date.now());
  const t = useT(profile.preferredLanguage);
  const isHebrew = profile.preferredLanguage === 'Hebrew';

  const messages = isHebrew ? STRATEGIST_MESSAGES_HE : STRATEGIST_MESSAGES;
  const milestones = isHebrew ? MILESTONES_HE : MILESTONES_EN;

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const quitDate = profile.quitDate?.toDate
    ? profile.quitDate.toDate()
    : new Date((profile.quitDate?.seconds ?? 0) * 1000);

  const msSince     = now - quitDate.getTime();
  const daysFree    = Math.floor(msSince / 86_400_000);
  const hoursFree   = Math.floor((msSince % 86_400_000) / 3_600_000);
  const minsFree    = Math.floor((msSince % 3_600_000) / 60_000);
  const secsFree    = Math.floor((msSince % 60_000) / 1000);

  const totalCigs   = (msSince / 86_400_000) * profile.cigsPerDay;
  const money       = (totalCigs / (profile.packSize || 20)) * profile.packPrice;
  const lifeMinutes = totalCigs * 11;
  const timeMinutes = totalCigs * 6;

  const msgIndex     = Math.min(daysFree, messages.length - 1);
  const nextMilestone = milestones.find((m) => m.days > daysFree);
  const lastMilestone = [...milestones].reverse().find((m) => m.days <= daysFree);

  return (
    <div className="screen">
      <div className="mb-8 text-center">
        <p className="label mb-3">{t('phase1_label')}</p>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span className="days-num">{daysFree}</span>
          <div style={{ textAlign: isHebrew ? 'right' : 'left' }}>
            <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.2rem, 3.5vw, 1.6rem)', lineHeight: 1.1 }}>
              {t('days_free', daysFree)}
            </p>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.82rem', marginTop: 3 }}>
              {hoursFree}h {minsFree}m {secsFree}s
            </p>
          </div>
        </div>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.93rem', marginTop: 16, lineHeight: 1.6 }}>
          {t('phase2_intro', profile.name)}
        </p>
      </div>

      {lastMilestone && (
        <div className="card mb-4" style={{ background: 'rgba(16,185,129,0.05)', borderColor: 'rgba(16,185,129,0.22)', textAlign: 'center' }}>
          <p style={{ fontSize: '1.6rem', marginBottom: 8 }}>{lastMilestone.icon}</p>
          <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.05rem', lineHeight: 1.5, color: 'rgba(240,239,234,0.9)' }}>
            {lastMilestone.text}
          </p>
        </div>
      )}

      <p className="label mb-4">{t('god_view_label')}</p>
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">💰</div>
          <div className="metric-value">{formatMoney(money)}</div>
          <div className="metric-label">{t('money_label')}</div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">❤️</div>
          <div className="metric-value">{formatMinutes(lifeMinutes)}</div>
          <div className="metric-label">{t('life_label')}</div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">⏱</div>
          <div className="metric-value">{formatMinutes(timeMinutes)}</div>
          <div className="metric-label">{t('time_label')}</div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">🚭</div>
          <div className="metric-value">{Math.floor(totalCigs)}</div>
          <div className="metric-label">{t('cigs_label')}</div>
        </div>
      </div>

      <div className="card mt-4" style={{ background: 'rgba(245,158,11,0.04)', borderColor: 'rgba(245,158,11,0.18)' }}>
        <p className="label mb-3" style={{ color: 'var(--gold)' }}>{t('strategist_label')}</p>
        <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1rem, 2.8vw, 1.12rem)', lineHeight: 1.7, fontStyle: 'italic', color: 'rgba(240,239,234,0.82)' }}>
          "{messages[msgIndex]}"
        </p>
      </div>

      {nextMilestone && (
        <div className="card mt-4">
          <p className="label mb-2">{t('next_milestone')}</p>
          <p style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 4 }}>
            {nextMilestone.icon} Day {nextMilestone.days}
          </p>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.88rem', lineHeight: 1.6 }}>
            {nextMilestone.text}
          </p>
          <div style={{ marginTop: 14, height: 4, borderRadius: 50, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 50,
              background: 'linear-gradient(90deg, var(--gold), #FDE68A)',
              width: `${Math.min(100, (daysFree / nextMilestone.days) * 100)}%`,
              transition: 'width 1s ease',
            }} />
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-faint)', marginTop: 6 }}>
            {t('days_to_go', nextMilestone.days - daysFree)}
          </p>
        </div>
      )}

      {daysFree >= 21 && (
        <div className="card mt-4 text-center" style={{ background: 'rgba(245,158,11,0.06)', borderColor: 'rgba(245,158,11,0.25)' }}>
          <p style={{ fontSize: '2rem', marginBottom: 10 }}>🏆</p>
          <h3 className="display display-md mb-3">{t('milestone_final_title')}</h3>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', lineHeight: 1.65 }}>
            {t('milestone_final_body')}
          </p>
        </div>
      )}
    </div>
  );
}
