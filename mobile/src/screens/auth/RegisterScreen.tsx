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
import api from '../../services/api';
import { Formik } from 'formik';
import * as Yup from 'yup';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

const RegisterSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Too short!').required('Required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Required'),
});

const INTERESTS = [
  'Silent Retreats',
  'Meditation',
  'Yoga',
  'Silent Walks',
  'Mindfulness',
  'Nature',
  'Silent Biking',
  'Workshops'
];

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleRegister = async (values: any) => {
    if (selectedInterests.length === 0) {
      Alert.alert('Interests Required', 'Please select at least one interest');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/register', {
        ...values,
        interests: selectedInterests,
      });
      Alert.alert(
        'Registration Successful',
        'Please check your email for the OTP code',
        [{ text: 'OK', onPress: () => navigation.navigate('OTP', { email: values.email }) }]
      );
    } catch (error: any) {
      Alert.alert('Registration Failed', error.response?.data?.message || 'Something went wrong');
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
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join our community of mindfulness seekers</Text>

        <Formik
          initialValues={{ email: '', password: '', confirmPassword: '' }}
          validationSchema={RegisterSchema}
          onSubmit={handleRegister}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={[styles.input, touched.email && errors.email ? styles.inputError : null]}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={[styles.input, touched.password && errors.password ? styles.inputError : null]}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  placeholder="Enter your password"
                  secureTextEntry
                />
                {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                  style={[styles.input, touched.confirmPassword && errors.confirmPassword ? styles.inputError : null]}
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  value={values.confirmPassword}
                  placeholder="Confirm your password"
                  secureTextEntry
                />
                {touched.confirmPassword && errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
              </View>

              <Text style={styles.sectionTitle}>What interests you?</Text>
              <View style={styles.interestsContainer}>
                {INTERESTS.map(interest => (
                  <TouchableOpacity
                    key={interest}
                    style={[
                      styles.interestTag,
                      selectedInterests.includes(interest) && styles.interestTagSelected
                    ]}
                    onPress={() => toggleInterest(interest)}
                  >
                    <Text style={[
                      styles.interestText,
                      selectedInterests.includes(interest) && styles.interestTextSelected
                    ]}>
                      {interest}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity 
                style={styles.button} 
                onPress={() => handleSubmit()}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.buttonText}>Sign Up</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </Formik>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.linkText}>Sign In</Text>
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
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 4,
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
  },
  footerText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  linkText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
