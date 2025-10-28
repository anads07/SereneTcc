import React, { useState } from 'react';
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
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const ProfileScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState('Ana Clara');
  const [userEmail, setUserEmail] = useState('email@exemplo.com');
  const [userPassword, setUserPassword] = useState('senha');
  const [userPhone, setUserPhone] = useState('(00) 11111-1111');
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveProfile = () => {
    if (userEmail.trim() === '' || userName.trim() === '') {
      Alert.alert('Atenção', 'Nome e e-mail não podem ficar vazios.');
      return;
    }
    Alert.alert('Sucesso!', 'Alterações salvas localmente.');
    setIsEditing(false);
  };

  const handleEditPress = () => {
    if (isEditing) {
      handleSaveProfile();
    } else {
      setIsEditing(true);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0e458c" />
        <Text style={styles.loadingText}>Carregando perfil...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#b9d2ff', '#d9e7ff', '#eaf3ff']}
        style={styles.background}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Image 
              source={require('../assets/src/seta.png')} 
              style={styles.backimage}
            />
          </TouchableOpacity>

          <Text style={styles.title}>SERENE</Text>

          <TouchableOpacity style={styles.profileButton}>
            <Image 
              source={require('../assets/src/perfil.png')} 
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* SAUDAÇÃO */}
          <View style={styles.greetingContainer}>
            <Text style={styles.greetingText}>OLÁ, {userName.toUpperCase()}</Text>
          </View>

          {/* FORMULÁRIO */}
          <View style={styles.formContainer}>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>EMAIL</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={userEmail}
                  onChangeText={setUserEmail}
                  placeholder="email@exemplo.com"
                  placeholderTextColor="rgba(255,255,255,0.7)"
                  keyboardType="email-address"
                />
              ) : (
                <View style={styles.valueContainer}>
                  <Text style={styles.valueText}>{userEmail}</Text>
                </View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>SENHA</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={userPassword}
                  onChangeText={setUserPassword}
                  placeholder="Sua senha"
                  placeholderTextColor="rgba(255,255,255,0.7)"
                  secureTextEntry
                />
              ) : (
                <View style={styles.valueContainer}>
                  <Text style={styles.valueText}>••••••••</Text>
                </View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>TELEFONE DE EMERGÊNCIA</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={userPhone}
                  onChangeText={setUserPhone}
                  placeholder="(00) 00000-0000"
                  placeholderTextColor="rgba(255,255,255,0.7)"
                  keyboardType="phone-pad"
                />
              ) : (
                <View style={styles.valueContainer}>
                  <Text style={styles.valueText}>{userPhone}</Text>
                </View>
              )}
            </View>

            {/* BOTÃO */}
            <TouchableOpacity 
              style={styles.editButton}
              onPress={handleEditPress}
            >
              <LinearGradient
                colors={['#0e458c', '#1a5bb5']}
                style={styles.editButtonGradient}
              >
                <Text style={styles.editButtonText}>
                  {isEditing ? 'SALVAR' : 'EDITAR'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* MENU INFERIOR FLUTUANTE */}
        <View style={styles.floatingMenuContainer}>
          <TouchableOpacity 
            style={styles.floatingMenuButton}
            onPress={() => navigation.navigate('ChatScreen')} 
          >
            <Image 
              source={require('../assets/src/robo.png')} 
              style={styles.floatingMenuIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.floatingMenuButton}
            onPress={() => navigation.navigate('DiarioScreen')} 
          >
            <Ionicons 
              name="add-outline" 
              size={screenWidth > 400 ? (screenWidth > 500 ? 36 : 32) : 28} 
              color="#0e458c" 
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#b9d2ff',
  },
  background: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: screenWidth > 400 ? 18 : 16,
    color: '#0e458c',
    fontFamily: 'Bree-Serif',
  },
  
  // HEADER - RESPONSIVO
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: screenWidth > 400 ? 15 : 10,
    paddingBottom: screenWidth > 400 ? 10 : 5,
    paddingHorizontal: screenWidth > 400 ? 25 : 20,
  },
  title: {
    fontSize: screenWidth > 400 ? (screenWidth > 500 ? 44 : 40) : 32,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Bree-Serif',
  },
  backButton: {
    padding: 5,
  },
  backimage: {
    width: screenWidth > 400 ? (screenWidth > 500 ? 60 : 55) : 45,
    height: screenWidth > 400 ? (screenWidth > 500 ? 60 : 55) : 45,
    resizeMode: 'contain',
    tintColor: 'white',
    transform: [{ scaleX: -1 }],
  },
  profileButton: {
    padding: 5,
  },
  profileImage: {
    width: screenWidth > 400 ? (screenWidth > 500 ? 60 : 55) : 45,
    height: screenWidth > 400 ? (screenWidth > 500 ? 60 : 55) : 45,
    resizeMode: 'contain',
    tintColor: 'white',
  },

  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: screenWidth > 400 ? 100 : 80,
    alignItems: 'center',
  },
  bottomSpacer: {
    height: 20,
  },

  // SAUDAÇÃO - RESPONSIVA
  greetingContainer: {
    alignItems: 'center',
    marginVertical: screenWidth > 400 ? 25 : 20,
    marginTop: screenWidth > 400 ? 30 : 25,
  },
  greetingText: {
    fontSize: screenWidth > 400 ? (screenWidth > 500 ? 28 : 26) : 22,
    color: '#0e458c',
    fontFamily: 'Bree-Serif',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // FORMULÁRIO - RESPONSIVO
  formContainer: {
    width: screenWidth > 400 ? '85%' : '90%',
    maxWidth: 450,
    alignItems: 'center',
  },
  inputGroup: {
    width: '100%',
    marginBottom: screenWidth > 400 ? 20 : 15,
  },
  label: {
    fontSize: screenWidth > 400 ? (screenWidth > 500 ? 18 : 17) : 15,
    color: '#0e458c',
    marginBottom: screenWidth > 400 ? 8 : 6,
    fontFamily: 'Bree-Serif',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  valueContainer: {
    backgroundColor: '#84a9da',
    paddingVertical: screenWidth > 400 ? 16 : 14,
    paddingHorizontal: screenWidth > 400 ? 20 : 16,
    borderRadius: screenWidth > 400 ? 14 : 12,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  valueText: {
    fontSize: screenWidth > 400 ? (screenWidth > 500 ? 18 : 17) : 15,
    color: 'white',
    fontFamily: 'Bree-Serif',
    fontWeight: 'bold',
  },
  input: {
    fontSize: screenWidth > 400 ? (screenWidth > 500 ? 18 : 17) : 15,
    color: 'white',
    fontFamily: 'Bree-Serif',
    fontWeight: 'bold',
    backgroundColor: '#84a9da',
    paddingVertical: screenWidth > 400 ? 16 : 14,
    paddingHorizontal: screenWidth > 400 ? 20 : 16,
    borderRadius: screenWidth > 400 ? 14 : 12,
    width: '100%',
    textAlign: 'center',
    borderWidth: screenWidth > 400 ? 3 : 2,
    borderColor: '#5691de',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },

  // BOTÃO - RESPONSIVO
  editButton: {
    borderRadius: screenWidth > 400 ? 28 : 25,
    overflow: 'hidden',
    marginTop: screenWidth > 400 ? 25 : 20,
    width: screenWidth > 400 ? '70%' : '75%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  editButtonGradient: {
    paddingVertical: screenWidth > 400 ? 16 : 14,
    borderRadius: screenWidth > 400 ? 28 : 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: screenWidth > 400 ? (screenWidth > 500 ? 20 : 18) : 16,
    fontFamily: 'Bree-Serif',
    fontWeight: 'bold',
  },

  // MENU INFERIOR FLUTUANTE - RESPONSIVO
  floatingMenuContainer: {
    position: 'absolute',
    bottom: screenWidth > 400 ? 25 : 20,
    left: screenWidth > 400 ? 25 : 20,
    right: screenWidth > 400 ? 25 : 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    zIndex: 1000,
  },
  floatingMenuButton: {
    width: screenWidth > 400 ? (screenWidth > 500 ? 70 : 65) : 55,
    height: screenWidth > 400 ? (screenWidth > 500 ? 70 : 65) : 55,
    borderRadius: screenWidth > 400 ? 35 : 28,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: screenWidth > 400 ? 5 : 4 },
    shadowOpacity: 0.25,
    shadowRadius: screenWidth > 400 ? 7 : 5,
    elevation: 8,
    borderWidth: screenWidth > 400 ? 4 : 3,
    borderColor: 'rgba(170, 199, 255, 0.8)',
  },
  floatingMenuIcon: {
    width: screenWidth > 400 ? (screenWidth > 500 ? 45 : 40) : 32,
    height: screenWidth > 400 ? (screenWidth > 500 ? 45 : 40) : 32,
    resizeMode: 'contain',
    tintColor: '#0e458c',
  },
});

export default ProfileScreen;