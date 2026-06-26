import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';
import HostNavigator from './HostNavigator';
import RetreatDetailScreen from '../screens/RetreatDetailScreen';
import ExperienceDetailScreen from '../screens/ExperienceDetailScreen';
import BookingScreen from '../screens/BookingScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  // In a real app, you would check if the user is authenticated here
  const isAuthenticated = false;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
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
