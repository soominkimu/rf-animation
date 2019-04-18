// Sharing behaviour between components:
//  Mixins -> HOC -> Render Props -> Hooks
import React from 'react';

// with Hooks, check package.json for react ver >= 16.8
export const useAniFrame = (interval=0, delta=.05) => {
  const [data,   setData]   = React.useState(0);
  //const [prevTS, setPrevTS] = useState(0);
  let prevTS = 0;

  React.useEffect(() => {
    let _frId;

    const loop = () => {
      _frId = window.requestAnimationFrame(tick);
    }

    const tick = ts => {  // timestamp
      const elapsed = ts - prevTS;
      if (elapsed < interval) { // skip the loop for this tick
        loop();
        return;
      }
      //setPrevTS(ts);
      prevTS = ts;
      setData(data => data + delta);
      //data += delta;
      loop();
    }

    loop();

    return () => {
      window.cancelAnimationFrame(_frId);
    }
  }, []);  // run once

  return data;
}
