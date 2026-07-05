import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePlayer } from '../context/PlayerContext';
import MiniPlayer from '../components/MiniPlayer';
import SongItem from '../components/SongItem';

const LibraryScreen = ({ navigation }) => {
  const { playlist, currentSong, removeFromPlaylist } = usePlayer();
  const [filter, setFilter] = useState('all');

  const filteredPlaylist = playlist;

  const renderSongItem = ({ item, index }) => (
    <SongItem
      song={item}
      onPress={() => navigation.navigate('Player', { song: item, playlist, index })}
      isActive={currentSong?.id === item.id}
      rightComponent={
        <TouchableOpacity onPress={() => removeFromPlaylist(index)} style={styles.removeButton}>
          <Ionicons name="close-circle" size={24} color="#FF4444" />
        </TouchableOpacity>
      }
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.userAvatar}>
            <Ionicons name="person" size={24} color="white" />
          </View>
          <Text style={styles.headerTitle}>Моя библиотека</Text>
          <TouchableOpacity>
            <Ionicons name="add" size={28} color="white" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.filterContainer}>
          <TouchableOpacity style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}>
            <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
              Плейлисты
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.filterButton, filter === 'albums' && styles.filterButtonActive]}>
            <Text style={[styles.filterText, filter === 'albums' && styles.filterTextActive]}>
              Альбомы
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {playlist.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="musical-notes" size={64} color="#B3B3B3" />
          <Text style={styles.emptyTitle}>Создайте свой первый плейлист</Text>
          <Text style={styles.emptySubtitle}>
            Добавляйте песни в очередь воспроизведения
          </Text>
        </View>
      ) : (
        <FlatList
          data={playlist}
          renderItem={renderSongItem}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          style={styles.list}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.listHeader}>
              <View style={styles.sortContainer}>
                <Ionicons name="swap-vertical" size={20} color="white" />
                <Text style={styles.sortText}>Недавно добавленные</Text>
              </View>
            </View>
          }
        />
      )}

      <MiniPlayer navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  userAvatar: {
    width: 32,
    height: 32,
    backgroundColor: '#1DB954',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#333333',
    borderRadius: 20,
  },
  filterButtonActive: {
    backgroundColor: '#1DB954',
  },
  filterText: {
    color: 'white',
    fontSize: 14,
  },
  filterTextActive: {
    color: 'black',
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
    paddingHorizontal: 20,
  },
  listHeader: {
    marginVertical: 10,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sortText: {
    color: 'white',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  emptySubtitle: {
    color: '#B3B3B3',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  removeButton: {
    padding: 5,
  },
});

export default LibraryScreen;