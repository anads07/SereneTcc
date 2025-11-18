import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Image,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const API_URL = 'http://172.28.144.1:3000';

const RegistrosScreen = ({ navigation }) => {
  const [expandedEntryId, setExpandedEntryId] = useState(null);
  const [entries, setEntries] = useState([]);
  const [userId, setUserId] = useState(null);

  const loadEntries = useCallback(async (currentUserId) => {
    if (!currentUserId) {
      console.warn('ID do usuário ausente para carregar entradas.');
      return;
    }

    try {
      console.log('🔍 Buscando entradas para o usuário:', currentUserId);
      
      const response = await fetch(`${API_URL}/api/diary/${currentUserId}`);
      const data = await response.json();

      console.log('📦 Dados recebidos do servidor:', JSON.stringify(data, null, 2));

      if (response.ok) {
        const formattedEntries = data.map(entry => {
          // ✅ AGORA: A imagem já vem como base64 formatado (data:image/jpeg;base64,...)
          const imageUrl = entry.image;

          const formattedEntry = {
            id: entry.id,
            date: new Date(entry.timestamp).toLocaleDateString('pt-BR'), 
            text: entry.text,
            image: imageUrl, // ✅ Já está no formato correto para React Native
            mood: {
              key: entry.mood_key,
              name: entry.mood_name,
              color: entry.mood_color || '#84a9da',
              icon: entry.mood_icon || 'help-outline',
            }
          };

          return formattedEntry;
        });
        
        console.log('🎯 Todas as entries formatadas:', formattedEntries);
        setEntries(formattedEntries);
      } else {
        Alert.alert('Erro', data.message || 'Não foi possível carregar as anotações do diário.');
        setEntries([]);
      }
    } catch (error) {
      console.error('❌ Erro de rede ao carregar entradas:', error);
      Alert.alert('Erro', 'Falha na conexão. Verifique o servidor Node.js e o IP.');
      setEntries([]);
    }
  }, []);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        console.log('👤 UserID do AsyncStorage:', storedUserId);
        if (storedUserId) {
          setUserId(storedUserId);
          loadEntries(storedUserId); 
        } else {
          console.warn('Usuário não logado. ID não encontrado no AsyncStorage.');
          navigation.navigate('Login');
        }
      } catch (e) {
        console.error('Erro ao buscar userId:', e);
      }
    };

    fetchUserId();
    
    const focusListener = navigation.addListener('focus', () => {
      console.log('🔄 Tela focada - recarregando entradas');
      if (userId) {
        loadEntries(userId);
      } else {
        fetchUserId(); 
      }
    });

    return focusListener;
  }, [navigation, userId, loadEntries]);

  const toggleExpand = (id) => {
    setExpandedEntryId(expandedEntryId === id ? null : id);
  };

  const renderMoodIcon = (entry) => {
    if (!entry.mood) {
      return null;
    }

    return (
      <View style={[styles.moodCircle, { backgroundColor: entry.mood.color || '#84a9da' }]}>
        <Ionicons 
          name={entry.mood.icon || 'help-outline'} 
          size={20} 
          color="#000" 
        />
      </View>
    );
  };

  const renderImage = (entry) => {
    if (!entry.image) {
      return null;
    }

    return (
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: entry.image }} 
          style={styles.entryImage}
          onError={(error) => {
            console.log('❌ ERRO ao carregar imagem:', error.nativeEvent.error);
          }}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={['#b9d2ff', '#d9e7ff', '#eaf3ff']} style={styles.background}>
        
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

        <View style={styles.mainContent}>
          
          <View style={styles.cardContainer}>
            <Text style={styles.cardTitle}>MINHAS ANOTAÇÕES</Text>
            
            <ScrollView 
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
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
                      {renderMoodIcon(entry)}
                    </View>

                    {expandedEntryId === entry.id && (
                      <View style={styles.entryDetails}>
                        <Text style={styles.entryText}>{entry.text}</Text>
                        {renderImage(entry)}
                      </View>
                    )}
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.noEntriesContainer}>
                  <Ionicons name="journal-outline" size={60} color="#84a9da" />
                  <Text style={styles.noEntriesTitle}>Nenhuma anotação</Text>
                  <Text style={styles.noEntriesText}>
                    Você ainda não fez nenhuma anotação no diário.{"\n"}
                    Clique no botão + para começar!
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>

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
  mainContent: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingVertical: screenWidth > 400 ? 25 : 20,
    paddingHorizontal: screenWidth > 400 ? 25 : 20,
    marginHorizontal: screenWidth > 400 ? 20 : 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    width: '90%',
    maxWidth: 500,
    maxHeight: screenHeight * 0.75,
  },
  cardTitle: {
    fontSize: screenWidth > 400 ? (screenWidth > 500 ? 26 : 24) : 20,
    fontWeight: 'bold',
    color: '#0e458c',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Bree-Serif',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 10,
  },
  entryContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: screenWidth > 400 ? 20 : 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#0c4793',
  },
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  entryDate: {
    fontSize: screenWidth > 400 ? 16 : 14,
    fontWeight: 'bold',
    color: '#0e458c',
    fontFamily: 'Bree-Serif',
  },
  moodCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  entryDetails: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(14, 69, 140, 0.1)',
    backgroundColor: '#cce0fb',
    borderRadius: 12,
    padding: 15,
  },
  entryText: {
    fontSize: screenWidth > 400 ? 15 : 13,
    color: '#333',
    fontFamily: 'Bree-Serif',
    lineHeight: 20,
    marginBottom: 15,
  },
  imageContainer: {
    marginTop: 10,
  },
  entryImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    resizeMode: 'cover',
    borderWidth: 2,
    borderColor: '#5691de',
    backgroundColor: '#f0f0f0',
  },
  noEntriesContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  noEntriesTitle: {
    fontSize: screenWidth > 400 ? 20 : 18,
    fontWeight: 'bold',
    color: '#0e458c',
    fontFamily: 'Bree-Serif',
    marginTop: 15,
    marginBottom: 10,
  },
  noEntriesText: {
    fontSize: screenWidth > 400 ? 14 : 13,
    color: '#666',
    fontFamily: 'Bree-Serif',
    textAlign: 'center',
    lineHeight: 20,
  },
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

export default RegistrosScreen;