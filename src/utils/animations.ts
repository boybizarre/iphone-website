import gsap from 'gsap';


export const animateWithGsap = (
  target: string,
  animationOptions: any,
  scrollOptions?: any
) => {
  gsap.to(target, {
    ...animationOptions,
    scrollTrigger: {
      trigger: target,
      toggleActions: 'restart reverse restart reverse',
      start: 'top 85%',
      ...scrollOptions,
    },
  });
};

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
