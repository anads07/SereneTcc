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

const userIcon = require('../assets/src/user.png');
const senhaIcon = require('../assets/src/senha.png');

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email é obrigatório';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email inválido';
    if (!password) newErrors.password = 'Senha é obrigatória';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    if (!validateForm()) return;
    
    setLoading(true);
    // Simulando chamada à API
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('Menu');
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#fff', '#a4c4ff']}
        style={styles.background}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          style={styles.scrollView}
        >
          <View style={styles.container}>
            <View style={styles.content}>
              <Text style={styles.welcomeText}>Bem-vindo!</Text>
              <Text style={styles.subtitle}>Faça seu login para continuar.</Text>
            </View>

            <View style={styles.formBox}>
              <View style={styles.tabContainer}>
                <TouchableOpacity style={[styles.tabButton, styles.activeTab]}>
                  <Text style={styles.tabText}>ENTRAR</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.tabButton, styles.inactiveTab]}
                  onPress={() => navigation.navigate('Register')}
                >
                  <Text style={styles.tabText}>CADASTRAR</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <Image source={userIcon} style={styles.inputIcon} 
                  accessibilityLabel="Ícone de usuário"
                  accessibilityHint="Campo para inserir email ou nome de usuário"/>
                <TextInput
                  style={[styles.inputField, errors.email && styles.errorInput]}
                  placeholder="Email"
                  placeholderTextColor="#FFFFFF"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  accessibilityLabel="Campo de email"
                  accessibilityHint="Digite seu email para login"
                />
              </View>
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

              <View style={styles.inputContainer}>
                <Image source={senhaIcon} style={styles.inputIcon} 
                  accessibilityLabel="Ícone de senha"
                  accessibilityHint="Campo para inserir senha"/>
                <TextInput
                  style={[styles.inputField, errors.password && styles.errorInput]}
                  placeholder="Senha"
                  placeholderTextColor="#FFFFFF"
                  secureTextEntry={true}
                  value={password}
                  onChangeText={setPassword}
                  accessibilityLabel="Campo de senha"
                  accessibilityHint="Digite sua senha para login"
                />
              </View>
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

              <View style={styles.optionsContainer}>
                <TouchableOpacity 
                  onPress={() => Alert.alert('Recuperar senha', 'Funcionalidade em desenvolvimento')}
                  accessibilityLabel="Esqueci minha senha"
                  accessibilityHint="Clique para recuperar sua senha"
                >
                  <Text style={styles.optionText}>Esqueci minha senha</Text>
                </TouchableOpacity>
              </View>

              {loading ? (
                <ActivityIndicator size="large" color="#0c4793" />
              ) : (
                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={handleLogin}
                  accessibilityLabel="Botão de login"
                  accessibilityHint="Clique para fazer login na aplicação"
                  accessibilityRole="button"
                >
                  <Text style={styles.buttonText}>LOGIN</Text>
                </TouchableOpacity>
              )}
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
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  background: {
    flex: 1,
  },
  container: {
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
  },
  content: {
    alignSelf: 'flex-start',
    marginBottom: 20,
    marginLeft: 10,
  },
  welcomeText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#0c4793',
    fontFamily: 'Bree-Serif',
  },
  subtitle: {
    fontFamily: 'Bree-Serif',
    fontSize: 18,
    color: '#333',
    marginTop: 5,
  },
  formBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: '100%',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8,
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
    fontFamily: 'Bree-Serif',
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
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  optionText: {
    color: '#0c4793',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#0c4793',
    paddingVertical: 15,
    borderRadius: 15,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#0c4793',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    fontFamily: 'Bree-Serif',
  },
  errorInput: {
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    alignSelf: 'flex-start',
    marginLeft: 15,
    marginBottom: 10,
  },
});

export default LoginScreen;