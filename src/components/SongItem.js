import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePlayer } from '../context/PlayerContext';

const SongItem = ({ song, onPress, isActive, rightComponent }) => {
  const { addToPlaylist, currentSong, isPlaying } = usePlayer();

  const formatDuration = (millis) => {
    if (!millis) return '0:00';
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <TouchableOpacity style={[styles.container, isActive && styles.activeContainer]} onPress={onPress}>
      <View style={styles.songInfo}>
        <View style={[styles.artwork, isActive && styles.activeArtwork]}>
          {isActive && isPlaying ? (
            <View style={styles.equalizer}>
              <View style={styles.bar} />
              <View style={[styles.bar, styles.bar2]} />
              <View style={[styles.bar, styles.bar3]} />
              <View style={[styles.bar, styles.bar4]} />
            </View>
          ) : (
            <Ionicons name="musical-note" size={20} color={isActive ? '#1DB954' : '#B3B3B3'} />
          )}
        </View>
        
        <View style={styles.textInfo}>
          <Text style={[styles.songTitle, isActive && styles.activeText]} numberOfLines={1}>
            {song.filename}
          </Text>
          <Text style={styles.songArtist} numberOfLines={1}>
            {song.artist}
          </Text>
        </View>
      </View>

      <View style={styles.rightSection}>
        {rightComponent || (
          <TouchableOpacity onPress={(e) => {
            e.stopPropagation();
            addToPlaylist(song);
          }}>
            <Ionicons name="add-circle-outline" size={24} color="#B3B3B3" />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  activeContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  songInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  artwork: {
    width: 48,
    height: 48,
    backgroundColor: '#282828',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activeArtwork: {
    backgroundColor: '#1DB954',
  },
  equalizer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 20,
    gap: 2,
  },
  bar: {
    width: 3,
    backgroundColor: 'black',
    borderRadius: 1,
  },
  bar2: {
    height: 12,
  },
  bar3: {
    height: 20,
  },
  bar4: {
    height: 8,
  },
  textInfo: {
    flex: 1,
  },
  songTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  activeText: {
    color: '#1DB954',
  },
  songArtist: {
    color: '#B3B3B3',
    fontSize: 14,
    marginTop: 4,
  },
  rightSection: {
    marginLeft: 12,
  },
});

export default SongItem;