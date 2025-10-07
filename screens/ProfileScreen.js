import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    TextInput,
    Alert,
    SafeAreaView,
    ScrollView,
    ActivityIndicator,
    Dimensions,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Obtém a largura e altura da tela para responsividade
const { width, height } = Dimensions.get('window');

// Define um tamanho base para a fonte que escala com a altura
const FONT_BASE_SIZE = height * 0.022; 
const CONTENT_MAX_WIDTH = 500; // Largura máxima para o bloco de conteúdo

// Adicione o seu IP aqui, o mesmo do arquivo server.js
const API_URL = 'http://172.30.32.1:3000'; // Substitua pelo seu IP

// Certifique-se de que os assets existem
const backArrowImage = require('../assets/src/seta.png');
const logoImage = require('../assets/src/logoimg.png'); 

const ProfileScreen = ({ navigation, route }) => {
    const { userId } = route.params;

    // Estados do usuário
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [userPhone, setUserPhone] = useState('');

    // Função para buscar os dados do perfil do servidor
    const fetchProfileData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/user/${userId}`);
            if (!response.ok) {
                throw new Error('Falha ao carregar os dados do perfil.');
            }
            const data = await response.json();

            setUserName(data.username);
            setUserEmail(data.email);
            setUserPhone(data.emergency_phone || ''); 
            setUserPassword(''); 
        } catch (error) {
            console.error('Erro ao buscar dados do perfil:', error);
            Alert.alert('Erro', 'Não foi possível carregar os dados do perfil.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfileData();
    }, [userId]);

    // Função para salvar alterações do perfil NO BANCO DE DADOS
    const handleSaveProfile = async () => {
        if (userEmail.trim() === '' || userName.trim() === '') {
            Alert.alert('Atenção', 'Nome e e-mail não podem ficar vazios.');
            return;
        }

        const updatedProfile = {
            username: userName,
            email: userEmail,
            password_hash: userPassword, 
            emergency_phone: userPhone,
        };

        if (userPassword === '') {
            delete updatedProfile.password_hash;
        }

        try {
            const response = await fetch(`${API_URL}/user/update/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedProfile),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Falha ao salvar as alterações.');
            }

            Alert.alert('Sucesso!', 'Perfil atualizado com sucesso!');
            fetchProfileData();
            setUserPassword(''); 
        } catch (error) {
            console.error('Erro ao salvar perfil:', error);
            Alert.alert('Erro', 'Não foi possível salvar as alterações. Tente novamente.');
        }
    };


    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0c4793" />
                <Text style={styles.loadingText}>Carregando perfil...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.gradientBackground}>
                <LinearGradient
                    colors={['#8ca9d2', '#e0f7fa']}
                    style={StyleSheet.absoluteFill}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                />
            </View>

            {/* O ScrollView encapsula tudo. FlexGrow: 1 e justifyContent: 'center' são a chave para a centralização vertical */}
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                
                {/* Cabeçalho (Não centralizado verticalmente, fixo no topo) */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Image source={backArrowImage} style={styles.backArrow} /> 
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>PERFIL</Text>

                    <View style={styles.logoContainer}>
                        <Image source={logoImage} style={styles.logo} />
                    </View>
                </View>

                {/* Conteúdo Principal do Perfil (Centralizado pelo ScrollContent) */}
                <View style={styles.profileContent}>
                    
                    {/* Nome do Usuário em Destaque */}
                    <Text style={styles.userNameDisplay}>
                        {userName ? userName.toUpperCase() : 'USUÁRIO SERENE'}
                    </Text>
                    
                    {/* Campos de Input */}
                    <View style={styles.inputGroup}>
                        
                        {/* Input NOME */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>NOME:</Text>
                            <TextInput
                                style={styles.input}
                                value={userName}
                                onChangeText={setUserName}
                                placeholder="Nome"
                                placeholderTextColor="#31356e" // Cor escura para placeholder
                            />
                        </View>

                        {/* Input EMAIL */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>ALTERAR EMAIL:</Text>
                            <TextInput
                                style={styles.input}
                                value={userEmail}
                                onChangeText={setUserEmail}
                                placeholder="E-mail"
                                placeholderTextColor="#31356e" 
                                keyboardType="email-address"
                            />
                        </View>

                        {/* Input SENHA */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>ALTERAR SENHA:</Text>
                            <TextInput
                                style={styles.input}
                                value={userPassword}
                                onChangeText={setUserPassword}
                                placeholder="Nova Senha"
                                placeholderTextColor="#31356e" 
                                secureTextEntry
                            />
                        </View>

                        {/* Input TELEFONE */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>TELEFONE DE EMERGÊNCIA:</Text>
                            <TextInput
                                style={styles.input}
                                value={userPhone}
                                onChangeText={setUserPhone}
                                placeholder="(00) 00000-0000"
                                placeholderTextColor="#31356e" 
                                keyboardType="phone-pad"
                            />
                        </View>
                    </View>

                    {/* Botão Salvar */}
                    <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
                        <Text style={styles.saveButtonText}>SALVAR ALTERAÇÕES</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f5',
    },
    loadingText: {
        marginTop: 10,
        fontSize: FONT_BASE_SIZE,
        color: '#0c4793',
        fontFamily: 'Bree-Serif',
    },
    gradientBackground: {
        ...StyleSheet.absoluteFillObject,
        zIndex: -1,
    },
    // *** ALTERAÇÃO CHAVE 1: Centraliza o conteúdo verticalmente ***
    scrollContent: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center', // Adicionado para centralização vertical
        paddingBottom: height * 0.05, // Adiciona padding para que a rolagem funcione se o conteúdo for grande
    },
    // --- Cabeçalho (Não deve ser centralizado verticalmente) ---
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingTop: height * 0.02,
        paddingHorizontal: width * 0.05,
        paddingBottom: height * 0.02,
        maxWidth: CONTENT_MAX_WIDTH + (width * 0.1), 
        // *** ALTERAÇÃO CHAVE 2: Define a posição absoluta ou fixa para manter o cabeçalho no topo,
        // mas isso conflita com ScrollView. A melhor solução é garantir que o ScrollView
        // comece logo após o header, mas aqui faremos ele ser o primeiro elemento do scroll
        // e usaremos a centralização no ScrollContent para o ProfileContent
        marginTop: height * 0.02, // Espaçamento para o topo
    },
    backButton: {
        width: height * 0.07,
        height: height * 0.07,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backArrow: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
        tintColor: '#fff', 
    },
    headerTitle: {
        fontSize: FONT_BASE_SIZE * 2.0,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        flex: 1,
        fontFamily: 'Bree-Serif',
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    logoContainer: {
        width: height * 0.07,
        height: height * 0.07,
    },
    logo: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
        tintColor: '#fff', 
    },
    // --- Conteúdo Principal (Centralizado e Limitado) ---
    profileContent: {
        width: width * 0.9, 
        maxWidth: CONTENT_MAX_WIDTH, 
        backgroundColor: 'rgba(255, 255, 255, 0.7)', // Aumentei a opacidade para maior clareza
        borderRadius: 20,
        padding: height * 0.04, // Aumentei o padding interno
        alignItems: 'center',
        // O ScrollContent agora lida com a centralização vertical
        // Removendo o marginTop/marginBottom fixos que conflitavam com a centralização
    },
    userNameDisplay: {
        fontSize: FONT_BASE_SIZE * 1.6, 
        fontWeight: 'bold',
        color: '#0c4793', 
        marginBottom: height * 0.04, // Aumentei a margem
        textAlign: 'center',
        fontFamily: 'Bree-Serif',
        textTransform: 'uppercase', 
    },
    inputGroup: {
        width: '100%',
    },
    inputContainer: {
        width: '100%',
        marginBottom: height * 0.025, // Aumenta o espaçamento entre os inputs
    },
    inputLabel: {
        fontSize: FONT_BASE_SIZE * 1.0,
        color: '#4c5e87',
        marginBottom: 5,
        fontFamily: 'Bree-Serif',
        fontWeight: 'bold',
    },
    // *** ALTERAÇÃO CHAVE 3: Estilo de Input com fundo #8d9cbc e texto #31356e ***
    input: {
        backgroundColor: '#8d9cbc', // Cor de fundo solicitada
        padding: height * 0.02,
        borderRadius: 10,
        fontSize: FONT_BASE_SIZE, 
        color: '#31356e', // Cor do texto mais escura
        textAlign: 'center',
        fontFamily: 'Bree-Serif',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    saveButton: {
        backgroundColor: '#0c4793', 
        padding: height * 0.02,
        borderRadius: 10,
        marginTop: height * 0.04, // Mais margem superior
        width: '100%',
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: FONT_BASE_SIZE * 1.1,
        fontWeight: 'bold',
        fontFamily: 'Bree-Serif',
        textTransform: 'uppercase',
    },
});

export default ProfileScreen;