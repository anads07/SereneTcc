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
  SafeAreaView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// ícones utilizados na tela
const userIcon = require('../assets/src/user.png');
const emailIcon = require('../assets/src/email.png');
const senhaIcon = require('../assets/src/senha.png');

const RegisterScreen = ({ navigation }) => {
  // estados do formulário e loading
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // URL do seu servidor backend - IP local do seu computador
  const API_URL = 'http://172.20.160.1:3000';

  // validação simples do formulário
  const validateForm = () => {
    const newErrors = {};
    if (!username) newErrors.username = 'Nome de usuário é obrigatório';
    if (!email) newErrors.email = 'Email é obrigatório';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email inválido';
    if (!password) newErrors.password = 'Senha é obrigatória';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Sucesso!', data.message);
        navigation.navigate('Login');
      } else {
        Alert.alert('Erro no Cadastro', data.message || 'Ocorreu um erro.');
      }
    } catch (error) {
      console.error('Erro de rede:', error);
      Alert.alert('Erro de Conexão', 'Não foi possível se conectar ao servidor. Verifique se o servidor está rodando e se o IP está correto.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={['#b8d1ff', '#fff']} style={styles.background}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <Text style={styles.title}>CADASTRE-SE</Text>
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tabButton, styles.inactiveTab]}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.tabText}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.tabButton, styles.activeTab]}>
                <Text style={styles.tabText}>Cadastro</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Image source={userIcon} style={styles.inputIcon} />
                <TextInput
                  style={styles.inputField}
                  placeholder="Nome de usuário"
                  value={username}
                  onChangeText={setUsername}
                />
              </View>
              {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}

              <View style={styles.inputContainer}>
                <Image source={emailIcon} style={styles.inputIcon} />
                <TextInput
                  style={styles.inputField}
                  placeholder="Email"
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
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

              <TouchableOpacity
                style={styles.button}
                onPress={handleRegister}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>CADASTRAR</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.linkText}>Já tem uma conta? Faça login aqui</Text>
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
  },
  background: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 30,
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
  formContainer: {
    width: '100%',
    alignItems: 'center',
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
    color: '#fff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#0c4793',
    paddingVertical: 15,
    borderRadius: 15,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkText: {
    color: '#0c4793',
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    alignSelf: 'flex-start',
    marginBottom: 5,
    marginLeft: 10,
  },
});

export default RegisterScreen;