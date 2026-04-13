import { useState, useEffect } from 'react';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, APP_ID, IS_CONFIGURED } from './firebase';
import AuraBackground from './components/AuraBackground';
import Onboarding from './components/Onboarding';
import Phase1 from './components/Phase1';
import EscapeCeremony from './components/EscapeCeremony';
import Phase2 from './components/Phase2';
import StrategistChat from './components/StrategistChat';

export default function App() {
  const [userId, setUserId] = useState(null);
  const [profile, setProfile] = useState(undefined);
  const [ceremonyMode, setCeremonyMode] = useState(false);
  const [configError, setConfigError] = useState(!IS_CONFIGURED);

  // RTL for Hebrew
  const isRTL = profile?.preferredLanguage === 'Hebrew';

  // Anonymous auth on mount
  useEffect(() => {
    if (!IS_CONFIGURED) return;
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        try {
          const { user: anon } = await signInAnonymously(auth);
          setUserId(anon.uid);
        } catch (err) {
          console.error('Auth error:', err);
          setConfigError(true);
        }
      }
    });
    return unsub;
  }, []);

  // Real-time profile listener
  useEffect(() => {
    if (!userId) return;
    const ref = doc(db, `artifacts/${APP_ID}/users/${userId}`);
    const unsub = onSnapshot(
      ref,
      (snap) => setProfile(snap.exists() ? snap.data() : null),
      (err) => {
        console.error('Firestore error:', err);
        setConfigError(true);
      }
    );
    return unsub;
  }, [userId]);

  const saveProfile = async (data) => {
    const ref = doc(db, `artifacts/${APP_ID}/users/${userId}`);
    await setDoc(ref, data, { merge: true });
  };

  const startEscapeCeremony = () => setCeremonyMode(true);

  const completeEscapeCeremony = async () => {
    await saveProfile({ quitDate: serverTimestamp() });
    setCeremonyMode(false);
  };

  // Firebase not configured
  if (configError) {
    return (
      <div className="app">
        <AuraBackground />
        <div className="loading-screen">
          <div className="card text-center" style={{ maxWidth: 400, padding: '36px 32px' }}>
            <p style={{ fontSize: '2rem', marginBottom: 16 }}>🔧</p>
            <h2 className="display display-md mb-4">Firebase Setup Required</h2>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 20 }}>
              Copy <code style={{ background: 'rgba(255,255,255,0.08)', padding: '2px 6px', borderRadius: 6 }}>.env.example</code> to{' '}
              <code style={{ background: 'rgba(255,255,255,0.08)', padding: '2px 6px', borderRadius: 6 }}>.env</code>,
              fill in your Firebase project credentials, and restart the dev server.
            </p>
            <p style={{ color: 'var(--text-faint)', fontSize: '0.8rem' }}>
              Firebase Console - Project Settings - Your apps
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Still initializing
  if (profile === undefined || !userId) {
    return (
      <div className="app">
        <AuraBackground />
        <div className="loading-screen">
          <div className="loading-pulse" />
          <p style={{ color: 'var(--text-dim)', fontSize: '0.88rem', letterSpacing: '0.05em' }}>
            Preparing your strategy...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="app" dir={isRTL ? 'rtl' : 'ltr'}>
      <AuraBackground />

      {ceremonyMode && (
        <EscapeCeremony onComplete={completeEscapeCeremony} />
      )}

      {!ceremonyMode && profile === null && (
        <Onboarding saveProfile={saveProfile} />
      )}

      {!ceremonyMode && profile !== null && !profile.quitDate && (
        <Phase1
          profile={profile}
          saveProfile={saveProfile}
          onEscape={startEscapeCeremony}
        />
      )}

      {!ceremonyMode && profile !== null && profile.quitDate && (
        <Phase2 profile={profile} />
      )}

      {/* Floating Strategist chat - shown once profile exists */}
      {profile !== null && !ceremonyMode && (
        <StrategistChat profile={profile} />
      )}
    </div>
  );
}
