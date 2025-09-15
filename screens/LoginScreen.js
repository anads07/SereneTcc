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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Ícones utilizados na tela
const emailIcon = require('../assets/src/email.png');
const senhaIcon = require('../assets/src/senha.png');

const LoginScreen = ({ navigation }) => {
  // Estados do formulário e loading
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // URL do seu servidor backend - SUBSTITUA '[SEU_IP_AQUI]' PELO SEU IP LOCAL
  const API_URL = 'http://[SEU_IP_AQUI]:3000';

  // Validação simples do formulário
  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email é obrigatório';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email inválido';
    if (!password) newErrors.password = 'Senha é obrigatória';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Sucesso!', data.message);
        navigation.navigate('Menu');
      } else {
        Alert.alert('Erro de Login', data.message || 'Erro ao tentar fazer login. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro:', error);
      Alert.alert('Erro de Conexão', 'Não foi possível conectar ao servidor. Verifique se o servidor está rodando e se o IP está correto.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {/* Fundo com gradiente */}
        <LinearGradient
          colors={['#afcdf2', '#fff']}
          style={StyleSheet.absoluteFill}
        />

        {/* Conteúdo da tela de login */}
        <View style={styles.container}>
          <Image
            source={require('../assets/src/logo.png')}
            style={styles.logo}
          />
          <Text style={styles.title}>Login</Text>

          <View style={styles.tabContainer}>
            <TouchableOpacity style={[styles.tabButton, styles.activeTab]}>
              <Text style={styles.tabText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabButton, styles.inactiveTab]}
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={styles.tabText}>Registro</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Image source={emailIcon} style={styles.inputIcon} />
            <TextInput
              style={styles.inputField}
              placeholder="Email"
              placeholderTextColor="#f0f0f0"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          <View style={styles.inputContainer}>
            <Image source={senhaIcon} style={styles.inputIcon} />
            <TextInput
              style={styles.inputField}
              placeholder="Senha"
              placeholderTextColor="#f0f0f0"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Entrar</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logo: {
    width: 150,
    height: 50,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Bree-Serif',
    fontWeight: 'bold',
    color: '#0c4793',
    marginBottom: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#0c4793',
  },
  inactiveTab: {
    opacity: 0.5,
  },
  tabText: {
    color: '#0c4793',
    fontWeight: 'bold',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#84a9da',
    borderRadius: 15,
    marginBottom: 8,
    width: '100%',
    padding: 5,
  },
  inputIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginRight: 10,
    marginLeft: 5,
  },
  inputField: {
    flex: 1,
    paddingVertical: 12,
    paddingRight: 15,
    color: 'white',
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#0c4793',
    paddingVertical: 15,
    borderRadius: 15,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#0c4793',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    alignSelf: 'flex-start',
    marginLeft: 15,
    marginBottom: 5,
  },
});

export default LoginScreen;
