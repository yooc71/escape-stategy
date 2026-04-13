import { useMemo } from 'react';
import HomeworkNotebook from './HomeworkNotebook';
import { useT } from '../i18n';

export default function Phase1({ profile, saveProfile, onEscape }) {
  const t = useT(profile.preferredLanguage);

  const daysSinceStart = useMemo(() => {
    if (!profile.setupDate) return 0;
    const setup = profile.setupDate.toDate
      ? profile.setupDate.toDate()
      : new Date(profile.setupDate.seconds * 1000);
    return Math.floor((Date.now() - setup.getTime()) / 86_400_000);
  }, [profile.setupDate]);

  const allDone =
    profile.homeworkProgress?.letter &&
    profile.homeworkProgress?.colorAudit &&
    profile.homeworkProgress?.tasteTaste;

  return (
    <div className="screen">
      {/* Header */}
      <div className="mb-8">
        <p className="label mb-2">{t('phase1_label')}</p>
        <h1 className="display display-xl">
          {t('phase1_title')}{' '}
          <em style={{ fontStyle: 'italic', color: 'rgba(240,239,234,0.75)' }}>
            {t('phase1_subtitle')}
          </em>
        </h1>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.95rem', marginTop: 14, lineHeight: 1.6 }}>
          {t('phase1_intro', profile.name, daysSinceStart + 1)}
        </p>
      </div>

      {/* Command Banner */}
      <div className="command-banner">
        <p className="command-label">{t('command_label')}</p>
        <p className="command-text">{t('command_text')}</p>
      </div>

      {/* Homework Notebook */}
      <HomeworkNotebook
        profile={profile}
        saveProfile={saveProfile}
        daysSinceStart={daysSinceStart}
        t={t}
      />

      {/* Escape Trigger */}
      {allDone && (
        <div
          className="card mt-8 text-center"
          style={{
            animation: 'fadeUp 0.6s ease both',
            background: 'rgba(245,158,11,0.05)',
            borderColor: 'rgba(245,158,11,0.2)',
          }}
        >
          <p style={{ fontSize: '1.8rem', marginBottom: 12 }}>🎯</p>
          <p className="label mb-3" style={{ color: 'var(--gold)' }}>
            {t('all_done_label')}
          </p>
          <h2
            className="display display-md mb-6"
            style={{ color: 'var(--text)', lineHeight: 1.4 }}
          >
            {t('all_done_title')}
          </h2>
          <button className="btn btn-escape" onClick={onEscape}>
            {t('initiate_escape')}
          </button>
        </div>
      )}

      {!allDone && (
        <p
          style={{
            textAlign: 'center',
            color: 'var(--text-faint)',
            fontSize: '0.82rem',
            marginTop: 32,
            lineHeight: 1.6,
            whiteSpace: 'pre-line',
          }}
        >
          {t('not_done_hint')}
        </p>
      )}
    </div>
  );
}
