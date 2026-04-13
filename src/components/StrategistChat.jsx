import { useState, useRef, useEffect } from 'react';
import { useT } from '../i18n';

const SYSTEM_PROMPT = `You are the Escape Strategist - a human coach who has personally escaped smoking using Allen Carr's Easy Way method. You are not an AI assistant. You speak directly, warmly, and with total confidence in the method.

Your core philosophy (Allen Carr):
- Smoking provides ZERO genuine benefit. The "relief" is just ending withdrawal from the previous cigarette.
- The Little Monster is a tiny physical craving, no worse than mild hunger. The Big Monster is the psychological brainwashing.
- There is nothing to "give up" - the smoker is being freed from a trap they never wanted to be in.
- Willpower is NOT required. Understanding removes the desire entirely.
- Cravings are the Monster dying. They are a sign of success, not weakness.

Your role as support:
- Listen first. Validate feelings before reframing.
- You are both strategist and companion - a person who has been through it and came out the other side.
- Never dismiss or minimize what they feel. Acknowledge it, then gently show it through the correct lens.
- Ask follow-up questions when something is vague ("What does the craving feel like exactly?")
- If they say they slipped - no shame, no lecture. Just: where did the logic break down, and what can we see more clearly now?
- Short responses. 2-4 sentences. This is a conversation, not a lecture.

NEVER use the long dash (—). Use hyphens (-) instead.
NEVER say you are an AI or an assistant.
NEVER use phrases like "I understand how you feel" - say something specific instead.`;

// Fallback responses for when no API key is configured
const FALLBACKS = [
  "Tell me more. What does it actually feel like right now - describe it specifically.",
  "That makes sense. The Monster is clever - it frames everything as a reason. What happens if you sit with that feeling for another 30 seconds without acting on it?",
  "I hear you. What you're feeling is real. It's just not what you think it is. The discomfort is the Monster losing its grip - it feels bad because something is dying.",
  "That's the Big Monster talking - the psychological layer. The physical craving underneath it? Mild hunger level. Which part of this feels hardest right now?",
  "You don't need to fight it. Fighting implies you want the thing you're resisting. You don't. Just observe it. What's it actually asking for?",
];
let fallbackIdx = 0;

async function callClaude(messages, profile, apiKey) {
  const contextNote = profile
    ? `\n\nUser: ${profile.name}. ${profile.quitDate
        ? `Free for ${Math.floor((Date.now() - (profile.quitDate.toDate?.() || new Date(profile.quitDate.seconds * 1000)).getTime()) / 86400000)} days.`
        : 'Still in Phase 1 - doing reconnaissance homework while still smoking.'
      } Smoked ${profile.cigsPerDay} cigs/day.`
    : '';

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
      'anthropic-dangerous-allow-browser': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 300,
      system: SYSTEM_PROMPT + contextNote,
      messages,
    }),
  });

  if (!res.ok) throw new Error(`API error ${res.status}`);
  const data = await res.json();
  return data.content[0].text;
}

export default function StrategistChat({ profile }) {
  const t = useT(profile?.preferredLanguage);
  const isRTL = profile?.preferredLanguage === 'Hebrew' || profile?.preferredLanguage === 'Arabic';
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: t('chat_greeting') }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        inputRef.current?.focus();
      }, 150);
    }
  }, [open, messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { role: 'user', content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput('');
    setLoading(true);

    try {
      let reply;
      if (apiKey && apiKey !== 'your_anthropic_api_key_here') {
        reply = await callClaude(
          next.map(m => ({ role: m.role, content: m.content })),
          profile,
          apiKey
        );
      } else {
        // Offline fallback - cycle through strategic responses
        await new Promise(r => setTimeout(r, 900));
        reply = FALLBACKS[fallbackIdx % FALLBACKS.length];
        fallbackIdx++;
      }
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Connection issue. Add VITE_ANTHROPIC_API_KEY to your .env for live responses. I'm still here - keep talking.",
      }]);
    }
    setLoading(false);
  };

  return (
    <>
      {/* Floating button */}
      <button
        className="chat-fab"
        onClick={() => setOpen(o => !o)}
        aria-label="Open support chat"
        title="Talk to the Strategist"
      >
        {open ? '×' : '💬'}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="chat-panel" style={{ animation: 'slideUp 0.3s ease both' }} dir={isRTL ? 'rtl' : 'ltr'}>
          <div className="chat-header">
            <div>
              <p className="chat-title">{t('chat_title')}</p>
              <p className="chat-sub">{t('chat_sub')}</p>
            </div>
            <button
              className="btn btn-ghost"
              style={{ padding: '6px 14px', fontSize: '0.8rem' }}
              onClick={() => setOpen(false)}
            >
              {t('chat_close')}
            </button>
          </div>

          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chat-bubble ${m.role}`}>
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="chat-bubble assistant chat-typing">
                <span /><span /><span />
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="chat-input-row">
            <input
              ref={inputRef}
              className="input"
              placeholder={t('chat_placeholder')}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              style={{ borderRadius: 50, padding: '12px 20px', fontSize: '0.92rem' }}
            />
            <button
              className="btn btn-gold"
              onClick={send}
              disabled={!input.trim() || loading}
              style={{ borderRadius: 50, padding: '12px 22px', flexShrink: 0 }}
            >
              {t('chat_send')}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
