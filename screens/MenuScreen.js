import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, SafeAreaView, Dimensions, ScrollView, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font'; 

const { width, height } = Dimensions.get('window');
const FONT_BASE_SIZE = height * 0.027;

const menuImage = require('../assets/src/circulomenu.png'); 

// função para estilizar bordas dos botões
const getButtonBorderStyles = (index, total) => {
    const radius = 0; 
    const styles = {};

    if (index < total - 1) {
        styles.borderBottomWidth = 1;
        styles.borderBottomColor = '#c1d4f2'; 
    }

    if (index === 0) {
        styles.borderTopLeftRadius = width * 0.04; 
        styles.borderTopRightRadius = width * 0.04;
    }
    
    if (index === total - 1) {
        styles.borderBottomLeftRadius = radius;
        styles.borderBottomRightRadius = radius;
    }
    
    return styles;
};

const MenuScreen = ({ navigation, route }) => {
    const [fontsLoaded] = useFonts({
        'Bree-Serif': require('../assets/fonts/BreeSerif-Regular.ttf'),
    });

    const { userId } = route.params || {};

    const menuItems = [
        { text: 'Acesse seu perfil', color: '#afcdf2', screen: 'Profile' },    
        { text: 'Diário emocional', color: '#96bef0', screen: 'Diario' },
        { text: 'Atividades recomendadas', color: '#7bb0ea', screen: 'Recomendacao' },
        { text: 'Relatório emocional', color: '#64a1e6', screen: 'Relatorio' }, 
        { text: 'SereneMind', color: '#5691de', screen: 'SereneMind' },                 
    ];

    const handlePress = (screenName) => {
        navigation.navigate(screenName, { userId });
    };

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
            <LinearGradient
                colors={['#a4c4ff', '#fefeff']} 
                style={StyleSheet.absoluteFill} 
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
            />
            
            <ScrollView 
                contentContainerStyle={styles.scrollContent} 
                style={styles.scrollView}
            >
                <View style={styles.contentContainer}>
                    
                    <View style={styles.headerContent}>
                        <Text style={styles.title}>SEJA BEM VINDO AO SERENE</Text>
                        <Image 
                            source={menuImage} 
                            style={[styles.menuImage, { width: imageSize, height: imageSize }]} 
                        />
                    </View>

                    {/* container dos botões do menu */}
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
    scrollContent: {
        flexGrow: 1, 
        justifyContent: 'space-between', 
    },
    contentContainer: {
        flex: 1,
        width: '100%', 
        overflow: 'hidden', 
    },
    headerContent: {
        paddingHorizontal: width * 0.05, 
        paddingTop: height * 0.05, 
        paddingBottom: height * 0.03,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontFamily: 'Bree-Serif', 
        fontSize: FONT_BASE_SIZE * 1.5,
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
    buttonText: {
        fontFamily: 'Bree-Serif', 
        color: '#fff',
        fontSize: FONT_BASE_SIZE * 1.1,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default MenuScreen;