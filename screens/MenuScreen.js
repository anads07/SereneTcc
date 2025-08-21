import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const menuImage = require('../assets/src/circulomenu.png');

const MenuScreen = ({ navigation }) => {
  const menuItems = [
    { text: 'Acesse seu perfil', color: '#afcdf2', screen: 'Profile' },
    { text: 'Diário emocional', color: '#96bef0', screen: 'Diario' },
    { text: 'Atividades recomendadas', color: '#7bb0ea', screen: 'Recomendacao' },
    { text: 'Relatório semanal', color: '#64a1e6', screen: 'Relatorio' },
    { text: 'Converse com o ChatBot', color: '#5691de', screen: 'Chat' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#a1bce2', '#fff']}
        style={styles.background}
      >
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.container}>
            <Text style={styles.title}>BEM VINDO AO SERENE</Text>
            <Image source={menuImage} style={styles.menuImage} />
          </View>
          <View style={styles.balloonContainer}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.menuButton,
                  { backgroundColor: item.color },
                  index === menuItems.length - 1 && styles.lastButton
                ]}
                onPress={() => navigation.navigate(item.screen)}
                accessible={true}
                accessibilityLabel={`Navegar para ${item.text}`}
                accessibilityHint={`Clique para acessar ${item.text}`}
              >
                <Text style={styles.buttonText}>{item.text}</Text>
              </TouchableOpacity>
            ))}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 40,
    alignItems: 'center',
    flexGrow: 1,
  },
  container: {
    width: '100%',
    alignItems: 'center',
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
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 20,
    marginHorizontal: 20,
  },
  menuImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 15,
  },
  balloonContainer: {
    width: '100%',
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuButton: {
    width: '100%',
    paddingVertical: 18,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.3)',
  },
  lastButton: {
    borderBottomWidth: 0,
  },
  buttonText: {
    color: 'white',
    fontFamily: 'Bree-Serif',
    fontSize: 22,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
});

export default MenuScreen;