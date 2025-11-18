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

// constantes de layout
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height; 

// configuração da api
const HOST_IP = ' 172.20.112.1'; 
const API_URL = `http://${HOST_IP}:3000`;

// importação de imagens estáticas
const profileImage = require('../assets/src/perfil.png'); 
const roboImage = require('../assets/src/robo.png'); 

const respiracaoProfundaImage = require('../assets/src/RespiracaoProfunda.png');
const meditacaoGuiadaImage = require('../assets/src/MeditacaoGuiada.png');
const leituraRelaxanteImage = require('../assets/src/LeituraRelaxante.png');
const visualizacaoPositivaImage = require('../assets/src/VisualizacaoPositiva.png');
const alongamentoSuaveImage = require('../assets/src/AlongamentoSuave.png');
const musicaRelaxanteImage = require('../assets/src/MusicaRelaxante.png');
const diarioDeGratidaoImage = require('../assets/src/DiarioDeGratidao.png');
const caminhadaMindfulImage = require('../assets/src/CaminhadaMindful.png');
const banhoRelaxanteImage = require('../assets/src/BanhoRelaxante.png');
const tecnica54321Image = require('../assets/src/Tecnica54321.png');
const relaxamentoMuscularProgressivoImage = require('../assets/src/RelaxamentoMuscularProgressivo.png');
const aromaterapiaSimplesImage = require('../assets/src/AromaterapiaSimples.png');
const escritaLivreImage = require('../assets/src/EscritaLivre.png');
const observacaoDaNaturezaImage = require('../assets/src/ObservacaoDaNatureza.png');
const tecnicaDeRespiracao478Image = require('../assets/src/TecnicaDeRespiracao478.png');
const yogaSimplesImage = require('../assets/src/YogaSimples.png');
const pinturaOuDesenhoLivreImage = require('../assets/src/PinturaOuDesenhoLivre.png');
const contagemParaAcalmarImage = require('../assets/src/ContagemParaAcalmar.png');
const miniPausaDigitalImage = require('../assets/src/MiniPausaDigital.png');
const observacaoDeSensacoesCorporaisImage = require('../assets/src/ObservacaoDeSensacoesCorporais.png');

// dados de emoções
const emotions = [
  { name: 'feliz', key: 'happy', icon: 'happy-outline', color: '#FFF3B0' },
  { name: 'triste', key: 'sad', icon: 'sad-outline', color: '#A7C7E7' },
  { name: 'estressado', key: 'stressed', icon: 'flash-outline', color: '#F4A6A6' },
  { name: 'calmo', key: 'calm', icon: 'leaf-outline', color: '#B5EAD7' },
  { name: 'ansioso', key: 'anxious', icon: 'alert-circle-outline', color: '#C8B6E2' },
  { name: 'confuso', key: 'confused', icon: 'help-circle-outline', color: '#FFD6A5' },
];

// lista de todas as recomendações de técnicas
const todasRecomendacoes = [
  {
    title: 'respiração profunda',
    image: respiracaoProfundaImage,
    objective: 'reduz ansiedade, acalma o sistema nervoso e melhora foco.',
    descricao: '1. sente-se ou deite-se confortável, mantendo a coluna ereta.\n2. coloque uma mão no peito e outra no abdômen.\n3. inspire pelo nariz contando até 4.\n4. segure a respiração por 2 segundos.\n5. expire lentamente pela boca contando até 6.\n6. repita de 5 a 10 ciclos.\n7. dica: traga atenção de volta à respiração se a mente divagar.',
  },
  {
    title: 'meditação guiada',
    image: meditacaoGuiadaImage,
    objective: 'acalma a mente, melhora foco e reduz estresse.',
    descricao: '1. sente-se ou deite-se em local silencioso.\n2. feche os olhos e respire profundamente 2–3 vezes.\n3. concentre-se na respiração, observando o ar entrar e sair.\n4. observe pensamentos sem se envolver.\n5. mantenha postura ereta e relaxe ombros e mandíbula.\n6. permaneça de 5 a 15 minutos.\n7. use música suave ou app de meditação se desejar.',
  },
  {
    title: 'leitura relaxante',
    image: leituraRelaxanteImage,
    objective: 'oferece descanso mental e uma pausa criativa.',
    descricao: '1. escolha um livro, revista ou texto leve.\n2. sente-se mantendo boa postura.\n3. desligue notificações para evitar distrações.\n4. leia devagar, atentando-se ao significado.\n5. reserve 10 a 20 minutos.\n6. dica: ficção ou poesia ajudam a desacelerar a mente.',
  },
  {
    title: 'visualização positiva',
    image: visualizacaoPositivaImage,
    objective: 'reduz tensão mental, melhora humor e foco.',
    descricao: '1. sente-se/deite-se em local calmo e respire 2–3 vezes.\n2. feche os olhos e imagine um lugar seguro e relaxante.\n3. explore cores, sons, cheiros e temperatura.\n4. imagine-se interagindo e sentindo paz.\n5. permaneça por 3 a 10 minutos.\n6. use sons da natureza ou música relaxante.',
  },
  {
    title: 'alongamento suave',
    image: alongamentoSuaveImage,
    objective: 'reduz tensão muscular e melhora circulação.',
    descricao: '1. posicione-se sentado(a) ou em pé com coluna ereta.\n2. incline lentamente a cabeça para cada lado.\n3. faça círculos lentos com os ombros e braços.\n4. incline-se suavemente à frente e para trás.\n5. mantenha cada posição 10–20 segundos.\n6. movimentos suaves, sem forçar.',
  },
  {
    title: 'música relaxante',
    image: musicaRelaxanteImage,
    objective: 'alivia estresse e induz sensação de calma.',
    descricao: '1. escolha música instrumental ou sons da natureza.\n2. coloque fones e acomode-se confortavelmente.\n3. respire lentamente acompanhando o ritmo.\n4. foque em melodias, instrumentos e texturas.\n5. ouça por 5 a 15 minutos.\n6. combine com respiração profunda ou alongamentos.',
  },
  {
    title: 'diário de gratidão',
    image: diarioDeGratidaoImage,
    objective: 'melhora bem-estar emocional e foco no positivo.',
    descricao: '1. pegue um caderno ou app de notas.\n2. liste 3 a 5 coisas pelas quais é grato.\n3. reflita brevemente sobre cada item.\n4. evite julgamentos; registre apenas o positivo.\n5. leve 5 a 10 minutos.\n6. repita diariamente ou quando sentir estresse.',
  },
  {
    title: 'caminhada mindful',
    image: caminhadaMindfulImage,
    objective: 'relaxa corpo e mente, promove atenção plena.',
    descricao: '1. escolha um local seguro e tranquilo.\n2. dê passos lentos, sentindo o contato dos pés com o chão.\n3. respire profundamente, notando o ar entrar e sair.\n4. observe sounds, colors e aromas sem julgar.\n5. caminhe por 5 a 15 minutos.\n6. evite usar o celular durante a prática.',
  },
  {
    title: 'banho relaxante',
    image: banhoRelaxanteImage,
    objective: 'alivia tensão física e mental.',
    descricao: '1. prepare um banho morno em ambiente tranquilo.\n2. concentre-se na sensação da água na pele.\n3. respire profundamente, liberando tensões.\n4. permaneça 5 a 20 minutos.\n5. use sabonetes aromáticos, velas ou óleos essenciais.',
  },
  {
    title: 'técnica 5-4-3-2-1',
    image: tecnica54321Image,
    objective: 'reduz ansiedade, aumenta foco no presente.',
    descricao: '1. observe 5 coisas visíveis.\n2. note 4 coisas que consegue tocar.\n3. ouça 3 sons ao redor.\n4. identifique 2 cheiros próximos.\n5. concentre-se em 1 sabor ou sensação corporal.\n6. use em momentos de ansiedade ou estresse.',
  },
  {
    title: 'relaxamento muscular progressivo',
    image: relaxamentoMuscularProgressivoImage,
    objective: 'reduz tensão muscular e alivia estresse.',
    descricao: '1. deite-se ou sente-se confortavelmente.\n2. contraia pés por 5s e relaxe.\n3. suba por pernas, glúteos, abdômen e costas.\n4. prossiga com braços, mãos, pescoço e rosto.\n5. respire lenta e profundamente durante todo o processo.\n6. foque na diferença entre tensão e relaxamento.',
  },
  {
    title: 'aromaterapia simples',
    image: aromaterapiaSimplesImage,
    objective: 'estimula relaxamento através do olfato.',
    descricao: '1. escolha aroma relaxante (lavanda, camomila, hortelã).\n2. acenda vela, use difusor ou inalador.\n3. sente-se confortavelmente e respire fundo.\n4. concentre-se na sensação de calma.\n5. permaneça 5 a 10 minutos.\n6. evite aromas que causem desconforto.',
  },
  {
    title: 'escrita livre',
    image: escritaLivreImage,
    objective: 'libera pensamentos e emoções, proporcionando clareza mental.',
    descricao: '1. pegue papel e caneta ou app de notas.\n2. escreva sem regras gramaticais.\n3. registre pensamentos, sentimentos ou fatos do dia.\n4. continue por 5 a 10 minutos.\n5. releia apenas se desejar, sem julgamentos.',
  },
  {
    title: 'observação da natureza',
    image: observacaoDaNaturezaImage,
    objective: 'reduz estresse e aumenta sensação de bem-estar.',
    descricao: '1. sente-se perto de uma janela, jardim ou parque.\n2. observe árvores, pássaros, nuvens e flores.\n3. respire profundamente, percebendo o ambiente.\n4. permaneça 5 a 15 minutos.\n5. note detalhes geralmente despercebidos.',
  },
  {
    title: 'técnica de respiração 4-7-8',
    image: tecnicaDeRespiracao478Image,
    objective: 'acalma o sistema nervoso rapidamente.',
    descricao: '1. sente-se ou deite-se com coluna ereta.\n2. inspire pelo nariz contando até 4.\n3. segure a respiração contando até 7.\n4. expire pela boca contando até 8.\n5. repita 4 ciclos.\n6. ideal antes de dormir ou em picos de ansiedade.',
  },
  {
    title: 'yoga simples',
    image: yogaSimplesImage,
    objective: 'relaxa corpo e mente, melhora postura e flexibilidade.',
    descricao: '1. separe um tapete e vista roupas confortáveis.\n2. escolha posturas simples.\n3. sincronize movimento com respiração profunda.\n4. mantenha cada postura 20–30s.\n5. pratique 10 a 20 minutos.\n6. movimente-se sem dor e sem pressa.',
  },
  {
    title: 'pintura ou desenho livre',
    image: pinturaOuDesenhoLivreImage,
    objective: 'expressa emoções e reduz tensão mental.',
    descricao: '1. separe papel, lápis, canetas ou tintas.\n2. desenhe/pinte sem buscar perfeição.\n3. foque em cores, formas e movimentos.\n4. crie 10 a 20 minutos.\n5. ouça música calma para ampliar criatividade.',
  },
  {
    title: 'contagem para acalmar',
    image: contagemParaAcalmarImage,
    objective: 'reduz ansiedade e pensamentos acelerados.',
    descricao: '1. sente-se ou deite-se confortavelmente.\n2. inspire profundamente e conte mentalmente até 10.\n3. expire devagar e recomece.\n4. mantenha 2 a 5 minutos.\n5. associe com respiração profunda para efeito maior.',
  },
  {
    title: 'mini-pausa digital',
    image: miniPausaDigitalImage,
    objective: 'reduz sobrecarga mental de telas e notificações.',
    descricao: '1. afaste-se de celular, computador e tv.\n2. sente-se ou caminhe em silêncio, respirando profundamente.\n3. observe ambiente, sons e sensações.\n4. fique 5 a 10 minutos desconectado.\n5. desative notificações temporariamente.',
  },
  {
    title: 'observação de sensações corporais',
    image: observacaoDeSensacoesCorporaisImage,
    objective: 'desenvolve atenção plena e relaxamento profundo.',
    descricao: '1. deite-se ou sente-se e feche os olhos.\n2. faça um scan corporal da cabeça aos pés.\n3. identifique áreas de tensão e relaxe.\n4. respire profundamente durante todo o exercício.\n5. pratique 5 a 10 minutos.\n6. combine com música suave ou respiração profunda.',
  },
];

// mapeamento de recomendações por emoção
const emotionRecommendations = {
  happy: [
    'diário de gratidão',
    'caminhada mindful',
    'leitura relaxante',
    'pintura ou desenho livre',
    'observação da natureza',
    'música relaxante',
  ], 
  sad: [
    'escrita livre',
    'visualização positiva',
    'banho relaxante',
    'música relaxante',
    'alongamento suave',
    'diário de gratidão',
    'pintura ou desenho livre',
  ], 
  stressed: [
    'respiração profunda',
    'meditação guiada',
    'relaxamento muscular progressivo',
    'aromaterapia simples',
    'yoga simples',
    'observação da natureza',
    'mini-pausa digital',
    'leitura relaxante',
  ], 
  calm: [
    'meditação guiada',
    'observação de sensações corporais',
    'caminhada mindful',
    'diário de gratidão',
    'leitura relaxante',
    'aromaterapia simples',
  ], 
  anxious: [
    'técnica 5-4-3-2-1',
    'técnica de respiração 4-7-8',
    'respiração profunda',
    'contagem para acalmar',
    'relaxamento muscular progressivo',
    'meditação guiada',
    'banho relaxante',
    'mini-pausa digital',
  ], 
  confused: [
    'escrita livre',
    'meditação guiada',
    'caminhada mindful',
    'visualização positiva',
    'leitura relaxante',
    'mini-pausa digital',
    'observação da natureza',
  ], 
};

// função para obter uma recomendação aleatória
const getRecommendation = (emotionKey) => {
  const recommendations = emotionRecommendations[emotionKey];
  if (recommendations && recommendations.length > 0) {
    const randomTech = recommendations[Math.floor(Math.random() * recommendations.length)];
    return todasRecomendacoes.find(tech => tech.title === randomTech) || todasRecomendacoes[0];
  }
  return todasRecomendacoes[0];
};

// configuração do gráfico
const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false 
};

// componente principal
const HomeScreen = ({ navigation }) => {
  // estados
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTechnique, setSelectedTechnique] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [userId, setUserId] = useState(null); 
  const [lastEmotion, setLastEmotion] = useState(null);
  const [currentRecommendation, setCurrentRecommendation] = useState(null);

  // funções de carregamento de dados

  // busca o id do usuário no asyncstorage
  const getUserId = async () => {
    try {
      const id = await AsyncStorage.getItem('userId');
      if (id) {
        const userIdNum = Number(id);
        setUserId(userIdNum);
        return userIdNum;
      }
      console.warn('id do usuário não encontrado no asyncstorage.');
      return null;
    } catch (e) {
      console.error('erro ao buscar id do usuário:', e);
      return null;
    }
  };

  // carrega última emoção registrada e gera recomendação
  const loadLastEmotion = useCallback(async (currentUserId) => {
    try {
      console.log(`🔍 buscando última emoção para o usuário ${currentUserId}...`);
      const response = await fetch(`${API_URL}/api/recent-moods/${currentUserId}`);
      
      if (!response.ok) {
        throw new Error(`erro http: ${response.status}`);
      }
      
      const recentMoods = await response.json();
      
      if (recentMoods.length > 0) {
        const lastMood = recentMoods[0]; // a primeira é a mais recente
        const emotion = emotions.find(e => e.key === lastMood.mood_key);
        
        if (emotion) {
          setLastEmotion(emotion);
          const recommendation = getRecommendation(emotion.key);
          setCurrentRecommendation(recommendation);
          console.log(`✅ última emoção: ${emotion.name} - recomendação: ${recommendation.title}`);
        }
      } else {
        setLastEmotion(null);
        setCurrentRecommendation(null);
        console.log('ℹ️ nenhuma emoção registrada ainda');
      }
      
    } catch (error) {
      console.error('❌ erro ao carregar última emoção:', error);
      setLastEmotion(null);
      setCurrentRecommendation(null);
    }
  }, []);

  // carrega dados para o gráfico de pizza
  const loadChartData = useCallback(async () => {
    const currentUserId = await getUserId();
    
    if (!currentUserId) {
        setChartData(getInitialChartData());
        return;
    }

    try {
      console.log(`🔍 buscando dados do diário para o usuário ${currentUserId}...`);
      const response = await fetch(`${API_URL}/api/diary/${currentUserId}`);
      
      if (!response.ok) {
        throw new Error(`erro http: ${response.status}`);
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
      console.error('❌ erro ao carregar dados do gráfico da api:', error);
      Alert.alert('erro de conexão', 'não foi possível carregar os registros de humor do servidor. verifique sua conexão ou o servidor.', [{ text: 'ok' }]);
      setChartData(getInitialChartData());
    }
  }, []);

  // dados iniciais para o gráfico (todos zerados)
  const getInitialChartData = () => {
      return emotions.map(emotion => ({
          name: emotion.name,
          count: 0,
          color: emotion.color,
          legendFontColor: '#7F7F7F',
          legendFontSize: screenWidth > 400 ? 14 : 10,
      }));
  }

  // useeffect: carregamento inicial e ao focar na tela
  useEffect(() => {
    const loadAllData = async () => {
      const currentUserId = await getUserId();
      if (currentUserId) {
        await loadChartData();
        await loadLastEmotion(currentUserId);
      }
    };

    loadAllData();
    
    // recarrega os dados toda vez que a tela recebe o foco
    const focusListener = navigation.addListener('focus', loadAllData);

    return () => navigation.removeListener('focus', focusListener);
  }, [navigation, loadChartData, loadLastEmotion]);

  // handlers de interação

  // lida com a seleção de uma emoção (navega para a tela de diário)
  const handleEmotionSelect = (emotion) => {
    setSelectedEmotion(emotion);
    navigation.navigate('DiarioScreen', { 
        initialEmotion: emotion.key, 
        emotionName: emotion.name
    });
  };

  // abre o modal de recomendação
  const handleRecommendationPress = () => {
    if (lastEmotion && currentRecommendation) {
      setSelectedTechnique(currentRecommendation);
      setModalVisible(true);
    }
  };

  // texto da recomendação
  const getRecommendationText = () => {
    if (!lastEmotion || !currentRecommendation) {
      return 'registre sua primeira emoção para ver uma recomendação personalizada';
    }
    
    // retorna o título da técnica em letras maiúsculas para o card (estilo visual)
    return currentRecommendation.title.toUpperCase();
  };

  // modal de recomendação
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
              <Text style={styles.objectiveTitle}>objetivo</Text>
              <Text style={styles.objectiveText}>{selectedTechnique?.objective}</Text>
            </View>
            
            <View style={styles.descriptionSection}>
              <Text style={styles.descriptionTitle}>como fazer</Text>
              <Text style={styles.descriptionText}>{selectedTechnique?.descricao}</Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  // renderização principal
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
              <Text style={styles.emotionQuestion}>como está sendo o seu dia?</Text>
              
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
              <Text style={styles.chartTitle}>meus registros</Text>
              
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
                      nenhum registro ainda{'\n'}
                      <Text style={styles.emptyChartSubtext}>
                        comece registrando suas emoções no diário!
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
                  <Text style={styles.viewNotesText}>ver minhas anotações</Text>
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
                <Text style={styles.recommendationTitle}>recomendação do dia</Text>
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

//estilos
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
    fontFamily: 'breeserif',
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
    fontFamily: 'breeserif',
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
    fontFamily: 'breeserif',
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
    fontFamily: 'breeserif',
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
    fontFamily: 'breeserif',
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
    fontFamily: 'breeserif',
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
    fontFamily: 'breeserif',
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
    fontFamily: 'breeserif',
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