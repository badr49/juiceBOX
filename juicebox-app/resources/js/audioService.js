// Persistent Audio Service - lives outside React lifecycle
// Handles audio playback independently of UI visibility

const AudioService = (function() {
  let audio = null;
  let currentSrc = null;
  let isPlaying = false;
  let volume = 0.5;
  let duration = 0;
  let currentTime = 0;
  let onEndedCallback = null;
  let onTimeUpdateCallback = null;
  let onLoadedMetadataCallback = null;
  let onPlayStateChangeCallback = null;

  function init() {
    if (audio) return;
    
    audio = new Audio();
    audio.volume = volume;
    
    audio.addEventListener('loadedmetadata', () => {
      duration = audio.duration;
      if (onLoadedMetadataCallback) onLoadedMetadataCallback(duration);
    });
    
    audio.addEventListener('timeupdate', () => {
      currentTime = audio.currentTime;
      if (onTimeUpdateCallback) onTimeUpdateCallback(currentTime);
    });
    
    audio.addEventListener('ended', () => {
      isPlaying = false;
      if (onPlayStateChangeCallback) onPlayStateChangeCallback(false);
      if (onEndedCallback) onEndedCallback();
    });
    
    audio.addEventListener('play', () => {
      isPlaying = true;
      if (onPlayStateChangeCallback) onPlayStateChangeCallback(true);
    });
    
    audio.addEventListener('pause', () => {
      isPlaying = false;
      if (onPlayStateChangeCallback) onPlayStateChangeCallback(false);
    });
  }

  function play(src) {
    init();
    
    if (src && src !== currentSrc) {
      audio.src = src;
      currentSrc = src;
    }
    
    return audio.play();
  }

  function pause() {
    if (audio) audio.pause();
  }

  function toggle() {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }

  function stop() {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    isPlaying = false;
  }

  function setVolume(v) {
    volume = v;
    if (audio) audio.volume = v;
  }

  function getVolume() {
    return volume;
  }

  function seek(percent) {
    if (audio && duration) {
      audio.currentTime = percent * duration;
    }
  }

  function seekToTime(time) {
    if (audio) audio.currentTime = time;
  }

  function getCurrentTime() {
    return audio ? audio.currentTime : 0;
  }

  function getDuration() {
    return duration;
  }

  function getCurrentSrc() {
    return currentSrc;
  }

  function isCurrentlyPlaying() {
    return isPlaying;
  }

  function onEnded(cb) {
    onEndedCallback = cb;
  }

  function onTimeUpdate(cb) {
    onTimeUpdateCallback = cb;
  }

  function onLoadedMetadata(cb) {
    onLoadedMetadataCallback = cb;
  }

  function onPlayStateChange(cb) {
    onPlayStateChangeCallback = cb;
  }

  function clearSrc() {
    if (audio) {
      audio.src = '';
    }
    currentSrc = null;
  }

  return {
    init,
    play,
    pause,
    toggle,
    stop,
    setVolume,
    getVolume,
    seek,
    seekToTime,
    getCurrentTime,
    getDuration,
    getCurrentSrc,
    isCurrentlyPlaying,
    onEnded,
    onTimeUpdate,
    onLoadedMetadata,
    onPlayStateChange,
    clearSrc
  };
})();

// Expose globally
window.AudioService = AudioService;
