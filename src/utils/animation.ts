export const animateWithGsapTimeline = (
  timeline: any,
  rotationRef: any,
  rotationState: number[],
  firstTarget: string,
  secondTarget: string,
  animationProps: {
    transform: string;
    duration: number;
  }
) => {
  timeline.to(rotationRef.current.rotation, {
    y: rotationState,
    duration: 1,
    ease: 'power2.inOut',
  });

  timeline.to(
    firstTarget,
    {
      ...animationProps,
      ease: 'power2.inOut',
    },
    '<'
  );

  timeline.to(
    secondTarget,
    {
      ...animationProps,
      ease: 'power2.inOut',
    },
    '<'
  );
};
