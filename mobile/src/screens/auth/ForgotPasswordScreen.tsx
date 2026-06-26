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
  Alert
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation';
import { COLORS, SPACING } from '../../theme/theme';
import api from '../../services/api';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email) {
      Alert.alert('Email Required', 'Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      Alert.alert(
        'Email Sent',
        'If an account exists with this email, you will receive reset instructions.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>Enter your email to receive reset instructions</Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              onChangeText={setEmail}
              value={email}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoFocus
            />
          </View>

          <TouchableOpacity 
            style={styles.button} 
            onPress={handleReset}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Send Instructions</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: SPACING.lg,
  },
  backButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
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
    marginBottom: SPACING.xl,
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
  button: {
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
    height: 56,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ForgotPasswordScreen;
