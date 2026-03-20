/**
 * HorizonsPromo — ~32.5s promo video (975 frames @ 30fps)
 *
 * CROSS-DISSOLVE STRATEGY:
 * Scenes 1→2→3 overlap by XFADE frames. Each scene only fades IN (not out).
 * The next scene layers on top and fades in, creating a true cross-dissolve
 * with no dip to black/dark between them.
 *
 * Scene 1 (Problem):    0  → 105   — starts at 0, runs 105f
 * Scene 1.5 (Intro):   90 → 165   — starts 15f before Problem ends, 75f long
 * Scene 2 (Sakura):   150 → 270   — starts 15f before Intro ends, 120f long
 * Scene 3 (Feat1):    255 → 405   — starts 15f before Sakura ends, 150f long
 * Remaining scenes follow without overlap (already distinct cuts are fine)
 *
 * Timeline (displayed):
 *   0:00–0:03.5   ProblemScene
 *   0:03–0:05.5   IntroSlide        (cross-dissolves over Problem)
 *   0:05–0:09     SakuraOpenerScene (cross-dissolves over IntroSlide)
 *   0:08.5–0:13.5 FeatureScene      (cross-dissolves over Sakura)
 *   0:13–0:18     FeatureScene 2
 *   0:17.5–0:22.5 FeatureScene 3
 *   0:22–0:25     SocialProofScene
 *   0:24.5–0:29.5 SummaryPillsScene (5s)
 *   0:29–0:32.5   CTAFinaleScene → fade to white
 */
import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { ASSETS, COLOR, SCENE } from './constants';
import { ProblemScene } from './scenes/ProblemScene';
import { IntroSlide } from './scenes/IntroSlide';
import { SakuraOpenerScene } from './scenes/SakuraOpenerScene';
import { FeatureScene } from './scenes/FeatureScene';
import { SocialProofScene } from './scenes/SocialProofScene';
import { SummaryPillsScene } from './scenes/SummaryPillsScene';
import { CTAFinaleScene } from './scenes/CTAFinaleScene';

// How many frames the next scene fades in BEFORE the current one ends
const XFADE = 15;

export const HorizonsPromo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLOR.bgDark }}>

      {/* ── SCENE 1: The Problem ── */}
      {/* Runs full duration — IntroSlide layers on top starting at frame 90 */}
      <Sequence from={SCENE.problem.start} durationInFrames={SCENE.problem.dur + XFADE}>
        <ProblemScene />
      </Sequence>

      {/* ── SCENE 1.5: "There's a better way." bridge ── */}
      {/* Starts XFADE frames before Problem ends, fades IN over it (same dark bg) */}
      <Sequence from={SCENE.intro.start} durationInFrames={SCENE.intro.dur + XFADE}>
        <IntroSlide />
      </Sequence>

      {/* ── SCENE 2: Sakura Brand Reveal ── */}
      {/* Starts XFADE frames before Intro ends, fades IN (dark→dark seamless) */}
      <Sequence from={SCENE.sakura.start} durationInFrames={SCENE.sakura.dur + XFADE}>
        <SakuraOpenerScene />
      </Sequence>

      {/* ── SCENE 3: Feature — Send a memory ── */}
      {/* Starts XFADE frames before Sakura ends — cream fades over the dark sakura bg */}
      <Sequence from={SCENE.feat1.start} durationInFrames={SCENE.feat1.dur}>
        <FeatureScene
          label="For loved ones"
          labelColor={COLOR.rose600}
          headline={['Send a memory', 'sealed inside', 'a flower']}
          description={[
            'Attach a letter, photo, voice note, or video.',
            'Your recipient opens it like unwrapping',
            'something rare.',
          ]}
          flowerSrc={ASSETS.peony}
          flowerSide="left"
          glowColor="rgba(232,180,184,0.40)"
        />
      </Sequence>

      {/* ── SCENE 4: Feature — Private garden ── */}
      <Sequence from={SCENE.feat2.start} durationInFrames={SCENE.feat2.dur}>
        <FeatureScene
          label="Private by design"
          labelColor={COLOR.lavender400}
          headline={['No feeds.', 'No likes.', 'No one enters uninvited.']}
          description={[
            'Your garden is yours alone.',
            'Invite only the people who matter,',
            'or keep it entirely to yourself.',
          ]}
          flowerSrc={ASSETS.glassMorph}
          flowerSide="right"
          glowColor="rgba(197,169,208,0.40)"
        />
      </Sequence>

      {/* ── SCENE 5: Feature — Time capsule ── */}
      <Sequence from={SCENE.feat3.start} durationInFrames={SCENE.feat3.dur}>
        <FeatureScene
          label="Time capsule"
          labelColor={COLOR.rose400}
          headline={['Set it to bloom', 'now, or years', 'from now.']}
          description={[
            'Schedule a flower to open on a birthday,',
            'an anniversary, or the day',
            'everything changed.',
          ]}
          flowerSrc={ASSETS.cornflower}
          flowerSide="left"
          glowColor="rgba(212,112,126,0.35)"
        />
      </Sequence>

      {/* ── SCENE 6: Social proof — founder quote ── */}
      <Sequence from={SCENE.social.start} durationInFrames={SCENE.social.dur}>
        <SocialProofScene />
      </Sequence>

      {/* ── SCENE 7: Feature summary cards (5s) ── */}
      <Sequence from={SCENE.pills.start} durationInFrames={SCENE.pills.dur}>
        <SummaryPillsScene />
      </Sequence>

      {/* ── SCENE 8: CTA Finale → fade to white ── */}
      <Sequence from={SCENE.cta.start} durationInFrames={SCENE.cta.dur}>
        <CTAFinaleScene />
      </Sequence>

    </AbsoluteFill>
  );
};
