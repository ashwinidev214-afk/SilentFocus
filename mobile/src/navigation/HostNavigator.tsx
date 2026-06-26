import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HostStackParamList } from '../types/navigation';

import HostDashboardScreen from '../screens/host/HostDashboardScreen';
import ManageListingsScreen from '../screens/host/ManageListingsScreen';
import HostBookingsScreen from '../screens/host/HostBookingsScreen';
import RevenueScreen from '../screens/host/RevenueScreen';

const Stack = createNativeStackNavigator<HostStackParamList>();

const HostNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HostDashboard" component={HostDashboardScreen} options={{ title: 'Host Dashboard' }} />
      <Stack.Screen name="ManageListings" component={ManageListingsScreen} options={{ title: 'Manage Listings' }} />
      <Stack.Screen name="HostBookings" component={HostBookingsScreen} options={{ title: 'Bookings' }} />
      <Stack.Screen name="Revenue" component={RevenueScreen} options={{ title: 'Revenue' }} />
    </Stack.Navigator>
  );
};

export default HostNavigator;
