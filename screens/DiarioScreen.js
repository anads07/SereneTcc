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

// constantes e configurações
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// ip da api atualizado
const API_URL = 'http://172.20.112.1:3000'; 

// lista de humores
const moods = [
  { name: 'Feliz', key: 'happy', icon: 'happy-outline', color: '#FFF3B0' },
  { name: 'Triste', key: 'sad', icon: 'sad-outline', color: '#A7C7E7' },
  { name: 'Estressado', key: 'stressed', icon: 'flash-outline', color: '#F4A6A6' },
  { name: 'Calmo', key: 'calm', icon: 'leaf-outline', color: '#B5EAD7' },
  { name: 'Ansioso', key: 'anxious', icon: 'alert-circle-outline', color: '#C8B6E2' },
  { name: 'Confuso', key: 'confused', icon: 'help-circle-outline', color: '#FFD6A5' },
];

const DiarioScreen = ({ navigation, route }) => {
  // estados
  const [newEntryText, setNewEntryText] = useState('');
  const [newEntryImage, setNewEntryImage] = useState(null); 
  const [selectedMood, setSelectedMood] = useState(null);
  const [validationError, setValidationError] = useState('');
  const [imageAddedMessage, setImageAddedMessage] = useState('');
  const [userId, setUserId] = useState(null); 

  // parâmetros de navegação
  const initialEmotion = route.params?.initialEmotion;

  // efeito: carregar id do usuário e definir humor inicial
  useEffect(() => {
    const fetchUserIdAndMood = async () => {
      // 1. carregar o id do usuário (auth)
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          setUserId(storedUserId);
        } else {
          Alert.alert('Erro', 'Usuário não logado. Faça login novamente.');
          navigation.goBack();
        }
      } catch (e) {
        console.error('Erro ao buscar userId:', e);
      }
      
      // 2. definir o humor inicial, se veio da tela anterior
      if (initialEmotion) {
        const mood = moods.find(m => m.key === initialEmotion);
        if (mood) {
          setSelectedMood(mood);
        }
      }
    };

    fetchUserIdAndMood();
  }, [initialEmotion]);

  // funções auxiliares

  /**
    converte uma uri de arquivo local para base64 (usado para mobile)
    @param {string} uri - uri do arquivo
    @returns {promise<string|null>} base64 da imagem (sem prefixo 'data:image/')
   */
  const uriToBase64 = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          // remove o prefixo 'data:image/jpeg;base64,'
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('erro ao converter uri para base64:', error);
      return null;
    }
  };

  /**
   * permite ao usuário selecionar uma imagem da galeria (compatível com web e mobile).
   */
  const handlePickImage = async () => {
    try {
      // para web: usa input de arquivo nativo
      if (Platform.OS === 'web') {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.onchange = (event) => {
          const file = event.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              // já vem como data url (base64 com prefixo)
              setNewEntryImage(e.target.result); 
              setImageAddedMessage('Foto adicionada! Pronto para salvar.');
            };
            reader.readAsDataURL(file);
          }
        };
        input.click();
        return;
      }

      // para mobile: usa imagepicker do expo
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos de acesso à sua galeria para adicionar fotos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true, 
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        
        // se expo retornou base64, monta a data url. senão, usa a uri.
        const imageUri = selectedImage.base64 
          ? `data:${selectedImage.mimeType || 'image/jpeg'};base64,${selectedImage.base64}`
          : selectedImage.uri;
        
        setNewEntryImage(imageUri);
        setImageAddedMessage('Foto adicionada! Pronto para salvar.');
      }
    } catch (error) {
      console.error('erro ao acessar a galeria:', error);
      Alert.alert('Erro', 'Não foi possível acessar a galeria.');
    }
  };

  /**
   * valida os campos do formulário antes de salvar.
   */
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

  // função principal: salvar entrada no diário
  const handleSaveEntry = async () => {
    if (!validateForm() || !userId) {
      return;
    }

    let imageBase64 = null;
    
    if (newEntryImage) {
      try {
        // se a imagem já é uma data url (web ou mobile com base64), extrai o base64
        if (newEntryImage.startsWith('data:image')) {
          imageBase64 = newEntryImage.split(',')[1];
        } else {
          // se for uma uri local (caminho de arquivo), precisa converter
          imageBase64 = await uriToBase64(newEntryImage);
        }
        
        if (!imageBase64) {
          throw new Error("falha na conversão da imagem.");
        }
        console.log('imagem convertida para base64 - tamanho:', imageBase64.length);

      } catch (error) {
        console.error('erro ao processar imagem:', error);
        Alert.alert('Aviso', 'A imagem não pôde ser processada. A entrada será salva sem imagem.');
      }
    }

    const saveData = {
      user_id: userId,
      text: newEntryText,
      mood_key: selectedMood.key,
      mood_name: selectedMood.name,
      mood_color: selectedMood.color,
      mood_icon: selectedMood.icon,
      timestamp: new Date().toISOString(),
      image_base64: imageBase64 // envia o base64 (sem prefixo) ou null
    };

    try {
      const response = await fetch(`${API_URL}/api/diary/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(saveData),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Sucesso!', 'Entrada salva com sucesso!');
        
        // limpar estados
        setNewEntryText('');
        setNewEntryImage(null);
        setSelectedMood(null);
        setImageAddedMessage('');
        setValidationError('');
        
        navigation.navigate('RegistrosScreen');
      } else {
        console.error('erro do servidor:', data.errorDetails || data.message);
        Alert.alert('Erro', `Não foi possível salvar a entrada. detalhes: ${data.message}`);
      }
      
    } catch (error) {
      console.error('erro na requisição de rede:', error);
      Alert.alert('Erro', 'Não foi possível conectar ao servidor. verifique o ip e se o servidor node.js está rodando.');
    }
  };

  // renderização
  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={['#b9d2ff', '#d9e7ff', '#eaf3ff']} style={styles.background}>
        
        {/* header */}
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

        {/* área de conteúdo com keyboard avoiding */}
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
              
              {/* seção de título/data */}
              <View style={styles.titleSection}>
                <Text style={styles.formTitle}>Como foi seu dia?</Text>
                <Text style={styles.formDate}>{new Date().toLocaleDateString('pt-BR')}</Text>
              </View>

              {/* seção de anotação de texto */}
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

              {/* seção de humor */}
              <View style={styles.moodSection}>
                <Text style={styles.inputLabel}>Como você está se sentindo?</Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
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
                        color={selectedMood?.name === mood.name ? '#000' : '#31356e'} 
                      />
                      <Text style={[
                        styles.moodText, 
                        selectedMood?.name === mood.name ? styles.selectedMoodText : styles.unselectedMoodText
                      ]}>
                        {mood.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* seção de imagem */}
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
                    {/* a fonte da imagem pode ser uri local ou data url (base64) */}
                    <Image source={{ uri: newEntryImage }} style={styles.previewImage} />
                  </View>
                )}
              </View>

              {/* seção de erro de validação */}
              {validationError !== '' && (
                <View style={styles.errorContainer}>
                  <Ionicons name="warning-outline" size={screenWidth > 400 ? 22 : 20} color="#ff3b30" />
                  <Text style={styles.validationError}>{validationError}</Text>
                </View>
              )}

              {/* botão salvar */}
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

// estilos
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
  
  // header
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
  profileButton: {
    padding: 5,
  },
  backimage: {
    width: screenWidth > 400 ? (screenWidth > 500 ? 60 : 55) : 45,
    height: screenWidth > 400 ? (screenWidth > 500 ? 60 : 55) : 45,
    resizeMode: 'contain',
    tintColor: 'white',
    transform: [{ scaleX: -1 }], 
  },
  profileImage: {
    width: screenWidth > 400 ? (screenWidth > 500 ? 60 : 55) : 45,
    height: screenWidth > 400 ? (screenWidth > 500 ? 60 : 55) : 45,
    resizeMode: 'contain',
    tintColor: 'white',
  },

  // scroll content
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

  // seção de título
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

  // seção de input
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

  // seção de humor - scroll horizontal
  moodSection: {
    width: '100%',
    marginBottom: screenWidth > 400 ? 25 : 20, 
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
    marginHorizontal: 4, 
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
  selectedMoodText: {
    color: '#000', 
    fontWeight: 'bold',
  },
  unselectedMoodText: {
    color: '#31356e', 
    fontWeight: 'bold',
  },

  // seção de imagem
  imageSection: {
    width: '100%',
    marginBottom: screenWidth > 400 ? 20 : 15, 
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
    marginBottom: screenWidth > 400 ? 15 : 12, 
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

  // seção de erro
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: screenWidth > 400 ? 16 : 14,
    borderRadius: screenWidth > 400 ? 14 : 12,
    marginBottom: screenWidth > 400 ? 15 : 12, 
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

  // botão salvar
  saveButton: {
    borderRadius: screenWidth > 400 ? 28 : 25,
    overflow: 'hidden',
    marginTop: screenWidth > 400 ? 10 : 8, 
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
    height: screenWidth > 400 ? 20 : 15, 
  },
});

export default DiarioScreen;