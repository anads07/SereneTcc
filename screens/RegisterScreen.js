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
import { useFonts } from 'expo-font'; // Importado para usar a fonte

const { width, height } = Dimensions.get('window');

// Ícones
const userIcon = require('../assets/src/user.png');     
const emailIcon = require('../assets/src/email.png');   
const senhaIcon = require('../assets/src/senha.png');   

const RegisterScreen = ({ navigation }) => {
  // Carregamento da fonte
  const [fontsLoaded] = useFonts({
    'Bree-Serif': require('../assets/fonts/BreeSerif-Regular.ttf'),
  });

  // Lógica e Estado (INALETRADOS, conforme sua instrução)
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const API_URL = 'http://172.24.240.1:3000'; 

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
  
  // Loading da Fonte
  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0c4793" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#fefeff', '#a4c4ff']} 
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          
          <View style={styles.contentWrapper}>
            {/* Topo com Texto de Boas-Vindas - ALINHAMENTO/JUSTIFICADO À ESQUERDA */}
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
                  // Corrigido placeholder para melhor contraste
                  placeholderTextColor="rgba(255, 255, 255, 0.8)" 
                  autoCapitalize="words"
                  value={username}
                  onChangeText={setUsername}
                  accessibilityLabel="Campo Nome de Usuário"
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
                  placeholderTextColor="rgba(255, 255, 255, 0.8)" 
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  accessibilityLabel="Campo de Email"
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
                  placeholderTextColor="rgba(255, 255, 255, 0.8)" 
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  accessibilityLabel="Campo de Senha"
                />
              </View>
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

              {/* Botão de Cadastro */}
              <TouchableOpacity
                style={styles.button}
                onPress={handleRegister}
                disabled={loading}
                accessibilityRole="button"
                accessibilityLabel={loading ? "Carregando" : "Criar sua conta"}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>CADASTRAR</Text>
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
  // *** CENTRALIZAÇÃO VERTICAL ***
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
  
  // --- HEADER (ALINHAMENTO À ESQUERDA e TIPOGRAFIA) ---
  headerContainer: {
    width: '85%', 
    alignItems: 'flex-start', // **JUSTIFICADO NO CANTO ESQUERDO**
    paddingHorizontal: 5, 
    marginBottom: height * 0.03, // Espaço entre o cabeçalho e o formulário
  },
  greetingText: { 
    fontFamily: 'Bree-Serif', // Fonte aplicada
    fontSize: width * 0.09, 
    color: '#31356e', 
    fontWeight: 'bold', 
    textAlign: 'left',
    marginBottom: 2, 
  },
  instructionText: { 
    fontFamily: 'Bree-Serif', // Fonte aplicada
    fontSize: width * 0.05, 
    color: '#31356e', 
    textAlign: 'left',
    fontWeight: '500', 
  },
  
  // --- FORMULÁRIO (A Caixa) ---
  formArea: {
    width: '85%', 
    paddingHorizontal: width * 0.05, // Responsividade
    paddingVertical: height * 0.04, // Responsividade
    backgroundColor: 'rgba(255, 255, 255, 0.42)',  
    borderRadius: 25, 
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#64a1e6', 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  
  // Abas de Navegação (MANTIDAS)
  tabContainer: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: height * 0.04, // Responsividade
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
    fontSize: width * 0.045, 
  },
  inactiveTabText: {
    color: '#64a1e6', 
    fontWeight: 'bold',
    fontSize: width * 0.045, 
  },
  
  // Conteúdo do Formulário (inputs e botão)
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(132, 169, 218, 0.7)', // Melhor contraste
    borderRadius: 15, 
    marginBottom: height * 0.02, // Responsividade
    width: '100%',
    paddingHorizontal: 5, 
    height: height * 0.065, // Responsividade
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
    marginBottom: height * 0.01, // Responsividade
    marginLeft: 10,
    fontSize: width * 0.035,
    fontWeight: '500',
  },
  
  // --- BOTÃO ---
  button: {
    backgroundColor: '#0c4793', 
    borderRadius: 15,
    paddingVertical: height * 0.018, // Responsividade
    width: '100%',
    alignItems: 'center',
    marginTop: height * 0.03, // Responsividade
    marginBottom: height * 0.02,
    elevation: 5,
    shadowColor: '#64a1e6', 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 5,
  },
  buttonText: {
    fontFamily: 'Bree-Serif', // Fonte aplicada
    color: '#fff',
    fontSize: width * 0.05,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;