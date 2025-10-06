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
  Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// URL do seu servidor backend
const API_URL = 'http://172.24.240.1:3000'; 

// Emoções disponíveis
const moods = [
  { name: 'Feliz', icon: 'happy-outline', color: '#a1bce2' },
  { name: 'Triste', icon: 'sad-outline', color: '#a1bce2' },
  { name: 'Raiva', icon: 'flame-outline', color: '#84a9da' },
  { name: 'Estressado', icon: 'flash-outline', color: '#a4c4ff' },
  { name: 'Calmo', icon: 'leaf-outline', color: '#b8d1ff' },
];

const DiarioScreen = ({ navigation, route }) => {
  const userId = route.params?.userId || 1; 

  const [entries, setEntries] = useState([]);
  const [showList, setShowList] = useState(true);
  const [newEntryText, setNewEntryText] = useState('');
  const [newEntryImage, setNewEntryImage] = useState(null);
  const [selectedMood, setSelectedMood] = useState(null);
  const [expandedEntryId, setExpandedEntryId] = useState(null);
  const [imageAddedMessage, setImageAddedMessage] = useState('');

  // Verificar se está no ambiente web
  const isWeb = Platform.OS === 'web';

  // Buscar entradas do diário
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        console.log('Buscando entradas para usuário:', userId);
        const response = await fetch(`${API_URL}/diary/getEntries/${userId}`);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Erro na resposta:', response.status, errorText);
          throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const fetchedEntries = await response.json();
        console.log('Entradas recebidas:', fetchedEntries);

        const formattedEntries = fetchedEntries.map(entry => ({
          id: entry.id,
          date: new Date(entry.created_at).toLocaleDateString('pt-BR'), 
          text: entry.entry_text,
          mood: moods.find(m => m.name === entry.mood),
          image: entry.image_url,
        }));

        setEntries(formattedEntries);
      } catch (error) {
        console.error('Erro ao buscar entradas:', error);
        Alert.alert('Erro', 'Não foi possível carregar as anotações. Verifique a conexão com o servidor.');
      }
    };

    if (userId) {
      fetchEntries();
    }
  }, [userId, showList]);

  const handleBackPress = () => {
    if (showList) {
      navigation.goBack();
    } else {
      setShowList(true);
    }
  };

  // Escolher imagem - VERSÃO WEB COMPATÍVEL
  const handlePickImage = async () => {
    try {
      console.log('Abrindo seletor de imagem...');
      console.log('Plataforma:', Platform.OS);

      // No web, usar input file nativo
      if (isWeb) {
        return new Promise((resolve) => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = 'image/*';
          
          input.onchange = (event) => {
            const file = event.target.files[0];
            if (file) {
              const reader = new FileReader();
              
              reader.onload = (e) => {
                const base64 = e.target.result;
                console.log('📸 Imagem selecionada (web):', {
                  fileName: file.name,
                  fileSize: file.size,
                  type: file.type
                });
                
                setNewEntryImage(base64);
                setImageAddedMessage('Foto adicionada! Pronto para salvar.');
              };
              
              reader.readAsDataURL(file);
            }
          };
          
          input.click();
        });
      }

      // Para mobile
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos de acesso à sua galeria para adicionar imagens.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });

      console.log('Resultado do ImagePicker:', result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        const imageUri = selectedImage.base64 ? `data:image/jpeg;base64,${selectedImage.base64}` : selectedImage.uri;
        
        setNewEntryImage(imageUri);
        setImageAddedMessage('Foto adicionada! Pronto para salvar.');
        
      } else {
        console.log('Seleção de imagem cancelada pelo usuário');
        setImageAddedMessage('');
      }
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error);
      Alert.alert('Erro', 'Não foi possível acessar a galeria. Tente novamente.');
    }
  };

  // Upload de imagem - VERSÃO WEB (usando base64)
  const uploadImageWeb = async (base64Data) => {
    try {
      console.log('📤 Enviando imagem (web)...');
      
      // Extrair apenas a parte base64
      const base64Content = base64Data.split(',')[1];
      const mimeType = base64Data.split(';')[0].split(':')[1];
      
      const response = await fetch(`${API_URL}/diary/uploadImage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData: base64Content,
          isBase64: true,
          mimeType: mimeType,
          filename: `diary_${userId}_${Date.now()}.${mimeType.split('/')[1] || 'jpg'}`
        }),
      });

      console.log('📨 Status do upload (web):', response.status);
      
      const result = await response.json();
      console.log('📄 Resultado do upload (web):', result);

      if (!response.ok) {
        throw new Error(result.message || `Upload falhou com status: ${response.status}`);
      }

      return result;
    } catch (error) {
      console.error('❌ Erro no upload (web):', error);
      throw error;
    }
  };

  // Upload de imagem - VERSÃO MOBILE (usando FormData)
  const uploadImageMobile = async (imageUri) => {
    try {
      console.log('📤 Enviando imagem (mobile)...');
      
      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: `diary_${userId}_${Date.now()}.jpg`,
      });

      const response = await fetch(`${API_URL}/diary/uploadImage`, {
        method: 'POST',
        body: formData,
      });

      console.log('📨 Status do upload (mobile):', response.status);
      
      const result = await response.json();
      console.log('📄 Resultado do upload (mobile):', result);

      if (!response.ok) {
        throw new Error(result.message || `Upload falhou com status: ${response.status}`);
      }

      return result;
    } catch (error) {
      console.error('❌ Erro no upload (mobile):', error);
      throw error;
    }
  };

  // Salvar entrada - VERSÃO COMPATÍVEL COM WEB E MOBILE
  const handleSaveEntry = async () => {
    console.log('Iniciando salvamento da entrada...');
    console.log('Plataforma:', Platform.OS);
    console.log('Texto:', newEntryText);
    console.log('Humor:', selectedMood);
    console.log('Imagem disponível:', !!newEntryImage);

    if (newEntryText.trim() === '' || !selectedMood) {
      Alert.alert('Atenção', 'Por favor, escreva um texto e selecione seu humor.');
      return;
    }

    let finalImageUrl = null;
    
    // Upload da imagem se existir
    if (newEntryImage) {
      console.log('🖼️ Iniciando upload da imagem...');
      
      try {
        let uploadResult;

        if (isWeb) {
          // No web, usar base64
          uploadResult = await uploadImageWeb(newEntryImage);
        } else {
          // No mobile, usar FormData
          uploadResult = await uploadImageMobile(newEntryImage);
        }

        if (uploadResult.success && uploadResult.imageUrl) {
          finalImageUrl = uploadResult.imageUrl;
          console.log('✅ Upload bem-sucedido! URL:', finalImageUrl);
        } else {
          throw new Error(uploadResult.message || 'URL da imagem não retornada');
        }

      } catch (error) {
        console.error('❌ Erro no upload:', error);
        Alert.alert(
          'Aviso', 
          `Não foi possível enviar a imagem: ${error.message}. A entrada será salva sem imagem.`
        );
      }
    } else {
      console.log('📭 Nenhuma imagem para upload');
    }

    // Salvar dados do diário
    try {
      console.log('💾 Salvando entrada no diário...');
      const saveData = {
        userId: parseInt(userId),
        mood: selectedMood.name,
        entryText: newEntryText,
        imageUrl: finalImageUrl,
      };

      console.log('📦 Dados para salvar:', saveData);

      const response = await fetch(`${API_URL}/diary/save`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(saveData),
      });

      console.log('📊 Status do salvamento:', response.status);
      
      const result = await response.json();
      console.log('📝 Resultado do salvamento:', result);
      
      if (!response.ok) {
        throw new Error(result.message || 'Erro ao salvar anotação.');
      }

      Alert.alert('Sucesso!', 'Entrada salva com sucesso!');
      
      // Resetar o formulário
      setNewEntryText('');
      setNewEntryImage(null);
      setSelectedMood(null);
      setImageAddedMessage('');
      setShowList(true);
      
    } catch (error) {
      console.error('💥 Erro ao salvar entrada:', error);
      Alert.alert(
        'Erro', 
        error.message || 'Não foi possível salvar a entrada. Verifique a conexão com o servidor.'
      );
    }
  };

  // Função de teste para debug
  const testImageUpload = async () => {
    if (!newEntryImage) {
      Alert.alert('Teste', 'Selecione uma imagem primeiro');
      return;
    }

    console.log('=== 🧪 TESTE DE UPLOAD ===');
    console.log('Plataforma:', Platform.OS);
    
    try {
      let result;
      
      if (isWeb) {
        result = await uploadImageWeb(newEntryImage);
      } else {
        result = await uploadImageMobile(newEntryImage);
      }

      console.log('Resultado completo:', result);

      if (result.success) {
        Alert.alert('✅ Teste OK', `Upload funcionou! URL: ${result.imageUrl}`);
      } else {
        Alert.alert('❌ Teste Falhou', result.message);
      }

    } catch (error) {
      console.error('Erro no teste:', error);
      Alert.alert('💥 Teste Erro', error.message);
    }
  };

  const toggleExpand = (id) => {
    setExpandedEntryId(expandedEntryId === id ? null : id);
  };

  // Formulário de nova entrada
  const renderDiaryForm = () => (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={['#d1e4ff', '#c4d8f2']} style={styles.background}>
        <View style={styles.headerOld}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButtonOld}>
            <Image source={require('../assets/src/seta.png')} style={styles.backArrowOld} />
          </TouchableOpacity>
          <Text style={styles.headerTitleOld}>DIÁRIO</Text>
          <View style={styles.logoContainerOld}>
            <Image source={require('../assets/src/logoimg.png')} style={styles.logoOld} />
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.formScrollContent}>
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>O que aconteceu hoje?</Text>
            <Text style={styles.formDate}>{new Date().toLocaleDateString('pt-BR')}</Text>

            <TextInput
              style={styles.textInput}
              multiline
              placeholder="Escreva sua anotação aqui..."
              placeholderTextColor="#0c4793"
              value={newEntryText}
              onChangeText={setNewEntryText}
            />

            <Text style={styles.inputLabel}>Como foi seu dia?</Text>
            <View style={styles.moodContainer}>
              {moods.map((mood) => (
                <TouchableOpacity
                  key={mood.name}
                  style={[
                    styles.moodButton,
                    selectedMood?.name === mood.name && { backgroundColor: mood.color }
                  ]}
                  onPress={() => setSelectedMood(mood)}
                >
                  <Ionicons
                    name={mood.icon}
                    size={28}
                    color={selectedMood?.name === mood.name ? '#fff' : mood.color}
                  />
                  <Text style={[
                    styles.moodText, 
                    selectedMood?.name === mood.name && { color: '#fff' }
                  ]}>
                    {mood.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.imagePickerButton} onPress={handlePickImage}>
              <Ionicons name="image-outline" size={24} color="#0c4793" />
              <Text style={styles.imagePickerText}>Adicionar Imagem</Text>
            </TouchableOpacity>

            

            {imageAddedMessage !== '' && (
              <Text style={styles.imageAddedMessage}>{imageAddedMessage}</Text>
            )}

            {newEntryImage && (
              <View style={styles.imagePreviewContainer}>
                <Text style={styles.previewLabel}>Pré-visualização:</Text>
                <Image source={{ uri: newEntryImage }} style={styles.previewImage} />
                <Text style={styles.imageInfo}>
                  {isWeb ? 'Modo Web - Base64' : 'Modo Mobile'} - Imagem carregada!
                </Text>
              </View>
            )}

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveEntry}>
              <Text style={styles.saveButtonText}>Salvar Anotação</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );

  // Lista de entradas
  const renderDiaryList = () => (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={['#d1e4ff', '#c4d8f2']} style={styles.background}>
        <View style={styles.headerList}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButtonList}>
            <Image source={require('../assets/src/seta.png')} style={styles.backArrowList} />
          </TouchableOpacity>
          <Text style={styles.headerTextList}>DIÁRIO</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.mainContent}>
          <View style={styles.cardContainer}>
            <Text style={styles.listTitle}>Minhas Anotações</Text>
            <ScrollView 
              contentContainerStyle={styles.listContent} 
              showsVerticalScrollIndicator={true}
            >
              {entries.length > 0 ? (
                entries.map((entry) => (
                  <TouchableOpacity
                    key={entry.id}
                    style={styles.entryContainer}
                    onPress={() => toggleExpand(entry.id)}
                  >
                    <View style={styles.entryHeader}>
                      <Text style={styles.entryDate}>{entry.date}</Text>
                      {entry.mood && (
                        <View style={[styles.moodCircle, { backgroundColor: entry.mood.color }]}>
                          <Ionicons name={entry.mood.icon} size={20} color="#fff" />
                        </View>
                      )}
                    </View>

                    {expandedEntryId === entry.id && (
                      <ScrollView 
                        style={styles.entryDetailsScroll} 
                        showsVerticalScrollIndicator={true}
                        contentContainerStyle={{ paddingBottom: 10 }}
                      >
                        <View style={styles.entryDetails}>
                          <Text style={styles.entryText}>{entry.text}</Text>
                          {entry.image && (
                            <Image source={{ uri: entry.image }} style={styles.entryImage} />
                          )}
                        </View>
                      </ScrollView>
                    )}
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.noEntriesText}>
                  Nenhuma anotação salva.{"\n"} 
                  Clique no botão abaixo para adicionar!
                </Text>
              )}
            </ScrollView>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => setShowList(false)}
        >
          <Ionicons name="add-circle" size={50} color="#0c4793" />
        </TouchableOpacity>
      </LinearGradient>
    </SafeAreaView>
  );

  return showList ? renderDiaryList() : renderDiaryForm();
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  headerList: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#a2caff',
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  backButtonList: {
    padding: 10,
  },
  backArrowList: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    tintColor: 'white',
  },
  headerTextList: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  headerOld: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    position: 'absolute',
    top: 0,
    zIndex: 1,
  },
  backButtonOld: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrowOld: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    tintColor: '#0c4793',
  },
  headerTitleOld: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#0c4793',
    textAlign: 'center',
    flex: 1,
  },
  logoContainerOld: {
    width: 40,
    height: 40,
  },
  logoOld: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    tintColor: '#fff',
  },
  mainContent: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 20,
    marginHorizontal: 20,
    width: width - 40,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
    maxHeight: '75%',
  },
  listTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0c4793',
    textAlign: 'center',
    marginBottom: 15,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  entryContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  entryDate: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0c4793',
  },
  moodCircle: {
    width: 35,
    height: 35,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  entryDetailsScroll: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(12, 71, 147, 0.1)',
    maxHeight: 250,
  },
  entryDetails: {
    paddingTop: 10,
  },
  entryText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
    marginBottom: 10,
  },
  entryImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginTop: 5,
    resizeMode: 'cover',
  },
  noEntriesText: {
    fontSize: 16,
    color: '#0c4793',
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 24,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 30,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  formScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    paddingTop: 100,
  },
  formContainer: {
    paddingTop: 20,
  },
  formTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0c4793',
    textAlign: 'center',
    marginBottom: 10,
  },
  formDate: {
    fontSize: 18,
    color: '#0c4793',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 14,
    color: '#0c4793',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    color: '#333',
    textAlignVertical: 'top',
    height: 150,
    marginBottom: 20,
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  moodButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 10,
    width: (width - 60) / 5 - 5,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    marginHorizontal: 2,
  },
  moodText: {
    fontSize: 10,
    marginTop: 5,
    color: '#0c4793',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  imagePickerText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#0c4793',
  },
  imageAddedMessage: {
    textAlign: 'center',
    fontSize: 14,
    color: '#0c4793',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  webInfo: {
    fontSize: 12,
    color: '#0c4793',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 10,
    backgroundColor: 'rgba(255,255,255,0.5)',
    padding: 8,
    borderRadius: 5,
  },
  imagePreviewContainer: {
    marginBottom: 15,
  },
  previewLabel: {
    fontSize: 14,
    color: '#0c4793',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  previewImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 5,
    resizeMode: 'cover',
    borderWidth: 1,
    borderColor: '#0c4793',
  },
  imageInfo: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#84a9da',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DiarioScreen;