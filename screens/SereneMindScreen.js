import React, { useState, useEffect, useRef } from 'react';
import {StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, TextInput, SafeAreaView, KeyboardAvoidingView, Platform, Dimensions, ActivityIndicator, Alert, StatusBar} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; 
import { GoogleGenAI } from '@google/genai'; 

// === CONFIGURAÇÃO INICIAL ===
const GEMINI_API_KEY = 'AIzaSyDp-mIBmDgscVsJYhg2gC9Pjc7ZJsG8NEg'; 
const MODEL = 'gemini-2.5-flash'; 
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY }); 

// Alturas fixas para cálculo (aproximadas baseadas nos seus estilos)
const HEADER_SAFE_AREA_HEIGHT = Platform.select({
  ios: 90, 
  android: 70 + (StatusBar.currentHeight || 0), 
  default: 80
});

// Altura aproximada da área de input (incluindo padding)
const INPUT_AREA_HEIGHT = 70; 

const SereneMindScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([
    { 
      role: 'system', 
      content: 'Você é SerenMind, uma IA de apoio emocional, criada para ser o assistente mais amoroso, gentil e simpático possível. Responda com empatia, emojis e no máximo 4 frases. Nunca se apresente como profissional de saúde. Se houver risco de vida, recomende CVV (188) ou emergência.'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef();
  const chatRef = useRef(null); 

  // Calcula a altura da área de chat dinamicamente
  const { height: screenHeight } = Dimensions.get('window');
  const chatAreaCalculatedHeight = screenHeight - HEADER_SAFE_AREA_HEIGHT - INPUT_AREA_HEIGHT - (Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0);

  // === EFEITOS E LÓGICA DE SCROLL ===

  useEffect(() => {
    chatRef.current = ai.chats.create({ 
      model: MODEL,
      config: {
        systemInstruction: messages.find(m => m.role === 'system').content,
        temperature: 0.5,
        maxOutputTokens: 300,
      }
    });

    const initialWelcomeMessage = 'Olá! Eu sou o SerenMind 🤗\nEstou aqui para te ouvir e ajudar. Pode me contar o que está sentindo.';
    setMessages(prev => {
      if (prev.some(m => m.id === 'initial-welcome')) return prev;
      return [
        ...prev,
        {
          id: 'initial-welcome',
          text: initialWelcomeMessage,
          isUser: false, 
          role: 'assistant', 
          timestamp: new Date() // Adicionando timestamp aqui
        }
      ];
    });
  }, []);

  const scrollToBottom = () => {
    if (scrollViewRef.current) {
        const timer = setTimeout(() => scrollViewRef.current.scrollToEnd({ animated: true }), 200); 
        return () => clearTimeout(timer);
    }
  };

  useEffect(scrollToBottom, [messages]);
  
  // === LÓGICA DE MENSAGENS E ENVIO (mantida) ===

  const sendMessageToAI = async (userMessage) => {
    setLoading(true);
    // ... (Lógica de envio mantida)
    try {
      const response = await chatRef.current.sendMessage({ message: userMessage });
      return response.text;
    } catch (error) {
      console.error('Erro na API do Gemini:', error);
      Alert.alert('Erro de IA', 'Não foi possível se comunicar com o assistente. Verifique sua conexão ou a chave da API.');
      return "Desculpe, houve um erro de comunicação com o Gemini. 😔";
    } finally {
      setLoading(false);
    }
  };

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

  // === COMPONENTES DE RENDERIZAÇÃO ===

  const Header = () => (
    <SafeAreaView style={styles.floatingHeaderContainer}> 
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          {/* Supondo que você tem o asset da seta */}
          <Image source={require('../assets/src/seta.png')} style={styles.backArrow} /> 
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          {/* Supondo que você tem o asset do robô */}
          <Image source={require('../assets/src/robo.png')} style={styles.robotIcon} />
          <Text style={styles.headerText}>ASSISTENTE IA</Text>
        </View>

        <View style={{ width: 40 }} />
      </View>
    </SafeAreaView>
  );

  const ChatMessage = ({ message }) => {
    // CORREÇÃO CRÍTICA 1: Ignorar mensagens do sistema que não devem ser exibidas
    if (message.role === 'system') return null;

    // CORREÇÃO CRÍTICA 2: Garantir que message.timestamp exista e seja um objeto Date antes de chamar o método
    const timeString = (message.timestamp instanceof Date && !isNaN(message.timestamp))
      ? message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      : ''; // Retorna string vazia se for inválido

    return (
      <View
        style={[
          styles.messageContainer,
          message.isUser ? styles.userMessageContainer : styles.botMessageContainer,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            message.isUser ? styles.userMessageText : styles.botMessageText
          ]}
        >
          {message.text}
        </Text>
        <Text style={styles.timestamp}>
          {timeString}
        </Text>
      </View>
    );
  };
  
  const displayMessages = messages.filter(m => m.role !== 'system');

  // === ESTRUTURA PRINCIPAL ===

  return (
    <LinearGradient colors={['#e0f7fa', '#a2caff']} style={styles.fullScreenContainer}>
      
      <StatusBar barStyle="light-content" backgroundColor="#a2caff" />
      
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        keyboardVerticalOffset={0} 
      >
        <ScrollView
          style={[styles.chatArea, { height: chatAreaCalculatedHeight }]} 
          contentContainerStyle={styles.chatContent} 
          ref={scrollViewRef}
          showsVerticalScrollIndicator={true}
          keyboardShouldPersistTaps="handled"
          scrollEnabled={true} 
        >
          {/* View de espaçamento para compensar o Header flutuante */}
          <View style={{ height: HEADER_SAFE_AREA_HEIGHT + 10 }} /> 

          {/* CORREÇÃO: Usamos displayMessages que já filtra o 'system' */}
          {displayMessages.map((message, index) => (
            <ChatMessage key={message.id || index} message={message} /> 
          ))}

          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#84a9da" />
              <Text style={styles.loadingText}>SerenMind está digitando...</Text>
            </View>
          )}

          <View style={styles.bottomSpacer} />
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput} 
            value={inputText}
            onChangeText={setInputText}
            placeholder="Digite sua mensagem..."
            placeholderTextColor="#999"
            multiline
            maxLength={500}
            editable={!loading}
          />
          <TouchableOpacity
            style={[styles.sendButton, (!inputText.trim() || loading) && styles.sendButtonDisabled]}
            onPress={handleSendMessage}
            disabled={!inputText.trim() || loading}
          >
            {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.sendButtonText}>Enviar</Text>}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <Header />
    </LinearGradient>
  );
};

export default SereneMindScreen;

// === BLOCO DE ESTILOS ORGANIZADO (mantido) ===

const styles = StyleSheet.create({
  // --- LAYOUT PRINCIPAL E CONTAINERS DE TELA ---
  fullScreenContainer: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1, 
  },
  chatArea: {
    // Altura é definida inline.
  },
  chatContent: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  
  // --- ESTILOS DO HEADER (FLUTUANTE) ---
  floatingHeaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10, 
    backgroundColor: '#a2caff', 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#a2caff',
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center'
  },
  
  // --- ESTILOS DE ÍCONES E BOTÕES ---
  backButton: { padding: 10 },
  backArrow: { width: 40, height: 40, resizeMode: 'contain', tintColor: 'white' },
  robotIcon: { width: 40, height: 40, marginRight: 8, tintColor: 'white', resizeMode: 'contain' },

  // --- ESTILOS DAS MENSAGENS ---
  messageContainer: {
    maxWidth: '85%',
    padding: 12,
    borderRadius: 20,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84
  },
  botMessageContainer: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 5
  },
  userMessageContainer: {
    backgroundColor: '#b0e0e6',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 5
  },
  messageText: { fontSize: 16, lineHeight: 20, marginBottom: 4 },
  botMessageText: { color: '#333' },
  userMessageText: { color: '#000' },
  timestamp: { fontSize: 12, color: '#666', alignSelf: 'flex-end' },
  loadingContainer: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', backgroundColor: '#f0f0f0', padding: 12, borderRadius: 20, marginBottom: 15 },
  loadingText: { fontSize: 14, color: '#666', marginLeft: 8 },
  
  // --- ESTILOS DO CAMPO DE INPUT ---
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    height: INPUT_AREA_HEIGHT 
  },
  textInput: { flex: 1, backgroundColor: '#f5f5f5', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 12, marginRight: 10, fontSize: 16 },
  sendButton: { backgroundColor: '#84a9da', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 20 },
  sendButtonDisabled: { backgroundColor: '#ccc' },
  sendButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  bottomSpacer: { height: 20 }
});