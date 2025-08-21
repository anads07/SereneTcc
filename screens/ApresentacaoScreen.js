import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator, 
  Animated,
  SafeAreaView 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';

const logoImage = require('../assets/src/logo.png');
const apresentacaoImage = require('../assets/src/apresentacao.png');

const ApresentacaoScreen = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    'Bree-Serif': require('../assets/fonts/BreeSerif-Regular.ttf'),
  });

  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }, []);

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
        <View style={styles.container}>
          <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
            <Image
              source={logoImage}
              style={styles.logo}
              accessibilityLabel="Logo do aplicativo Serene"
              accessibilityHint="Imagem representando a logo do aplicativo de saúde mental"
            />

            <Image
              source={apresentacaoImage}
              style={styles.illustration}
              accessibilityLabel="Ilustração de apresentação"
              accessibilityHint="Imagem representando saúde mental e bem-estar"
            />

            <Text style={styles.text}>
              Transforme sua mente, cuide de sua alma: juntos, podemos construir um caminho para o bem-estar mental.
            </Text>
          </Animated.View>

          <View style={styles.arrowButton}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              accessible={true}
              accessibilityLabel="Próxima tela"
              accessibilityHint="Navega para a tela de login"
              accessibilityRole="button"
            >
              <Ionicons name="arrow-forward-circle" size={60} color="#0c4793" style={styles.arrowIcon} />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff', // Cor de fallback
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  background: {
    flex: 1, // MUDEI de position: absolute para flex: 1
  },
  content: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
    width: '100%',
  },
  logo: {
    width: 150,
    height: 50,
    resizeMode: 'contain',
    alignItems: 'center',
    marginBottom: -20,
  },
  illustration: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    marginTop: -120
  },
  text: {
    fontFamily: 'BreeSerif-Regular',
    fontSize: 22,
    color: '#0c4793',
    marginHorizontal: 40,
    lineHeight: 30,
    marginTop: -120,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  arrowButton: {
    position: 'absolute',
    bottom: 40,
    right: 40,
  },
  arrowIcon: {
    textShadowColor: '#001a4d',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
  },
});

export default ApresentacaoScreen;