import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MiniPlayer from '../components/MiniPlayer';
import SongItem from '../components/SongItem';
import { requestMediaPermissions, getAllAudioFiles, openAppSettings } from '../utils/permissions';

const HomeScreen = ({ navigation }) => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSongs();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadSongs();
    });
    return unsubscribe;
  }, [navigation]);

  const loadSongs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Запрашиваем разрешение
      const hasPermission = await requestMediaPermissions();
      
      if (!hasPermission) {
        setError('Нет доступа к медиафайлам');
        setLoading(false);
        return;
      }
      
      // Получаем все аудиофайлы
      const audioFiles = await getAllAudioFiles();
      
      if (audioFiles.length === 0) {
        setError('MP3 файлы не найдены на устройстве');
      } else {
        setSongs(audioFiles);
        setRecentlyPlayed(audioFiles.slice(0, 10));
      }
      
    } catch (error) {
      console.error('Ошибка загрузки песен:', error);
      setError('Не удалось загрузить музыкальные файлы');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadSongs();
  };

  const handlePermissionDenied = () => {
    Alert.alert(
      'Доступ запрещен',
      'Чтобы слушать музыку, приложению нужен доступ к вашим аудиофайлам. ' +
      'Перейдите в настройки и разрешите доступ.',
      [
        {
          text: 'Отмена',
          style: 'cancel',
        },
        {
          text: 'Настройки',
          onPress: () => openAppSettings(),
        },
      ]
    );
  };

  const renderSongItem = ({ item, index }) => (
    <SongItem
      song={item}
      onPress={() => navigation.navigate('Player', { song: item, playlist: songs, index })}
    />
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#1DB954" />
          <Text style={styles.loadingText}>Загрузка музыки...</Text>
        </View>
        <MiniPlayer navigation={navigation} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#FF4444" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadSongs}>
            <Text style={styles.retryButtonText}>Повторить</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingsButton} onPress={handlePermissionDenied}>
            <Text style={styles.settingsButtonText}>Настройки доступа</Text>
          </TouchableOpacity>
        </View>
        <MiniPlayer navigation={navigation} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Моя музыка</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={loadSongs}>
            <Ionicons name="refresh-outline" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="settings-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor="#1DB954"
            colors={['#1DB954']}
          />
        }
      >
        {recentlyPlayed.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Недавно добавленные</Text>
            <View style={styles.recentGrid}>
              {recentlyPlayed.slice(0, 6).map((song, index) => (
                <TouchableOpacity
                  key={song.id}
                  style={styles.recentCard}
                  onPress={() => navigation.navigate('Player', { song, playlist: songs, index })}
                >
                  <View style={styles.recentCardImage}>
                    <Ionicons name="musical-notes" size={24} color="#1DB954" />
                  </View>
                  <Text style={styles.recentCardTitle} numberOfLines={1}>
                    {song.filename}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        <View style={styles.allSongsHeader}>
          <Text style={styles.sectionTitle}>Вся музыка</Text>
          <Text style={styles.songCount}>{songs.length} песен</Text>
        </View>
        
        {songs.map((song, index) => (
          <SongItem
            key={song.id}
            song={song}
            onPress={() => navigation.navigate('Player', { song, playlist: songs, index })}
          />
        ))}
      </ScrollView>

      <MiniPlayer navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    color: '#B3B3B3',
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    color: '#FF4444',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#1DB954',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 10,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  settingsButton: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#1DB954',
  },
  settingsButtonText: {
    color: '#1DB954',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  greeting: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  allSongsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 15,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  songCount: {
    color: '#B3B3B3',
    fontSize: 14,
  },
  recentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  recentCard: {
    width: '47%',
    backgroundColor: '#333333',
    borderRadius: 8,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  recentCardImage: {
    width: 48,
    height: 48,
    backgroundColor: '#1DB954',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recentCardTitle: {
    color: 'white',
    fontWeight: '600',
    flex: 1,
    fontSize: 14,
  },
});

export default HomeScreen;