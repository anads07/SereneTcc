import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const RegistrosScreen = ({ navigation }) => {
  const [expandedEntryId, setExpandedEntryId] = useState(null);
  const [entries, setEntries] = useState([]);

  // Buscar entradas do AsyncStorage
  const loadEntries = async () => {
    try {
      const existingEntries = await AsyncStorage.getItem('diaryEntries');
      if (existingEntries) {
        const entriesData = JSON.parse(existingEntries);
        setEntries(entriesData);
      }
    } catch (error) {
      console.log('Erro ao carregar entradas:', error);
    }
  };

  // Carregar entradas quando a tela for focada
  useEffect(() => {
    loadEntries();
    
    const focusListener = navigation.addListener('focus', () => {
      loadEntries();
    });

    return focusListener;
  }, [navigation]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleNewEntry = () => {
    navigation.navigate('DiarioScreen');
  };

  const toggleExpand = (id) => {
    setExpandedEntryId(expandedEntryId === id ? null : id);
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

        <View style={styles.mainContent}>
          
          {/* CARD PRINCIPAL */}
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
                    {/* Cabeçalho da Entrada */}
                    <View style={styles.entryHeader}>
                      <Text style={styles.entryDate}>{entry.date}</Text>
                      <View style={[styles.moodCircle, { backgroundColor: entry.mood.color }]}>
                        <Ionicons 
                          name={entry.mood.icon} 
                          size={20} 
                          color="#000" 
                        />
                      </View>
                    </View>

                    {/* Detalhes Expandidos */}
                    {expandedEntryId === entry.id && (
                      <View style={styles.entryDetails}>
                        <Text style={styles.entryText}>{entry.text}</Text>
                        
                        {/* Exibir imagem se existir */}
                        {entry.image && (
                          <View style={styles.imageContainer}>
                            <Image 
                              source={{ uri: entry.image }} 
                              style={styles.entryImage}
                            />
                          </View>
                        )}
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

        {/* BOTÃO FLUTUANTE PARA NOVA ENTRADA */}
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
  
  // HEADER
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

  // CARD PRINCIPAL
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

  // ENTRADA DO DIÁRIO
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
  },
  imageContainer: {
    marginTop: 15,
  },
  entryImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    resizeMode: 'cover',
    borderWidth: 2,
    borderColor: '#5691de',
  },

  // SEM ENTRADAS
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

  // MENU INFERIOR FLUTUANTE
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