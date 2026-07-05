import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import { Alert } from 'react-native';

const PlayerContext = createContext();

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};

export const PlayerProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); // off, all, one
  
  const soundRef = useRef(null);
  const positionInterval = useRef(null);

  useEffect(() => {
    setupAudio();
    return () => {
      unloadSound();
    };
  }, []);

  const setupAudio = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    } catch (error) {
      console.error('Error setting audio mode:', error);
    }
  };

  const unloadSound = async () => {
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
    if (positionInterval.current) {
      clearInterval(positionInterval.current);
    }
  };

  const loadSound = async (song) => {
    try {
      await unloadSound();
      
      const { sound, status } = await Audio.Sound.createAsync(
        { uri: song.uri },
        { 
          shouldPlay: true,
          progressUpdateIntervalMillis: 1000,
          positionMillis: 0,
        },
        onPlaybackStatusUpdate
      );
      
      soundRef.current = sound;
      setCurrentSong(song);
      setIsPlaying(true);
      
      if (status.isLoaded) {
        setDuration(status.durationMillis || 0);
        setPosition(0);
      }

      startPositionTracking();
      
    } catch (error) {
      console.error('Error loading sound:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить аудиофайл');
    }
  };

  const onPlaybackStatusUpdate = (status) => {
    if (!status.isLoaded) return;
    
    if (status.didJustFinish && !status.isLooping) {
      handleSongEnd();
    }
  };

  const startPositionTracking = () => {
    if (positionInterval.current) {
      clearInterval(positionInterval.current);
    }
    
    positionInterval.current = setInterval(async () => {
      if (soundRef.current && isPlaying) {
        const status = await soundRef.current.getStatusAsync();
        if (status.isLoaded) {
          setPosition(status.positionMillis);
        }
      }
    }, 1000);
  };

  const handleSongEnd = async () => {
    if (repeatMode === 'one') {
      await replayCurrentSong();
    } else if (repeatMode === 'all' && currentIndex === playlist.length - 1) {
      await playSongAtIndex(0);
    } else if (currentIndex < playlist.length - 1) {
      await playNext();
    } else {
      setIsPlaying(false);
      setPosition(0);
    }
  };

  const playSong = async (song, index) => {
    setCurrentIndex(index);
    await loadSound(song);
  };

  const playSongAtIndex = async (index) => {
    if (index >= 0 && index < playlist.length) {
      await playSong(playlist[index], index);
    }
  };

  const togglePlayPause = async () => {
    try {
      if (!soundRef.current) return;
      
      if (isPlaying) {
        await soundRef.current.pauseAsync();
        if (positionInterval.current) {
          clearInterval(positionInterval.current);
        }
      } else {
        await soundRef.current.playAsync();
        startPositionTracking();
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('Error toggling play/pause:', error);
    }
  };

  const playNext = async () => {
    if (isShuffled && playlist.length > 0) {
      const randomIndex = Math.floor(Math.random() * playlist.length);
      await playSongAtIndex(randomIndex);
    } else {
      await playSongAtIndex(currentIndex + 1);
    }
  };

  const playPrevious = async () => {
    if (position > 3000) {
      await seekTo(0);
    } else {
      await playSongAtIndex(currentIndex - 1);
    }
  };

  const seekTo = async (millis) => {
    try {
      if (soundRef.current) {
        await soundRef.current.setPositionAsync(millis);
        setPosition(millis);
      }
    } catch (error) {
      console.error('Error seeking:', error);
    }
  };

  const replayCurrentSong = async () => {
    await seekTo(0);
    if (!isPlaying) {
      await togglePlayPause();
    }
  };

  const addToPlaylist = (song) => {
    setPlaylist(prev => [...prev, song]);
    if (playlist.length === 0) {
      playSong(song, 0);
    }
  };

  const removeFromPlaylist = (index) => {
    setPlaylist(prev => prev.filter((_, i) => i !== index));
    if (index === currentIndex) {
      playNext();
    } else if (index < currentIndex) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const toggleShuffle = () => {
    setIsShuffled(prev => !prev);
  };

  const toggleRepeatMode = () => {
    setRepeatMode(prev => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  };

  const value = {
    currentSong,
    isPlaying,
    playlist,
    currentIndex,
    duration,
    position,
    isShuffled,
    repeatMode,
    playSong,
    togglePlayPause,
    playNext,
    playPrevious,
    seekTo,
    addToPlaylist,
    removeFromPlaylist,
    toggleShuffle,
    toggleRepeatMode,
    setPlaylist,
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
};