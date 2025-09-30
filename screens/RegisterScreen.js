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
  Dimensions 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const userIcon = require('../assets/src/user.png');     
const emailIcon = require('../assets/src/email.png');   
const senhaIcon = require('../assets/src/senha.png');   


const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const API_URL = 'http://172.19.96.1:3000'; 

  // validação simples do formulário
  const validateForm = () => {
    const newErrors = {};
    if (!username) newErrors.username = 'Nome de usuário é obrigatório';
    if (!email) newErrors.email = 'Email é obrigatório';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email inválido';
    if (!password) newErrors.password = 'Senha é obrigatória';
    else if (password.length < 6) newErrors.password = 'A senha deve ter no mínimo 6 caracteres';
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Sucesso', 'Cadastro realizado com sucesso! Faça login.');
        navigation.navigate('Login');
      } else {
        Alert.alert('Erro no Cadastro', data.message || 'Erro ao tentar registrar. Tente outro email.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
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
            <Text style={styles.greetingText}>Seja bem vindo!</Text>
            <Text style={styles.instructionText}>Crie sua conta para continuar</Text>
          </View>

          {/* Área de formulário (A Caixa) */}
          <View style={styles.formArea}>
            
            {/* Abas de Navegação */}
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={styles.inactiveTabButton}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.inactiveTabText}>ENTRAR</Text>
              </TouchableOpacity>
              
              <View style={styles.activeTabButton}>
                <Text style={styles.activeTabText}>CADASTRAR</Text>
              </View>
            </View>

            {/* Input de Nome de Usuário */}
            <View style={styles.inputContainer}>
              <View style={styles.iconBackground}>
                <Image source={userIcon} style={styles.inputIcon} />
              </View>
              <TextInput
                style={styles.inputField}
                placeholder="Nome de Usuário"
                placeholderTextColor="#fff" 
                autoCapitalize="words"
                value={username}
                onChangeText={setUsername}
              />
            </View>
            {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}

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

            {/* Botão de Cadastro */}
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
  greetingText: { // TEXTO PRINCIPAL (SEJA BEM VINDO)
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

export default RegisterScreen;