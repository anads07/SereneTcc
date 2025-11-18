import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  ActivityIndicator, 
  Animated, 
  SafeAreaView, 
  ScrollView, 
  Dimensions, 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font'; 

const { width, height } = Dimensions.get('window');
const FONT_BASE_SIZE = width * 0.055;

const logoImage = require('../assets/src/perfil.png');

const ApresentacaoScreen = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    'Bree-Serif': require('../assets/fonts/BreeSerif-Regular.ttf'),
  });

  // Estados para controlar a opacidade e posição da animação
  const [logoOpacity] = useState(new Animated.Value(0));
  const [sereneOpacity] = useState(new Animated.Value(0));
  const [textOpacity] = useState(new Animated.Value(0));
  const [logoPosition] = useState(new Animated.Value(-100));
  const [serenePosition] = useState(new Animated.Value(100));

  useEffect(() => {
    if (fontsLoaded) {
      // 1. Animação de entrada da logo
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1, 
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(logoPosition, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        })
      ]).start(() => {
        // 2. Animação de entrada do texto "SERENE"
        Animated.parallel([
          Animated.timing(sereneOpacity, {
            toValue: 1, 
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(serenePosition, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          })
        ]).start(() => {
          // 3. Pausa para visualização
          setTimeout(() => {
            // 4. Animação de fade out da logo e "SERENE"
            Animated.parallel([
              Animated.timing(logoOpacity, {
                toValue: 0, 
                duration: 300,
                useNativeDriver: true,
              }),
              Animated.timing(sereneOpacity, {
                toValue: 0, 
                duration: 300,
                useNativeDriver: true,
              })
            ]).start(() => {
              // 5. Animação de fade in da frase final
              Animated.timing(textOpacity, {
                toValue: 1, 
                duration: 500,
                useNativeDriver: true,
              }).start(() => {
                // 6. Navega para a tela de Login após um breve atraso
                setTimeout(() => {
                  navigation.navigate('Login');
                }, 1000);
              });
            });
          }, 800);
        });
      });
    }
  }, [fontsLoaded, logoOpacity, sereneOpacity, textOpacity, logoPosition, serenePosition, navigation]);

  // Exibe um indicador de carregamento enquanto a fonte não estiver pronta
  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#84a9da" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#b9d2ff', '#d9e7ff', '#eaf3ff']}
        style={styles.background}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            
            {/* Container para logo + SERENE lado a lado */}
            <View style={styles.logoSereneContainer}>
              <Animated.View style={[
                styles.logoContainer, 
                { 
                  opacity: logoOpacity,
                  transform: [{ translateX: logoPosition }]
                }
              ]}>
                <Image
                  source={logoImage}
                  style={styles.logo}
                  accessibilityLabel="Logo do aplicativo Serene"
                />
              </Animated.View>
              
              <Animated.View style={[
                styles.sereneContainer, 
                { 
                  opacity: sereneOpacity,
                  transform: [{ translateX: serenePosition }]
                }
              ]}>
                <Text style={styles.sereneText}>
                  SERENE
                </Text>
              </Animated.View>
            </View>
            
            {/* Frase final da Apresentação */}
            <Animated.View style={[styles.textContainer, { opacity: textOpacity }]}>
              <Text style={styles.text}>
                SERENIDADE AO SEU ALCANCE
              </Text>
            </Animated.View>

          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

// estilos
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#b9d2ff', 
  },
  background: {
    flex: 1, 
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#b9d2ff',
  },
  
  // Estilos da primeira animação (Logo + Serene)
  logoSereneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sereneContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: width * 0.2,
    height: width * 0.2,
    resizeMode: 'contain',
    tintColor: '#84a9da',
  },
  sereneText: {
    fontFamily: 'Bree-Serif',
    fontSize: width > 400 ? (width > 500 ? 46 : 42) : 36,
    color: '#84a9da',
    fontWeight: 'bold', 
    marginLeft: 15,
  },
  
  textContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  text: {
    fontFamily: 'Bree-Serif',
    fontSize: FONT_BASE_SIZE > 24 ? 24 : FONT_BASE_SIZE, 
    color: '#0e458c',
    marginHorizontal: 30, 
    fontWeight: 'bold', 
    lineHeight: FONT_BASE_SIZE * 1.4,
    textAlign: 'center',
  },
});

export default ApresentacaoScreen;