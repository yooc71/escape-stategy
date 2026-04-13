import { useState, useEffect } from 'react';

const SEQUENCE = [
  { text: 'You have made the decision.',                  delay: 600 },
  { text: 'The Little Monster is being cut off.',         delay: 2400 },
  { text: 'No more fuel. No more feeding.',               delay: 4200 },
  { text: 'It will try to trick you. Let it try.',        delay: 6000 },
  { text: 'You are free.', isFinal: true,                 delay: 8200 },
];

export default function EscapeCeremony({ onComplete }) {
  const [orbState, setOrbState] = useState('alive'); // 'alive' | 'dying' | 'dead'
  const [lines, setLines] = useState([]);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Slight pause then start the death sequence
    const startTimer = setTimeout(() => {
      setOrbState('dying');

      SEQUENCE.forEach(({ text, delay, isFinal }) => {
        setTimeout(() => {
          setLines((prev) => [...prev, { text, isFinal: !!isFinal }]);
          if (isFinal) {
            setTimeout(() => setOrbState('dead'), 900);
            setTimeout(() => setShowButton(true), 2000);
          }
        }, delay);
      });
    }, 700);

    return () => clearTimeout(startTimer);
  }, []);

  return (
    <div className="ceremony-screen">
      <div style={{ textAlign: 'center', width: '100%', maxWidth: 460 }}>

        {/* The Monster Orb */}
        <div className="monster-orb-wrap">
          {orbState === 'alive' && (
            <>
              <div className="monster-ring ring-1" />
              <div className="monster-ring ring-2" />
              <div className="monster-ring ring-3" />
            </>
          )}
          {orbState === 'dying' && (
            <>
              <div className="monster-ring ring-1" />
              <div className="monster-ring ring-2" />
            </>
          )}
          <div
            className={`monster-core monster-core-${orbState}`}
            style={orbState === 'dead' ? { background: 'radial-gradient(circle, #10B981 0%, rgba(16,185,129,0.25) 55%, transparent 100%)' } : {}}
          />
        </div>

        {/* Text sequence */}
        <div className="ceremony-texts">
          {lines.map((line, i) => (
            <p
              key={i}
              className={`ceremony-line${line.isFinal ? ' ceremony-line-final' : ''}`}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              {line.text}
            </p>
          ))}
        </div>

        {/* Continue button */}
        {showButton && (
          <button
            className="btn btn-gold mt-8"
            onClick={onComplete}
            style={{ animation: 'fadeUp 0.6s ease both', fontSize: '1.05rem', padding: '16px 40px' }}
          >
            Enter Freedom
          </button>
        )}
      </div>
    </div>
  );
}
