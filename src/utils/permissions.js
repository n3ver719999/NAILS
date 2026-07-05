import { Platform, Alert, Linking } from 'react-native';
import * as MediaLibrary from 'expo-media-library';

/**
 * Запрос разрешения на доступ к медиафайлам
 * @returns {Promise<boolean>} - true если разрешение получено
 */
export const requestMediaPermissions = async () => {
  try {
    const { status, granted } = await MediaLibrary.requestPermissionsAsync();
    
    if (granted) {
      console.log('Разрешение на доступ к медиафайлам получено');
      return true;
    }
    
    if (status === 'denied') {
      showPermissionAlert();
      return false;
    }
    
    return false;
  } catch (error) {
    console.error('Ошибка при запросе разрешений:', error);
    return false;
  }
};

/**
 * Проверка текущего статуса разрешений
 * @returns {Promise<object>} - объект с информацией о разрешениях
 */
export const checkMediaPermissions = async () => {
  try {
    const { status, granted, canAskAgain } = await MediaLibrary.getPermissionsAsync();
    
    return {
      status,
      granted,
      canAskAgain,
      isPermanentlyDenied: status === 'denied' && !canAskAgain,
    };
  } catch (error) {
    console.error('Ошибка при проверке разрешений:', error);
    return {
      status: 'error',
      granted: false,
      canAskAgain: false,
      isPermanentlyDenied: false,
    };
  }
};

/**
 * Показывает диалог с просьбой предоставить разрешение
 */
const showPermissionAlert = () => {
  Alert.alert(
    'Доступ к музыке',
    'Приложению нужен доступ к вашим аудиофайлам для воспроизведения музыки. ' +
    'Пожалуйста, предоставьте разрешение в настройках.',
    [
      {
        text: 'Отмена',
        style: 'cancel',
      },
      {
        text: 'Открыть настройки',
        onPress: () => openAppSettings(),
      },
      {
        text: 'Повторить',
        onPress: () => requestMediaPermissions(),
      },
    ],
    { cancelable: false }
  );
};

/**
 * Открывает настройки приложения
 */
export const openAppSettings = () => {
  if (Platform.OS === 'ios') {
    Linking.openURL('app-settings:');
  } else {
    Linking.openSettings();
  }
};

/**
 * Запрос всех необходимых разрешений
 * @returns {Promise<boolean>} - true если все разрешения получены
 */
export const requestAllPermissions = async () => {
  const mediaPermission = await requestMediaPermissions();
  
  // Здесь можно добавить другие разрешения в будущем
  // const notificationPermission = await requestNotificationPermissions();
  // const storagePermission = await requestStoragePermissions();
  
  return mediaPermission; // && notificationPermission && storagePermission
};

/**
 * Проверка и запрос разрешений для Android 13+
 */
export const checkAndroid13Permissions = async () => {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    // Android 13 требует отдельные разрешения для аудио
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Ошибка при запросе Android 13 разрешений:', error);
      return false;
    }
  }
  return true;
};

/**
 * Получение списка всех аудиофайлов с устройства
 * @returns {Promise<Array>} - массив аудиофайлов
 */
export const getAllAudioFiles = async () => {
  try {
    const hasPermission = await requestMediaPermissions();
    
    if (!hasPermission) {
      throw new Error('Нет разрешения на доступ к медиафайлам');
    }
    
    // Проверка Android 13+
    if (Platform.OS === 'android') {
      const android13Permission = await checkAndroid13Permissions();
      if (!android13Permission) {
        throw new Error('Необходимы дополнительные разрешения для Android 13+');
      }
    }
    
    const media = await MediaLibrary.getAssetsAsync({
      mediaType: 'audio',
      first: 500, // Максимальное количество файлов
      sortBy: [MediaLibrary.SortBy.creationTime],
    });
    
    // Фильтруем только MP3 файлы
    const mp3Files = media.assets.filter(asset => 
      asset.filename.toLowerCase().endsWith('.mp3')
    );
    
    return mp3Files.map(asset => ({
      id: asset.id,
      filename: asset.filename.replace(/\.[^/.]+$/, ""),
      uri: asset.uri,
      duration: asset.duration || 0,
      artist: asset.artist || 'Неизвестный исполнитель',
      album: asset.album || 'Неизвестный альбом',
      creationTime: asset.creationTime,
      modificationTime: asset.modificationTime,
      fileSize: asset.fileSize || 0,
    }));
    
  } catch (error) {
    console.error('Ошибка при получении аудиофайлов:', error);
    throw error;
  }
};

/**
 * Проверка поддержки форматов
 */
export const getSupportedFormats = () => {
  return [
    '.mp3',
    '.m4a',
    '.wav',
    '.aac',
    '.ogg',
    '.flac',
    '.wma',
  ];
};

/**
 * Проверка, является ли файл поддерживаемым аудиоформатом
 */
export const isAudioFile = (filename) => {
  const supportedFormats = getSupportedFormats();
  const extension = filename.substring(filename.lastIndexOf('.')).toLowerCase();
  return supportedFormats.includes(extension);
};