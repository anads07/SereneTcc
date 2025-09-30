import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Dimensions, // Importado para responsividade
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Obtém a altura da tela para responsividade
const { height } = Dimensions.get('window');

// Adicione o seu IP aqui, o mesmo do arquivo server.js
const API_URL = 'http://172.19.96.1:3000'; // Substitua pelo seu IP

const ProfileScreen = ({ navigation, route }) => {
  const { userId } = route.params;

  // Estados do usuário
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userPhone, setUserPhone] = useState('');
  // REMOVIDO: o estado userEmoji

  // Função para buscar os dados do perfil do servidor
  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/user/${userId}`);
      if (!response.ok) {
        throw new Error('Falha ao carregar os dados do perfil.');
      }
      const data = await response.json();

      setUserName(data.username);
      setUserEmail(data.email);
      setUserPhone(data.emergency_phone || ''); 

    } catch (error) {
      console.error('Erro ao buscar dados do perfil:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados do perfil.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [userId]);

  // REMOVIDO: a função handleEditEmoji

  // Função para salvar alterações do perfil NO BANCO DE DADOS
  const handleSaveProfile = async () => {
    if (userEmail.trim() === '' || userName.trim() === '') {
      Alert.alert('Atenção', 'Nome e e-mail não podem ficar vazios.');
      return;
    }

    const updatedProfile = {
      username: userName,
      email: userEmail,
      password_hash: userPassword, 
      emergency_phone: userPhone,
    };

    if (userPassword === '') {
      delete updatedProfile.password_hash;
    }

    try {
      const response = await fetch(`${API_URL}/user/update/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProfile),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao salvar as alterações.');
      }

      Alert.alert('Sucesso!', 'Perfil atualizado com sucesso!');
      fetchProfileData();
      setUserPassword(''); 
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      Alert.alert('Erro', 'Não foi possível salvar as alterações. Tente novamente.');
    }
  };


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0c4793" />
        <Text style={styles.loadingText}>Carregando perfil...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.gradientBackground}>
        <LinearGradient
          colors={['#8ca9d2', '#e0f7fa']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            {/* Certifique-se de que o caminho 'seta.png' está correto */}
            <Image source={require('../assets/src/seta.png')} style={styles.backArrow} /> 
          </TouchableOpacity>

          <Text style={styles.headerTitle}>PERFIL</Text>

          <View style={styles.logoContainer}>
            {/* Certifique-se de que o caminho 'logoimg.png' está correto */}
            <Image source={require('../assets/src/logoimg.png')} style={styles.logo} />
          </View>
        </View>

        <View style={styles.profileContent}>
          
          {/* NOVO: Nome do Usuário em Destaque */}
          <Text style={styles.userNameDisplay}>{userName || 'Usuário Serene'}</Text>
          
          {/* Campos de Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>NOME:</Text>
            <TextInput
              style={styles.input}
              value={userName}
              onChangeText={setUserName}
              placeholder="Nome"
              placeholderTextColor="#888"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>ALTERAR EMAIL:</Text>
            <TextInput
              style={styles.input}
              value={userEmail}
              onChangeText={setUserEmail}
              placeholder="E-mail"
              placeholderTextColor="#888"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>ALTERAR SENHA:</Text>
            <TextInput
              style={styles.input}
              value={userPassword}
              onChangeText={setUserPassword}
              placeholder="Senha"
              placeholderTextColor="#888"
              secureTextEntry
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>TELEFONE DE EMERGÊNCIA:</Text>
            <TextInput
              style={styles.input}
              value={userPhone}
              onChangeText={setUserPhone}
              placeholder="Telefone de Emergência"
              placeholderTextColor="#888"
              keyboardType="phone-pad"
            />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
            <Text style={styles.saveButtonText}>Salvar Alterações</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#0c4793',
  },
  gradientBackground: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: height * 0.05, 
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: height * 0.02, 
    paddingHorizontal: 30,
    paddingBottom: height * 0.02, 
  },
  backButton: {
    width: height * 0.05, 
    height: height * 0.05, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    tintColor: '#fff',
  },
  headerTitle: {
    fontSize: height * 0.035, 
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    flex: 1,
    fontFamily: 'Bree-Serif',
  },
  logoContainer: {
    width: height * 0.05,
    height: height * 0.05,
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  profileContent: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 20,
    padding: height * 0.03, 
    alignItems: 'center',
  },
  // NOVO ESTILO: Nome em Destaque
  userNameDisplay: {
    fontSize: height * 0.035, // Tamanho grande para o nome
    fontWeight: 'bold',
    color: '#4c5e87',
    marginBottom: height * 0.02, // Espaço antes do primeiro input
    textAlign: 'center',
    fontFamily: 'Bree-Serif',
    textTransform: 'capitalize', // Deixa a primeira letra maiúscula
  },
  // REMOVIDOS estilos profilePictureContainer, profileEmoji, editIcon

  inputContainer: {
    width: '100%',
    marginBottom: height * 0.015, 
  },
  inputLabel: {
    fontSize: height * 0.018, 
    color: '#4c5e87',
    marginBottom: 5,
    fontFamily: 'Bree-Serif',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#b6bbce',
    padding: height * 0.02, 
    borderRadius: 10,
    fontSize: height * 0.022, 
    color: '#333',
    textAlign: 'center',
    fontFamily: 'Bree-Serif',
  },
  saveButton: {
    backgroundColor: '#8ca9d2',
    padding: height * 0.02, 
    borderRadius: 10,
    marginTop: height * 0.025, 
    width: '100%',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: height * 0.025, 
    fontWeight: 'bold',
    fontFamily: 'Bree-Serif',
  },
});

export default ProfileScreen;