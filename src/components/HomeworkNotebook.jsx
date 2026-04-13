import { useState } from 'react';
import NotebookExport from './NotebookExport';

const TRIGGER_KEYS = [
  { id: 'stress',     colorKey: 'trigger_stress',     color: '#EF4444' },
  { id: 'boredom',    colorKey: 'trigger_boredom',    color: '#3B82F6' },
  { id: 'social',     colorKey: 'trigger_social',     color: '#22C55E' },
  { id: 'reward',     colorKey: 'trigger_reward',     color: '#F59E0B' },
  { id: 'automatic',  colorKey: 'trigger_automatic',  color: '#A855F7' },
  { id: 'anxiety',    colorKey: 'trigger_anxiety',    color: '#EC4899' },
  { id: 'after_meal', colorKey: 'trigger_after_meal', color: '#F97316' },
  { id: 'habit',      colorKey: 'trigger_habit',      color: '#6B7280' },
];

export default function HomeworkNotebook({ profile, saveProfile, daysSinceStart, t }) {
  const [openTask, setOpenTask] = useState(null);
  const [showNotebook, setShowNotebook] = useState(false);
  const progress = profile.homeworkProgress || {};

  const [letterText, setLetterText]     = useState(progress.letterContent || '');
  const [savingLetter, setSavingLetter] = useState(false);
  const [letterFlash, setLetterFlash]   = useState(false);

  const [selectedTriggers, setSelectedTriggers] = useState(progress.colorAuditData || []);
  const [savingAudit, setSavingAudit]           = useState(false);
  const [auditFlash, setAuditFlash]             = useState(false);

  const [tasteText, setTasteText]       = useState(progress.tasteTasteContent || '');
  const [savingTaste, setSavingTaste]   = useState(false);
  const [tasteFlash, setTasteFlash]     = useState(false);

  const day2Unlocked = daysSinceStart >= 1 || progress.letter;
  const day3Unlocked = daysSinceStart >= 2 || (progress.letter && progress.colorAudit);

  const toggle = (key, unlocked) => {
    if (!unlocked) return;
    setOpenTask(openTask === key ? null : key);
  };

  const saveLetter = async () => {
    if (!letterText.trim()) return;
    setSavingLetter(true);
    await saveProfile({ homeworkProgress: { ...progress, letter: true, letterContent: letterText } });
    setSavingLetter(false);
    setLetterFlash(true);
    setOpenTask(null);
  };

  const saveAudit = async () => {
    if (selectedTriggers.length === 0) return;
    setSavingAudit(true);
    await saveProfile({ homeworkProgress: { ...progress, colorAudit: true, colorAuditData: selectedTriggers } });
    setSavingAudit(false);
    setAuditFlash(true);
    setOpenTask(null);
  };

  const saveTaste = async () => {
    if (!tasteText.trim()) return;
    setSavingTaste(true);
    await saveProfile({ homeworkProgress: { ...progress, tasteTaste: true, tasteTasteContent: tasteText } });
    setSavingTaste(false);
    setTasteFlash(true);
    setOpenTask(null);
  };

  const toggleTrigger = (id) =>
    setSelectedTriggers((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const allDone = progress.letter && progress.colorAudit && progress.tasteTaste;
  const completedCount = [progress.letter, progress.colorAudit, progress.tasteTaste].filter(Boolean).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="label">{t('notebook_label')}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 600 }}>
            {t('progress', completedCount)}
          </p>
          {allDone && (
            <button
              className="btn btn-ghost"
              style={{ padding: '7px 16px', fontSize: '0.8rem' }}
              onClick={() => setShowNotebook(true)}
            >
              {t('view_notebook')}
            </button>
          )}
        </div>
      </div>

      {/* Task 01 - Day 1 */}
      <TaskCard
        num="01" day={1}
        title={t('task1_title')} sub={t('task1_sub')}
        unlocked={true} done={progress.letter}
        open={openTask === 'letter'}
        onToggle={() => toggle('letter', true)}
        flash={letterFlash}
        flashTitle={t('completion_letter_title')}
        flashMsg={t('completion_letter_msg')}
      >
        <p className="task-instr">{t('task1_instr')}</p>
        <textarea
          className="input textarea"
          placeholder={t('task1_placeholder')}
          value={letterText}
          onChange={(e) => setLetterText(e.target.value)}
        />
        <button
          className="btn btn-gold mt-4"
          onClick={saveLetter}
          disabled={!letterText.trim() || savingLetter}
        >
          {savingLetter ? t('task1_saving') : t('task1_btn')}
        </button>
      </TaskCard>

      {/* Task 02 - Day 2 */}
      <TaskCard
        num="02" day={2}
        title={t('task2_title')} sub={t('task2_sub')}
        unlocked={day2Unlocked} done={progress.colorAudit}
        open={openTask === 'colorAudit'}
        onToggle={() => toggle('colorAudit', day2Unlocked)}
        flash={auditFlash}
        flashTitle={t('completion_audit_title')}
        flashMsg={t('completion_audit_msg')}
      >
        <p className="task-instr">{t('task2_instr')}</p>
        <div className="trigger-grid">
          {TRIGGER_KEYS.map((trg) => {
            const active = selectedTriggers.includes(trg.id);
            return (
              <button
                key={trg.id}
                className="trigger-chip"
                onClick={() => toggleTrigger(trg.id)}
                style={active ? {
                  background: `${trg.color}18`,
                  borderColor: `${trg.color}65`,
                  color: trg.color,
                } : {}}
              >
                <span className="trigger-dot" style={{ background: trg.color }} />
                {t(trg.colorKey)}
              </button>
            );
          })}
        </div>
        {selectedTriggers.length > 0 && (
          <p style={{ fontSize: '0.83rem', color: 'var(--text-dim)', marginTop: 10 }}>
            {t('task2_count', selectedTriggers.length)}
          </p>
        )}
        <button
          className="btn btn-gold mt-4"
          onClick={saveAudit}
          disabled={selectedTriggers.length === 0 || savingAudit}
        >
          {savingAudit ? t('task2_saving') : t('task2_btn')}
        </button>
      </TaskCard>

      {/* Task 03 - Day 3 */}
      <TaskCard
        num="03" day={3}
        title={t('task3_title')} sub={t('task3_sub')}
        unlocked={day3Unlocked} done={progress.tasteTaste}
        open={openTask === 'tasteTaste'}
        onToggle={() => toggle('tasteTaste', day3Unlocked)}
        flash={tasteFlash}
        flashTitle={t('completion_taste_title')}
        flashMsg={t('completion_taste_msg')}
      >
        <p className="task-instr">{t('task3_instr')}</p>
        <textarea
          className="input textarea"
          placeholder={t('task3_placeholder')}
          value={tasteText}
          onChange={(e) => setTasteText(e.target.value)}
        />
        <button
          className="btn btn-gold mt-4"
          onClick={saveTaste}
          disabled={!tasteText.trim() || savingTaste}
        >
          {savingTaste ? t('task3_saving') : t('task3_btn')}
        </button>
      </TaskCard>

      {showNotebook && (
        <NotebookExport profile={profile} onClose={() => setShowNotebook(false)} t={t} />
      )}
    </div>
  );
}

function TaskCard({ num, day, title, sub, unlocked, done, open, onToggle, children, flash, flashTitle, flashMsg }) {
  const status = done ? 'done' : open ? 'open' : 'idle';
  return (
    <div className={`task-card ${done ? 'done' : ''} ${!unlocked ? 'locked' : ''}`}>
      <div className="task-header" onClick={onToggle} style={{ cursor: unlocked ? 'pointer' : 'default' }}>
        <div className={`task-num task-num-${status}`}>
          {done ? '✓' : num}
        </div>
        <div style={{ flex: 1 }}>
          <div className="task-title" style={!unlocked ? { color: 'var(--text-faint)' } : {}}>
            {title}
          </div>
          <div className="task-sub">{sub}</div>
        </div>
        {!unlocked ? (
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-faint)', letterSpacing: '0.06em' }}>
            Day {day}
          </span>
        ) : (
          <span style={{ color: 'var(--text-faint)', fontSize: '1.3rem', lineHeight: 1 }}>
            {open ? '−' : done ? '' : '+'}
          </span>
        )}
      </div>

      {flash && (
        <div className="task-completion" style={{ animation: 'fadeUp 0.5s ease both' }}>
          <p style={{ fontWeight: 800, color: 'var(--green)', marginBottom: 6 }}>{flashTitle}</p>
          <p style={{ fontSize: '0.88rem', color: 'rgba(240,239,234,0.78)', lineHeight: 1.65, fontStyle: 'italic' }}>
            "{flashMsg}"
          </p>
        </div>
      )}

      {open && !flash && (
        <div className="task-body" style={{ animation: 'fadeUp 0.3s ease both' }}>
          {children}
        </div>
      )}
    </div>
  );
}
