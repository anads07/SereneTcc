import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, ActivityIndicator, Animated, SafeAreaView, ScrollView, Dimensions, } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';

const { width, height } = Dimensions.get('window');
const FONT_BASE_SIZE = width * 0.055;

const logoImage = require('../assets/src/logo.png');

const ApresentacaoScreen = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    'Bree-Serif': require('../assets/fonts/BreeSerif-Regular.ttf'),
  });

  const [logoOpacity] = useState(new Animated.Value(0));
  const [textOpacity] = useState(new Animated.Value(0));

  useEffect(() => {
    if (fontsLoaded) {
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        Animated.timing(logoOpacity, {
          toValue: 0,
          duration: 500,
          delay: 2000,
          useNativeDriver: true,
        }).start(() => {
          Animated.timing(textOpacity, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }).start(() => {
            setTimeout(() => {
              navigation.navigate('Login');
            }, 2000);
          });
        });
      });
    }
  }, [fontsLoaded, logoOpacity, textOpacity, navigation]);

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
            
            <Animated.View style={[styles.logoContainer, { opacity: logoOpacity }]}>
              <Image
                source={logoImage}
                style={styles.logo}
                accessibilityLabel="Logo do aplicativo Serene"
              />
            </Animated.View>
            
            <Animated.View style={[styles.textContainer, { opacity: textOpacity }]}>
              <Text style={styles.text}>
                TRANSFORME A SUA MENTE
              </Text>
            </Animated.View>

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
    backgroundColor: '#fff',
  },
  logoContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  textContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  logo: {
    width: width * 3, 
    height: width * 0.9, 
    resizeMode: 'contain',
  },
  text: {
    fontFamily: 'Bree-Serif',
    fontSize: FONT_BASE_SIZE > 24 ? 24 : FONT_BASE_SIZE, 
    color: '#0c4793',
    marginHorizontal: 30, 
    lineHeight: FONT_BASE_SIZE * 1.4,
    textAlign: 'center',
    fontWeight: 'bold', 
  },
});

export default ApresentacaoScreen;