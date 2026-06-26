import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator,
  Alert,
  ScrollView
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation';
import { COLORS, SPACING } from '../../theme/theme';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

type Props = NativeStackScreenProps<AuthStackParamList, 'Onboarding'>;

const WELLNESS_GOALS = [
  'Reduce Stress',
  'Improve Sleep',
  'Inner Peace',
  'Physical Health',
  'Digital Detox',
  'Personal Growth',
  'Spiritual Connection'
];

const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const toggleGoal = (goal: string) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter(g => g !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  const handleComplete = async () => {
    if (!name || !location || selectedGoals.length === 0) {
      Alert.alert('Incomplete Profile', 'Please fill in all fields and select at least one goal');
      return;
    }

    setLoading(true);
    try {
      const response = await api.put('/users/onboarding', {
        name,
        location,
        goals: selectedGoals,
      });
      await updateUser(response.data.user);
      // RootNavigator will handle navigation to MainTabNavigator
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Could not complete onboarding');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Final Steps</Text>
        <Text style={styles.subtitle}>Help us personalize your experience</Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              onChangeText={setName}
              value={name}
              placeholder="Enter your full name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              onChangeText={setLocation}
              value={location}
              placeholder="City, Country"
            />
          </View>

          <Text style={styles.sectionTitle}>What are your wellness goals?</Text>
          <View style={styles.interestsContainer}>
            {WELLNESS_GOALS.map(goal => (
              <TouchableOpacity
                key={goal}
                style={[
                  styles.interestTag,
                  selectedGoals.includes(goal) && styles.interestTagSelected
                ]}
                onPress={() => toggleGoal(goal)}
              >
                <Text style={[
                  styles.interestText,
                  selectedGoals.includes(goal) && styles.interestTextSelected
                ]}>
                  {goal}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity 
            style={styles.button} 
            onPress={handleComplete}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Start Journey</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
  },
  form: {
    marginBottom: SPACING.xl,
  },
  inputGroup: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: SPACING.md,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.xl,
  },
  interestTag: {
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  interestTagSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  interestText: {
    color: COLORS.text,
    fontSize: 14,
  },
  interestTextSelected: {
    color: '#FFF',
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
    height: 56,
    justifyContent: 'center',
    marginTop: SPACING.md,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OnboardingScreen;
