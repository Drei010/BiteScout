declare module "scrolly-video/dist/ScrollyVideo.esm.jsx" {
  import type { ComponentType } from "react";

  type ScrollyVideoProps = {
    src: string;
    cover?: boolean;
    full?: boolean;
    sticky?: boolean;
    trackScroll?: boolean;
    lockScroll?: boolean;
    transitionSpeed?: number;
    frameThreshold?: number;
    useWebCodecs?: boolean;
    debug?: boolean;
  };

  const ScrollyVideo: ComponentType<ScrollyVideoProps>;
  export default ScrollyVideo;
}
