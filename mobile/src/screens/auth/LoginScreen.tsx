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
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Formik } from 'formik';
import * as Yup from 'yup';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Too short!').required('Required'),
});

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values: any) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', values);
      const { token, user } = response.data;
      await signIn(token, user);
      // RootNavigator will handle navigation based on auth state
    } catch (error: any) {
      Alert.alert('Login Failed', error.response?.data?.message || 'Something went wrong');
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
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue your mindfulness journey</Text>

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={handleLogin}
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

              <TouchableOpacity 
                style={styles.forgotPassword}
                onPress={() => navigation.navigate('ForgotPassword')}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.button} 
                onPress={() => handleSubmit()}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.buttonText}>Sign In</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </Formik>

        <View style={styles.socialButtons}>
          <TouchableOpacity style={styles.socialButton}>
            <Text style={styles.socialButtonText}>Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Text style={styles.socialButtonText}>Apple</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.linkText}>Sign Up</Text>
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.lg,
  },
  forgotPasswordText: {
    color: COLORS.primary,
    fontSize: 14,
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
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  socialButton: {
    flex: 0.48,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  socialButtonText: {
    fontSize: 16,
    color: COLORS.text,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
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

export default LoginScreen;
