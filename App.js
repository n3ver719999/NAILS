import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Ionicons } from '@expo/vector-icons';
import { PlayerProvider } from './src/context/PlayerContext';
import HomeScreen from './src/screens/HomeScreen';
import LibraryScreen from './src/screens/LibraryScreen';
import SearchScreen from './src/screens/SearchScreen';
import PlayerScreen from './src/screens/PlayerScreen';
import MiniPlayer from './src/components/MiniPlayer';

const HomeStack = createStackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      headerShown: false,
    },
  },
});

const LibraryStack = createStackNavigator({
  Library: {
    screen: LibraryScreen,
    navigationOptions: {
      headerShown: false,
    },
  },
});

const SearchStack = createStackNavigator({
  Search: {
    screen: SearchScreen,
    navigationOptions: {
      headerShown: false,
    },
  },
});

const TabNavigator = createBottomTabNavigator(
  {
    Home: {
      screen: HomeStack,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Ionicons name="home" size={24} color={tintColor} />
        ),
        tabBarLabel: 'Главная',
      },
    },
    Search: {
      screen: SearchStack,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Ionicons name="search" size={24} color={tintColor} />
        ),
        tabBarLabel: 'Поиск',
      },
    },
    Library: {
      screen: LibraryStack,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Ionicons name="library" size={24} color={tintColor} />
        ),
        tabBarLabel: 'Библиотека',
      },
    },
  },
  {
    tabBarOptions: {
      activeTintColor: '#1DB954',
      inactiveTintColor: '#B3B3B3',
      style: {
        backgroundColor: '#121212',
        borderTopColor: '#282828',
        borderTopWidth: 1,
        paddingBottom: 5,
        paddingTop: 5,
        height: 60,
      },
      labelStyle: {
        fontSize: 12,
        fontWeight: '600',
      },
    },
  }
);

const MainStack = createStackNavigator(
  {
    Main: {
      screen: TabNavigator,
      navigationOptions: {
        headerShown: false,
      },
    },
    Player: {
      screen: PlayerScreen,
      navigationOptions: {
        headerShown: false,
        animationEnabled: true,
        cardStyle: { backgroundColor: 'transparent' },
      },
    },
  },
  {
    mode: 'modal',
    initialRouteName: 'Main',
  }
);

const AppContainer = createAppContainer(MainStack);

export default function App() {
  return (
    <PlayerProvider>
      <AppContainer />
      <StatusBar style="light" />
    </PlayerProvider>
  );
}

