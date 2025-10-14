import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ActivityIndicator, Animated,SafeAreaView,ScrollView,Dimensions, } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const FONT_BASE_SIZE = width * 0.055; // tamanho de fonte responsivo

const logoImage = require('../assets/src/logo.png');
const apresentacaoImage = require('../assets/src/apresentacao.png');

const ApresentacaoScreen = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    'Bree-Serif': require('../assets/fonts/BreeSerif-Regular.ttf'),
  });

  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // animação de entrada suave
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

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
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            
            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
              <View style={styles.logoContainer}>
                <Image
                  source={logoImage}
                  style={styles.logo}
                  accessibilityLabel="Logo do aplicativo Serene"
                />
              </View>
              
              <View style={styles.illustrationContainer}>
                <Image
                  source={apresentacaoImage}
                  style={styles.illustration}
                  accessibilityLabel="Ilustração de apresentação"
                />
              </View>

              <View style={styles.textContainer}>
                <Text style={styles.text}>
                TRANSFORME SUA MENTE.
                  {/* Transforme sua mente., cuide de sua alma: juntos, podemos construir um caminho para o bem-estar mental. */}
                </Text>
              </View>
            </Animated.View>

            {/* botão para próxima tela */}
            <View style={styles.arrowButton}>
              <TouchableOpacity
                onPress={() => navigation.navigate('Login')}
                accessible={true}
                accessibilityLabel="Próxima tela"
                accessibilityRole="button"
              >
                <Ionicons 
                  name="arrow-forward-circle" 
                  size={height * 0.08}
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
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center', 
  },
  container: {
    flex: 1,
    paddingHorizontal: 20, 
    paddingTop: height * 0.05, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  content: {
    justifyContent: 'center', 
    alignItems: 'center',
    width: '100%',
    paddingVertical: height * 0.04, 
  },
  logoContainer: {
    marginBottom: height * 0.03,
  },
  illustrationContainer: {
    marginBottom: height * 0.03,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    marginTop: 0, 
  },
  logo: {
    width: width * 0.4,
    height: width * 0.15,
    resizeMode: 'contain',
  },
  illustration: {
    width: width * 0.75,
    height: height * 0.4, 
    maxHeight: 350, 
    resizeMode: 'contain',
  },
  text: {
    fontFamily: 'Bree-Serif',
    fontSize: FONT_BASE_SIZE > 24 ? 24 : FONT_BASE_SIZE, 
    color: '#0c4793',
    marginHorizontal: 40,
    lineHeight: FONT_BASE_SIZE * 1.4,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  arrowButton: {
    position: 'absolute',
    bottom: height * 0.05,
    right: width * 0.05,
    zIndex: 10, 
  },
  arrowIcon: {
    textShadowColor: '#001a4d',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
  },
});

export default ApresentacaoScreen;