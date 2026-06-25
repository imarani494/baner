import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from './NavigationContext';
import { useApp } from '../store/AppContext';

import { SplashScreen } from '../screens/SplashScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { GalleryScreen } from '../screens/GalleryScreen';
import { PhotoDetailScreen } from '../screens/PhotoDetailScreen';
import { TasksScreen } from '../screens/TasksScreen';
import { TaskDetailScreen } from '../screens/TaskDetailScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

import { TabBar } from '../components/navigation/TabBar';

const TAB_SCREENS = new Set(['Home', 'Gallery', 'Tasks', 'Profile']);

export function RootNavigator() {
  const { currentRoute } = useNavigation();
  const { state } = useApp();

  const renderScreen = () => {
    switch (currentRoute.name) {
      case 'Splash':
        return <SplashScreen />;
      case 'Login':
        return <LoginScreen />;
      case 'Register':
        return <RegisterScreen />;
      case 'Home':
        return <HomeScreen />;
      case 'Gallery':
        return <GalleryScreen />;
      case 'PhotoDetail':
        return <PhotoDetailScreen />;
      case 'Tasks':
        return <TasksScreen />;
      case 'TaskDetail':
        return <TaskDetailScreen />;
      case 'Profile':
        return <ProfileScreen />;
      default:
        return <LoginScreen />;
    }
  };

  const showTabBar =
    state.isAuthenticated && TAB_SCREENS.has(currentRoute.name);

  return (
    <View style={styles.root}>
      <View style={styles.screen}>{renderScreen()}</View>
      {showTabBar && <TabBar />}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  screen: {
    flex: 1,
  },
});
