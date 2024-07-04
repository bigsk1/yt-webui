import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VideoPlayer from './VideoPlayer';

const App = () => {
  const [url, setUrl] = useState('');
  const [options, setOptions] = useState({
    downloadType: 'video',
    videoFormat: 'mp4',
    videoQuality: 'best',
    audioFormat: 'mp3',
    audioQuality: '192',
    subtitleLanguage: 'en',
    thumbnail: false,
    playlist: false,
    keepOriginal: false,
  });
  const [darkMode, setDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [progress, setProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const handleDownload = async () => {
    if (!url) {
      setMessage('Please enter a YouTube URL');
      return;
    }
    setIsLoading(true);
    setMessage('');
  
    let ytdlpOptions = [];
  
    switch (options.downloadType) {
      case 'video':
        if (options.videoQuality === 'best') {
          ytdlpOptions.push('-f', `bestvideo[ext=${options.videoFormat}]+bestaudio[ext=m4a]/best[ext=${options.videoFormat}]`);
        } else {
          ytdlpOptions.push('-f', `bestvideo[height<=${options.videoQuality}][ext=${options.videoFormat}]+bestaudio[ext=m4a]/best[height<=${options.videoQuality}][ext=${options.videoFormat}]`);
        }
        break;
      case 'audio':
        ytdlpOptions.push('-x', '--audio-format', options.audioFormat, '--audio-quality', options.audioQuality);
        break;
      case 'subtitles':
        ytdlpOptions.push('--write-sub', '--skip-download', '--sub-lang', options.subtitleLanguage);
        break;
      default:
        setMessage('Invalid download type');
        setIsLoading(false);
        return;
    }
  
    if (options.thumbnail) {
      ytdlpOptions.push('--write-thumbnail');
    }
  
    if (!options.playlist) {
      ytdlpOptions.push('--no-playlist');
    }
  
    if (options.keepOriginal) {
      ytdlpOptions.push('--keep-video');
    }

    try {
      const response = await axios.post('http://localhost:8000/download/', {
        url: url,
        options: ytdlpOptions,
        output_dir: 'default'
      }, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        }
      });
      setMessage(response.data.message);
      console.log(response.data);
    } catch (error) {
      console.error('Download failed:', error);
      setMessage(`Download failed: ${error.response?.data?.detail || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} transition-colors duration-200 py-6 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-3xl mx-auto">
        <h1 className={`text-4xl font-bold text-center mb-8 ${darkMode ? 'text-red-600' : 'text-red-700'}`}>yt-dlp downloader</h1>
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 mb-8`}>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter YouTube URL"
            className={`w-full p-3 mb-4 rounded border ${darkMode ? 'bg-gray-700 border-gray-600 focus:border-red-500' : 'bg-gray-100 border-gray-300 focus:border-red-600'} focus:ring-2 focus:ring-red-500`}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-2">Download Type</label>
              <select
                value={options.downloadType}
                onChange={(e) => setOptions({ ...options, downloadType: e.target.value })}
                className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'}`}
              >
                <option value="video">Video</option>
                <option value="audio">Audio Only</option>
                <option value="subtitles">Subtitles Only</option>
              </select>
            </div>
            {options.downloadType === 'video' && (
              <>
                <div>
                  <label className="block mb-2">Video Format</label>
                  <select
                    value={options.videoFormat}
                    onChange={(e) => setOptions({ ...options, videoFormat: e.target.value })}
                    className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'}`}
                  >
                    <option value="mp4">MP4</option>
                    <option value="webm">WebM</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2">Video Quality</label>
                  <select
                    value={options.videoQuality}
                    onChange={(e) => setOptions({ ...options, videoQuality: e.target.value })}
                    className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'}`}
                  >
                    <option value="best">Best</option>
                    <option value="2160">4K</option>
                    <option value="1440">1440p</option>
                    <option value="1080">1080p</option>
                    <option value="720">720p</option>
                    <option value="480">480p</option>
                  </select>
                </div>
              </>
            )}
            {options.downloadType === 'audio' && (
              <>
                <div>
                  <label className="block mb-2">Audio Format</label>
                  <select
                    value={options.audioFormat}
                    onChange={(e) => setOptions({ ...options, audioFormat: e.target.value })}
                    className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'}`}
                  >
                    <option value="mp3">MP3</option>
                    <option value="m4a">M4A</option>
                    <option value="wav">WAV</option>
                    <option value="flac">FLAC</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2">Audio Quality</label>
                  <select
                    value={options.audioQuality}
                    onChange={(e) => setOptions({ ...options, audioQuality: e.target.value })}
                    className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'}`}
                  >
                    <option value="0">Best</option>
                    <option value="192">192 kbps</option>
                    <option value="128">128 kbps</option>
                    <option value="96">96 kbps</option>
                  </select>
                </div>
              </>
            )}
            {options.downloadType === 'subtitles' && (
              <div>
                <label className="block mb-2">Subtitle Language</label>
                <select
                  value={options.subtitleLanguage}
                  onChange={(e) => setOptions({ ...options, subtitleLanguage: e.target.value })}
                  className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'}`}
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="it">Italian</option>
                  <option value="ja">Japanese</option>
                  <option value="ko">Korean</option>
                  <option value="zh-CN">Chinese (Simplified)</option>
                </select>
              </div>
            )}
          </div>
          <div className="flex flex-wrap -mx-2 mb-4">
            <div className="px-2 w-1/2 sm:w-1/3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={options.thumbnail}
                  onChange={(e) => setOptions({ ...options, thumbnail: e.target.checked })}
                  className="form-checkbox text-red-600"
                />
                <span className="ml-2">Download Thumbnail</span>
              </label>
            </div>
            <div className="px-2 w-1/2 sm:w-1/3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={options.playlist}
                  onChange={(e) => setOptions({ ...options, playlist: e.target.checked })}
                  className="form-checkbox text-red-600"
                />
                <span className="ml-2">Download Playlist</span>
              </label>
            </div>
            <div className="px-2 w-1/2 sm:w-1/3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={options.keepOriginal}
                  onChange={(e) => setOptions({ ...options, keepOriginal: e.target.checked })}
                  className="form-checkbox text-red-600"
                />
                <span className="ml-2">Keep Original File</span>
              </label>
            </div>
          </div>
          <button
            onClick={handleDownload}
            disabled={isLoading}
            className={`w-full py-3 px-4 bg-red-600 text-white rounded-lg font-bold ${
              isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'
            } transition-colors duration-200`}
          >
            {isLoading ? 'Downloading...' : 'Download'}
          </button>
          {isLoading && (
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
          )}
          {message && (
            <div className="mt-4 text-sm text-red-400">{message}</div>
          )}
        </div>
        <div className="mb-8">
          <VideoPlayer url={url} isFullscreen={isFullscreen} setIsFullscreen={setIsFullscreen} />
        </div>
        <div className="flex justify-center">
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input 
                type="checkbox" 
                checked={darkMode} 
                onChange={(e) => setDarkMode(e.target.checked)} 
                className="sr-only" 
              />
              <div className={`w-10 h-4 ${darkMode ? 'bg-gray-600' : 'bg-gray-400'} rounded-full shadow-inner transition-colors duration-200`}></div>
              <div className={`absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1 transition ${darkMode ? 'transform translate-x-full bg-red-500' : ''}`}></div>
            </div>
            <div className={`ml-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium`}>
              Dark Mode
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default App;