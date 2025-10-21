import React, { useState } from 'react';
import {View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, Alert, ActivityIndicator, SafeAreaView, Dimensions,} from 'react-native';
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
  const API_URL = 'http://172.27.160.1:3000';

  // valida os campos de email e senha
  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email é obrigatório';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email inválido';
    if (!password) newErrors.password = 'Senha é obrigatória';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // realiza o login chamando a API
  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Sucesso', data.message || 'Login realizado com sucesso!');
        navigation.navigate('Menu', { userId: data.userId, username: data.username });
      } else if (response.status === 401) {
        Alert.alert('Erro no Login', 'Email ou senha incorretos. Tente novamente.');
      } else {
        Alert.alert('Erro no Login', data.message || 'Erro desconhecido ao tentar logar.');
      }
    } catch (error) {
      console.error('Erro ao conectar ao servidor:', error);
      Alert.alert('Erro de Conexão', 'Não foi possível conectar ao servidor. Verifique sua rede e o IP.');
    } finally {
      setLoading(false);
    }
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
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <View style={styles.contentWrapper}>

            <View style={styles.headerContainer}>
              <Text style={styles.greetingText}>Bem vindo!</Text>
              <Text style={styles.instructionText}>Faça seu login para continuar</Text>
            </View>

            <View style={styles.formArea}>

              <View style={styles.tabContainer}>
                <View style={styles.activeTabButton}>
                  <Text style={styles.activeTabText}>ENTRAR</Text>
                </View>

                <TouchableOpacity
                  style={styles.inactiveTabButton}
                  onPress={() => navigation.navigate('Register')}
                >
                  <Text style={styles.inactiveTabText}>CADASTRAR</Text>
                </TouchableOpacity>
              </View>

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

              <TouchableOpacity
                style={styles.button}
                onPress={handleLogin}
                disabled={loading}
                accessibilityRole="button"
                accessibilityLabel={loading ? "Carregando" : "Entrar na sua conta"}
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
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  // centralização do conteúdo
  scrollContainer: {
    flexGrow: 1,
    width: width, 
    alignItems: 'center',
    justifyContent: 'center', 
    paddingVertical: height * 0.05, 
  },
  contentWrapper: {
    width: '100%', 
    alignItems: 'center',
  },
  
  headerContainer: {
    width: '85%',
    alignItems: 'flex-start',
    paddingHorizontal: 5, 
    marginBottom: height * 0.03,
  },
  greetingText: {
    fontFamily: 'Bree-Serif', 
    fontSize: width * 0.09, 
    color: '#31356e', 
    fontWeight: 'bold', 
    textAlign: 'left',
    marginBottom: 2,
  },
  instructionText: {
    fontFamily: 'Bree-Serif', 
    fontSize: width * 0.05, 
    color: '#31356e', 
    textAlign: 'left',
    fontWeight: '500', 
  },
  
  // área do formulário
  formArea: {
    width: '85%', 
    paddingHorizontal: width * 0.05, 
    paddingVertical: height * 0.04, 
    backgroundColor: 'rgba(255, 255, 255, 0.)', 
    borderRadius: 25, 
    alignItems: 'center',
    elevation: 10,
    // shadowColor: '#64a1e6', 
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.3,
    // shadowRadius: 5,
  },
  
  tabContainer: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: height * 0.04, 
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  activeTabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 3,
    borderBottomColor: '#0c4793',
  },
  inactiveTabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  activeTabText: {
    color: '#fffff', 
    fontWeight: 'bold',
    fontSize: width * 0.045, 
  },
  inactiveTabText: {
    color: '#64a1e6', 
    fontWeight: 'bold',
    fontSize: width * 0.045, 
  },
  
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(132, 169, 218, 0.7)', 
    borderRadius: 15, 
    marginBottom: height * 0.02, 
    width: '100%',
    paddingHorizontal: 5, 
    height: height * 0.065, 
  },
  iconBackground: { 
    backgroundColor: '#5691de', 
    borderRadius: 15, 
    padding: width * 0.02, 
    marginRight: 10, 
    marginLeft: -5, 
    height: '100%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputIcon: {
    width: '100%', 
    height: '100%',
    resizeMode: 'contain',
    tintColor: '#fff', 
  },
  inputField: {
    flex: 1,
    color: '#fff', 
    fontSize: width * 0.045,
    paddingRight: 10,
  },
  errorText: {
    color: '#d9534f', 
    alignSelf: 'flex-start',
    marginBottom: height * 0.01,
    marginLeft: 10,
    fontSize: width * 0.035,
    fontWeight: '500',
  },
  
  button: {
    backgroundColor: '#0c4793', 
    borderRadius: 15,
    paddingVertical: height * 0.018, 
    width: '100%',
    alignItems: 'center',
    marginTop: height * 0.03, 
    marginBottom: height * 0.02,
    elevation: 5,
    shadowColor: '#64a1e6', 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 5,
  },
  buttonText: {
    fontFamily: 'Bree-Serif', 
    color: '#fff',
    fontSize: width * 0.05,
    fontWeight: 'bold',
  },
});

export default LoginScreen;