/**
 * HorizonsPromoPortrait — portrait (1080×1920) version for TikTok / Instagram Reels / Stories
 *
 * Same scene sequence and timing as HorizonsPromo (landscape).
 * Portrait-specific scene variants (FeatureSceneV, CTAFinaleSceneV) are used
 * for scenes that have hardcoded pixel dimensions.
 * ProblemScene, IntroSlide, and SakuraOpenerScene are all centered/responsive
 * and work correctly in portrait without modification.
 *
 * Timeline: identical to landscape
 *   0:00–0:04.8   ProblemScene
 *   0:04.8–0:07.6 IntroSlide (transparent overlay on ProblemScene bg)
 *   0:07.1–0:11.5 SakuraOpenerScene
 *   0:11.5–0:18.0 FeatureSceneV 1 — send a memory
 *   0:17.5–0:24.0 FeatureSceneV 2 — private garden
 *   0:23.5–0:30.0 FeatureSceneV 3 — time capsule
 *   0:29.5–0:35.5 CTAFinaleSceneV → fade to white
 */
import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { ASSETS, COLOR, SCENE } from './constants';
import { ProblemScene } from './scenes/ProblemScene';
import { IntroSlide } from './scenes/IntroSlide';
import { SakuraOpenerScene } from './scenes/SakuraOpenerScene';
import { FeatureSceneV } from './scenes/FeatureSceneV';
import { CTAFinaleSceneV } from './scenes/CTAFinaleSceneV';

const XFADE = 15;

export const HorizonsPromoPortrait: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLOR.bgDark }}>

      {/* ── MUSIC ── same track as landscape ── */}
      <Audio src={staticFile('videos/StockTune-Ascent Of Ambitions_1774493201.mp3')} volume={1.0} />

      {/* ── SCENE 1: The Problem ── stays alive through IntroSlide as the background layer */}
      <Sequence from={SCENE.problem.start} durationInFrames={SCENE.problem.dur + SCENE.intro.dur}>
        <ProblemScene />
      </Sequence>

      {/* ── SCENE 2: "There's a better way." bridge ── transparent overlay */}
      <Sequence from={SCENE.intro.start} durationInFrames={SCENE.intro.dur + XFADE}>
        <IntroSlide />
      </Sequence>

      {/* ── SCENE 3: Sakura Brand Reveal ── */}
      <Sequence from={SCENE.sakura.start} durationInFrames={SCENE.sakura.dur + XFADE}>
        <SakuraOpenerScene />
      </Sequence>

      {/* ── SCENE 4: Feature — Send a memory ── */}
      <Sequence from={SCENE.feat1.start} durationInFrames={SCENE.feat1.dur}>
        <FeatureSceneV
          label="For the people you love"
          labelColor={COLOR.rose600}
          headline={['A memory, sealed', 'inside a flower.']}
          description={[
            'A letter. A photo. A voice note. A video.',
            'Plant it in your garden —',
            'they open it when it blooms.',
          ]}
          flowerSrc={ASSETS.peony}
          glowColor="rgba(218,130,140,0.58)"
        />
      </Sequence>

      {/* ── SCENE 5: Feature — Private garden ── */}
      <Sequence from={SCENE.feat2.start} durationInFrames={SCENE.feat2.dur}>
        <FeatureSceneV
          label="Private by design"
          labelColor={COLOR.lavender400}
          headline={['Your garden.', 'Your people.', 'No one else.']}
          description={[
            'Invite the people who matter',
            'and plant flowers just for them.',
            'Everything else stays yours.',
          ]}
          flowerSrc={ASSETS.glassMorph}
          glowColor="rgba(160,118,196,0.58)"
        />
      </Sequence>

      {/* ── SCENE 6: Feature — Time capsule ── */}
      <Sequence from={SCENE.feat3.start} durationInFrames={SCENE.feat3.dur}>
        <FeatureSceneV
          label="Time capsule"
          labelColor={COLOR.rose400}
          headline={['Plant it today.', 'Let it bloom', 'when the moment is right.']}
          description={[
            'Set it to open on a birthday, an anniversary,',
            'or the day you just want someone',
            'to know you were thinking of them.',
          ]}
          flowerSrc={ASSETS.cornflower}
          glowColor="rgba(212,112,126,0.35)"
        />
      </Sequence>

      {/* ── SCENE 7: CTA Finale → fade to white ── */}
      <Sequence from={SCENE.cta.start} durationInFrames={SCENE.cta.dur}>
        <CTAFinaleSceneV />
      </Sequence>

    </AbsoluteFill>
  );
};
