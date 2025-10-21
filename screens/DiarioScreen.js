import React, { useState, useEffect } from 'react';
import {  SafeAreaProvider,StyleSheet, View, Text, TouchableOpacity, Image, TextInput, Alert, ScrollView, SafeAreaView, Dimensions, Platform, KeyboardAvoidingView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');
const API_URL = 'http://172.27.160.1:3000';

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
  const [validationError, setValidationError] = useState('');

  const isWeb = Platform.OS === 'web';

  // carregar entradas do diário
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await fetch(`${API_URL}/diary/getEntries/${userId}`);
        
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const fetchedEntries = await response.json();
        const formattedEntries = fetchedEntries.map(entry => ({
          id: entry.id,
          date: new Date(entry.created_at).toLocaleDateString('pt-BR'), 
          text: entry.entry_text,
          mood: moods.find(m => m.name === entry.mood),
          image: entry.image_url,
        }));

        setEntries(formattedEntries);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar as anotações.');
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
      setValidationError('');
    }
  };

  // selecionar imagem da galeria
  const handlePickImage = async () => {
    try {
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
                setNewEntryImage(base64);
                setImageAddedMessage('Foto adicionada! Pronto para salvar.');
              };
              reader.readAsDataURL(file);
            }
          };
          input.click();
        });
      }

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
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        const imageUri = selectedImage.base64 ? `data:image/jpeg;base64,${selectedImage.base64}` : selectedImage.uri;
        
        setNewEntryImage(imageUri);
        setImageAddedMessage('Foto adicionada! Pronto para salvar.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível acessar a galeria.');
    }
  };

  // upload de imagem para web
  const uploadImageWeb = async (base64Data) => {
    try {
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

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Upload falhou');
      }

      return result;
    } catch (error) {
      throw error;
    }
  };

  // upload de imagem para mobile
  const uploadImageMobile = async (imageUri) => {
    try {
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
      
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Upload falhou');
      }

      return result;
    } catch (error) {
      throw error;
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

  // salvar entrada no diário
  const handleSaveEntry = async () => {
    if (!validateForm()) {
      return;
    }

    let finalImageUrl = null;
    
    if (newEntryImage) {
      try {
        let uploadResult;

        if (isWeb) {
          uploadResult = await uploadImageWeb(newEntryImage);
        } else {
          uploadResult = await uploadImageMobile(newEntryImage);
        }

        if (uploadResult.success && uploadResult.imageUrl) {
          finalImageUrl = uploadResult.imageUrl;
        } else {
          throw new Error('URL da imagem não retornada');
        }

      } catch (error) {
        Alert.alert('Aviso', 'A entrada será salva sem imagem.');
      }
    }

    try {
      const saveData = {
        userId: parseInt(userId),
        mood: selectedMood.name,
        entryText: newEntryText,
        imageUrl: finalImageUrl,
      };

      const response = await fetch(`${API_URL}/diary/save`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(saveData),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Erro ao salvar anotação.');
      }

      Alert.alert('Sucesso!', 'Entrada salva com sucesso!');
      
      setNewEntryText('');
      setNewEntryImage(null);
      setSelectedMood(null);
      setImageAddedMessage('');
      setValidationError('');
      setShowList(true);
      
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a entrada.');
    }
  };

  const toggleExpand = (id) => {
    setExpandedEntryId(expandedEntryId === id ? null : id);
  };

  // formulário de nova entrada
  const renderDiaryForm = () => (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={['#d1e4ff', '#c4d8f2']} style={styles.background}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Image source={require('../assets/src/seta.png')} style={styles.backArrow} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>DIÁRIO</Text>
          <View style={styles.headerPlaceholder} />
        </View>

        <KeyboardAvoidingView 
          style={styles.keyboardAvoid}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView 
            contentContainerStyle={styles.formScrollContent}
            showsVerticalScrollIndicator={true}
            keyboardShouldPersistTaps="handled"
            alwaysBounceVertical={true}
          >   
            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>O que aconteceu hoje?</Text>
              <Text style={styles.formDate}>{new Date().toLocaleDateString('pt-BR')}</Text>

              <Text style={styles.inputLabel}>Sua anotação:</Text>
              <TextInput
                style={styles.textInput}
                multiline
                placeholder="Escreva sua anotação aqui..."
                placeholderTextColor="#0c4793"
                value={newEntryText}
                onChangeText={(text) => {
                  setNewEntryText(text);
                  if (validationError) setValidationError('');
                }}
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
                    onPress={() => {
                      setSelectedMood(mood);
                      if (validationError) setValidationError('');
                    }}
                  >
                    <Ionicons
                      name={mood.icon}
                      size={width > 400 ? 28 : 24}
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
                </View>
              )}

              {validationError !== '' && (
                <Text style={styles.validationError}>{validationError}</Text>
              )}

              <TouchableOpacity style={styles.saveButton} onPress={handleSaveEntry}>
                <Text style={styles.saveButtonText}>Salvar Anotação</Text>
              </TouchableOpacity>
              
              <View style={styles.bottomSpacer} />
            </View>
            </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );

  // lista de entradas existentes
  const renderDiaryList = () => (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={['#d1e4ff', '#c4d8f2']} style={styles.background}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Image source={require('../assets/src/seta.png')} style={styles.backArrow} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>DIÁRIO</Text>
          <View style={styles.headerPlaceholder} />
        </View>

        <View style={styles.mainContent}>
          <View style={styles.cardContainer}>
            <Text style={styles.listTitle}>Minhas Anotações</Text>
            <ScrollView 
              contentContainerStyle={styles.listContent} 
              showsVerticalScrollIndicator={true}
              alwaysBounceVertical={true}
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
                      <View style={styles.entryDetails}>
                        <Text style={styles.entryText}>{entry.text}</Text>
                        {entry.image && (
                          <Image source={{ uri: entry.image }} style={styles.entryImage} />
                        )}
                      </View>
                    )}
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.noEntriesContainer}>
                  <Text style={styles.noEntriesText}>
                    Nenhuma anotação salva.{"\n"} 
                    Clique no botão abaixo para adicionar!
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => {
            setShowList(false);
            setValidationError('');
          }}
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
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#a2caff',
    width: '100%',
    height: Platform.OS === 'ios' ? 80 : 70,
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'ios' ? 10 : 5,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  backButton: {
    padding: 5,
  },
  backArrow: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    tintColor: 'white',
  },
  headerTitle: {
    fontSize: width > 400 ? 24 : 20,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Bree-serif',
    textAlign: 'center',
  },
  headerPlaceholder: {
    width: 30,
  },
  mainContent: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 20,
    marginHorizontal: 15,
    width: width - 30,
    maxWidth: 500,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
    maxHeight: height * 0.6,
  },
  listTitle: {
    fontSize: width > 400 ? 22 : 20,
    fontWeight: 'bold',
    color: '#0c4793',
        fontFamily: 'Bree-serif',
    textAlign: 'center',
    marginBottom: 15,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 10,
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
    fontSize: width > 400 ? 16 : 14,
    fontWeight: 'bold',
        fontFamily: 'Bree-serif',
    color: '#0c4793',
  },
  moodCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  entryDetails: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(12, 71, 147, 0.1)',
  },
  entryText: {
    fontSize: width > 400 ? 15 : 13,
    color: '#333',
        fontFamily: 'Bree-serif',
    lineHeight: 20,
    marginBottom: 10,
  },
  entryImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginTop: 5,
    resizeMode: 'cover',
  },
  noEntriesContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  noEntriesText: {
    fontSize: width > 400 ? 16 : 14,
    color: '#0c4793',
        fontFamily: 'Bree-serif',
    textAlign: 'center',
    lineHeight: 22,
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    height: 350,
  },
  formContainer: {
    alignItems: 'center',
  },
  formTitle: {
    fontSize: width > 400 ? 26 : 22,
    fontWeight: 'bold',
    color: '#0c4793',
    textAlign: 'center',
    marginBottom: 8,
  },
  formDate: {
    fontSize: width > 400 ? 16 : 14,
    color: '#0c4793',
    textAlign: 'center',
    marginBottom: 25,
  },
  inputLabel: {
    fontSize: width > 400 ? 16 : 14,
    color: '#0c4793',
    marginBottom: 8,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    width: '100%',
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 15,
    borderRadius: 10,
    fontSize: width > 400 ? 16 : 14,
    color: '#333',
    textAlignVertical: 'top',
    minHeight: 140,
    marginBottom: 20,
    width: '300%',
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 20,
    width: '100%',
  },
  moodButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 10,
    width: (width - 60) / 5,
    minWidth: 55,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 5,
  },
  moodText: {
    fontSize: width > 400 ? 11 : 9,
    marginTop: 4,
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
    width: '100%',
  },
  imagePickerText: {
    marginLeft: 10,
    fontSize: width > 400 ? 16 : 14,
    color: '#0c4793',
  },
  imageAddedMessage: {
    textAlign: 'center',
    fontSize: width > 400 ? 14 : 12,
    color: '#0c4793',
    marginBottom: 10,
    fontWeight: 'bold',
    width: '100%',
  },
  imagePreviewContainer: {
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
  },
  previewLabel: {
    fontSize: width > 400 ? 14 : 12,
    color: '#0c4793',
    fontWeight: 'bold',
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
  previewImage: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    marginBottom: 5,
    resizeMode: 'cover',
    borderWidth: 1,
    borderColor: '#0c4793',
  },
  validationError: {
    fontSize: width > 400 ? 14 : 12,
    color: '#ff3b30',
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: 'bold',
    backgroundColor: 'rgba(255,255,255,0.7)',
    padding: 10,
    borderRadius: 8,
    width: '100%',
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
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: width > 400 ? 18 : 16,
    fontWeight: 'bold',
  },
  bottomSpacer: {
    height: 30,
  },
});

export default DiarioScreen;