import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, Image, TextInput, Alert, SafeAreaView, ScrollView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';

const ProfileScreen = ({ navigation }) => {
  const [userName, setUserName] = useState('NOME');
  const [userEmail, setUserEmail] = useState('EMAIL@SWXIND.COM');
  const [userPassword, setUserPassword] = useState('SWXIND');
  const [userPhone, setUserPhone] = useState('(DD) 1111111-1111');
  const [profilePicture, setProfilePicture] = useState(require('../assets/src/user.png'));

  const handleEditProfile = () => {
    Alert.alert('Sucesso!', 'Perfil editado com sucesso!');
  };

  const handleEditPhoto = async () => {
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#8ca9d2', '#e0f7fa']}
        style={styles.background}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Image source={require('../assets/src/seta.png')} style={styles.backArrow} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>PERFIL</Text>

          <View style={styles.logoContainer}>
            <Image source={require('../assets/src/logoimg.png')} style={styles.logo} />
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.profileContent}>
            <View style={styles.profilePictureContainer}>
              <Image source={profilePicture} style={styles.profilePicture} />
              <TouchableOpacity style={styles.editIcon} onPress={handleEditPhoto}>
                <Ionicons name="create-outline" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <Text style={styles.userName}>{userName}</Text>

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

            <TouchableOpacity style={styles.saveButton} onPress={handleEditProfile}>
              <Text style={styles.saveButtonText}>Salvar Alterações</Text>
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
  background: { 
    flex: 1 
  },
  scrollView: {
    flex: 1,
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
    alignItems: 'center' 
  },
  backArrow: { 
    width: 50, 
    height: 50, 
    resizeMode: 'contain',
    tintColor: '#fff'
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
    resizeMode: 'contain' 
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
    paddingBottom: 50,
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
    marginBottom: 20 
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: '#226dce',
    backgroundColor: '#226dce',
    marginBottom: 5
  },
  editIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#3498db',
    borderRadius: 15,
    padding: 5,
  },
  userName: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginBottom: 30, 
    color: '#000', 
    fontFamily: 'Bree-Serif',
    marginBottom: 5
  },
  inputContainer: { 
    width: '100%', 
    marginBottom: 10 
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
    fontFamily: 'Bree-Serif' 
  },
});

export default ProfileScreen;