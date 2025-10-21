import React, { useState, useEffect } from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Image, TextInput, Alert, SafeAreaView, ScrollView, ActivityIndicator, Dimensions,} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');
const FONT_BASE_SIZE = height * 0.022;
const CONTENT_MAX_WIDTH = 500;
const API_URL = 'http://172.27.160.1:3000';

const backArrowImage = require('../assets/src/seta.png');
const logoImage = require('../assets/src/logoimg.png');

const ProfileScreen = ({ navigation, route }) => {
    const { userId } = route.params;

    // estados para dados do usuário
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [userPhone, setUserPhone] = useState('');

    // busca dados do perfil
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

    // salva alterações do perfil
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

        // remove campo de senha se estiver vazio
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

    // tela de carregamento
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

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* cabeçalho com botão voltar e logo */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Image source={backArrowImage} style={styles.backArrow} />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>PERFIL</Text>

                    <View style={styles.logoContainer}>
                        <Image source={logoImage} style={styles.logo} />
                    </View>
                </View>

                {/* conteúdo principal do perfil */}
                <View style={styles.profileContent}>
                    <Text style={styles.userNameDisplay}>
                        {userName ? userName.toUpperCase() : 'USUÁRIO SERENE'}
                    </Text>
                    
                    {/* grupo de inputs do formulário */}
                    <View style={styles.inputGroup}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>NOME:</Text>
                            <TextInput
                                style={styles.input}
                                value={userName}
                                onChangeText={setUserName}
                                placeholder="Nome"
                                placeholderTextColor="#31356e"
                            />
                        </View>

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

                    {/* botão para salvar alterações */}
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
    // centraliza o conteúdo verticalmente
    scrollContent: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: height * 0.05,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingTop: height * 0.02,
        paddingHorizontal: width * 0.05,
        paddingBottom: height * 0.02,
        maxWidth: CONTENT_MAX_WIDTH + (width * 0.1),
        marginTop: height * 0.02,
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
    // container do conteúdo do perfil
    profileContent: {
        width: width * 0.9,
        maxWidth: CONTENT_MAX_WIDTH,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: 20,
        padding: height * 0.04,
        alignItems: 'center',
    },
    userNameDisplay: {
        fontSize: FONT_BASE_SIZE * 1.6,
        fontWeight: 'bold',
        color: '#0c4793',
        marginBottom: height * 0.04,
        textAlign: 'center',
        fontFamily: 'Bree-Serif',
        textTransform: 'uppercase',
    },
    inputGroup: {
        width: '100%',
    },
    inputContainer: {
        width: '100%',
        marginBottom: height * 0.025,
    },
    inputLabel: {
        fontSize: FONT_BASE_SIZE * 1.0,
        color: '#4c5e87',
        marginBottom: 5,
        fontFamily: 'Bree-Serif',
        fontWeight: 'bold',
    },
    // estilo dos inputs
    input: {
        backgroundColor: '#8d9cbc',
        padding: height * 0.02,
        borderRadius: 10,
        fontSize: FONT_BASE_SIZE,
        color: '#31356e',
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
        marginTop: height * 0.04,
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