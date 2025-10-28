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
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const emailIcon = require('../assets/src/user.png');
const senhaIcon = require('../assets/src/senha.png');
const logo = require('../assets/src/perfil.png');

const LoginScreen = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    'Bree-Serif': require('../assets/fonts/BreeSerif-Regular.ttf'),
  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email é obrigatório';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email inválido';
    if (!password) newErrors.password = 'Senha é obrigatória';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    setTimeout(() => {
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
    }, 1200);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#84a9da" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={['#b9d2ff', '#d9e7ff', '#eaf3ff']} style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.contentWrapper}>
            
            {/* HEADER COM LOGO E SERENE - MAIS PRA CIMA */}
            <View style={styles.header}>
              <Image source={logo} style={styles.logo} />
              <Text style={styles.title}>SERENE</Text>
            </View>

            {/* FORM AREA - ELEMENTOS MAIS JUNTOS */}
            <View style={styles.formArea}>
              <View style={styles.headerContainer}>
                <Text style={styles.greetingText}>Bem vindo!</Text>
                <Text style={styles.instructionText}>Faça seu login para continuar</Text>
              </View>

              {/* Email */}
              <View style={styles.inputContainer}>
                <View style={styles.iconBackground}>
                  <Image source={emailIcon} style={styles.inputIcon} />
                </View>
                <TextInput
                  style={styles.inputField}
                  placeholder="Email"
                  placeholderTextColor="rgba(255, 255, 255, 0.9)"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  selectionColor="rgba(255, 255, 255, 0.6)"
                />
              </View>
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

              {/* Senha com ícone de olho */}
              <View style={styles.inputContainer}>
                <View style={styles.iconBackground}>
                  <Image source={senhaIcon} style={styles.inputIcon} />
                </View>
                <TextInput
                  style={styles.inputField}
                  placeholder="Senha"
                  placeholderTextColor="rgba(255, 255, 255, 0.9)"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  selectionColor="rgba(255, 255, 255, 0.6)"
                />
                <TouchableOpacity onPress={toggleShowPassword} style={styles.eyeIcon}>
                  <Ionicons 
                    name={showPassword ? "eye-off-outline" : "eye-outline"} 
                    size={22} 
                    color="rgba(255, 255, 255, 0.9)" 
                  />
                </TouchableOpacity>
              </View>
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

              {/* Botão */}
              <TouchableOpacity
                style={styles.button}
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>ENTRAR</Text>
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#b9d2ff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#b9d2ff',
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    width: screenWidth,
    alignItems: 'center',
    justifyContent: 'flex-start', // Mantém no topo
    paddingTop: screenHeight * 0.05, // Reduzido para subir mais
  },
  contentWrapper: {
    width: '100%',
    alignItems: 'center',
  },

  // HEADER COM LOGO - MAIS PRA CIMA
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: screenHeight * 0.02, // Reduzido
  },
  logo: {
    width: screenWidth > 400 ? (screenWidth > 500 ? 55 : 50) : 45,
    height: screenWidth > 400 ? (screenWidth > 500 ? 55 : 50) : 45,
    resizeMode: 'contain',
    tintColor: '#fff',
    marginRight: 15,
  },
  title: {
    fontSize: screenWidth > 400 ? (screenWidth > 500 ? 46 : 42) : 38,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'Bree-Serif',
  },

  // FORM AREA - ELEMENTOS MAIS JUNTOS
  formArea: {
    width: '85%',
    paddingHorizontal: screenWidth * 0.06,
    paddingVertical: screenHeight * 0.04, // Reduzido
    borderRadius: 25,
    alignItems: 'center',
    marginTop: screenHeight * 0.07, // Reduzido
  },
  headerContainer: {
    width: '100%',
    alignItems: 'flex-start',
    paddingHorizontal: 5,
    marginBottom: screenHeight * 0.03, // Reduzido
  },
  greetingText: {
    fontFamily: 'Bree-Serif',
    fontSize: screenWidth > 400 ? (screenWidth > 500 ? 38 : 36) : 32,
    color: '#0e458c',
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 2, // Reduzido para juntar mais
  },
  instructionText: {
    fontFamily: 'Bree-Serif',
    fontSize: screenWidth > 400 ? (screenWidth > 500 ? 20 : 19) : 18,
    color: '#5691de',
    textAlign: 'left',
    fontWeight: '500',
  },

  // INPUTS - MAIS JUNTOS
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(132, 169, 218, 0.7)',
    borderRadius: 16,
    marginBottom: screenHeight * 0.02, // Reduzido
    width: '100%',
    paddingHorizontal: 8,
    height: screenHeight * 0.065,
  },
  iconBackground: {
    backgroundColor: '#84a9da',
    borderRadius: 16,
    padding: screenWidth * 0.022,
    marginRight: 12,
    marginLeft: -8,
    height: '100%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputIcon: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
    tintColor: '#fff',
  },
  inputField: {
    flex: 1,
    color: '#fff',
    fontSize: screenWidth > 400 ? (screenWidth > 500 ? 18 : 17) : 16,
    paddingRight: -35,
    fontFamily: 'Bree-Serif',
    paddingVertical: 0,
    fontWeight: 'normal',
  },
  eyeIcon: {
    padding: 10,
    marginRight: 5,
  },
  errorText: {
    color: '#ff6b6b',
    alignSelf: 'flex-start',
    marginBottom: screenHeight * 0.01, // Reduzido
    marginLeft: 12,
    fontSize: screenWidth > 400 ? (screenWidth > 500 ? 15 : 14) : 13,
    fontWeight: '500',
    fontFamily: 'Bree-Serif',
  },

  // BUTTON - MAIS JUNTO
  button: {
    backgroundColor: '#84a9da',
    borderRadius: 16,
    paddingVertical: screenHeight * 0.02,
    width: '100%',
    alignItems: 'center',
    marginTop: screenHeight * 0.03, // Reduzido
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    fontFamily: 'Bree-Serif',
    color: '#fff',
    fontSize: screenWidth > 400 ? (screenWidth > 500 ? 20 : 19) : 18,
    fontWeight: 'bold',
  },

  // BOTTOM TABS
  tabContainerBottom: {
    flexDirection: 'row',
    width: '60%',
    justifyContent: 'space-around',
    marginBottom: screenHeight * 0.04,
    paddingTop: 15,
  },
  activeTabTextBottom: {
    color: '#84a9da',
    fontWeight: 'bold',
    fontSize: screenWidth > 400 ? (screenWidth > 500 ? 21 : 20) : 19,
    fontFamily: 'Bree-Serif',
  },
  inactiveTabTextBottom: {
    color: '#a7c7e7',
    fontWeight: 'bold',
   fontSize: screenWidth > 400 ? (screenWidth > 500 ? 21 : 20) : 19,
    fontFamily: 'Bree-Serif',
  },
});

export default LoginScreen;