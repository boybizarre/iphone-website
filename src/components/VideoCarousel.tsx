import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

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
    if (loadedData.length > 3) {
      if (!isPlaying) {
        videoRef.current[videoId]!.pause();
      } else {
        startPlay && videoRef.current[videoId]!.play();
      }
    }
  }, [startPlay, videoId, isPlaying, loadedData]);

  console.log(videoRef, 'videoRef');

  useGSAP(() => {
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
  }, []);

  useEffect(() => {
    const currentProgress = 0;
    let span = videoSpanRef.current;

    if (span[videoId]) {
      // animate the progress of the video
      let animation = gsap.to(span[videoId], {
        onUpdate: () => {},

        onComplete: () => {},
      });
    }
  }, [videoId, startPlay]);

  const handleLoadedMetadata = (
    index: number,
    event: React.SyntheticEvent<HTMLVideoElement, Event>
  ) => setLoadedData((prev) => [...prev, event]);

  const handleProcess = (process: string, index: number) => {
    switch (process) {
      case 'video-end':
        setVideo((prev) => ({
          ...prev,
          isEnd: true,
          videoId: index + 1,
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

      default:
        return video;
    }
  };

  return (
    <>
      <div className='flex items-center'>
        {highlightsSlides.map((list, index) => (
          <div key={list.id} id='slider' className='pr-10 sm:pr-20'>
            {/* <div>HELLO</div> */}
            <div className='video-carousel_container'>
              <div className='bg-black overflow-hidden flex-center w-full h-full rounded-3xl'>
                <video
                  id='video'
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
                  onLoadedMetadata={(e) => {
                    handleLoadedMetadata(index, e);
                  }}
                >
                  <source src={list.video} type='video/mp4' />
                </video>
              </div>

              <div className='absolute top-12 left-[5%]'>
                {list.textLists.map((text) => (
                  <p key={text} className='text-xl font-medium md:text-2xl'>
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
