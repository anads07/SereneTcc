import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, SafeAreaView, Dimensions, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Obtém a altura da tela para responsividade
const { height } = Dimensions.get('window');

// imagem do menu principal
const menuImage = require('../assets/src/circulomenu.png'); 

// Função auxiliar para aplicar estilos de borda condicionalmente
const getButtonBorderStyles = (index, total) => {
    const radius = 15; 
    const styles = {};

    // Adiciona a linha de separação entre os botões
    if (index < total - 1) {
        styles.borderBottomWidth = 1;
        styles.borderBottomColor = '#c1d4f2'; 
    }

    // Último botão ("ChatBot")
    if (index === total - 1) {
        styles.borderBottomLeftRadius = radius;
        styles.borderBottomRightRadius = radius;
    }
    
    return styles;
};

const MenuScreen = ({ navigation, route }) => {
  // Pega o userId passado da tela de login
  const { userId } = route.params || {};

  // ITENS: Ordem de CIMA PARA BAIXO (Acesse Perfil -> ChatBot)
  const menuItems = [
    { text: 'Acesse seu perfil', color: '#afcdf2', screen: 'Profile' },    
    { text: 'Diário emocional', color: '#96bef0', screen: 'Diario' },
    { text: 'Atividades recomendadas', color: '#7bb0ea', screen: 'Recomendacao' },
    { text: 'Relatório emocional', color: '#64a1e6', screen: 'Relatorio' }, 
    { text: 'ChatBot', color: '#5691de', screen: 'Chat' },                 
  ];

  const handlePress = (screenName) => {
    navigation.navigate(screenName, { userId });
  };

  // Tamanho da imagem
  const imageSize = height * 0.22; 

  return (
    <SafeAreaView style={styles.safeArea}>
      
      {/* Fundo com Degradê */}
      <LinearGradient
          colors={['#a4c4ff', '#fefeff']} 
          style={StyleSheet.absoluteFill} 
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
      />
      
      {/* ScrollView: Permite a rolagem */}
      <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          style={styles.scrollView}
      >
          
          {/* Container principal que ocupa a largura total */}
          <View style={styles.contentContainer}>
              
              {/* Bloco de Conteúdo (Header e Botões) */}
              <View style={styles.buttonBlock}>
                  
                  {/* Título e Imagem - Centralizados no topo com padding reduzido */}
                  <View style={styles.headerContent}>
                      <Text style={styles.title}>SEJA BEM VINDO AO SERENE</Text>
                      <Image 
                          source={menuImage} 
                          style={[styles.menuImage, { width: imageSize, height: imageSize }]} 
                      />
                  </View>

                  {/* Bloco dos botões */}
                  <View style={styles.buttonsWrapper}>
                      {menuItems.map((item, index) => {
                          const total = menuItems.length;

                          return (
                              <TouchableOpacity
                                  key={index}
                                  style={[
                                      styles.buttonWrapper,
                                      { backgroundColor: item.color }, // Cor sólida do botão
                                      getButtonBorderStyles(index, total)
                                  ]}
                                  onPress={() => handlePress(item.screen)}
                              >
                                  <View style={styles.buttonContent}>
                                      <Text style={styles.buttonText}>{item.text}</Text>
                                  </View>
                              </TouchableOpacity>
                          );
                      })}
                  </View>
              </View>
          </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent', 
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1, 
    justifyContent: 'flex-end', 
  },
  contentContainer: {
      width: '100%', 
      maxWidth: 500, 
      alignSelf: 'center', 
      overflow: 'hidden', 
  },
  buttonBlock: {
      paddingHorizontal: 0,
      paddingVertical: 0,
      backgroundColor: 'transparent', 
  },
  headerContent: {
      // REDUZIDO de 0.08 para 0.06 (6% da altura) para subir o conteúdo
      paddingTop: height * 0.06, 
      paddingBottom: height * 0.06, 
      alignItems: 'center',
      justifyContent: 'center',
  },
  title: {
    fontSize: height * 0.045, 
    fontWeight: 'bold',
    fontFamily: 'Bree-Serif', 
    color: '#fff',
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 20, 
    marginHorizontal: 20,
  },
  menuImage: {
    width: height * 0.22, // Mantido
    height: height * 0.22, // Mantido
    resizeMode: 'contain',
  },
  buttonsWrapper: {
      borderTopLeftRadius: 15, 
      borderTopRightRadius: 15,
      overflow: 'hidden', 
  },
  buttonWrapper: {
      width: '100%',
      marginVertical: 0, 
      overflow: 'hidden', 
  },
  buttonContent: {
    paddingVertical: 25, 
    paddingHorizontal: 20,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default MenuScreen;