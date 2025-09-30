import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ScrollView, // Importado
  SafeAreaView,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// URL do seu servidor backend
const API_URL = 'http://172.19.96.1:3000';

// Emoções disponíveis
const moods = [
  { name: 'Feliz', icon: 'happy-outline', color: '#a1bce2' },
  { name: 'Triste', icon: 'sad-outline', color: '#a1bce2' },
  { name: 'Raiva', icon: 'flame-outline', color: '#84a9da' },
  { name: 'Estressado', icon: 'flash-outline', color: '#a4c4ff' },
  { name: 'Calmo', icon: 'leaf-outline', color: '#b8d1ff' },
];

const DiarioScreen = ({ navigation, route }) => {
  const { userId } = route.params;

  const [entries, setEntries] = useState([]);
  const [showList, setShowList] = useState(true);
  const [newEntryText, setNewEntryText] = useState('');
  const [newEntryImage, setNewEntryImage] = useState(null);
  const [selectedMood, setSelectedMood] = useState(null);
  const [expandedEntryId, setExpandedEntryId] = useState(null);
  const [imageAddedMessage, setImageAddedMessage] = useState('');

  // Buscar entradas do diário
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
        console.error('Erro ao buscar entradas:', error);
      }
    };

    if (userId) {
      fetchEntries();
    }
  }, [userId, showList]);

  // Voltar
  const handleBackPress = () => {
    if (showList) {
      navigation.goBack();
    } else {
      setShowList(true);
    }
  };

  // Escolher imagem
  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar sua galeria.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setNewEntryImage(result.assets[0].uri);
      setImageAddedMessage('Foto adicionada!');
    } else {
      setImageAddedMessage('');
    }
  };

  // Salvar entrada
  const handleSaveEntry = async () => {
    if (newEntryText.trim() === '' || !selectedMood) {
      Alert.alert('Atenção', 'Por favor, escreva um texto e selecione seu humor.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/diary/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          mood: selectedMood.name,
          entryText: newEntryText,
          imageUrl: newEntryImage,
        }),
      });

      const result = await response.json();
      Alert.alert('Sucesso!', 'Entrada salva com sucesso!');
      setNewEntryText('');
      setNewEntryImage(null);
      setSelectedMood(null);
      setImageAddedMessage('');
      setShowList(true);
    } catch (error) {
      console.error('Erro ao salvar entrada:', error);
      Alert.alert('Erro', 'Não foi possível salvar a entrada. Tente novamente.');
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
                  <Text style={[styles.moodText, selectedMood?.name === mood.name && { color: '#fff' }]}>
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
            <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={true}>
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
                      // AQUI: Adicionado ScrollView para o conteúdo expandido
                      <ScrollView 
                        style={styles.entryDetailsScroll} 
                        showsVerticalScrollIndicator={true}
                        // Define uma altura máxima para o scroll funcionar
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
                  Nenhuma anotação salva. {"\n"} Clique no botão abaixo para adicionar!
                </Text>
              )}
            </ScrollView>
          </View>
        </View>

        <TouchableOpacity style={styles.addButton} onPress={() => setShowList(false)}>
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

  // Cabeçalho lista
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

  // Cabeçalho formulário (Mantido do código original)
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

  // Conteúdo da lista
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
  // NOVO ESTILO: Container de Scroll para o conteúdo expandido
  entryDetailsScroll: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(12, 71, 147, 0.1)',
    // Defina uma altura máxima para o ScrollView aqui, para que ele só role quando o conteúdo exceder esse limite
    maxHeight: 250, 
  },
  entryDetails: {
    paddingTop: 10,
    // Removido maxHeight: 200 e overflow: 'hidden' daqui
  },
  entryText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
    marginBottom: 10, // Adicionado para dar espaço antes da imagem
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

  // Conteúdo do formulário (Mantido do código original)
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