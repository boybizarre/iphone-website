import React, { useRef, useState, useEffect } from 'react';

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from "gsap/all";
gsap.registerPlugin(ScrollTrigger);

import { highlightsSlides } from '../constants';
import { playImg, pauseImg, replayImg } from '../utils';

const VideoCarousel = () => {
  const videoRef = useRef<(HTMLVideoElement | null)[]>([]);
  const videoSpanRef = useRef<(HTMLSpanElement | null)[]>([]);
  const videoDivRef = useRef<(HTMLSpanElement | null)[]>([]);

  const [video, setVideo] = useState({
    isEnd: false,
    startPlay: false,
    videoId: 0,
    isLastVideo: false,
    isPlaying: false,
  });

  const [loadedData, setLoadedData] = useState<any[]>([]);

  const { isEnd, startPlay, videoId, isLastVideo, isPlaying } = video;

  useEffect(() => {
    // play the video after metadata has been loaded and pushed unto the loadedData array
    if (loadedData.length > 3) {
      if (!isPlaying) {
        videoRef.current[videoId]!.pause();
      } else {
        startPlay && videoRef.current[videoId]!.play();
      }
    }
  }, [startPlay, videoId, isPlaying, loadedData]);

  useGSAP(() => {
    // slider animation to move the video out of the screen and bring the next video in
    gsap.to('#slider', {
      transform: `translateX(${-100 * videoId}%)`,
      duration: 2,
      ease: 'power2.inOut', // show visualizer https://gsap.com/docs/v3/Eases
    });

    gsap.to('#video', {
      scrollTrigger: {
        trigger: '#video',
        toggleActions: 'restart none none none',
      },
      onComplete: () => {
        setVideo((prev) => ({
          ...prev,
          startPlay: true,
          isPlaying: true,
        }));
      },
    });
  }, [isEnd, videoId]);

  useEffect(() => {
    let currentProgress = 0;
    let span = videoSpanRef.current;

    if (span[videoId]) {
      // animate the progress of the video (animation to move the indicator)
      let animation = gsap.to(span[videoId], {
        onUpdate: () => {
          // getting the progress of the animation and converting it to percentage
          const progress = Math.ceil(animation.progress() * 100);
          // console.log(progress, 'progress');

          if (progress != currentProgress) {
            currentProgress = progress;

            // set the width of the progress bar
            gsap.to(videoDivRef.current[videoId], {
              width:
                window.innerWidth < 760
                  ? '10vw'
                  : window.innerWidth < 1200
                  ? '10vw'
                  : '4vw',
            });

            // set the background color of the progress bar
            gsap.to(span[videoId], {
              width: `${currentProgress}%`,
              backgroundColor: 'white',
            });
          }
        },
        
        // when the video is ended, replace the progress bar with the indicator and change the background color
        onComplete: () => {
          if (isPlaying) {
            gsap.to(videoDivRef.current[videoId], {
              width: '12px',
              backgroundColor: '#afafaf',
            });

            // gsap.to(videoDivRef.current[videoId], {
            //   backgroundColor: '#afafaf',
            // });
          }
        },
        
      });

      if (videoId === 0) {
        animation.restart();
      }

      // update the progress bar
      const animationUpdate = () => {

        animation.progress(
          videoRef.current[videoId]!.currentTime / highlightsSlides[videoId].videoDuration
        );
      };

      if (isPlaying) {
        // ticker to update the progress bar
        gsap.ticker.add(animationUpdate);
      } else {
        // remove the ticker when the video is paused (progress bar is stopped)
        gsap.ticker.remove(animationUpdate);
      }
    }
  }, [videoId, startPlay]);

  const handleLoadedMetadata = (
    index: number,
    event: React.SyntheticEvent<HTMLVideoElement, Event>
  ) => setLoadedData((prev) => [...prev, event]);

  // video id is the id for every video until id becomes number 3
  const handleProcess = (process: string, index?: number) => {
    switch (process) {
      case 'video-end':
        setVideo((prev) => ({
          ...prev,
          isEnd: true,
          videoId: index! + 1,
        }));
        break;

      case 'video-last':
        setVideo((prev) => ({
          ...prev,
          isLastVideo: true,
        }));
        break;

      case 'video-reset':
        setVideo((prev) => ({
          ...prev,
          isLastVideo: false,
          videoId: 0,
        }));
        break;

      case 'play':
        setVideo((prev) => ({
          ...prev,
          isPlaying: !prev.isPlaying,
        }));
        break;

      case 'pause':
        setVideo((prev) => ({
          ...prev,
          isPlaying: !prev.isPlaying,
        }));
        break;

      default:
        return video;
    }
  };

  // console.log(videoRef, 'videoRef');
  // console.log(loadedData, 'loadedData');

  return (
    <>
      <div className='flex items-center'>
        {highlightsSlides.map((list, index) => (
          <div key={list.id} id='slider' className='pr-10 sm:pr-20'>
            <div className='video-carousel_container'>
              <div className='bg-black overflow-hidden flex-center w-full h-full rounded-3xl'>
                <video
                  id='video'
                  className={`${
                    list.id === 2 && 'translate-x-44 pointer-events-none'
                  }`}
                  playsInline
                  muted
                  preload='auto'
                  ref={(el) => (videoRef.current[index] = el)}
                  onPlay={() => {
                    setVideo((prevVideo) => ({
                      ...prevVideo,
                      isPlaying: true,
                    }));
                  }}
                  onEnded={() => {
                    index !== 3
                      ? handleProcess('video-end', index)
                      : handleProcess('video-last', index);
                  }}
                  // after metadata has been loaded do we play the video
                  onLoadedMetadata={(e) => {
                    handleLoadedMetadata(index, e);
                  }}
                >
                  <source src={list.video} type='video/mp4' />
                </video>
              </div>

              <div className='absolute top-12 left-[5%] z-10'>
                {list.textLists.map((text) => (
                  <p key={text} className='font-medium text-xl md:text-2xl'>
                    {text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className='relative flex-center mt-10'>
        <div className='flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full'>
          {videoRef.current.map((_, index) => (
            <span
              key={index}
              ref={(el) => (videoDivRef.current[index] = el)}
              className='mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer'
            >
              <span
                ref={(el) => (videoSpanRef.current[index] = el)}
                className='absolute h-full w-full rounded-full'
              />
            </span>
          ))}
        </div>

        <button className='control-btn'>
          <img
            src={isLastVideo ? replayImg : isPlaying ? pauseImg : playImg}
            alt={isLastVideo ? 'replay' : isPlaying ? 'pause' : 'play'}
            onClick={
              isLastVideo
                ? () => handleProcess('video-reset')
                : isPlaying
                ? () => handleProcess('pause')
                : () => handleProcess('play')
            }
          />
        </button>
      </div>
    </>
  );
};

export default VideoCarousel;
