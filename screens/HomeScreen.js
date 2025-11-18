import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
  Modal,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { PieChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height; 

const HOST_IP = '172.28.144.1'; 
const API_URL = `http://${HOST_IP}:3000`;

const profileImage = require('../assets/src/perfil.png'); 
const roboImage = require('../assets/src/robo.png'); 

const RespiracaoProfundaImage = require('../assets/src/RespiracaoProfunda.png');
const MeditacaoGuiadaImage = require('../assets/src/MeditacaoGuiada.png');
const LeituraRelaxanteImage = require('../assets/src/LeituraRelaxante.png');
const VisualizacaoPositivaImage = require('../assets/src/VisualizacaoPositiva.png');
const AlongamentoSuaveImage = require('../assets/src/AlongamentoSuave.png');
const MusicaRelaxanteImage = require('../assets/src/MusicaRelaxante.png');
const DiarioDeGratidaoImage = require('../assets/src/DiarioDeGratidao.png');
const CaminhadaMindfulImage = require('../assets/src/CaminhadaMindful.png');

const emotions = [
  { name: 'Feliz', key: 'happy', icon: 'happy-outline', color: '#FFF3B0' },
  { name: 'Triste', key: 'sad', icon: 'sad-outline', color: '#A7C7E7' },
  { name: 'Estressado', key: 'stressed', icon: 'flash-outline', color: '#F4A6A6' },
  { name: 'Calmo', key: 'calm', icon: 'leaf-outline', color: '#B5EAD7' },
  { name: 'Ansioso', key: 'anxious', icon: 'alert-circle-outline', color: '#C8B6E2' },
  { name: 'Confuso', key: 'confused', icon: 'help-circle-outline', color: '#FFD6A5' },
];

const todasRecomendacoes = [
  {
    title: 'Respiração Profunda',
    image: RespiracaoProfundaImage,
    objective: 'Reduz ansiedade, acalma o sistema nervoso e melhora foco.',
    descricao: '1. Sente-se ou deite-se confortável, mantendo a coluna ereta.\n2. Coloque uma mão no peito e outra no abdômen.\n3. Inspire pelo nariz contando até 4.\n4. Segure a respiração por 2 segundos.\n5. Expire lentamente pela boca contando até 6.\n6. Repita de 5 a 10 ciclos.\n7. Dica: traga atenção de volta à respiração se a mente divagar.',
  },
  {
    title: 'Meditação Guiada',
    image: MeditacaoGuiadaImage,
    objective: 'Acalma a mente, melhora foco e reduz estresse.',
    descricao: '1. Sente-se ou deite-se em local silencioso.\n2. Feche os olhos e respire profundamente 2–3 vezes.\n3. Concentre-se na respiração, observando o ar entrar e sair.\n4. Observe pensamentos sem se envolver.\n5. Mantenha postura ereta e relaxe ombros e mandíbula.\n6. Permaneça de 5 a 15 minutos.\n7. Use música suave ou app de meditação se desejar.',
  },
  {
    title: 'Leitura Relaxante',
    image: LeituraRelaxanteImage,
    objective: 'Oferece descanso mental e uma pausa criativa.',
    descricao: '1. Escolha um livro, revista ou texto leve.\n2. Sente-se mantendo boa postura.\n3. Desligue notificações para evitar distrações.\n4. Leia devagar, atentando-se ao significado.\n5. Reserve 10 a 20 minutos.\n6. Dica: ficção ou poesia ajudam a desacelerar a mente.',
  },
  {
    title: 'Visualização Positiva',
    image: VisualizacaoPositivaImage,
    objective: 'Reduz tensão mental, melhora humor e foco.',
    descricao: '1. Sente-se/deite-se em local calmo e respire 2–3 vezes.\n2. Feche os olhos e imagine um lugar seguro e relaxante.\n3. Explore cores, sons, cheiros e temperatura.\n4. Imagine-se interagindo e sentindo paz.\n5. Permaneça por 3 a 10 minutos.\n6. Use sons da natureza ou música relaxante.',
  },
  {
    title: 'Alongamento Suave',
    image: AlongamentoSuaveImage,
    objective: 'Reduz tensão muscular e melhora circulação.',
    descricao: '1. Posicione-se sentado(a) ou em pé com coluna ereta.\n2. Incline lentamente a cabeça para cada lado.\n3. Faça círculos lentos com os ombros e braços.\n4. Incline-se suavemente à frente e para trás.\n5. Mantenha cada posição 10–20 segundos.\n6. Movimentos suaves, sem forçar.',
  },
  {
    title: 'Música Relaxante',
    image: MusicaRelaxanteImage,
    objective: 'Alivia estresse e induz sensação de calma.',
    descricao: '1. Escolha música instrumental ou sons da natureza.\n2. Coloque fones e acomode-se confortavelmente.\n3. Respire lentamente acompanhando o ritmo.\n4. Foque em melodias, instrumentos e texturas.\n5. Ouça por 5 a 15 minutos.\n6. Combine com respiração profunda ou alongamentos.',
  },
  {
    title: 'Diário de Gratidão',
    image: DiarioDeGratidaoImage,
    objective: 'Melhora bem-estar emocional e foco no positivo.',
    descricao: '1. Pegue um caderno ou app de notas.\n2. Liste 3 a 5 coisas pelas quais é grato.\n3. Reflita brevemente sobre cada item.\n4. Evite julgamentos; registre apenas o positivo.\n5. Leve 5 a 10 minutos.\n6. Repita diariamente ou quando sentir estresse.',
  },
  {
    title: 'Caminhada Mindful',
    image: CaminhadaMindfulImage,
    objective: 'Relaxa corpo e mente, promove atenção plena.',
    descricao: '1. Escolha um local seguro e tranquilo.\n2. Dê passos lentos, sentindo o contato dos pés com o chão.\n3. Respire profundamente, notando o ar entrar e sair.\n4. Observe sounds, colors e aromas sem julgar.\n5. Caminhe por 5 a 15 minutos.\n6. Evite usar o celular durante a prática.',
  },
];

const emotionRecommendations = {
  happy: ['Leitura Relaxante', 'Diário de Gratidão', 'Caminhada Mindful', 'Música Relaxante'],
  sad: ['Leitura Relaxante', 'Diário de Gratidão', 'Visualização Positiva', 'Música Relaxante'],
  stressed: ['Respiração Profunda', 'Meditação Guiada', 'Alongamento Suave', 'Música Relaxante'],
  calm: ['Leitura Relaxante', 'Caminhada Mindful', 'Meditação Guiada', 'Diário de Gratidão'],
  anxious: ['Respiração Profunda', 'Meditação Guiada', 'Visualização Positiva', 'Música Relaxante'],
  confused: ['Meditação Guiada', 'Visualização Positiva', 'Leitura Relaxante', 'Caminhada Mindful'],
};

const getRecommendation = (emotionKey) => {
  const recommendations = emotionRecommendations[emotionKey];
  if (recommendations && recommendations.length > 0) {
    const randomTech = recommendations[Math.floor(Math.random() * recommendations.length)];
    return todasRecomendacoes.find(tech => tech.title === randomTech) || todasRecomendacoes[0];
  }
  return todasRecomendacoes[0];
};

const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false 
};

const HomeScreen = ({ navigation }) => {
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTechnique, setSelectedTechnique] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [userId, setUserId] = useState(null); 
  const [lastEmotion, setLastEmotion] = useState(null);
  const [currentRecommendation, setCurrentRecommendation] = useState(null);

  const getUserId = async () => {
    try {
      const id = await AsyncStorage.getItem('userId');
      if (id) {
        const userIdNum = Number(id);
        setUserId(userIdNum);
        return userIdNum;
      }
      console.warn('ID do usuário não encontrado no AsyncStorage.');
      return null;
    } catch (e) {
      console.error('Erro ao buscar ID do usuário:', e);
      return null;
    }
  };

  // Carregar última emoção registrada
  const loadLastEmotion = useCallback(async (currentUserId) => {
    try {
      console.log(`🔍 Buscando última emoção para o usuário ${currentUserId}...`);
      const response = await fetch(`${API_URL}/api/recent-moods/${currentUserId}`);
      
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      
      const recentMoods = await response.json();
      
      if (recentMoods.length > 0) {
        const lastMood = recentMoods[0]; // A primeira é a mais recente
        const emotion = emotions.find(e => e.key === lastMood.mood_key);
        
        if (emotion) {
          setLastEmotion(emotion);
          const recommendation = getRecommendation(emotion.key);
          setCurrentRecommendation(recommendation);
          console.log(`✅ Última emoção: ${emotion.name} - Recomendação: ${recommendation.title}`);
        }
      } else {
        setLastEmotion(null);
        setCurrentRecommendation(null);
        console.log('ℹ️ Nenhuma emoção registrada ainda');
      }
      
    } catch (error) {
      console.error('❌ Erro ao carregar última emoção:', error);
      setLastEmotion(null);
      setCurrentRecommendation(null);
    }
  }, []);

  // Carregar dados do gráfico
  const loadChartData = useCallback(async () => {
    const currentUserId = await getUserId();
    
    if (!currentUserId) {
        setChartData(getInitialChartData());
        return;
    }

    try {
      console.log(`🔍 Buscando dados do diário para o usuário ${currentUserId}...`);
      const response = await fetch(`${API_URL}/api/diary/${currentUserId}`);
      
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      
      const diaryEntries = await response.json();
      
      const stats = diaryEntries.reduce((acc, entry) => {
        const moodKey = entry.mood_key;
        acc[moodKey] = (acc[moodKey] || 0) + 1;
        return acc;
      }, {});

      const formattedData = emotions.map(emotion => ({
        name: emotion.name,
        count: stats[emotion.key] || 0,
        color: emotion.color,
        legendFontColor: '#7F7F7F',
        legendFontSize: screenWidth > 400 ? 14 : 10,
      }));
      
      setChartData(formattedData);
      
    } catch (error) {
      console.error('❌ Erro ao carregar dados do gráfico da API:', error);
      Alert.alert('Erro de Conexão', 'Não foi possível carregar os registros de humor do servidor. Verifique sua conexão ou o servidor.', [{ text: 'OK' }]);
      setChartData(getInitialChartData());
    }
  }, []);

  const getInitialChartData = () => {
      return emotions.map(emotion => ({
          name: emotion.name,
          count: 0,
          color: emotion.color,
          legendFontColor: '#7F7F7F',
          legendFontSize: screenWidth > 400 ? 14 : 10,
      }));
  }

  // Carregar todos os dados
  useEffect(() => {
    const loadAllData = async () => {
      const currentUserId = await getUserId();
      if (currentUserId) {
        await loadChartData();
        await loadLastEmotion(currentUserId);
      }
    };

    loadAllData();
    
    const focusListener = navigation.addListener('focus', loadAllData);

    return () => navigation.removeListener('focus', focusListener);
  }, [navigation, loadChartData, loadLastEmotion]);

  const handleEmotionSelect = (emotion) => {
    setSelectedEmotion(emotion);
    navigation.navigate('DiarioScreen', { 
        initialEmotion: emotion.key, 
        emotionName: emotion.name
    });
  };

  const handleRecommendationPress = () => {
    if (lastEmotion && currentRecommendation) {
      setSelectedTechnique(currentRecommendation);
      setModalVisible(true);
    }
  };

  // Texto da recomendação baseado na última emoção
  const getRecommendationText = () => {
    if (!lastEmotion || !currentRecommendation) {
      return 'REGISTRE SUA PRIMEIRA EMOÇÃO PARA VER UMA RECOMENDAÇÃO PERSONALIZADA';
    }
    
    return `BASEADO NA SUA ÚLTIMA EMOÇÃO (${lastEmotion.name.toUpperCase()})\n${currentRecommendation.title}`;
  };

  const RecommendationModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{selectedTechnique?.title}</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.techniqueImageContainer}>
              <Image 
                source={selectedTechnique?.image} 
                style={[styles.techniqueImage, { tintColor: 'white' }]}
              />
            </View>
            
            <View style={styles.objectiveSection}>
              <Text style={styles.objectiveTitle}>Objetivo</Text>
              <Text style={styles.objectiveText}>{selectedTechnique?.objective}</Text>
            </View>
            
            <View style={styles.descriptionSection}>
              <Text style={styles.descriptionTitle}>Como Fazer</Text>
              <Text style={styles.descriptionText}>{selectedTechnique?.descricao}</Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#b9d2ff', '#d9e7ff', '#eaf3ff']} 
        style={styles.background}
      >
        <View style={styles.header}>
          <Text style={styles.title}>SERENE</Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate('PerfilScreen')} 
            style={styles.profileButton}
          >
            <Image 
                source={profileImage}
                style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.mainContent}>
          <ScrollView 
            style={styles.scrollView} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            
            <View style={styles.emotionSection}>
              <Text style={styles.emotionQuestion}>COMO ESTÁ SENDO O SEU DIA?</Text>
              
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.moodScrollContainer}
                contentContainerStyle={styles.moodScrollContent}
              >
                {emotions.map((mood) => (
                  <TouchableOpacity
                    key={mood.name}
                    style={[
                      styles.moodButton,
                      selectedEmotion?.name === mood.name && { backgroundColor: mood.color }
                    ]}
                    onPress={() => handleEmotionSelect(mood)}
                  >
                    <Ionicons
                      name={mood.icon}
                      size={screenWidth > 400 ? 26 : screenWidth > 500 ? 30 : 22}
                      color={selectedEmotion?.name === mood.name ? '#000' : '#31356e'} 
                    />
                    <Text style={[
                      styles.moodText,
                      selectedEmotion?.name === mood.name ? { 
                        color: '#000', 
                        fontWeight: 'bold' 
                      } : {
                        color: '#31356e',
                        fontWeight: 'bold' 
                      }
                    ]}>
                      {mood.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>MEUS REGISTROS</Text>
              
              <View style={styles.chartInnerContainer}>
                {chartData.length > 0 && chartData.some(item => item.count > 0) ? (
                  <PieChart
                    data={chartData}
                    width={screenWidth > 400 ? screenWidth * 0.8 : screenWidth * 0.85}
                    height={screenWidth > 400 ? 220 : screenWidth > 500 ? 250 : 180}
                    chartConfig={chartConfig}
                    accessor={"count"}
                    backgroundColor={"transparent"}
                    paddingLeft={screenWidth > 400 ? "15" : "8"}
                    center={[screenWidth > 400 ? 10 : 5, 0]}
                    hasLegend={true}
                  />
                ) : (
                  <View style={styles.emptyChartContainer}>
                    <Ionicons name="stats-chart-outline" size={50} color="#ccc" />
                    <Text style={styles.emptyChartText}>
                      Nenhum registro ainda{'\n'}
                      <Text style={styles.emptyChartSubtext}>
                        Comece registrando suas emoções no diário!
                      </Text>
                    </Text>
                  </View>
                )}
              </View>
              
              <TouchableOpacity 
                style={styles.viewNotesButton}
                onPress={() => navigation.navigate('RegistrosScreen')}
              >
                <LinearGradient
                  colors={['#0e458c', '#1a5bb5']}
                  style={styles.viewNotesGradient}
                >
                  <Text style={styles.viewNotesText}>VER MINHAS ANOTAÇÕES</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={[
                styles.recommendationContainer,
                !lastEmotion && styles.recommendationContainerDisabled
              ]}
              onPress={handleRecommendationPress}
              disabled={!lastEmotion}
            >
              <View style={styles.recommendationHeader}>
                <Text style={styles.recommendationTitle}>RECOMENDAÇÃO DO DIA</Text>
              </View>
              <View style={styles.recommendationContent}>
                <View style={styles.recommendationImageContainer}>
                  {lastEmotion ? (
                    <Image 
                      source={currentRecommendation?.image} 
                      style={[styles.recommendationIcon, { tintColor: 'white' }]}
                    />
                  ) : (
                    <Ionicons name="heart-outline" size={screenWidth > 400 ? 40 : 35} color="white" />
                  )}
                </View>
                <View style={styles.recommendationTextContainer}>
                  <Text style={styles.recommendationSubtitle}>
                    {getRecommendationText()}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            <View style={styles.bottomSpacer} />
          </ScrollView>
        </View>
        
        <View style={styles.floatingMenuContainer}>
          <TouchableOpacity 
            style={styles.floatingMenuButton}
            onPress={() => navigation.navigate('ChatScreen')} 
          >
            <Image 
                source={roboImage}
                style={styles.floatingMenuIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.floatingMenuButton}
            onPress={() => navigation.navigate('DiarioScreen')} 
          >
            <Ionicons name="add-outline" size={screenWidth > 400 ? 32 : screenWidth > 500 ? 36 : 28} color="#0e458c" />
          </TouchableOpacity>
        </View>

        <RecommendationModal />
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
  mainContent: {
    flex: 1,
    height: Dimensions.get('window').height - 140,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
    alignItems: 'center',
  },
  bottomSpacer: {
    height: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: screenWidth > 400 ? 15 : 10,
    paddingBottom: screenWidth > 400 ? 10 : 5,
    width: '100%',
    paddingHorizontal: screenWidth > 400 ? 25 : 20,
  },
  title: {
    fontSize: screenWidth > 400 ? screenWidth > 500 ? 44 : 40 : 32,
    fontWeight: 'bold',
    color: 'white',
  },
  profileButton: {
    padding: 5,
  },
  profileImage: {
    width: screenWidth > 400 ? screenWidth > 500 ? 60 : 55 : 45,
    height: screenWidth > 400 ? screenWidth > 500 ? 60 : 55 : 45,
    resizeMode: 'contain',
    tintColor: 'white',
  },
  emotionSection: {
    paddingHorizontal: screenWidth > 400 ? 20 : 15,
    paddingTop: screenWidth > 400 ? 10 : 5,
    paddingBottom: screenWidth > 400 ? 15 : 10,
    width: '100%',
  },
  emotionQuestion: {
    fontSize: screenWidth > 400 ? screenWidth > 500 ? 26 : 24 : 18,
    fontWeight: 'bold',
    color: '#0c4793',
    textAlign: 'center',
    marginBottom: screenWidth > 400 ? 20 : 15,
  },
  moodScrollContainer: {
    width: '100%',
  },
  moodScrollContent: {
    paddingHorizontal: 5,
  },
  moodButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: screenWidth > 400 ? 12 : 8,
    paddingHorizontal: screenWidth > 400 ? 12 : 8,
    borderRadius: screenWidth > 400 ? 16 : 14,
    minWidth: screenWidth > 400 ? 70 : 60,
    marginHorizontal: 4,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  moodText: {
    fontSize: screenWidth > 400 ? screenWidth > 500 ? 11 : 10 : 8,
    marginTop: screenWidth > 400 ? 6 : 4,
    color: '#666',
    fontWeight: '600',
    textAlign: 'center',
  },
  chartContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: screenWidth > 400 ? 25 : 20,
    paddingVertical: screenWidth > 400 ? 25 : 20,
    alignItems: 'center',
    marginVertical: screenWidth > 400 ? 15 : 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: screenWidth > 400 ? 5 : 4 },
    shadowOpacity: 0.1,
    shadowRadius: screenWidth > 400 ? 6 : 5,
    elevation: screenWidth > 400 ? 6 : 5,
    width: '90%',
    maxWidth: 450,
  },
  chartTitle: {
    fontSize: screenWidth > 400 ? screenWidth > 500 ? 26 : 24 : 18,
    fontWeight: 'bold',
    color: '#0e458c',
    textAlign: 'center',
    marginBottom: screenWidth > 400 ? 15 : 10,
  },
  chartInnerContainer: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  emptyChartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    height: screenWidth > 400 ? 220 : 180,
  },
  emptyChartText: {
    fontSize: screenWidth > 400 ? 16 : 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
  emptyChartSubtext: {
    fontSize: screenWidth > 400 ? 14 : 12,
    color: '#999',
  },
  viewNotesButton: {
    alignSelf: 'center',
    marginTop: screenWidth > 400 ? 15 : 10,
    borderRadius: 25,
    overflow: 'hidden',
    width: '80%',
    maxWidth: 300,
  },
  viewNotesGradient: {
    paddingVertical: screenWidth > 400 ? 12 : 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewNotesText: {
    color: 'white',
    fontSize: screenWidth > 400 ? screenWidth > 500 ? 16 : 15 : 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  recommendationContainer: {
    backgroundColor: '#84a9da',
    borderRadius: 35,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: screenWidth > 400 ? 5 : 4 },
    shadowOpacity: 0.15,
    shadowRadius: screenWidth > 400 ? 6 : 5,
    elevation: 8,
    marginVertical: screenWidth > 400 ? 15 : 10,
    width: '90%',
    maxWidth: 450,
    borderWidth: 1,
    borderColor: 'rgba(14, 69, 140, 0.3)',
    padding: screenWidth > 400 ? 8 : 4,
    paddingVertical: screenWidth > 400 ? 8 : 6
  },
  recommendationContainerDisabled: {
    opacity: 0.7,
  },
  recommendationHeader: {
    marginBottom: 8,
    alignItems: 'center',
  },
  recommendationTitle: {
    fontSize: screenWidth > 400 ? screenWidth > 500 ? 22 : 20 : 18,
    fontWeight: 'bold',
    color: 'white',
    textTransform: 'uppercase',
  },
  recommendationContent: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    minHeight: 0,
  },
  recommendationTextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  recommendationSubtitle: {
    fontSize: screenWidth > 400 ? screenWidth > 500 ? 16 : 15 : 13,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    textTransform: 'uppercase',
    lineHeight: 18,
  },
  recommendationImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 0,
    marginLeft: 20,
  },
  recommendationIcon: {
    width: screenWidth > 400 ? screenWidth > 500 ? 45 : 40 : 35,
    height: screenWidth > 400 ? screenWidth > 500 ? 45 : 40 : 35,
    resizeMode: 'contain',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#84a9da',
    borderRadius: 20,
    width: '90%',
    maxWidth: 500,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 2,
    borderColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 2,
    borderBottomColor: 'white',
  },
  modalTitle: {
    fontSize: screenWidth > 400 ? 22 : 20,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
  },
  closeButton: {
    padding: 5,
  },
  modalContent: {
    flex: 1,
  },
  techniqueImageContainer: {
    alignItems: 'center',
    padding: 20,
  },
  techniqueImage: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  objectiveSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'white',
  },
  objectiveTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  objectiveText: {
    fontSize: 16,
    color: 'white',
    lineHeight: 22,
  },
  descriptionSection: {
    padding: 20,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: 'white',
    lineHeight: 22,
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
    width: screenWidth > 400 ? screenWidth > 500 ? 70 : 65 : 50,
    height: screenWidth > 400 ? screenWidth > 500 ? 70 : 65 : 50,
    borderRadius: screenWidth > 400 ? 35 : 25,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: screenWidth > 400 ? 5 : 4 },
    shadowOpacity: 0.25,
    shadowRadius: screenWidth > 400 ? 7 : 5,
    elevation: 10,
    borderWidth: screenWidth > 400 ? 4 : 3,
    borderColor: 'rgba(170, 199, 255, 0.8)',
  },
  floatingMenuIcon: {
    width: screenWidth > 400 ? screenWidth > 500 ? 45 : 40 : 30,
    height: screenWidth > 400 ? screenWidth > 500 ? 45 : 40 : 30,
    resizeMode: 'contain',
    tintColor: '#0e458c',
  },
});

export default HomeScreen;