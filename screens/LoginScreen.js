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

const { width, height } = Dimensions.get('window');

const emailIcon = require('../assets/src/user.png'); 
const senhaIcon = require('../assets/src/senha.png'); 

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  // ⚠️ Confirme que este IP é o mesmo do seu server.js
  const API_URL = 'http://172.19.96.1:3000'; 

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
    setErrors({}); // Limpa erros anteriores antes de tentar o login

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // 🎯 Lógica aprimorada: Envia o email sem espaços (trim)
        body: JSON.stringify({ email: email.trim(), password }),
      });
      
      const data = await response.json();

      if (response.ok) {
        // Status 200: Sucesso
        Alert.alert('Sucesso', data.message || 'Login realizado com sucesso!');
        // CRÍTICO: Passando userId e username (se o backend retornar) para uso futuro.
        navigation.navigate('Menu', { userId: data.userId, username: data.username }); 
      } else if (response.status === 401) {
        // Status 401: Não Autorizado (Ocorre se a senha ou email estiverem incorretos)
        Alert.alert('Erro no Login', 'Email ou senha incorretos. Tente novamente.');
      } else {
        // Status 400, 500, etc.
        Alert.alert('Erro no Login', data.message || 'Erro desconhecido ao tentar logar.');
      }
    } catch (error) {
      console.error('Erro ao conectar ao servidor:', error);
      Alert.alert('Erro de Conexão', 'Não foi possível conectar ao servidor. Verifique sua rede e o IP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#fefeff', '#a4c4ff']} 
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          
          {/* Topo com Texto de Boas-Vindas em duas linhas e maior */}
          <View style={styles.headerContainer}>
            <Text style={styles.greetingText}>Bem vindo!</Text>
            <Text style={styles.instructionText}>Faça seu login para continuar</Text>
          </View>

          {/* Área de formulário (A Caixa) */}
          <View style={styles.formArea}>
            
            {/* Abas de Navegação */}
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

            {/* Input de Email */}
            <View style={styles.inputContainer}>
              <View style={styles.iconBackground}>
                <Image source={emailIcon} style={styles.inputIcon} />
              </View>
              <TextInput
                style={styles.inputField}
                placeholder="Email"
                placeholderTextColor="#fff" 
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

            {/* Input de Senha */}
            <View style={styles.inputContainer}>
              <View style={styles.iconBackground}>
                <Image source={senhaIcon} style={styles.inputIcon} />
              </View>
              <TextInput
                style={styles.inputField}
                placeholder="Senha"
                placeholderTextColor="#fff" 
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

            {/* Botão de Login */}
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
  container: {
    flex: 1,
    alignItems: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    width: width, 
    alignItems: 'center',
    justifyContent: 'center', 
    paddingVertical: height * 0.05, 
  },
  // --- HEADER (AJUSTADO) ---
  headerContainer: {
    width: '100%',
    height: height * 0.15, // Aumentado para dar espaço ao texto maior
    alignItems: 'center',
    justifyContent: 'flex-start', // Alinha no topo
    marginBottom: 20, // Reduzido para subir um pouco
    paddingTop: 10, // Pequeno padding no topo
  },
  greetingText: { // TEXTO PRINCIPAL (BEM VINDO)
    fontSize: width * 0.09, 
    color: '#31356e', 
    fontWeight: 'bold', 
    textAlign: 'center',
    marginBottom: 5,
  },
  instructionText: { // TEXTO SECUNDÁRIO (INSTRUÇÃO)
    fontSize: width * 0.05, 
    color: '#31356e', 
    textAlign: 'center',
    paddingHorizontal: 20,
    fontWeight: '500', 
  },
  // --- FORMULÁRIO (A Caixa) ---
  formArea: {
    width: '85%', 
    paddingHorizontal: 20,
    paddingVertical: 30, 
    backgroundColor: 'rgba(255, 255, 255, 0.65)', 
    borderRadius: 25, 
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#64a1e6', 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  // Abas de Navegação
  tabContainer: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 30, 
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
    color: '#0c4793', 
    fontWeight: 'bold',
    fontSize: width * 0.05, 
  },
  inactiveTabText: {
    color: '#64a1e6', 
    fontWeight: 'bold',
    fontSize: width * 0.05, 
  },
  // Conteúdo do Formulário (inputs e botão)
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(132, 169, 218, 0.53)', 
    borderRadius: 15, 
    marginBottom: 10, 
    width: '100%',
    paddingHorizontal: 5, 
    height: 50, 
  },
  iconBackground: { 
    backgroundColor: '#5691de', 
    borderRadius: 10, 
    padding: 8, 
    marginRight: 10, 
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputIcon: {
    width: 20, 
    height: 20,
    resizeMode: 'contain',
    tintColor: '#fff', 
  },
  inputField: {
    flex: 1,
    paddingVertical: 12, 
    color: '#fff', 
    fontSize: width * 0.045,
    paddingRight: 10,
  },
  errorText: {
    color: 'red',
    alignSelf: 'flex-start',
    marginBottom: 10,
    marginLeft: 10,
    fontSize: width * 0.035,
  },
  // --- BOTÃO ---
  button: {
    backgroundColor: '#0c4793', 
    borderRadius: 15,
    paddingVertical: 12, 
    width: '100%',
    alignItems: 'center',
    marginTop: 25, 
    marginBottom: 15,
    elevation: 5,
    shadowColor: '#64a1e6', 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: width * 0.05,
    fontWeight: 'bold',
  },
});

export default LoginScreen;