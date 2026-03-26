import React from 'react';
import { Composition } from 'remotion';
import { HorizonsPromo } from './HorizonsPromo';
import { HorizonsPromoPortrait } from './HorizonsPromoPortrait';
import { TOTAL_FRAMES, FPS } from './constants';

export const Root: React.FC = () => {
  return (
    <>
      {/* Landscape 16:9 — YouTube, Twitter/X, LinkedIn */}
      <Composition
        id="HorizonsPromo"
        component={HorizonsPromo}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{}}
      />

      {/* Portrait 9:16 — TikTok, Instagram Reels/Stories */}
      <Composition
        id="HorizonsPromoPortrait"
        component={HorizonsPromoPortrait}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
    </>
  );
};
