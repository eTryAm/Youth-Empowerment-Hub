'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import styles from './welcome-flower-shower.module.css';

const MOTIVATIONAL_MESSAGES = [
  'Dream Big. Start Small. Grow Every Day.',
  'Your Potential Has No Limits.',
  'Believe in Yourself. The World Is Waiting.',
  'Every Great Journey Begins With One Step.',
  'Be Curious. Be Courageous. Be Unstoppable.',
  'Your Future Is Built By What You Do Today.',
  'Small Steps Today. Extraordinary Achievements Tomorrow.',
  'Learn More. Explore More. Become More.',
  'You Are Capable of More Than You Imagine.',
  'The World Needs Your Ideas, Energy and Courage.',
  'Every Day Is Another Opportunity to Become Better.',
  'Greatness Begins When You Believe in Yourself.',
  'Keep Learning. Keep Growing. Keep Shining.',
  'Your Dreams Deserve Your Effort.',
  "Don’t Wait for Opportunities. Create Them.",
  'Be the Reason Someone Believes in Possibilities.',
  'Your Journey Matters. Your Effort Matters.',
  'A Brighter Future Begins With an Inspired Mind.',
  'Dare to Dream. Have the Courage to Achieve.',
  'Become the Inspiration You Once Needed.',
  'The Best Version of You Is Still Unfolding.',
  'Let Your Courage Be Louder Than Your Doubt.',
] as const;

type MotifKind = 'petal' | 'blossom' | 'sparkle' | 'glow';

type Motif = {
  kind: MotifKind;
  left: string;
  delay: string;
  duration: string;
  drift: string;
  size: string;
  rotation: string;
  opacity: string;
  color?: string;
};

const MOTIFS: readonly Motif[] = [
  { kind: 'petal', left: '3%', delay: '0ms', duration: '3300ms', drift: '9vw', size: '17px', rotation: '-24deg', opacity: '.9', color: '#f3a7b8' },
  { kind: 'blossom', left: '9%', delay: '160ms', duration: '3660ms', drift: '-7vw', size: '14px', rotation: '22deg', opacity: '.84', color: '#f7cad6' },
  { kind: 'sparkle', left: '14%', delay: '90ms', duration: '2750ms', drift: '5vw', size: '11px', rotation: '0deg', opacity: '.86', color: '#d6a340' },
  { kind: 'petal', left: '18%', delay: '390ms', duration: '3480ms', drift: '-11vw', size: '13px', rotation: '50deg', opacity: '.82', color: '#f8d2a6' },
  { kind: 'glow', left: '22%', delay: '250ms', duration: '3120ms', drift: '7vw', size: '12px', rotation: '0deg', opacity: '.72', color: '#f4d878' },
  { kind: 'petal', left: '27%', delay: '20ms', duration: '3820ms', drift: '-5vw', size: '21px', rotation: '-50deg', opacity: '.8', color: '#e9a6bd' },
  { kind: 'blossom', left: '32%', delay: '480ms', duration: '3290ms', drift: '11vw', size: '12px', rotation: '-16deg', opacity: '.87', color: '#fff5e8' },
  { kind: 'petal', left: '37%', delay: '120ms', duration: '3030ms', drift: '-9vw', size: '15px', rotation: '42deg', opacity: '.91', color: '#f0b5c8' },
  { kind: 'sparkle', left: '42%', delay: '310ms', duration: '2900ms', drift: '4vw', size: '8px', rotation: '0deg', opacity: '.76', color: '#c9942f' },
  { kind: 'petal', left: '47%', delay: '55ms', duration: '3710ms', drift: '-10vw', size: '19px', rotation: '-36deg', opacity: '.82', color: '#f6c7a5' },
  { kind: 'blossom', left: '52%', delay: '370ms', duration: '3200ms', drift: '8vw', size: '15px', rotation: '30deg', opacity: '.78', color: '#f4c5d5' },
  { kind: 'glow', left: '56%', delay: '110ms', duration: '3330ms', drift: '-3vw', size: '15px', rotation: '0deg', opacity: '.75', color: '#f9df91' },
  { kind: 'petal', left: '61%', delay: '440ms', duration: '3520ms', drift: '10vw', size: '14px', rotation: '58deg', opacity: '.88', color: '#efa8ba' },
  { kind: 'petal', left: '66%', delay: '195ms', duration: '3640ms', drift: '-8vw', size: '22px', rotation: '-20deg', opacity: '.77', color: '#fae1c7' },
  { kind: 'sparkle', left: '70%', delay: '35ms', duration: '2840ms', drift: '5vw', size: '10px', rotation: '0deg', opacity: '.8', color: '#d8a742' },
  { kind: 'blossom', left: '74%', delay: '500ms', duration: '3040ms', drift: '-10vw', size: '13px', rotation: '-28deg', opacity: '.86', color: '#f2bdcf' },
  { kind: 'petal', left: '79%', delay: '80ms', duration: '3410ms', drift: '6vw', size: '16px', rotation: '35deg', opacity: '.9', color: '#f6b9c9' },
  { kind: 'glow', left: '83%', delay: '290ms', duration: '3240ms', drift: '-6vw', size: '10px', rotation: '0deg', opacity: '.7', color: '#f6dc82' },
  { kind: 'petal', left: '87%', delay: '430ms', duration: '3560ms', drift: '7vw', size: '20px', rotation: '-44deg', opacity: '.78', color: '#f7d2ae' },
  { kind: 'blossom', left: '91%', delay: '145ms', duration: '3780ms', drift: '-9vw', size: '14px', rotation: '18deg', opacity: '.82', color: '#f6d5df' },
  { kind: 'sparkle', left: '96%', delay: '330ms', duration: '2730ms', drift: '-4vw', size: '9px', rotation: '0deg', opacity: '.8', color: '#c99832' },
  { kind: 'petal', left: '98%', delay: '15ms', duration: '3440ms', drift: '-12vw', size: '15px', rotation: '47deg', opacity: '.86', color: '#e9a6c0' },
];

function getMessageIndex() {
  const storedIndex = Number(window.localStorage.getItem('yeh-welcome-message-index'));
  const previousIndex = Number.isInteger(storedIndex) ? storedIndex : -1;
  const offset = Math.floor(Math.random() * (MOTIVATIONAL_MESSAGES.length - 1)) + 1;
  const nextIndex = previousIndex >= 0
    ? (previousIndex + offset) % MOTIVATIONAL_MESSAGES.length
    : Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length);

  window.localStorage.setItem('yeh-welcome-message-index', String(nextIndex));
  return nextIndex;
}

function motifStyle(motif: Motif): CSSProperties {
  return {
    '--left': motif.left,
    '--delay': motif.delay,
    '--duration': motif.duration,
    '--drift': motif.drift,
    '--size': motif.size,
    '--rotation': motif.rotation,
    '--motif-opacity': motif.opacity,
    '--motif-color': motif.color,
  } as CSSProperties;
}

export function WelcomeFlowerShower() {
  const [isVisible, setIsVisible] = useState(true);
  const messageRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    let messageIndex: number;

    try {
      messageIndex = getMessageIndex();
    } catch {
      messageIndex = Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length);
    }

    if (messageRef.current) {
      messageRef.current.textContent = MOTIVATIONAL_MESSAGES[messageIndex];
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dismissalTimer = window.setTimeout(
      () => setIsVisible(false),
      reducedMotion ? 2200 : 4600,
    );

    return () => window.clearTimeout(dismissalTimer);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div className={styles.overlay} aria-hidden="true">
      <div className={styles.motifs}>
        {MOTIFS.map((motif, index) => (
          <span
            key={`${motif.kind}-${index}`}
            className={`${styles.motif} ${styles[motif.kind]}`}
            style={motifStyle(motif)}
          />
        ))}
      </div>

      <div className={styles.messageWrap}>
        <p ref={messageRef} className={styles.message}>{MOTIVATIONAL_MESSAGES[0]}</p>
        <span className={styles.signature}>Youth Empowerment Hub</span>
      </div>
    </div>
  );
}
