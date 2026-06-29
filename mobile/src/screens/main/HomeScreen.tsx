import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  FlatList,
  StatusBar,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { COLORS, SPACING } from '../../theme/theme';
import { MOCK_LISTINGS } from '../../services/mockData';
import ListingCard from '../../components/ListingCard';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const CATEGORIES = [
  { id: 'cat_retreat', name: 'Retreats', icon: 'leaf-outline' },
  { id: 'cat_meditation', name: 'Meditation', icon: 'sunny-outline' },
  { id: 'cat_walk', name: 'Silent Walks', icon: 'walk-outline' },
  { id: 'cat_biking', name: 'Silent Biking', icon: 'bicycle-outline' },
  { id: 'cat_workshop', name: 'Workshops', icon: 'color-palette-outline' },
  { id: 'cat_quiet_location', name: 'Quiet Spaces', icon: 'moon-outline' },
];

const HomeScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation<NavigationProp>();

  const featuredRetreats = MOCK_LISTINGS.filter(l => l.category_id === 'cat_retreat');
  const upcomingExperiences = MOCK_LISTINGS.filter(l => l.category_id !== 'cat_retreat');

  const renderCategory = ({ item }: { item: typeof CATEGORIES[0] }) => (
    <TouchableOpacity 
      style={styles.categoryItem}
      onPress={() => navigation.navigate('Main', { screen: 'Categories', params: { categoryId: item.id } })}
    >
      <View style={styles.categoryIconContainer}>
        <Ionicons name={item.icon as any} size={24} color={COLORS.primary} />
      </View>
      <Text style={styles.categoryLabel}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userNameText}>{user?.first_name || 'Friend'}</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        {/* Reflection Prompt */}
        <View style={styles.reflectionCard}>
          <Text style={styles.reflectionQuote}>
            "Silence is the sleep that nourishes wisdom."
          </Text>
          <Text style={styles.reflectionAuthor}>— Francis Bacon</Text>
          <TouchableOpacity style={styles.reflectionButton}>
            <Text style={styles.reflectionButtonText}>Journal your silence</Text>
          </TouchableOpacity>
        </View>

        {/* Categories Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Discover by Category</Text>
          <FlatList
            data={CATEGORIES}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {/* Featured Retreats Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Retreats</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Main', { screen: 'Explore', params: undefined })}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={featuredRetreats}
            renderItem={({ item }) => (
              <ListingCard 
                listing={item} 
                horizontal 
                onPress={() => navigation.navigate('RetreatDetail', { id: item.id })} 
              />
            )}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredList}
          />
        </View>

        {/* Upcoming Experiences Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mindful Experiences</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Main', { screen: 'Explore', params: undefined })}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {upcomingExperiences.map((item) => (
            <ListingCard 
              key={item.id}
              listing={item} 
              onPress={() => navigation.navigate('ExperienceDetail', { id: item.id })} 
            />
          ))}
        </View>
        
        <View style={{ height: SPACING.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  welcomeText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  userNameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reflectionCard: {
    margin: SPACING.md,
    padding: SPACING.lg,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    alignItems: 'center',
  },
  reflectionQuote: {
    fontSize: 18,
    fontStyle: 'italic',
    color: COLORS.background,
    textAlign: 'center',
    marginBottom: 8,
  },
  reflectionAuthor: {
    fontSize: 14,
    color: COLORS.accent,
    marginBottom: SPACING.md,
  },
  reflectionButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  reflectionButtonText: {
    color: COLORS.background,
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    marginTop: SPACING.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  seeAllText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  categoriesList: {
    paddingLeft: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: SPACING.lg,
  },
  categoryIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.accent + '33', // 20% opacity
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryLabel: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: '500',
  },
  featuredList: {
    paddingLeft: SPACING.md,
    paddingBottom: SPACING.sm,
  },
});

export default HomeScreen;
