import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';

const { width, height } = Dimensions.get('window');

const emailIcon = require('../assets/src/user.png');
const senhaIcon = require('../assets/src/senha.png');

const LoginScreen = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    'Bree-Serif': require('../assets/fonts/BreeSerif-Regular.ttf'),
  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // --- Validação básica ---
  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email é obrigatório';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email inválido';
    if (!password) newErrors.password = 'Senha é obrigatória';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- Simulação de login local ---
  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    setTimeout(() => {
      // Simulando "autenticação"
      const fakeUser = {
        email: 'camila.ferreira@email.com',
        password: 'adsdsf',
        username: 'Usuário Teste',
        userId: 1,
      };

      if (email.trim() === fakeUser.email && password === fakeUser.password) {
        Alert.alert('Sucesso', 'Login realizado com sucesso!');
        navigation.navigate('HomeScreen', {
          userId: fakeUser.userId,
          username: fakeUser.username,
        });
      } else {
        Alert.alert('Erro no Login', 'Email ou senha incorretos. Tente novamente.');
      }

      setLoading(false);
    }, 1200); // simula tempo de carregamento
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0c4793" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={['#fefeff', '#a4c4ff']} style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.contentWrapper}>
            <View style={styles.headerContainer}>
              <Text style={styles.greetingText}>Bem vindo!</Text>
              <Text style={styles.instructionText}>Faça seu login para continuar</Text>
            </View>

            <View style={styles.formArea}>
              {/* Email */}
              <View style={styles.inputContainer}>
                <View style={styles.iconBackground}>
                  <Image source={emailIcon} style={styles.inputIcon} />
                </View>
                <TextInput
                  style={styles.inputField}
                  placeholder="Email"
                  placeholderTextColor="rgba(255, 255, 255, 0.8)"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  accessibilityLabel="Campo de Email"
                />
              </View>
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

              {/* Senha */}
              <View style={styles.inputContainer}>
                <View style={styles.iconBackground}>
                  <Image source={senhaIcon} style={styles.inputIcon} />
                </View>
                <TextInput
                  style={styles.inputField}
                  placeholder="Senha"
                  placeholderTextColor="rgba(255, 255, 255, 0.8)"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  accessibilityLabel="Campo de Senha"
                />
              </View>
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

              {/* Botão */}
              <TouchableOpacity
                style={styles.button}
                onPress={handleLogin}
                disabled={loading}
                accessibilityRole="button"
                accessibilityLabel={loading ? 'Carregando' : 'Entrar na sua conta'}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>LOGIN</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <View style={styles.tabContainerBottom}>
          <Text style={styles.activeTabTextBottom}>Entrar</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.inactiveTabTextBottom}>Cadastrar</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

// --- ESTILOS ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  container: { flex: 1, alignItems: 'center' },
  scrollContainer: { flexGrow: 1, width: width, alignItems: 'center', justifyContent: 'flex-start', paddingVertical: height * 0.05 },
  contentWrapper: { width: '100%', alignItems: 'center', marginTop: height * 0.15 },
  headerContainer: { width: '85%', alignItems: 'flex-start', paddingHorizontal: 5, marginBottom: height * 0.08 },
  greetingText: { fontFamily: 'Bree-Serif', fontSize: width * 0.09, color: '#31356e', fontWeight: 'bold', textAlign: 'left', marginBottom: 2 },
  instructionText: { fontFamily: 'Bree-Serif', fontSize: width * 0.05, color: '#31356e', textAlign: 'left', fontWeight: '500' },
  formArea: { width: '85%', paddingHorizontal: width * 0.05, paddingVertical: height * 0.04, borderRadius: 25, alignItems: 'center', elevation: 10 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(132, 169, 218, 0.7)', borderRadius: 15, marginBottom: height * 0.02, width: '100%', paddingHorizontal: 5, height: height * 0.065 },
  iconBackground: { backgroundColor: '#5691de', borderRadius: 15, padding: width * 0.02, marginRight: 10, marginLeft: -5, height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' },
  inputIcon: { width: '100%', height: '100%', resizeMode: 'contain', tintColor: '#fff' },
  inputField: { flex: 1, color: '#fff', fontSize: width * 0.045, paddingRight: 10 },
  errorText: { color: '#d9534f', alignSelf: 'flex-start', marginBottom: height * 0.01, marginLeft: 10, fontSize: width * 0.035, fontWeight: '500' },
  button: { backgroundColor: '#0c4793', borderRadius: 15, paddingVertical: height * 0.018, width: '100%', alignItems: 'center', marginTop: height * 0.04, elevation: 5 },
  buttonText: { fontFamily: 'Bree-Serif', color: '#fff', fontSize: width * 0.05, fontWeight: 'bold' },
  tabContainerBottom: { flexDirection: 'row', width: '60%', justifyContent: 'space-around', marginBottom: height * 0.05, paddingTop: 10, position: 'absolute', bottom: 0 },
  activeTabTextBottom: { color: '#0c4793', fontWeight: 'bold', fontSize: width * 0.05, fontFamily: 'Bree-Serif' },
  inactiveTabTextBottom: { color: '#64a1e6', fontWeight: 'bold', fontSize: width * 0.05, fontFamily: 'Bree-Serif' },
});

export default LoginScreen;
