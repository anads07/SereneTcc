import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  TextInput, 
  Alert, 
  ScrollView, 
  SafeAreaView, 
  Dimensions, 
  Platform, 
  KeyboardAvoidingView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const moods = [
   { name: 'Feliz', key: 'happy', icon: 'happy-outline', color: '#FFF3B0' },
  { name: 'Triste', key: 'sad', icon: 'sad-outline', color: '#A7C7E7' },
  { name: 'Estressado', key: 'stressed', icon: 'flash-outline', color: '#F4A6A6' },
  { name: 'Calmo', key: 'calm', icon: 'leaf-outline', color: '#B5EAD7' },
  { name: 'Ansioso', key: 'anxious', icon: 'alert-circle-outline', color: '#C8B6E2' },
  { name: 'Confuso', key: 'confused', icon: 'help-circle-outline', color: '#FFD6A5' },
];

const DiarioScreen = ({ navigation, route }) => {
  const [newEntryText, setNewEntryText] = useState('');
  const [newEntryImage, setNewEntryImage] = useState(null);
  const [selectedMood, setSelectedMood] = useState(null);
  const [validationError, setValidationError] = useState('');
  const [imageAddedMessage, setImageAddedMessage] = useState('');

  const initialEmotion = route.params?.initialEmotion;
  const emotionName = route.params?.emotionName;

  // Se veio da Home com uma emoção selecionada, definir automaticamente
  useEffect(() => {
    if (initialEmotion) {
      const mood = moods.find(m => m.key === initialEmotion);
      if (mood) {
        setSelectedMood(mood);
      }
    }
  }, [initialEmotion]);

  // selecionar imagem da galeria
  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos de acesso à sua galeria.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        setNewEntryImage(selectedImage.uri);
        setImageAddedMessage('Foto adicionada! Pronto para salvar.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível acessar a galeria.');
    }
  };

  // validar formulário antes de salvar
  const validateForm = () => {
    if (newEntryText.trim() === '') {
      setValidationError('Por favor, escreva algo sobre seu dia.');
      return false;
    }
    
    if (!selectedMood) {
      setValidationError('Por favor, selecione como você está se sentindo.');
      return false;
    }
    
    setValidationError('');
    return true;
  };

  // Atualizar estatísticas no Home
  const updateHomeStatistics = async (moodKey) => {
    try {
      const existingStats = await AsyncStorage.getItem('emotionStatistics');
      let stats = existingStats ? JSON.parse(existingStats) : {
        happy: 15.2,
        sad: 9.1,
        stressed: 6.1,
        calm: 30.3,
        anxious: 25.4,
        confused: 13.9
      };

      if (stats[moodKey]) {
        stats[moodKey] += 2;
        
        const otherMoods = Object.keys(stats).filter(key => key !== moodKey);
        const totalOther = otherMoods.reduce((sum, key) => sum + stats[key], 0);
        const adjustment = 2 / otherMoods.length;
        
        otherMoods.forEach(key => {
          stats[key] = (stats[key] / totalOther) * (100 - stats[moodKey]);
        });
      }

      await AsyncStorage.setItem('emotionStatistics', JSON.stringify(stats));
    } catch (error) {
      console.log('Erro ao atualizar estatísticas:', error);
    }
  };

  // salvar entrada no diário
  const handleSaveEntry = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const newEntry = {
        id: Date.now(),
        date: new Date().toLocaleDateString('pt-BR'),
        timestamp: new Date().toISOString(),
        text: newEntryText,
        mood: selectedMood,
        image: newEntryImage,
      };

      const existingEntries = await AsyncStorage.getItem('diaryEntries');
      const entries = existingEntries ? JSON.parse(existingEntries) : [];
      const updatedEntries = [newEntry, ...entries];
      
      await AsyncStorage.setItem('diaryEntries', JSON.stringify(updatedEntries));
      await updateHomeStatistics(selectedMood.key);

      Alert.alert('Sucesso!', 'Entrada salva com sucesso!');
      
      // Limpar formulário
      setNewEntryText('');
      setNewEntryImage(null);
      setSelectedMood(null);
      setImageAddedMessage('');
      setValidationError('');
      
      // Navegar para a tela de registros
      navigation.navigate('RegistrosScreen');
      
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a entrada.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={['#b9d2ff', '#d9e7ff', '#eaf3ff']} style={styles.background}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Image 
              source={require('../assets/src/seta.png')} 
              style={styles.backimage}
            />
          </TouchableOpacity>

          <Text style={styles.title}>DIÁRIO</Text>

          <TouchableOpacity 
            onPress={() => navigation.navigate('PerfilScreen')} 
            style={styles.profileButton}
          >
            <Image 
              source={require('../assets/src/perfil.png')} 
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView 
          style={styles.keyboardAvoid}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === 'ios' ? (screenWidth > 400 ? 90 : 80) : 0}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            alwaysBounceVertical={true}
          >   
            <View style={styles.formContainer}>
              
              {/* Título e Data */}
              <View style={styles.titleSection}>
                <Text style={styles.formTitle}>Como foi seu dia?</Text>
                <Text style={styles.formDate}>{new Date().toLocaleDateString('pt-BR')}</Text>
              </View>

              {/* Campo de Texto */}
              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Sua anotação</Text>
                <TextInput
                  style={styles.textInput}
                  multiline
                  placeholder="Escreva sobre seu dia, sentimentos, conquistas..."
                  placeholderTextColor="#999"
                  value={newEntryText}
                  onChangeText={(text) => {
                    setNewEntryText(text);
                    if (validationError) setValidationError('');
                  }}
                />
              </View>

              {/* Seleção de Humor - SCROLL HORIZONTAL */}
              <View style={styles.moodSection}>
                <Text style={styles.inputLabel}>Como você está se sentindo?</Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  style={styles.moodScrollContainer}
                  contentContainerStyle={styles.moodScrollContent}
                >
                  {moods.map((mood) => (
                    <TouchableOpacity
                      key={mood.name}
                      style={[
                        styles.moodButton,
                        selectedMood?.name === mood.name && { 
                          backgroundColor: mood.color,
                          transform: [{ scale: 1.05 }]
                        }
                      ]}
                      onPress={() => {
                        setSelectedMood(mood);
                        if (validationError) setValidationError('');
                      }}
                    >
                    <Ionicons
  name={mood.icon}
  size={screenWidth > 400 ? (screenWidth > 500 ? 30 : 28) : 24}
  color={selectedMood?.name === mood.name ? '#000' : '#31356e'} // Preto quando selecionado, #31356e quando não
/>
<Text style={[
  styles.moodText, 
  selectedMood?.name === mood.name ? { 
    color: '#000', // Preto quando selecionado
    fontWeight: 'bold' 
  } : {
    color: '#31356e', // #31356e quando não selecionado
    fontWeight: 'bold' 
  }
]}>
  {mood.name}
</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Adicionar Imagem */}
              <View style={styles.imageSection}>
                <Text style={styles.inputLabel}>Adicionar imagem (opcional)</Text>
                <TouchableOpacity style={styles.imagePickerButton} onPress={handlePickImage}>
                  <Ionicons name="image-outline" size={screenWidth > 400 ? 26 : 22} color="#0e458c" />
                  <Text style={styles.imagePickerText}>Escolher da Galeria</Text>
                </TouchableOpacity>

                {imageAddedMessage !== '' && (
                  <Text style={styles.imageAddedMessage}>{imageAddedMessage}</Text>
                )}

                {newEntryImage && (
                  <View style={styles.imagePreviewContainer}>
                    <Text style={styles.previewLabel}>Pré-visualização:</Text>
                    <Image source={{ uri: newEntryImage }} style={styles.previewImage} />
                  </View>
                )}
              </View>

              {/* Mensagem de Erro */}
              {validationError !== '' && (
                <View style={styles.errorContainer}>
                  <Ionicons name="warning-outline" size={screenWidth > 400 ? 22 : 20} color="#ff3b30" />
                  <Text style={styles.validationError}>{validationError}</Text>
                </View>
              )}

              {/* Botão Salvar - MAIS PRÓXIMO */}
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveEntry}>
                <LinearGradient
                  colors={['#0e458c', '#1a5bb5']}
                  style={styles.saveButtonGradient}
                >
                  <Text style={styles.saveButtonText}>SALVAR ANOTAÇÃO</Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <View style={styles.bottomSpacer} />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
  keyboardAvoid: {
    flex: 1,
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

  // SCROLL CONTENT CORRIGIDO
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: screenWidth > 400 ? 25 : 20,
    paddingTop: screenWidth > 400 ? 20 : 15,
    paddingBottom: screenWidth > 400 ? 40 : 30,
    height: 350
  },
  formContainer: {
    alignItems: 'center',
  },

  // SEÇÃO DE TÍTULO - RESPONSIVO
  titleSection: {
    alignItems: 'center',
    marginBottom: screenWidth > 400 ? 25 : 20,
  },
  formTitle: {
    fontSize: screenWidth > 400 ? (screenWidth > 500 ? 32 : 30) : 26,
    fontWeight: 'bold',
    color: '#0e458c',
    textAlign: 'center',
    fontFamily: 'Bree-Serif',
    marginBottom: screenWidth > 400 ? 12 : 8,
  },
  formDate: {
    fontSize: screenWidth > 400 ? (screenWidth > 500 ? 18 : 17) : 15,
    color: '#666',
    textAlign: 'center',
    fontFamily: 'Bree-Serif',
  },

  // SEÇÃO DE INPUT - RESPONSIVO
  inputSection: {
    width: '100%',
    marginBottom: screenWidth > 400 ? 30 : 25,
  },
  inputLabel: {
    fontSize: screenWidth > 400 ? (screenWidth > 500 ? 18 : 17) : 15,
    color: '#0e458c',
    marginBottom: screenWidth > 400 ? 12 : 10,
    fontWeight: 'bold',
    fontFamily: 'Bree-Serif',
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: screenWidth > 400 ? 20 : 16,
    borderRadius: screenWidth > 400 ? 18 : 16,
    fontSize: screenWidth > 400 ? (screenWidth > 500 ? 17 : 16) : 15,
    color: '#333',
    textAlignVertical: 'top',
    minHeight: screenWidth > 400 ? 160 : 140,
    fontFamily: 'Bree-Serif',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  // SEÇÃO DE HUMOR - SCROLL HORIZONTAL
  moodSection: {
    width: '100%',
    marginBottom: screenWidth > 400 ? 25 : 20, // Reduzido para aproximar do botão
  },
  moodScrollContainer: {
    width: '100%',
  },
  moodScrollContent: {
    paddingHorizontal: 2,
    paddingVertical: 5,
  },
  moodButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: screenWidth > 400 ? 12 : 10,
    paddingHorizontal: screenWidth > 400 ? 12 : 10,
    borderRadius: screenWidth > 400 ? 14 : 12,
    minWidth: screenWidth > 400 ? 70 : 60,
    marginHorizontal: 4, // MENOS ESPAÇAMENTO
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  moodText: {
    fontSize: screenWidth > 400 ? (screenWidth > 500 ? 11 : 10) : 9,
    marginTop: screenWidth > 400 ? 6 : 5,
    color: '#666',
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'Bree-Serif',
  },

  // SEÇÃO DE IMAGEM - RESPONSIVO
  imageSection: {
    width: '100%',
    marginBottom: screenWidth > 400 ? 20 : 15, // Reduzido para aproximar do botão
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: screenWidth > 400 ? 16 : 14,
    borderRadius: screenWidth > 400 ? 14 : 12,
    marginBottom: screenWidth > 400 ? 12 : 10,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  imagePickerText: {
    marginLeft: screenWidth > 400 ? 12 : 10,
    fontSize: screenWidth > 400 ? (screenWidth > 500 ? 17 : 16) : 14,
    color: '#0e458c',
    fontWeight: '600',
    fontFamily: 'Bree-Serif',
  },
  imageAddedMessage: {
    textAlign: 'center',
    fontSize: screenWidth > 400 ? (screenWidth > 500 ? 15 : 14) : 13,
    color: '#0e458c',
    marginBottom: screenWidth > 400 ? 12 : 10,
    fontWeight: 'bold',
    fontFamily: 'Bree-Serif',
  },
  imagePreviewContainer: {
    marginBottom: screenWidth > 400 ? 15 : 12, // Reduzido
    width: '100%',
    alignItems: 'center',
  },
  previewLabel: {
    fontSize: screenWidth > 400 ? (screenWidth > 500 ? 15 : 14) : 13,
    color: '#0e458c',
    fontWeight: 'bold',
    marginBottom: screenWidth > 400 ? 8 : 6,
    alignSelf: 'flex-start',
    fontFamily: 'Bree-Serif',
  },
  previewImage: {
    width: '100%',
    height: screenWidth > 400 ? 180 : 150,
    borderRadius: screenWidth > 400 ? 14 : 12,
    resizeMode: 'cover',
    borderWidth: screenWidth > 400 ? 3 : 2,
    borderColor: '#5691de',
  },

  // ERRO - RESPONSIVO
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: screenWidth > 400 ? 16 : 14,
    borderRadius: screenWidth > 400 ? 14 : 12,
    marginBottom: screenWidth > 400 ? 15 : 12, // Reduzido para aproximar do botão
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  validationError: {
    fontSize: screenWidth > 400 ? (screenWidth > 500 ? 15 : 14) : 13,
    color: '#ff3b30',
    marginLeft: screenWidth > 400 ? 10 : 8,
    fontWeight: '600',
    fontFamily: 'Bree-Serif',
    flex: 1,
  },

  // BOTÃO SALVAR - MAIS PRÓXIMO
  saveButton: {
    borderRadius: screenWidth > 400 ? 28 : 25,
    overflow: 'hidden',
    marginTop: screenWidth > 400 ? 10 : 8, // REDUZIDO para ficar mais próximo
    width: '100%',
    maxWidth: screenWidth > 400 ? 350 : 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: screenWidth > 400 ? 4 : 3 },
    shadowOpacity: 0.3,
    shadowRadius: screenWidth > 400 ? 6 : 5,
    elevation: 6,
  },
  saveButtonGradient: {
    paddingVertical: screenWidth > 400 ? 18 : 16,
    borderRadius: screenWidth > 400 ? 28 : 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: screenWidth > 400 ? (screenWidth > 500 ? 18 : 17) : 16,
    fontWeight: 'bold',
    fontFamily: 'Bree-Serif',
    textTransform: 'uppercase',
  },

  bottomSpacer: {
    height: screenWidth > 400 ? 20 : 15, // Reduzido
  },
});

export default DiarioScreen;