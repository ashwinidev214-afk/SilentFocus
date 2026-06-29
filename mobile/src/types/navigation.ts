import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  Host: NavigatorScreenParams<HostStackParamList>;
  RetreatDetail: { id: string };
  ExperienceDetail: { id: string };
  Booking: { id: string; type: 'retreat' | 'experience' };
};

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  OTP: { email: string };
  Onboarding: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Explore: { searchQuery?: string; categoryId?: string } | undefined;
  Categories: { categoryId?: string } | undefined;
  Messages: undefined;
  Profile: undefined;
};

export type HostStackParamList = {
  HostDashboard: undefined;
  ManageListings: undefined;
  HostBookings: undefined;
  Revenue: undefined;
};
