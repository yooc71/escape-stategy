function formatDate(ts) {
  if (!ts) return '';
  const d = ts.toDate ? ts.toDate() : new Date(ts.seconds * 1000);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

const TRIGGER_KEYS = {
  stress: 'trigger_stress', boredom: 'trigger_boredom', social: 'trigger_social',
  reward: 'trigger_reward', automatic: 'trigger_automatic', anxiety: 'trigger_anxiety',
  after_meal: 'trigger_after_meal', habit: 'trigger_habit',
};

export default function NotebookExport({ profile, onClose, t }) {
  const setupStr = formatDate(profile.setupDate);
  const progress = profile.homeworkProgress || {};
  const isRTL = profile.preferredLanguage === 'Hebrew' || profile.preferredLanguage === 'Arabic';

  const handlePrint = () => window.print();

  return (
    <div className="notebook-modal-overlay" onClick={onClose}>
      <div className="notebook-modal" onClick={(e) => e.stopPropagation()} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="notebook-modal-header">
          <div>
            <p className="label mb-1">{t('nb_printable')}</p>
            <h2 className="display display-md">
              {t('nb_day1_label').split(' - ')[0].replace('Day 1', setupStr)} - {setupStr}
            </h2>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-gold" style={{ padding: '10px 22px', fontSize: '0.88rem' }} onClick={handlePrint}>
              {t('nb_print_btn')}
            </button>
            <button className="btn btn-ghost" style={{ padding: '10px 18px', fontSize: '0.88rem' }} onClick={onClose}>
              {t('nb_close')}
            </button>
          </div>
        </div>

        <div className="notebook-content">
          <div className="nb-cover">
            <p className="label mb-2">{t('nb_printable')}</p>
            <h1 className="display display-xl" style={{ marginBottom: 8 }}>
              Escape Notebook - {setupStr}
            </h1>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.95rem' }}>
              {t('nb_subtitle', profile.name)}
            </p>
            <p style={{ color: 'var(--text-faint)', marginTop: 4, fontSize: '0.85rem' }}>
              {t('nb_details', profile.cigsPerDay, profile.packPrice)}
            </p>
          </div>

          <hr className="nb-divider" />

          <div className="nb-section">
            <div className="nb-section-label">{t('nb_day1_label')}</div>
            <h3 className="nb-section-title">{t('nb_day1_title')}</h3>
            {progress.letterContent
              ? <div className="nb-body">{progress.letterContent}</div>
              : <p className="nb-empty">{t('nb_not_completed')}</p>}
          </div>

          <hr className="nb-divider" />

          <div className="nb-section">
            <div className="nb-section-label">{t('nb_day2_label')}</div>
            <h3 className="nb-section-title">{t('nb_day2_title')}</h3>
            {progress.colorAuditData?.length > 0 ? (
              <div>
                <p style={{ color: 'var(--text-dim)', fontSize: '0.88rem', marginBottom: 12 }}>
                  {t('nb_day2_identified')}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {progress.colorAuditData.map((id) => (
                    <span key={id} className="nb-tag">{t(TRIGGER_KEYS[id] || id)}</span>
                  ))}
                </div>
                <p style={{ marginTop: 14, fontSize: '0.85rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
                  {t('nb_day2_conclusion')}
                </p>
              </div>
            ) : (
              <p className="nb-empty">{t('nb_not_completed')}</p>
            )}
          </div>

          <hr className="nb-divider" />

          <div className="nb-section">
            <div className="nb-section-label">{t('nb_day3_label')}</div>
            <h3 className="nb-section-title">{t('nb_day3_title')}</h3>
            {progress.tasteTasteContent
              ? <div className="nb-body">{progress.tasteTasteContent}</div>
              : <p className="nb-empty">{t('nb_not_completed')}</p>}
          </div>

          <hr className="nb-divider" />

          <div className="nb-section">
            <div className="nb-section-label">{t('nb_core_label')}</div>
            <h3 className="nb-section-title">{t('nb_core_title')}</h3>
            <ul className="nb-list">
              {t('nb_core_points').map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
