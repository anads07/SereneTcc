import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// imagem do menu principal
const menuImage = require('../assets/src/circulomenu.png');

const MenuScreen = ({ navigation, route }) => {
  // Pega o userId passado da tela de login
  const { userId } = route.params || {};

  // itens do menu com cores e telas correspondentes
  const menuItems = [
    { text: 'Acesse seu perfil', color: '#afcdf2', screen: 'Profile' },
    { text: 'Diário emocional', color: '#96bef0', screen: 'Diario' },
    { text: 'Atividades recomendadas', color: '#7bb0ea', screen: 'Recomendacao' },
    { text: 'Relatório semanal', color: '#64a1e6', screen: 'Relatorio' },
    { text: 'Converse com o ChatBot', color: '#5691de', screen: 'Chat' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={{ flex: 1 }}>
        {/* fundo com gradiente */}
        <LinearGradient
          colors={['#a1bce2', '#fff']}
          style={StyleSheet.absoluteFill} // ocupa toda a tela
        />

        {/* conteúdo do menu */}
        <View style={styles.container}>
          <Text style={styles.title}>BEM VINDO AO SERENE</Text>
          <Image source={menuImage} style={styles.menuImage} />
          <View style={styles.buttonContainer}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.balloonContainer, { backgroundColor: item.color }]}
                // Passa o userId para a tela do diário, se estiver disponível
                onPress={() => navigation.navigate(item.screen, { userId: userId })}
              >
                <View style={styles.balloon}>
                  <Text style={styles.buttonText}>{item.text}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 33,
    fontWeight: 'bold',
    fontFamily: 'Bree-Serif',
    color: '#fff',
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: {
      width: 1,
      height: 1,
    },
    textShadowRadius: 20,
    marginHorizontal: 20,
  },
  menuImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 15,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  balloonContainer: {
    width: '100%',
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 15,
  },
  balloon: {
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default MenuScreen;