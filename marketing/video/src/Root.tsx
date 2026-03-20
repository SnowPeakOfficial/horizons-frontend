import React from 'react';
import { Composition } from 'remotion';
import { HorizonsPromo } from './HorizonsPromo';
import { TOTAL_FRAMES, FPS } from './constants';

// 1920×1080, 30fps, 30 seconds = 900 frames
export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="HorizonsPromo"
        component={HorizonsPromo}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
    </>
  );
};
