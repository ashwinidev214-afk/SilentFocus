import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  SafeAreaView,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../../theme/theme';
import { MOCK_LISTINGS } from '../../services/mockData';
import ListingCard from '../../components/ListingCard';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, MainTabParamList } from '../../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type CategoriesRouteProp = RouteProp<MainTabParamList, 'Categories'>;

const CATEGORIES = [
  { id: 'cat_retreat', name: 'Retreats', icon: 'leaf-outline', color: '#4CAF50' },
  { id: 'cat_meditation', name: 'Meditation', icon: 'sunny-outline', color: '#2196F3' },
  { id: 'cat_walk', name: 'Silent Walks', icon: 'walk-outline', color: '#FF9800' },
  { id: 'cat_biking', name: 'Silent Biking', icon: 'bicycle-outline', color: '#E91E63' },
  { id: 'cat_workshop', name: 'Workshops', icon: 'color-palette-outline', color: '#9C27B0' },
  { id: 'cat_quiet_location', name: 'Quiet Spaces', icon: 'moon-outline', color: '#607D8B' },
];

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - SPACING.md * 3) / 2;

const CategoriesScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<CategoriesRouteProp>();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    if (route.params?.categoryId) {
      setSelectedCategory(route.params.categoryId);
    }
  }, [route.params?.categoryId]);

  const filteredListings = selectedCategory 
    ? MOCK_LISTINGS.filter(l => l.category_id === selectedCategory)
    : [];

  const renderCategoryItem = ({ item }: { item: typeof CATEGORIES[0] }) => (
    <TouchableOpacity 
      style={[
        styles.categoryCard, 
        { backgroundColor: item.color + '15' },
        selectedCategory === item.id && styles.selectedCategoryCard
      ]}
      onPress={() => setSelectedCategory(item.id === selectedCategory ? null : item.id)}
    >
      <Ionicons name={item.icon as any} size={32} color={item.color} />
      <Text style={[styles.categoryName, { color: item.color }]}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {selectedCategory ? (
          <View style={styles.titleRow}>
            <TouchableOpacity onPress={() => setSelectedCategory(null)} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={COLORS.text} />
            </TouchableOpacity>
            <Text style={styles.title}>
              {CATEGORIES.find(c => c.id === selectedCategory)?.name}
            </Text>
          </View>
        ) : (
          <Text style={styles.title}>Categories</Text>
        )}
      </View>

      {!selectedCategory ? (
        <FlatList
          data={CATEGORIES}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.gridContent}
        />
      ) : (
        <FlatList
          data={filteredListings}
          renderItem={({ item }) => (
            <ListingCard 
              listing={item} 
              onPress={() => {
                if (item.category_id === 'cat_retreat') {
                  navigation.navigate('RetreatDetail', { id: item.id });
                } else {
                  navigation.navigate('ExperienceDetail', { id: item.id });
                }
              }} 
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="leaf-outline" size={64} color={COLORS.border} />
              <Text style={styles.emptyText}>No listings in this category yet</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: SPACING.sm,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  gridContent: {
    padding: SPACING.md,
  },
  categoryCard: {
    width: COLUMN_WIDTH,
    height: 120,
    borderRadius: 16,
    margin: SPACING.xs,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedCategoryCard: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  categoryName: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    padding: SPACING.md,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 16,
  },
});

export default CategoriesScreen;
