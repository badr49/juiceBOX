// JuiceBOX - Neutralinojs Edition
const { useState, useEffect, useRef, useCallback } = React;

const API_BASE = 'https://juicewrldapi.com/juicewrld';
const ASSETS_BASE = 'https://juicewrldapi.com/assets';

const ERAS = [
  { id: 'studio', name: 'Studio' },
  { id: 'released', name: 'Released' },
  { id: 'unreleased', name: 'Unreleased' },
  { id: 'unsurfaced', name: 'Unsurfaced' },
];

const SESSION_FOLDERS = [
  '1. JUICED UP THE EP (Sessions)',
  '2. affliction (Sessions)',
  '3. Heartbroken In Hollywood 9 9 9',
  '4. JuiceWRLD 9 9 9 (Sessions)',
  '5. BINGEDRINKINGMUSIC (Sessions)',
  "6. NOTHING'S DIFFERENT 3 (Sessions)",
  '7. Goodbye & Good Riddance (Sessions)',
  '8. WRLD ON DRUGS (Sessions)',
  '9. Death Race For Love (Sessions)',
  '10. Outsiders (Sessions)',
  '11. Posthumous',
  '12. Other'
];

const parseFileNames = (fileNamesStr) => {
  if (!fileNamesStr) return [];
  const files = [];
  const lines = fileNamesStr.split('\n');
  for (const line of lines) {
    const match = line.match(/File Name\s*(?:\(\d+\))?\s*:\s*(.+)/i);
    if (match) files.push(match[1].trim());
  }
  return files;
};

const getWavUrl = (path, fileNames, trackTitles) => {
  if (!path.includes('Compilation/') || !path.endsWith('.mp3')) return null;
  const folderMatch = path.match(/(\d+)\.\s*[^/]+\/[^/]+\.mp3$/);
  if (!folderMatch) return null;
  const folderIndex = parseInt(folderMatch[1]) - 1;
  const sessionFolder = SESSION_FOLDERS[folderIndex];
  if (!sessionFolder) return null;
  
  // Try file_names first
  const files = parseFileNames(fileNames);
  if (files.length > 0) {
    const wavFilename = files[0];
    const wavPath = `Original Files/${sessionFolder}/${wavFilename}.wav`;
    return `${API_BASE}/files/download/?path=${encodeURIComponent(wavPath)}`;
  }
  
  // Fall back to track titles
  if (trackTitles && trackTitles.length > 0) {
    const wavFilename = trackTitles[0];
    const wavPath = `Original Files/${sessionFolder}/${wavFilename}.wav`;
    return `${API_BASE}/files/download/?path=${encodeURIComponent(wavPath)}`;
  }
  
  return null;
};

const getMp3Url = (path) => `${API_BASE}/files/download/?path=${encodeURIComponent(path)}`;

const getAudioUrl = (path, fileNames, trackTitles) => {
  const wavUrl = getWavUrl(path, fileNames, trackTitles);
  return { wavUrl, mp3Url: getMp3Url(path) };
};

const getCoverUrl = (imageUrl) => {
  if (!imageUrl) return `${ASSETS_BASE}/jute.png`;
  if (imageUrl.startsWith('http')) return imageUrl;
  return `https://juicewrldapi.com${imageUrl}`;
};

const extractBitrate = (bitrateStr) => {
  console.log('bitrate', bitrateStr);
  if (!bitrateStr) return 'N/A';
  const matches = bitrateStr.match(/(\d+)kbps/g);
  if (matches && matches.length > 0) {
    const highest = Math.max(...matches.map(b => parseInt(b)));
    return `${highest}kbps`;
  }
  return 'N/A';
};

// Shuffle array
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Icon components
const HomeIcon = () => React.createElement('svg', { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
  React.createElement('path', { d: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z' }),
  React.createElement('polyline', { points: '9 22 9 12 15 12 15 22' })
);
const SearchIcon = () => React.createElement('svg', { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
  React.createElement('circle', { cx: 11, cy: 11, r: 8 }),
  React.createElement('path', { d: 'M21 21l-4.35-4.35' })
);
const RadioIcon = () => React.createElement('svg', { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
  React.createElement('circle', { cx: 12, cy: 12, r: 2 }),
  React.createElement('path', { d: 'M16.24 7.76a6 6 0 010 8.49m-8.48-.01a6 6 0 010-8.49m8.48-8.48a10 10 0 010 14.14m-8.48-.01a10 10 0 010-14.14' })
);
const ShuffleIcon = () => React.createElement('svg', { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
  React.createElement('polyline', { points: '16 3 21 3 21 8' }),
  React.createElement('line', { x1: 4, y1: 20, x2: 21, y2: 3 }),
  React.createElement('polyline', { points: '21 16 21 21 16 21' }),
  React.createElement('line', { x1: 15, y1: 15, x2: 21, y2: 21 }),
  React.createElement('line', { x1: 4, y1: 4, x2: 9, y2: 9 })
);
const PrevIcon = () => React.createElement('svg', { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'currentColor' },
  React.createElement('path', { d: 'M6 6h2v12H6zm3.5 6l8.5 6V6z' })
);
const NextIcon = () => React.createElement('svg', { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'currentColor' },
  React.createElement('path', { d: 'M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z' })
);
const PlayIcon = () => React.createElement('svg', { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'currentColor' },
  React.createElement('path', { d: 'M8 5v14l11-7z' })
);
const PauseIcon = () => React.createElement('svg', { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'currentColor' },
  React.createElement('path', { d: 'M6 19h4V5H6v14zm8-14v14h4V5h-4z' })
);

// Sub-components
const Sidebar = ({ activeTab, setActiveTab }) => React.createElement('div', { className: 'wora-sidebar-float' },
  React.createElement('div', { className: 'wora-sidebar' },
    React.createElement('img', { 
      src: '/icons/favicon.ico', 
      alt: 'Logo',
      style: { width: '40px', height: '40px', margin: '0 auto', cursor: 'pointer' },
      onClick: () => setActiveTab('home')
    }),
    React.createElement('nav', { className: 'wora-nav' },
      React.createElement('button', {
        className: `wora-nav-item ${activeTab === 'home' ? 'active' : ''}`,
        onClick: () => setActiveTab('home'),
        title: 'Home'
      }, React.createElement(HomeIcon)),
      React.createElement('button', {
        className: `wora-nav-item ${activeTab === 'search' ? 'active' : ''}`,
        onClick: () => setActiveTab('search'),
        title: 'Search'
      }, React.createElement(SearchIcon)),
      React.createElement('button', {
        className: `wora-nav-item ${activeTab === 'radio' ? 'active' : ''}`,
        onClick: () => setActiveTab('radio'),
        title: 'Radio'
      }, React.createElement(RadioIcon))
    )
  )
);

const EraGrid = ({ activeEra, fetchEraSongs }) => React.createElement('div', { className: 'era-grid' },
  ERAS.map(era =>
    React.createElement('button', {
      key: era.id,
      className: `era-btn ${activeEra === era.id ? 'active' : ''}`,
      onClick: () => fetchEraSongs(era.id)
    }, era.name)
  )
);

const SongTable = ({ songs, currentSong, handlePlaySong }) => React.createElement('table', { className: 'wora-song-table' },
  React.createElement('thead', null,
    React.createElement('tr', null,
      React.createElement('th', null, 'Cover'),
      React.createElement('th', null, 'Title'),
      React.createElement('th', null, 'Duration'),
      React.createElement('th', null, 'Quality')
    )
  ),
  React.createElement('tbody', null,
    songs.map((song) =>
      React.createElement('tr', {
        key: song.id,
        className: currentSong?.id === song.id ? 'playing' : '',
        onClick: () => handlePlaySong(song, songs, false)
      },
        React.createElement('td', null, 
          React.createElement('img', { src: song.cover, alt: '' })
        ),
        React.createElement('td', null,
          React.createElement('div', { className: 'song-title' }, song.name),
          React.createElement('div', { className: 'song-artist' }, song.author)
        ),
        React.createElement('td', null, song.duration),
        React.createElement('td', null,
          React.createElement('span', { className: 'bitrate-badge' }, song.bitrate)
        )
      )
    )
  )
);

const SearchPage = ({ handleSearch, searchResults, loading, currentSong, handlePlaySong }) => {
  const [query, setQuery] = useState('');
  return React.createElement(React.Fragment, null,
    React.createElement('form', { 
      className: 'wora-search-box',
      onSubmit: (e) => { e.preventDefault(); handleSearch(query); }
    },
      React.createElement(SearchIcon),
      React.createElement('input', {
        type: 'text',
        placeholder: 'Search songs...',
        value: query,
        onChange: (e) => setQuery(e.target.value)
      })
    ),
    loading && React.createElement('div', { className: 'wora-loading' },
      React.createElement('div', { className: 'wora-spinner' }),
      React.createElement('span', null, 'Searching...')
    ),
    searchResults && React.createElement(SongTable, { songs: searchResults, currentSong, handlePlaySong })
  );
};

const RadioPage = ({ loading, setLoading, play, setQueue, setQueueIndex, setCurrentSong, setIsRadioMode, currentSong }) => {
  const [radioSong, setRadioSong] = useState(null);
  
  const playRadio = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/radio/random/`);
      const data = await res.json();
      const song = {
        id: data.song?.id || Date.now(),
        name: data.song?.name || 'Unknown',
        author: data.song?.credited_artists || 'Juice WRLD',
        duration: data.song?.length || '3:00',
        cover: getCoverUrl(data.song?.image_url),
        path: data.path || data.song?.path,
        fileNames: data.file_names || data.song?.file_names,
        trackTitles: data.track_titles || data.song?.track_titles,
        bitrate: extractBitrate(data.song?.bitrate)
      };
      if (song.path) {
        setRadioSong(song);
        setQueue([song]);
        setQueueIndex(0);
        setCurrentSong(song);
        setIsRadioMode(true);
        play(song);
      }
    } catch (err) {
      console.error('[Radio] Failed:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return React.createElement(React.Fragment, null,
    React.createElement('div', { className: 'wora-radio' },
      React.createElement('div', { className: 'wora-radio-card' },
        React.createElement('img', { 
          src: '/icons/favicon.ico', 
          alt: 'Radio',
          style: { width: '64px', height: '64px', marginBottom: '16px' }
        }),
        React.createElement('h2', null, 'Radio'),
        React.createElement('p', null, 'Play random Juice WRLD songs'),
        React.createElement('button', {
          className: 'wora-radio-start',
          onClick: playRadio,
          disabled: loading
        }, loading ? 'Loading...' : 'Start Radio')
      ),
      radioSong && React.createElement('div', { className: 'wora-radio-playing' },
        React.createElement('img', { src: radioSong.cover, alt: '' }),
        React.createElement('div', null,
          React.createElement('span', null, 'Now Playing'),
          React.createElement('h3', null, radioSong.name),
          React.createElement('p', null, radioSong.author)
        )
      )
    )
  );
};

const Player = ({ currentSong, isPlaying, duration, volume, currentBitrate, 
                  toggle, handlePrev, handleNext, toggleShuffle, isShuffled,
                  setVolume, formatTime, audioRef, progressRef, timeRef }) => React.createElement('div', { className: 'wora-player-float' },
  React.createElement('div', { className: 'wora-player' },
    React.createElement('div', { className: 'wora-player-left' },
      currentSong && React.createElement(React.Fragment, null,
        React.createElement('img', { src: currentSong.cover, alt: '' }),
        React.createElement('div', { className: 'wora-player-info' },
          React.createElement('span', { className: 'wora-player-title' }, currentSong.name),
          React.createElement('span', { className: 'wora-player-artist' }, currentSong.author)
        )
      )
    ),
    React.createElement('div', { className: 'wora-player-center' },
      React.createElement('div', { className: 'wora-player-controls' },
        React.createElement('button', {
          onClick: toggleShuffle,
          title: 'Shuffle',
          className: `shuffle-btn ${isShuffled ? 'active' : ''}`
        }, React.createElement(ShuffleIcon)),
        React.createElement('button', { 
          onClick: handlePrev,
          title: 'Previous',
          className: 'control-btn'
        }, React.createElement(PrevIcon)),
        React.createElement('button', { onClick: toggle, className: 'play-btn' },
          isPlaying ? React.createElement(PauseIcon) : React.createElement(PlayIcon)
        ),
        React.createElement('button', { 
          onClick: handleNext,
          title: 'Next',
          className: 'control-btn'
        }, React.createElement(NextIcon))
      ),
      React.createElement('div', { className: 'wora-player-progress' },
        React.createElement('span', { ref: timeRef }, '0:00'),
        React.createElement('div', { 
          className: 'wora-progress-bar',
          onClick: (e) => {
            if (!audioRef.current || !duration) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            audioRef.current.currentTime = percent * duration;
          }
        },
          React.createElement('div', { 
            ref: progressRef,
            className: 'wora-progress-fill',
            style: { width: '0%' }
          })
        ),
        React.createElement('span', null, formatTime(duration))
      )
    ),
    React.createElement('div', { className: 'wora-player-right' },
      currentBitrate && React.createElement('span', { className: 'bitrate-display' }, currentBitrate),
      React.createElement('div', { className: 'wora-volume' },
        React.createElement('input', {
          type: 'range',
          min: 0, max: 1, step: 0.01,
          value: volume,
          onChange: (e) => {
            const v = parseFloat(e.target.value);
            if (audioRef.current) audioRef.current.volume = v;
          }
        })
      )
    )
  )
);

// Main App Component
const App = () => {
  // Tray/minimized state - when true, UI is unmounted, only audio persists
  const [isHiddenToTray, setIsHiddenToTray] = useState(false);
  
  // Initialize Neutralino and set up tray/window events
  useEffect(() => {
    if (typeof Neutralino !== 'undefined') {
      Neutralino.init();
      
      // Create tray icon (runtime creation like main.js)
      if (typeof NL_OS !== 'undefined' && NL_OS !== 'Darwin') {
        Neutralino.os.setTray({
          icon: '/resources/icons/favicon.ico',
          menuItems: [
            {id: 'show', text: 'Show'},
            {id: 'quit', text: 'Quit'}
          ]
        });
      }
      
      // Intercept window close - hide to tray instead (UI will unmount)
      Neutralino.events.on('windowClose', () => {
        setIsHiddenToTray(true);
        Neutralino.window.hide().catch(console.error);
      });
      
      // Handle tray menu clicks - restore UI when showing
      Neutralino.events.on('trayMenuItemClicked', (e) => {
        if (e.detail.id === 'show') {
          setIsHiddenToTray(false);
          Neutralino.window.show().catch(console.error);
        }
        if (e.detail.id === 'quit') {
          Neutralino.app.exit();
        }
      });
    }
  }, []);

  const [activeTab, setActiveTab] = useState('home');
  const [activeEra, setActiveEra] = useState(null);
  const [eraSongs, setEraSongs] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [currentBitrate, setCurrentBitrate] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Queue and playback mode state
  const [queue, setQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const [originalQueue, setOriginalQueue] = useState([]);
  const [isRadioMode, setIsRadioMode] = useState(false);
  const isRadioModeRef = useRef(false);
  
  // Keep ref in sync with state to avoid stale closures
  useEffect(() => {
    isRadioModeRef.current = isRadioMode;
  }, [isRadioMode]);
  
  const audioRef = useRef(null);
  const loadedSrcRef = useRef(null);
  const progressRef = useRef(null);
  const timeRef = useRef(null);
  const endingRef = useRef(false);
  
  // Use global AudioService for persistent audio (survives UI unmount)
  const audioServiceRef = useRef(typeof AudioService !== 'undefined' ? AudioService : null);
  
  // Initialize audio volume on mount
  // Initialize audio service and sync state with it
  useEffect(() => {
    const audioService = audioServiceRef.current;
    if (!audioService) return;
    
    // Initialize with default volume
    audioService.setVolume(0.5);
    
    let rafId = null;
    const updateProgress = () => {
      if (progressRef.current && timeRef.current) {
        const ct = audioService.getCurrentTime();
        const dur = audioService.getDuration() || 0;
        progressRef.current.style.width = `${(ct / dur) * 100 || 0}%`;
        timeRef.current.textContent = formatTime(ct);
      }
      rafId = requestAnimationFrame(updateProgress);
    };
    
    // Sync React state with audio service state
    audioService.onLoadedMetadata((dur) => {
      setDuration(dur);
    });
    
    audioService.onPlayStateChange((playing) => {
      setIsPlaying(playing);
    });
    
    audioService.onEnded(async () => {
      if (endingRef.current) return;
      endingRef.current = true;
      if (isRadioModeRef.current) {
        await playNextRadioSong();
      } else {
        await handleNext();
      }
      endingRef.current = false;
    });
    
    rafId = requestAnimationFrame(updateProgress);
    
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const play = async (song) => {
    const audioService = audioServiceRef.current;
    if (!audioService || !song) return;
    
    const mp3Url = getMp3Url(song.path);
    const wavUrl = getWavUrl(song.path, song.fileNames, song.trackTitles);
    
    // Try WAV first if available
    const tryPlay = async (url, isWav) => {
      // Force reload even if URL matches (for radio mode)
      if (loadedSrcRef.current === url) {
        audioService.clearSrc();
        loadedSrcRef.current = null;
      }
      
      if (loadedSrcRef.current !== url) {
        loadedSrcRef.current = url;
        setCurrentBitrate(isWav ? extractBitrate(song.bitrate) : '320kbps');
      }
      
      await audioService.play(url);
    };
    
    if (wavUrl) {
      try {
        await tryPlay(wavUrl, true);
        return; // WAV worked
      } catch (err) {
        console.log('[Player] WAV failed (CORB?), falling back to MP3');
        // Fall through to MP3
      }
    }
    
    // Fallback to MP3
    try {
      await tryPlay(mp3Url, false);
    } catch (err) {
      console.error('[Player] MP3 also failed:', err);
    }
  };

  const pause = () => {
    const audioService = audioServiceRef.current;
    if (audioService) {
      audioService.pause();
    }
  };

  const toggle = () => {
    const audioService = audioServiceRef.current;
    if (!audioService) return;
    
    if (isPlaying) {
      audioService.pause();
    } else if (currentSong) {
      play(currentSong);
    }
  };

  const handlePrev = async () => {
    if (queue.length === 0) return;
    const newIndex = queueIndex > 0 ? queueIndex - 1 : queue.length - 1;
    setQueueIndex(newIndex);
    const song = queue[newIndex];
    setCurrentSong(song);
    await play(song);
  };

  const handleNext = async () => {
    if (isRadioModeRef.current) {
      await playNextRadioSong();
      return;
    }
    if (!queue || queue.length === 0) return;
    const newIndex = (queueIndex + 1) % queue.length;
    const song = queue[newIndex];
    setQueueIndex(newIndex);
    setCurrentSong(song);
    await play(song);
  };

  const playNextRadioSong = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/radio/random/`);
      const data = await res.json();
      const song = {
        id: data.song?.id || data.id || Date.now(),
        name: data.song?.name || data.track_titles?.[0] || 'Unknown',
        author: data.song?.credited_artists || data.artist || 'Juice WRLD',
        duration: data.song?.length || data.length || '3:00',
        cover: getCoverUrl(data.song?.image_url || data.image_url),
        path: data.path || data.song?.path,
        fileNames: data.file_names || data.song?.file_names,
        bitrate: extractBitrate(data.song?.bitrate || data.bitrate)
      };
      if (song.path) {
        setQueue([song]);
        setQueueIndex(0);
        setCurrentSong(song);
        await play(song);
        return song;
      }
    } catch (err) {
      console.error('[Radio] Failed:', err);
    } finally {
      setLoading(false);
    }
    return null;
  };

  const toggleShuffle = () => {
    if (!isShuffled) {
      // Enable shuffle
      const shuffled = shuffleArray(queue);
      setOriginalQueue([...queue]);
      setQueue(shuffled);
      // Find current song in new queue
      const newIndex = shuffled.findIndex(s => s.id === currentSong?.id);
      setQueueIndex(newIndex >= 0 ? newIndex : 0);
    } else {
      // Disable shuffle - restore original order
      setQueue([...originalQueue]);
      const newIndex = originalQueue.findIndex(s => s.id === currentSong?.id);
      setQueueIndex(newIndex >= 0 ? newIndex : 0);
    }
    setIsShuffled(!isShuffled);
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  // Fetch era songs
  const fetchEraSongs = async (era) => {
    setLoading(true);
    setActiveEra(era);
    try {
      let url = `${API_BASE}/songs/?page=1&page_size=50`;
      if (era === 'studio') url += '&studio=true';
      else if (era === 'released') url += '&released=true';
      else if (era === 'unreleased') url += '&unreleased=true';
      else if (era === 'unsurfaced') url += '&unsurfaced=true';
      
      const response = await fetch(url);
      const data = await response.json();
      
      const mappedSongs = (data.results || [])
        .filter(song => song.path && song.path.trim() !== '')
        .map(song => ({
          id: song.id,
          name: song.name,
          author: song.credited_artists || 'Juice WRLD',
          duration: song.length || '3:00',
          cover: getCoverUrl(song.image_url),
          path: song.path,
          fileNames: song.file_names,
          bitrate: extractBitrate(song.bitrate)
        }));
      
      setEraSongs(mappedSongs);
      setQueue(mappedSongs);
      setQueueIndex(0);
      setIsShuffled(false);
      setOriginalQueue([]);
    } catch (err) {
      console.error('[App] Failed to load era:', err);
    } finally {
      setLoading(false);
    }
  };

  // Search
  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }
    setLoading(true);
    try {
      const url = `${API_BASE}/songs/?page=1&search=${encodeURIComponent(query)}&page_size=100`;
      const response = await fetch(url);
      const data = await response.json();
      
      const mappedResults = (data.results || [])
        .filter(song => song.path && song.path.trim() !== '')
        .map(song => ({
          id: song.id,
          name: song.name,
          author: song.credited_artists || 'Juice WRLD',
          duration: song.length || '3:00',
          cover: getCoverUrl(song.image_url),
          path: song.path,
          fileNames: song.file_names,
          bitrate: extractBitrate(song.bitrate)
        }));
      
      setSearchResults(mappedResults);
      setQueue(mappedResults);
      setQueueIndex(0);
      setIsShuffled(false);
      setOriginalQueue([]);
    } catch (err) {
      console.error('[App] Search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaySong = (song, songsList, fromRadio = false) => {
    if (!song.path || song.path.trim() === '') return;
    setCurrentSong(song);
    
    // Update radio mode
    setIsRadioMode(fromRadio);
    
    // Update queue if provided
    if (songsList && songsList.length > 0) {
      const newIndex = songsList.findIndex(s => s.id === song.id);
      setQueue(songsList);
      setQueueIndex(newIndex >= 0 ? newIndex : 0);
    }
    
    play(song);
  };

  // Icon components
  const HomeIcon = () => React.createElement('svg', { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
    React.createElement('path', { d: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z' }),
    React.createElement('polyline', { points: '9 22 9 12 15 12 15 22' })
  );
  const SearchIcon = () => React.createElement('svg', { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
    React.createElement('circle', { cx: 11, cy: 11, r: 8 }),
    React.createElement('path', { d: 'M21 21l-4.35-4.35' })
  );
  const RadioIcon = () => React.createElement('svg', { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
    React.createElement('circle', { cx: 12, cy: 12, r: 2 }),
    React.createElement('path', { d: 'M16.24 7.76a6 6 0 010 8.49m-8.48-.01a6 6 0 010-8.49m8.48-8.48a10 10 0 010 14.14m-8.48-.01a10 10 0 010-14.14' })
  );
  const ShuffleIcon = () => React.createElement('svg', { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
    React.createElement('polyline', { points: '16 3 21 3 21 8' }),
    React.createElement('line', { x1: 4, y1: 20, x2: 21, y2: 3 }),
    React.createElement('polyline', { points: '21 16 21 21 16 21' }),
    React.createElement('line', { x1: 15, y1: 15, x2: 21, y2: 21 }),
    React.createElement('line', { x1: 4, y1: 4, x2: 9, y2: 9 })
  );
  const PrevIcon = () => React.createElement('svg', { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'currentColor' },
    React.createElement('path', { d: 'M6 6h2v12H6zm3.5 6l8.5 6V6z' })
  );
  const NextIcon = () => React.createElement('svg', { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'currentColor' },
    React.createElement('path', { d: 'M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z' })
  );
  const PlayIcon = () => React.createElement('svg', { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'currentColor' },
    React.createElement('path', { d: 'M8 5v14l11-7z' })
  );
  const PauseIcon = () => React.createElement('svg', { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'currentColor' },
    React.createElement('path', { d: 'M6 19h4V5H6v14zm8-14v14h4V5h-4z' })
  );

  // Components
  const Sidebar = () => (
    React.createElement('div', { className: 'wora-sidebar-float' },
      React.createElement('div', { className: 'wora-sidebar' },
        React.createElement('img', { 
          src: '/icons/favicon.ico', 
          alt: 'Logo',
          style: { width: '40px', height: '40px', margin: '0 auto', cursor: 'pointer' },
          onClick: () => setActiveTab('home')
        }),
        React.createElement('nav', { className: 'wora-nav' },
          React.createElement('button', {
            className: `wora-nav-item ${activeTab === 'home' ? 'active' : ''}`,
            onClick: () => setActiveTab('home'),
            title: 'Home'
          }, React.createElement(HomeIcon)),
          React.createElement('button', {
            className: `wora-nav-item ${activeTab === 'search' ? 'active' : ''}`,
            onClick: () => setActiveTab('search'),
            title: 'Search'
          }, React.createElement(SearchIcon)),
          React.createElement('button', {
            className: `wora-nav-item ${activeTab === 'radio' ? 'active' : ''}`,
            onClick: () => setActiveTab('radio'),
            title: 'Radio'
          }, React.createElement(RadioIcon))
        )
      )
    )
  );

  const EraGrid = () => (
    React.createElement('div', { className: 'era-grid' },
      ERAS.map(era =>
        React.createElement('button', {
          key: era.id,
          className: `era-btn ${activeEra === era.id ? 'active' : ''}`,
          onClick: () => fetchEraSongs(era.id)
        }, era.name)
      )
    )
  );

  const SongTable = ({ songs }) => (
    React.createElement('table', { className: 'wora-song-table' },
      React.createElement('thead', null,
        React.createElement('tr', null,
          React.createElement('th', null, 'Cover'),
          React.createElement('th', null, 'Title'),
          React.createElement('th', null, 'Duration'),
          React.createElement('th', null, 'Quality')
        )
      ),
      React.createElement('tbody', null,
        songs.map((song) =>
          React.createElement('tr', {
            key: song.id,
            className: currentSong?.id === song.id ? 'playing' : '',
            onClick: () => handlePlaySong(song, songs, false)
          },
            React.createElement('td', null, 
              React.createElement('img', { src: song.cover, alt: '' })
            ),
            React.createElement('td', null,
              React.createElement('div', { className: 'song-title' }, song.name),
              React.createElement('div', { className: 'song-artist' }, song.author)
            ),
            React.createElement('td', null, song.duration),
            React.createElement('td', null,
              React.createElement('span', { className: 'bitrate-badge' }, song.bitrate)
            )
          )
        )
      )
    )
  );

  const SearchPage = () => {
    const [query, setQuery] = useState('');
    return React.createElement(React.Fragment, null,
      React.createElement('form', { 
        className: 'wora-search-box',
        onSubmit: (e) => { e.preventDefault(); handleSearch(query); }
      },
        React.createElement('input', {
          type: 'text',
          placeholder: 'Search songs...',
          value: query,
          onChange: (e) => setQuery(e.target.value)
        })
      ),
      loading && React.createElement('div', { className: 'wora-loading' },
        React.createElement('div', { className: 'wora-spinner' }),
        React.createElement('span', null, 'Searching...')
      ),
      searchResults && React.createElement(SongTable, { songs: searchResults })
    );
  };

  const RadioPage = () => {
    const [radioSong, setRadioSong] = useState(null);
    
    const playRadio = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/radio/random/`);
        const data = await res.json();
        const song = {
          id: data.song?.id || Date.now(),
          name: data.song?.name || 'Unknown',
          author: data.song?.credited_artists || 'Juice WRLD',
          duration: data.song?.length || '3:00',
          cover: getCoverUrl(data.song?.image_url),
          path: data.path || data.song?.path,
          fileNames: data.file_names || data.song?.file_names,
          bitrate: extractBitrate(data.song?.bitrate)
        };
        if (song.path) {
          setRadioSong(song);
          setQueue([song]);
          setQueueIndex(0);
          setIsRadioMode(true);
          handlePlaySong(song, [song], true);
        }
      } catch (err) {
        console.error('[Radio] Failed:', err);
      } finally {
        setLoading(false);
      }
    };
    
    return React.createElement(React.Fragment, null,
      React.createElement('div', { className: 'wora-radio' },
        React.createElement('div', { className: 'wora-radio-card' },
          React.createElement('img', { 
            src: '/icons/favicon.ico', 
            alt: 'Radio',
            style: { width: '64px', height: '64px', marginBottom: '16px' }
          }),
          React.createElement('h2', null, 'Radio'),
          React.createElement('p', null, 'Play random Juice WRLD songs'),
          React.createElement('button', {
            className: 'wora-radio-start',
            onClick: playRadio
          }, loading ? 'Loading...' : 'Start Radio')
        ),
        radioSong && React.createElement('div', { className: 'wora-radio-playing' },
          React.createElement('img', { src: radioSong.cover, alt: '' }),
          React.createElement('div', null,
            React.createElement('span', null, 'Now Playing'),
            React.createElement('h3', null, radioSong.name),
            React.createElement('p', null, radioSong.author)
          )
        )
      )
    );
  };

  const Player = () => (
    React.createElement('div', { className: 'wora-player-float' },
      React.createElement('div', { className: 'wora-player' },
        React.createElement('div', { className: 'wora-player-left' },
          currentSong && React.createElement(React.Fragment, null,
            React.createElement('img', { src: currentSong.cover, alt: '' }),
            React.createElement('div', { className: 'wora-player-info' },
              React.createElement('span', { className: 'wora-player-title' }, currentSong.name),
              React.createElement('span', { className: 'wora-player-artist' }, currentSong.author)
            )
          )
        ),
        React.createElement('div', { className: 'wora-player-center' },
          React.createElement('div', { className: 'wora-player-controls' },
            React.createElement('button', {
              onClick: toggleShuffle,
              title: 'Shuffle',
              className: `shuffle-btn ${isShuffled ? 'active' : ''}`
            }, React.createElement(ShuffleIcon)),
            React.createElement('button', { 
              onClick: handlePrev,
              title: 'Previous',
              className: 'control-btn'
            }, React.createElement(PrevIcon)),
            React.createElement('button', { onClick: toggle, className: 'play-btn' },
              isPlaying ? React.createElement(PauseIcon) : React.createElement(PlayIcon)
            ),
            React.createElement('button', { 
              onClick: handleNext,
              title: 'Next',
              className: 'control-btn'
            }, React.createElement(NextIcon))
          ),
          React.createElement('div', { className: 'wora-player-progress' },
            React.createElement('span', { ref: timeRef }, '0:00'),
            React.createElement('div', { 
              className: 'wora-progress-bar',
              onClick: (e) => {
                if (!duration) return;
                const audioService = audioServiceRef.current;
                if (!audioService) return;
                const rect = e.currentTarget.getBoundingClientRect();
                const percent = (e.clientX - rect.left) / rect.width;
                audioService.seek(percent);
              }
            },
              React.createElement('div', { 
                ref: progressRef,
                className: 'wora-progress-fill',
                style: { width: '0%' }
              })
            ),
            React.createElement('span', null, formatTime(duration))
          )
        ),
        React.createElement('div', { className: 'wora-player-right' },
          currentBitrate && React.createElement('span', { className: 'bitrate-display' }, currentBitrate),
          React.createElement('div', { className: 'wora-volume' },
            React.createElement('input', {
              type: 'range',
              min: 0, max: 1, step: 0.01,
              value: Number(volume),
              onChange: (e) => {
                const v = parseFloat(e.target.value);
                setVolume(v);
                const audioService = audioServiceRef.current;
                if (audioService) {
                  audioService.setVolume(v);
                }
              }
            })
          )
        )
      )
    )
  );

  // When hidden to tray, only render a minimal placeholder to keep React mounted
  // Audio continues playing via AudioService which lives outside React
  if (isHiddenToTray) {
    return React.createElement('div', { 
      className: 'wora-app tray-mode',
      style: { display: 'none' } // Hidden from view but keeps React tree alive
    });
  }

  return React.createElement('div', { className: 'wora-app' },
    React.createElement(Sidebar, { activeTab, setActiveTab }),
    React.createElement('div', { className: 'wora-main-float' },
      activeTab === 'home' && React.createElement(React.Fragment, null,
        React.createElement(EraGrid, { activeEra, fetchEraSongs }),
        loading && React.createElement('div', { className: 'wora-loading' },
          React.createElement('div', { className: 'wora-spinner' }),
          React.createElement('span', null, 'Loading...')
        ),
        eraSongs.length > 0 && React.createElement(SongTable, { songs: eraSongs, currentSong, handlePlaySong })
      ),
      activeTab === 'search' && React.createElement(SearchPage, { handleSearch, searchResults, loading, currentSong, handlePlaySong }),
      activeTab === 'radio' && React.createElement(RadioPage, { loading, setLoading, play, setQueue, setQueueIndex, setCurrentSong, setIsRadioMode, currentSong })
    ),
    React.createElement(Player, {
      currentSong,
      isPlaying,
      duration,
      volume,
      currentBitrate,
      toggle,
      handlePrev,
      handleNext,
      toggleShuffle,
      isShuffled,
      setVolume,
      formatTime,
      audioRef,
      progressRef,
      timeRef
    })
  );
};

// Initialize Neutralino and React
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
