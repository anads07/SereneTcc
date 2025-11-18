import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ActivityIndicator,
  Alert,
  StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; 
import { Ionicons } from '@expo/vector-icons';
import { GoogleGenAI } from '@google/genai';

// configuração da ia 
const GEMINI_API_KEY = 'AIzaSyChFUY4rN8LvRMkPAGLiTDaFllQKAKA3Tw';
const MODEL = 'gemini-2.5-flash';
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// layout responsivo
const HEADER_HEIGHT = Platform.select({
  ios: screenWidth > 400 ? 130 : 110,
  android: screenWidth > 400 ? 110 + (StatusBar.currentHeight || 0) : 90 + (StatusBar.currentHeight || 0),
  default: 120
});
const INPUT_HEIGHT = screenWidth > 400 ? 85 : 75;
const CHAT_AREA_HEIGHT = screenHeight - HEADER_HEIGHT - INPUT_HEIGHT;

const SereneMindScreen = ({ navigation }) => {
  // instrução detalhada para a personalidade do assistente (serene)
  const systemInstruction = `você é serene, uma assistente emocional gentil e empática que ajuda o usuário a expressar sentimentos e refletir sobre o que está sentindo. você **não deve se reapresentar**, pois o app já mostra uma mensagem inicial de boas-vindas. no **primeiro contato com o usuário**, pergunte de forma breve se ele faz acompanhamento psicológico ou psiquiátrico e encerre a pergunta em no máximo 2–3 frases curtas. caso ele já faça, demonstre alegria e incentive a continuidade. caso não faça, apenas incentive de forma leve e acolhedora (mas não se estenda tanto) que cuidar da mente é importante, sem dar conselhos clínicos. depois do primeiro contato, suas respostas podem ser acolhedoras, oferecendo frases de conforto, sugestões de autocuidado, reflexão emocional e apoio empático, mas sem se estender muito para não se tornar cansativo, seja acolhedor e objetivo. durante toda a conversa, mantenha um tom calmo, humano e positivo, usando emojis suaves (🌿💛✨🌸💬) com cautela para não usar demais mas nunca se apresente como profissional de saúde mental ou ofereça diagnósticos. se houver risco de vida, indique imediatamente entrar em contato com o cvv (188) ou o serviço de emergência local, de forma acolhedora e responsável. ao encerrar o chat, agradeça pela confiança, reconheça a coragem do usuário em se abrir e incentive o cuidado emocional com apoio profissional, mantendo sempre empatia e gentileza.`;

  // estados
  const [messages, setMessages] = useState([
    { role: 'system', content: systemInstruction }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  
  // refs
  const scrollViewRef = useRef();
  const chatRef = useRef(null); 

  // efeito: inicialização da sessão de chat e mensagem de boas-vindas
  useEffect(() => {
    // 1. cria a sessão de chat com as instruções de sistema
    chatRef.current = ai.chats.create({ 
      model: MODEL,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.5,
        maxOutputTokens: 3000,
      }
    });

    // 2. adiciona a mensagem inicial de boas-vindas do assistente
    const initialMessage = 'olá, eu sou a serene 🤗\nestou aqui para te ouvir e ajudar. como está se sentindo?';
    setMessages(prev => prev.some(m => m.id === 'initial-welcome') ? prev : [...prev, { 
      id: 'initial-welcome', 
      text: initialMessage, 
      isUser: false, 
      role: 'assistant', 
      timestamp: new Date() 
    }]);
  }, []);

  // rolar para o final do scrollview
  const scrollToBottom = () => {
    if(scrollViewRef.current){
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 200);
    }
  };
  
  // rola para o final toda vez que uma nova mensagem for adicionada
  useEffect(scrollToBottom, [messages]);

  // função de comunicação com a ia 
  const sendMessageToAI = async (userMessage) => {
    setLoading(true);
    try {
      const response = await chatRef.current.sendMessage({ message: userMessage });
      return response.text;
    } catch (error) {
      console.error(error);
      Alert.alert('erro de ia', 'não foi possível se comunicar com o assistente.');
      return "desculpe, parece que houve um erro! pode tentar enviar outra vez? 💙";
    } finally {
      setLoading(false);
    }
  };

  // envio de mensagem do usuário 
  const handleSendMessage = async () => {
    if (!inputText.trim() || loading) return;

    const userMessageObj = {
      id: Date.now(),
      text: inputText.trim(),
      isUser: true,
      role: 'user',
      timestamp: new Date()
    };

    setInputText('');
    setMessages(prev => [...prev, userMessageObj]);
    setTimeout(scrollToBottom, 50);

    const aiResponse = await sendMessageToAI(userMessageObj.text);

    const aiMessageObj = {
      id: Date.now() + 1,
      text: aiResponse,
      isUser: false,
      role: 'assistant',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMessageObj]);
  };

  // componente de mensagem individual
  const ChatMessage = ({ message }) => {
    if (message.role === 'system') return null; 

    const timeString = (message.timestamp instanceof Date && !isNaN(message.timestamp)) ? 
      message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '';

    return (
      <View style={[
        styles.messageContainer, 
        message.isUser ? styles.userMessageContainer : styles.botMessageContainer
      ]}>
        <Text style={[
          styles.messageText, 
          message.isUser ? styles.userMessageText : styles.botMessageText
        ]}>
          {message.text}
        </Text>
        <Text style={[
          styles.timestamp,
          message.isUser ? styles.userTimestamp : styles.botTimestamp
        ]}>
          {timeString}
        </Text>
      </View>
    );
  };

  // filtra as mensagens para remover a instrução de sistema antes da exibição
  const displayMessages = messages.filter(m => m.role !== 'system');

  // renderização principal
  return (
    <LinearGradient colors={['#b9d2ff', '#d9e7ff', '#eaf3ff']} style={styles.fullScreen}>
      <StatusBar barStyle="light-content" backgroundColor="#b9d2ff" />

      {/* header fixa */}
      <SafeAreaView style={styles.headerSafeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Image 
              source={require('../assets/src/seta.png')} 
              style={styles.backImage}
            />
          </TouchableOpacity>

          <Text style={styles.title}>SERENE</Text>

          <TouchableOpacity style={styles.roboButton}> 
            <Image 
              source={require('../assets/src/robo.png')} 
              style={styles.roboImage} 
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* keyboard avoiding view para gerenciar o teclado */}
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? (screenWidth > 400 ? 90 : 80) : 0} 
      >
        <View style={styles.mainContent}>
          {/* área de chat (scrollview) */}
          <ScrollView
            style={[styles.chatScrollView, { height: CHAT_AREA_HEIGHT }]}
            contentContainerStyle={styles.chatContent}
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {displayMessages.map((msg, index) => (
              <ChatMessage key={msg.id || index} message={msg} />
            ))}
            
            {/* indicador de digitação */}
            {loading && (
              <View style={styles.loadingContainer}>
                <View style={styles.loadingBubble}>
                  <ActivityIndicator size="small" color="#5691de" />
                  <Text style={styles.loadingText}>serene está digitando...</Text>
                </View>
              </View>
            )}
            
            <View style={styles.bottomSpacer} />
          </ScrollView>

          {/* input area */}
          <View style={[styles.inputContainer, { height: INPUT_HEIGHT }]}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                value={inputText}
                onChangeText={setInputText}
                placeholder="digite sua mensagem..."
                placeholderTextColor="#999"
                multiline
                maxLength={500}
                editable={!loading}
              />
            </View>
            <TouchableOpacity
              style={[
                styles.sendButton, 
                (!inputText.trim() || loading) && styles.sendButtonDisabled
              ]}
              onPress={handleSendMessage}
              disabled={!inputText.trim() || loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="send" size={screenWidth > 400 ? 22 : 20} color="white" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default SereneMindScreen;

// estilos
const styles = StyleSheet.create({
  fullScreen: { 
    flex: 1,
  },
  headerSafeArea: {
    backgroundColor: '#b9d2ff',
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
    fontSize: screenWidth > 400 ? (screenWidth > 500 ? 44 : 40) : 32,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Bree-Serif', 
  },
  backButton: {
    padding: 5,
  },
  backImage: {
    width: screenWidth > 400 ? (screenWidth > 500 ? 60 : 55) : 45,
    height: screenWidth > 400 ? (screenWidth > 500 ? 60 : 55) : 45,
    resizeMode: 'contain',
    tintColor: 'white',
    transform: [{ scaleX: -1 }],
  },
  roboButton: { 
    padding: 5,
  },
  roboImage: {
    width: screenWidth > 400 ? (screenWidth > 500 ? 60 : 55) : 45,
    height: screenWidth > 400 ? (screenWidth > 500 ? 60 : 55) : 45,
    resizeMode: 'contain',
    tintColor: 'white',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
  },
  chatScrollView: {
  },
  chatContent: {
    paddingHorizontal: screenWidth > 400 ? 20 : 15,
    paddingVertical: screenWidth > 400 ? 15 : 12,
    paddingBottom: screenWidth > 400 ? 20 : 15,
  },
  messageContainer: {
    maxWidth: screenWidth > 400 ? '85%' : '90%',
    padding: screenWidth > 400 ? 15 : 12,
    borderRadius: screenWidth > 400 ? 20 : 18,
    marginBottom: screenWidth > 400 ? 15 : 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  botMessageContainer: { 
    backgroundColor: '#fff', 
    alignSelf: 'flex-start', 
    borderBottomLeftRadius: screenWidth > 400 ? 5 : 4 
  },
  userMessageContainer: { 
    backgroundColor: '#84a9da', 
    alignSelf: 'flex-end', 
    borderBottomRightRadius: screenWidth > 400 ? 5 : 4 
  },
  messageText: { 
    fontSize: screenWidth > 400 ? (screenWidth > 500 ? 17 : 16) : 15, 
    lineHeight: screenWidth > 400 ? 22 : 20, 
    marginBottom: screenWidth > 400 ? 6 : 5 
  },
  botMessageText: { 
    color: '#333' 
  },
  userMessageText: { 
    color: '#fff',
    fontWeight: '500'
  },
  timestamp: { 
    fontSize: screenWidth > 400 ? 11 : 10, 
    alignSelf: 'flex-end' 
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  botTimestamp: {
    color: '#666',
  },
  loadingContainer: {
    alignSelf: 'flex-start',
    marginBottom: screenWidth > 400 ? 15 : 12,
  },
  loadingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: screenWidth > 400 ? 16 : 14,
    paddingVertical: screenWidth > 400 ? 12 : 10,
    borderRadius: screenWidth > 400 ? 20 : 18,
  },
  loadingText: { 
    fontSize: screenWidth > 400 ? 14 : 13, 
    color: '#5691de', 
    marginLeft: screenWidth > 400 ? 8 : 6,
    fontStyle: 'italic'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: screenWidth > 400 ? 20 : 15,
    paddingVertical: screenWidth > 400 ? 12 : 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: screenWidth > 400 ? 25 : 22,
    paddingHorizontal: screenWidth > 400 ? 15 : 12,
    paddingVertical: Platform.OS === 'ios' ? (screenWidth > 400 ? 12 : 10) : 8,
    marginRight: screenWidth > 400 ? 10 : 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  textInput: {
    fontSize: screenWidth > 400 ? (screenWidth > 500 ? 17 : 16) : 15,
    color: '#333',
    maxHeight: screenWidth > 400 ? 80 : 70,
    textAlignVertical: 'top', 
    paddingTop: Platform.OS === 'android' ? 0 : 0, 
    paddingBottom: Platform.OS === 'android' ? 0 : 0, 
  },
  sendButton: {
    width: screenWidth > 400 ? (screenWidth > 500 ? 55 : 50) : 45,
    height: screenWidth > 400 ? (screenWidth > 500 ? 55 : 50) : 45,
    borderRadius: screenWidth > 400 ? 25 : 22,
    backgroundColor: '#a3b9df',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  sendButtonDisabled: { 
    backgroundColor: '#a3b9df' 
  },
  bottomSpacer: {
    height: screenWidth > 400 ? 10 : 8,
  },
});