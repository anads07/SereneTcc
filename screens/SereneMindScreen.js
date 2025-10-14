import React, { useState, useEffect, useRef } from 'react';
import {StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, TextInput, SafeAreaView, KeyboardAvoidingView, Platform, Dimensions, ActivityIndicator} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; 
import { GoogleGenAI } from '@google/genai'; // sdk da IA

const { width, height } = Dimensions.get('window');

const GEMINI_API_KEY = 'AIzaSyB2Grt1PUzamVoXaCnRK7mYYh8Wj8hZpQY'; 
const MODEL = 'gemini-2.5-flash'; 
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY }); // inicializa cliente

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
  const chatRef = useRef(null); // mantém sessão do chat

  // inicializa a sessão do chat e adiciona mensagem de boas-vindas
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
          timestamp: new Date()
        }
      ];
    });
  }, []);

  // scroll automático para a última mensagem
  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => scrollViewRef.current.scrollToEnd({ animated: true }), 100);
    }
  }, [messages]);

  // envia mensagem para a IA
  const sendMessageToAI = async (userMessage) => {
    setLoading(true);
    if (!chatRef.current) {
      setLoading(false);
      return "Erro: O chat não foi inicializado corretamente.";
    }

    try {
      const response = await chatRef.current.sendMessage({ message: userMessage });
      return response.text; // retorna texto da IA
    } catch (error) {
      console.error('Erro na API do Gemini:', error);
      return "Desculpe, houve um erro de comunicação com o Gemini. 😔";
    } finally {
      setLoading(false);
    }
  };

  // envia a mensagem do usuário e recebe resposta da IA
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

  // header do chat
  const Header = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Image source={require('../assets/src/seta.png')} style={styles.backArrow} />
      </TouchableOpacity>

      <View style={styles.headerTitleContainer}>
        <Image source={require('../assets/src/robo.png')} style={styles.robotIcon} />
        <Text style={styles.headerText}>ASSISTENTE IA</Text>
      </View>

      <View style={{ width: 40 }} />
    </View>
  );

  // renderiza cada mensagem
  const ChatMessage = ({ message }) => {
    if (message.role === 'system') return null;

    return (
      <View
        style={[
          styles.messageContainer,
          message.isUser ? styles.userMessageContainer : styles.botMessageContainer
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
          {message.timestamp ? message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : ''}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={['#e0f7fa', '#a2caff']} style={styles.background}>
        <Header />

        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0} 
        >
          <ScrollView
            style={styles.chatArea}
            contentContainerStyle={styles.chatContent}
            ref={scrollViewRef}
            showsVerticalScrollIndicator={true}
            keyboardShouldPersistTaps="handled"
          >
            {messages.filter(m => m.role !== 'system').map(message => (
              <ChatMessage key={message.id || message.role} message={message} />
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
      </LinearGradient>
    </SafeAreaView>
  );
};

export default SereneMindScreen;

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
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center'
  },
  chatArea: {
    flex: 1,
    height: 350
  },
  chatContent: {
    flexGrow: 1,
    paddingVertical: 15,
    paddingHorizontal: 15,
    minHeight: height - 200, 
  },
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
  messageText: {
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 4
  },
  botMessageText: {
    color: '#333'
  },
  userMessageText: {
    color: '#000'
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    alignSelf: 'flex-end'
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 20,
    marginBottom: 15
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0'
  },
  textInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginRight: 10,
    fontSize: 16,
    maxHeight: 100
  },
  sendButton: {
    backgroundColor: '#84a9da',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc'
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  bottomSpacer: {
    height: 20
  }
});