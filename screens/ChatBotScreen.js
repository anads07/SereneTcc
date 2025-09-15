import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// fluxo de conversa do chatbot
const chatFlow = {
  initial: {
    botMessage: 'Olá! Do que você precisa?',
    suggestions: [
      'Estou me sentindo mal, preciso desabafar.',
      'Estou tendo uma crise de ansiedade, me ajude!'
    ],
    nextSteps: { 1: 'desabafar', 2: 'criseAnsiedade' }
  },
  desabafar: {
    botMessage: 'Ok! Me conte o que está te preocupando?',
    suggestions: [
      'Estou com pensamentos negativos sobre mim mesmo(a).',
      'Estou com problemas com a minha família.',
      'Estou com problemas no trabalho/escola.',
      'Estou me sentindo muito sozinho(a).'
    ],
    nextSteps: { 1: 'pensamentosNegativos', 2: 'problemasFamilia', 3: 'encerramento', 4: 'encerramento' }
  },
  pensamentosNegativos: {
    botMessage: 'Entendo. É muito corajoso(a) reconhecer isso. Que tipo de pensamento está mais te afetando?',
    suggestions: [
      'Sinto que não sou bom(a) o suficiente.',
      'Acho que as coisas nunca vão dar certo para mim.',
      'Me sinto culpado(a) por algo do passado.',
      'Sinto que não tenho valor.'
    ],
    nextSteps: { 1: 'tecnicaAlivio', 2: 'tecnicaAlivio', 3: 'tecnicaAlivio', 4: 'tecnicaAlivio' }
  },
  tecnicaAlivio: {
    botMessage: 'Obrigado(a) por compartilhar. Que tal tentarmos uma técnica rápida para aliviar esse sentimento?',
    suggestions: ['Sim, vamos tentar!', 'Não, prefiro só continuar conversando.'],
    nextSteps: { 1: 'tecnicaRespiracao', 2: 'continuarConversando' }
  },
  tecnicaRespiracao: {
    botMessage:
      'Ok, vamos lá. Feche os olhos por um momento, inspire profundamente pelo nariz, segure o ar por 3 segundos e expire lentamente pela boca. Repita 3 vezes. Como você se sente agora?',
    suggestions: ['Me sinto um pouco melhor.', 'Ainda me sinto mal.'],
    nextSteps: { 1: 'sentiuMelhora', 2: 'aindaMal' }
  },
  sentiuMelhora: {
    botMessage:
      'Fico feliz em saber. Lembre-se que você pode usar essa técnica sempre que precisar. Podemos continuar conversando ou você prefere mudar de assunto?',
    suggestions: ['Vamos mudar de assunto.', 'Vamos continuar conversando.'],
    nextSteps: { 1: 'encerramento', 2: 'encerramento' }
  },
  aindaMal: {
    botMessage:
      'Tudo bem, vamos tentar outra coisa. Que tal focar em algo que você é bom(a) em fazer? Escolha uma opção.',
    suggestions: ['Meus hobbies.', 'Minhas qualidades pessoais.', 'Meu trabalho/estudos.'],
    nextSteps: { 1: 'encerramento', 2: 'encerramento', 3: 'encerramento' }
  },
  problemasFamilia: {
    botMessage: 'Lidar com a família pode ser muito difícil. Que tipo de problema você está enfrentando?',
    suggestions: [
      'Eles não me ouvem/entendem.',
      'Eles me criticam muito.',
      'Me sinto excluído(a).',
      'Brigamos com muita frequência.'
    ],
    nextSteps: { 1: 'mudarFoco', 2: 'mudarFoco', 3: 'mudarFoco', 4: 'mudarFoco' }
  },
  mudarFoco: {
    botMessage:
      'Obrigado(a) por compartilhar. Você acha que focar em algo que te faça sentir bem, mesmo que por um instante, pode ajudar a aliviar essa pressão?',
    suggestions: ['Sim, vamos mudar o foco.', 'Não, prefiro continuar pensando sobre isso.'],
    nextSteps: { 1: 'focoPaz', 2: 'encerramento' }
  },
  focoPaz: {
    botMessage: 'Me conte uma coisa que você gosta muito de fazer, que te traga paz.',
    suggestions: [
      'Ouvir música/ver filmes.',
      'Praticar um esporte/hobby.',
      'Passar tempo com amigos.',
      'Cuidar dos meus animais de estimação.'
    ],
    nextSteps: { 1: 'encerramento', 2: 'encerramento', 3: 'encerramento', 4: 'encerramento' }
  },
  criseAnsiedade: {
    botMessage:
      'Sinto muito que você esteja passando por isso, mas estamos juntos. Vamos focar em respirar. Você consegue se concentrar em uma técnica rápida?',
    suggestions: ['Sim, por favor.', 'Não consigo me concentrar.'],
    nextSteps: { 1: 'criseRespiracao', 2: 'naoConseguiFocar' }
  },
  criseRespiracao: {
    botMessage: 'Ótimo. Respire fundo, segure o ar, e solte lentamente. Repita comigo, se puder.',
    suggestions: ['Já fiz 3 vezes.', 'Não consegui fazer.'],
    nextSteps: { 1: 'tecnica5sentidos', 2: 'naoConseguiFocar' }
  },
  tecnica5sentidos: {
    botMessage:
      'Parabéns, você conseguiu! Agora, vamos tentar a técnica dos 5 sentidos. Olhe ao seu redor. Escolha 5 coisas que você consegue ver.',
    suggestions: ['Já vi 5 coisas.', 'Não consigo focar.'],
    nextSteps: { 1: 'encerramento', 2: 'naoConseguiFocar' }
  },
  naoConseguiFocar: {
    botMessage:
      'Tudo bem, não se preocupe. Apenas siga minhas instruções. Tente se concentrar em uma coisa. Qual das opções abaixo te ajuda a se sentir um pouco mais calmo(a)?',
    suggestions: [
      'Ouvir uma música calma.',
      'Lembrar de um lugar tranquilo.',
      'Fazer um alongamento leve.',
      'Beber um copo de água.'
    ],
    nextSteps: { 1: 'encerramento', 2: 'encerramento', 3: 'encerramento', 4: 'encerramento' }
  },
  encerramento: {
    botMessage:
      'Fico feliz que você tenha me procurado. Lembre-se, você é mais forte do que pensa. Se a sua angústia for muito grande ou você sentir que precisa de ajuda profissional, procure um psicólogo ou ligue para o CVV (Centro de Valorização da Vida) no 188. Eles estão disponíveis 24 horas por dia.',
    suggestions: ['Obrigado(a), isso me ajudou.', 'Ainda me sinto mal.'],
    nextSteps: { 1: 'finalizado', 2: 'recomendarCVV' }
  },
  recomendarCVV: {
    botMessage:
      'Entendo. Por favor, considere a opção de buscar ajuda profissional. É um passo de coragem e cuidado com você mesmo(a). Quer que eu repita o número do CVV?',
    suggestions: ['Sim, por favor.', 'Não, obrigado(a).', 'Ligar agora para o CVV (188)'],
    nextSteps: { 1: 'finalizado', 2: 'finalizado', 3: 'ligarCVV' }
  },
  ligarCVV: {
    botMessage: 'Ok! Redirecionando para a chamada...',
    suggestions: [],
    action: 'dial'
  },
  finalizado: {
    botMessage: 'Fim da conversa. Estou aqui se precisar novamente.',
    suggestions: []
  }
};

// componente header do chatbot
const Header = ({ navigation }) => (
  <View style={styles.header}>
    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
      <Image source={require('../assets/src/seta.png')} style={styles.backArrow} />
    </TouchableOpacity>

    <View style={styles.headerTitleContainer}>
      <Image source={require('../assets/src/robo.png')} style={styles.robotIcon} />
      <Text style={styles.headerText}>CHATBOT</Text>
    </View>

    <View style={{ width: 40 }} />
  </View>
);

// componente de mensagem
const ChatMessage = ({ text, isUser }) => (
  <View
    style={[
      styles.messageContainer,
      isUser ? styles.userMessageContainer : styles.botMessageContainer
    ]}
  >
    <Text
      style={[
        styles.messageText,
        isUser ? styles.userMessageText : styles.botMessageText
      ]}
    >
      {text}
    </Text>
  </View>
);

// componente de sugestões
const SuggestionMessage = ({ suggestions, onSelect }) => (
  <View style={styles.suggestionsContainer}>
    {suggestions.map((suggestion, index) => (
      <TouchableOpacity
        key={index}
        style={styles.suggestionButton}
        onPress={() => onSelect(index + 1, suggestion)}
      >
        <Text style={styles.suggestionText}>{suggestion}</Text>
      </TouchableOpacity>
    ))}
  </View>
);

// tela principal do chatbot
const ChatBotScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [currentStep, setCurrentStep] = useState('initial');
  const scrollViewRef = useRef();

  useEffect(() => {
    setMessages([
      { type: 'bot', text: chatFlow.initial.botMessage },
      { type: 'suggestions', suggestions: chatFlow.initial.suggestions }
    ]);
  }, []);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleSuggestionSelect = (choice, suggestionText) => {
    const userChoiceMessage = { type: 'userChoice', text: suggestionText };
    const nextStepKey = chatFlow[currentStep].nextSteps[choice];
    const nextStep = chatFlow[nextStepKey];

    if (nextStep) {
      const newMessages = [
        ...messages,
        userChoiceMessage,
        { type: 'bot', text: nextStep.botMessage }
      ];

      if (nextStep.suggestions?.length > 0) {
        newMessages.push({ type: 'suggestions', suggestions: nextStep.suggestions });
      }

      setMessages(newMessages);
      setCurrentStep(nextStepKey);

      if (nextStep.action === 'dial') {
        Linking.openURL('tel:188');
      }
    } else {
      setMessages([
        ...messages,
        userChoiceMessage,
        { type: 'bot', text: 'Fim da conversa.' }
      ]);
      setCurrentStep('finalizado');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#e0f7fa', '#a2caff']}
        style={styles.background}
      >
        <Header navigation={navigation} />

        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            style={styles.chatArea}
            contentContainerStyle={styles.chatContent}
            ref={scrollViewRef}
          >
            {messages.map((msg, index) => {
              if (msg.type === 'bot') return <ChatMessage key={index} text={msg.text} isUser={false} />;
              if (msg.type === 'userChoice') return <ChatMessage key={index} text={msg.text} isUser={true} />;
              if (msg.type === 'suggestions') return (
                <SuggestionMessage
                  key={index}
                  suggestions={msg.suggestions}
                  onSelect={handleSuggestionSelect}
                />
              );
              return null;
            })}
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

// estilos organizados linha por linha
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff'
  },
  background: {
    flex: 1
  },
  keyboardAvoidingView: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#a2caff',
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15
  },
  backButton: {
    padding: 10
  },
  backArrow: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    tintColor: 'white'
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  robotIcon: {
    width: 40,
    height: 40,
    marginRight: 8,
    tintColor: 'white',
    resizeMode: 'contain'
  },
  headerText: {
    fontSize: 28,
    fontFamily: 'Bree-Serif',
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center'
  },
  chatContent: {
    paddingVertical: 15,
    paddingHorizontal: 15
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 20,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84
  },
  botMessageContainer: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start'
  },
  userMessageContainer: {
    backgroundColor: '#b0e0e6',
    alignSelf: 'flex-end'
  },
  messageText: {
    fontSize: 16
  },
  botMessageText: {
    color: '#333'
  },
  userMessageText: {
    color: '#000'
  },
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginBottom: 10
  },
  suggestionButton: {
    backgroundColor: '#84a9da',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 25,
    marginRight: 8,
    marginBottom: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 2.84
  },
  suggestionText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center'
  }
});

export default ChatBotScreen;

