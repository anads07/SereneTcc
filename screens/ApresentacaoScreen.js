import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator, 
  Animated,
  SafeAreaView,
  ScrollView,
  Dimensions, 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';

// Obtém a altura e largura da tela para responsividade aprimorada
const { width, height } = Dimensions.get('window');

// Define um tamanho base de fonte que escala com a largura da tela
const FONT_BASE_SIZE = width * 0.055; 

// imagens utilizadas na tela
const logoImage = require('../assets/src/logo.png');
const apresentacaoImage = require('../assets/src/apresentacao.png');

const ApresentacaoScreen = ({ navigation }) => {
  // carregamento de fontes
  const [fontsLoaded] = useFonts({
    'Bree-Serif': require('../assets/fonts/BreeSerif-Regular.ttf'),
  });

  // animação de fade-in
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]); 

  // mostra loading enquanto a fonte não carregou
  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0c4793" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#fff', '#a4c4ff']}
        style={styles.background}
      >
        {/* Usamos o ScrollView para permitir scroll em telas muito pequenas, mas forçamos o preenchimento da tela */}
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Container principal para o conteúdo centralizado */}
          <View style={styles.container}>
            
            {/* Conteúdo principal com animação */}
            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
              {/* Logo */}
              <View style={styles.logoContainer}>
                <Image
                  source={logoImage}
                  style={styles.logo}
                  accessibilityLabel="Logo do aplicativo Serene"
                  accessibilityHint="Imagem representando a logo do aplicativo de saúde mental"
                />
              </View>
              
              {/* Ilustração (agora tem margem inferior controlada) */}
              <View style={styles.illustrationContainer}>
                <Image
                  source={apresentacaoImage}
                  style={styles.illustration}
                  accessibilityLabel="Ilustração de apresentação"
                  accessibilityHint="Imagem representando saúde mental e bem-estar"
                />
              </View>

              {/* Texto (agora tem margem superior controlada) */}
              <View style={styles.textContainer}>
                <Text style={styles.text}>
                  Transforme sua mente, cuide de sua alma: juntos, podemos construir um caminho para o bem-estar mental.
                </Text>
              </View>
            </Animated.View>

            {/* botão para navegar à próxima tela (posicionado absolutamente) */}
            <View style={styles.arrowButton}>
              <TouchableOpacity
                onPress={() => navigation.navigate('Login')}
                accessible={true}
                accessibilityLabel="Próxima tela"
                accessibilityHint="Navega para a tela de login"
                accessibilityRole="button"
              >
                <Ionicons 
                  name="arrow-forward-circle" 
                  size={height * 0.08} // Tamanho relativo à altura da tela
                  color="#0c4793" 
                  style={styles.arrowIcon} 
                />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff', 
  },
  background: {
    flex: 1, 
  },
  // *** ALTERAÇÃO CHAVE: Centraliza o conteúdo verticalmente para telas grandes
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center', 
  },
  container: {
    flex: 1,
    paddingHorizontal: 20, 
    paddingTop: height * 0.05, 
    alignItems: 'center',
    justifyContent: 'center', // Adicionado para centralizar o `content`
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  content: {
    // *** ALTERAÇÃO CHAVE: Mudado de 'space-between' para 'center' para evitar esticamento excessivo
    justifyContent: 'center', 
    alignItems: 'center',
    width: '100%',
    // Padding vertical geral para evitar que o conteúdo toque nas bordas
    paddingVertical: height * 0.04, 
    // Removemos paddingBottom fixo, pois o botão está absoluto e a centralização garante o espaço
  },
  
  // Containers para melhor controle de espaçamento
  logoContainer: {
    marginBottom: height * 0.03, // Margem relativa
  },
  illustrationContainer: {
    // Reduzimos o flex: 1 para que não ocupe espaço desnecessário
    marginBottom: height * 0.03, // Margem relativa
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    // Não precisamos de margin-top, a margin-bottom da ilustração resolve o espaço
    marginTop: 0, 
  },

  logo: {
    width: width * 0.4, // Largura adaptativa (40% da largura da tela)
    height: width * 0.15, // Altura adaptativa
    resizeMode: 'contain',
  },
  illustration: {
    width: width * 0.75, // Ajustado para ser 75% da largura da tela
    // Usaremos uma altura fixa relativa para evitar que estique demais em tablets
    height: height * 0.4, 
    maxHeight: 350, 
    resizeMode: 'contain',
  },
  text: {
    fontFamily: 'Bree-Serif',
    // *** ALTERAÇÃO CHAVE: Ajustando o tamanho da fonte com base em FONT_BASE_SIZE ***
    fontSize: FONT_BASE_SIZE > 24 ? 24 : FONT_BASE_SIZE, 
    color: '#0c4793',
    marginHorizontal: 40,
    lineHeight: FONT_BASE_SIZE * 1.4, // Line height proporcional ao tamanho da fonte
    textAlign: 'center',
    fontWeight: 'bold',
  },
  
  // O botão de seta permanece fixo no canto
  arrowButton: {
    position: 'absolute',
    bottom: height * 0.05, // Posição relativa
    right: width * 0.05, // Posição relativa
    zIndex: 10, 
  },
  arrowIcon: {
    textShadowColor: '#001a4d',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
  },
});

export default ApresentacaoScreen;