// Sharing behaviour between components:
//  Mixins -> HOC -> Render Props -> Hooks
import React from 'react';

// with Hooks, check package.json for react ver >= 16.8
export const useAniFrame = (interval=0, delta=.05) => {
  const [data, setData] = React.useState(0);

  React.useEffect(() => {
    let _frId;
    let prevTS = 0;  // previous TimeStamp (last callback of the rAF)

    const tick = ts => {  // timestamp
      if (ts >= (prevTS + interval)) { // skip the loop for this tick
        prevTS = ts;
        setData(data => data + delta);
      }
      _frId = window.requestAnimationFrame(tick);
    }

    _frId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(_frId);
    }
  }, []);  // run once

  return data;
}

// https://usehooks.com
export const useAniDuration = (easingName='linear', duration=500, delay=0) => {
  // Some easing functions copied from:
  // https://github.com/streamich/ts-easing/blob/master/src/index.ts
  // Hardcode here or pull in a dependency
  const easing = {
    linear     : t => t,
    quadratic  : t => t * (((-t + 4) * t - 6) * t + 4),
    cubic      : t => t * ((4 * t - 9) * t + 6),
    elastic    : t => t * ((((33 * t - 106) * t + 126) * t - 67) * t + 15),
    inQuad     : t => t * t,
    outQuad    : t => t * (2 - t),
    inOutQuad  : t => t <.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    inCubic    : t => t * t * t,
    outCubic   : t => (--t) * t * t + 1,
    inOutCubic : t => t <.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
    inExpo     : t => 2 ** (10*(t-1)),
    outExpo    : t => -(2 ** (-10*t)) + 1,
  };
  // The useAnimationTimer hook calls useState every animation frame ...
  // ... giving us elapased time and causing a rerender as frequently ...
  // ... as possible for a smooth animation.
  const elapsed = useAniDurationTimer(duration, delay);
  // Amount of specified duration elapsed on a scale from 0~1
  const n = Math.min(1, elapsed/duration);
  // Return altered value based on our specified easing function
  return easing[easingName](n);  // property accessors
}

// start animation after the delay within the duration
const useAniDurationTimer = (duration=1000, delay=0) => {
  const [elapsed, setElapsed] = React.useState(0);

  React.useEffect(() => {
    let _rfId, timerStop, start;

    // Call tick() on next animation frame
    const loop = () => {
      _rfId = requestAnimationFrame(tick);
    }

    // Function to be executed on each animation frame
    const tick = () => {
      setElapsed(Date.now() - start);
      loop();
    }

    const onStart = () => {
      // Set a timeout to stop things when duration time elapses
      timerStop = setTimeout(() => {
        window.cancelAnimationFrame(_rfId);
        setElapsed(Date.now() - start);
      }, duration);

      // Start the loop
      start = Date.now();
      loop();
    }

    // Start after specified delay (defaults to 0)
    const timerDelay = setTimeout(onStart, delay);

    // Clean things up
    return () => {
      clearTimeout(timerStop);
      clearTimeout(timerDelay);
      window.cancelAnimationFrame(_rfId);
    };
  }, [duration, delay]);  // Only re-run effect if duration or delay changes

  return elapsed;
}

