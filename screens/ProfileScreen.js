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
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';

// Adicione o seu IP aqui, o mesmo do arquivo server.js
const API_URL = 'http://172.29.48.1:3000'; // Substitua pelo seu IP

const ProfileScreen = ({ navigation, route }) => {
  const { userId } = route.params;

  // Estados do usuário
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);

  // Função para buscar os dados do perfil do servidor
  const fetchProfileData = async () => {
    try {
      setLoading(true);
      // MUDANÇA CRÍTICA: Rota correta para buscar dados do usuário
      const response = await fetch(`${API_URL}/user/${userId}`);
      if (!response.ok) {
        throw new Error('Falha ao carregar os dados do perfil.');
      }
      const data = await response.json();

      // MUDANÇA CRÍTICA: Mapeamento dos campos do servidor para o estado local
      setUserName(data.username);
      setUserEmail(data.email);
      setUserPhone(data.emergency_phone || ''); // Use o campo correto e trate valores nulos
      setProfilePicture(require('../assets/src/user.png')); // A sua API não tem a rota para imagem, então mantemos a imagem padrão.

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

  // Função para salvar alterações do perfil NO BANCO DE DADOS
  const handleSaveProfile = async () => {
    if (userEmail.trim() === '' || userName.trim() === '') {
      Alert.alert('Atenção', 'Nome e e-mail não podem ficar vazios.');
      return;
    }

    // MUDANÇA CRÍTICA: Mapeamento correto dos campos para enviar ao servidor
    const updatedProfile = {
      username: userName,
      email: userEmail,
      password_hash: userPassword, // Use o nome de campo correto
      emergency_phone: userPhone,
    };

    // Remove a senha do objeto se ela estiver vazia para não sobrescrever
    if (userPassword === '') {
      delete updatedProfile.password_hash;
    }

    try {
      // MUDANÇA CRÍTICA: Rota correta para atualizar os dados do usuário
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
      // Atualiza os dados na tela após salvar
      fetchProfileData();
      setUserPassword(''); // Limpa o campo de senha após o sucesso
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      Alert.alert('Erro', 'Não foi possível salvar as alterações. Tente novamente.');
    }
  };

  // A função handleEditPhoto não precisa ser alterada, pois o problema não está nela.
  const handleEditPhoto = async () => {
    // ... código existente ...
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Desculpe, precisamos de permissão para acessar sua galeria.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePicture({ uri: result.assets[0].uri });
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

  // O componente de renderização não precisa de alterações visuais
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
            <Image source={require('../assets/src/seta.png')} style={styles.backArrow} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>PERFIL</Text>

          <View style={styles.logoContainer}>
            <Image source={require('../assets/src/logoimg.png')} style={styles.logo} />
          </View>
        </View>

        <View style={styles.profileContent}>
          <View style={styles.profilePictureContainer}>
            <Image source={profilePicture} style={styles.profilePicture} />
            <TouchableOpacity style={styles.editIcon} onPress={handleEditPhoto}>
              <Ionicons name="create-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

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
  // ... estilos existentes ...
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
    paddingBottom: 50,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: 20,
    paddingHorizontal: 30,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    tintColor: '#fff',
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    flex: 1,
    fontFamily: 'Bree-Serif',
  },
  logoContainer: {
    width: 50,
    height: 50,
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
    padding: 25,
    alignItems: 'center',
  },
  profilePictureContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: '#226dce',
    backgroundColor: '#226dce',
    marginBottom: 5,
  },
  editIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#3498db',
    borderRadius: 15,
    padding: 5,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 12,
    color: '#4c5e87',
    marginBottom: 5,
    fontFamily: 'Bree-Serif',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#b6bbce',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    fontFamily: 'Bree-Serif',
  },
  saveButton: {
    backgroundColor: '#8ca9d2',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Bree-Serif',
  },
});

export default ProfileScreen;