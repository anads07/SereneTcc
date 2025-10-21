import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions, ScrollView, ImageBackground, Alert, Platform } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient'; 

const screenWidth = Dimensions.get('window').width;
const API_URL = 'http://172.27.160.1:3000'; 

// frases motivacionais para o post-it
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

const moods = [
  { name: 'Estressado', type: 'estressado', color: '#e52b17' },
  { name: 'Magoado', type: 'magoado', color: '#ff9900' },
  { name: 'Pensativo', type: 'pensativo', color: '#f2cd20' },
  { name: 'Bem', type: 'bem', color: '#66cc33' },
  { name: 'Ótimo', type: 'otimo', color: '#00bf63' }
];

const RelatorioScreen = ({ navigation, route }) => {
  const { userId } = route.params;
  const [frase, setFrase] = useState('');
  const [humorData, setHumorData] = useState([]);
  
  const [hasRegisteredToday, setHasRegisteredToday] = useState(false);
  const checkDailyRegistration = async () => {
    try {
      const response = await fetch(`${API_URL}/mood/hasRegisteredToday/${userId}`);
      if (!response.ok) {
        return;
      }
      const data = await response.json();
      if (data.registered) {
          setHasRegisteredToday(true); 
      }
    } catch (error) {
      console.error('Erro ao verificar registro diário:', error);
    }
  };

  const fetchHumorData = async () => {
    try {
      const response = await fetch(`${API_URL}/mood/getReport/${userId}`);
      if (!response.ok) {
        throw new Error('Não foi possível carregar os dados do relatório.');
      }
      const data = await response.json();

      const formattedData = data.map(item => {
        const mood = moods.find(m => m.type === item.mood_type);
        return {
          name: mood.name,
          population: item.count,
          color: mood.color,
          legendFontColor: '#000',
          legendFontSize: 16
        };
      });
      setHumorData(formattedData);
    } catch (error) {
      console.error('Erro ao buscar dados de humor:', error);
      Alert.alert('Erro', 'Não foi possível carregar o relatório de humor.');
    }
  };

  useEffect(() => {
    // escolhe uma frase aleatória na primeira renderização
    const randomIndex = Math.floor(Math.random() * frases.length);
    setFrase(frases[randomIndex]);

    fetchHumorData();
    
    checkDailyRegistration(); 
  }, []);

  // função para registrar o humor no servidor
  const registrarHumor = async (moodType) => {
    if (hasRegisteredToday) {
      Alert.alert('Atenção', 'Você já registrou seu humor hoje. Volte amanhã!');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/mood/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, moodType }),
      });

      if (!response.ok) {
        if (response.status === 409) {
            const errorData = await response.json();
            Alert.alert('Atenção', errorData.message || 'Você já registrou seu humor hoje.');
            setHasRegisteredToday(true); 
            return;
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao salvar o humor.');
      }
      // após salvar, atualiza o estado e os dados
      Alert.alert('Sucesso!', 'Seu humor foi registrado com sucesso!');
      setHasRegisteredToday(true); 
      fetchHumorData();

    } catch (error) {
      console.error('Erro ao registrar humor:', error);
      Alert.alert('Erro', 'Não foi possível registrar seu humor.');
    }
  };

  const handleBack = () => {
    navigation.goBack();
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
          <View style={styles.header}>
            <TouchableOpacity
              onPress={handleBack}
              style={styles.backButton}
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            >
              <Image source={require('../assets/src/seta.png')} style={styles.backIcon} />
            </TouchableOpacity>

            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerText}>COMO VOCÊ ESTÁ SE SENTINDO?</Text>
            </View>
          </View>

          {/* emoções */}
          <View style={styles.emotionsContainer}>
            <TouchableOpacity 
              onPress={() => registrarHumor('estressado')} 
              style={[styles.emojiButton, hasRegisteredToday && styles.disabledButton]}
              disabled={hasRegisteredToday}
            >
              <Image source={require('../assets/src/raiva.png')} style={styles.emoji} />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => registrarHumor('magoado')} 
              style={[styles.emojiButton, hasRegisteredToday && styles.disabledButton]}
              disabled={hasRegisteredToday}
            >
              <Image source={require('../assets/src/triste.png')} style={styles.emoji} />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => registrarHumor('pensativo')} 
              style={[styles.emojiButton, hasRegisteredToday && styles.disabledButton]}
              disabled={hasRegisteredToday}
            >
              <Image source={require('../assets/src/media.png')} style={styles.emoji} />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => registrarHumor('bem')} 
              style={[styles.emojiButton, hasRegisteredToday && styles.disabledButton]}
              disabled={hasRegisteredToday}
            >
              <Image source={require('../assets/src/feliz.png')} style={styles.emoji} />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => registrarHumor('otimo')} 
              style={[styles.emojiButton, hasRegisteredToday && styles.disabledButton]}
              disabled={hasRegisteredToday}
            >
              <Image source={require('../assets/src/muitofeliz.png')} style={styles.emoji} />
            </TouchableOpacity>
          </View>
          {hasRegisteredToday && (
            <Text style={styles.dailyLimitMessage}>
              Seu humor já foi registrado hoje. Volte amanhã!
            </Text>
          )}
          <Image source={require('../assets/src/barra.png')} style={styles.barra} />
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

          {/* grafico do resumo semanal */}
          <View style={styles.resumoContainer}>
            <Text style={styles.resumoText}>RESUMO SEMANAL</Text>
            {humorData.length > 0 ? (
              <PieChart
                data={humorData}
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
            ) : (
              <Text style={styles.noDataText}>Nenhum dado de humor encontrado nesta semana.</Text>
            )}
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
    paddingBottom: 20,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
    paddingBottom: 5,
    width: '100%',
    paddingHorizontal: 10,
  },
  backButton: {
    position: 'absolute',
    left: 10,
    padding: 10,
    zIndex: 100,
  },
  backIcon: {
    width: 35,
    height: 35,
    tintColor: 'white',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 50,
  },
  headerText: {
    fontSize: screenWidth > 400 ? 25 : 22,
    fontFamily: 'Bree-Serif',
    fontWeight: 'bold',
    color: 'white',
    lineHeight: 28,
    includeFontPadding: false,
    textAlign: 'center',
  },
  emotionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 5,
    paddingHorizontal: 20,
    width: '100%',
    maxWidth: 400,
  },
  emojiButton: {
    padding: 8,
    borderRadius: 50,
  },
  emoji: {
    width: screenWidth > 400 ? 45 : 40,
    height: screenWidth > 400 ? 45 : 40,
  },
  disabledButton: {
    opacity: 0.4,
  },
  dailyLimitMessage: {
    textAlign: 'center',
    fontSize: screenWidth > 400 ? 16 : 14,
    color: '#e52b17',
    fontWeight: 'bold',
    marginBottom: 5,
    paddingHorizontal: 20,
  },
  barra: {
    width: '80%',
    height: 20,
    alignSelf: 'center',
    marginVertical: 10,
    maxWidth: 300,
  },
  postitContainer: {
    alignSelf: 'center',
    width: Math.min(screenWidth * 0.8, 320),
    height: Math.min(screenWidth * 0.8 * (230 / 320), 230),
    marginVertical: 10,
    transform: [{ rotate: '-3deg' }],
    marginBottom: -10,
    marginTop: -20,
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
    fontSize: screenWidth > 400 ? 18 : 16,
    fontFamily: 'Bree-Serif',
    textAlign: 'center',
    lineHeight: screenWidth > 400 ? 22 : 20,
    paddingHorizontal: 30,
    paddingVertical: 30,
  },
  resumoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.79)',
    borderRadius: 20,
    marginHorizontal: 15,
    padding: 15,
    alignItems: 'center',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    width: '90%',
    maxWidth: 400,
    minHeight: 180,
    justifyContent: 'center',
  },
  resumoText: {
    fontSize: screenWidth > 400 ? 22 : 20,
    fontFamily: 'Bree-Serif',
    fontWeight: 'bold',
    color: '#0c4793',
    marginBottom: 10,
    textAlign: 'center',
  },
  chartStyle: {
    marginVertical: 8,
  },
  noDataText: {
    textAlign: 'center',
    fontSize: screenWidth > 400 ? 16 : 14,
    color: '#555',
    paddingHorizontal: 10,
  }
});

export default RelatorioScreen;