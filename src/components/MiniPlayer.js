import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePlayer } from '../context/PlayerContext';
import Slider from '@react-native-community/slider';

const MiniPlayer = ({ navigation }) => {
  const { currentSong, isPlaying, togglePlayPause, duration, position } = usePlayer();

  if (!currentSong) return null;

  const progress = duration > 0 ? position / duration : 0;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate('Player')}
      activeOpacity={0.9}
    >
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>
      
      <View style={styles.content}>
        <View style={styles.songInfo}>
          <View style={styles.artwork}>
            <Ionicons name="musical-note" size={20} color="#1DB954" />
          </View>
          <View style={styles.textInfo}>
            <Text style={styles.songTitle} numberOfLines={1}>
              {currentSong.filename}
            </Text>
            <Text style={styles.songArtist} numberOfLines={1}>
              {currentSong.artist}
            </Text>
          </View>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity onPress={togglePlayPause} style={styles.playButton}>
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={24}
              color="white"
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#282828',
    borderTopColor: '#404040',
    borderTopWidth: 1,
  },
  progressBar: {
    height: 2,
    backgroundColor: '#535353',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1DB954',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  songInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  artwork: {
    width: 40,
    height: 40,
    backgroundColor: '#333333',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textInfo: {
    flex: 1,
  },
  songTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  songArtist: {
    color: '#B3B3B3',
    fontSize: 12,
    marginTop: 2,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  playButton: {
    padding: 8,
  },
});

export default MiniPlayer;