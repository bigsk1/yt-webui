import React, { useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';

const VideoPlayer = ({ url, isFullscreen, setIsFullscreen }) => {
  const playerRef = useRef(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [setIsFullscreen]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div ref={playerRef} className={`relative ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      <ReactPlayer
        url={url}
        controls
        width="100%"
        height={isFullscreen ? '100%' : '360px'}
        playing={isFullscreen}
        className="rounded-lg overflow-hidden"
      />
      <button
        onClick={toggleFullscreen}
        className="absolute bottom-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold hover:bg-red-700 transition duration-300"
      >
        {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
      </button>
    </div>
  );
};

export default VideoPlayer;