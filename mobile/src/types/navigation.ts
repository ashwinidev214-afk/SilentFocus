export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Host: undefined;
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
  Explore: undefined;
  Categories: undefined;
  Messages: undefined;
  Profile: undefined;
};

export type HostStackParamList = {
  HostDashboard: undefined;
  ManageListings: undefined;
  HostBookings: undefined;
  Revenue: undefined;
};
