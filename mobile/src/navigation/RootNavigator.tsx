import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useAuth } from '../context/AuthContext';
import { View, ActivityIndicator } from 'react-native';
import { COLORS } from '../theme/theme';

import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';
import HostNavigator from './HostNavigator';
import RetreatDetailScreen from '../screens/RetreatDetailScreen';
import ExperienceDetailScreen from '../screens/ExperienceDetailScreen';
import BookingScreen from '../screens/BookingScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : !user.onboarded ? (
        // Re-using AuthNavigator because Onboarding is part of AuthStackParamList for now
        // But we could also put it in RootStackParamList if needed
        <Stack.Screen name="Auth" component={AuthNavigator} initialParams={{ screen: 'Onboarding' }} />
      ) : (
        <>
          <Stack.Screen name="Main" component={MainTabNavigator} />
          <Stack.Screen name="Host" component={HostNavigator} />
          <Stack.Screen 
            name="RetreatDetail" 
            component={RetreatDetailScreen} 
            options={{ headerShown: true, title: 'Retreat' }} 
          />
          <Stack.Screen 
            name="ExperienceDetail" 
            component={ExperienceDetailScreen} 
            options={{ headerShown: true, title: 'Experience' }} 
          />
          <Stack.Screen 
            name="Booking" 
            component={BookingScreen} 
            options={{ headerShown: true, title: 'Booking' }} 
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
