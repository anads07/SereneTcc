// Importações principais
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Animated,
  Dimensions,
  Easing,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

// Obter largura da tela
const { width } = Dimensions.get('window');

// ====== DADOS ======

// Lista completa de recomendações
const todasRecomendacoes = [
  {
    title: 'Respiração Profunda',
    image: require('../assets/src/RespiracaoProfunda.png'),
    objective: 'Reduz ansiedade, acalma o sistema nervoso e melhora foco.',
    descricao:
      '1. Sente-se ou deite-se confortável, mantendo a coluna ereta.\n' +
      '2. Coloque uma mão no peito e outra no abdômen.\n' +
      '3. Inspire pelo nariz contando até 4.\n' +
      '4. Segure a respiração por 2 segundos.\n' +
      '5. Expire lentamente pela boca contando até 6.\n' +
      '6. Repita de 5 a 10 ciclos.\n' +
      '7. Dica: traga atenção de volta à respiração se a mente divagar.',
  },
  {
    title: 'Meditação Guiada',
    image: require('../assets/src/MeditacaoGuiada.png'),
    objective: 'Acalma a mente, melhora foco e reduz estresse.',
    descricao:
      '1. Sente-se ou deite-se em local silencioso.\n' +
      '2. Feche os olhos e respire profundamente 2–3 vezes.\n' +
      '3. Concentre-se na respiração, observando o ar entrar e sair.\n' +
      '4. Observe pensamentos sem se envolver.\n' +
      '5. Mantenha postura ereta e relaxe ombros e mandíbula.\n' +
      '6. Permaneça de 5 a 15 minutos.\n' +
      '7. Use música suave ou app de meditação se desejar.',
  },
  {
    title: 'Leitura Relaxante',
    image: require('../assets/src/LeituraRelaxante.png'),
    objective: 'Oferece descanso mental e uma pausa criativa.',
    descricao:
      '1. Escolha um livro, revista ou texto leve.\n' +
      '2. Sente-se mantendo boa postura.\n' +
      '3. Desligue notificações para evitar distrações.\n' +
      '4. Leia devagar, atentando-se ao significado.\n' +
      '5. Reserve 10 a 20 minutos.\n' +
      '6. Dica: ficção ou poesia ajudam a desacelerar a mente.',
  },
  {
    title: 'Visualização Positiva',
    image: require('../assets/src/VisualizacaoPositiva.png'),
    objective: 'Reduz tensão mental, melhora humor e foco.',
    descricao:
      '1. Sente-se/deite-se em local calmo e respire 2–3 vezes.\n' +
      '2. Feche os olhos e imagine um lugar seguro e relaxante.\n' +
      '3. Explore cores, sons, cheiros e temperatura.\n' +
      '4. Imagine-se interagindo e sentindo paz.\n' +
      '5. Permaneça por 3 a 10 minutos.\n' +
      '6. Use sons da natureza ou música relaxante.',
  },
  {
    title: 'Alongamento Suave',
    image: require('../assets/src/AlongamentoSuave.png'),
    objective: 'Reduz tensão muscular e melhora circulação.',
    descricao:
      '1. Posicione-se sentado(a) ou em pé com coluna ereta.\n' +
      '2. Incline lentamente a cabeça para cada lado.\n' +
      '3. Faça círculos lentos com os ombros e braços.\n' +
      '4. Incline-se suavemente à frente e para trás.\n' +
      '5. Mantenha cada posição 10–20 segundos.\n' +
      '6. Movimentos suaves, sem forçar.',
  },
  {
    title: 'Música Relaxante',
    image: require('../assets/src/MusicaRelaxante.png'),
    objective: 'Alivia estresse e induz sensação de calma.',
    descricao:
      '1. Escolha música instrumental ou sons da natureza.\n' +
      '2. Coloque fones e acomode-se confortavelmente.\n' +
      '3. Respire lentamente acompanhando o ritmo.\n' +
      '4. Foque em melodias, instrumentos e texturas.\n' +
      '5. Ouça por 5 a 15 minutos.\n' +
      '6. Combine com respiração profunda ou alongamentos.',
  },
  {
    title: 'Diário de Gratidão',
    image: require('../assets/src/DiarioDeGratidao.png'),
    objective: 'Melhora bem-estar emocional e foco no positivo.',
    descricao:
      '1. Pegue um caderno ou app de notas.\n' +
      '2. Liste 3 a 5 coisas pelas quais é grato.\n' +
      '3. Reflita brevemente sobre cada item.\n' +
      '4. Evite julgamentos; registre apenas o positivo.\n' +
      '5. Leve 5 a 10 minutos.\n' +
      '6. Repita diariamente ou quando sentir estresse.',
  },
  {
    title: 'Caminhada Mindful',
    image: require('../assets/src/CaminhadaMindful.png'),
    objective: 'Relaxa corpo e mente, promove atenção plena.',
    descricao:
      '1. Escolha um local seguro e tranquilo.\n' +
      '2. Dê passos lentos, sentindo o contato dos pés com o chão.\n' +
      '3. Respire profundamente, notando o ar entrar e sair.\n' +
      '4. Observe sons, cores e aromas sem julgar.\n' +
      '5. Caminhe por 5 a 15 minutos.\n' +
      '6. Evite usar o celular durante a prática.',
  },
  {
    title: 'Banho Relaxante',
    image: require('../assets/src/BanhoRelaxante.png'),
    objective: 'Alivia tensão física e mental.',
    descricao:
      '1. Prepare um banho morno em ambiente tranquilo.\n' +
      '2. Concentre-se na sensação da água na pele.\n' +
      '3. Respire profundamente, liberando tensões.\n' +
      '4. Permaneça 5 a 20 minutos.\n' +
      '5. Use sabonetes aromáticos, velas ou óleos essenciais.',
  },
  {
    title: 'Técnica 5-4-3-2-1',
    image: require('../assets/src/Tecnica54321.png'),
    objective: 'Reduz ansiedade, aumenta foco no presente.',
    descricao:
      '1. Observe 5 coisas visíveis.\n' +
      '2. Note 4 coisas que consegue tocar.\n' +
      '3. Ouça 3 sons ao redor.\n' +
      '4. Identifique 2 cheiros próximos.\n' +
      '5. Concentre-se em 1 sabor ou sensação corporal.\n' +
      '6. Use em momentos de ansiedade ou estresse.',
  },
  {
    title: 'Relaxamento Muscular Progressivo',
    image: require('../assets/src/RelaxamentoMuscularProgressivo.png'),
    objective: 'Reduz tensão muscular e alivia estresse.',
    descricao:
      '1. Deite-se ou sente-se confortavelmente.\n' +
      '2. Contraia pés por 5s e relaxe.\n' +
      '3. Suba por pernas, glúteos, abdômen e costas.\n' +
      '4. Prossiga com braços, mãos, pescoço e rosto.\n' +
      '5. Respire lenta e profundamente durante todo o processo.\n' +
      '6. Foque na diferença entre tensão e relaxamento.',
  },
  {
    title: 'Aromaterapia Simples',
    image: require('../assets/src/AromaterapiaSimples.png'),
    objective: 'Estimula relaxamento através do olfato.',
    descricao:
      '1. Escolha aroma relaxante (lavanda, camomila, hortelã).\n' +
      '2. Acenda vela, use difusor ou inalador.\n' +
      '3. Sente-se confortavelmente e respire fundo.\n' +
      '4. Concentre-se na sensação de calma.\n' +
      '5. Permaneça 5 a 10 minutos.\n' +
      '6. Evite aromas que causem desconforto.',
  },
  {
    title: 'Escrita Livre',
    image: require('../assets/src/EscritaLivre.png'),
    objective: 'Libera pensamentos e emoções, proporcionando clareza mental.',
    descricao:
      '1. Pegue papel e caneta ou app de notas.\n' +
      '2. Escreva sem regras gramaticais.\n' +
      '3. Registre pensamentos, sentimentos ou fatos do dia.\n' +
      '4. Continue por 5 a 10 minutos.\n' +
      '5. Releia apenas se desejar, sem julgamentos.',
  },
  {
    title: 'Observação da Natureza',
    image: require('../assets/src/ObservacaoDaNatureza.png'),
    objective: 'Reduz estresse e aumenta sensação de bem-estar.',
    descricao:
      '1. Sente-se perto de uma janela, jardim ou parque.\n' +
      '2. Observe árvores, pássaros, nuvens e flores.\n' +
      '3. Respire profundamente, percebendo o ambiente.\n' +
      '4. Permaneça 5 a 15 minutos.\n' +
      '5. Note detalhes geralmente despercebidos.',
  },
  {
    title: 'Técnica de Respiração 4-7-8',
    image: require('../assets/src/TecnicaDeRespiracao478.png'),
    objective: 'Acalma o sistema nervoso rapidamente.',
    descricao:
      '1. Sente-se ou deite-se com coluna ereta.\n' +
      '2. Inspire pelo nariz contando até 4.\n' +
      '3. Segure a respiração contando até 7.\n' +
      '4. Expire pela boca contando até 8.\n' +
      '5. Repita 4 ciclos.\n' +
      '6. Ideal antes de dormir ou em picos de ansiedade.',
  },
  {
    title: 'Yoga Simples',
    image: require('../assets/src/YogaSimples.png'),
    objective: 'Relaxa corpo e mente, melhora postura e flexibilidade.',
    descricao:
      '1. Separe um tapete e vista roupas confortáveis.\n' +
      '2. Escolha posturas simples.\n' +
      '3. Sincronize movimento com respiração profunda.\n' +
      '4. Mantenha cada postura 20–30s.\n' +
      '5. Pratique 10 a 20 minutos.\n' +
      '6. Movimente-se sem dor e sem pressa.',
  },
  {
    title: 'Pintura ou Desenho Livre',
    image: require('../assets/src/PinturaOuDesenhoLivre.png'),
    objective: 'Expressa emoções e reduz tensão mental.',
    descricao:
      '1. Separe papel, lápis, canetas ou tintas.\n' +
      '2. Desenhe/pinte sem buscar perfeição.\n' +
      '3. Foque em cores, formas e movimentos.\n' +
      '4. Crie 10 a 20 minutos.\n' +
      '5. Ouça música calma para ampliar criatividade.',
  },
  {
    title: 'Contagem para Acalmar',
    image: require('../assets/src/ContagemParaAcalmar.png'),
    objective: 'Reduz ansiedade e pensamentos acelerados.',
    descricao:
      '1. Sente-se ou deite-se confortavelmente.\n' +
      '2. Inspire profundamente e conte mentalmente até 10.\n' +
      '3. Expire devagar e recomece.\n' +
      '4. Mantenha 2 a 5 minutos.\n' +
      '5. Associe com respiração profunda para efeito maior.',
  },
  {
    title: 'Mini-Pausa Digital',
    image: require('../assets/src/MiniPausaDigital.png'),
    objective: 'Reduz sobrecarga mental de telas e notificações.',
    descricao:
      '1. Afaste-se de celular, computador e TV.\n' +
      '2. Sente-se ou caminhe em silêncio, respirando profundamente.\n' +
      '3. Observe ambiente, sons e sensações.\n' +
      '4. Fique 5 a 10 minutos desconectado.\n' +
      '5. Desative notificações temporariamente.',
  },
  {
    title: 'Observação de Sensações Corporais',
    image: require('../assets/src/ObservacaoDeSensacoesCorporais.png'),
    objective: 'Desenvolve atenção plena e relaxamento profundo.',
    descricao:
      '1. Deite-se ou sente-se e feche os olhos.\n' +
      '2. Faça um scan corporal da cabeça aos pés.\n' +
      '3. Identifique áreas de tensão e relaxe.\n' +
      '4. Respire profundamente durante todo o exercício.\n' +
      '5. Pratique 5 a 10 minutos.\n' +
      '6. Combine com música suave ou respiração profunda.',
  },
];


// Frases aleatórias para os balões de conversa
const frasesBalao1 = [
  'Hora de dar uma pausa e respirar fundo 🌿',
  'Um momento só para você! Que tal relaxar?',
  'Respire… vamos desacelerar juntos 🧘',
  'É hora de cuidar de você ✨',
  'Tire um tempinho para respirar e recarregar 💖',
  'Vamos tirar alguns minutos só para o seu bem-estar?',
  'Seu corpo e mente merecem um respiro agora 🌸',
  'Que tal um instante de calma e tranquilidade?',
  'Hora de se reconectar consigo mesmo 🧘',
  'Um pequeno intervalo para relaxar pode mudar seu dia ✨',
];

const frasesBalao2 = [
  'Tire alguns minutos para se cuidar 🌿',
  'Permita-se esse momento de descanso 💆‍♂️',
  'Seu bem-estar importa, dedique um tempo para você 💖',
  'Cuide de você com alguns instantes de calma 🌸',
  'Aproveite este momento para recarregar suas energias ✨',
  'Um momento de cuidado faz toda a diferença 💛',
  'Respire, relaxe e dê atenção ao seu corpo e mente 🌿',
  'Deixe o estresse de lado por alguns minutos 🙂',
  'Conecte-se consigo mesmo e com sua tranquilidade 🧘',
  'Dedique alguns minutos para se sentir melhor 💖',
];

// ====== COMPONENTE PRINCIPAL ======
const RecomendacoesScreen = () => {
  const navigation = useNavigation();

  // Estados principais
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [displayedRecommendations, setDisplayedRecommendations] = useState([]);
  const [balao1Phrase, setBalao1Phrase] = useState('');
  const [balao2Phrase, setBalao2Phrase] = useState('');
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);

  // Valores de animação
  const balao1Anim = useRef(new Animated.Value(0)).current;
  const balao2Anim = useRef(new Animated.Value(0)).current;
  const okButtonAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  // ====== useEffect para inicialização ======
  useEffect(() => {
    // Seleciona frases aleatórias para balões
    const randomPhrase1 = frasesBalao1[Math.floor(Math.random() * frasesBalao1.length)];
    const randomPhrase2 = frasesBalao2[Math.floor(Math.random() * frasesBalao2.length)];
    setBalao1Phrase(randomPhrase1);
    setBalao2Phrase(randomPhrase2);

    // Seleciona 4 recomendações aleatórias
    const startIdx = Math.floor(Math.random() * 5) * 4;
    const selectedGroup = todasRecomendacoes.slice(startIdx, startIdx + 4);
    setDisplayedRecommendations(selectedGroup);

    // Sequência de animação dos balões e botão OK
    Animated.sequence([
      Animated.timing(balao1Anim, { toValue: 1, duration: 800, easing: Easing.ease, useNativeDriver: true }),
      Animated.timing(balao2Anim, { toValue: 1, duration: 800, easing: Easing.ease, delay: 500, useNativeDriver: true }),
      Animated.timing(okButtonAnim, { toValue: 1, duration: 500, easing: Easing.ease, delay: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  // ====== FUNÇÕES ======
  const handleOkPress = () => {
    setShowRecommendations(true);
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();
  };

  const handleRecommendationPress = item => {
    setSelectedRecommendation(item);
  };

  // Item de recomendação
  const RecommendationItem = ({ item }) => (
    <TouchableOpacity style={styles.activityCard} onPress={() => handleRecommendationPress(item)}>
      <Text style={styles.activityTitle}>{item.title}</Text>
      <Image source={item.image} style={styles.activityImage} />
      <Text style={styles.activityObjective}>{item.objective}</Text>
    </TouchableOpacity>
  );

  // ====== RENDER ======
  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={['#e0f7fa', '#a2caff']} style={styles.background}>
        {/* Header fixo */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Image source={require('../assets/src/seta.png')} style={styles.backArrow} />
          </TouchableOpacity>
          <Text style={styles.headerText}>CUIDANDO DE VOCÊ</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} style={styles.scrollView}>
          {/* Balões de conversa */}
          <View style={styles.baloesContainerColumn}>
            <Animated.View
              style={[styles.balaoContainer, { opacity: balao1Anim, transform: [{ rotate: '1deg' }] }]}
            >
              <Image source={require('../assets/src/baloes.png')} style={styles.balaoImage} />
              <Text style={styles.balaoText}>{balao1Phrase}</Text>
            </Animated.View>
            <Animated.View
              style={[styles.balaoContainer, { opacity: balao2Anim, transform: [{ rotate: '-1deg' }, { scaleX: -1 }] }]}
            >
              <Image source={require('../assets/src/baloes.png')} style={styles.balaoImage} />
              <Text style={[styles.balaoText, { transform: [{ scaleX: -1 }] }]}>{balao2Phrase}</Text>
            </Animated.View>
          </View>

          {/* Botão OK */}
          {!showRecommendations && (
            <Animated.View style={[styles.okButtonContainer, { opacity: okButtonAnim }]}>
              <TouchableOpacity onPress={handleOkPress} style={styles.okButton}>
                <Text style={styles.okButtonText}>Ok!</Text>
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* Lista de recomendações */}
          {showRecommendations && (
            <Animated.View style={[styles.recommendationsContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
              <View style={styles.gridContainer}>
                {displayedRecommendations.map((item, index) => (
                  <RecommendationItem key={index} item={item} />
                ))}
              </View>
            </Animated.View>
          )}
        </ScrollView>

        {/* Modal da recomendação */}
        <Modal
          visible={!!selectedRecommendation}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setSelectedRecommendation(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Image source={selectedRecommendation?.image} style={styles.modalImage} />
              <Text style={styles.modalTitle}>{selectedRecommendation?.title}</Text>
              <Text style={styles.modalDescription}>{selectedRecommendation?.descricao}</Text>
              <TouchableOpacity onPress={() => setSelectedRecommendation(null)} style={styles.closeModalButton}>
                <Text style={styles.closeModalText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </SafeAreaView>
  );
};

// ====== ESTILOS ======
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  background: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#a2caff',
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: -10,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  backButton: {
    padding: 10,
  },
  backArrow: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    tintColor: 'white',
  },
  headerText: {
    fontSize: 28,
    fontFamily: 'Bree-Serif',
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  baloesContainerColumn: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  balaoContainer: {
    marginVertical: -70,
    width: width * 0.9,
    aspectRatio: 1.5,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  balaoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    position: 'absolute',
  },
  balaoText: {
    position: 'absolute',
    textAlign: 'center',
    width: '70%',
    fontSize: 18,
    color: 'white',
    padding: 10,
    fontFamily: 'Bree-Serif',
  },
  okButtonContainer: {
    marginTop: 10,
  },
  okButton: {
    backgroundColor: '#a2caff',
    borderRadius: 20,
    paddingHorizontal: 40,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  okButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: 12,
  },
  activityCard: {
    width: width * 0.42,
    backgroundColor: '#84a9da',
    borderRadius: 20,
    padding: 4,
    margin: 8,
    alignItems: 'center',
  },
  activityImage: {
    width: 60,
    height: 60,
    marginVertical: 8,
    resizeMode: 'contain',
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 4,
    fontFamily: 'Bree-Serif',
  },
  activityObjective: {
    fontSize: 14,
    textAlign: 'center',
    color: '#fff',
    marginTop: 4,
    fontFamily: 'Bree-Serif',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#84a9da',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: 'white',
    fontFamily: 'Bree-Serif',
  },
  modalDescription: {
    fontSize: 16,
    textAlign: 'center',
    color: 'white',
    marginBottom: 20,
    lineHeight: 22,
    fontFamily: 'Bree-Serif',
  },
  closeModalButton: {
    backgroundColor: '#0c4793',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  closeModalText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Bree-Serif',
  },
});

export default RecomendacoesScreen;