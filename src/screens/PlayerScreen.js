import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePlayer } from '../context/PlayerContext';
import Slider from '@react-native-community/slider';

const { width } = Dimensions.get('window');

const PlayerScreen = ({ navigation }) => {
  const {
    currentSong,
    isPlaying,
    togglePlayPause,
    playNext,
    playPrevious,
    duration,
    position,
    seekTo,
    isShuffled,
    toggleShuffle,
    repeatMode,
    toggleRepeatMode,
  } = usePlayer();

  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isPlaying) {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 10000,
          useNativeDriver: true,
        })
      ).start();
    } else {
      spinValue.stopAnimation();
    }
  }, [isPlaying]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const formatTime = (millis) => {
    if (!millis) return '0:00';
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!currentSong) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Ionicons name="musical-notes" size={64} color="#B3B3B3" />
          <Text style={styles.emptyText}>Выберите песню для воспроизведения</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-down" size={32} color="white" />
        </TouchableOpacity>
        <View style={styles.nowPlaying}>
          <Text style={styles.nowPlayingText}>Сейчас играет</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.artworkContainer}>
        <Animated.View style={[styles.artwork, { transform: [{ rotate: spin }] }]}>
          <View style={styles.artworkInner}>
            <Ionicons name="musical-note" size={80} color="#1DB954" />
          </View>
        </Animated.View>
      </View>

      <View style={styles.songInfo}>
        <View>
          <Text style={styles.songTitle} numberOfLines={1}>
            {currentSong.filename}
          </Text>
          <Text style={styles.songArtist} numberOfLines={1}>
            {currentSong.artist}
          </Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="heart-outline" size={24} color="#1DB954" />
        </TouchableOpacity>
      </View>

      <View style={styles.progressContainer}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={duration}
          value={position}
          onSlidingComplete={seekTo}
          minimumTrackTintColor="#1DB954"
          maximumTrackTintColor="#535353"
          thumbTintColor="#1DB954"
        />
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{formatTime(position)}</Text>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity onPress={toggleShuffle}>
          <Ionicons
            name="shuffle"
            size={24}
            color={isShuffled ? '#1DB954' : '#B3B3B3'}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={playPrevious} style={styles.controlButton}>
          <Ionicons name="play-skip-back" size={32} color="white" />
        </TouchableOpacity>

        <TouchableOpacity onPress={togglePlayPause} style={styles.playButton}>
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={32}
            color="black"
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={playNext} style={styles.controlButton}>
          <Ionicons name="play-skip-forward" size={32} color="white" />
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleRepeatMode}>
          <Ionicons
            name={repeatMode === 'one' ? 'repeat' : 'repeat'}
            size={24}
            color={repeatMode !== 'off' ? '#1DB954' : '#B3B3B3'}
          />
          {repeatMode === 'one' && (
            <Text style={styles.repeatOneIndicator}>1</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.additionalControls}>
        <TouchableOpacity>
          <Ionicons name="share-outline" size={24} color="#B3B3B3" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="list-outline" size={24} color="#B3B3B3" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    color: '#B3B3B3',
    fontSize: 18,
    marginTop: 20,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  nowPlaying: {
    alignItems: 'center',
  },
  nowPlayingText: {
    color: '#B3B3B3',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  artworkContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  artwork: {
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#282828',
    justifyContent: 'center',
    alignItems: 'center',
  },
  artworkInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  songInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  songTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    maxWidth: width - 100,
  },
  songArtist: {
    color: '#B3B3B3',
    fontSize: 16,
  },
  progressContainer: {
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    color: '#B3B3B3',
    fontSize: 12,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 30,
    marginBottom: 30,
  },
  controlButton: {
    padding: 10,
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1DB954',
    justifyContent: 'center',
    alignItems: 'center',
  },
  repeatOneIndicator: {
    color: '#1DB954',
    fontSize: 10,
    position: 'absolute',
    top: -5,
    right: -5,
  },
  additionalControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
  },
});

export default PlayerScreen;