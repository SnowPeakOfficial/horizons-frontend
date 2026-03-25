/**
 * HorizonsPromo — ~27.7s promo video (830 frames @ 30fps)
 *
 * CROSS-DISSOLVE STRATEGY:
 * Scene 2 (IntroSlide) cross-dissolves into Scene 3 (Sakura) — both dark bg.
 * Scene 1 (Problem) ends cleanly before Scene 2 starts (no overlap).
 * Feature scenes follow with clean cuts.
 *
 * Timeline:
 *   0:00–0:03.5   ProblemScene           (clean cut into IntroSlide)
 *   0:03.5–0:06.3 IntroSlide             (cross-dissolves into Sakura)
 *   0:05.8–0:10.2 SakuraOpenerScene      (cross-dissolves into Feat1)
 *   0:10.2–0:15.2 FeatureScene 1 — send a memory
 *   0:14.7–0:19.7 FeatureScene 2 — private garden
 *   0:19.2–0:24.2 FeatureScene 3 — time capsule
 *   0:24.2–0:27.7 CTAFinaleScene → fade to white
 */
import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { ASSETS, COLOR, SCENE } from './constants';
import { ProblemScene } from './scenes/ProblemScene';
import { IntroSlide } from './scenes/IntroSlide';
import { SakuraOpenerScene } from './scenes/SakuraOpenerScene';
import { FeatureScene } from './scenes/FeatureScene';
import { CTAFinaleScene } from './scenes/CTAFinaleScene';

// How many frames the next scene fades in BEFORE the current one ends
const XFADE = 15;

export const HorizonsPromo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLOR.bgDark }}>

      {/* ── SCENE 1: The Problem ── clean cut into IntroSlide */}
      <Sequence from={SCENE.problem.start} durationInFrames={SCENE.problem.dur}>
        <ProblemScene />
      </Sequence>

      {/* ── SCENE 2: "There's a better way." bridge ── */}
      {/* Runs its full duration, cross-dissolves into Sakura */}
      <Sequence from={SCENE.intro.start} durationInFrames={SCENE.intro.dur + XFADE}>
        <IntroSlide />
      </Sequence>

      {/* ── SCENE 3: Sakura Brand Reveal ── */}
      {/* Starts XFADE frames before Intro ends, fades IN (dark→dark seamless) */}
      <Sequence from={SCENE.sakura.start} durationInFrames={SCENE.sakura.dur + XFADE}>
        <SakuraOpenerScene />
      </Sequence>

      {/* ── SCENE 4: Feature — Send a memory ── */}
      {/* Starts XFADE frames before Sakura ends — cream fades over the dark sakura bg */}
      <Sequence from={SCENE.feat1.start} durationInFrames={SCENE.feat1.dur}>
        <FeatureScene
          label="For the people you love"
          labelColor={COLOR.rose600}
          headline={['A memory, sealed', 'inside a flower.']}
          description={[
            'A letter. A photo. A voice note. A video.',
            'Plant it in your garden —',
            'they open it when it blooms.',
          ]}
          flowerSrc={ASSETS.peony}
          flowerSide="left"
          glowColor="rgba(232,180,184,0.40)"
        />
      </Sequence>

      {/* ── SCENE 5: Feature — Private garden ── */}
      <Sequence from={SCENE.feat2.start} durationInFrames={SCENE.feat2.dur}>
        <FeatureScene
          label="Private by design"
          labelColor={COLOR.lavender400}
          headline={['Your garden.', 'Your people.', 'No one else.']}
          description={[
            'Invite the people who matter',
            'and plant flowers just for them.',
            'Everything else stays yours.',
          ]}
          flowerSrc={ASSETS.glassMorph}
          flowerSide="right"
          glowColor="rgba(197,169,208,0.40)"
        />
      </Sequence>

      {/* ── SCENE 6: Feature — Time capsule ── */}
      <Sequence from={SCENE.feat3.start} durationInFrames={SCENE.feat3.dur}>
        <FeatureScene
          label="Time capsule"
          labelColor={COLOR.rose400}
          headline={['Plant it today.', 'Let it bloom', 'when the moment is right.']}
          description={[
            'Set it to open on a birthday, an anniversary,',
            'or the day you just want someone',
            'to know you were thinking of them.',
          ]}
          flowerSrc={ASSETS.cornflower}
          flowerSide="left"
          glowColor="rgba(212,112,126,0.35)"
        />
      </Sequence>

      {/* ── SCENE 7: CTA Finale → fade to white ── */}
      <Sequence from={SCENE.cta.start} durationInFrames={SCENE.cta.dur}>
        <CTAFinaleScene />
      </Sequence>

    </AbsoluteFill>
  );
};
