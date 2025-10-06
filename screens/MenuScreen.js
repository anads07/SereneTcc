import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, SafeAreaView, Dimensions, ScrollView, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font'; 

// Obtém a largura e altura da tela para responsividade
const { width, height } = Dimensions.get('window');

// Define um tamanho base para a fonte que escala com a altura
// FONT_BASE_SIZE * 1.5 - Aumentamos o fator de escala para que a fonte cresça mais em telas grandes
const FONT_BASE_SIZE = height * 0.027; // Aumentado ligeiramente para um tamanho base maior

// imagem do menu principal
const menuImage = require('../assets/src/circulomenu.png'); 

// Função auxiliar para aplicar estilos de borda condicionalmente (MANTIDA)
const getButtonBorderStyles = (index, total) => {
    const radius = 0; 
    const styles = {};

    if (index < total - 1) {
        styles.borderBottomWidth = 1;
        styles.borderBottomColor = '#c1d4f2'; 
    }

    // Primeiro botão
    if (index === 0) {
        styles.borderTopLeftRadius = width * 0.04; 
        styles.borderTopRightRadius = width * 0.04;
    }
    // Último botão ("ChatBot")
    if (index === total - 1) {
        styles.borderBottomLeftRadius = radius;
        styles.borderBottomRightRadius = radius;
    }
    
    return styles;
};

const MenuScreen = ({ navigation, route }) => {
    // Carregamento da fonte
    const [fontsLoaded] = useFonts({
        'Bree-Serif': require('../assets/fonts/BreeSerif-Regular.ttf'),
    });

    const { userId } = route.params || {};

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

    if (!fontsLoaded) {
        return (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0c4793" />
          </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            
            {/* Fundo com Degradê */}
            <LinearGradient
                colors={['#a4c4ff', '#fefeff']} 
                style={StyleSheet.absoluteFill} 
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
            />
            
            {/* ScrollView: Permite a rolagem - Agora ele usa flex: 1 para crescer */}
            <ScrollView 
                contentContainerStyle={styles.scrollContent} 
                style={styles.scrollView}
            >
                
                {/* Container principal para centralizar o cabeçalho e posicionar os botões */}
                <View style={styles.contentContainer}>
                    
                    {/* Título e Imagem - Centralizados no topo */}
                    <View style={styles.headerContent}>
                        <Text style={styles.title}>SEJA BEM VINDO AO SERENE</Text>
                        <Image 
                            source={menuImage} 
                            style={[styles.menuImage, { width: imageSize, height: imageSize }]} 
                        />
                    </View>

                    {/* Bloco dos botões (empurrado para o final pelo marginTop: 'auto') */}
                    <View style={styles.buttonsWrapper}>
                        {menuItems.map((item, index) => {
                            const total = menuItems.length;

                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.buttonWrapper,
                                        { backgroundColor: item.color }, 
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
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'transparent', 
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    scrollView: {
        flex: 1,
    },
    // *** ALTERAÇÃO CHAVE 1: Usamos 'flex: 1' e 'justifyContent: space-between' ***
    scrollContent: {
        flexGrow: 1, 
        // Usamos 'space-between' para manter Header no topo e Botões no rodapé
        justifyContent: 'space-between', 
    },
    // *** ALTERAÇÃO CHAVE 2: Ocupa 100% da largura, mas com padding lateral APENAS no topo ***
    contentContainer: {
        flex: 1, // Permite que o 'space-between' no scrollContent funcione
        width: '100%', 
        overflow: 'hidden', 
    },
    headerContent: {
        paddingHorizontal: width * 0.05, 
        // *** ALTERAÇÃO CHAVE 3: Reduzimos o paddingBottom para evitar um grande vão em telas grandes ***
        paddingTop: height * 0.05, 
        paddingBottom: height * 0.03, // Novo valor para manter a proximidade
        alignItems: 'center',
        justifyContent: 'center',
    },
    // *** ALTERAÇÃO CHAVE 4: Aumentamos a escala do FONT_BASE_SIZE para que o texto do título cresça mais ***
    title: {
        fontFamily: 'Bree-Serif', 
        fontSize: FONT_BASE_SIZE * 1.5, // Fator 1.5 para crescer mais
        fontWeight: 'bold',
        color: '#31356e', 
        textTransform: 'uppercase',
        textAlign: 'center',
        marginBottom: height * 0.02, 
        marginHorizontal: 10,
    },
    menuImage: {
        resizeMode: 'contain',
    },
    // *** ALTERAÇÃO CHAVE 5: Adicionamos margin-top para o bloco de botões como fallback ***
    buttonsWrapper: {
        width: '100%', 
        borderTopLeftRadius: width * 0.04, 
        borderTopRightRadius: width * 0.04,
        overflow: 'hidden', 
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        // Usado para garantir que o bloco fique no final do contentContainer
        // Mesmo com 'space-between' no pai, é uma boa prática
        marginTop: 'auto', 
    },
    buttonWrapper: {
        width: '100%',
    },
    buttonContent: {
        paddingVertical: height * 0.025, 
        paddingHorizontal: 20,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    // *** ALTERAÇÃO CHAVE 6: Aumentamos a escala do FONT_BASE_SIZE para que o texto do botão cresça mais ***
    buttonText: {
        fontFamily: 'Bree-Serif', 
        color: '#fff',
        fontSize: FONT_BASE_SIZE * 1.1, // Fator 1.1 para crescer mais
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default MenuScreen;