import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions, ScrollView, ImageBackground } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';

const screenWidth = Dimensions.get('window').width;

// Frases motivacionais para o post-it
const frases = [
  'Você é mais forte do que imagina. Cada dia é uma nova chance para seguir em frente.',
  'Seu esforço está construindo um futuro incrível.',
  'Tudo o que você precisa já está dentro de você.',
  'Desafios são oportunidades disfarçadas.',
  'Você pode ir além do que imagina.',
  'Não tenha medo de recomeçar. É uma chance de fazer diferente.',
  'Você já superou tanto. Confie no seu caminho.',
  'Cada passo pequeno ainda é progresso.',
  'Você está exatamente onde precisa estar para crescer.',
  'Não desista. Às vezes, é no final da subida que a vista compensa.',
  'Seu valor não depende de um dia ruim.',
  'Respire fundo. Você está indo bem.',
  'Acredite: dias melhores estão vindo.',
  'Mesmo devagar, você está indo na direção certa.',
  'Você é capaz de coisas incríveis.'
];

// Dados de humor padrão
const humorDataDefault = {
  raiva: 2,
  triste: 5,
  media: 1,
  feliz: 8,
  muitofeliz: 10
};

// Cores do gráfico
const chartColors = [
  '#e52b17', // Estressado
  '#ff9900', // Magoado
  '#f2cd20', // Pensativo
  '#66cc33', // Bem
  '#00bf63'  // Ótimo
];

const RelatorioScreen = ({ navigation }) => {
  const [frase, setFrase] = useState('');
  const [humorData, setHumorData] = useState(humorDataDefault);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * frases.length);
    setFrase(frases[randomIndex]);
  }, []);

  const registrarHumor = (tipo) => {
    setHumorData((prev) => ({
      ...prev,
      [tipo]: prev[tipo] + 1
    }));
  };

  const data = [
    { name: 'Estressado', population: humorData.raiva, color: chartColors[0], legendFontColor: '#000', legendFontSize: 16 },
    { name: 'Magoado', population: humorData.triste, color: chartColors[1], legendFontColor: '#000', legendFontSize: 16 },
    { name: 'Pensativo', population: humorData.media, color: chartColors[2], legendFontColor: '#000', legendFontSize: 16 },
    { name: 'Bem', population: humorData.feliz, color: chartColors[3], legendFontColor: '#000', legendFontSize: 16 },
    { name: 'Ótimo', population: humorData.muitofeliz, color: chartColors[4], legendFontColor: '#000', legendFontSize: 16 }
  ];

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    const parent = navigation.getParent?.();
    if (parent?.canGoBack()) {
      parent.goBack();
      return;
    }
    navigation.reset({
      index: 0,
      routes: [{ name: 'Menu' }],
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#a4c4ff', '#c5d7f8', '#e3eaf5']}
        style={styles.background}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          style={styles.scrollView}
        >
          {/* CABEÇALHO */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={handleBack}
              style={styles.backButton}
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            >
              <Image source={require('../assets/src/seta.png')} style={styles.backIcon} />
            </TouchableOpacity>

            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerText}>COMO ESTÁ SE SENTINDO HOJE?</Text>
            </View>
          </View>

          {/* EMOÇÕES */}
          <View style={styles.emotionsContainer}>
            <TouchableOpacity onPress={() => registrarHumor('raiva')} style={styles.emojiButton}>
              <Image source={require('../assets/src/raiva.png')} style={styles.emoji} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => registrarHumor('triste')} style={styles.emojiButton}>
              <Image source={require('../assets/src/triste.png')} style={styles.emoji} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => registrarHumor('media')} style={styles.emojiButton}>
              <Image source={require('../assets/src/media.png')} style={styles.emoji} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => registrarHumor('feliz')} style={styles.emojiButton}>
              <Image source={require('../assets/src/feliz.png')} style={styles.emoji} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => registrarHumor('muitofeliz')} style={styles.emojiButton}>
              <Image source={require('../assets/src/muitofeliz.png')} style={styles.emoji} />
            </TouchableOpacity>
          </View>

          {/* Barra de separação */}
          <Image source={require('../assets/src/barra.png')} style={styles.barra} />

          {/* POST-IT COM SOMBRA */}
          <View style={styles.postitContainer}>
            <Image
              source={require('../assets/src/postit.png')}
              style={styles.postitShadow}
              resizeMode="contain"
            />
            <ImageBackground
              source={require('../assets/src/postit.png')}
              style={styles.postitImage}
              imageStyle={{ resizeMode: 'contain' }}
            >
              <Text
                style={styles.frase}
                numberOfLines={6}
                ellipsizeMode="tail"
              >
                {frase}
              </Text>
            </ImageBackground>
          </View>

          {/* RESUMO SEMANAL (GRÁFICO) */}
          <View style={styles.resumoContainer}>
            <Text style={styles.resumoText}>RESUMO SEMANAL</Text>
            <PieChart
              data={data}
              width={screenWidth * 0.7}
              height={160}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
              hasLegend
              chartConfig={{
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              style={styles.chartStyle}
            />
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
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    padding: 10,
    zIndex: 100,
  },
  backIcon: {
    width: 40,
    height: 40,
    tintColor: 'white',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 28,
    fontFamily: 'Bree-Serif',
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 40,
    lineHeight: 30,
    includeFontPadding: false,
    textAlign: 'center',
  },
  emotionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  emojiButton: {
    padding: 10,
    borderRadius: 50,
  },
  emoji: {
    width: 40,
    height: 40,
  },
  barra: {
    width: '80%',
    height: 20,
    alignSelf: 'center',
    marginVertical: 10,
  },
  postitContainer: {
    alignSelf: 'center',
    width: screenWidth * 0.8,
    height: screenWidth * 0.8 * (230 / 320),
    marginVertical: 10,
    transform: [{ rotate: '-3deg' }],
  },
  postitImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  postitShadow: {
    width: '100%',
    height: '100%',
    tintColor: 'black',
    opacity: 0.2,
    position: 'absolute',
    top: 6,
    left: 6,
  },
  frase: {
    color: 'black',
    fontSize: 18,
    fontFamily: 'Bree-Serif',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 40,
    paddingVertical: 35,
  },
  resumoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    marginHorizontal: 20,
    padding: 20,
    alignItems: 'center',
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  resumoText: {
    fontSize: 22,
    fontFamily: 'Bree-Serif',
    fontWeight: 'bold',
    color: '#0c4793',
    marginBottom: 10,
    marginHorizontal: 10,
  },
});

export default RelatorioScreen;

