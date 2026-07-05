import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import MiniPlayer from '../components/MiniPlayer';
import SongItem from '../components/SongItem';

const SearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [allSongs, setAllSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllSongs();
  }, []);

  const loadAllSongs = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Разрешение необходимо', 'Доступ к медиафайлам отклонен');
        setLoading(false);
        return;
      }

      const media = await MediaLibrary.getAssetsAsync({
        mediaType: 'audio',
        first: 100,
      });

      const formattedSongs = media.assets.map(asset => ({
        id: asset.id,
        filename: asset.filename.replace(/\.[^/.]+$/, ""),
        uri: asset.uri,
        duration: asset.duration || 0,
        artist: asset.artist || 'Неизвестный исполнитель',
        album: asset.album || 'Неизвестный альбом',
      }));

      setAllSongs(formattedSongs);
    } catch (error) {
      console.error('Error loading songs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setFilteredSongs([]);
      return;
    }

    const filtered = allSongs.filter(song => 
      song.filename.toLowerCase().includes(query.toLowerCase()) ||
      song.artist.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredSongs(filtered);
  };

  const renderSongItem = ({ item, index }) => (
    <SongItem
      song={item}
      onPress={() => navigation.navigate('Player', { song: item, playlist: filteredSongs, index })}
    />
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#1DB954" style={styles.loader} />
        <MiniPlayer navigation={navigation} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Поиск</Text>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#B3B3B3" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Что хочешь послушать?"
            placeholderTextColor="#B3B3B3"
            value={searchQuery}
            onChangeText={handleSearch}
            autoFocus={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <Ionicons name="close-circle" size={20} color="#B3B3B3" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {searchQuery.length > 0 ? (
        <FlatList
          data={filteredSongs}
          renderItem={renderSongItem}
          keyExtractor={item => item.id}
          style={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.noResults}>
              <Ionicons name="search-outline" size={48} color="#B3B3B3" />
              <Text style={styles.noResultsText}>Ничего не найдено</Text>
            </View>
          }
        />
      ) : (
        <View style={styles.browseContainer}>
          <Text style={styles.browseTitle}>Просмотреть все</Text>
          <View style={styles.genreGrid}>
            <TouchableOpacity style={[styles.genreCard, { backgroundColor: '#E13300' }]}>
              <Text style={styles.genreText}>Поп</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.genreCard, { backgroundColor: '#1E3264' }]}>
              <Text style={styles.genreText}>Хип-хоп</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.genreCard, { backgroundColor: '#8400E7' }]}>
              <Text style={styles.genreText}>Рок</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.genreCard, { backgroundColor: '#E1118B' }]}>
              <Text style={styles.genreText}>Электроника</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  loader: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: 'black',
  },
  list: {
    flex: 1,
    paddingHorizontal: 20,
  },
  noResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  noResultsText: {
    color: '#B3B3B3',
    fontSize: 16,
    marginTop: 16,
  },
  browseContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  browseTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  genreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  genreCard: {
    width: '47%',
    height: 100,
    borderRadius: 8,
    justifyContent: 'center',
    padding: 16,
  },
  genreText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SearchScreen;